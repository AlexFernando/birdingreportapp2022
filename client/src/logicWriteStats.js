const { Console } = require('console');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG, SSL_OP_CIPHER_SERVER_PREFERENCE } = require('constants');
const e = require('cors');
const csv = require('csv-parser');
const fs = require('fs')
const officegen = require('officegen');


function writeStatsFunc(objData) {

    // Create an empty Excel object:
    let xlsx = officegen('xlsx')

    // Officegen calling this function after finishing to generate the xlsx document:
    xlsx.on('finalize', function(written) {
        console.log(
            'Finish to create a Microsoft Excel document.'
        )
    })

    // Officegen calling this function to report errors:
    xlsx.on('error', function(err) {
        console.log(err)
    })

    let sheet = xlsx.makeNewSheet()
    sheet.name = 'Stats'

    // Add data using setCell:

    // sheet.setCell('E7', 42)
    // sheet.setCell('I1', -3)
    // sheet.setCell('I2', 3.141592653589)
    // sheet.setCell('G102', 'Hello World!')

    // The direct option - two-dimensional array:
    sheet.data[0] = []
    sheet.data[0][0] = 'Nº'
    sheet.data[0][1] = 'Scientific Name'
    sheet.data[0][2] = 'Common Name'
    sheet.data[0][3] = 'Date'
    sheet.data[0][3] = 'Count'
    sheet.data[0][3] = 'Location'
    

    objData.map( (elem, idx) => {
        sheet.data[idx+1] = []
        sheet.data[idx+1][0] = elem['TaxonomicOrder']
        sheet.data[idx+1][1] = elem['Scientific Name']
        sheet.data[idx+1][2] = elem['CommonName']
        sheet.data[idx+1][3] = elem['Date']
        sheet.data[idx+1][3] = elem['Count']
        sheet.data[idx+1][3] = elem['Location']

    })


    // Let's generate the Excel document into a file:

    let out = fs.createWriteStream('Stats.xlsx')

    out.on('error', function(err) {
    console.log(err)
    })

    // Async call to generate the output file:
    xlsx.generate(out)
        
}

module.exports = {
    writeStatsFunc: writeStatsFunc,
};
