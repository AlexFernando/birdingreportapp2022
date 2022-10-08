import React, {useState, useEffect, useLayoutEffect} from "react";
import AnimatedMulti from './SearchBoxLocations'

const StatisticsComponent = () => {

    const [speciesList, setSpeciesList] = useState([]);
    const [speciesSum, setSpeciesSum] = useState(0);

    const getSpecies = (data) => {
        setSpeciesList(data)
    }

    const getSpeciesSum = (sum) => {
        setSpeciesSum(sum);
    }

    return(
        <div>
            <h1>Statistics</h1>
                <AnimatedMulti getSpecies = {getSpecies} getSpeciesSum={getSpeciesSum} />
            <div>
            <p>Frequency of Species: {speciesSum}</p>
            {

                speciesList.map(elem => {
                    return(
                        

                        <p>
                            <span>{elem['name']}  : </span>
                            &nbsp;<span>{elem['value']}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <span>{elem['valuePercentage']}%</span>
                            
                        </p>

                    
                    )
                })
            }
            </div>
        </div>
    )

}

export default StatisticsComponent;