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

const SelectEmpresas = (props) => {
    
    const classes = useStyles();

    const [empresaSelecionada, setEmpresaSelecionada] = useState(props.value);
    const [empresas, setEmpresas] = useState([]);

    
    const getAllEmpresas = () => {
        ApiSage.get('empresa/findAll').
            then((response) => {
                retornoGetAllEmpresas(response.data);
            }).catch( (error) => {
                console.log(`Falha ao buscar empresas: ${error.reponse.data.message}`);
            });
    }

    const retornoGetAllEmpresas = (empresas) =>{
        setEmpresas(empresas);
        if(empresas != null && empresas.length === 1){
            setEmpresaSelecionada(empresas[0].id);
            props.onChange(empresas[0].id);
        }
            
    }

    useEffect ( () => {
        getAllEmpresas();
    }, [] ); 

    const handleSelecionarEmpresa = (valor) => {
        //console.log('handleSelecionarEmpresa interno: ', valor);
        props.onChange(valor);
        setEmpresaSelecionada(valor);
    }

    return (
        <FormControl className={classes.formControl}>
            <InputLabel id="label-empresa">Empresa</InputLabel>
            <Select
                className={classes.selectEmpty}
                labelId="label-empresa"
                id="select-empresa-id"
                value={empresaSelecionada}
                onChange={(e) => {handleSelecionarEmpresa(e.target.value)}}
            >
                {empresas.map((e) => (
                    <MenuItem key={e.id} value={e.id}>{e.nome}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default SelectEmpresas;