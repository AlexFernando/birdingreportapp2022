import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDove } from '@fortawesome/free-solid-svg-icons'
import FileUpload from '../components/FileUpload';
import '../App.css';

const Home = () => {

    const bird = <FontAwesomeIcon icon={faDove} size="xs" color="#007bff" />

    return(
        <div className = "container mt-4">
        <h4 className="display-4 text-center mb-4">
    
            <p>{bird} Birding Report App</p>
        </h4>

        <FileUpload />
    </div>
    )

}

export default Home;