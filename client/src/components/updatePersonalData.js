import React, { Fragment, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDove } from '@fortawesome/free-solid-svg-icons'
import Message from './Message';
import Progress from './Progress';
import DateForm from './DateForm';
import axios from 'axios';

const UpdatePersonalData = () => {

    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Choose Personal Data');
    const [uploadedFile, setUploadedFile] = useState('');
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);

    const onChange = e => {
        setFile(e.target.files[0]);
        setFilename('MyEBirdData.csv');
      };
    
      const onSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
    
        try {
          const res = await axios.post('/updatepersonaldata', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: progressEvent => {
              setUploadPercentage(
                parseInt(
                  Math.round((progressEvent.loaded * 100) / progressEvent.total)
                )
              );
    
              // Clear percentage
              setTimeout(() => setUploadPercentage(0), 5000);
            }
          });
    
          const {fileName} = res.data;
    
          setTimeout(() =>  setUploadedFile('uploaded'), 6000);
         
          setMessage('Your file has been Uploaded');
          
          setTimeout(() =>  setMessage('Your file containning personal data has been updated.'), 6000);
    
    
        } catch (err) {
          if (err.response.status === 500) {
            setMessage('There was a problem with the server. Refresh the page and try uploading your file again');
          } else {
            setMessage(err.response.data.msg);
          }
        }
      };


    const bird = <FontAwesomeIcon icon={faDove} size="xs" color="#007bff" />

    return(
               
        
                <div className="mt-5 mb-5">
                    {message ? <Message msg={message} /> : null}
                                 
                        
                    <div>
                      <h4>Update Personal data:</h4>
                      <div className="row">
                        <div className="col-md-8">
                          <form onSubmit={onSubmit}>
                            <div className='custom-file mb-4'>
                              <input
                                type='file'
                                className='custom-file-input'
                                id='customFile'
                                onChange={onChange}
                              />
                              <label className='custom-file-label' htmlFor='customFile'>
                                {filename}
                              </label>
                            </div>
                            <Progress percentage={uploadPercentage} />
                            <input
                              type='submit'
                              value='Upload'
                              className='btn btn-primary btn-block mt-4'
                            />
                          </form>
                        </div>
                        <div className="col-md-4">
                          {uploadedFile === 'uploaded'?      
                            <button className="btn btn-primary btn-block mt-4">Update Stats</button>
                            : null
                          }
                        </div>
                      </div>
                    </div>

            
                </div>

    )

}

export default UpdatePersonalData;