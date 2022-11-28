
class HTMLController {
    constructor() {

    }

    genDecodeHTML_row(title,data) {
        let result = ``;
  
        result += `
        <tr>
          <td class="compareTable__title"> ${title} </td>`;
  
        data.forEach(el => {
          result += `<td class="compareTable__element"> ${el} </td>`;
        })
  
        result += `</tr>`
  
        return result
      }
}