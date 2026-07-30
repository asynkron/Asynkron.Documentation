import {useEffect, useState, type ReactNode} from 'react';
import {createPortal} from 'react-dom';
import {useLocation} from '@docusaurus/router';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDoc, useDocsSidebar} from '@docusaurus/plugin-content-docs/client';
import TOC from '@theme/TOC';

import {
  SIDEBAR_TOC_SLOT_ID,
  hasSidebarLinkEntry,
} from '@site/src/utils/sidebarTocSlot';
import styles from './styles.module.css';

/**
 * Renders the page's headings underneath the active entry in the left sidebar
 * when that entry is a leaf link, and in the usual right-hand column otherwise.
 *
 * The headings are only known here, inside <DocItem>, which is a sibling of the
 * sidebar rather than an ancestor — a portal is what connects the two trees.
 * Which branch to take is derived from sidebar data, not from the DOM, so it
 * matches what <DocItem/Layout> rendered on the server.
 */
export default function DocItemTOCDesktop(): ReactNode {
  const {toc, frontMatter} = useDoc();
  const sidebar = useDocsSidebar();
  const {pathname} = useLocation();
  const tocInSidebar = hasSidebarLinkEntry(sidebar?.items, pathname);
  const [slot, setSlot] = useState<HTMLElement | null>(null);

  // No dependency array on purpose: the slot element is replaced whenever the
  // sidebar re-renders, and re-reading it every render keeps this from holding
  // a detached node. React bails out when the element is unchanged.
  useEffect(() => {
    setSlot(
      tocInSidebar ? document.getElementById(SIDEBAR_TOC_SLOT_ID) : null,
    );
  });

  const tocElement = (
    <TOC
      toc={toc}
      minHeadingLevel={frontMatter.toc_min_heading_level}
      maxHeadingLevel={frontMatter.toc_max_heading_level}
      className={
        tocInSidebar
          ? `${ThemeClassNames.docs.docTocDesktop} ${styles.sidebarToc}`
          : ThemeClassNames.docs.docTocDesktop
      }
    />
  );

  if (!tocInSidebar) {
    return tocElement;
  }

  // Before hydration there is no slot yet, so the sidebar headings appear a
  // frame after first paint. Nothing is rendered in place meanwhile.
  return slot ? createPortal(tocElement, slot) : null;
}
