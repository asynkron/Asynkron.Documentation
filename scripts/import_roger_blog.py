#!/usr/bin/env python3
"""Import posts from rogerjohansson.blog into Docusaurus blog format."""

from __future__ import annotations

import argparse
import html
import json
import os
import re
import shutil
import subprocess
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, List, Optional
from urllib.error import HTTPError
from urllib.parse import quote, urlparse, urlsplit, urlunsplit, unquote
from urllib.request import Request, urlopen


BASE_API = "https://public-api.wordpress.com/wp/v2/sites/rogerjohansson.blog/posts"
USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36"
)
BLOG_ROOT = Path(__file__).resolve().parents[1] / "blog"


@dataclass
class PostData:
    raw: dict

    @property
    def slug(self) -> str:
        return self.raw.get("slug")

    @property
    def title_html(self) -> str:
        return self.raw.get("title", {}).get("rendered", "")

    @property
    def content_html(self) -> str:
        return self.raw.get("content", {}).get("rendered", "")

    @property
    def date_iso(self) -> str:
        return (self.raw.get("date") or "")[:10]

    @property
    def jetpack_featured_media_url(self) -> Optional[str]:
        url = self.raw.get("jetpack_featured_media_url")
        return url or None

    @property
    def tags(self) -> List[str]:
        tags: List[str] = []
        embedded = self.raw.get("_embedded", {})
        for term_group in embedded.get("wp:term", []):
            for term in term_group:
                if term.get("taxonomy") == "post_tag":
                    slug = term.get("slug")
                    if slug:
                        tags.append(slug)
        # Fallback to numeric tag ids if embed failed
        if not tags:
            tags = [str(tag_id) for tag_id in self.raw.get("tags", [])]
        return sorted(set(tags))


def fetch_json(url: str) -> object:
    for attempt in range(3):
        try:
            req = Request(url, headers={"User-Agent": USER_AGENT})
            with urlopen(req, timeout=60) as resp:
                data = resp.read()
            return json.loads(data.decode("utf-8"))
        except HTTPError as exc:
            if exc.code in {429, 502, 503} and attempt < 2:
                time.sleep(2 * (attempt + 1))
                continue
            raise
        except Exception:
            if attempt < 2:
                time.sleep(2 * (attempt + 1))
                continue
            raise

    raise RuntimeError(f"Failed to fetch {url}")


def fetch_all_posts(limit: Optional[int] = None) -> List[PostData]:
    posts: List[PostData] = []
    page = 1
    while True:
        url = f"{BASE_API}?per_page=100&page={page}&_embed"
        data = fetch_json(url)
        if isinstance(data, dict) and data.get("code"):
            # Out-of-range or error
            break
        if not isinstance(data, list) or not data:
            break
        for item in data:
            posts.append(PostData(item))
            if limit is not None and len(posts) >= limit:
                return posts
        if len(data) < 100:
            break
        page += 1
    return posts


def sanitize_filename(name: str, fallback: str) -> str:
    cleaned = unquote(name.split("?")[0])
    cleaned = cleaned.strip()
    if not cleaned:
        cleaned = fallback
    safe = re.sub(r"[^0-9A-Za-z._-]", "-", cleaned)
    if safe.startswith("."):
        safe = safe[1:]
    return safe or fallback


def normalize_url(url: str) -> str:
    url = url.strip()
    parts = urlsplit(url)
    path = quote(unquote(parts.path), safe="/%:@&=+$,.-~")
    query = quote(unquote(parts.query), safe="=&%:+,;@-._~")
    fragment = quote(unquote(parts.fragment), safe="-._~")
    return urlunsplit((parts.scheme, parts.netloc, path, query, fragment))


def download_binary(url: str, dest_path: Path) -> None:
    normalized = normalize_url(url)
    req = Request(normalized, headers={"User-Agent": USER_AGENT})
    with urlopen(req, timeout=60) as resp:
        data = resp.read()
    dest_path.write_bytes(data)


