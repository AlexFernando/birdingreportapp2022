
const XLSX = require('xlsx');

function worldLifeResults() {
    let workbook = XLSX.readFile(`${__dirname}/ebird_world_life_list_excel.xlsx`);
    let sheet_name_list = workbook.SheetNames;
    let myData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], { defval: "" })

    return myData;
}

module.exports = {
    worldLifeResults
}