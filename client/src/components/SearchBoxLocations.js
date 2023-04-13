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

/**IMPORT REACT SELECT */

import MyCustomSelect from './MyCustomSelect';
const check = <FontAwesomeIcon icon={faCheck} size="xs" color="#007bff" />


const animatedComponents = makeAnimated();

// let locationOptions = []
let RegionOptions = []

// locationOptions.push({value: "Select All", label: "all"})
// allSpecies.map(elem => {
//   locationOptions.push({ value: elem.LocationHeardKey, label: elem.LocationHeardKey} )
// })

regionData.map(elem => {
    RegionOptions.push({value: elem['code'] , label:elem['State/Province_name']})
  }
)

// RegionOptions.push({value: 'PE-CUS', label: 'Cusco (PE-CUS)'}, {value: 'PE-MDD', label: 'Madre de Dios (PE-MDD)'})

const AnimatedMulti = ({getSpecies, getSpeciesSum}) => {
//probar a separar los effects
//sera buena practica tener default state?

  console.log("Hey estoy iniciando el componente")
    const [userChoice, setUserChoice] = useState([]);
    const [userChoiceRegion, setUserChoiceRegion] = useState([]);
    const [filterOption, setFilterOptions] = useState([])
    const [tagFilterData, setTagFilterData] = useState("")


    /**NEW STATES */
    const [locationOptions, setLocationOptions] = useState([]);
    // const [RegionOptions, setRegionOptions] = useState([]);
    //**END NEW STATES */

    //**START handlers for species based on Obs. Details */
    const handleOnlyHeard = () => {
      
      setFilterOptions(data)
      setTagFilterData("Only Heard")
      
      // locationOptions.length = 0;
      // locationOptions.push({value: "Select All", label: "Select All Hotspots"})
      
      // locationsFilteredByRegions.map(elem => {
      //   locationOptions.push({ value: elem.LocationHeardKey, label: elem.LocationHeardKey})
      // })
    }
 
    const handleHeardSeen = () => {
      
      setFilterOptions(heardSeenData)
      setTagFilterData("Heard and Seen")
    }

    const handleOnlySeen = () => {
      
      setFilterOptions(noObsDetailsData)
      setTagFilterData("Seen - (Not relevant Obs. Details)")
    }

    const handleAllSpecies = () => {
      console.log("empieza hadlerAllSpecies")
      setFilterOptions(allSpecies)
      console.log("activa tag")
      setTagFilterData("All Types of Observations")
    }

    //** END handlers for species based on Obs. Details */
    useEffect(() => {

      console.log("userRegion: ", userChoiceRegion);
      console.log("USERCHOICE : " , userChoice);


      // let arrOfRegions = []

      // let locationsFilteredByRegions = []

      if(userChoiceRegion.length>0) {
        // console.log("choose region: ", userChoiceRegion, " he pasado por if")
        const arrOfRegions = userChoiceRegion.map( elemRegionChoice => {
          return filterOption.filter( elem => elem.Region === elemRegionChoice.value)
        })
  
        console.log("arrOfRegions: ", arrOfRegions)
        const locationsFilteredByRegions = arrOfRegions.reduce( (acc, curr) => {
          acc = acc.concat(curr);
          return acc    
        })

        console.log("locationsFilteredByRegions: ", locationsFilteredByRegions)
  
          if(locationsFilteredByRegions.length > 0){
            // console.log("paso el if locationsFilteredByRegions")
            // locationOptions.length = 0;

            setLocationOptions([])
            // locationOptions.push({value: "Select All", label: "Select All Hotspots"})

            // locationsFilteredByRegions.map(elem => {
            //   locationOptions.push({ value: elem.LocationHeardKey, label: elem.LocationHeardKey})
            // })

            let locationOptionsFiltered = locationsFilteredByRegions.map(elem => {
              return { value: elem.LocationHeardKey, label: elem.LocationHeardKey}
            })

            setLocationOptions(locationOptionsFiltered)
          }
  
          else {
            // console.log("paso al else , si locationsFilteredByRegions es 0")
            // locationOptions.length = 0;
            setLocationOptions([])
          }
      }
  
      else {
        // console.log("choose region: ", userChoiceRegion, " he pasado por else")
        // locationOptions.length = 0;
        setLocationOptions([])
        // locationOptions.push({value: "Select All", label: "Select All Hotspots"})
        // filterOption.map(elem => {
        //   locationOptions.push({ value: elem.LocationHeardKey, label: elem.LocationHeardKey} )
        // })

        let locationOptionsFiltered = filterOption.map(elem => {
          return { value: elem.LocationHeardKey, label: elem.LocationHeardKey}
        })

        setLocationOptions(locationOptionsFiltered)
      }
  
// arrScientificNames = userChoice.length>0 && userChoice[0].value ==="Select All" && filterOption.map( elem => elem.ScientificNameKey )

// console.log(" arr: ", arrScientificNames)
      const arrScientificNames = userChoice.length>0 && userChoice.map( elemChoice => {        
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
      console.log("arrscientific : ", arrScientificNames)
      // console.log("userChoice: ", userChoice)

      // let LocationsPercentageSpecies = [];
      let mySum = 0;
      
      if(arrScientificNames.length > 0) {
        // console.log("paso el if arrScientificNames > 0 ")
        const totalArrays = arrScientificNames.reduce( (acc, curr) => {
          acc = acc.concat(curr);
          return acc
        })
        
        const newTotalMixedLocations = totalArrays.reduce( (acc, curr) => {
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

        const LocationsPercentageSpecies = newTotalMixedLocations.map( elem => {
            // console.log("elem value freqency: ", elem['value'])
             let percentageFrequencySp = ((elem['value']/mySum)*100).toFixed(2);
             elem['valuePercentage'] = percentageFrequencySp;

             return elem;
        })
    
      getSpecies(LocationsPercentageSpecies);
      getSpeciesSum(mySum);
    }      
      console.log("acabando el useeffect")
    },[userChoice, userChoiceRegion, filterOption])
  
    console.log("comenzando el return")
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

          <MyCustomSelect
            closeMenuOnSelect={true}
            components={animatedComponents}
            placeholder="Search a Region/State..."
            isMulti
            options={RegionOptions}
            onChange={(choice) => setUserChoiceRegion(choice)}
            value = {userChoiceRegion}
            allowSelectAll={true}
          />

          <p>If not region is selected you will be able to see a list of all the hotspot availbles</p>

          <MyCustomSelect
            closeMenuOnSelect={true}
            components={animatedComponents}
            placeholder="Search a Hotspot..."
            isMulti
            options={locationOptions}
            onChange={(choice) => setUserChoice(choice)}
            value = {userChoice}
            allowSelectAll={true}
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