import React, {useState , useEffect} from 'react';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import data from './MyData.json'
import regionData from './regions.json'
import styled, { css } from 'styled-components'

const animatedComponents = makeAnimated();

let locationOptions = []
let RegionOptions = []

data.map(elem => {
  locationOptions.push({ value: elem.LocationHeardKey, label: elem.LocationHeardKey} )
})

regionData.map(elem => {
    RegionOptions.push({value: elem['code'] , label:elem['State/Province_name']})
  }
)

// RegionOptions.push({value: 'PE-CUS', label: 'Cusco (PE-CUS)'}, {value: 'PE-MDD', label: 'Madre de Dios (PE-MDD)'})

let arrOfRegions = []

let locationsFilteredByRegions = []

let arrScientificNames = []


const selectStyles = {
  control: (provided) => ({
    ...provided,
    margin: 20,
  }),
  menu: () => ({ boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)' }),
};

  
const AnimatedMulti = ({getSpecies, getSpeciesSum}) => {

    const [userChoice, setUserChoice] = useState("");
    const [userChoiceRegion, setUserChoiceRegion] = useState("");

    if(userChoiceRegion.length>0) {
      
      arrOfRegions = userChoiceRegion.map( elemRegionChoice => {
        return data.filter( elem => elem.Region === elemRegionChoice.value)
      })

      locationsFilteredByRegions = arrOfRegions.reduce( (acc, curr) => {
        acc = acc.concat(curr);
        return acc    
      })

        if(locationsFilteredByRegions.length > 0){
          locationOptions.length = 0;

          locationsFilteredByRegions.map(elem => {
            locationOptions.push({ value: elem.LocationHeardKey, label: elem.LocationHeardKey})
          })
        }

        else {
          locationOptions.length = 0;
        }
    }

    else {

      locationOptions.length = 0;

      data.map(elem => {
        locationOptions.push({ value: elem.LocationHeardKey, label: elem.LocationHeardKey} )
      })
    }


    arrScientificNames = userChoice.length>0 && userChoice.map( elemChoice => {
      let objLocName = data.find( elem => elem.LocationHeardKey === elemChoice.value)
        if(objLocName) {
          return objLocName.ScientificNameKey
        }

        else {
          console.log('thanks')
        }
    })


    console.log("userChoiceRegion: ", userChoiceRegion)
    console.log("LOCATIONS REGIONS : ", locationsFilteredByRegions)
    console.log("arrscientific : ", arrScientificNames)
    console.log("userChoice: ", userChoice)
  
    useEffect(() => {

      let LocationsPercentageSpecies = [];
      let mySum = 0;
      
      if(arrScientificNames.length > 0) {

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
    },[userChoice, userChoiceRegion])
  
  
    return (
      <SelectContainer>
        
        <p>When you select a Region you will be able to see a list of hotspots in the second bar related to the selected region(s)</p>
        <Select
          closeMenuOnSelect={true}
          components={animatedComponents}
          placeholder="Search a Region/State..."
          isMulti
          options={RegionOptions}
          onChange={(choice) => setUserChoiceRegion(choice)}
        />
     
        <p>If not region is selected you will be able to see a list of all the hotspot availbles</p>
        <Select
          closeMenuOnSelect={true}
          components={animatedComponents}
          placeholder="Search a Hotspot..."
          isMulti
          options={locationOptions}
          onChange={(choice) => setUserChoice(choice)}
        />
        
      </SelectContainer>
    );
}

const SelectContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: space-between;

    p {
      margin-top: 2rem;
    }
`



export default AnimatedMulti;