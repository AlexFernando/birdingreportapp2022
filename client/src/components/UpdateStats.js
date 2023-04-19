
// const { Console } = require('console');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG, SSL_OP_CIPHER_SERVER_PREFERENCE } = require('constants');
const e = require('cors');
const csv = require('csv-parser');
const fs = require('fs')
// const officegen = require('officegen');
const {reverseString} = require('./helpers.js/reverseDates')
const {formatDates, formatTimes} = require('./helpers.js/formatDates')

const buildObjFile = require('./buildObjData');
// const { format } = require('path');
const path = require('path');

const async = require('async');


function mySpecialFunction(initialDate, endDate, filename) {

    let results = []; //to save data after reading the file
    let filteredData = []; // data ready to write on the file 
    let excelData = require('./excelParserFilter')
    let excelRestrictrionCodes = require('./excelRestrictionCodes') //restriction code
    let excelFindMissedBird = require('./excelFindMissedBird') // whole list world
    let excelPresenceCodes = require('./excelPresenceCode') // Presence Code
    let excelConservationCodes = require('./excelConservationCode')//Conservation Code

    let filenameUploaded = filename; 
    
    let familyData = excelData.familyResults();
    
    
    let subSpecieRegex = /(Ssp\.)\s[A-Za-z]*(\:)/gm

    let conservationCodeArrFixed = conservationCodeData.map(elem => elem[0].split(",") )

    let conservationCodeFinalArray = conservationCodeArrFixed.map(elem => {

        if(elem.length === 5) {
            
            return ({ 
                'SpcRecID': elem[0].slice(1, -1),
                'Scientific name': elem[1].slice(1, -1),
                'English name': elem[2].slice(1, -1),
                'Family': elem[3].slice(1, -1),
                'Conservation_Code': elem[4].slice(1, -1)
            })
    
        }

        else if(elem.length === 6) {
            return ({ 
                'SpcRecID': elem[0].slice(1, -1),
                'Scientific name': elem[1].slice(1, -1),
                'English name': elem[2].slice(1, -1),
                'Family': elem[3].slice(1, -1) + " " + elem[4].slice(1, -1),
                'Conservation_Code': elem[5].slice(1, -1)
            })
        }

        else if(elem.length === 7) {
            return ({ 
                'SpcRecID': elem[0].slice(1, -1),
                'Scientific name': elem[1].slice(1, -1),
                'English name': elem[2].slice(1, -1),
                'Family': elem[3].slice(1, -1) + " " + elem[4].slice(1, -1) + " " + elem[5].slice(1, -1),
                'Conservation_Code': elem[6].slice(1, -1)
            })
        }
    });
      

    function filterData(results) {
    
        let count = 0;
    
        for (let i in results) {
            let obj = results[i];
            let date = results[i]['Date'];
            let date1 = initialDate; // parameters to filter (dates)
            let date2 = endDate;
            //saving complete objects
            if (date >= date1 && date <= date2) {
                count++;
                filteredData.push(obj);
            }
        }
        //take only some properties of the object to write to .docx

        // Create an empty Word object:
        // let docx = officegen('docx')
    
        // Officegen calling this function after finishing to generate the docx document:
        // docx.on('finalize', function(written) {
        //     console.log(
        //         'Finish to create a Microsoft Word document.'
        //     )
        // })
    
        // Officegen calling this function to report errors:
        // docx.on('error', function(err) {
        //     console.log(err)
        // })
    
        let objectFormat = {};
        let oldTestVar = '';
        let cleanKeys = [];
        let arrLocationsUpdated = [];
        let deleteDuplicates = [];
        let matchArray = [];

        let arrHeardSpecies = []
        let arrHeardSeenSpecies = []
        let arrSpecies = []
        let arrSpeciesNoFilter = []

        filteredData.map(elem => {
            //To no have problems later
            if (!elem.hasOwnProperty('Observation Details')) {
                elem['Observation Details'] = 'No';        
            }
           
            const allowed = ['Common Name', 'Scientific Name', 'Location', 'Observation Details', 'Date', 'Time', 'State/Province'];
    
            const filtered = Object.keys(elem)
                .filter(key => allowed.includes(key))
                .reduce((obj, key) => {
                    return {
                        ...obj,
                        [key]: elem[key]
                    };
                }, {});
            //add into an array 
            cleanKeys.push(filtered)
        })


        //AUDIO RECORDED ARR
            // let arrAudioRecorded = cleanKeys.filter(elem => elem['Observation Details'].toLowerCase().includes('audio recorded'))
            // arrAudioRecorded.map(elem => console.log(elem))
            // console.log("audio recorded lenght: ", arrAudioRecorded.length)
        //AUDIO RECORDED ARR ENDS


        //CREATE  New Keys for objects  + location_heard, location_both, date_heart, date_both

        cleanKeys.forEach(elem => {
            //Start Format Date
            elem.Date =  formatDates(elem.Date)
            elem.Time = formatTimes(elem.Time)
      
            //End Format Date
            elem.Location_heard = '';
            elem.Location_both = '';
            elem.Date_heard = '';
            elem.Date_both = '';
            elem.Time_heard = '';
            elem.Time_both = '';
            elem.category = '';
            elem.subspecie = '';

            elem.sspLocationHeard = '';
            elem.sspDateHeard = '';
            elem.sspTimeHeard = ''; 

            elem.sspLocationBoth = '';
            elem.sspDateBoth = '';
            elem.sspTimeBoth = ''; 

            elem.sspLocation = '';
            elem.sspDate = '';
            elem.sspTime = ''; 
            elem.Restricction_Code = '';
            elem.Presence_Code = '';
            elem.Conservation_Code = '';
        })

        // MAKE updated of the new locations, date , time keys created

        let myRegexNot = /\w+(?= seen)/gm;


        // 1) codigo de abajo
        arrLocationsUpdated = cleanKeys.map( elem => {

            //**NO filter array for stats*/

            let objNoFilter = {}

            objNoFilter['LocationHeardKey'] = elem['Location'];
            objNoFilter['ScientificNameKey'] = [elem['Scientific Name']];
            objNoFilter['CommonName'] = [elem['Common Name']];
            objNoFilter['Region'] = elem['State/Province'] 

            arrSpeciesNoFilter.push(objNoFilter);
  
            // console.log(elem);
            if( (!elem['Observation Details'].toLowerCase().includes('Glimpsed'.toLowerCase()) && !elem['Observation Details'].toLowerCase().includes('Sighting'.toLowerCase()) && elem['Observation Details'].toLowerCase().includes('Heard'.toLowerCase()) ) && ( !elem['Observation Details'].toLowerCase().includes('Seen'.toLowerCase()) || (elem['Observation Details'].match(myRegexNot) && elem['Observation Details'].match(myRegexNot)[0] === 'not') || (elem['Observation Details'].match(myRegexNot) && elem['Observation Details'].match(myRegexNot)[0] === `wasn't`)) || elem['Observation Details'].trim().toLowerCase() === 'H'.toLocaleLowerCase() || elem['Observation Details'].trim() === 'H.'.toLowerCase() ) {
                
                if(elem['Observation Details'].match(subSpecieRegex)){
                    let sspElem = elem['Observation Details'].match(subSpecieRegex);
                    elem.category = 'subspecies'
                    elem.subspecie = sspElem[0];
                    elem.sspLocationHeard = elem.Location;
                    elem.sspDateHeard = elem.Date;
                    elem.sspTimeHeard = elem.Time; 
                }

                else {
                    elem.Location_heard = elem.Location;
                    elem.Date_heard = elem.Date;
                    elem.Time_heard = elem.Time;
    
                    elem.Location = '';
                    elem.Date = '';
                    elem.Time = '';
    
                    elem.Location_both = '';
                    elem.Date_both = '';
                    elem.Time_both = '';
                }

                let objHeardSpecies = {}

                objHeardSpecies['LocationHeardKey'] = elem['Location_heard'];
                objHeardSpecies['ScientificNameKey'] = [elem['Scientific Name']];
                objHeardSpecies['CommonName'] = [elem['Common Name']];
                objHeardSpecies['Region'] = elem['State/Province'];
                objHeardSpecies['Comments'] = elem['Observation Details'];
                /**AGREGAR LINEA PARA GLIMPSED AQUI */

                arrHeardSpecies.push(objHeardSpecies);

                return elem;
            }

            else if (elem['Observation Details'].toLowerCase().includes('Heard'.toLowerCase()) && (elem['Observation Details'].toLowerCase().includes('Seen'.toLowerCase()) || elem['Observation Details'].toLowerCase().includes('Glimpsed'.toLowerCase())) ) {

                if(elem['Observation Details'].match(subSpecieRegex)){

                    let sspElem = elem['Observation Details'].match(subSpecieRegex);
                    elem.category = 'subspecies'
                    elem.subspecie = sspElem[0];
                    elem.sspLocationBoth = elem.Location;
                    elem.sspDateBoth = elem.Date;
                    elem.sspTimeBoth = elem.Time; 
                }

                else {
                    elem.Location_both = elem.Location;
                    elem.Date_both = elem.Date;
                    elem.Time_both = elem.Time;
    
                    elem.Location = '';
                    elem.Date = '';
                    elem.Time = '';
    
                    elem.Location_heard = '';
                    elem.Date_heard = '';
                    elem.Time_heard = '';
                }


                let objHeardSeenSpecies = {}

                objHeardSeenSpecies['LocationHeardKey'] = elem['Location_both'];
                objHeardSeenSpecies['ScientificNameKey'] = [elem['Scientific Name']];
                objHeardSeenSpecies['CommonName'] = [elem['Common Name']];
                objHeardSeenSpecies['Region'] = elem['State/Province'];
                objHeardSeenSpecies['Comments'] = elem['Observation Details'];

                arrHeardSeenSpecies.push(objHeardSeenSpecies);
                  
                return elem;
            }

            else {

                if(elem['Observation Details'].match(subSpecieRegex)){

                    let sspElem = elem['Observation Details'].match(subSpecieRegex);
                    elem.category = 'subspecies'
                    elem.subspecie = sspElem[0];
                    elem.sspLocation = elem.Location;
                    elem.sspDate = elem.Date;
                    elem.sspTime = elem.Time; 
                }

                let objSpecies = {}

                objSpecies['LocationHeardKey'] = elem['Location'];
                objSpecies['ScientificNameKey'] = [elem['Scientific Name']];
                objSpecies['CommonName'] = [elem['Common Name']];
                objSpecies['Region'] = elem['State/Province'] 
                objSpecies['Comments'] = elem['Observation Details'];

                arrSpecies.push(objSpecies);

                return elem;
            }
        })

        // console.log("arrHeardSpecies: ", arrHeardSpecies);

        //AUDIO RECORDED 
         let audioRecordedHeard = arrHeardSpecies.filter(elem => elem['Comments'].toLowerCase().includes('audio recorded'))
         let audioRecordedHeardSeen = arrHeardSeenSpecies.filter(elem => elem['Comments'].toLowerCase().includes('audio recorded'))
         let audioRecordedSeen = arrSpecies.filter(elem => elem['Comments'].toLowerCase().includes('audio recorded'))

         let arrAudioRecordedTotal = audioRecordedHeard.concat(audioRecordedHeardSeen, audioRecordedSeen)
        //END AUDIO RECORDED

        console.log("audioRecorded: ", arrAudioRecordedTotal.length);

        //GET GLIMPSED SPECIES
        let arrHeardGlimpsedSpecies = arrHeardSeenSpecies.filter(elem => {
            if(elem['Comments'].toLowerCase().includes('glimpsed')){
                return elem;
            }
        });
        console.log('Heard Glimpsed species: ', arrHeardGlimpsedSpecies.length)

        let arrGlimpsedSpecies = arrSpecies.filter(elem => {
            if(elem['Comments'].toLowerCase().includes('glimpsed')){
                return elem;
            }
        });
        console.log('Glimpsed species: ', arrGlimpsedSpecies.length)

        let arrAllGlimpsedSpecies = arrHeardGlimpsedSpecies.concat(arrGlimpsedSpecies);

        console.log('All Glimpsed species: ', arrAllGlimpsedSpecies.length);

        //ARR ONLY HEARD

        let arrHeardSeenPlusSeen = arrHeardSeenSpecies.concat(arrSpecies);

        console.log("heard: ",arrHeardSpecies.length,  "arrHeardSeenSpecies: ", arrHeardSeenSpecies.length, "arrSpecies: ", arrSpecies.length)

        let arrOnlyHeardSpecies = arrHeardSpecies.filter(elemOne => 
            !arrHeardSeenPlusSeen.some(elemTwo =>  (elemOne.ScientificNameKey[0] === elemTwo.ScientificNameKey[0] || elemOne.ScientificNameKey[0].includes(elemTwo.ScientificNameKey[0]) || elemTwo.ScientificNameKey[0].includes(elemOne.ScientificNameKey[0]) || elemOne.ScientificNameKey[0].includes('sp.')) ));
        
  
        console.log("arrOnlyHeardSpecies: ", arrOnlyHeardSpecies.length)
        // console.log("arrOnlyHeardSpecies: ", arrOnlyHeardSpecies)


        //ARRAY OF HEARD SPECIES , FOR STATITISCS
        let arrMergedHeardSpecies  = arrHeardSpecies.reduce( (accumulator ,curr) => {

            // console.log("accum: ", accumulator, "curr: ", curr)
         // Get the index of the key-value pair.
            let occurs = accumulator.reduce(function(n, item, i) {
                // console.log("n: ", n, "item: ", item, "i: ", i)
                return (item.LocationHeardKey === curr.LocationHeardKey) ? i : n;
            }, -1);

              // If the name is found,
            if (occurs >= 0) {

                // append the current value to its list of values.
                accumulator[occurs].ScientificNameKey = accumulator[occurs].ScientificNameKey.concat(curr.ScientificNameKey);
                accumulator[occurs].CommonName = accumulator[occurs].CommonName.concat(curr.CommonName);
                // Otherwise,
            } else {

                // add the current item to o (but make sure the value is an array).
                let obj = {
                    LocationHeardKey: curr.LocationHeardKey,
                    ScientificNameKey: curr.ScientificNameKey,
                    CommonName : curr.CommonName,
                    Region : curr.Region
                };
                accumulator = accumulator.concat([obj]);
            }

            return accumulator;
        }, [])
        // console.log(arrMergedHeardSpecies);

        arrMergedHeardSpecies.map( objElem => {            
            let ocurrences = objElem.ScientificNameKey.map( (itemScientificName, idx) => ({name: itemScientificName, value: 1, CommonName: objElem.CommonName[idx] }))

            objElem.ScientificNameKey = ocurrences;
        })

        arrMergedHeardSpecies.map( item => {
            let newMergedHeardSpecies = item.ScientificNameKey.reduce( (acc, curr) => {
                const index = acc.findIndex(singleObj => {
                    return singleObj["name"] === curr["name"]
                });
    
                if (index >= 0) {
                    var originalValue = acc[index]["value"];
                    originalValue += curr["value"];
                    acc[index]["value"] = originalValue;
                }  
    
                else {
                    acc.push(curr);
                }
            
                return acc;
            }, []);

            item.ScientificNameKey = newMergedHeardSpecies

            delete item.CommonName;
        }) 

        let audioRecordedBuildArr =  buildObjFile.buildObjData(arrAudioRecordedTotal)
        let onlyHeardSpecies = buildObjFile.buildObjData(arrOnlyHeardSpecies);
        let heardSeenBuildArr = buildObjFile.buildObjData(arrHeardSeenSpecies);
        let heardAndGlimpsed = buildObjFile.buildObjData(arrHeardGlimpsedSpecies)
        let glimpsedArr = buildObjFile.buildObjData(arrGlimpsedSpecies);
        let noDetailsBuildArr = buildObjFile.buildObjData(arrSpecies);
        let noFilterBuildArr = buildObjFile.buildObjData(arrSpeciesNoFilter);

        console.log("antes de escribir archivos")

        const filesToWrite = [
            { fileName: 'audioRecorded.jsonld', data: audioRecordedBuildArr},
            { fileName: 'onlyHeard.jsonld', data: onlyHeardSpecies },
            { fileName: 'allHeardSpecies.jsonld', data: arrMergedHeardSpecies },
            { fileName: 'heardSeenSpecies.jsonld', data: heardSeenBuildArr },
            { fileName: 'heardAndGlimpsed.jsonld', data: heardAndGlimpsed},
            { fileName: 'glimpsed.jsonld', data: glimpsedArr},
            { fileName: 'noObsDetailsObj.jsonld', data: noDetailsBuildArr },
            { fileName: 'noFilterObj.jsonld', data: noFilterBuildArr },
        ];



        const writeFiles = (filesToWrite, uploadsDir) => {
            for (let file of filesToWrite) {
            const filePath = path.join(uploadsDir, file.fileName);
            try {
                fs.writeFileSync(filePath, JSON.stringify(file.data));
                console.log(`File ${file.fileName} written successfully`);
            } catch (err) {
                console.log(`Error writing file ${file.fileName}: ${err.message}`);
                break; // stop the loop if an error occurs
            }

            const memoryUsage = process.memoryUsage();
            console.log(`Memory usage: ${JSON.stringify(memoryUsage)}`);
            }
        };
  
        const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
        writeFiles(filesToWrite, path.join(__dirname, './components/writtenFiles'));


        console.log("despues de escribir archivos")


        //END ARRAY OF HEARD SPECIES , FOR STATITISCS


        console.log("Hola vamos a terminar el programa")

        return filteredData;
    }
    
    // return a Promise
    const readFilePromise = () => {

        return new Promise((resolve, reject) => {
            fs.createReadStream(__dirname +`/../../uploads/${filenameUploaded}`)
                .pipe(csv())
                .on('data', data => results.push(data))
                .on('end', () => {
                    resolve(results);
                });
        })
    }
    
    //handling the Promise and using filterData function 
    readFilePromise()
        .then(result => filterData(result))
        .catch(error => console.log(error))
    
}

module.exports = {
    mySpecialFunction: mySpecialFunction,
};
