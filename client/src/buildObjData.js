
function buildObjData(arrHeardSpecies) {

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
                   // If the location is already in the array, push the scientific and common name to its nested array.
              accumulator[occurs].species.push({
                ScientificNameKey: curr.ScientificNameKey,
                CommonName: curr.CommonName,
                MyDate: curr.Date,
                Count: curr.CountNew,
                TaxonomicOrder: curr.TaxonomicOrder,
                Location: curr.LocationHeardKey
              });
            } else {

                // add the current item to o (but make sure the value is an array).
                        // Otherwise, add a new object to the array.
              let obj = {
                LocationHeardKey: curr.LocationHeardKey,
                species: [
                  {
                    ScientificNameKey: curr.ScientificNameKey,
                    CommonName: curr.CommonName,
                    MyDate: curr.Date,
                    Count: curr.CountNew,
                    TaxonomicOrder: curr.TaxonomicOrder,
                    Location: curr.LocationHeardKey
                  },
                ],
                Region: curr.Region,
              };
              accumulator.push(obj);
            }

            return accumulator;
        }, [])

        // console.log(arrMergedHeardSpecies);

        // arrMergedHeardSpecies.map( objElem => {            
        //     let ocurrences = objElem.ScientificNameKey.map( (itemScientificName, idx) => ({name: itemScientificName, value: 1, CommonName: objElem.CommonName[idx] }))

        //     objElem.ScientificNameKey = ocurrences;
        // })

        // arrMergedHeardSpecies.map( item => {
        //     let newMergedHeardSpecies = item.ScientificNameKey.reduce( (acc, curr) => {
        //         const index = acc.findIndex(singleObj => {
        //             return singleObj["name"] === curr["name"]
        //         });
    
        //         if (index >= 0) {
        //             var originalValue = acc[index]["value"];
        //             originalValue += curr["value"];
        //             acc[index]["value"] = originalValue;
        //         }  
    
        //         else {
        //             acc.push(curr);
        //         }
            
        //         return acc;
        //     }, []);

        //     item.ScientificNameKey = newMergedHeardSpecies

        //     delete item.CommonName;
        // }) 

        return arrMergedHeardSpecies;

}

module.exports = {
    buildObjData: buildObjData
};