def rewrite_images(html_content: str, target_dir: Path) -> str:
    pattern = re.compile(r"<img[^>]+src=\"([^\"]+)\"[^>]*>", re.IGNORECASE)
    downloaded: Dict[str, str] = {}
    counter = 1

    def repl(match: re.Match) -> str:
        nonlocal counter
        raw_url = match.group(1)
        actual_url = html.unescape(raw_url)
        if actual_url not in downloaded:
            parsed = urlparse(actual_url)
            basename = sanitize_filename(os.path.basename(parsed.path), f"image-{counter}.png")
            dest = target_dir / basename
            if dest.exists():
                stem, ext = os.path.splitext(basename)
                idx = 1
                while dest.exists():
                    basename = f"{stem}-{idx}{ext}"
                    dest = target_dir / basename
                    idx += 1
            try:
                download_binary(actual_url, dest)
            except Exception as exc:  # noqa: BLE001
                sys.stderr.write(f"Warning: failed to download {actual_url}: {exc}\n")
                return match.group(0)
            downloaded[actual_url] = basename
            counter += 1
        local_name = downloaded[actual_url]
        tag = match.group(0)
        # Remove srcset/data attributes that point to remote resources
        tag = re.sub(r"\s+(srcset|data-[\w:-]+)=\"[^\"]*\"", "", tag)
        tag = tag.replace(raw_url, f"./{local_name}")
        return tag

    return pattern.sub(repl, html_content)


def html_to_markdown(html_content: str) -> str:
    proc = subprocess.run(
        [
            "pandoc",
            "-f",
            "html",
            "-t",
            "gfm",
            "--wrap=preserve",
        ],
        input=html_content.encode("utf-8"),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )
    if proc.returncode != 0:
        sys.stderr.write(proc.stderr.decode("utf-8", errors="ignore"))
        raise RuntimeError("pandoc failed")
    return proc.stdout.decode("utf-8")


def strip_title_markup(value: str) -> str:
    text = re.sub(r"<[^>]+>", "", value)
    text = html.unescape(text)
    return text.replace("\xa0", " ").strip()


def insert_truncate_marker(markdown: str) -> str:
    stripped = markdown.strip()
    if not stripped:
        return "\n"
    blocks = stripped.split("\n\n", 1)
    if len(blocks) == 2:
        body = f"{blocks[0]}\n\n<!-- truncate -->\n\n{blocks[1]}"
    else:
        body = f"{blocks[0]}\n\n<!-- truncate -->"
    return body.strip() + "\n"


def ensure_directory(path: Path) -> None:
    if path.exists():
        shutil.rmtree(path)
    path.mkdir(parents=True, exist_ok=True)


def write_post(post: PostData, out_dir: Path) -> None:
    ensure_directory(out_dir)

    content_html = post.content_html.replace("<!--more-->", "")
    content_html = rewrite_images(content_html, out_dir)

    markdown = html_to_markdown(content_html)
    markdown = insert_truncate_marker(markdown)

    title = strip_title_markup(post.title_html)
    slug = post.slug
    date_prefix = post.date_iso
    tags = post.tags

    fm_lines = ["---"]
    fm_lines.append(f"slug: {slug}")
    fm_lines.append(f"title: {json.dumps(title, ensure_ascii=False)}")
    fm_lines.append("authors: [rogerjohansson]")
    if tags:
        tag_items = ", ".join(json.dumps(tag, ensure_ascii=False) for tag in tags)
        fm_lines.append(f"tags: [{tag_items}]")
    else:
        fm_lines.append("tags: []")
    fm_lines.append("---\n")

    index_path = out_dir / "index.md"
    index_path.write_text("\n".join(fm_lines) + markdown, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--limit", type=int, help="Only import the first N posts")
    args = parser.parse_args()

    posts = fetch_all_posts(limit=args.limit)
    if not posts:
        print("No posts fetched", file=sys.stderr)
        sys.exit(1)

    for idx, post in enumerate(posts, 1):
        if not post.slug or not post.date_iso:
            continue
        folder_name = f"{post.date_iso}-{post.slug}"
        out_dir = BLOG_ROOT / folder_name
        print(f"[{idx}/{len(posts)}] {folder_name}")
        write_post(post, out_dir)


if __name__ == "__main__":
    main()
