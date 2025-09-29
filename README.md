# Asynkron Documentation

This repository hosts the [Docusaurus](https://docusaurus.io/) configuration and content used to publish the official Asynkron documentation site.

## Prerequisites

- Node.js 20 or newer (the project follows the Docusaurus v3 requirements).

## Installation

Install the project dependencies once after cloning the repository:

```bash
npm install
```

## Local Development

```bash
npm run start
```

This starts the hot-reloading development server at <http://localhost:3000>. Updating Markdown, MDX, or React files refreshes the browser automatically so you can iterate quickly.

## Build

```bash
npm run build
```

The build command emits the static production site into the `build/` directory. You can deploy the generated assets to any static host.

## Deployment

The project keeps the default Docusaurus GitHub Pages workflow. After setting the `organizationName` and `projectName` values in `docusaurus.config.ts`, you can deploy with:

```bash
npm run deploy
```

The script builds the site and publishes it to the `gh-pages` branch of the configured GitHub repository.
