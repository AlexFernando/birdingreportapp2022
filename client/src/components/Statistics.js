import React, {useState, useEffect, useLayoutEffect} from "react";
import AnimatedMulti from './SearchBoxLocations'
import styled, { css } from 'styled-components'

import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import {Button } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

import axios from 'axios';

import MyForm from './ModalForm'

import UpdateStatsButton from './UpdateStatsButton'

//In another component you need to get the array of audio recorded birds, filter that from obs.details, then you need to get the data  
//(don't forget the code) required and build the link with the coe

const check = <FontAwesomeIcon icon={faCheck} size="xs" color="#007bff" />

const StatisticsComponent = () => {

    const [speciesList, setSpeciesList] = useState([]);
    const [seasonSpeciesList, setSeasonSpeciesList] = useState([])
    const [speciesAccumulated, setSpeciesAccumulated] = useState([])
    const [seasonSpeciesAcc, setSeasonSpeciesAcc] = useState([])
    const [speciesSum, setSpeciesSum] = useState(0);
    const [tagFilter, setTagFilter] = useState(''); 
    const [genereated, setGenerated] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");


    /**BUTTON SWITCH TABLES */
    const [stateData, setStateData] = useState('Disaggregated Data')

    /**Item Switch color */
    const [activeItem, setActiveItem] = useState(0);

    const handleItemClick = itemIndex => {
      setActiveItem(itemIndex);

      if(itemIndex === 0) {
        setStateData('Disaggregated Data')
      }
      else {
        setStateData('Frequency Data')
      }
    };

    const getSpecies = (data, dataFrequency) => {
        setSpeciesList(data)
        setSpeciesAccumulated(dataFrequency)
        setTagFilter('')
    }

    // const getSpeciesSum = (sum) => {
    //     setSpeciesSum(sum);
    // }

    const handleDescendingOrder = () => {
        setSpeciesList([...speciesList].sort((a,b) => b.TaxonomicOrder - a.TaxonomicOrder))
        setSeasonSpeciesList([...seasonSpeciesList].sort((a,b) => b.TaxonomicOrder - a.TaxonomicOrder))
        setSpeciesAccumulated([...speciesAccumulated].sort((a,b) => b.TaxonomicOrder - a.TaxonomicOrder))
        setSeasonSpeciesAcc([...seasonSpeciesAcc].sort((a,b) => b.TaxonomicOrder - a.TaxonomicOrder))
        setTagFilter('Ascending Taxonomic Order')
    }
    
    const handleAscendingOrder = () => {
        setSpeciesList([...speciesList].sort((a,b) => a.TaxonomicOrder - b.TaxonomicOrder))
        setSeasonSpeciesList([...seasonSpeciesList].sort((a,b) => a.TaxonomicOrder - b.TaxonomicOrder))
        setSpeciesAccumulated([...speciesAccumulated].sort((a,b) => a.TaxonomicOrder - b.TaxonomicOrder))
        setSeasonSpeciesAcc([...seasonSpeciesAcc].sort((a,b) => a.TaxonomicOrder - b.TaxonomicOrder))
        setTagFilter('Descending Taxonomic Order')
    }

    const handleAlphabeticOrder = () => {
        setSpeciesList([...speciesList].sort((a,b) => (a.ScientificNameKey > b.ScientificNameKey) ? 1 : ((b.ScientificNameKey > a.ScientificNameKey) ? -1 : 0)))
        setSeasonSpeciesList([...seasonSpeciesList].sort((a,b) => (a.ScientificNameKey > b.ScientificNameKey) ? 1 : ((b.ScientificNameKey > a.ScientificNameKey) ? -1 : 0)))
        setSpeciesAccumulated([...speciesAccumulated].sort((a,b) => (a.ScientificName > b.ScientificName) ? 1 : ((b.ScientificName > a.ScientificName) ? -1 : 0)))
        setSeasonSpeciesAcc([...seasonSpeciesAcc].sort((a,b) => (a.ScientificName > b.ScientificName) ? 1 : ((b.ScientificName > a.ScientificName) ? -1 : 0)))
        setTagFilter('Alphabetic Order')
    }

    const handleFrequencyAscending = () => {
        setSpeciesAccumulated([...speciesAccumulated].sort((a,b) => a.Frequency - b.Frequency))
        setSeasonSpeciesAcc([...seasonSpeciesAcc].sort((a,b) => a.Frequency - b.Frequency))
        setTagFilter('Frequency Ascending Order')
    }

    const handleFrequencyDescending = () => {
        setSpeciesAccumulated([...speciesAccumulated].sort((a,b) => b.Frequency - a.Frequency))
        setSeasonSpeciesAcc([...seasonSpeciesAcc].sort((a,b) => b.Frequency - a.Frequency))
        setTagFilter('Frequency Descending Order')
    }

    const handleDateDescending = () => {
        setSpeciesList([...speciesList].sort((a, b) => (new Date(b.MyDate).getTime() - new Date(a.MyDate).getTime())));
        setSeasonSpeciesList([...seasonSpeciesList].sort((a, b) => (new Date(b.MyDate).getTime() - new Date(a.MyDate).getTime())));
        setTagFilter('Newest Date')
    }

    const handleDateAscending = () => {
        setSpeciesList([...speciesList].sort((a, b) => (new Date(a.MyDate).getTime() - new Date(b.MyDate).getTime())));
        setSeasonSpeciesList([...seasonSpeciesList].sort((a, b) => (new Date(a.MyDate).getTime() - new Date(b.MyDate).getTime())));
        setTagFilter('Oldest Date')
    }


    //Download Stats file

  const onSubmitDownload = (e) => {
    e.preventDefault()
    window.open('/downloadstats');
    console.log('great')
  }

  const handleStateListForRequest = () => {
    const sendSpeciesList = async () => {
        const res =  await axios.post('/writestats', {myStats: speciesList})
        .then(res => console.log("res.data: ", res.data))
        .catch(err => console.log(err.data))

        }  
        sendSpeciesList()

        setGenerated(true)
  }

  const handleResetDates = () => {
    setSeasonSpeciesList([])
    setSeasonSpeciesAcc([])
  }


     return(
        <Container>
            <Title>Statistics</Title>
            <div className="col-md-12 text-right">
                      
                            <UpdateStatsButton />
                    
                        </div>
            <SearchBarContainer>
                <AnimatedMulti getSpecies = {getSpecies} />
            </SearchBarContainer>

         

            <FilterContainer>            
                <DropdownButton
                    as={ButtonGroup}
                    key="niceFilter"
                    id="dropdown-variants"
                    title="Order By"
                >
                    <Dropdown.Item eventKey="1" onClick = {handleDescendingOrder} >Ascending Taxonomic Order</Dropdown.Item>
                    <Dropdown.Item eventKey="2" onClick = {handleAscendingOrder} >Descending Taxonomic Order</Dropdown.Item>
                    <Dropdown.Item eventKey="3" onClick = {handleAlphabeticOrder}>Alphabetic</Dropdown.Item>        
                    <Dropdown.Item eventKey="4" onClick = {handleFrequencyAscending}>Frequency Ascending Order</Dropdown.Item>     
                    <Dropdown.Item eventKey="5" onClick = {handleFrequencyDescending}>Frequency Descending Order</Dropdown.Item>    
                    <Dropdown.Item eventKey="6" onClick = {handleDateDescending}>Newest Date</Dropdown.Item>   
                    <Dropdown.Item eventKey="7" onClick = {handleDateAscending}>Oldest Date</Dropdown.Item>       
                </DropdownButton>

                {
                    tagFilter === '' ? 
                        <p>No filter Selected</p>
                    :
                        <p><span>{check}</span>{tagFilter}</p>
                }
            </FilterContainer>

         
                <MyForm speciesListAll={speciesList} setSeasonSpeciesList={setSeasonSpeciesList} setSeasonSpeciesAcc={setSeasonSpeciesAcc}/>

                <ButtonCustom className="ml-2" variant="primary" type="submit"  onClick={handleResetDates}>
                    Reset Dates
                </ButtonCustom>

                <ListContainer>
                    <ListItem active={activeItem === 0} onClick={() => handleItemClick(0)}>Disaggregated Data</ListItem>
                    <ListItem active={activeItem === 1} onClick={() => handleItemClick(1)}>Frequency Data</ListItem>
                </ListContainer>

                <>
                    {
                        stateData === 'Disaggregated Data' ? 
                        
                            <TableContainer>
                                <TableTag className="table table-responsive-md">
                                    {
                                        speciesList.length === 0 ? <div><span>No stats to show, yet. You may choose a Hotspot</span></div>
                                    
                                    :
                                    <tbody>
                                        <TextTable>
                
                                            <th>Scientific Name</th>
                                            <th>Common Name</th>
                                            <th>Register Date</th>
                                            <th>Count</th>
                                            <th>Location Hotspot</th>
                                            <th>Nº Tax.</th>
                                        </TextTable>
                
                        
                                        {
                                            seasonSpeciesList.length>0 ? 

                                                seasonSpeciesList.map((elem, idx) => {
                                                  
                                                        return(
                                                
                                                            <TextTable key={idx}>
                
                                                                <TextColumnAlternative>{idx+1}{".-  "}{elem['ScientificNameKey']}</TextColumnAlternative>
                                                                <TextColumnAlternative>{elem['CommonName']}</TextColumnAlternative>
                                                                {
                                                                        elem['SubmissionID'] !== undefined? 
                                                                            <TextColumn>
                                                                                <a href={`https://ebird.org/peru/checklist/${elem['SubmissionID']}`} target="_blank" rel="noreferrer noopener">
                                                                                    {elem['MyDate']}
                                                                                </a>
                                                                            </TextColumn>
                                                                        :
                
                                                                        <TextColumn>{elem['MyDate']}</TextColumn>
                                                                    }
                                                                <TextColumn>{elem['Count']}</TextColumn>
                                                                <TextColumn>{elem['Location']}</TextColumn>
                                                                <TextColumn><span>{elem['TaxonomicOrder']}</span></TextColumn>
                                                            </TextTable>
                                                        )
                                                    
                                                })
                
                                                
                
                                            :
                                
                                                speciesList.length>0 && speciesList.map((elem, idx) => {
                                                 
                    
                                                        return(
                                                
                                                            <TextTable key={idx}>
            
                                                                <TextColumnAlternative>{idx+1}{".-  "}{elem['ScientificNameKey']}</TextColumnAlternative>
                                                                <TextColumnAlternative>{elem['CommonName']}</TextColumnAlternative>
                                                                {
                                                                    elem['SubmissionID'] !== undefined? 
                                                                        <TextColumn>
                                                                            <a href={`https://ebird.org/peru/checklist/${elem['SubmissionID']}`} target="_blank" rel="noreferrer noopener">
                                                                                {elem['MyDate']}
                                                                            </a>
                                                                        </TextColumn>
                                                                    :
            
                                                                    <TextColumn>{elem['MyDate']}</TextColumn>
                                                                }
            
                                                                <TextColumn>{elem['Count']}</TextColumn>
                                                                <TextColumn>{elem['Location']}</TextColumn>
                                                                <TextColumn><span>{elem['TaxonomicOrder']}</span></TextColumn>
                                                            </TextTable>
                                                        )
                                                    
                                                })
                                            
                                        }
                                            
                                    </tbody>
                                    }   
                                </TableTag>
            
                            </TableContainer>
        
                        : 
                        
                        <TableContainer>
                            <TableTag className="table table-responsive-md">
                                {
                                    speciesAccumulated.length === 0 ? <div><span>No stats to show, yet. You may choose a Hotspot</span></div>
                                
                                :
                                <tbody>
                                    <TextTable>
            
                                        <th>Scientific Name</th>
                                        <th>Common Name</th>
                                        <th>Frequency</th>
                                        <th>Percentage</th>
                                        <th>Nº Tax.</th>
                                    </TextTable>
            
                    
                                    {
                                                                                    seasonSpeciesAcc.length>0 ? 

                                                                                    seasonSpeciesAcc.map((elem, idx) => {
                                                                                      
                                                        
                                                                                            return(
                                                                                    
                                                                                                <TextTable key={idx}>
                                                    
                                                                                                    <TextColumnAlternative>{idx+1}{".-  "}{elem['ScientificNameKey']}</TextColumnAlternative>
                                                                                                    <TextColumnAlternative>{elem['CommonName']}</TextColumnAlternative>
                                                                                                    <TextColumn>{elem['Frequency']}</TextColumn>
                                                        <TextColumn>{elem['Percentage']}{"%"}</TextColumn>
                                                                                                    <TextColumn><span>{elem['TaxonomicOrder']}</span></TextColumn>
                                                                                                </TextTable>
                                                                                            )
                                                                                        
                                                                                    })
                :                                    
  
                                        speciesAccumulated.length>0 && speciesAccumulated.map((elem, idx) => {
                                          
                                                return(
                                        
                                                    <TextTable key={idx}>
                                                        <TextColumnAlternative>{idx+1}{".-  "}{elem['ScientificName']}</TextColumnAlternative>
                                                        <TextColumnAlternative>{elem['CommonName']}</TextColumnAlternative>
                                                        <TextColumn>{elem['Frequency']}</TextColumn>
                                                        <TextColumn>{elem['Percentage']}{"%"}</TextColumn>
                                                        <TextColumn><span>{elem['TaxonomicOrder']}</span></TextColumn>
                                                    </TextTable>
                                                )
                                            
                                        })
                                    }
                                        
                                </tbody>
                                }   
                            </TableTag>
    
                        </TableContainer>
                
                    }
                </>
        

  
            {/**Download file */}
            {
                speciesList.length > 0?    
                    <input onClick={handleStateListForRequest} type='submit'value='Generate Report' className='btn btn-primary btn-block mt-4'/>
                :null
            }
                
            {
                genereated ? <div className="text-center">
                <form onSubmit = {onSubmitDownload} >
                  <input type="submit" value="Download" className="btn btn-primary btn-block mt-4" target="_self"/>
                </form>
              </div> : null
            }
                  
        </Container>
    )

}

