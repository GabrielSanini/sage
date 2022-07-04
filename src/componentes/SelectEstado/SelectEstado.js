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

const SelectEstado = (props) => {
    
    const classes = useStyles();
    const [estadoSelecionado, setEstadoSelecionado] = useState(typeof props.value === 'undefined' ? '' : props.value);
    const [estados, setEstados] = useState([]);

    console.log('SelectEstado', props.value);
    
    const getAllEstados = () => {
        ApiSage.get('estado/findAllLazy').
            then((response) => {
                retornoGetAllEstados(response.data);
            }).catch( (error) => {
                console.log(`Falha ao buscar empresas: ${error.reponse.data.message}`);
            });
    }

    const retornoGetAllEstados = (estados) =>{
        setEstados(estados);            
    }

    useEffect ( () => {
        getAllEstados();
    }, [] ); 

    const handleSelecionarEstado = (event) => {
        setEstadoSelecionado(event.target.value);
        let estado = estados.filter(e => e.id === event.target.value);
        console.log('handleSelecionarEstado', event, estado);
        props.onChange(estado[0]);
    }

    console.log('SelectEstado', props.value);

    return (
        <FormControl className={classes.formControl}>
            <InputLabel id="label-estado">Estado</InputLabel>
            <Select
                labelId="label-estado"
                id="select-estado-id"
                value={props.value}
                onChange={(e) => {handleSelecionarEstado(e)}}
            >
                {estados.map((e) => (
                    <MenuItem key={e.id} value={e.id}>{e.nome}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default SelectEstado;