import React, { useState } from 'react';

import Button from '@material-ui/core/Button';

export default function InviteButton(props: { disabled?: boolean; className?: string; onClick: any }) {
  return (
    <Button className={props.className} onClick={props.onClick}>
      Invite
    </Button>
  );
}
