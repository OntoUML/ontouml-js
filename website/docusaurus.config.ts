import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import rehypeShiki from '@shikijs/rehype';
import { transformerTwoslash, rendererRich } from '@shikijs/twoslash';

// The library's TSDoc comments use `{@link Foo}` tags. TypeScript passes these
// through verbatim into hover documentation, where they'd render as raw
// `{@link BinaryRelation}` text. Rewrite them to their display text:
// `{@link Foo}` -> `Foo`, and `{@link Foo | some label}` -> `some label`.
const stripJsdocLinks = (docs: string): string =>
  docs.replace(/\{@link\s+([^}]+)\}/g, (_match, content: string) => {
    const [target, label] = content.split('|');
    return (label ?? target).trim();
  });

// `processHoverDocs` (below) only cleans a symbol's main description; `{@link}`
// tags inside @param/@throws/@returns text slip through. This rehype pass runs
// after Shiki and rewrites any leftover `{@link}` in text nodes, catching every
// case uniformly.
function rehypeStripJsdocLinks() {
  const walk = (node: any) => {
    if (node.type === 'text' && node.value?.includes('{@link')) {
      node.value = stripJsdocLinks(node.value);
    }
    node.children?.forEach(walk);
  };
  return (tree: any) => walk(tree);
}

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Shiki + Twoslash renders code blocks at build time and type-checks any block
// tagged ```ts twoslash against the real ontouml-js types (resolved from the
// local workspace link in package.json). A type error fails the build.
const rehypeShikiPlugin = [
  rehypeShiki,
  {
    themes: { light: 'github-light', dark: 'github-dark' },
    // Only type-check blocks explicitly tagged `twoslash`; plain ```ts blocks
    // are highlighted but not compiled.
    transformers: [
      transformerTwoslash({
        explicitTrigger: true,
        renderer: rendererRich({ processHoverDocs: stripJsdocLinks }),
        twoslashOptions: {
          compilerOptions: {
            // Node resolution so `import ... from 'ontouml-js'` finds the
            // workspace-linked package's .d.ts (its package.json has a `types`
            // field). `lib` is intentionally left unset: TypeScript then
            // includes the default libs (DOM + ESNext arrays), so `console`,
            // `JSON`, and `[].length` all resolve.
            target: 99 /* ESNext */,
            moduleResolution: 2 /* Node */,
            strict: false,
            skipLibCheck: true
          }
        }
      })
    ]
  }
];

const config: Config = {
  title: 'ontouml-js',
  tagline: 'Learn to build OntoUML models programmatically',
  favicon: 'img/favicon.ico',

  future: {
    v4: true
  },

  // --- Option A: GitHub Pages project site --------------------------------
  // Served at https://ontouml.github.io/ontouml-js/
  // Switching to a custom subdomain later = change these two lines (+ CNAME).
  url: 'https://ontouml.github.io',
  baseUrl: '/ontouml-js/',
  organizationName: 'OntoUML',
  projectName: 'ontouml-js',
  // ------------------------------------------------------------------------

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn'
    }
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en']
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/', // the tutorial IS the site; docs at root
          editUrl: 'https://github.com/OntoUML/ontouml-js/tree/main/website/',
          rehypePlugins: [rehypeShikiPlugin, rehypeStripJsdocLinks]
        },
        blog: false,
        theme: {
          customCss: [
            require.resolve('@shikijs/twoslash/style-rich.css'),
            './src/css/custom.css'
          ]
        }
      } satisfies Preset.Options
    ]
  ],

  themeConfig: {
    // TODO(branding): replace with an OntoUML social card + logo/favicon.
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true
    },
    navbar: {
      title: 'ontouml-js',
      logo: {
        alt: 'OntoUML',
        src: 'img/logo.svg'
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Tutorial'
        },
        {
          href: 'https://github.com/OntoUML/ontouml-js',
          label: 'GitHub',
          position: 'right'
        }
      ]
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Tutorial',
          items: [
            { label: 'Introduction', to: '/' },
            { label: 'Getting started', to: '/getting-started/hello-model' }
          ]
        },
        {
          title: 'OntoUML',
          items: [
            { label: 'OntoUML.org', href: 'https://ontouml.org' },
            {
              label: 'ontouml-js on GitHub',
              href: 'https://github.com/OntoUML/ontouml-js'
            }
          ]
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} OntoUML. Built with Docusaurus.`
    },
    // Prism is only a fallback; Shiki (above) handles rendering at build time.
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula
    }
  } satisfies Preset.ThemeConfig
};

export default config;
