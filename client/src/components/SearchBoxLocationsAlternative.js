import React, {useState , useEffect} from 'react';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import allSpecies from './allSpecies.json'
import audioRecordedJson from './uploadedFiles/audioRecorded.jsonld'
import onlyHeardDataJson from './uploadedFiles/onlyHeard.jsonld'
import heardData from './MyHeardSpecies.json'
import heardDataJson from './uploadedFiles/allHeardSpecies.jsonld'
import heardGlimplsedJson from './uploadedFiles/heardAndGlimpsed.jsonld'
import glimpsedJson from './uploadedFiles/glimpsed.jsonld'
import heardSeenData from './MyHeardSeenSpecies.json'
import heardSeenJson from './uploadedFiles/heardSeenSpecies.jsonld'
import noObsDetailsData from './noObsDetailsSpecies.json'
import seenJson from './uploadedFiles/noObsDetailsObj.jsonld'
import noFilterJson from './uploadedFiles/noFilterObj.jsonld'

import regionData from './regions.json'
import styled, { css } from 'styled-components'

/**Bootstrap calls */
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import {FilterContainer} from './Statistics'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import MyCustomSelect from './MyCustomSelect';

/**IMPORT REACT SELECT */


const check = <FontAwesomeIcon icon={faCheck} size="xs" color="#007bff" />

const animatedComponents = makeAnimated();

let CountryOptions = [
  {value: "PE-" , label: "Perú"},
  {value: "CO-" , label: "Colombia"},
  {value: "EC-" , label: "Ecuador"}
]

