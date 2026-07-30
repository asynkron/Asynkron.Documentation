/**
 * Id of the placeholder that the current page's sidebar entry renders, and that
 * the desktop table of contents portals itself into.
 *
 * Both DocSidebarItem/Link and DocSidebarItem/Category render it, so every page
 * that appears in a sidebar hosts its own headings. There is deliberately no
 * path matching here: an earlier version compared the location against sidebar
 * hrefs to decide where the table of contents should go, disagreed with the
 * theme on URLs that differ only by case, and moved the table of contents
 * between columns. The slot's presence is now the single source of truth.
 *
 * Kept outside src/theme so the swizzled components can import it without going
 * through the @theme aliases, which only declare default exports.
 */
export const SIDEBAR_TOC_SLOT_ID = 'sidebar-toc-slot';
