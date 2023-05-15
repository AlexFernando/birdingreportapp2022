const XLSX = require('xlsx');

function presenceCodesResults() {
    let workbook = XLSX.readFile(`${__dirname}/files/presencedata/presenceData.xlsx`);
    let sheet_name_list = workbook.SheetNames;

    // let myData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], { defval: "" })

    let ws = workbook.Sheets[sheet_name_list];
ws['!ref'] = "A3:V3466" // change the sheet range to A2:C3
// expecting only first 2 rows 
const data_1 = XLSX.utils.sheet_to_json( ws,{ defval: "" });

    return data_1;
}

module.exports = {
    presenceCodesResults
}