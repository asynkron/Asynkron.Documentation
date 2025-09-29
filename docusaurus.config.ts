import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Asynkron Documentation',
  tagline: 'Guides and references for the Asynkron ecosystem.',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://asynkron.se',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'AsynkronIT', // Usually your GitHub org/user name.
  projectName: 'Asynkron.Documentation', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/AsynkronIT/Asynkron.Documentation/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/AsynkronIT/Asynkron.Documentation/tree/main/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],

  markdown: {
    mermaid: true,
  },

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Asynkron Docs',
      logo: {
        alt: 'Asynkron logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/AsynkronIT/Asynkron.Documentation',
          label: 'GitHub',
          position: 'right',
        },
        {
          type: 'html',
          position: 'right',
          value: `
            <a class="navbar__item navbar__link navbar-logo-link" href="https://asynkron.se" target="_blank" rel="noopener noreferrer">
              <img src="/img/asynkron.png" alt="Asynkron" class="navbar-logo" />
            </a>
          `,
        },
        {
          type: 'html',
          position: 'right',
          value: `
            <a class="navbar__item navbar__link navbar-logo-link" href="https://proto.actor" target="_blank" rel="noopener noreferrer">
              <img src="/img/protoactor.png" alt="Proto.Actor" class="navbar-logo" />
            </a>
          `,
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'Get Started', to: '/docs/intro'},
          ],
        },
        {
          title: 'Community',
          items: [
            {label: 'GitHub Organization', href: 'https://github.com/AsynkronIT'},
            {
              label: 'Proto.Actor Project',
              href: 'https://proto.actor',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/AsynkronIT/Asynkron.Documentation',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Asynkron. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['csharp', 'bash', 'shell-session', 'markup-templating', 'handlebars'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
