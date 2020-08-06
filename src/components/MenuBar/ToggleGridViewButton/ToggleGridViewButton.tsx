import React from 'react';
import GridOnIcon from '@material-ui/icons/GridOn';
import GridOffIcon from '@material-ui/icons/GridOff';
import IconButton from '@material-ui/core/IconButton';

import { useAppState } from '../../../state';

export default function ToggleGridViewButton() {
    const { gridView, setGridView } = useAppState();

    return (
        <IconButton onClick={() => setGridView(!gridView)}>
            {gridView ? <GridOffIcon /> : <GridOnIcon />}
        </IconButton>
    );
}