const AnimatedMulti = ({getSpecies, getSpeciesSum}) => {

  const [audioRecordedData, setAudioRecordedData] = useState([])
  const [onlyHeardData, setOnlyHeardData] = useState([]);
  const [allHeardDataJson, setAllHeardDataJson] = useState([]);
  const [heardAndGlimpsedJson, setHeardAndGlimpsedJson ] = useState([]);
  const [onlyGlimpsedJson, setOnlyGlimpsedJson] = useState([])
  const [heardAndSeenJson, setHeardAndSeenJson] = useState([])
  const [onlySeen, setOnlySeen] = useState([])
  const [noFilter, setNoFilter] = useState([])


  useEffect(() => {
    async function fetchDataZero() {
      const response = await fetch(audioRecordedJson);
      const data = await response.json();
      setAudioRecordedData(data);
    }

    fetchDataZero();

    async function fetchData() {
      const response = await fetch(onlyHeardDataJson);
      const data = await response.json();
      setOnlyHeardData(data);
    }

    fetchData();

    async function fetchDataOne() {
      const response = await fetch(heardDataJson);
      const data = await response.json();
      setAllHeardDataJson(data);
    }

    fetchDataOne();

    async function fetchDataTwo() {
      const response = await fetch(heardGlimplsedJson);
      const data = await response.json();
      setHeardAndGlimpsedJson(data);
    }

    fetchDataTwo();

    async function fetchDataThree() {
      const response = await fetch(glimpsedJson);
      const data = await response.json();
      setOnlyGlimpsedJson(data);
    }

    fetchDataThree();

    async function fetchDataFour() {
      const response = await fetch(heardSeenJson);
      const data = await response.json();
      setHeardAndSeenJson(data);
    }

    fetchDataFour();

    async function fetchDataFive() {
      const response = await fetch(seenJson);
      const data = await response.json();
      setOnlySeen(data);
    }

    fetchDataFive();

    async function fetchDataSix() {
      const response = await fetch(noFilterJson);
      const data = await response.json();
      setNoFilter(data);
    }

    fetchDataSix();
  }, []);

    console.log("audio recorded", audioRecordedData)
    console.log("onlyHeard: ", onlyHeardData);
    console.log("allheard: ", allHeardDataJson);
    console.log("heard and glimpsed: ", heardAndGlimpsedJson);
    console.log("Glimpsed: ", onlyGlimpsedJson);
    console.log("heard seen: ", heardAndSeenJson)
    console.log("seen: ", onlySeen)
    console.log("noFilter: ", noFilter)

    const [userChoiceCountry, setUserChoiceCountry] = useState([])

    const [userChoice, setUserChoice] = useState([]);
    const [userChoiceRegion, setUserChoiceRegion] = useState([]);
    const [filterOption, setFilterOptions] = useState([])
    const [tagFilterData, setTagFilterData] = useState("")

    /**STATE FOR DROPDOWN LIST SEARCH REGION */
    const [regionOptions, setRegionOptions] = useState([])
  
    /**NEW STATES */
    const [locationOptions, setLocationOptions] = useState([]);
    //**END NEW STATES */
  
    /**START handler for updating country choices */
    const handleOnChangeCountryChoices = (choicesCountry) => {
      console.log("country choices", choicesCountry);
      setUserChoiceCountry(choicesCountry);
    }          

    /**START handler for updating region choices */
    const handleOnChangeRegionChoices = (choicesRegion, action) => {
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
          case 'Audio Recorded':
            console.log("userChoice Audio Recorded: ", userChoice)
            setFilterOptions(audioRecordedData)
            const updatedChoices = handleChoicesOnFilterOption(userChoice, audioRecordedData);
            setUserChoice(updatedChoices)
            setTagFilterData("Audio Recorded")
            break;
          case 'Only Heard':
            console.log("userChoice Heard Data: ", userChoice)
            setFilterOptions(onlyHeardData)
            const updatedChoicesOne = handleChoicesOnFilterOption(userChoice, onlyHeardData);
            setUserChoice(updatedChoicesOne)
            setTagFilterData("Only Heard")
            break;
          
          case 'Heard Included': 
            setFilterOptions(allHeardDataJson)
            const updatedChoicesSecond = handleChoicesOnFilterOption(userChoice, allHeardDataJson);
            setUserChoice(updatedChoicesSecond)
            setTagFilterData("Heard Included")
             break;

          case 'Heard and Seen':
            setFilterOptions(heardAndSeenJson)
            const updatedChoicesThird = handleChoicesOnFilterOption(userChoice, heardAndSeenJson);
            setUserChoice(updatedChoicesThird)
            setTagFilterData("Heard and Seen")
            break;

          case 'Heard and Glimpsed':
            setFilterOptions(heardAndGlimpsedJson)
            const updatedChoicesFour = handleChoicesOnFilterOption(userChoice, heardAndGlimpsedJson);
            setUserChoice(updatedChoicesFour)
            setTagFilterData("Heard and Glimpsed")
            break;
          case 'Glimpsed':
            setFilterOptions(onlyGlimpsedJson)
            const updatedChoicesFive = handleChoicesOnFilterOption(userChoice, onlyGlimpsedJson);
            setUserChoice(updatedChoicesFive)
            setTagFilterData("Glimpsed")
            break;
          case 'Only Seen':
            setFilterOptions(onlySeen)
            const updatedChoicesSix = handleChoicesOnFilterOption(userChoice, onlySeen);
            setUserChoice(updatedChoicesSix)
            setTagFilterData("Seen - (Not relevant Obs. Details)")
            break;
          case 'All Type of Obervations':
            setFilterOptions(noFilter)
            const updatedChoicesSeven = handleChoicesOnFilterOption(userChoice, noFilter);
            setUserChoice(updatedChoicesSeven)
            setTagFilterData("All Types of Observations")
            break;
          default:
            break;
        }
      };

    //** END handlers for species based on Obs. Details */


    /**This useEffect mainly update Regions based on the change of the country. Those Regions will be displayed as a dropdown list on the corresponding search bar */
    
    useEffect(() => {

      const RegionsListSearch = userChoiceCountry.length>0 && userChoiceCountry.map( elemCountryChoice => {
        return regionData.filter(elem => elem.code.includes(elemCountryChoice.value))
      })

      console.log("RegionList: ", RegionsListSearch)

      if(RegionsListSearch.length>0) {
       const RegionListSearchCleaned = [].concat(...RegionsListSearch);
        console.log("Region Cleaned: ", RegionListSearchCleaned)
        const RegionOptionList = RegionListSearchCleaned.map( elem => {
          return {value: elem['code'], label:elem['State/Province_name']}
        })
        setRegionOptions(RegionOptionList);
        // setUserChoiceRegion(RegionOptionList);
      }

      // else{
      //   setUserChoiceRegion([]);
      // }
    }, [userChoiceCountry])


    /**This useEffect mainly update hotspot locations based on the changes of the region. Those locations will be displayed as a dropdown list on the corresponding search bar */
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

        <FilterContainer>

        <DropdownButton
            as={ButtonGroup}
            key="niceFilter"
            id="dropdown-variants"
            title="Filter By"
        >
            <Dropdown.Item eventKey="1" onClick={() => handleFilterOptionClick('Audio Recorded')} >Audio Recorded</Dropdown.Item>
            <Dropdown.Item eventKey="2" onClick={() => handleFilterOptionClick('Only Heard')} >Only Heard</Dropdown.Item>
            <Dropdown.Item eventKey="3" onClick={() => handleFilterOptionClick('Heard Included')} >Heard Included</Dropdown.Item>
            <Dropdown.Item eventKey="4" onClick={() => handleFilterOptionClick('Heard and Glimpsed')} >Heard and Glimpsed</Dropdown.Item>
            <Dropdown.Item eventKey="5" onClick={() => handleFilterOptionClick('Glimpsed')} >Glimpsed</Dropdown.Item>
            <Dropdown.Item eventKey="6" onClick={() => handleFilterOptionClick('Heard and Seen')} >Heard and Seen</Dropdown.Item>
            <Dropdown.Item eventKey="7" onClick={() => handleFilterOptionClick('Only Seen')} >Only Seen</Dropdown.Item>
            <Dropdown.Item eventKey="8" onClick={() => handleFilterOptionClick('All Type of Obervations')} >All Type Of Observations</Dropdown.Item>
    
        </DropdownButton>

        <p><span>{check}</span>{tagFilterData}</p>

        </FilterContainer>

        <SelectContainer>
          <MyCustomSelect
            closeMenuOnSelect={true}
            components={animatedComponents}
            placeholder="Search a Country..."
            isMulti
            options={CountryOptions}
            onChange={(choice) => handleOnChangeCountryChoices(choice)}
            value = {userChoiceCountry}
            allowSelectAll={true}
          />

        <p>When you select a "Filter by" option, you will be able to see a list of Regions options</p>

          <MyCustomSelect
            closeMenuOnSelect={true}
            components={animatedComponents}
            placeholder="Search a Region/State..."
            isMulti
            options={regionOptions}
            onChange={(choice, action) => handleOnChangeRegionChoices(choice, action)}
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