import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const brandColors = {
  primary: '#00adf8',
  danger: '#c34423',
  warning: '#ffbf34',
  info: '#727f99',
  quote: '#fff2cc',
  surface: '#323f49',
  success: '#00cc66',
  noteText: '#373635',
  mutedText: '#404040',
  lightBorder: '#e0e0e0',
} as const;

const mermaidThemeCss = `
  g .comment .label-container {
    fill: var(--asynkron-color-quote);
    stroke: var(--asynkron-color-warning);
    stroke-width: 4px;
  }

  g .comment .label {
    color: ${brandColors.mutedText};
    font-family: 'trebuchet ms', verdana, arial !important;
    font-size: 15px;
    font-weight: bold;
  }

  g .message .label-container {
    fill: #ffffff;
    stroke: ${brandColors.lightBorder};
    stroke-width: 4px;
  }

  g .message .label {
    color: ${brandColors.mutedText};
  }

  g .gray .label-container {
    fill: var(--asynkron-color-info);
    stroke: var(--asynkron-color-surface);
    stroke-width: 3px;
  }

  g .red .label-container {
    fill: var(--asynkron-color-danger);
    stroke: var(--asynkron-color-surface);
    stroke-width: 3px;
  }

  g .yellow .label-container {
    fill: var(--asynkron-color-warning);
    stroke: var(--asynkron-color-surface);
    stroke-width: 3px;
  }

  g .green .label-container {
    fill: var(--asynkron-color-success);
    stroke: var(--asynkron-color-surface);
    stroke-width: 3px;
  }

  g .blue .label-container,
  g .light-blue .label-container {
    fill: var(--asynkron-color-primary);
    stroke: var(--asynkron-color-surface);
    stroke-width: 3px;
  }

  g .label-container {
    stroke: none;
    fill: var(--asynkron-color-primary);
  }

  g .label {
    color: #ffffff;
    font-family: 'trebuchet ms', verdana, arial !important;
    font-weight: bold;
    font-size: small;
  }

  g .actor,
  g rect.actor,
  g .actor > rect {
    stroke: none;
    fill: var(--asynkron-color-primary);
  }

  g text.actor {
    fill: #ffffff;
    stroke: none;
    font-family: 'trebuchet ms', verdana, arial !important;
    font-weight: bold;
  }

  g text.actor > tspan,
  g text.actor>tspan {
    fill: #ffffff !important;
  }

  g .edgePath .path {
    stroke-width: 4px;
    stroke: var(--asynkron-color-primary);
  }

  g .edgePath marker {
    stroke: var(--asynkron-color-primary);
    fill: var(--asynkron-color-primary);
  }

  g line {
    stroke-width: 2px !important;
    stroke: var(--asynkron-color-info) !important;
  }

  g line.loopLine {
    stroke-width: 2px !important;
    stroke: var(--asynkron-color-info) !important;
  }

  g [id^='flowchart-empty'],
  g [class*='LS-empty'],
  g [class*='LE-empty'],
  g [class*='LS-free'],
  g [class*='LE-free'] {
    display: none;
  }

  g .cluster rect {
    fill: var(--asynkron-color-primary);
    stroke: none;
  }

  g .cluster span {
    color: #ffffff;
  }

  g .messageText {
    fill: #ffffff;
    stroke: none;
    font-family: 'trebuchet ms', verdana, arial !important;
  }

  g .labelBox {
    stroke: none;
    fill: #ffffff;
  }

  g .labelText {
    fill: #000000;
    stroke: none;
    font-family: 'trebuchet ms', verdana, arial !important;
  }

  g .loopText > tspan,
  .loopText>tspan {
    fill: #ffffff !important;
    stroke: none !important;
    font-family: 'trebuchet ms', verdana, arial !important;
  }

  .messageText {
    fill: #ffffff !important;
    stroke: none !important;
    font-family: 'trebuchet ms', verdana, arial !important;
  }

  .messageLine0,
  g .messageLine0 {
    marker-end: url(#arrowhead) !important;
    stroke-width: 4px !important;
    stroke: var(--asynkron-color-primary) !important;
  }

  .messageLine1,
  g .messageLine1 {
    stroke-width: 1.5px !important;
    stroke-dasharray: 2 2 !important;
    stroke: var(--asynkron-color-primary) !important;
  }

  #arrowhead path,
  g [id^='arrowhead'] path {
    stroke: var(--asynkron-color-primary) !important;
    fill: var(--asynkron-color-primary) !important;
  }

  g .arrowheadPath {
    fill: var(--asynkron-color-primary);
    stroke: none;
  }

  g .note {
    fill: var(--asynkron-color-warning);
    stroke: none;
  }

  g .note > tspan {
    fill: ${brandColors.noteText};
  }

  g .selected .label-container {
    stroke: #ffffff !important;
    stroke-width: 4px !important;
  }

  g .marker {
    stroke-width: 4px !important;
    stroke: var(--asynkron-color-primary) !important;
    fill: var(--asynkron-color-primary) !important;
  }

  .root .nodes .node circle,
  .root .nodes .node rect {
    stroke: none;
    fill: var(--asynkron-color-primary);
  }

  .root .nodes .node .nodeLabel {
    color: #ffffff !important;
  }

  .root .flowchart-link {
    stroke-width: 4px !important;
    stroke: var(--asynkron-color-primary) !important;
  }

  .actor-line {
    stroke: var(--asynkron-color-info) !important;
  }

  .activation0 {
    fill: var(--asynkron-color-warning) !important;
    stroke: #000000 !important;
  }
`;

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
          primaryColor: brandColors.primary,
          primaryTextColor: '#ffffff',
          primaryBorderColor: brandColors.primary,
          primaryBorderColorDark: brandColors.primary,
          secondaryColor: brandColors.info,
          secondaryTextColor: '#ffffff',
          actorBkg: brandColors.primary,
          actorTextColor: '#ffffff',
          actorLineColor: brandColors.primary,
          activationBorderColor: '#000000',
          activationBkgColor: brandColors.warning,
          lineColor: brandColors.primary,
          signalTextColor: '#ffffff',
          signalColor: brandColors.primary,
          background: brandColors.surface,
          mainBkg: brandColors.surface,
          nodeBorder: brandColors.primary,
          clusterBkg: brandColors.primary,
          noteBkgColor: brandColors.warning,
          noteTextColor: brandColors.noteText,
          noteBorderColor: brandColors.warning,
          labelBoxBkgColor: '#ffffff',
          labelBoxBorderColor: brandColors.primary,
          labelTextColor: '#000000',
          sequenceNumberColor: brandColors.primary,
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
            { label: 'Get Started', to: '/docs/intro' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'GitHub Organization', href: 'https://github.com/AsynkronIT' },
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
