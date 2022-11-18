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


const SelectEmpresasEnergia = (props) => {
    
    const classes = useStyles();

    const [empresaSelecionada, setEmpresaSelecionada] = useState(props.value);
   
    const [empresaEnergiaList, setEmpresaEnergiaList] = useState([]);

    const getAllEmpresas = () => {
        ApiSage.get('empresaEnergia/findAll').
            then((response) => {
                retornoGetAllEmpresas(response.data);
            }).catch( (error) => {
                console.log(`Falha ao buscar empresas: ${error.reponse.data.message}`);
            });
    }
    
    const retornoGetAllEmpresas = (empresas) =>{
        console.log('get empresas: ', empresas);
        setEmpresaEnergiaList(empresas);
    }

    useEffect ( () => {
        getAllEmpresas();
    }, [] ); 

    const handleSelecionarEmpresa = (valor) => {
        props.onChange(valor);
        setEmpresaSelecionada(valor);
    }

    return (
        <FormControl className={classes.formControl}>
            <InputLabel id="label-empresaEnergia">Distribuidora</InputLabel>
            <Select
                labelId="label-empresaEnergia"
                id="select-empresaEnergia-id"
                value={props.value}
                onChange={(e) => {handleSelecionarEmpresa(e.target.value)}}
            >
                {empresaEnergiaList.map((e) => (
                    <MenuItem key={e.id} value={e.id}>{e.nome}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default SelectEmpresasEnergia;