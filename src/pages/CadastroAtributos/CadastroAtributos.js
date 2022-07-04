import React, {useState, useEffect} from 'react';
import Page from 'material-ui-shell/lib/containers/Page'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar/Scrollbar';
import { useIntl } from 'react-intl';

import { CircularProgress , Toolbar , Paper, Grid, Typography, List, ListItem, ListSubheader, ListItemIcon, ListItemText, ListItemSecondaryAction, Switch } from '@material-ui/core';


import SelectEmpresas from '../../componentes/SelectEmpresas/SelectEmpresas.js';

import './style.css';

const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
        marginTop: theme.spacing(2),
        paddingTop: '1px',
        paddingBottom: '1px',
      },
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
          width: '80%',
          marginLeft: 'auto',
          marginRight: 'auto',
        },
      },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
          marginTop: theme.spacing(6),
          marginBottom: theme.spacing(6),
          padding: theme.spacing(3),
        },
    },
    formControl: {
        width: '100%',
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
      width: '100%',
    },
    container:{
      padding: theme.spacing(3)
    },
    button: {
      margin: theme.spacing(1),
      width: '100%',
    },
    textField: {
        marginLeft: '5px',
        marginRight: '5px',
    }
}));

const CadastroAtributos = () => {

    const intl = useIntl();

    const classes = useStyles();

    const preForm = {
        empresa_id: '',
    }

    const [form, setForm] = useState(preForm);
    const [processando, setProcessando] = useState(false);
    const [atributosTipo, setAtributosTipo] = useState([
        {nome: 'Saude', ativo: 1, id: 1},
        {nome: 'Educação', ativo: 1, id: 2},
        {nome: 'Fazenda', ativo: 0, id: 3},
        {nome: 'Educação', ativo: 1, id: 4},
    ]);

    const [atributos, setAtributos] = useState([
        {nome: 'Teste', ativo: 1, id: 1, tipoDado:'String', frequencia: 'mensal'},
        {nome: 'Teste2', ativo: 0, id: 2, tipoDado:'String', frequencia: 'diaria'},
        {nome: 'Teste3', ativo: 1, id: 3, tipoDado:'String', frequencia: 'mensal'},
        {nome: 'Teste4', ativo: 1, id: 4, tipoDado:'String', frequencia: 'mensal'},
    ]);


    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedIndexAtributo, setSelectedIndexAtributo] = useState(0);

    

    const atributoMacroSelecionadoZerado = () => {
        return {
            id: -1,
            nome: '[]',
        }
    }

    const [atributoMacroSelecionado, setAtributoMacroSelecionado] = useState(atributoMacroSelecionadoZerado);


    const returnIdAtivo = (vetor) => {
        let newArray = [];
        for(let i in vetor){
            if (vetor[i].ativo === 1)
                newArray.push(vetor[i].id);
        }
        return newArray;
    }

    const [checked, setChecked] = useState(returnIdAtivo(atributosTipo));
    const [checkedAtributo, setCheckedAtributo] = useState(returnIdAtivo(atributos));

    const handleSelecionarEmpresa = () => {

    }

    const postAtributoTipo = (id, ativo) => {
        console.log('postAtributoTipo', id, ativo);
    }

    const postAtributo = (id, ativo) => {
        console.log('postAtributo', id, ativo);
    } 
    
    const handleChangeCheckAtributoTipo = (e, id) => {
        let newChecked = [...checked];
        let idx = newChecked.indexOf(id);
        postAtributoTipo(id, idx === -1 ? 1 : 0);
        if(idx === -1)
            newChecked.push(id);
        else
            newChecked.splice(idx, 1);

        setChecked(newChecked);
    }

    const handleClickListAtributoTipo = (e, i, nome) => {
        setAtributoMacroSelecionado({id:i, nome: nome});
        setSelectedIndex(i);
    }


    const handleChangeCheckAtributo = (e, id) => {
        let newChecked = [...checkedAtributo];
        let idx = newChecked.indexOf(id);
        postAtributo(id, idx === -1 ? 1 : 0);
        if(idx === -1)
            newChecked.push(id);
        else
            newChecked.splice(idx, 1);

        setCheckedAtributo(newChecked);
    }

    const handleClickListAtributo = (e, i) => {
        
        setSelectedIndexAtributo(i);
    }

    return (
        <Page 
            pageTitle={intl.formatMessage({ id: 'CadastroAtributos' , defaultMessage: 'Cadastro de Atributos'})}
            appBarContent={
                <Toolbar disableGutters>
                    {processando ? <CircularProgress /> : `` }
                    <div style={{"width":"250px"}}>
                        <SelectEmpresas onChange={handleSelecionarEmpresa} value={form.empresa_id} />
                    </div>
                </Toolbar>
            }
        >
            <Scrollbar style={{ height: '100%', width: '100%', display: 'flex', flex: 1 }} >
                <main className={classes.layout}>
                    <Paper className={classes.paper} >
                        <Grid container spacing={3} >
                            <Grid xs={12} sm={6}>
                                <Typography variant="h7" gutterBottom>
                                    Tipos de atributos:
                                </Typography>
                                <Grid>

                                    <List component="nav" subheader={<ListSubheader>Configurações:</ListSubheader>} className={classes.root}>
                                        {atributosTipo.map((t,idx) => (
                                            <ListItem key={t.id} button
                                                selected={selectedIndex === t.id}
                                                onClick={e => handleClickListAtributoTipo(e, t.id, t.nome)}
                                            >
                                                <ListItemIcon>
                                                {//<WifiIcon />
                                                }
                                                </ListItemIcon>
                                                <ListItemText id={"switch-list-label-"+t.id} primary={t.nome} />
                                                <ListItemSecondaryAction>
                                                <Switch
                                                    name={"atributoTipo_"+t.id}
                                                    edge="end"
                                                    onChange={e => handleChangeCheckAtributoTipo(e, t.id)}
                                                    checked={checked.indexOf(t.id)!== -1}
                                                    inputProps={{ 'aria-labelledby': 'switch-list-label-wifi' }}
                                                />
                                                </ListItemSecondaryAction>
                                          </ListItem>
                                        ))}
                                    </List>
                                </Grid>
                            </Grid>
                            <Grid xs={12} sm={6}>
                                <Typography variant="h7" gutterBottom>
                                    Atributos:
                                </Typography>
                                <Grid>
                                    <List component="nav" subheader={<ListSubheader>{atributoMacroSelecionado.nome}</ListSubheader>} className={classes.root}>
                                        {atributoMacroSelecionado.id > 0 ? atributos.map((t,idx) => (
                                            <ListItem key={t.id} button
                                                selected={selectedIndexAtributo === t.id}
                                                onClick={e => handleClickListAtributo(e, t.id)}
                                            >
                                                <ListItemIcon>
                                                {//<WifiIcon />
                                                }
                                                </ListItemIcon>
                                                <ListItemText id={"switch-list-label-"+t.id} primary={t.nome} />
                                                <ListItemSecondaryAction>
                                                <Switch
                                                    name={"atributoTipo_"+t.id}
                                                    edge="end"
                                                    onChange={e => handleChangeCheckAtributo(e, t.id)}
                                                    checked={checkedAtributo.indexOf(t.id)!== -1}
                                                    inputProps={{ 'aria-labelledby': 'switch-list-label-wifi' }}
                                                />
                                                </ListItemSecondaryAction>
                                          </ListItem>
                                        )) : null}
                                    </List>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </main>
                
            </Scrollbar>

        </Page>
    )
        

}

export default CadastroAtributos;