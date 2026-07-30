import type {PropSidebarItem} from '@docusaurus/plugin-content-docs';

/**
 * Id of the placeholder that the active sidebar entry renders, and that the
 * desktop table of contents portals itself into.
 *
 * Kept outside src/theme so the swizzled components can import it without going
 * through the @theme aliases, which only declare default exports.
 */
export const SIDEBAR_TOC_SLOT_ID = 'sidebar-toc-slot';

function normalize(path: string): string {
  const withoutHash = path.split('#')[0]!.split('?')[0]!;
  return withoutHash.length > 1 ? withoutHash.replace(/\/$/, '') : withoutHash;
}

/**
 * True when the current page is a plain `link` entry in the sidebar, which is
 * the only kind that renders a slot for the table of contents.
 *
 * Category entries are not ejected, so a page reached through a category link
 * (a section index, a bootcamp unit) has nowhere to portal to and keeps the
 * original right-hand column instead. Resolving this from sidebar data rather
 * than from the DOM keeps the decision identical on the server and the client,
 * so neither layout flashes on hydration.
 */
export function hasSidebarLinkEntry(
  items: PropSidebarItem[] | undefined,
  pathname: string,
): boolean {
  if (!items) {
    return false;
  }
  const target = normalize(pathname);
  return items.some((item) => {
    if (item.type === 'link') {
      return normalize(item.href) === target;
    }
    if (item.type === 'category') {
      return hasSidebarLinkEntry(item.items, pathname);
    }
    return false;
  });
}
