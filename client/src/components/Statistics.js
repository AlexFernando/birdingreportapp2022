import React, {useState, useEffect, useLayoutEffect} from "react";
import AnimatedMulti from './SearchBoxLocations'
import styled, { css } from 'styled-components'

import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

import axios from 'axios';

//In another component you need to get the array of audio recorded birds, filter that from obs.details, then you need to get the data  
//(don't forget the code) required and build the link with the coe

const check = <FontAwesomeIcon icon={faCheck} size="xs" color="#007bff" />

const StatisticsComponent = () => {

    const [speciesList, setSpeciesList] = useState([]);
    const [speciesSum, setSpeciesSum] = useState(0);
    const [tagFilter, setTagFilter] = useState(''); 
    const [genereated, setGenerated] = useState(false);

    const getSpecies = (data) => {
        setSpeciesList(data)
        setTagFilter('')
    }

    const getSpeciesSum = (sum) => {
        setSpeciesSum(sum);
    }

    const handleDescendingOrder = () => {
        setSpeciesList([...speciesList].sort((a,b) => b.valuePercentage - a.valuePercentage))
        setTagFilter('Descending Percentage')
    }
    
    const handleAscendingOrder = () => {
        setSpeciesList([...speciesList].sort((a,b) => a.valuePercentage - b.valuePercentage))
        setTagFilter('Ascending Percentage')
    }

    const handleAlphabeticOrder = () => {
        setSpeciesList([...speciesList].sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)))
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
 
    return(
        <Container>
            <Title>Statistics</Title>
            
            <SearchBarContainer>
                <AnimatedMulti getSpecies = {getSpecies} getSpeciesSum={getSpeciesSum} />
            </SearchBarContainer>

            <FilterContainer>            
                <DropdownButton
                    as={ButtonGroup}
                    key="niceFilter"
                    id="dropdown-variants"
                    title="Order By"
                >
                    <Dropdown.Item eventKey="1" onClick = {handleDescendingOrder} >Descending %</Dropdown.Item>
                    <Dropdown.Item eventKey="2" onClick = {handleAscendingOrder} >Ascending %</Dropdown.Item>
                    <Dropdown.Item eventKey="3" onClick = {handleAlphabeticOrder}>Alphabetic</Dropdown.Item>
            
                </DropdownButton>

                <p><span>{check}</span>{tagFilter}</p>
            </FilterContainer>

            <TableContainer>
                <TableTag>
                    <tbody>
                        <TextTable>
                            <th>Scientific Name</th>
                            <th>English Name</th>
                            <th>Frequency</th>
                            <th>Percentage Frequency</th>
                        </TextTable>
                        {

                            speciesList.map(elem => {
                                return(
                                    <TextTable>
                                        <TextColumn>{elem['name']}</TextColumn>
                                        <TextColumn>{elem['CommonName']}</TextColumn>
                                        <td>{elem['value']}</td>
                                        <td>{elem['valuePercentage']}%</td>
                                    </TextTable>
                                )
                            })
                        }
                    </tbody>


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

    p{
        margin-bottom: 0;
        margin-left: calc(1rem);
        font-style: italic;
        font-weight: 500;
    }
`

const TableContainer = styled.div`
    margin-top: calc(2rem);
`

const TableTag = styled.table`
   width: 100%;
`
const TextTable = styled.tr`
    text-align: center;
    border:1px solid black;
`

const TextColumn = styled.td`
    text-align: justify;
`
