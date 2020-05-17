import * as CSS from 'csstype';

export type OntoUML2GUFODocTheme = {
  colors?: {
    background?: string;
    border?: string;
    title?: string;
    text?: string;
  };
  shape?: {
    borderRadius?: string;
  };
  typography?: {
    fontFamily?: string;
    fontSize?: string;
    mobileFontSize?: string;
  };
  overrides?: {
    [key in keyof HTMLElementTagNameMap]?: CSS.Properties;
  };
};

const theme: OntoUML2GUFODocTheme = {
  colors: {
    background: '#fff',
    border: '#ddd',
    title: '#005a9c',
    text: '#212121',
  },
  shape: {
    borderRadius: '5px',
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    fontSize: '10px',
    mobileFontSize: '8px',
  },
  overrides: {
    body: {
      fontSize: '1.6rem',
      lineHeight: '2.4rem',
      padding: '3.2rem',
    },
    h1: {
      fontSize: '3.6rem',
      margin: '3rem 0 4rem 0',
    },
    h2: {
      borderTop: '1px solid var(--borderColor)',
      fontSize: '3.2rem',
      margin: '7rem 0 3rem',
      padding: '1em 0 0 0',
    },
    h3: {
      fontSize: '2.4rem',
      margin: '5rem 0 1rem',
    },
    h4: {
      fontSize: '2rem',
      margin: '3rem 0 1rem',
    },
    h5: {
      fontSize: '1.6rem',
      margin: '2rem 0 1rem',
    },
    p: {
      fontSize: '1.6rem',
      margin: '0 0 1rem',
    },
    a: {
      fontSize: '1.6rem',
    },
  },
};

type OverrideStyles = {
  htmlTag: string;
  values: {
    cssVar: string;
    cssProperties: string[];
  }[];
}[];

export const generateOverrideStyles = (
  themeOverrides: OntoUML2GUFODocTheme['overrides'],
): OverrideStyles => {
  const styles = [];

  for (const tag of Object.keys(themeOverrides)) {
    const htmlTag = [];

    for (const cssProperty of Object.keys(themeOverrides[tag])) {
      const cssKey = cssProperty.replace(/([A-Z])/g, '-$1').toLowerCase();
      const value = themeOverrides[tag][cssProperty];
      const cssVar = `--${tag}_${cssProperty}`;

      htmlTag.push({
        cssVar: `${cssVar}: ${value};`,
        cssProperty: `${cssKey}: var(${cssVar});`,
      });
    }

    styles.push({
      htmlTag: tag,
      cssProperties: htmlTag,
    });
  }

  return styles;
};

export default theme;
