import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const sidebars: SidebarsConfig = {
  faktorialSidebar: [
    {type: 'link', label: '← Back to Docs', href: '/docs/intro'},
    'index',
  ],
};

export default sidebars;
