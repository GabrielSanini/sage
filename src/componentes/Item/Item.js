import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {Paper} from '@material-ui/core';

const Item = makeStyles(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    }));

export default Item;