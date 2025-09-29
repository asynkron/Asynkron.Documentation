import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import protoPrismTheme from './prismProtoTheme';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const mermaidThemeCss = readFileSync(
  join(__dirname, 'scripts', 'mermaid-theme.css'),
  'utf8',
);

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
  organizationName: 'Asynkron', // Usually your GitHub org/user name.
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
          editUrl: 'https://github.com/Asynkron/Asynkron.Documentation/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/Asynkron/Asynkron.Documentation/tree/main/',
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
    mermaid: {
      theme: {
        light: 'default',
        dark: 'default',
      },
      options: {
        securityLevel: 'loose',
        flowchart: {
          curve: 'basis',
        },
        fontFamily: "'trebuchet ms', verdana, arial",
        themeCSS: mermaidThemeCss,
        themeVariables: {
          fontFamily: "'trebuchet ms', verdana, arial",
          primaryColor: '#323f49',
          primaryTextColor: '#ffffff',
          primaryBorderColor: '#007cb4',
          primaryBorderColorDark: '#007cb4',
          secondaryColor: '#007cb4',
          secondaryTextColor: '#ffffff',
          actorBkg: '#007cb4',
          actorTextColor: '#ffffff',
          actorLineColor: '#007cb4',
          activationBorderColor: '#000000',
          activationBkgColor: '#ffc107',
          lineColor: '#00ff00',
          signalTextColor: '#ffffff',
          signalColor: '#00ff00',
          background: '#232c34',
          mainBkg: '#232c34',
          nodeBorder: '#007cb4',
          clusterBkg: '#00b3f6',
          noteBkgColor: '#ffbb00',
          noteTextColor: '#373635',
          noteBorderColor: '#ffbb00',
          labelBoxBkgColor: '#ffffff',
          labelBoxBorderColor: '#00ff00',
          labelTextColor: '#000000',
          sequenceNumberColor: '#00ff00',
        },
      },
    },
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Asynkron Docs',
      logo: {
        alt: 'Asynkron logo',
        src: 'img/asynkron-a.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        { to: '/blog', label: 'Blog', position: 'left' },
        {
          href: 'https://github.com/Asynkron/Asynkron.Documentation',
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
              <img src="/img/protoactor.png" alt="Proto.Actor" class="navbar-logo navbar-logo--proto" />
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
            { label: 'Get Started', to: '/docs/intro' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'GitHub Organization', href: 'https://github.com/Asynkron' },
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
              href: 'https://github.com/Asynkron/Asynkron.Documentation',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Asynkron. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: protoPrismTheme,
      additionalLanguages: ['csharp', 'bash', 'shell-session', 'markup-templating', 'handlebars'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
