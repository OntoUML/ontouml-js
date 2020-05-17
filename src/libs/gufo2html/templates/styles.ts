export default `
<style>
  :root {
    /* === COLORS === */
    --backgroundColor: {{theme.colors.background}};
    --borderColor: {{theme.colors.border}};
    --titleColor: {{theme.colors.title}};
    --textColor: {{theme.colors.text}};
    
    /* === SHAPE === */
    --borderRadius: {{theme.shape.borderRadius}};
    
    /* === TYPOGRAPHY === */
    --fontFamily: {{theme.typography.fontFamily}};
    --fontSize: {{theme.typography.fontSize}};
    --mobileFontSize: {{theme.typography.mobileFontSize}};
    
    /* === OVERRIDES === */

    {{#styles}}
    {{#cssProperties}}
    {{cssVar}}
    {{/cssProperties}}
    
    {{/styles}}
  }

  html {
    font-size: var(--fontSize);
    overflow-x: hidden;
  }

  body {
    color: var(--textColor);
    font-family: var(--fontFamily);
    font-size: var(--bodyFontSize);
    line-height: var(--bodyLineHeight);
    margin: var(--bodyMargin);
    padding: var(--bodyPadding);
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, p, a {
    margin-block-start: 0;
    margin-block-end: 0;
    margin-inline-start: 0;
    margin-inline-end: 0;
    padding-block-start: 0;
    padding-block-end: 0;
    padding-inline-start: 0;
    padding-inline-end: 0;
  }

  h1, h2, h3, h4, h5 {
    color: var(--titleColor);
  }

  {{#styles}}
  {{htmlTag}} {
    {{#cssProperties}}
    {{cssProperty}}
    {{/cssProperties}}
  }

  {{/styles}}

  @media screen and (max-width: 768px) {
    html {
      font-size: var(--mobileFontSize);
    }

    body {
      padding: 1.6rem;
    }
  }

  /* === TERMS INDEX === */

  .terms-index {
    border-radius: var(--borderRadius);
    border: 1px solid var(--borderColor);
    padding: 2rem;
    overflow-x: auto;
  }

  .responsive-table {
    overflow-x: auto;
  }
  
</style>
`;
