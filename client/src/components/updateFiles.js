import React, { Fragment, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDove } from '@fortawesome/free-solid-svg-icons'
import UpdatePersonalData from './updatePersonalData'
import UpdateMainData from './updateMainData'
import UpdateRestrictionData from './updateRestrictionData';
import UpdatePresencenData from './updatePresenceData';
import UpdateConservationData from './UpdateConservationData'

const UpdateFiles = () => {

    const bird = <FontAwesomeIcon icon={faDove} size="xs" color="#007bff" />

    return(
        <div className = "container mt-4">
            <h4 className="display-4 text-center mb-4">
        
                <p>{bird} Update Files</p>
            </h4>

            <UpdatePersonalData />
            <UpdateMainData />
            <UpdateRestrictionData />
            <UpdatePresencenData />
            <UpdateConservationData />

        </div>
    )

}

export default UpdateFiles;