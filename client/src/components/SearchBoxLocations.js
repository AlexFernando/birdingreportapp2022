import React, {useState , useEffect} from 'react';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';
// import audioRecordedJson from './writtenFiles/audioRecorded.jsonld'
// import onlyHeardDataJson from './writtenFiles/onlyHeard.jsonld'
// import heardDataJson from './writtenFiles/allHeardSpecies.jsonld'
// import heardGlimplsedJson from './writtenFiles/heardAndGlimpsed.jsonld'
// import glimpsedJson from './writtenFiles/glimpsed.jsonld'
// import heardSeenJson from './writtenFiles/heardSeenSpecies.jsonld'
// import seenJson from './writtenFiles/noObsDetailsObj.jsonld'
// import noFilterJson from './writtenFiles/noFilterObj.jsonld'

// import regionData from './writtenFiles/RegionsAlternative.jsonld'

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
  {value: "EC-" , label: "Ecuador"},
  {value: "AR-" , label: "Argentina"},
  {value: "CL-", label: "Chile"}, 
  {value: "UY-", label: "Uruguay"}, 
  {value: "FK-", label: "Falkland Islands (Malvinas)"}, 
  {value: "AQ-" , label: "Antartica"}, 
  {value: "XX-" , label: "High Seas"}

]

const AnimatedMulti = ({getSpecies}) => {

  const [audioRecordedData, setAudioRecordedData] = useState([])
  const [onlyHeardData, setOnlyHeardData] = useState([]);
  const [allHeardDataJson, setAllHeardDataJson] = useState([]);
  const [heardAndGlimpsedJson, setHeardAndGlimpsedJson ] = useState([]);
  const [onlyGlimpsedJson, setOnlyGlimpsedJson] = useState([])
  const [heardAndSeenJson, setHeardAndSeenJson] = useState([])
  const [onlySeen, setOnlySeen] = useState([])
  const [noFilter, setNoFilter] = useState([])

  //Regions countries
  const [allDataRegion, setAllDataRegion] = useState([]);

  useEffect(() => {
    console.log('antes de importar los files')
    Promise.all([
      import('./writtenFiles/audioRecorded.jsonld'),
      import('./writtenFiles/onlyHeard.jsonld'),
      import('./writtenFiles/allHeardSpecies.jsonld'),
      import('./writtenFiles/heardAndGlimpsed.jsonld'),
      import('./writtenFiles/glimpsed.jsonld'),
      import('./writtenFiles/heardSeenSpecies.jsonld'),
      import('./writtenFiles/noObsDetailsObj.jsonld'),
      import('./writtenFiles/noFilterObj.jsonld'),
      import('./writtenFiles/RegionsAlternative.jsonld')
    ])
      .then(async data => {
        const audioRecordedData = await fetch(data[0].default).then(res => res.json());
        const onlyHeardData = await fetch(data[1].default).then(res => res.json());
        const allHeardDataJson = await fetch(data[2].default).then(res => res.json());
        const heardAndGlimpsedJson = await fetch(data[3].default).then(res => res.json());
        const onlyGlimpsedJson = await fetch(data[4].default).then(res => res.json());
        const heardAndSeenJson = await fetch(data[5].default).then(res => res.json());
        const onlySeen = await fetch(data[6].default).then(res => res.json());
        const noFilter = await fetch(data[7].default).then(res => res.json());
        const RegionData = await fetch(data[8].default).then(res => res.json());
  
        setAudioRecordedData(audioRecordedData);
        setOnlyHeardData(onlyHeardData);
        setAllHeardDataJson(allHeardDataJson);
        setHeardAndGlimpsedJson(heardAndGlimpsedJson);
        setOnlyGlimpsedJson(onlyGlimpsedJson);
        setHeardAndSeenJson(heardAndSeenJson);
        setOnlySeen(onlySeen);
        setNoFilter(noFilter);
        setAllDataRegion(RegionData)
      })
      .catch(error => {
        console.error(error);
      });
      console.log('despues de importar los files')
  }, []);



  // useEffect(() => {
  //   async function fetchDataZero() {
  //     const response = await fetch(audioRecordedJson);
  //     const data = await response.json();
  //     setAudioRecordedData(data);
  //   }

  //   fetchDataZero();

  //   async function fetchData() {
  //     const response = await fetch(onlyHeardDataJson);
  //     const data = await response.json();
  //     setOnlyHeardData(data);
  //   }

  //   fetchData();

  //   async function fetchDataOne() {
  //     const response = await fetch(heardDataJson);
  //     const data = await response.json();
  //     setAllHeardDataJson(data);
  //   }

  //   fetchDataOne();

  //   async function fetchDataTwo() {
  //     const response = await fetch(heardGlimplsedJson);
  //     const data = await response.json();
  //     setHeardAndGlimpsedJson(data);
  //   }

  //   fetchDataTwo();

  //   async function fetchDataThree() {
  //     const response = await fetch(glimpsedJson);
  //     const data = await response.json();
  //     setOnlyGlimpsedJson(data);
  //   }

  //   fetchDataThree();

  //   async function fetchDataFour() {
  //     const response = await fetch(heardSeenJson);
  //     const data = await response.json();
  //     setHeardAndSeenJson(data);
  //   }

  //   fetchDataFour();

  //   async function fetchDataFive() {
  //     const response = await fetch(seenJson);
  //     const data = await response.json();
  //     setOnlySeen(data);
  //   }

  //   fetchDataFive();

  //   async function fetchDataSix() {
  //     const response = await fetch(noFilterJson);
  //     const data = await response.json();
  //     setNoFilter(data);
  //   }

  //   fetchDataSix();

  //   async function fetchDataRegion() {
  //     const response = await fetch(regionData);
  //     const data = await response.json();
  //     setAllDataRegion(data);
  //   }

  //   fetchDataRegion();
  // }, []);

    // console.log("audio recorded", audioRecordedData)
    // console.log("onlyHeard: ", onlyHeardData);
    // console.log("allheard: ", allHeardDataJson);
    // console.log("heard and glimpsed: ", heardAndGlimpsedJson);
    // console.log("Glimpsed: ", onlyGlimpsedJson);
    // console.log("heard seen: ", heardAndSeenJson)
    // console.log("seen: ", onlySeen)
    // console.log("noFilter: ", noFilter)

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
      // console.log("country choices", choicesCountry);
      setUserChoiceCountry(choicesCountry);
    }          

    /**START handler for updating region choices */
    const handleOnChangeRegionChoices = (choicesRegion) => {
      // console.log("Region choices", choicesRegion);
      setUserChoiceRegion(choicesRegion);      
    }

    /**START handler for update userChoices */

    const handleOnchageChoicesLocations = (newChoices) => {
      // console.log("new locations choices: ", newChoices)
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
            // console.log("userChoice Audio Recorded: ", userChoice)
            setFilterOptions(audioRecordedData)
            const updatedChoices = handleChoicesOnFilterOption(userChoice, audioRecordedData);
            setUserChoice(updatedChoices)
            setTagFilterData("Audio Recorded")
            break;
          case 'Only Heard':
            // console.log("userChoice Heard Data: ", userChoice)
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

      if(userChoiceCountry.length === 0 ) {
        setUserChoiceRegion([]);
      }

      const RegionsListSearch = userChoiceCountry.length>0 && userChoiceCountry.map( elemCountryChoice => {
        return allDataRegion.filter(elem => elem.code.includes(elemCountryChoice.value))
      })

      if(RegionsListSearch.length>0) {
       const RegionListSearchCleaned = [].concat(...RegionsListSearch);

        const RegionOptionList = RegionListSearchCleaned.map( elem => {
          return {value: elem['code'], label:elem['State/Province_name']}
        })
        
        setRegionOptions(RegionOptionList);

        console.log("RegionList: ", RegionOptionList, "region choices: ", userChoiceRegion);

        let newArrUserRegionChoices = userChoiceRegion.length>0 && userChoiceRegion.map( elemChoice => {        
          const objLocName = RegionOptionList.find( elem => elem.value === elemChoice.value)

          if(objLocName !== undefined) {
            return objLocName
          }

          else {
            return null;
          }
        }).filter(Boolean);

        setUserChoiceRegion(newArrUserRegionChoices)
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
            console.log("Entrando a elegir los nuevos choices locales")
            let newArrUserChoices = userChoice.length>0 && userChoice.map( elemChoice => {        
              const objLocName = locationOptionsFiltered.find( elem => elem.value === elemChoice.value)
    
              if(objLocName !== undefined) {
                return objLocName
              }

              else {
                return null;
              }
            }).filter(Boolean);
    

            setLocationOptions(locationOptionsFiltered)
            setUserChoice(newArrUserChoices);

            console.log("Saliendo de elegir los nuevos choices locales")
          }
  
          else {
            setLocationOptions([])
            setUserChoice([]);
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
      console.log("entrando de construir array de data")
      console.log("en useEffect: ", userChoice)
      const arrScientificNames = userChoice.length>0 && userChoice.map( elemChoice => {        
          const objLocName = filterOption.find( elem => elem.LocationHeardKey === elemChoice.value)

          if(objLocName !== undefined) {
            return objLocName.species
          }
  
          else {
            choicesTakenOut.push(elemChoice)
            return null;
          }
        
      }).filter(Boolean);

      let totalArrays = []

      if(arrScientificNames.length > 0) {

        totalArrays = arrScientificNames.reduce( (acc, curr) => {
          acc = acc.concat(curr);
          return acc
      })

      }

      console.log("total arrays: ", totalArrays)
      console.log("saliendo de construir array de data")
      
    let sum = totalArrays.length;


    const frequency = {};
    for (let item of totalArrays) {
      const key = item['ScientificNameKey'];
      if (!frequency[key]) {
        frequency[key] = 0;
      }
      frequency[key]++;
    }
  
    const result = [];


    for (let item of totalArrays) {
      const key = item['ScientificNameKey'];
      const frequencyValue = frequency[key] > 1 ? frequency[key] : 1;
      const percentageFreq = ((frequencyValue/sum)*100).toFixed(2);

      result.push({
        'ScientificName': key,
        'CommonName': item['CommonName'],
        'Frequency': frequencyValue,
        'Percentage': percentageFreq,
        'TaxonomicOrder': item['TaxonomicOrder']
      });
    }
  

    console.log("result: ", result);

    const newResult = Object.values(result.reduce((acc, obj) => {
        const key = obj.ScientificName; // the key that we want to check for duplicates
      
        if (!acc[key]) {
          // if the key does not exist, add the object to the accumulator
          acc[key] = obj;
        }
      
        return acc;
    }, {}));

    console.log("my sum: ", sum);
    console.log("new arr og objs: ", newResult)
    getSpecies(totalArrays, newResult);
  
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