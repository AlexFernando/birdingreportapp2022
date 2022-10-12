import React, {useState , useEffect} from 'react';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';
// import { colourOptions } from './data.ts';
import data from './MyData.json'

const animatedComponents = makeAnimated();

let locationOptions = []

data.map(elem => {
  locationOptions.push({ value: elem.LocationHeardKey, label: elem.LocationHeardKey} )
})
  
const AnimatedMulti = ({getSpecies, getSpeciesSum}) => {

  const [userChoice, setUserChoice] = useState("");

    let arrScientificNames = userChoice.length>0 && userChoice.map( elemChoice => {
      let objLocName = data.find( elem => elem.LocationHeardKey === elemChoice.value)
        if(objLocName) {
          return objLocName.ScientificNameKey
        }

        else {
          console.log('thanks')
        }
    })
  
    useEffect(() => {
      // Only call setState within event handlers! 
      // Do not call setState inside the body of your function component


      let LocationsPercentageSpecies = [];
      let mySum = 0;

      
      if(arrScientificNames) {

        let totalArrays = arrScientificNames.reduce( (acc, curr) => {
          acc = acc.concat(curr);
          return acc
        })
        
        let newTotalMixedLocations = totalArrays.reduce( (acc, curr) => {
          let index = acc.findIndex(singleObj => {
              return singleObj["name"] === curr["name"]
          });

          if (index >= 0) {
            
              let originalValue = acc[index]["value"];
          
              originalValue += curr["value"];
       
              acc[index]["value"] = originalValue;
          }  

          else {
              acc.push(curr);
          }
      
          return acc;
      }, []);


        newTotalMixedLocations.map( elem => {
            mySum += elem['value']
        })

   

        LocationsPercentageSpecies = newTotalMixedLocations.map( elem => {
             let percentageFrequencySp = ((elem['value']/mySum)*100).toFixed(2);
             elem['valuePercentage'] = percentageFrequencySp;

             return elem;
        })
    
    }
      console.log("final: ", LocationsPercentageSpecies)
      getSpecies(LocationsPercentageSpecies);
      getSpeciesSum(mySum);
    },[userChoice])
  
  
    return (
      <Select
        closeMenuOnSelect={true}
        components={animatedComponents}
      
        isMulti
        options={locationOptions}
        onChange={(choice) => setUserChoice(choice)}
      />
    );
}

export default AnimatedMulti;