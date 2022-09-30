import React, {useState, useEffect, useLayoutEffect} from "react";
import AnimatedMulti from './SearchBoxLocations'

const StatisticsComponent = () => {

    const [speciesList, setSpeciesList] = useState('');

    const getSpecies = (data) => {
        setSpeciesList(data)
    }

    return(
        <div>
            <h1>Statistics</h1>
                <AnimatedMulti getSpecies = {getSpecies}  />
            <div>
            {

                Object.keys(speciesList).map(elem => {
                    return(
                        <p>
                            <span>{elem}  : </span>
                            {speciesList[elem]}%
                            
                        </p>
                    )
                })
            }
            </div>
        </div>
    )

}

export default StatisticsComponent;