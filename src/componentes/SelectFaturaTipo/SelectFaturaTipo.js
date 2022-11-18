
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

const SelectFaturaTipo = (props) => {

    const classes = useStyles();

    const [faturaTipo, setFaturaTipo] = useState(props.value);
   
    const [faturaTipoList, setFaturaTipoList] = useState([]);

    const getAllFaturaTipo = () => {
        ApiSage.get('faturaTipo/findAll').
            then((response) => {
                retornoGetAllFaturaTipo(response.data);
            }).catch( (error) => {
                console.log(`Falha ao buscar faturaTipo: ${error.reponse.data.message}`);
            });
    }
    
    const retornoGetAllFaturaTipo = (faturaTipoList) =>{
        console.log('get faturaTipoList: ', faturaTipoList);
        setFaturaTipoList(faturaTipoList);
    }

    useEffect ( () => {
        getAllFaturaTipo();
    }, [] ); 

    const handleSelecionarFaturaTipo = (valor) => {
        props.onChange(valor);
        setFaturaTipo(valor);
    }

    return (
        <FormControl className={classes.formControl}>
            <InputLabel id="label-faturaTipo">Categoria</InputLabel>
            <Select
                labelId="label-faturaTipo"
                id="select-faturaTipo-id"
                value={props.value}
                onChange={(e) => {handleSelecionarFaturaTipo(e.target.value)}}
            >
                {faturaTipoList.map((e) => (
                    <MenuItem key={e.id} value={e.id}>{e.nome}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )

}

export default SelectFaturaTipo;