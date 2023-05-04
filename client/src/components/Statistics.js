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

//In another component you need to get the array of audio recorded birds, filter that from obs.details, then you need to get the data  
//(don't forget the code) required and build the link with the coe

const check = <FontAwesomeIcon icon={faCheck} size="xs" color="#007bff" />

const StatisticsComponent = () => {

    const [speciesList, setSpeciesList] = useState([]);
    const [seasonSpeciesList, setSeasonSpeciesList] = useState([])
    const [speciesSum, setSpeciesSum] = useState(0);
    const [tagFilter, setTagFilter] = useState(''); 
    const [genereated, setGenerated] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");

    const getSpecies = (data) => {
        setSpeciesList(data)
        setTagFilter('')
    }

    // const getSpeciesSum = (sum) => {
    //     setSpeciesSum(sum);
    // }

    const handleDescendingOrder = () => {
        setSpeciesList([...speciesList].sort((a,b) => b.TaxonomicOrder - a.TaxonomicOrder))
        setSeasonSpeciesList([...seasonSpeciesList].sort((a,b) => b.TaxonomicOrder - a.TaxonomicOrder))
        setTagFilter('Descending Taxonomic Order')
    }
    
    const handleAscendingOrder = () => {
        setSpeciesList([...speciesList].sort((a,b) => a.TaxonomicOrder - b.TaxonomicOrder))
        setSeasonSpeciesList([...seasonSpeciesList].sort((a,b) => a.TaxonomicOrder - b.TaxonomicOrder))
        setTagFilter('Ascending Taxonomic Order')
    }

    const handleAlphabeticOrder = () => {
        setSpeciesList([...speciesList].sort((a,b) => (a.ScientificNameKey > b.ScientificNameKey) ? 1 : ((b.ScientificNameKey > a.ScientificNameKey) ? -1 : 0)))
        setSeasonSpeciesList([...seasonSpeciesList].sort((a,b) => (a.ScientificNameKey > b.ScientificNameKey) ? 1 : ((b.ScientificNameKey > a.ScientificNameKey) ? -1 : 0)))
        setTagFilter('Alphabetic Order')
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
  }


     return(
        <Container>
            <Title>Statistics</Title>
            
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
                    <Dropdown.Item eventKey="1" onClick = {handleDescendingOrder} >Descending Taxonomic Order</Dropdown.Item>
                    <Dropdown.Item eventKey="2" onClick = {handleAscendingOrder} >Ascending Taxonomic Order</Dropdown.Item>
                    <Dropdown.Item eventKey="3" onClick = {handleAlphabeticOrder}>Alphabetic</Dropdown.Item>
            
                </DropdownButton>

                <p><span>{check}</span>{tagFilter}</p>
            </FilterContainer>

         
                <MyForm speciesListAll={speciesList}  setSeasonSpeciesList={setSeasonSpeciesList}/>

                <Button className="ml-2" variant="primary" type="submit"  onClick={handleResetDates}>
                    Reset Dates
                </Button>
        

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
                                    if (elem) {
    
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
                                    }
                                })

                                

                                :
                 
                                    speciesList.length>0 && speciesList.map((elem, idx) => {
                                        if (elem) {
        
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
                                        }
                                    })
                                
                        }
                            
     
                        
                        
         
                    </tbody>
                    }   
                </TableTag>

                {
                    speciesList.length > 0?    
                        <input onClick={handleStateListForRequest} type='submit'value='Generate Report' className='btn btn-primary btn-block mt-4'/>
                    :null
                }


            </TableContainer>

            {/**Download file */}

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
