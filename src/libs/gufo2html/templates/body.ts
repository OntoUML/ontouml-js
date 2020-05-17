export default `
<body>
  <h1>{{title}}</h1>
  {{#description}}
    <p>{{this}}</p>
  {{/description}}
  <h2>Table of Contents</h2>
  <ol>
    <li><a href="#general_information">General Information</a></li>
    <li><a href="#terms_index">Alphabetical Index of Terms</a></li>
    <li><a href="#classes">Classes</a></li>
    <li><a href="#relations">Object Properties</a></li>
    <li><a href="#attributes">Datatype Properties</a></li>
  </ol>
  <h2 id="general_information">1. General Information</h2>
  {{> general_information}}
  <h2 id="terms_index">2. Alphabetical Index of Terms</h2>
  {{> terms_index}}
  <h2 id="classes">3. Classes</h2>
  {{> classes}}
  <h2 id="relations">4. Object Properties</h2>
  {{> relations}}
  <h2 id="attributes">5. Datatype Properties</h2>
  {{> attributes}}
</body>
`;
