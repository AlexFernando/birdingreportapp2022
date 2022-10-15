
const { Console } = require('console');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG, SSL_OP_CIPHER_SERVER_PREFERENCE } = require('constants');
const e = require('cors');
const csv = require('csv-parser');
const fs = require('fs')
const officegen = require('officegen');
const {reverseString} = require('./helpers.js/reverseDates')



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
    
    let restrictionCodeData = excelRestrictrionCodes.restrictioncodesResults();

    let presenceCodeData = excelPresenceCodes.presenceCodesResults();
   
    let conservationCodeData = excelConservationCodes.conservationCodesResults();

    let wholeDataList = excelFindMissedBird.worldLifeResults(); 
    
    let regExp = /\(([^)]+)\)/;
    
    let regExpGroup = /(\(\b)/;
    
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
        let docx = officegen('docx')
    
        // Officegen calling this function after finishing to generate the docx document:
        docx.on('finalize', function(written) {
            console.log(
                'Finish to create a Microsoft Word document.'
            )
        })
    
        // Officegen calling this function to report errors:
        docx.on('error', function(err) {
            console.log(err)
        })
    
        let objectFormat = {};
        let oldTestVar = '';
        let cleanKeys = [];
        let arrLocationsUpdated = [];
        let deleteDuplicates = [];
        let matchArray = [];

        let arrHeardSpecies = []

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

        //CREATE  New Keys for objects  + location_heard, location_both, date_heart, date_both

        cleanKeys.forEach(elem => {
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
  
            // console.log(elem);
            if( elem['Observation Details'].toLowerCase().includes('Heard'.toLowerCase()) && ( !elem['Observation Details'].toLowerCase().includes('Seen'.toLowerCase()) || (elem['Observation Details'].match(myRegexNot) && elem['Observation Details'].match(myRegexNot)[0] === 'not') || (elem['Observation Details'].match(myRegexNot) && elem['Observation Details'].match(myRegexNot)[0] === `wasn't`)) || elem['Observation Details'].trim().toLowerCase() === 'H'.toLocaleLowerCase() || elem['Observation Details'].trim() === 'H.'.toLowerCase() ) {
                
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
                objHeardSpecies['Region'] = elem['State/Province'] 

                arrHeardSpecies.push(objHeardSpecies);

                return elem;
            }

            else if (elem['Observation Details'].toLowerCase().includes('Heard'.toLowerCase()) && elem['Observation Details'].toLowerCase().includes('Seen'.toLowerCase()) &&  !elem['Observation Details'].toLowerCase().includes('Not Seen'.toLowerCase())) {
                
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

                return elem;
            }
        })

        // console.log("arrHeardSpecies: ", arrHeardSpecies);
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
        
    
        // arrMergedHeardSpecies.map( elem => {
        //     const ocurrences = elem.ScientificNameKey.reduce( (acc, curr) => {
        //         return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
        //     }, {})

        //     elem.ScientificNameKey = ocurrences;
        // })

        // arrMergedHeardSpecies.map(elem => {
        //     let sumSpeciesEachLocation = Object.values(elem.ScientificNameKey).reduce( (acc, curr) => {
        //         return acc+curr;
        //     })

        //     elem.ScientificNameKey['Sum'] = sumSpeciesEachLocation;
        // })

        // arrMergedHeardSpecies.map(elem => {
        //     let totalSumSpecies = elem.ScientificNameKey.Sum;

        //     let percentageFrequencySp = Object.keys(elem.ScientificNameKey).map( frequencyOfSpecieKey => {
        //         elem.ScientificNameKey[frequencyOfSpecieKey] = elem.ScientificNameKey[frequencyOfSpecieKey]/totalSumSpecies*100;
        //         return frequencyOfSpecieKey/totalSumSpecies*100;
        //     })

        // })

        // console.log(arrMergedHeardSpecies)

        fs.writeFile(__dirname +`/../../uploads/test.js`, JSON.stringify(arrMergedHeardSpecies), function(err) {
            if(err) {
                return console.log(err);
            }
        
            console.log("The file was saved!");
        }); 

        //END ARRAY OF HEARD SPECIES , FOR STATITISCS
    
        //2.- modoficar elem.category el ';' por '&& o algo asi'

        arrLocationsUpdated.map( elem => {
            //match identical elements between both databases base on the Enlgish and Common name
            let indexElement = familyData.findIndex(element => element['scientific name'] === elem['Scientific Name'] || element['English name'] === elem['Common Name']);

            if(indexElement !== -1) {
                if(elem.category === 'subspecies') {
                    elem.category += ' &plus& '+familyData[indexElement].category 
                }

                else {
                    elem.category = familyData[indexElement].category 
                }
            }
        })


        //delete some duplicate keys
        //3.- ya no poner curr. category , simplemente agregar category separado por ';' y ssp localidad y date time a elem.subspecie, 
        deleteDuplicates = arrLocationsUpdated.reduce((accumulator, curr) => {
    
            let name = curr['Common Name']

            const found = accumulator.find(elem => elem['Common Name'] === name)
  
            if(found) {
        
                if( curr['Observation Details'].toLowerCase().includes('Heard'.toLowerCase()) && (!curr['Observation Details'].toLowerCase().includes('Seen'.toLowerCase()) ||  (curr['Observation Details'].match(myRegexNot) && curr['Observation Details'].match(myRegexNot)[0] === 'not') || (curr['Observation Details'].match(myRegexNot) && curr['Observation Details'].match(myRegexNot)[0] === `wasn't` )) || curr['Observation Details'].trim().toLowerCase() === 'H'.toLocaleLowerCase() || curr['Observation Details'].trim() === 'H.'.toLowerCase() ){
                    
                    if(curr.category.includes('subspecies')) {
                        found.subspecie += found.subspecie === '' ? curr.subspecie : ";" + curr.subspecie;
                        found.category += found.category === '' ? curr.category : ";" + curr.category;
                        found.sspLocationHeard += found.sspLocationHeard === '' ? curr.sspLocationHeard : ";" + curr.sspLocationHeard;
                        found.sspDateHeard += found.sspDateHeard === '' ? curr.sspDateHeard : ";" + curr.sspDateHeard;
                        found.sspTimeHeard += found.sspTimeHeard === '' ? curr.sspTimeHeard : ";" + curr.sspTimeHeard;
                    }

                    else {
                        
                        if(found.Location_heard === '') {
                            found.Location_heard = curr.Location_heard;
                            found.Date_heard = curr.Date_heard; 
                            found.Time_heard = curr.Time_heard; 
                        }

                        else {
                            found.Location_heard += ";" + curr.Location_heard;
                            found.Date_heard += ";" + curr.Date_heard;
                            found.Time_heard += ";" + curr.Time_heard;
                        }
                    }
                }

                else if (curr['Observation Details'].toLowerCase().includes('Heard'.toLowerCase()) && curr['Observation Details'].toLowerCase().includes('Seen'.toLowerCase()) ) {
                    
                    if(curr.category.includes('subspecies')) {
                        // found.subspecie += found.subspecie === '' ? curr.subspecie : ";" + curr.subspecie;
                        found.subspecie += found.subspecie === '' ? curr.subspecie : ";" + curr.subspecie;
                        found.category += found.category === '' ? curr.category : ";" + curr.category;
                        found.sspLocationBoth += found.sspLocationBoth === '' ? curr.sspLocationBoth : ";" + curr.sspLocationBoth;
                        found.sspDateBoth += found.sspDateBoth === '' ? curr.sspDateBoth : ";" + curr.sspDateBoth;
                        found.sspTimeBoth += found.sspTimeBoth === '' ? curr.sspTimeBoth : ";" + curr.sspTimeBoth;
                    }
                    
                    else {

                        if(found.Location_both === '') {
                            found.Location_both = curr.Location_both;
                            found.Date_both = curr.Date_both; 
                            found.Time_both = curr.Time_both; 
                        }
    
                        else {
                            found.Location_both += ";" + curr.Location_both;
                            //cuando hay cadena vacia '' no debe agregar ';'
                            found.Date_both += ";" + curr.Date_both;
                            
                            found.Time_both += ";" + curr.Time_both;
                        }
                    }                    
                }

                else {
                                        
                    if(curr.category.includes('subspecies')) {
                        // found.subspecie += found.subspecie === '' ? curr.subspecie : ";" + curr.subspecie;
                        found.subspecie += found.subspecie === '' ? curr.subspecie : ";" + curr.subspecie;
                        found.category += found.category === '' ? curr.category : ";" + curr.category;
                        found.sspLocation += found.sspLocation === '' ? curr.sspLocation : ";" + curr.sspLocation;
                        found.sspDate += found.sspDate === '' ? curr.sspDate : ";" + curr.sspDate;
                        found.sspTime += found.sspTime === '' ? curr.sspTime : ";" + curr.sspTime;
                    }

                    else {
                        if(found.Location === '') {
                            found.Location = curr.Location;
                            found.Date = curr.Date; 
                            found.Time = curr.Time; 
                        }
    
                        else {
    
                            found.Location += ";" + curr.Location;
                            found.Date += ";" + curr.Date; 
                            found.Time += ";" + curr.Time;
                        }
                    }
                }
                
            }

            else accumulator.push(curr);

            return accumulator;
        }, []);

        let countNoCategories = 0;
        let countGroup = 0;
        let countOtherCat = 0;
          
        //delete repeated locations
        let locationsHeardUpdated =  deleteDuplicates.map(elem => {

            elem.category.trim();
            elem.subspecie.trim();


            if(elem.category.includes('subspecies')) {

                elem.subspecie = [...new Set(elem.subspecie.split(';'))].join(';');

                if(elem.sspLocationHeard !== '') {

                    let myLocation = elem.sspLocationHeard.split(';');
                    let myDatesHeard = elem.sspDateHeard.split(';');
                    let myTimeHeard = elem.sspTimeHeard.split(';');
                    let countDuplicates = 0;
                    let uniqueLocations = myLocation.map((item, index) => {
    
                        if(myLocation.indexOf(item) === index) {
                            return item;
                        }
        
                        else {
                            return 'duplicate';
                        }
                    })
        
                    uniqueLocations.reverse().forEach( (elem,index) => {
                        if(elem === 'duplicate'){
                            countDuplicates++;
                        }
    
                        else {
                            if(countDuplicates !== 0) {
                                uniqueLocations[index] = elem + " ("+ (countDuplicates+1).toString() +") "
                            }
    
                            countDuplicates = 0;
                        }
                    })


                    uniqueLocations.reverse();
             
                    let locationDatesHeard = uniqueLocations.map( (elem, index) => {
    
                        if(uniqueLocations.length === 1) {
                            return elem + "(" + reverseString(myDatesHeard[index]) + "--" + myTimeHeard[index] + ")";
                        }
    
                        else if (elem ==="duplicate") {
                            if( index === uniqueLocations.length -1) {
                                return ", "+ reverseString(myDatesHeard[index]) + "--" + myTimeHeard[index] + ")"; 
                            }
    
                            else {
                                return ", "+ reverseString(myDatesHeard[index]) +"--" + myTimeHeard[index];
                            }
                        }
        
                        else {
                            if(index === 0) {
                                return elem + "(" + reverseString(myDatesHeard[index]) + "--" + myTimeHeard[index];
                            }
    
                            else if (index === uniqueLocations.length -1) {
                                return ") ;" + elem + "(" + reverseString(myDatesHeard[index]) +"--" + myTimeHeard[index] +")";
                            }
                            
                            else {
                                return ") ;" + elem + "(" + reverseString(myDatesHeard[index]) + "--" + myTimeHeard[index] ;
                            }
                        }
                    })
    
                    elem.sspLocationHeard = locationDatesHeard.join('');

                }
            }


            //converting a string into array for Location
            if(elem.Location_heard !== '') {

                let myLocation = elem.Location_heard.split(';');
                let myDatesHeard = elem.Date_heard.split(';');
                let myTimeHeard = elem.Time_heard.split(';');
                let countDuplicates = 0;
                //
                let uniqueLocations = myLocation.map((item, index) => {

                    if(myLocation.indexOf(item) === index) {
                        return item;
                    }
    
                    else {
                        return 'duplicate';
                    }
                })
    
                uniqueLocations.reverse().forEach( (elem,index) => {
                    if(elem === 'duplicate'){
                        countDuplicates++;
                    }

                    else {
                        if(countDuplicates !== 0) {
                            uniqueLocations[index] = elem + " ("+ (countDuplicates+1).toString() +") "
                        }

                        countDuplicates = 0;
                    }
                })

                uniqueLocations.reverse();
             
                let locationDatesHeard = uniqueLocations.map( (elem, index) => {

                    if(uniqueLocations.length === 1) {
                        return elem + "(" + reverseString(myDatesHeard[index]) + "--" + myTimeHeard[index] + ")";
                    }

                    else if (elem ==="duplicate") {
                        if( index === uniqueLocations.length -1) {
                            return ", "+ reverseString(myDatesHeard[index]) + "--" + myTimeHeard[index] + ")"; 
                        }

                        else {
                            return ", "+ reverseString(myDatesHeard[index]) +"--" + myTimeHeard[index];
                        }
                    }
    
                    else {
                        if(index === 0) {
                            return elem + "(" + reverseString(myDatesHeard[index]) + "--" + myTimeHeard[index];
                        }

                        else if (index === uniqueLocations.length -1) {
                            return ") ;" + elem + "(" + reverseString(myDatesHeard[index]) +"--" + myTimeHeard[index] +")";
                        }
                        
                        else {
                            return ") ;" + elem + "(" + reverseString(myDatesHeard[index]) + "--" + myTimeHeard[index] ;
                        }
                    }
                })

                elem.Location_heard = locationDatesHeard.join('');

                return elem;
            }

                return elem;
        })

        let locationBothUpdated = locationsHeardUpdated.map( elem => {
            
            if(elem.category.includes('subspecies')) {



                if(elem.sspLocationBoth !== '') {

                    let myLocation = elem.sspLocationBoth.split(';');
                    let myDatesHeard = elem.sspDateBoth.split(';');
                    let myTimeHeard = elem.sspTimeBoth.split(';');
                    let countDuplicates = 0;
                    //
                    let uniqueLocations = myLocation.map((item, index) => {
    
                        if(myLocation.indexOf(item) === index) {
                            return item;
                        }
        
                        else {
                            return 'duplicate';
                        }
                    })
        
                    uniqueLocations.reverse().forEach( (elem,index) => {
                        if(elem === 'duplicate'){
                            countDuplicates++;
                        }
    
                        else {
                            if(countDuplicates !== 0) {
                                uniqueLocations[index] = elem + " ("+ (countDuplicates+1).toString() +") "
                            }
    
                            countDuplicates = 0;
                        }
                    })


                    uniqueLocations.reverse();
             
                    let locationDatesHeard = uniqueLocations.map( (elem, index) => {
    
                        if(uniqueLocations.length === 1) {
                            return elem + "(" + reverseString(myDatesHeard[index]) + "--" + myTimeHeard[index] + ")";
                        }
    
                        else if (elem ==="duplicate") {
                            if( index === uniqueLocations.length -1) {
                                return ", "+ reverseString(myDatesHeard[index]) + "--" + myTimeHeard[index] + ")"; 
                            }
    
                            else {
                                return ", "+ reverseString(myDatesHeard[index]) +"--" + myTimeHeard[index];
                            }
                        }
        
                        else {
                            if(index === 0) {
                                return elem + "(" + reverseString(myDatesHeard[index]) + "--" + myTimeHeard[index];
                            }
    
                            else if (index === uniqueLocations.length -1) {
                                return ") ;" + elem + "(" + reverseString(myDatesHeard[index]) +"--" + myTimeHeard[index] +")";
                            }
                            
                            else {
                                return ") ;" + elem + "(" + reverseString(myDatesHeard[index]) + "--" + myTimeHeard[index] ;
                            }
                        }
                    })
    
                    elem.sspLocationBoth = locationDatesHeard.join('');    
                }
            }

            
            if(elem.Location_both !== '') {

                let myLocation = elem.Location_both.split(';');
                let myDatesBoth = elem.Date_both.split(';');
                let myTimeBoth = elem.Time_both.split(';');
                let countDuplicates = 0;
                let uniqueLocations = myLocation.map((item, index) => {

                    if(myLocation.indexOf(item) === index) {
                        return item;
                    }
    
                    else {
                        return 'duplicate';
                    }
                })
    
                uniqueLocations.reverse().forEach( (elem,index) => {
                    if(elem === 'duplicate'){
                        countDuplicates++;
                    }

                    else {
                        if(countDuplicates !== 0) {
                            uniqueLocations[index] = elem + " ("+ (countDuplicates+1).toString() +") "
                        }

                        countDuplicates = 0;
                    }
                })

                uniqueLocations.reverse();
             
                let locationDatesBoth = uniqueLocations.map( (elem, index) => {

                    if(uniqueLocations.length === 1) {
                        return elem + "(" + reverseString(myDatesBoth[index]) + "--"+ myTimeBoth[index] + ")";
                    }

                    else if (elem ==="duplicate") {
                        if( index === uniqueLocations.length -1) {
                            return ", " + reverseString(myDatesBoth[index]) + "--"+ myTimeBoth[index] + ")"; 
                        }

                        else {
                            return ", " + reverseString(myDatesBoth[index]) + "--"+ myTimeBoth[index];
                        }
                    }
    
                    else {
                        if(index === 0) {
                            return elem + "(" + reverseString(myDatesBoth[index]) + "--"+ myTimeBoth[index];
                        }

                        else if (index === uniqueLocations.length -1) {
                            return ") ;" + elem + "(" + reverseString(myDatesBoth[index]) +")" + "--"+ myTimeBoth[index];
                        }
                        
                        else {
                            return ") ;" + elem + "(" + reverseString(myDatesBoth[index]) + "--"+ myTimeBoth[index];
                        }
                    }
                })

                elem.Location_both = locationDatesBoth.join('');

                return elem;
            }

                return elem;
        })

        let locationsSeenUpdated = locationBothUpdated.map( elem => {

            if(elem.category.includes('subspecies')) {
                if(elem.sspLocation !== '') {

                    let myLocation = elem.sspLocation.split(';');
                    let myDatesHeard = elem.sspDate.split(';');
                    let myTimeHeard = elem.sspTime.split(';');
                    let countDuplicates = 0;
                    //
                    let uniqueLocations = myLocation.map((item, index) => {
    
                        if(myLocation.indexOf(item) === index) {
                            return item;
                        }
        
                        else {
                            return 'duplicate';
                        }
                    })
        
                    uniqueLocations.reverse().forEach( (elem,index) => {
                        if(elem === 'duplicate'){
                            countDuplicates++;
                        }
    
                        else {
                            if(countDuplicates !== 0) {
                                uniqueLocations[index] = elem + " ("+ (countDuplicates+1).toString() +") "
                            }
    
                            countDuplicates = 0;
                        }
                    })


                    uniqueLocations.reverse();
             
                    let locationDatesHeard = uniqueLocations.map( (elem, index) => {
    
                        if(uniqueLocations.length === 1) {
                            return elem + "(" + reverseString(myDatesHeard[index]) + "--" + myTimeHeard[index] + ")";
                        }
    
                        else if (elem ==="duplicate") {
                            if( index === uniqueLocations.length -1) {
                                return ", "+ reverseString(myDatesHeard[index]) + "--" + myTimeHeard[index] + ")"; 
                            }
    
                            else {
                                return ", "+ reverseString(myDatesHeard[index]) +"--" + myTimeHeard[index];
                            }
                        }
        
                        else {
                            if(index === 0) {
                                return elem + "(" + reverseString(myDatesHeard[index]) + "--" + myTimeHeard[index];
                            }
    
                            else if (index === uniqueLocations.length -1) {
                                return ") ;" + elem + "(" + reverseString(myDatesHeard[index]) +"--" + myTimeHeard[index] +")";
                            }
                            
                            else {
                                return ") ;" + elem + "(" + reverseString(myDatesHeard[index]) + "--" + myTimeHeard[index] ;
                            }
                        }
                    })
    
                    elem.sspLocation = locationDatesHeard.join('');
    
                }
            }


            if(elem.Location !== '') {
                let myLocation = elem.Location.split(';');
                let myDates = elem.Date.split(';');
                let myTime = elem.Time.split(';');
                let countDuplicates = 0;
                let uniqueLocations = myLocation.map((item, index) => {

                    if(myLocation.indexOf(item) === index) {
                        return item;
                    }
    
                    else {
                        return 'duplicate';
                    }
                })

                uniqueLocations.reverse().forEach( (elem,index) => {
                    if(elem === 'duplicate'){
                        countDuplicates++;
                    }

                    else {
                        if(countDuplicates !== 0) {
                            uniqueLocations[index] = elem + " ("+ (countDuplicates+1).toString() +") "
                        }

                        countDuplicates = 0;
                    }
                })

                uniqueLocations.reverse();
             
                let locationDates = uniqueLocations.map( (elem, index) => {

                    if(uniqueLocations.length === 1) {
                        return elem + "(" + reverseString(myDates[index]) + "--"+ myTime[index] + ")";
                    }

                    else if (elem ==="duplicate") {
                        if( index === uniqueLocations.length -1) {
                            return ", "+ reverseString(myDates[index]) + "--"+ myTime[index] + ")"; 
                        }

                        else {
                            return ", "+ reverseString(myDates[index]) +"--"+ myTime[index] ;
                        }
                    }
    
                    else {
                        if(index === 0) {
                            return elem + "(" + reverseString(myDates[index]) + "--"+ myTime[index];
                        }

                        else if (index === uniqueLocations.length -1) {
                            return ") ;" + elem + "(" + reverseString(myDates[index]) + "--"+ myTime[index] + ")";
                        }
                        
                        else {
                            return ") ;" + elem + "(" + reverseString(myDates[index]) + "--"+ myTime[index] ;
                        }
                    }
                })

                elem.Location = locationDates.join('');
        
                return elem;
            }

            return elem;
        })

        let arrOfGroups = []
        let arrForms = []
        let countForms = 0;
        
        // creating arr of groups and forms
        locationsSeenUpdated.map( elem => {
                if(elem.category.includes("group")) {
                    countGroup++;
                    arrOfGroups.push(elem['Scientific Name'])
                }

                else if(elem.category.includes("form")) {
                    countForms++;
                    arrForms.push(elem['Scientific Name'])
                }
            }
        )

        

        // START create the arrays of form and groups that does not have specie associated

        let countGroupMatch = 0;
        let countFormMatch = 0;
        let groupNoSpecies = ["fake"];
        let formNoSpecies = ["fake"];



        let groupsSpecie = arrOfGroups.map(elemGroup => {
            let matchName = locationsSeenUpdated.find( elem => elemGroup.includes(elem['Scientific Name']) && elemGroup !== elem['Scientific Name'])
            
            if(matchName !== undefined) {
                countGroupMatch++
            }

            else {
                if(groupNoSpecies.length >= 1  && !(groupNoSpecies[groupNoSpecies.length-1].split(' ')[0]+' '+groupNoSpecies[groupNoSpecies.length-1].split(' ')[1]).includes(elemGroup.split(' ')[0]+' '+elemGroup.split(' ')[1]) ){
                    groupNoSpecies.push(elemGroup)
                }
            }
        })
        
        groupNoSpecies.shift()


        let groupsFormSpecie = arrForms.map(elemForm => {
            let matchName = locationsSeenUpdated.find( elem => elemForm.includes(elem['Scientific Name']) && elemForm !== elem['Scientific Name'])
            
            if(matchName !== undefined) {
                countFormMatch++
            }

            else {
                if(!elemForm.includes('undescribed') && formNoSpecies.length >= 1  && !(formNoSpecies[formNoSpecies.length-1].split(' ')[0]+' '+formNoSpecies[formNoSpecies.length-1].split(' ')[1]).includes(elemForm.split(' ')[0]+' '+elemForm.split(' ')[1])){
                    formNoSpecies.push(elemForm)
                }
            }
        })
        
        formNoSpecies.shift()


        // END

        let arrRestCodesAdded = locationsSeenUpdated.map( elem => {
            let matchName = restrictionCodeData.find( item => 
                (item['English'] === elem['Common Name']  || item['Scientific Name'] === elem['Scientific Name'] || (elem['Scientific Name'].includes(item['Scientific Name'].split(' ')[0]) 
                && elem['Scientific Name'].includes(item['Scientific Name'].split(' ')[1]) && elem['Common Name'].includes("("+item['English'].split(' ')[0]+")") && item['English'].includes('**') && item['Restricction code'] !== '' )) && item['Restricction code'] !== '')

            if(matchName !== undefined && matchName['Restricction code'] !== '') {
                elem['Restricction_Code'] = matchName['Restricction code'];
                return elem;
            }

            return elem;
        })

        // let arrExceptionsPresenceCode = [];

        // let arrNotUse = arrRestCodesAdded.map( elem => {

        //     let matchName = presenceCodeData.find( item => (item['Scientific name'].trim() === elem['Scientific Name'].trim()))

        //     if(matchName) {
        //         return elem;
        //     }

        //     else {
        //         arrExceptionsPresenceCode.push(elem['Scientific Name']);
        //         return elem;
        //     }
        // })

        // let countElemt = 0

        // let anotherNotUse = arrExceptionsPresenceCode.map( elem => {
        //     let matchName = presenceCodeData.find( item => (item['Scientific name'].trim() !== elem.trim()) && elem.split(" ").length === 2 && !elem.includes("sp.") && item['Peru'] !== '')

        //     if(matchName) {
        //         countElemt++;
        //         console.log(countElemt, ".- ", elem)

        //         return elem
        //     }
        //     return elem;
        // })


        let arrPresenceCodesAdded = arrRestCodesAdded.map( elem => {

            let matchName = presenceCodeData.find( item => (item['English name'] === elem['Common Name']  || item['Scientific name'] === elem['Scientific Name']) && (item['Peru'] !== '' || item['Peru'] !== 'X'))

            if(matchName && matchName['Peru'] !== '' && matchName['Peru'] !== 'X') {
                elem['Presence_Code'] = matchName['Peru'];
                return elem;
            }

            return elem;
        })

        //elem['Scientific Name'].split(" ").length >= 3 && elem['Scientific Name'].split(" ")[0].includes(item['Scientific name'].split(" ")[0]) && elem['Scientific Name'].split(" ")[2].includes(item['Scientific name'].split(" ")[1]) 

        let arrConservationCodeAdded = arrPresenceCodesAdded.map( elem => {

            let matchName = conservationCodeFinalArray.find( item => 
                
                (item['English name'] === elem['Common Name']  || item['Scientific name'] === elem['Scientific Name'] || 
                ( ( elem['Scientific Name'].split(" ").length >= 3 && elem['Scientific Name'].split(" ")[0].includes(item['Scientific name'].split(" ")[0]) && elem['Scientific Name'].split(" ")[2].includes(item['Scientific name'].split(" ")[1])) && item['Conservation_Code'] !== '') && item['Conservation_Code'] !== '') )

            if(matchName && matchName['Conservation_Code'] !== '') {
                elem['Conservation_Code'] = matchName['Conservation_Code'];
                return elem;
            }

            return elem;
        })

        //finish codes added

        let arrNoFamilies = [];
        
        arrConservationCodeAdded.map( (elem, index )=> {
            //match identical elements between both databases base on the Enlgish and Common name
            let nameMatch = familyData.find(el => el['scientific name'] === elem['Scientific Name']);

            let familyText = '';
    
            //creating the final array with the family name
            if (nameMatch) {
                familyText = nameMatch.family;
    
                if (familyText === '') {
                    // familyText = '(others)';
                    objectFormat['others'+index] = new Array();
                    objectFormat['others'+index].push(elem)
                }                

                //finding a match between my array of objects and the familyDataBase 

                else {
                    let myArrayFamily = regExp.exec(familyText);

           
                    if (myArrayFamily !== null) {
                        let testFamilyName = myArrayFamily[1];
        
                        let realFamilyName = testFamilyName.toUpperCase();
        
                        if (oldTestVar !== testFamilyName) {
                            oldTestVar = testFamilyName;
        
                            //adding the family name with uppercase letters
                            objectFormat[realFamilyName] = new Array();
                        }
                        objectFormat[realFamilyName].push(elem)
                    }

                }
            }
        })

        //matching only species with the content of only Peru  but not others countries or locations outside Peru
        familyData.map(item => {
            let RegExp = /^(?!.*(and|to|Ecuador|Brazil|Bolivia|Argentina|Colombia|Paraguay|Venezuela|Chile|Uruguay|California)).*Peru.*$/
    
            let myMatch = RegExp.exec(item.range)
    
            let myScientificName = item['scientific name'];
    
            if (myMatch !== null) {
                matchArray.push(myScientificName)
            }
        })
                
        let numIndex = 0;
        let countGroups = 0;
    
        for (key in objectFormat) {
            let familyName = key;
            pObj = docx.createP()

            if(familyName.includes('others')) {
                console.log('no')
            }

            else {
                pObj.addText(familyName, { bold: true, color: '188c18', font_face: 'Calibri', font_size: 16 })
                pObj.addLineBreak()
            }
    
            value = objectFormat[key];


    
            for (let elem = 0; elem < value.length; elem++) {
    
                let commonName = value[elem]['Common Name'];
                let scientificName = value[elem]['Scientific Name'];
                let locationDetails = value[elem]['Location'];
                let locationHeard = value[elem]['Location_heard']
                let locationBoth = value[elem]['Location_both']
                let subSpecieName = value[elem]['subspecie']
                let sspLocation = value[elem]['sspLocation']
                let sspLocationHeard = value[elem]['sspLocationHeard']
                let sspLocationBoth = value[elem]['sspLocationBoth']

                function conservationCodeFunction () {
                    if(value[elem]['Conservation_Code'] === 'LC') {
                        pObj.addText('  ', {font_face: 'Calibri', font_size: 12})
                        pObj.addText(value[elem]['Conservation_Code'] , { bold: true, font_face: 'Calibri', font_size: 12, color: 'ffffff', back: '00af50'})
                    }

                    else if(value[elem]['Conservation_Code'] === 'NT') {
                        pObj.addText('  ', {font_face: 'Calibri', font_size: 12})
                        pObj.addText(value[elem]['Conservation_Code'] , { bold: true, font_face: 'Calibri', font_size: 12, color: 'ffffff', back: '92d050'})
                    }

                    else if(value[elem]['Conservation_Code'] === 'VU') {
                        pObj.addText('  ', {font_face: 'Calibri', font_size: 12})
                        pObj.addText(value[elem]['Conservation_Code'] , { bold: true, font_face: 'Calibri', font_size: 12, color: 'ffffff', back: 'ffc000'})
                    }

                    else if(value[elem]['Conservation_Code'] === 'EN') {
                        pObj.addText('  ', {font_face: 'Calibri', font_size: 12})
                        pObj.addText(value[elem]['Conservation_Code'] , { bold: true, font_face: 'Calibri', font_size: 12, color: 'ffffff', back: 'e26c09'})
                    }

                    else if(value[elem]['Conservation_Code'] === 'CR') {
                        pObj.addText('  ', {font_face: 'Calibri', font_size: 12})
                        pObj.addText(value[elem]['Conservation_Code'] , { bold: true, font_face: 'Calibri', font_size: 12, color: 'ffffff', back: 'C00000'})
                    }
            
                    else if(value[elem]['Conservation_Code'] === 'DD') {
                        pObj.addText('  ', {font_face: 'Calibri', font_size: 12})
                        pObj.addText(value[elem]['Conservation_Code'] , { bold: true, font_face: 'Calibri', font_size: 12, color: 'ffffff', back: 'a6a6a6'})
                    }
                }

                function presenceCodeFunc () {
                    if(value[elem]['Presence_Code'] === 'NB') {
                        pObj.addText(' ', {font_face: 'Calibri', font_size: 12})
                        pObj.addText('NB' , { bold: true, font_face: 'Calibri', font_size: 12, color: '000000'})
                    }

                    else if(value[elem]['Presence_Code'] === 'V') {
                        pObj.addText(' ', {font_face: 'Calibri', font_size: 12})
                        pObj.addText('V' , { bold: true, font_face: 'Calibri', font_size: 12, color: '000000'})
                    }

                    else if(value[elem]['Presence_Code'] === 'IN') {
                        pObj.addText(' ', {font_face: 'Calibri', font_size: 12})
                        pObj.addText('IN' , { bold: true, font_face: 'Calibri', font_size: 12, color: '000000'})
                    }

                    else if(value[elem]['Presence_Code'] === 'EX') {
                        pObj.addText(' ', {font_face: 'Calibri', font_size: 12})
                        pObj.addText('EX' , { bold: true, font_face: 'Calibri', font_size: 12, color: '000000'})
                    }

                    else if(value[elem]['Presence_Code'] === 'H') {
                        pObj.addText(' ', {font_face: 'Calibri', font_size: 12})
                        pObj.addText('H' , { bold: true, font_face: 'Calibri', font_size: 12, color: '000000'})
                    }
            
                    else if(value[elem]['Presence_Code'] === 'X(e)') {
                        pObj.addText(' ', {font_face: 'Calibri', font_size: 12})
                        pObj.addText('E (PE)' , { bold: true, font_face: 'Calibri', font_size: 12, color: 'ffffff', back: 'ff0000'})
                    }
                }

                function restricctionCodeFunc () {
                    if(value[elem]['Restricction_Code'] === 'NE') {
                        pObj.addText('  ' + value[elem]['Restricction_Code'] , { bold: true, font_face: 'Calibri', font_size: 12, color: 'c00000'})
                    }

                    else if(value[elem]['Restricction_Code'] === 'RR') {
                        pObj.addText('  ' + value[elem]['Restricction_Code'] , { bold: true, font_face: 'Calibri', font_size: 12, color: 'e26c09'})
                    }

                    else if(value[elem]['Restricction_Code'] === 'LC') {
                        pObj.addText('  ' + value[elem]['Restricction_Code'] , { bold: true, font_face: 'Calibri', font_size: 12, color: 'ffc000'})
                    }
                }

                function locationsFunc () {
                    if(locationDetails !== '' && locationHeard !== '' && locationBoth !== '') {
                        pObj.addText("Seen at: " + locationDetails, { font_face: 'Calibri', font_size: 12 })
                        pObj.addLineBreak()
                        pObj.addLineBreak()        
                        pObj.addText("Heard Only at: " + locationHeard, { font_face: 'Calibri', font_size: 12 })
                        pObj.addLineBreak()
                        pObj.addLineBreak()

                        pObj.addText("Heard and Seen at: " + locationBoth, { font_face: 'Calibri', font_size: 12 })
                        pObj.addLineBreak()
                    }

                    else if (locationDetails !== '' && locationHeard !== '' && locationBoth === '') {
                        pObj.addText("Seen at: " + locationDetails, { font_face: 'Calibri', font_size: 12 })
                        pObj.addLineBreak()
                        pObj.addLineBreak()
        
                        pObj.addText("Heard Only at: " + locationHeard, { font_face: 'Calibri', font_size: 12 })
                        pObj.addLineBreak()
                    }

                    else if (locationDetails !== '' && locationBoth !== '' && locationHeard === '') {
                        pObj.addText("Seen at: " + locationDetails, { font_face: 'Calibri', font_size: 12 })
                        pObj.addLineBreak()
                        pObj.addLineBreak()
        
                        pObj.addText("Heard and Seen at: " + locationBoth, { font_face: 'Calibri', font_size: 12 })
                        pObj.addLineBreak()
                    }

                    else if (locationHeard !== '' && locationBoth !== '' && locationDetails === '') {
                        pObj.addText("Heard only at: " + locationHeard, { font_face: 'Calibri', font_size: 12 })
                        pObj.addLineBreak()
                        pObj.addLineBreak()
        
                        pObj.addText("Heard and Seen at: " + locationBoth, { font_face: 'Calibri', font_size: 12 })
                        pObj.addLineBreak()
                    }

                    else if (locationHeard !== '' && locationDetails === '' && locationBoth === '') {
                        pObj.addText("Heard Only at: " + locationHeard, { font_face: 'Calibri', font_size: 12 })
                        pObj.addLineBreak()
                    }

                    else if (locationBoth !== '' && locationHeard === '' && locationDetails === '') {
                        pObj.addText("Heard and Seen at: " + locationBoth, { font_face: 'Calibri', font_size: 12 })
                        pObj.addLineBreak()
                    }

                    else if (locationDetails !== '' && locationHeard === '' && locationBoth === '') {
                        pObj.addText("Seen at: " + locationDetails, { font_face: 'Calibri', font_size: 12 })
                        pObj.addLineBreak()
                    }

                    pObj.addLineBreak()                                               
                    pObj.addLineBreak()
                }

            if(familyName.includes('others')) {
                pObj.addText(commonName, { bold: true, font_face: 'Calibri', font_size: 12 })
                pObj.addText(' (' + scientificName + ')', { bold: true, font_face: 'Calibri', font_size: 12 })
            
                //adding codes 
                    conservationCodeFunction()
                    presenceCodeFunc();
                    restricctionCodeFunc();
                 

                pObj.addLineBreak()                                               
                pObj.addLineBreak()

                // locations func()
                locationsFunc();

            }

            else {

   
                if (value[elem]['category'].includes('species') && !value[elem]['category'].includes('group') && !value[elem]['category'].includes('form')) {
                    numIndex++;
    
                    pObj.addText(numIndex + '. ', { bold: true, font_face: 'Calibri', font_size: 12 })
                    
                    pObj.addText(commonName, { bold: true, font_face: 'Calibri', font_size: 12 })
                    pObj.addText(' (' + scientificName + ')', { bold: true, font_face: 'Calibri', font_size: 12 })
                
                    //adding codes 
                        conservationCodeFunction()
                        presenceCodeFunc();
                        restricctionCodeFunc();
                        
 
                    pObj.addLineBreak()                                               
                    pObj.addLineBreak()
                    
                    // locations func()
                    locationsFunc();

                    if( subSpecieName !== '') {

                        if(subSpecieName.split(';').length > 1) {
                            pObj.addText('          '+subSpecieName.split(';')[0], {bold: true, font_face: 'Calibri', font_size: 12 })

                            pObj.addLineBreak()                                               
                            pObj.addLineBreak()
                            pObj.addText('          '+"Seen at: " + sspLocation.split(';')[0], { font_face: 'Calibri', font_size: 12 })
                            pObj.addLineBreak()
                            pObj.addLineBreak()
                            pObj.addText('          '+subSpecieName.split(';')[1], {bold: true, font_face: 'Calibri', font_size: 12 })

                            pObj.addLineBreak()                                               
                            pObj.addLineBreak()
                            pObj.addText('          '+"Seen at: " + sspLocation.split(';')[1], { font_face: 'Calibri', font_size: 12 })
                            pObj.addLineBreak()                                               
                            pObj.addLineBreak()
                        }

                        else {
                            pObj.addText('          '+subSpecieName, {bold: true, font_face: 'Calibri', font_size: 12 })

                            pObj.addLineBreak()                                               
                            pObj.addLineBreak()
                        }

                        if(sspLocation !== '' && sspLocationHeard !== '' && sspLocationBoth !== '') {
                            pObj.addText('          '+"Seen at: " + sspLocation, { font_face: 'Calibri', font_size: 12 })
                            pObj.addLineBreak()
                            pObj.addLineBreak()
            
                            pObj.addText('          '+"Heard Only at: " + sspLocationHeard, { font_face: 'Calibri', font_size: 12 })
                            pObj.addLineBreak()
                            pObj.addLineBreak()
    
                            pObj.addText('          '+"Heard and Seen at: " + sspLocationBoth, { font_face: 'Calibri', font_size: 12 })
                            pObj.addLineBreak()
                        }
    
                        else if (sspLocation !== '' && sspLocationHeard !== '' && sspLocationBoth === '') {
                            pObj.addText('          '+"Seen at: " + sspLocation, { font_face: 'Calibri', font_size: 12 })
                            pObj.addLineBreak()
                            pObj.addLineBreak()
            
                            pObj.addText('          '+"Heard Only at: " + sspLocationHeard, { font_face: 'Calibri', font_size: 12 })
                            pObj.addLineBreak()
                        }
    
                        else if (sspLocation !== '' && sspLocationBoth !== '' && sspLocationHeard === '') {
                            pObj.addText('          '+"Seen at: " + sspLocation, { font_face: 'Calibri', font_size: 12 })
                            pObj.addLineBreak()
                            pObj.addLineBreak()
            
                            pObj.addText('          '+"Heard and Seen at: " + sspLocationBoth, { font_face: 'Calibri', font_size: 12 })
                            pObj.addLineBreak()
                        }
    
                        else if (sspLocationHeard !== '' && sspLocationBoth !== '' && sspLocation === '') {
                            pObj.addText('          '+"Heard only at: " + sspLocationHeard, { font_face: 'Calibri', font_size: 12 })
                            pObj.addLineBreak()
                            pObj.addLineBreak()
            
                            pObj.addText('          '+"Heard and Seen at: " + sspLocationBoth, { font_face: 'Calibri', font_size: 12 })
                            pObj.addLineBreak()
                        }
    
                        else if (sspLocationHeard !== '' && sspLocation === '' && sspLocationBoth === '') {
                            pObj.addText('          '+"Heard Only at: " + sspLocationHeard, { font_face: 'Calibri', font_size: 12 })
                            pObj.addLineBreak()
                        }
    
                        else if (sspLocationBoth !== '' && sspLocationHeard === '' && sspLocation === '') {
                            pObj.addText('          '+"Heard and Seen at: " + sspLocationBoth, { font_face: 'Calibri', font_size: 12 })
                            pObj.addLineBreak()
                        }
    
                        else if (sspLocation !== '' && sspLocationHeard === '' && sspLocationBoth === '') {
                            pObj.addText('          '+"Seen at: " + sspLocation, { font_face: 'Calibri', font_size: 12 })
                            pObj.addLineBreak()
                        }

                        pObj.addLineBreak()
                        pObj.addLineBreak()

                    }

                } 
                    
                    
                else {
                    
                    //hacer comparacion con un array construido con los elems que no tienen especie

                    if(groupNoSpecies.includes(scientificName) || formNoSpecies.includes(scientificName) || commonName === 'Rock Pigeon (Feral Pigeon)') {
                        numIndex++;
                        pObj.addText(numIndex + '. ', { bold: true, font_face: 'Calibri', font_size: 12 })
                        pObj.addText(commonName.split(' ')[0] + ' ' + commonName.split(' ')[1] , { bold: true, font_face: 'Calibri', font_size: 12 })
                        pObj.addText(' (' + scientificName.split(' ')[0] + ' '+scientificName.split(' ')[1] + ')', { bold: true, font_face: 'Calibri', font_size: 12 })
                        
                        pObj.addLineBreak()
                        pObj.addLineBreak()
                    }

                    if(value[elem]['category'].includes('group')) {
                        pObj.addText('     • ', { bold: true, font_face: 'Calibri', font_size: 16 })

                        pObj.addText(commonName, { bold: true, font_face: 'Calibri', font_size: 12 })
                        pObj.addText(' (' + scientificName + ')', { bold: true, font_face: 'Calibri', font_size: 12 })
                    }

                    else {

                        pObj.addText('     '+commonName, { bold: true, font_face: 'Calibri', font_size: 12 })
                        pObj.addText(' (' + scientificName + ')', { bold: true, font_face: 'Calibri', font_size: 12 })
                    }
                    
                    // adding codes
                    conservationCodeFunction()
                    presenceCodeFunc();
                    restricctionCodeFunc();
                 
                    pObj.addLineBreak()                                               
                    pObj.addLineBreak()

                    locationsFunc();

                    if( subSpecieName !== '') {

                        if(subSpecieName.split(';').length > 1) {
                            pObj.addText('          '+subSpecieName.split(';')[0], {bold: true, font_face: 'Calibri', font_size: 12 })
                            pObj.addText('          '+"Seen at: " + sspLocation.split(';')[0], { font_face: 'Calibri', font_size: 12 })
                            pObj.addLineBreak()
                            pObj.addLineBreak()
                            pObj.addText('          '+subSpecieName.split(';')[1], {bold: true, font_face: 'Calibri', font_size: 12 })
                            pObj.addText('          '+"Seen at: " + sspLocation.split(';')[1], { font_face: 'Calibri', font_size: 12 })

                            pObj.addLineBreak()                                               
                            pObj.addLineBreak()
                        }

                        else {
                            pObj.addText('          '+subSpecieName, {bold: true, font_face: 'Calibri', font_size: 12 })

                            pObj.addLineBreak()                                               
                            pObj.addLineBreak()
                        }


                        if(sspLocation !== '' && sspLocationHeard !== '' && sspLocationBoth !== '') {
                            pObj.addText('          '+"Seen at: " + sspLocation, { font_face: 'Calibri', font_size: 12 })
                            pObj.addLineBreak()
                            pObj.addLineBreak()
            
                            pObj.addText('          '+"Heard Only at: " + sspLocationHeard, { font_face: 'Calibri', font_size: 12 })
                            pObj.addLineBreak()
                            pObj.addLineBreak()
    
                            pObj.addText('          '+"Heard and Seen at: " + sspLocationBoth, { font_face: 'Calibri', font_size: 12 })
                            pObj.addLineBreak()
                        }
    
                        else if (sspLocation !== '' && sspLocationHeard !== '' && sspLocationBoth === '') {
                            pObj.addText('          '+"Seen at: " + sspLocation, { font_face: 'Calibri', font_size: 12 })
                            pObj.addLineBreak()
                            pObj.addLineBreak()
            
                            pObj.addText('          '+"Heard Only at: " + sspLocationHeard, { font_face: 'Calibri', font_size: 12 })
                            pObj.addLineBreak()
                        }
    
                        else if (sspLocation !== '' && sspLocationBoth !== '' && sspLocationHeard === '') {
                            pObj.addText('          '+"Seen at: " + sspLocation, { font_face: 'Calibri', font_size: 12 })
                            pObj.addLineBreak()
                            pObj.addLineBreak()
            
                            pObj.addText('          '+"Heard and Seen at: " + sspLocationBoth, { font_face: 'Calibri', font_size: 12 })
                            pObj.addLineBreak()
                        }
    
                        else if (sspLocationHeard !== '' && sspLocationBoth !== '' && sspLocation === '') {
                            pObj.addText('          '+"Heard only at: " + sspLocationHeard, { font_face: 'Calibri', font_size: 12 })
                            pObj.addLineBreak()
                            pObj.addLineBreak()
            
                            pObj.addText('          '+"Heard and Seen at: " + sspLocationBoth, { font_face: 'Calibri', font_size: 12 })
                            pObj.addLineBreak()
                        }
    
                        else if (sspLocationHeard !== '' && sspLocation === '' && sspLocationBoth === '') {
                            pObj.addText('          '+"Heard Only at: " + sspLocationHeard, { font_face: 'Calibri', font_size: 12 })
                            pObj.addLineBreak()
                        }
    
                        else if (sspLocationBoth !== '' && sspLocationHeard === '' && sspLocation === '') {
                            pObj.addText('          '+"Heard and Seen at: " + sspLocationBoth, { font_face: 'Calibri', font_size: 12 })
                            pObj.addLineBreak()
                        }
    
                        else if (sspLocation !== '' && sspLocationHeard === '' && sspLocationBoth === '') {
                            pObj.addText('          '+"Seen at: " + sspLocation, { font_face: 'Calibri', font_size: 12 })
                            pObj.addLineBreak()
                        }

                        pObj.addLineBreak()
                        pObj.addLineBreak()

                    }

                }
            }
            
            
            }
        }
    
        pObj1 = docx.createP()
        pObj1.addText('ANEXO', {bold: true, color: '188c18', font_face: 'Calibri', font_size: 16 })
        pObj1.addLineBreak()
        pObj1.addLineBreak()
        pObj1.addText('Scientific Names of Groups', {bold: true, font_face: 'Calibri', font_size: 16 })
        pObj1.addLineBreak()
        pObj1.addLineBreak()

    
        let out = fs.createWriteStream('Report.docx')
    
        out.on('error', function(err) {
            console.log(err)
        })
    
        // Async call to generate the output file:
        docx.generate(out)
    
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


