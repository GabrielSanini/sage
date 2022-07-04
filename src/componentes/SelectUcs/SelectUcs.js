import {useState, useEffect} from 'react';
import ApiSage from '../../services/ApiSage';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    formControl: {
        paddingTop: 1,
        paddingBottom: 1,
        minWidth: 120,
        width: '100%',
    },
  }));

const SelectUcs = (props) => {

    const classes = useStyles();

    const [listaUcs, setListaUcs] = useState([]);
    const [ucSelecionada, setUcSelecionada] = useState('');
    

    const getListaUcs= () => {
        ApiSage.get(`unidadeConsumidora/findAllByEmpresa?empresaId=${props.empresaId}`)
                .then((response) => {
                    setListaUcs(criarListaUcs(response.data));
                }).catch((error) => {
                    let erro = error.response;
                    console.log('erro get getListaUcs: ', erro);
                });
    }
    
    const criarListaUcs = (ucs) => {
        let vetor = [];
        ucs.forEach(u => vetor.push({id: u.id, nome: u.nome}));
        return vetor;
    }

    useEffect (()=> {
        if(props.empresaId != null && props.empresaId != '')
            getListaUcs(props.empresaId);
    }, [props.empresaId]);

    const handleEditUc = (e) => {
        let nome = listaUcs.filter(uc => uc.id == e.target.value);
        console.log(nome, e.target.value);
        props.onChange( e.target.value);
        setUcSelecionada(e.target.value);
    }

    return (
        <FormControl className={classes.formControl}>
            <InputLabel id="label-ucs">UCs</InputLabel>
            <Select
                labelId="label-ucs"
                id="select-id"
                value={ucSelecionada}
                onChange={handleEditUc}
                >

                {listaUcs.map(u => (
                    <MenuItem key={u.id} value={u.id}>{u.nome}</MenuItem>
                ))}

            </Select>
        </FormControl>
    )
}

export default SelectUcs;