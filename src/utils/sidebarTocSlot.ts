import type {PropSidebarItem} from '@docusaurus/plugin-content-docs';
import {isActiveSidebarItem} from '@docusaurus/plugin-content-docs/client';

/**
 * Id of the placeholder that the active sidebar entry renders, and that the
 * desktop table of contents portals itself into.
 *
 * Kept outside src/theme so the swizzled components can import it without going
 * through the @theme aliases, which only declare default exports.
 */
export const SIDEBAR_TOC_SLOT_ID = 'sidebar-toc-slot';

/**
 * True when the current page is a plain `link` entry in the sidebar, which is
 * the only kind that renders a slot for the table of contents.
 *
 * Uses the theme's own `isActiveSidebarItem` rather than comparing paths here,
 * so this can never disagree with DocSidebarItem/Link about which entry is
 * active. A hand-rolled comparison did disagree: the theme's isSamePath
 * lowercases, so a request for /protoactor/books/ still activated the
 * /ProtoActor/books entry and rendered a slot, while the local comparison saw
 * no match and kept the right-hand column. The table of contents then jumped
 * into the sidebar on the next client-side navigation.
 *
 * Categories are recursed into but never matched themselves: a category counts
 * as active when a descendant is, and its own link does not render a slot, so
 * pages reached through one keep the right-hand column.
 */
export function hasSidebarLinkEntry(
  items: PropSidebarItem[] | undefined,
  activePath: string,
): boolean {
  if (!items) {
    return false;
  }
  return items.some((item) => {
    if (item.type === 'link') {
      return isActiveSidebarItem(item, activePath);
    }
    if (item.type === 'category') {
      return hasSidebarLinkEntry(item.items, activePath);
    }
    return false;
  });
}
