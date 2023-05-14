const XLSX = require('xlsx');

function conservationCodesResults() {
    let workbook = XLSX.readFile(`${__dirname}/../../../updatesfiles/conservationdata/conservationData.xlsx`);
    let sheet_name_list = workbook.SheetNames;

    // let myData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], { defval: "" })

    let ws = workbook.Sheets[sheet_name_list];
ws['!ref'] = "A1:A1862" // change the sheet range to A2:C3
// expecting only first 2 rows 
const data_1 = XLSX.utils.sheet_to_json( ws,{header:1});

    return data_1;
}

module.exports = {
    conservationCodesResults
}