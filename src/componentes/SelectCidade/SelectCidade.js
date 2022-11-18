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

const SelectCidade = (props) => {
    
    const classes = useStyles();
    const [cidades, setCidades] = useState([]);
    
    const getAllCidadesDoEstado = () => {
        console.log('props SelectCidade', props);
        if(typeof props.estadoId === 'undefined')
            return;
        ApiSage.get('cidade/findAllLazy?estadoId='+props.estadoId).
            then((response) => {
                retornoGetAllCidades(response.data);
            }).catch( (error) => {
                console.log(`Falha ao buscar empresas: ${error.reponse.data.message}`);
            });
    }

    const retornoGetAllCidades = (cidades) =>{
        setCidades(cidades);            
    }

    useEffect ( () => {
        getAllCidadesDoEstado();
    }, [props.estadoId] ); 

    const handleSelecionarCidade = (event) => {
        let cidade = cidades.filter(e => e.id === event.target.value);
        //console.log('handleSelecionarEstado', event, estado);
        props.onChange(cidade[0]);
    }

    return (
        <FormControl className={classes.formControl}>
            <InputLabel id="label-cidade">Cidade</InputLabel>
            <Select
                labelId="label-cidade"
                id="select-cidade-id"
                value={props.value}
                onChange={(e) => {handleSelecionarCidade(e)}}
            >
                {cidades.map((e) => (
                    <MenuItem key={e.id} value={e.id}>{e.nome}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default SelectCidade;