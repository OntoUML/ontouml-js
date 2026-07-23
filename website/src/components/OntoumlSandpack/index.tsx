import React from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';
import { useColorMode } from '@docusaurus/theme-common';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { ontoumlBundleCode, ontoumlVersion } from './ontouml-bundle.generated';

/**
 * The library is NOT installed from npm: `scripts/bundle-ontouml.mjs` (run by
 * the website's `prestart`/`prebuild` hooks) bundles the local `../src` into a
 * single browser-safe file, which is injected into every sandbox as
 * `/node_modules/ontouml-js/`. Sandpack resolves sandbox-local node_modules
 * before fetching from the registry, so the playground always runs the exact
 * API version the docs are written against — even though it isn't published.
 *
 * (Fetching from npm would also crash: the published 0.5.0 pulls in
 * `readable-stream@4`, whose top-level `const process` collides with the
 * `process` shim Sandpack injects into every module.)
 */
const ontoumlJsFiles = {
  '/node_modules/ontouml-js/package.json': {
    code: JSON.stringify(
      { name: 'ontouml-js', version: ontoumlVersion, main: './index.js' },
      null,
      2
    ),
    hidden: true
  },
  '/node_modules/ontouml-js/index.js': {
    code: ontoumlBundleCode,
    hidden: true
  }
};

type OntoumlSandpackProps = {
  /** Map of file path -> contents. `/index.ts` is the entry point. */
  files: Record<string, string>;
  /** Extra npm dependencies beyond ontouml-js, as name -> version range. */
  dependencies?: Record<string, string>;
  /** Show the editor read-only (e.g. for a worked solution). */
  readOnly?: boolean;
};

/**
 * A live, editable TypeScript playground preloaded with `ontouml-js`.
 *
 * Use it at the "now you try it" points in a chapter: give the reader a
 * partial model to complete, and enable the console so they see the serialized
 * JSON output update live. Solutions can be wrapped in a collapsed <details>.
 */
export default function OntoumlSandpack({
  files,
  dependencies = {},
  readOnly = false
}: OntoumlSandpackProps): React.ReactElement {
  return (
    <BrowserOnly fallback={<div>Loading playground…</div>}>
      {() => {
        // useColorMode must run inside the client-only render tree.
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { colorMode } = useColorMode();
        return (
          <Sandpack
            template="vanilla-ts"
            theme={colorMode === 'dark' ? 'dark' : 'light'}
            files={{ ...ontoumlJsFiles, ...files }}
            customSetup={{ dependencies }}
            options={{
              showConsole: true,
              showConsoleButton: true,
              showLineNumbers: true,
              editorHeight: 420,
              readOnly
            }}
          />
        );
      }}
    </BrowserOnly>
  );
}
