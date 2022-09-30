import React from "react";
import reverseString from '../helpers.js/reverseDates'

const fs = require('fs');
const csv = require('csv-parser');

let results = []; //to save data after reading the file
let filteredData = []; // data ready to write on the file 


const LogicStatistics = () => {

    return(
        <div>
            <h1>Statistics</h1>
        </div>
    )
}

export default LogicStatistics;