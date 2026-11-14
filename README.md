# Zakaria Adili — Offensive Security Portfolio

Personal cybersecurity portfolio documenting practical learning, authorized labs, technical writing, and security engineering projects.

## Featured project

**[NEXUS SENTINEL](https://github.com/zakadili/nexus-3d)** — an experimental cyber threat intelligence visualization project exploring public feeds, source provenance, and the distinction between observed and enriched signals.

## What's inside

- An Astro-powered personal website with an interactive terminal-inspired experience
- An archive of authorized Hack The Box lab write-ups
- A background and experience section
- Links to public projects and technical research

**OSCP status:** preparation in progress. This repository does not claim an OSCP certification.

## Local development

Requires a recent supported Node.js version.

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
npm run preview
```

## Deployment

The project includes a `wrangler.jsonc` configuration for Cloudflare Workers static assets. Build before deploying:

```bash
npm run build
npx wrangler deploy
```

Deployment requires Cloudflare credentials and appropriate account permissions.

## Responsible disclosure and write-ups

Only publish material from systems you own or are explicitly authorized to test. Respect lab platform rules, avoid sharing credentials or private data, and do not publish spoilers when disclosure is restricted.

## Links

- [GitHub profile](https://github.com/zakadili)
- [NEXUS SENTINEL source](https://github.com/zakadili/nexus-3d)

Built and maintained as a living learning portfolio.
