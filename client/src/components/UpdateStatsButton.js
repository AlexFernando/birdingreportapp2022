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

const ButtonCustom = styled(Button)`
  background-color: #a84a04;
  border-color: #a84a04;
`

export default FileReadingComponent;