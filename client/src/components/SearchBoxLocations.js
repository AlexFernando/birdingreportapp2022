import React, {useState , useEffect} from 'react';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import allSpecies from './allSpecies.json'
import data from './MyHeardSpecies.json'
import heardSeenData from './MyHeardSeenSpecies.json'
import noObsDetailsData from './noObsDetailsSpecies.json'
import regionData from './regions.json'
import styled, { css } from 'styled-components'

/**Bootstrap calls */
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import {FilterContainer} from './Statistics'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
const check = <FontAwesomeIcon icon={faCheck} size="xs" color="#007bff" />


const animatedComponents = makeAnimated();

let locationOptions = []
let RegionOptions = []


// locationOptions.push({value: "Select All", label: "all"})
allSpecies.map(elem => {
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

const AnimatedMulti = ({getSpecies, getSpeciesSum}) => {

    const [userChoice, setUserChoice] = useState("");
    const [userChoiceRegion, setUserChoiceRegion] = useState("");
    const [filterOption, setFilterOptions] = useState(allSpecies)
    const [tagFilterData, setTagFilterData] = useState("All types of Observations")

    //**START handlers for species based on Obs. Details */
    const handleOnlyHeard = () => {
      setFilterOptions(data)
      setTagFilterData("Only Heard")

      locationOptions.length = 0;

      // locationOptions.push({value: "Select All", label: "Select All Hotspots"})
      
      locationsFilteredByRegions.map(elem => {
        locationOptions.push({ value: elem.LocationHeardKey, label: elem.LocationHeardKey})
      })
    }
 
    const handleHeardSeen = () => {
      setFilterOptions(heardSeenData)
      setTagFilterData("Heard and Seen")
      locationOptions.length = 0;

      // locationOptions.push({value: "Select All", label: "Select All Hotspots"})
      locationsFilteredByRegions.map(elem => {
        locationOptions.push({ value: elem.LocationHeardKey, label: elem.LocationHeardKey})
      })
    }

    const handleOnlySeen = () => {
      setFilterOptions(noObsDetailsData)
      setTagFilterData("Seen - (Not relevant Obs. Details)")
      locationOptions.length = 0;

      // locationOptions.push({value: "Select All", label: "Select All Hotspots"})
      locationsFilteredByRegions.map(elem => {
        locationOptions.push({ value: elem.LocationHeardKey, label: elem.LocationHeardKey})
      })
    }

    const handleAllSpecies = () => {
      setFilterOptions(allSpecies)
      setTagFilterData("All Types of Observations")
      locationOptions.length = 0;

      // locationOptions.push({value: "Select All", label: "Select All Hotspots"})
      locationsFilteredByRegions.map(elem => {
        locationOptions.push({ value: elem.LocationHeardKey, label: elem.LocationHeardKey})
      })
    }

    //** END handlers for species based on Obs. Details */
    useEffect(() => {

      if(userChoiceRegion.length>0) {

        // console.log("choose region: ", userChoiceRegion)
      
        arrOfRegions = userChoiceRegion.map( elemRegionChoice => {
          return filterOption.filter( elem => elem.Region === elemRegionChoice.value)
        })
  
        locationsFilteredByRegions = arrOfRegions.reduce( (acc, curr) => {
          acc = acc.concat(curr);
          return acc    
        })
  
          if(locationsFilteredByRegions.length > 0){
            locationOptions.length = 0;
  
            // locationOptions.push({value: "Select All", label: "Select All Hotspots"})
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
        // locationOptions.push({value: "Select All", label: "Select All Hotspots"})
        filterOption.map(elem => {
          locationOptions.push({ value: elem.LocationHeardKey, label: elem.LocationHeardKey} )
        })
      }
  
//       arrScientificNames = userChoice.length>0 && userChoice[0].value ==="Select All" && filterOption.map( elem => elem.ScientificNameKey )

//  console.log(" arr: ", arrScientificNames)
      arrScientificNames= userChoice.length>0 && userChoice[0].value !=="Select All" && userChoice.map( elemChoice => {        
          let objLocName = filterOption.find( elem => elem.LocationHeardKey === elemChoice.value)
          if(objLocName) {
            return objLocName.ScientificNameKey
          }
  
          else {
            console.log('thanks')
          }
      })
      
      
  
      // console.log("userChoiceRegion: ", userChoiceRegion)
      // console.log("LOCATIONS REGIONS : ", locationsFilteredByRegions)
      // console.log("arrscientific : ", arrScientificNames)
      // console.log("userChoice: ", userChoice)

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
      // console.log("final: ", LocationsPercentageSpecies)
      getSpecies(LocationsPercentageSpecies);
      getSpeciesSum(mySum);
    },[userChoice, userChoiceRegion, filterOption])
  
    return (

      <>
        <FilterContainer>
        <DropdownButton
            as={ButtonGroup}
            key="niceFilter"
            id="dropdown-variants"
            title="Filter By"
        >
            <Dropdown.Item eventKey="1" onClick={handleOnlyHeard} >Only Heard</Dropdown.Item>
            <Dropdown.Item eventKey="2" onClick={handleHeardSeen} >Heard and Seen</Dropdown.Item>
            <Dropdown.Item eventKey="3" onClick={handleOnlySeen} >Only Seen</Dropdown.Item>
            <Dropdown.Item eventKey="4" onClick={handleAllSpecies} >All Type Of Observations</Dropdown.Item>
    
        </DropdownButton>


        <p><span>{check}</span>{tagFilterData}</p>

        </FilterContainer>

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

      </>
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