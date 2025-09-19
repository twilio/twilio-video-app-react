import React from 'react';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import ClosedCaptionIcon from '@material-ui/icons/ClosedCaption';
import ClosedCaptionOutlinedIcon from '@material-ui/icons/ClosedCaptionOutlined';

type Props = {
  disabled?: boolean;
  className?: string;
  showCaptions: boolean;
  onToggleCaptions: () => void;
  tooltip?: string;
};

export default function ToggleCaptionsButton({ disabled, className, showCaptions, onToggleCaptions, tooltip }: Props) {
  const enabled = showCaptions;
  const title = tooltip ?? (enabled ? '' : 'Requires Real-Time Transcriptions to be enabled in the Twilio Console');
  const Icon = enabled ? ClosedCaptionIcon : ClosedCaptionOutlinedIcon;

  return (
    <Tooltip title={title} placement="top">
      {/* span wrapper ensures Tooltip works when Button is disabled */}
      <span>
        <Button
          className={className}
          onClick={onToggleCaptions}
          disabled={disabled}
          startIcon={<Icon />}
          data-cy="toggle-captions"
          aria-label={title}
        >
          {enabled ? 'Hide Captions' : 'Show Captions'}
        </Button>
      </span>
    </Tooltip>
  );
}