export default StatisticsComponent;

const Container = styled.div`
    color: #484848;
    margin: 3rem 1rem;
    padding-left: calc(4rem);
    padding-right: calc(4rem);
    line-height: 1.5;

    @media (max-width: 768px){
        padding-left: .5rem;
        padding-right: .5rem;
    }
`

const Title = styled.h1`
    font-size: 3rem;
    text-align: center;
`;

const SearchBarContainer = styled.div`
    margin-top: calc(2rem);
    margin-bottom: calc(2rem);
`
export const FilterContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 1rem;
    margin-bottom: 1rem;

    p{
        margin-bottom: 0;
        margin-left: calc(1rem);
        font-style: italic;
        font-weight: 500;
    }
`
const ButtonGroupDates = styled.div`
    display: flex;
    justify-content: space-evenly;
`

const TableContainer = styled.div`
    margin-top: calc(2rem);
`

const TableTag = styled.table`
   width: 100%;
`

const TextTable = styled.tr`
    
`

const TextColumn = styled.td`
    a {
        text-decoration: none;
        color: #000;
    }
`

const TextColumnAlternative = styled.td`
  
`

const DateYearSelect = styled.div`
    display: flex;
    justify-content: space-evenly;
`
const ListContainer = styled.ul`
    display: flex;
    justify-content: center;
    margin: 0;
    padding: 0;
    margin-top: 3rem;

`

const ListItem = styled.li`
    cursor: pointer;   
    list-style: none;
    text-decoration: none;
    text-transform: uppercase;
    font-weight: 500;
    margin: auto 3rem;
    color: ${props => (props.active ? "#0c0c0c" : "#a6a6a6")};
    border-bottom: ${props => props.active ? "2px solid #0c0c0c": "unset"};

`

const ButtonCustom = styled(Button)`
  background-color: #a84a04;
  border-color: #a84a04;
`