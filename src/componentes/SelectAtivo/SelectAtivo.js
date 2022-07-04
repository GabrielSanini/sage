import React, {useState, useEffect} from 'react';
import ApiSage from '../../services/ApiSage';
import {  FormControl, InputLabel,Select, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    formControl: {
        paddingTop: 1,
        paddingBottom: 1,
        minWidth: 120,
        width: '100%',
    },

  }));

const SelectAtivo = (props) => {
    
    const classes = useStyles();

    const [ativo, setAtivo] = useState(props.value);

    const handleSelecionarAtivo = (valor) => {
        console.log('handleSelecionarEmpresa interno: ', valor);
        props.onChange(valor);
        setAtivo(valor);
    }

    return (
        <FormControl className={classes.formControl}>
            <InputLabel id="label-empresa">Ativo</InputLabel>
            <Select
                className={classes.selectEmpty}
                labelId="label-ativo"
                id="select-ativo-id"
                value={props.value}
                onChange={(e) => {handleSelecionarAtivo(e.target.value)}}
            >
                <MenuItem key={1} value={1}>Ativas</MenuItem>
                <MenuItem key={2} value={0}>Inativas</MenuItem>
            </Select>
        </FormControl>
    )
}

export default SelectAtivo;