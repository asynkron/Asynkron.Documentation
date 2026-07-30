import {useEffect, useState, type ReactNode} from 'react';
import {createPortal} from 'react-dom';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import TOC from '@theme/TOC';

import {SIDEBAR_TOC_SLOT_ID} from '@site/src/utils/sidebarTocSlot';
import styles from './styles.module.css';

/**
 * Renders the page's headings underneath its own entry in the left sidebar.
 * There is no right-hand column any more.
 *
 * The headings are only known here, inside <DocItem>, which is a sibling of the
 * sidebar rather than an ancestor — a portal is what connects the two trees.
 */
export default function DocItemTOCDesktop(): ReactNode {
  const {toc, frontMatter} = useDoc();
  const [slot, setSlot] = useState<HTMLElement | null>(null);

  // No dependency array on purpose: the slot element is replaced whenever the
  // sidebar re-renders, and re-reading it every render keeps this from holding
  // a detached node. React bails out when the element is unchanged.
  useEffect(() => {
    setSlot(document.getElementById(SIDEBAR_TOC_SLOT_ID));
  });

  // Before hydration there is no slot yet, so the sidebar headings appear a
  // frame after first paint.
  if (!slot) {
    return null;
  }

  return createPortal(
    <TOC
      toc={toc}
      minHeadingLevel={frontMatter.toc_min_heading_level}
      maxHeadingLevel={frontMatter.toc_max_heading_level}
      className={`${ThemeClassNames.docs.docTocDesktop} ${styles.sidebarToc}`}
    />,
    slot,
  );
}
