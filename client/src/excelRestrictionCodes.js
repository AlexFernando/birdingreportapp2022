const XLSX = require('xlsx');

function restrictioncodesResults() {
    let workbook = XLSX.readFile(`${__dirname}/../../../updatesfiles/restrictiondata/RestrictionData.xlsx`);
    let sheet_name_list = workbook.SheetNames;
    let myData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], { defval: "" })

    return myData;
}

module.exports = {
    restrictioncodesResults
}