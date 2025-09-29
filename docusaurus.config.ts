import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import protoPrismTheme from './prismProtoTheme';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const mermaidThemeCss = `
  g .comment .label-container {
    fill: #fff2cc;
    stroke: #d6b656;
    stroke-width: 4px;
  }

  g .comment .label {
    color: #404040;
    font-family: 'trebuchet ms', verdana, arial !important;
    font-size: 15px;
    font-weight: bold;
  }

  g .message .label-container {
    fill: #ffffff;
    stroke: #e0e0e0;
    stroke-width: 4px;
  }

  g .message .label {
    color: #404040;
  }

  g .gray .label-container {
    fill: #727f99;
    stroke: #323f49;
    stroke-width: 3px;
  }

  g .red .label-container {
    fill: #c34423;
    stroke: #323f49;
    stroke-width: 3px;
  }

  g .yellow .label-container {
    fill: #ffbf34;
    stroke: #323f49;
    stroke-width: 3px;
  }

  g .green .label-container {
    fill: #00cc66;
    stroke: #323f49;
    stroke-width: 3px;
  }

  g .blue .label-container {
    fill: #007cb4;
    stroke: #323f49;
    stroke-width: 3px;
  }

  g .light-blue .label-container {
    fill: #00adf8;
    stroke: #323f49;
    stroke-width: 3px;
  }

  g .label-container {
    stroke: none;
    fill: #007cb4;
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
    fill: #007cb4;
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
    stroke: #00ff00;
  }

  g .edgePath marker {
    stroke: #00ff00;
    fill: #00ff00;
  }

  g line {
    stroke-width: 2px !important;
    stroke: #a0a0a0 !important;
  }

  g line.loopLine {
    stroke-width: 2px !important;
    stroke: #a0a0a0 !important;
  }

  g [id^='flowchart-empty'],
  g [class*='LS-empty'],
  g [class*='LE-empty'],
  g [class*='LS-free'],
  g [class*='LE-free'] {
    display: none;
  }

  g .cluster rect {
    fill: #00b3f6;
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
    stroke: #00ff00 !important;
  }

  .messageLine1,
  g .messageLine1 {
    stroke-width: 1.5px !important;
    stroke-dasharray: 2 2 !important;
    stroke: #00ff00 !important;
  }

  #arrowhead path,
  g [id^='arrowhead'] path {
    stroke: #00ff00 !important;
    fill: #00ff00 !important;
  }

  g .arrowheadPath {
    fill: #00ff00;
    stroke: none;
  }

  g .note {
    fill: #ffbb00;
    stroke: none;
  }

  g .note > tspan {
    fill: #373635;
  }

  g .selected .label-container {
    stroke: #ffffff !important;
    stroke-width: 4px !important;
  }

  g .marker {
    stroke-width: 4px !important;
    stroke: #00ff00 !important;
    fill: #00ff00 !important;
  }

  .root .nodes .node circle,
  .root .nodes .node rect {
    stroke: none;
    fill: #007cb4;
  }

  .root .nodes .node .nodeLabel {
    color: #ffffff !important;
  }

  .root .flowchart-link {
    stroke-width: 4px !important;
    stroke: #00ff00 !important;
  }

  .actor-line {
    stroke: grey !important;
  }

  .activation0 {
    fill: #ffc107 !important;
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
      darkTheme: protoPrismTheme,
      additionalLanguages: ['csharp', 'bash', 'shell-session', 'markup-templating', 'handlebars'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
