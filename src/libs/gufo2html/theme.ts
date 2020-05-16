type OverrideStyle = {
  fontFamily?: string;
  fontSize?: string;
  lineHeight?: string;
  margin?: string;
  padding?: string;
};

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
    body?: OverrideStyle;
    h1?: OverrideStyle;
    h2?: OverrideStyle;
    h3?: OverrideStyle;
    h4?: OverrideStyle;
    h5?: OverrideStyle;
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
      margin: '3rem 0 2rem 0',
    },
    h2: {
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
  },
};

export default theme;
