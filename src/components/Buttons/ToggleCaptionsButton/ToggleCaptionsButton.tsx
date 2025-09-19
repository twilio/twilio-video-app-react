import React from 'react';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import ClosedCaptionIcon from '@material-ui/icons/ClosedCaption';
import ClosedCaptionOutlinedIcon from '@material-ui/icons/ClosedCaptionOutlined';

type Props = { disabled?: boolean; className?: string };

export default function ToggleCaptionsButton({ disabled, className }: Props) {
  const [enabled, setEnabled] = React.useState(false);
  const title = enabled ? 'Hide captions' : 'Show captions';
  const Icon = enabled ? ClosedCaptionIcon : ClosedCaptionOutlinedIcon;

  return (
    <Tooltip title={title} placement="top">
      {/* span wrapper ensures Tooltip works when Button is disabled */}
      <span>
        <Button
          className={className}
          onClick={() => setEnabled(v => !v)}
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
