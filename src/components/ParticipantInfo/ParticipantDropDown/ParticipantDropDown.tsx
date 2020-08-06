import React from 'react';
import { useAppState } from '../../../state';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'div': React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
        }
    }
}

const options = ['Remove'];
const ITEM_HEIGHT = 48;

export default function ParticipantDropDown(participant: any) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event: any) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);

    };

    const handleClose = (event: any, option: any) => {
        event.stopPropagation();
        setAnchorEl(null);
        if (option === 'Remove') {
            removeParticipant(participant.sid);
        }
    };

    const removeParticipant = useAppState();

    return (
        <>
            <div style={{ float: "right" }}>
                <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    style={{
                        padding: "0 5px"
                    }}
                    onClick={handleClick}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={!!anchorEl}
                    onClose={handleClose}
                    PaperProps={{
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: '20ch',
                        },
                    }}
                >
                    {options.map((option) => (
                        <MenuItem key={option} onClick={(event: any) => handleClose(event, option)} >
                            {option}
                        </MenuItem>
                    ))}
                </Menu>
            </div>
        </>
    );
}