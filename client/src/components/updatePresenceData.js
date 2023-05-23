import React, { Fragment, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDove } from '@fortawesome/free-solid-svg-icons'
import Message from './Message';
import Progress from './Progress';
import DateForm from './DateForm';
import axios from 'axios';

const UpdatePresencenData = () => {

    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Choose Presencen Data');
    const [uploadedFile, setUploadedFile] = useState('');
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);

    const onChange = e => {
        setFile(e.target.files[0]);
        setFilename('PresencenData.xlsx');
      };
    
      const onSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
    
        try {
          const res = await axios.post('/updatepresencendata', formData, {
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
               if(progressEvent.loaded === progressEvent.total) {
        
                setTimeout(() => setUploadPercentage(0), 2000);
          
                setTimeout(() =>  setUploadedFile('uploaded'),3000);
              
                setMessage('Your file has been Uploaded');
                setTimeout(() =>  setMessage(''), 7000);
              }
            }
          });
    
          const {fileName} = res.data;
    
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
                      <h4>Update Presence data:</h4>
                      <div className="row">
                        <div className="col-md-12">
                          <form onSubmit={onSubmit}>
                            <div className='custom-file mb-4'>
                              <input
                                type='file'
                                className='custom-file-input'
                                id='customFileThree'
                                onChange={onChange}
                              />
                              <label className='custom-file-label' htmlFor='customFileThree'>
                                {filename}
                              </label>
                            </div>
                            <Progress percentage={uploadPercentage} />
                            <div>
                              <input
                                type='submit'
                                value='Upload'
                                className='mt-4'
                                style={{ backgroundColor: '#a84a04', border: '#a84a04', color:'#fff', borderRadius: '.4rem', padding: '.5rem 1rem' }}
                              />
                            </div>
                          </form>
                        </div>
        
                      </div>
                    </div>
            </div>

    )

}

export default UpdatePresencenData;