export default `
<div class="classes">
  {{#classes}}
    <h3 id="{{name}}">{{name}}</h3>
    {{#if comment}}
    <p>{{comment}}</p>
    {{/if}}
    <div class="responsive-table">
      <table>
        <tbody>
          <tr>
            <th>label:</th>
            <td>{{label}}</td>
          </tr>
          <tr>
            <th>identifier:</th>
            <td><a href="{{uri}}">{{uri}}</a></td>
          </tr>
          {{#compare stereotypes.length '>' 0}}
          <tr>
            <th>stereotype:</th>
            <td>
              {{#stereotypes}}<a href="{{url}}" target="{{urlTarget}}">{{prefixName}}</a> {{/stereotypes}}
            </td>
          </tr>
          {{/compare}}
          {{#compare supertypes.length '>' 0}}
          <tr>
            <th>supertypes:</th>
            <td>
              {{#supertypes}}<a href="{{url}}" target="{{urlTarget}}">{{prefixName}}</a> {{/supertypes}}
            </td>
          </tr>
          {{/compare}}
          {{#compare subtypes.length '>' 0}}
          <tr>
            <th>subtypes:</th>
            <td>
              {{#subtypes}}<a href="{{url}}" target="{{urlTarget}}">{{prefixName}}</a> {{/subtypes}}
            </td>
          </tr>
          {{/compare}}
          {{#compare isDomainOf.length '>' 0}}
          <tr>
            <th>in domain of:</th>
            <td>
              {{#isDomainOf}}<a href="{{url}}" target="{{urlTarget}}">{{prefixName}}</a> {{/isDomainOf}}
            </td>
          </tr>
          {{/compare}}
          {{#compare isRangeOf.length '>' 0}}
          <tr>
            <th>in range of:</th>
            <td>
              {{#isRangeOf}}<a href="{{url}}" target="{{urlTarget}}">{{prefixName}}</a> {{/isRangeOf}}
            </td>
          </tr>
          {{/compare}}
        </tbody>
      </table>
    </div>
  {{/classes}}
</div>
`;
