import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { DisplayFarms } from '../contexts/wallet';

interface ToggleFarmDisplayProps {
  displayFarms?: DisplayFarms;
  handleDisplayFarms: any;
}

export default function ToggleFarmDisplay({
  displayFarms,
  handleDisplayFarms,
}: ToggleFarmDisplayProps) {
  return (
    <ToggleButtonGroup
      value={displayFarms}
      exclusive
      onChange={handleDisplayFarms}
      aria-label="text alignment"
    >
      <ToggleButton value="live" aria-label="left aligned">
        Live
      </ToggleButton>
      <ToggleButton value="finished" aria-label="centered">
        Finished
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
