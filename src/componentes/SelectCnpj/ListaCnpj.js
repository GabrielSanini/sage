import React, {useState, useEffect} from 'react';
import ApiSage from '../../services/ApiSage';
import {  Grid, TextField,Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import DialogContentText from '@material-ui/core/DialogContentText';
import {unificarDados, desUnificarDados} from '../../services/Obj.js'

const useStyles = makeStyles((theme) => ({

    formControl: {
        paddingTop: 1,
        paddingBottom: 1,
        minWidth: 120,
        width: '100%',
    },

  }));


const ListaCnpj = (props) => {
    
    const classes = useStyles();

    const preCnpj = {id: '', razaoSocial:'', cnpj: '', empresa_id: props.empresaId};

    const [cnpj, setCnpj] = useState(preCnpj);

    const [cnpjs, setCnpjs] = useState( {col1: [],
                                        col2: [],
                                        col3: []});
    
    const getAllCnpjs = (empresaId) => {
        console.log('empresaId', empresaId)
        setCnpj({
            ...cnpj,
            ['empresa_id']: empresaId,
        })
        ApiSage.get(`cnpj/findByEmpresa?empresa_id=${empresaId}`).
            then((response) => {
                retornoGetAllCnpjs(response.data);
            }).catch( (error) => {
                console.log(`Falha ao buscar cnpj: ${error.reponse.data.message}`);
            });
    }
    
    const retornoGetAllCnpjs = (cnpjs) =>{
        console.log('retornoGetAllCnpjs', cnpjs);
        let colunasCnpj = [[],[],[]];
        let j = 0;
        for( let i = 0; i < cnpjs.length; ++ i){
            colunasCnpj[j].push(cnpjs[i]);
            j = j >= 2 ? j = 0 : ++j 
        }
        console.log('colunasCnpj',colunasCnpj)
        
        setCnpjs({col1: colunasCnpj[0],
                    col2: colunasCnpj[1],
                    col3: colunasCnpj[2]
                });
    }

    useEffect ( () => {
       getAllCnpjs(props.empresaId);
    }, [] ); 

    const postCnpj = () => {
        let dados = desUnificarDados(cnpj,'_');
        dados.id = null;
        ApiSage.post(`cnpj/save`, dados).
        then((response) => {
            retornoPostCnpj(response.data);
        }).catch( (error) => {
            console.log(`Falha ao buscar cnpj: ${error.reponse.data.message}`);
        });
    }

    const  retornoPostCnpj = (retorno)=> {
        getAllCnpjs(cnpj.empresa_id);
        setCnpj(preCnpj);
    }

    const handleChangeCnpj = (event) =>{
        setCnpj({
            ...cnpj,
            [event.target.name]: parseInt(event.target.value),
        })
    }

    const handleChangeRazaoSocial = (event) => {
        setCnpj({
            ...cnpj,
            [event.target.name]: event.target.value,
        })
    }

    console.log('antes return ', cnpjs);
    return (<>
            <Grid item xs={12} sm={12} style={{"padding-bottom":"0px"}}>
                <DialogContentText  style={{"padding":"0px", "margin-bottom":"0px"}}>
                        Cnpj's:
                </DialogContentText>
            </Grid>
            
            <Grid item xs={12} sm={3}>
                <List className={classes.root}>
                    {cnpjs.col1.map((c) => (
                        <>
                        <Divider component="li" />
                        <ListItem style={{"padding-top":"0px","padding-bottom":"0px"}} >
                            <ListItemText primary={c.cnpj} secondary={c.razaoSocial} />
                        </ListItem>
                        </>
                    ))}                               
                </List>
            </Grid>
            <Grid item xs={12} sm={3}>
                <List className={classes.root}>
                    {cnpjs.col2.map((c) => (
                        <>
                        <Divider component="li" />
                        <ListItem style={{"padding-top":"0px","padding-bottom":"0px"}} >
                            <ListItemText primary={c.cnpj} secondary={c.razaoSocial} />
                        </ListItem>
                        </>
                    ))}                                 
                </List>
            </Grid>
            <Grid item xs={12} sm={3}>
                <List className={classes.root}>
                    {cnpjs.col3.map((c) => (
                        <>
                        <Divider component="li" />
                        <ListItem style={{"padding-top":"0px","padding-bottom":"0px"}} >
                            <ListItemText primary={c.cnpj} secondary={c.razaoSocial} />
                        </ListItem>
                        </>
                    ))}                                    
                </List>
            </Grid>
            <Grid item xs={12} sm={3}>
                <Grid item xs={12} sm={12}>
                    <TextField type="number" id="cnpj_cnpj" name="cnpj"  label="Cnpj" style={{"width":"100%"}} onChange={e => handleChangeCnpj(e)} value={cnpj.cnpj}/>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <TextField id="cnpj_razaoSocial" name="razaoSocial"  label="Razão social" style={{"width":"100%"}} onChange={e => handleChangeRazaoSocial(e)} value={cnpj.razaoSocial}/>
                </Grid>
                <Button onClick={postCnpj} color="primary" style={{"width":"100%"}} disableElevation>
                    Salvar CNPJ
                </Button>
            </Grid>
            </>
    )

}

export default ListaCnpj;