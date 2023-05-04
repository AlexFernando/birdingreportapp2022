const XLSX = require('xlsx');

function codigoPaisesResults() {
    let workbook = XLSX.readFile(`${__dirname}/./codigo_paises.xlsx`);
    let sheet_name_list = workbook.SheetNames;
    let myData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], { defval: "" })

    return myData;
}

module.exports = {
    codigoPaisesResults
}