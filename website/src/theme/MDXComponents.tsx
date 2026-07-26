import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';

// Shiki (via the rehype plugin in docusaurus.config.ts) highlights every code
// block to HTML at build time — including Twoslash type-on-hover markup. By
// default Docusaurus then re-processes those <pre>/<code> elements through its
// own Prism-based CodeBlock component, which double-wraps them and destroys the
// Twoslash hover popups on client hydration.
//
// These overrides let already-highlighted blocks render natively. Inline code
// (whose children are plain strings) still goes through Docusaurus's component,
// so `inline code` keeps its normal styling.

const OriginalCode = MDXComponents.code;

function childrenAreAllStrings(children: React.ReactNode): boolean {
  return React.Children.toArray(children).every(c => typeof c === 'string');
}

export default {
  ...MDXComponents,
  // Shiki emits <pre class="shiki ...">; render it (and Twoslash's inner
  // <pre class="twoslash-popup-code">) as-is.
  pre: (props: React.ComponentProps<'pre'>) => <pre {...props} />,
  // Block code from Shiki has element children (highlighted spans) -> render
  // natively. Inline code has string children -> keep Docusaurus's component.
  code: (props: React.ComponentProps<'code'>) =>
    childrenAreAllStrings(props.children) ? (
      <OriginalCode {...props} />
    ) : (
      <code {...props} />
    )
};
