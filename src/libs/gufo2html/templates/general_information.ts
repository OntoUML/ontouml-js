export default `
<div class="general-information">
  <h3>Namespace</h3>
  <p>
    <a href="{{namespace}}">{{namespace}}</a>
  </p>
  <h3>Prefixes</h3>
  <table class="prefix-table">
    <tbody>
      {{#prefixList}}
      <tr>
        <th>{{prefix}}</th>
        <td><a href="{{uri}}" target="_blank">{{uri}}</a></td>
      </tr>
      {{/prefixList}}
    </tbody>
  </table>
</div>
`;
