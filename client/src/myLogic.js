
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

    let filenameUploaded = filename;
    
    let familyData = excelData.familyResults();
    
    let restrictionCodeData = excelRestrictrionCodes.restrictioncodesResults();
    
    let regExp = /\(([^)]+)\)/;
    
    let regExpGroup = /(\(\b)/;
    
    let subSpecieRegex = /(Ssp\.)\s[A-Za-z]*(\:)/gm
    
    //Object.keys(elem).forEach(key => (elem[key] === null) && delete elem[key])
    
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
    
        filteredData.map(elem => {
    
            //To no have problems later
            if (!elem.hasOwnProperty('Observation Details')) {
                elem['Observation Details'] = 'No';        
            }
           
            const allowed = ['Common Name', 'Scientific Name', 'Location', 'Observation Details', 'Date', 'Time'];
    
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
        })

        // MAKE updated of the new locations, date , time keys created

        let myRegexNot = /\w+(?= seen)/gm;
        // 1) codigo de abajo
        arrLocationsUpdated = cleanKeys.map( elem => {
  
            if( elem['Observation Details'].toLowerCase().includes('Heard'.toLowerCase()) && ( !elem['Observation Details'].toLowerCase().includes('Seen'.toLowerCase()) || (elem['Observation Details'].match(myRegexNot) && elem['Observation Details'].match(myRegexNot)[0] === 'not') || (elem['Observation Details'].match(myRegexNot) && elem['Observation Details'].match(myRegexNot)[0] === `wasn't`)) || elem['Observation Details'].trim().toLowerCase() === 'H'.toLocaleLowerCase() || elem['Observation Details'].trim() === 'H.'.toLowerCase() ) {
                
                if(elem['Common Name'] === 'Sira Curassow') console.log(elem)
                
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

            // if(elem.category === 'domestic' || elem.category === 'form' || elem.category === 'hybrid' || elem.category === 'intergrade' || elem.category === 'slash' || elem.category === 'spuh'|| elem.category === '(Vacías)') {
            //     countOtherCat++
            //     console.log(countOtherCat+ '.- ' + "COMMON NAME: ", elem['Common Name'],  " ", " SCIENTIFIC NAME: "+ elem['Scientific Name'] + "  CATEGORY: ",elem.category, '\n' )
            // }

            // if(elem.category === '') {
            //     countOtherCat++
            //     console.log(countOtherCat+ '.- ' + "COMMON NAME: ", elem['Common Name'],  " ", " SCIENTIFIC NAME: "+ elem['Scientific Name'] + "  CATEGORY: ",elem.category, '\n' )
            // }



            // if(elem['Common Name'] === 'Sira Curassow') {console.log("weird element: " ,elem)}

            // if(elem.category.includes('group')) {
              
            //     console.log("elem category: ", elem.category,  "elem name ", elem['Common Name'])
            //     countGroup++
            // }

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


        // console.log("countNoCategories: ", countNoCategories)
        // console.log("coutnGroup: ", countGroup)

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

        locationsSeenUpdated.map( elem => {

            //match identical elements between both databases base on the Enlgish and Common name
            let nameMatch = familyData.find(el => el['English name'] === elem['Common Name']);

            let familyText = '';
    
            //creating the final array with the family name
            if (nameMatch) {
                familyText = nameMatch.family;
    
                if (familyText === '') {
                    familyText = '(Others)';
                }
                //finding a match between my array of objects and the familyDataBase 
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
            pObj.addText(familyName, { bold: true, color: '188c18', font_face: 'Calibri', font_size: 16 })
            pObj.addLineBreak()
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
                

                // if (value[elem]['category'].includes('group')) {
                //     console.log("elem group : ", value[elem])
                //     countGroups++
                // }    
                if (value[elem]['category'].includes('species') && !value[elem]['category'].includes('group')) {
                    numIndex++;
    
                    pObj.addText(numIndex + '. ', { bold: true, font_face: 'Calibri', font_size: 12 })
                    
                    pObj.addText(commonName, { bold: true, font_face: 'Calibri', font_size: 12 })
                    pObj.addText(' (' + scientificName + ')', { bold: true, font_face: 'Calibri', font_size: 12 })
                    
                    
                    pObj.addLineBreak()                                               
                    pObj.addLineBreak()

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
                    
                    pObj.addText('     '+commonName, { bold: true, font_face: 'Calibri', font_size: 12 })
                    pObj.addText(' (' + scientificName + ')', { bold: true, font_face: 'Calibri', font_size: 12 })
                    
                    
                    pObj.addLineBreak()                                               
                    pObj.addLineBreak()


                    if(locationDetails !== '' && locationHeard !== '' && locationBoth !== '') {
                        pObj.addText('     '+"Seen at: " + locationDetails, { font_face: 'Calibri', font_size: 12 })
                        pObj.addLineBreak()
                        pObj.addLineBreak()
        
                        pObj.addText('     '+"Heard Only at: " + locationHeard, { font_face: 'Calibri', font_size: 12 })
                        pObj.addLineBreak()
                        pObj.addLineBreak()

                        pObj.addText('     '+"Heard and Seen at: " + locationBoth, { font_face: 'Calibri', font_size: 12 })
                        pObj.addLineBreak()
                    }

                    else if (locationDetails !== '' && locationHeard !== '' && locationBoth === '') {
                        pObj.addText('     '+"Seen at: " + locationDetails, { font_face: 'Calibri', font_size: 12 })
                        pObj.addLineBreak()
                        pObj.addLineBreak()
        
                        pObj.addText('     '+"Heard Only at: " + locationHeard, { font_face: 'Calibri', font_size: 12 })
                        pObj.addLineBreak()
                    }

                    else if (locationDetails !== '' && locationBoth !== '' && locationHeard === '') {
                        pObj.addText('     '+"Seen at: " + locationDetails, { font_face: 'Calibri', font_size: 12 })
                        pObj.addLineBreak()
                        pObj.addLineBreak()
        
                        pObj.addText('     '+"Heard and Seen at: " + locationBoth, { font_face: 'Calibri', font_size: 12 })
                        pObj.addLineBreak()
                    }

                    else if (locationHeard !== '' && locationBoth !== '' && locationDetails === '') {
                        pObj.addText('     '+"Heard only at: " + locationHeard, { font_face: 'Calibri', font_size: 12 })
                        pObj.addLineBreak()
                        pObj.addLineBreak()
        
                        pObj.addText('     '+"Heard and Seen at: " + locationBoth, { font_face: 'Calibri', font_size: 12 })
                        pObj.addLineBreak()
                    }

                    else if (locationHeard !== '' && locationDetails === '' && locationBoth === '') {
                        pObj.addText('     '+"Heard Only at: " + locationHeard, { font_face: 'Calibri', font_size: 12 })
                        pObj.addLineBreak()
                    }

                    else if (locationBoth !== '' && locationHeard === '' && locationDetails === '') {
                        pObj.addText('     '+"Heard and Seen at: " + locationBoth, { font_face: 'Calibri', font_size: 12 })
                        pObj.addLineBreak()
                    }

                    else if (locationDetails !== '' && locationHeard === '' && locationBoth === '') {
                        pObj.addText('     '+"Seen at: " + locationDetails, { font_face: 'Calibri', font_size: 12 })
                        pObj.addLineBreak()
                    }

                    pObj.addLineBreak()                                               
                    pObj.addLineBreak()

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

        // console.log("countgroup: ", countGroups)
    
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
    mySpecialFunction: mySpecialFunction
};


