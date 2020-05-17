export default `
<div class="terms-index">
  <p>
    <b>Classes:</b>{{#classes}} | <a href="{{url}}">{{name}}</a>{{/classes}}
  </p>
  <p>
    <b>Object Properties:</b>{{#relations}} | <a href="{{url}}">{{name}}</a>{{/relations}}
  </p>
  <p>
    <b>Dataatype Properties:</b>{{#attributes}} | <a href="{{url}}">{{name}}</a>{{/attributes}}
  </p>
</div>
`;
