export default `
<div class="attributes">
  {{#attributes}}
    <h3 id="{{name}}">{{name}}</h3>
    {{#if comment}}
    <p>{{comment}}</p>
    {{/if}}
    <div class="responsive-table">
      <table>
        <tbody>
          {{#if label}}
          <tr>
            <th>label:</th>
            <td>{{label}}</td>
          </tr>
          {{/if}}
          <tr>
            <th>identifier:</th>
            <td><a href="{{uri}}">{{uri}}</a></td>
          </tr>
          {{#if domain.name}}
          <tr>
            <th>domain:</th>
            <td>
              <a href="{{domain.url}}" target="{{domain.urlTarget}}">{{domain.prefixName}}</a>
            </td>
          </tr>
          {{/if}}
          {{#if range.name}}
          <tr>
            <th>range:</th>
            <td>
              <a href="{{range.url}}" target="{{range.urlTarget}}">{{range.prefixName}}</a>
            </td>
          </tr>
          {{/if}}
        </tbody>
      </table>
    </div>
  {{/attributes}}
</div>
`;
