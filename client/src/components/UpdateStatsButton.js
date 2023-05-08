import React, { useState } from 'react';
import { Button} from 'react-bootstrap';
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
      <Button onClick={handleClick}>Update Stats</Button>
      {isLoading && <Spinner /> }
    </div>
  );
}

export default FileReadingComponent;