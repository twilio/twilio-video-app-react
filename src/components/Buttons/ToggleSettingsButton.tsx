import React, { useState } from 'react';
import { RoundButton } from './RoundButton';
import DeviceSelectionDialog from '../DeviceSelectionDialog/DeviceSelectionDialog';
import SettingsIcon from 'icons/SettingsIcon';

export const ToggleSettingsButton = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <RoundButton title="Einstellungen öffnen" onClick={() => setSettingsOpen(true)}>
        <SettingsIcon />
      </RoundButton>
      <DeviceSelectionDialog
        open={settingsOpen}
        onClose={() => {
          setSettingsOpen(false);
        }}
      />
    </>
  );
};
