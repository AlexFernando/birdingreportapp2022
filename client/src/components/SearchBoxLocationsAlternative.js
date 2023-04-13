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

let RegionOptions = []

/**hacer un array para paises 3 en este caso, luego crear un useState de pais , y cuando cambie userChoiceCountry se llenan
 las respectivas regiones, basadas en el codigo , quizas tienes que emplear expresiones regualres.
 */

regionData.map(elem => {
    RegionOptions.push({value: elem['code'] , label:elem['State/Province_name']})
  }
)

const AnimatedMulti = ({getSpecies, getSpeciesSum}) => {

//probar a separar los effects
//sera buena practica tener default state?
    const [userChoice, setUserChoice] = useState([]);
    const [userChoiceRegion, setUserChoiceRegion] = useState([]);
    const [filterOption, setFilterOptions] = useState([])
    const [tagFilterData, setTagFilterData] = useState("")


    /**NEW STATES */
    const [locationOptions, setLocationOptions] = useState([]);
    //**END NEW STATES */

    /**START handler for updating region choices */
    const handleOnChangeRegionChoices = (choicesRegion) => {
      setUserChoiceRegion(choicesRegion);
    }

    /**START handler for update userChoices */

    const handleOnchageChoicesLocations = (newChoices) => {
      setUserChoice(newChoices)
    }

    const handleChoicesOnFilterOption = (choices, newData) => {
      const updatedChoices = choices.length>0 && choices.map( elemChoice => {   
        
        if(elemChoice['value']) {
          const objLocName = newData.find( elem => elem.LocationHeardKey === elemChoice.value)

          if(objLocName !== undefined) {
            return elemChoice;
          }
        }
     
      }).filter(Boolean)
      return updatedChoices;
    }

    //**START handlers for species based on Obs. Details */

    const handleFilterOptionClick = (option) => {
    
        switch (option) {
          case 'Only Heard':
            console.log("userChoice Heard Data: ", userChoice)
            setFilterOptions(data)
            const updatedChoices = handleChoicesOnFilterOption(userChoice, data);
            setUserChoice(updatedChoices)
            setTagFilterData("Only Heard")
            break;
          case 'Heard and Seen':
            setFilterOptions(heardSeenData)
            const updatedChoicesSecond = handleChoicesOnFilterOption(userChoice, heardSeenData);
            setUserChoice(updatedChoicesSecond)
            setTagFilterData("Heard and Seen")
            break;
          case 'Only Seen':
            setFilterOptions(noObsDetailsData)
            const updatedChoicesThird = handleChoicesOnFilterOption(userChoice, noObsDetailsData);
            setUserChoice(updatedChoicesThird)
            setTagFilterData("Seen - (Not relevant Obs. Details)")
            break;
          case 'All Type of Obervations':
            setFilterOptions(allSpecies)
            const updatedChoicesFour = handleChoicesOnFilterOption(userChoice, allSpecies);
            setUserChoice(updatedChoicesFour)
            setTagFilterData("All Types of Observations")
            break;
          default:
            break;
        }
      };

    //** END handlers for species based on Obs. Details */

    useEffect(() => {

        const arrOfRegions = userChoiceRegion.length>0 && userChoiceRegion.map( elemRegionChoice => {
          return filterOption.filter( elem => elem.Region === elemRegionChoice.value)
        })
  
        const locationsFilteredByRegions = arrOfRegions.length>0 && arrOfRegions.reduce( (acc, curr) => {
          acc = acc.concat(curr);
          return acc    
        })

          if(locationsFilteredByRegions.length > 0){

            // setLocationOptions([])

            let locationOptionsFiltered = locationsFilteredByRegions.map(elem => {
              return { value: elem.LocationHeardKey, label: elem.LocationHeardKey}
            })

            setLocationOptions(locationOptionsFiltered)
          }
  
          else {
            setLocationOptions([])
          }
      
  
      // else {
   
      //   console.log("segunda condicion si esto no se cumple userChoiceRegion.length>0)")
      //   let locationOptionsFiltered = filterOption.map(elem => {
      //     return { value: elem.LocationHeardKey, label: elem.LocationHeardKey}
      //   })

      //   setLocationOptions(locationOptionsFiltered)
      // }

    },[userChoiceRegion, filterOption])



    useEffect(() => {


      let choicesTakenOut = [];

      console.log("en useEffect: ", userChoice)
      const arrScientificNames = userChoice.length>0 && userChoice.map( elemChoice => {        
          const objLocName = filterOption.find( elem => elem.LocationHeardKey === elemChoice.value)

          if(objLocName !== undefined) {
            return objLocName.ScientificNameKey
          }
  
          else {
            choicesTakenOut.push(elemChoice)
            return null;
          }
        
      }).filter(Boolean);

      // if(choicesTakenOut.length>0){
      //   setUserChoice(userChoice.pop())

      // }

      // console.log("state userChoice: ", userChoice)
    
      // if(choicesTakenOut.length > 0){
      //   console.log("mi length es mayor a 1")
      //   const choicesLocationsFiltered = userChoice.length>0 && userChoice.map( elemUserChoice => {
      //     return choicesTakenOut.find( elemTakenOut => elemTakenOut.value !== elemUserChoice.value);
      //   })

      //   console.log("choices to take out : ", choicesLocationsFiltered)
  
      //   setUserChoice(choicesLocationsFiltered);
        
      // }

  
      let mySum = 0;
      
      if(arrScientificNames.length > 0) {

        const totalArrays = arrScientificNames.reduce( (acc, curr) => {
          acc = acc.concat(curr);
          return acc
        })

      
        const newTotalMixedLocations = totalArrays.reduce( (acc, curr) => {
          let index = acc.findIndex(singleObj => {

            if(curr && curr.name) {
              return singleObj["name"] === curr["name"]
            }

          });

          if (index >= 0) {
            
              let originalValue = acc[index]["value"];
          
              originalValue += curr["value"];
       
              // acc[index]["value"] = originalValue;

              acc[index] = Object.assign({}, acc[index], { value: originalValue });
          }  

          else {
              // acc.push(curr);
              acc.push(Object.assign({}, curr));
          }
      
          return acc;
        }, []);

        newTotalMixedLocations.map( elem => {
            if( elem && elem.value){
              mySum += elem['value']
            }

        })

        const LocationsPercentageSpecies = newTotalMixedLocations.map( elem => {
          if( elem && elem.value){
            let percentageFrequencySp = ((elem['value']/mySum)*100).toFixed(2);
            elem['valuePercentage'] = percentageFrequencySp;

            return elem;
          }
          
        })
    
      getSpecies(LocationsPercentageSpecies);
      getSpeciesSum(mySum);
    }    
    
    else {
      getSpecies([]);
    }

  
    },[userChoice, filterOption])
  

    return (

      <>
        <p>When you select a Region and "Filter by" option, you will be able to see a list of hotspots in the second bar related to the selected region(s)</p>
        <FilterContainer>

        <DropdownButton
            as={ButtonGroup}
            key="niceFilter"
            id="dropdown-variants"
            title="Filter By"
        >
            <Dropdown.Item eventKey="1" onClick={() => handleFilterOptionClick('Only Heard')} >Only Heard</Dropdown.Item>
            <Dropdown.Item eventKey="2" onClick={() => handleFilterOptionClick('Heard and Seen')} >Heard and Seen</Dropdown.Item>
            <Dropdown.Item eventKey="3" onClick={() => handleFilterOptionClick('Only Seen')} >Only Seen</Dropdown.Item>
            <Dropdown.Item eventKey="4" onClick={() => handleFilterOptionClick('All Type of Obervations')} >All Type Of Observations</Dropdown.Item>
    
        </DropdownButton>

        <p><span>{check}</span>{tagFilterData}</p>

        </FilterContainer>

        <SelectContainer>
          


          <MyCustomSelect
            closeMenuOnSelect={true}
            components={animatedComponents}
            placeholder="Search a Region/State..."
            isMulti
            options={RegionOptions}
            onChange={(choice) => handleOnChangeRegionChoices(choice)}
            value = {userChoiceRegion}
            allowSelectAll={true}
          />

          <p>If not region is selected you won't be able to see a list of all the hotspot availbles</p>

          <MyCustomSelect
            closeMenuOnSelect={true}
            components={animatedComponents}
            placeholder="Search a Hotspot..."
            isMulti
            options={locationOptions}
            // onChange={(choice) => setUserChoice(choice)}
            onChange = {(choice) => handleOnchageChoicesLocations(choice)}
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