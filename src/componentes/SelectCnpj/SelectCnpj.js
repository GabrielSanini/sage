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


const SelectCnpj = (props) => {
    
    const classes = useStyles();

    console.log('props.value: ', props.value);
    const [cnpjSelecionado, setCnpjSelecionado] = useState(props.value);
    const [cnpjs, setCnpjs] = useState([]);

    const getAllCnpjs = (empresaId) => {
        ApiSage.get(`cnpj/findByEmpresa?empresa_id=${empresaId}`).
            then((response) => {
                retornoGetAllCnpjs(response.data);
            }).catch( (error) => {
                console.log(`Falha ao buscar cnpj: ${error.reponse.data.message}`);
            });
    }
    
    const retornoGetAllCnpjs = (cnpjs) =>{
        console.log('retornoGetAllCnpjs', cnpjs);
        setCnpjs(cnpjs);
        //setCnpjSelecionado(props.value);
    }

    useEffect ( () => {
        getAllCnpjs(props.empresaId);
    }, [] ); 

    const handleSelecionarCnpj = (valor) => {
        let nome = '';
        for( let i in cnpjs){
            if(valor === cnpjs[i].id)
                nome = cnpjs[i].razaoSocial;
        }
        props.onChange([valor,nome]);
        setCnpjSelecionado(valor);
    }

    return (
        <FormControl className={classes.formControl}>
            <InputLabel id="label-cnpjs">Cnpj</InputLabel>
            <Select
                labelId="label-cnpjs"
                id="select-cnpjs-id"
                value={props.value}
                onChange={(e) => {handleSelecionarCnpj(e.target.value)}}
            >
                {cnpjs.map((e) => (
                    <MenuItem key={e.id} value={e.id}>{e.cnpj}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )

}

export default SelectCnpj;