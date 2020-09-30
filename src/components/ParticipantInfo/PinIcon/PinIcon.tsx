import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import SvgIcon from '@material-ui/core/SvgIcon';

export default function PinIcon() {
  return (
    <Tooltip title="Participant is pinned. Click to un-pin." placement="top">
      <SvgIcon
        style={{ float: 'right', background: 'rgba(0, 0, 0, 0.5)', padding: '0.1em', boxSizing: 'content-box' }}
        width="26"
        height="26"
        viewBox="0 0 26 26"
      >
        <path
          fill="#FFF"
          fillRule="evenodd"
          strokeWidth="0"
          d="M15.808 4.489c.208-.207.544-.207.75 0l4.953 4.952c.207.207.207.543 0 .75l-1.415 1.415c-.207.208-.543.208-.75 0l-.333-.333-3.007 3.007v2.611c0 .113-.035.222-.1.312l-.055.063-1.06 1.062c-.208.207-.544.207-.751 0l-2.809-2.81-5.992 5.993c-.207.207-.543.207-.75 0-.184-.184-.205-.47-.062-.677l.062-.073 5.991-5.993-2.808-2.808c-.184-.184-.204-.47-.061-.677l.061-.073 1.062-1.061c.1-.1.234-.156.375-.156h2.61l3.007-3.007-.332-.332c-.185-.184-.205-.47-.062-.677l.062-.073zm.376 1.125l-.666.664.333.333c.185.184.205.47.062.677l-.062.074-3.537 3.537c-.1.1-.234.155-.375.155h-2.61l-.531.531 2.803 2.803.005.006.005.005 2.804 2.803.53-.531v-2.61c0-.112.036-.221.102-.311l.054-.064 3.537-3.537c.208-.208.544-.208.75 0l.333.332.664-.666-4.201-4.201z"
        />
      </SvgIcon>
    </Tooltip>
  );
}
