import React, { useState } from 'react';
import { Button} from 'react-bootstrap';
import styled from 'styled-components';
import Spinner from './Spinner'

function FileReadingComponent() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);

    try {
        console.log('Sending update request...');
      await fetch('/stats', {
        method: 'POST',
      });
      console.log('Update request completed!');
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <ButtonCustom onClick={handleClick}>Update Stats</ButtonCustom>
      {isLoading && <Spinner /> }
    </div>
  );
}

export const ButtonCustom = styled.button`
  background-color: #a84a04;
  border-color: #a84a04;
  color: #fff;
  border-radius: .5rem;
  padding: .5rem;

  &:hover {
    background-color: #c96d00;
    border-color: #c96d00;
    color: #fff;
  }

  &:active {
    background-color: #914702;
    border-color: #914702;
    color: #fff;
  }

  &:disabled {
    background-color: #a84a04;
    border-color: #a84a04;
    color: #777;
    cursor: not-allowed;
  }
`;


export default FileReadingComponent;