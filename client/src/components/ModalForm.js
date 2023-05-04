import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
const {findMatchingDates} = require('../helpers.js/MatchingDateRange');

const MyForm = ({speciesListAll, setSeasonSpeciesList}) => {
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [radioValue, setRadioValue] = useState('');
  const [startMonth, setStartMonth] = useState('');
  const [endMonth, setEndMonth] = useState('');

  const handleStartYearChange = (e) => {
    setStartYear(e.target.value);
  };

  const handleEndYearChange = (e) => {
    setEndYear(e.target.value);
  };

  const handleRadioChange = (e) => {
    console.log("radio value: ", e.target.id)
    let arrMonths = e.target.id.split("-")

    console.log("arrMonths: ", arrMonths)

    if(arrMonths.length > 0) {
      setStartMonth(arrMonths[0])
      setEndMonth(arrMonths[1])
    }
  };

  const handleStartMonthChange = (e) => {
    setStartMonth(e.target.value)
  }

  const handleEndMonthChange = (e) => {
    setEndMonth(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Start Year:', startYear);
    console.log('End Year:', endYear);
    console.log('start month:', startMonth)
    console.log('End month:', endMonth)

    const MyNewSpecies = findMatchingDates(speciesListAll, startYear, endYear, startMonth, endMonth)

    setSeasonSpeciesList(MyNewSpecies);
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // const handleResetDates = () => {
  //   setSeasonSpeciesList([])
  // }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Change Dates
      </Button>

      {/* <Button className="ml-2" variant="primary" type="submit"  onClick={handleResetDates}>
                    Reset Dates
                </Button> */}

      <Modal show={show} onHide={handleClose}>
        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Select Dates</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="DateYearSelect">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <label className="input-group-text" htmlFor="inputGroupSelect01">
                    Options
                  </label>
                </div>
                <select className="custom-select" id="inputGroupSelect01" onChange={handleStartYearChange}>
                    <option selected>Choose Year Min.</option>
                    <option value="2010">2010</option>
                    <option value="2011">2011</option>
                    <option value="2012">2012</option>
                    <option value="2013">2013</option>
                    <option value="2014">2014</option>
                    <option value="2015">2015</option>
                    <option value="2016">2016</option>
                    <option value="2017">2017</option>
                    <option value="2018">2018</option>
                    <option value="2019">2019</option>
                    <option value="2020">2020</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                </select>
              </div>

              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <label className="input-group-text" htmlFor="inputGroupSelect02">
                    Options
                  </label>
                </div>
                <select className="custom-select" id="inputGroupSelect02" onChange={handleEndYearChange}>
                  <option selected>Choose Year Max.</option>
                  <option value="2010">2010</option>
                    <option value="2011">2011</option>
                    <option value="2012">2012</option>
                    <option value="2013">2013</option>
                    <option value="2014">2014</option>
                    <option value="2015">2015</option>
                    <option value="2016">2016</option>
                    <option value="2017">2017</option>
                    <option value="2018">2018</option>
                    <option value="2019">2019</option>
                    <option value="2020">2020</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                </select>
              </div>
            </div>

            <div>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault" onChange={handleRadioChange} id="Jan-Dec"/>
                <label className="form-check-label" htmlFor="Breeding Season">
                  Entire Year (Jan-Dec)
                </label>
              </div>

              <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault" onChange={handleRadioChange} id="Mar-May" />
                <label className="form-check-label" htmlFor="Fall Migration">
                  Spring Migration (Mar-May)
                </label>
              </div>

              <div class="form-check">
                    <input class="form-check-input" type="radio" name="flexRadioDefault"   onChange={handleRadioChange} id="Jun-Jul" />
                    <label class="form-check-label" for="Breeding Season">
                        Breeding Season (Jun-Jul)
                    </label>
                </div>
                    
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="flexRadioDefault"   onChange={handleRadioChange} id="Aug-Nov"/>
                    <label class="form-check-label" for="Fall Migration">
                        Fall Migration (Aug-Nov)
                    </label>
                </div>

                <div class="form-check">
                    <input class="form-check-input" type="radio" name="flexRadioDefault"   onChange={handleRadioChange} id="Dec-Feb"/>
                    <label class="form-check-label" for="Winter">
                        Winter (Dec-Feb)
                    </label>
                </div>

                <div class="form-check">
                
                    <label class="form-check-label" for="Select monthly">Select Montly</label>

                    <select class="custom-select" id="inputGroupSelect03" onChange={handleStartMonthChange} >
                        <option value="Jan">Jan</option>
                        <option value="Feb">Feb</option>
                        <option value="Mar">Mar</option>
                        <option value="Apr">Apr</option>
                        <option value="May">May</option>
                        <option value="Jun">Jun</option>
                        <option value="Jul">Jul</option>
                        <option value="Aug">Aug</option>
                        <option value="Sep">Sep</option>
                        <option value="Oct">Oct</option>
                        <option value="Nov">Nov</option>
                        <option value="Dec">Dec</option>
                    </select>

                    <select class="custom-select" id="inputGroupSelect04" onChange={handleEndMonthChange}>
                        <option value="Jan">Jan</option>
                        <option value="Feb">Feb</option>
                        <option value="Mar">Mar</option>
                        <option value="Apr">Apr</option>
                        <option value="May">May</option>
                        <option value="Jun">Jun</option>
                        <option value="Jul">Jul</option>
                        <option value="Aug">Aug</option>
                        <option value="Sep">Sep</option>
                        <option value="Oct">Oct</option>
                        <option value="Nov">Nov</option>
                        <option value="Dec">Dec</option>                
                    </select>
                </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit"  onClick={handleClose}>
              Continue
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default MyForm;