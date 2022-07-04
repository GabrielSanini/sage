import React, {useState, useEffect} from 'react';
import Page from 'material-ui-shell/lib/containers/Page'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar/Scrollbar'
import TextField from '@material-ui/core/TextField';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { CircularProgress , Container, Grid, Button, Toolbar, DialogActions, Divider , Link, Typography, FormControlLabel, Switch } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import { useIntl } from 'react-intl'
import ApiSage from '../../services/ApiSage';
import SelectFaturaTipo from '../../componentes/SelectFaturaTipo/SelectFaturaTipo.js';
import {desUnificarDados, unificarDados} from '../../services/Obj';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import URL from '../../services/URL.js';

import FilterListIcon from '@material-ui/icons/FilterList';

import Drawer from '@material-ui/core/Drawer';
import ListItem from '@material-ui/core/ListItem';
import download from 'downloadjs';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';


import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';

import SelectEmpresas from '../../componentes/SelectEmpresas/SelectEmpresas.js';
import SelectUcs from '../../componentes/SelectUcs/SelectUcs.js';

import './style.css';


const drawerWidth = 250;


const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
        marginTop: theme.spacing(2),
        paddingTop: '1px',
        paddingBottom: '1px',
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
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    textField: {
        marginLeft: '5px',
        marginRight: '5px',
    }
}));

const PrevisaoConsumo = () => {

    const intl = useIntl()
    const classes = useStyles();
    const theme = useTheme();

    const preForm = {
        faturaKey_ano: '',
        faturaKey_mes: '',
        faturaKey_ucId: '',
        nfe: '',
        dataVencimentoString: '',
        dataFaturamentoString: '',
        kwh: '',
        kvarh: '',
        valor:'',
        valImposto: '',
        valBandeira: '',
       // faturaTipo_id: '',
        valEnergia: '',
    }


    const [openFilter, setOpenFilter] = useState(false);
    const [empresaId, setEmpresaId] = useState('');
    const [form, setForm] = useState(preForm);
    const [erros, setErros] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const [processando, setProcessando] = useState(false);
    const [alertaRetorno , setAlertaRetorno] = useState({open:false, msg: '', tipo: 'error'});

    const [uc, setUc] = useState();
    const [listaUcs, setListaUcs] = useState([]);
        
    const mesAnoInicio = (new Date()).getFullYear() + '-01';
    
    const mesAnoFim = (new Date()).getFullYear() + '-12';

    const [inicio, setInicio] = useState(mesAnoInicio+'-01');
    const [fim, setFim] = useState(mesAnoFim+'-01');

    const Alert = (props) => {return <MuiAlert elevation={6} variant="filled" {...props} />;}

    const handleCloseMsgRetorno = (event, reason) => {
        if(reason === 'clickaway')
            return;
        setAlertaRetorno({
            ...alertaRetorno,
            open: false,
        })
    }

    const [modal, setModal] = useState({
        open: false,
        mensagem: ''
    })

    const [rows, setRows] = useState([]);

    const [columns, setColumns] = useState([
        { field: 'id', headerName: 'ID', width: 110, hide: true},
        { field: 'uc', headerName: 'UC', width: 200 },
        { field: 'dataVencimento', headerName:'Vencimento', width:150},    
        { field: 'dataFaturamento', headerName:'Faturamento', width:150},
        { field: 'kwh', headerName: 'KWH', width: 150 },
        { field: 'kvarh', headerName: 'KVARH', width: 150 },
        { field: 'valor', headerName: 'VALOR', width: 150 },
    ]);

    const getFatura = (ano, mes, uc) => {
        console.log('form', form);
        ApiSage.get(`fatura/findById?mes=${mes}&ano=${ano}&uc=${uc}`).then(
            (response) => {
                retornoGetFatura(response);
            }
        ).catch( (error) => {
            setAlertaRetorno({
                open: true,
                tipo: 'error',
                msg: `Falha ao buscar fatura: ${error.reponse.data.message}`
            });
        });
    }

    const retornoGetFatura = (response) => {
        let fatura = response.data;
        fatura.dataFaturamentoString = fatura.dataFaturamento;
        fatura.dataVencimentoString = fatura.dataVencimento;
        fatura = unificarDados(fatura, '');
        console.log('fatura', fatura)
        Object.assign(form, fatura);
        setForm(form);
    }
    
    const getAllFaturas = () => {
        console.log("getAllFaturas", uc, inicio, fim);
        ApiSage.get(`fatura/findAll?uc=${uc}&inicio=${inicio}&fim=${fim}`).then(
            (response) => {
                retornoGetAllFaturas(response.data);
            }
        ).catch( (error) => {
            setAlertaRetorno({
                open: true,
                tipo: 'error',
                msg: `Falha ao buscar todas as faturas: ${error.reponse.data.message}`
            });
        });
    }

    /*
    useEffect (() => {
        getAllFaturas()
    }, [])
*/

    const retornoGetAllFaturas = (ucs) => {
        let ucsTable = [];
        console.log(ucs)
        for( let i in ucs){
            ucsTable.push({id: i, uc: ucs[i].faturaKey.ucId, dataVencimento: ucs[i].dataVencimento, dataFaturamento: ucs[i].dataFaturamento, 
                            kwh: ucs[i].kwh, kvarh: ucs[i].kvarh, valor: ucs[i].valor})
        }
        setRows(ucsTable);
    }
    
    const postFatura = () => {
        let ucId = form.faturaKey_ucId;
        let dados = desUnificarDados(form, '_');
        console.log('postFatura', dados);
        ApiSage.post('fatura/addUpdate', dados //{faturaKey: {ano: form.ano, mes: form.mes, ucId: form.uc}, dataVencimentoString: form.dataVencimentoString,
                                       //     dataFaturamentoString: form.dataFaturamentoString, kwh: form.kwh, kvarh: form.kvarh, valor: form.valor,
                                         //   valImposto: form.valImposto, valBandeira: form.valBandeira, categoria: form.categoria, valEnergia: form.valEnergia}
                                            )
                .then( (response) => {
                    retornoPostFatura(response);
                    getAllFaturas(ucId);
                    setModal({
                        open: false,
                        mensagem: ''
                    });
                })
                .catch((error) => {
                    console.log(error.response);
                    setAlertaRetorno({
                        open: true,
                        tipo: 'error',
                        msg: `Falha ao salvar fatura: ${error.response.data.message}`
                    });
                });
    }

    const retornoPostFatura = (response) => {
        setAlertaRetorno({
            open: true,
            tipo: 'success',
            msg: `Fatura salva com sucesso`,
        })
    }

    const limparCampos = () => {
        setForm(preForm);
    }

    const handleSelecionarFaturaTipo = (e) => {
        setForm({
            ...form,
            ['faturaTipo_id'] : e,
        })
    }

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name] : e.target.value,
        })
    }

    const handleChangeFaturaPdf = (e) => {

            
    }

    const baixarPdf = () => {

    }

    const handleChangeDataFaturamento = (e) => {
        let valor = e.target.value + '-01';
        let data = valor.split('-');
        setForm({
            ...form,
            ['faturaKey_mes']: data[1],
            ['faturaKey_ano']: data[0],
            ['dataFaturamentoString']: valor,
        });
    }

    const handleSelecionarLinha = (e) => {
        limparCampos();
        setModal({
            ...modal,
            ['open']: true,
            ['msg']: `Editar Fatura existente!`,
        })
        console.log('handleSelecionarLinha', e, e.data);
        let uc = e.data.uc;
        let faturamento = e.data.dataFaturamento.split('-');
        let mes = faturamento[1];
        let ano = faturamento[0];
        getFatura(ano, mes, uc);
        
    }

    const handleCloseModal = () => {
        limparCampos();
        setModal({
            ...modal,
            ['open']: false,
        })
    }

    const handleAdd = () => {
        setModal({
            ...modal,
            ['open']: true,
            ['msg']: 'Adicionar uma nova Fatura'
        })
        setForm(preForm);
    }

    function validade (){
        let erros = {};
        if(!form.faturaKey_ucId || form.faturaKey_ucId.length < 4)
            erros.faturaKey_ucId = '*Inválido!';
        if(!form.faturaKey_ano)
            erros.faturaKey_ano = '*Inválido!';
        if(!form.faturaKey_mes)
            erros.faturaKey_mes = '*Inválido!';
        if(!form.nfe || form.nfe.length < 8)
            erros.nfe = '*Inválido!';
        if(!form.dataVencimentoString)
            erros.dataVencimentoString = '*Inválido!';
        if(!form.dataFaturamentoString)
            erros.dataFaturamentoString = '*Inválido!';
        if(!form.kwh)
            erros.kwh = '*Inválido!';
        if(!form.kvarh)
            erros.kvarh = '*Inválido!';
        if(!form.valor)
            erros.valor = '*Inválido!';
        if(!form.valImposto)
            erros.valImposto = '*Inválido!';
        if(!form.valBandeira)
            erros.valBandeira = '*Inválido!';
        if(!form.valEnergia)
            erros.valEnergia = '*Inválido!';
   //     if(!form.faturaTipo_id)
   //         erros.faturaTipo_id = '*Inválido!';
        return erros;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitting(true);
        setErros(validade(form));
    }

    useEffect( () => {
        console.log(Object.keys(erros).length, erros, submitting)
        if(Object.keys(erros).length === 0 && submitting){
            postFatura();
        }
        setSubmitting(false);
    })

    const handleFilterOpen = () => {
        setOpenFilter(!openFilter);
    }

    const getListaUcs= () => {
        ApiSage.get(`unidadeConsumidora/findAllByEmpresa?empresaId=${empresaId}`)
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

    useEffect (() => {
        if(empresaId !== ''){
            getListaUcs(empresaId);
        }
    }, [empresaId]); 

    const handleEditEmpresa = (valor) => {
        setEmpresaId(valor);
    }

    const handleEditInicio = (e) => {
        setInicio(e.target.value + '-01');
    }

    const handleEditFim = (e) => {
        setFim(e.target.value + '-01');
    }
    
    const handleEditUc = (e) => {
        console.log("caiu a casa", e.target);
        setUc(e.target.value);
    }

    const handleRefresh = () =>{
        getAllFaturas();
    }


    return (
        
        <Page pageTitle={intl.formatMessage({ id: 'CadastroFatura' , defaultMessage: 'Previsão de Consumo - Simulação'})}
                appBarContent={
                    <Toolbar disableGutters>
                        {processando ? <CircularProgress color="#f8f8f8"/> : `` }
                        <FilterListIcon style={{"cursor":"pointer"}} onClick={handleFilterOpen}/>
                    </Toolbar>
                }
        >
            <Scrollbar
            style={{ height: '100%', width: '100%', display: 'flex', flex: 1 }}
            >

                <Snackbar open={alertaRetorno.open} autoHideDuration={8000} onClose={handleCloseMsgRetorno}>
                    <Alert onClose={handleCloseMsgRetorno} severity={alertaRetorno.tipo}>
                        {alertaRetorno.msg}
                    </Alert>
                </Snackbar>

                    <Container maxWidth="lg"> 
                                                
                        <form className={classes.form} autoComplete="off" onSubmit={e => handleSubmit(e)}>
                            
                            <Grid container spacing={3} className={classes.container}>
                                
                                <Grid  item xs={12} sm={12}>
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    color="textSecondary"
                                    >
                                    Dados físicos
                                </Typography>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="label-descricao">Descrição</InputLabel>
                                        <Select
                                            labelId="label-descricao"
                                            id="select-descricao-id-1"
                                            name='select_descricao_id_1'
                                            value={form.select_descricao_id_1}
                                            onChange={(e) => {handleChange(e)}}
                                        >
                                                <MenuItem key={1} value={1}>Área</MenuItem>
                                                <MenuItem key={2} value={2}>Banheiro</MenuItem>
                                                <MenuItem key={3} value={3}>Cozinha</MenuItem>
                                                <MenuItem key={4} value={4}>Oficina</MenuItem>
                                                <MenuItem key={5} value={5}>Salão</MenuItem>
                                        </Select>
                                    </FormControl>

                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField type="number" id="perimetro_1" label="Perímetro" style={{"width":"100%"}} name='perimetro_1' onChange={e => handleChange(e) }/> 
                                </Grid>
                           
                                <Grid item xs={12} sm={4}>
                                    <TextField required type='number' name='area_1' id="nfe" label="Área" style={{"width":"100%"}} onChange={e => handleChange(e) } value={form.area_1} InputLabelProps={{shrink: true,}}/>
                             
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="label-descricao">Descrição</InputLabel>
                                        <Select
                                            labelId="label-descricao"
                                            id="select-descricao-id-2"
                                            value={form.select_descricao_id_2}
                                            name='select_descricao_id_2'
                                            onChange={(e) => {handleChange(e)}}
                                        >
                                                <MenuItem key={1} value={1}>Área</MenuItem>
                                                <MenuItem key={2} value={2}>Banheiro</MenuItem>
                                                <MenuItem key={3} value={3}>Cozinha</MenuItem>
                                                <MenuItem key={4} value={4}>Oficina</MenuItem>
                                                <MenuItem key={5} value={5}>Salão</MenuItem>
                                        </Select>
                                    </FormControl>

                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField type="number" id="perimetro_2" label="Perímetro" style={{"width":"100%"}} name='perimetro_2' value={form.area_2} onChange={e => handleChange(e) }/> 
                                </Grid>
                           
                                <Grid item xs={12} sm={4}>
                                    <TextField required type='number' name='area_2' id="area_2" label="Área" style={{"width":"100%"}} onChange={e => handleChange(e) } value={form.area_2} InputLabelProps={{shrink: true,}}/>
                             
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="label-descricao">Descrição</InputLabel>
                                        <Select
                                            labelId="label-descricao"
                                            id="select-descricao-id-3"
                                            value={form.select_descricao_id_3}
                                            name='select_descricao_id_3'
                                            onChange={(e) => {handleChange(e)}}
                                        >
                                                <MenuItem key={1} value={1}>Área</MenuItem>
                                                <MenuItem key={2} value={2}>Banheiro</MenuItem>
                                                <MenuItem key={3} value={3}>Cozinha</MenuItem>
                                                <MenuItem key={4} value={4}>Oficina</MenuItem>
                                                <MenuItem key={5} value={5}>Salão</MenuItem>
                                        </Select>
                                    </FormControl>

                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField type="number" id="perimetro_3" label="Perímetro" style={{"width":"100%"}} name='perimetro_3' value={form.perimetro_3} onChange={e => handleChange(e) }/> 
                                </Grid>
                           
                                <Grid item xs={12} sm={4}>
                                    <TextField required type='number' name='area_3' id="area_3" label="Área" style={{"width":"100%"}} onChange={e => handleChange(e) } value={form.area_3} InputLabelProps={{shrink: true,}}/>
                             
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="label-descricao">Descrição</InputLabel>
                                        <Select
                                            labelId="label-descricao"
                                            id="select-descricao_id_4"
                                            value={form.select_descricao_id_4}
                                            name='select_descricao_id_4'
                                            onChange={(e) => {handleChange(e)}}
                                        >
                                                <MenuItem key={1} value={1}>Área</MenuItem>
                                                <MenuItem key={2} value={2}>Banheiro</MenuItem>
                                                <MenuItem key={3} value={3}>Cozinha</MenuItem>
                                                <MenuItem key={4} value={4}>Oficina</MenuItem>
                                                <MenuItem key={5} value={5}>Salão</MenuItem>
                                        </Select>
                                    </FormControl>

                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField type="number" id="perimetro_4" label="Perímetro" style={{"width":"100%"}} name='perimetro_4' value={form.perimetro_4}  onChange={e => handleChange(e) }/> 
                                </Grid>
                           
                                <Grid item xs={12} sm={4}>
                                    <TextField required type='number' name='area_4' id="area_4" label="Área" style={{"width":"100%"}} onChange={e => handleChange(e) } value={form.area_4} InputLabelProps={{shrink: true,}}/>
                             
                                </Grid>

                    
                                                    
                            </Grid>

                            <Grid container spacing={3} className={classes.container}>
                                
                                <Grid  item xs={12} sm={12}>
                                    <Typography
                                        gutterBottom
                                        variant="h6"
                                        color="textSecondary"
                                        >
                                        Características de funcionamento
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} sm={1}>
                                    <TextField required type='time' name='inicio_1' id="inicio_1" label="Inicio" style={{"width":"100%"}} onChange={e => handleChange(e) } value={form.inicio_1} InputLabelProps={{shrink: true,}}/>
                                </Grid>
                                <Grid item xs={12} sm={1}>
                                    <TextField required type='time' name='fim_1' id="fim_1" label="Final" style={{"width":"100%"}} onChange={e => handleChange(e) } value={form.fim_1} InputLabelProps={{shrink: true,}}/>
                                </Grid>
                                <Grid item xs={12} sm={10}>
                                    <FormControlLabel
                                        value="top"
                                        control={<Switch color="primary" />}
                                        label="Seg"
                                        labelPlacement="top"
                                    />
                                   <FormControlLabel
                                        value="top"
                                        control={<Switch color="primary" />}
                                        label="Ter"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="top"
                                        control={<Switch color="primary" />}
                                        label="Qua"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="top"
                                        control={<Switch color="primary" />}
                                        label="Qui"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="top"
                                        control={<Switch color="primary" />}
                                        label="Sex"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="top"
                                        control={<Switch color="primary" />}
                                        label="Sab"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="top"
                                        control={<Switch color="primary" />}
                                        label="Dom"
                                        labelPlacement="top"
                                    />

                                </Grid>

                                <Grid item xs={12} sm={1}>
                                    <TextField required type='time' name='inicio_1' id="inicio_1" label="Inicio" style={{"width":"100%"}} onChange={e => handleChange(e) } value={form.inicio_1} InputLabelProps={{shrink: true,}}/>
                                </Grid>
                                <Grid item xs={12} sm={1}>
                                    <TextField required type='time' name='fim_1' id="fim_1" label="Final" style={{"width":"100%"}} onChange={e => handleChange(e) } value={form.fim_1} InputLabelProps={{shrink: true,}}/>
                                </Grid>
                                <Grid item xs={12} sm={10}>
                                    <FormControlLabel
                                        value="top"
                                        control={<Switch color="primary" />}
                                        label="Seg"
                                        labelPlacement="top"
                                    />
                                   <FormControlLabel
                                        value="top"
                                        control={<Switch color="primary" />}
                                        label="Ter"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="top"
                                        control={<Switch color="primary" />}
                                        label="Qua"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="top"
                                        control={<Switch color="primary" />}
                                        label="Qui"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="top"
                                        control={<Switch color="primary" />}
                                        label="Sex"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="top"
                                        control={<Switch color="primary" />}
                                        label="Sab"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="top"
                                        control={<Switch color="primary" />}
                                        label="Dom"
                                        labelPlacement="top"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={1}>
                                    <TextField required type='time' name='inicio_1' id="inicio_1" label="Inicio" style={{"width":"100%"}} onChange={e => handleChange(e) } value={form.inicio_1} InputLabelProps={{shrink: true,}}/>
                                </Grid>
                                <Grid item xs={12} sm={1}>
                                    <TextField required type='time' name='fim_1' id="fim_1" label="Final" style={{"width":"100%"}} onChange={e => handleChange(e) } value={form.fim_1} InputLabelProps={{shrink: true,}}/>
                                </Grid>
                                <Grid item xs={12} sm={10}>
                                    <FormControlLabel
                                        value="top"
                                        control={<Switch color="primary" />}
                                        label="Seg"
                                        labelPlacement="top"
                                    />
                                   <FormControlLabel
                                        value="top"
                                        control={<Switch color="primary" />}
                                        label="Ter"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="top"
                                        control={<Switch color="primary" />}
                                        label="Qua"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="top"
                                        control={<Switch color="primary" />}
                                        label="Qui"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="top"
                                        control={<Switch color="primary" />}
                                        label="Sex"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="top"
                                        control={<Switch color="primary" />}
                                        label="Sab"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="top"
                                        control={<Switch color="primary" />}
                                        label="Dom"
                                        labelPlacement="top"
                                    />
                                </Grid>
                               
                                <Grid container spacing={3} className={classes.container}>
                                
                                    <Grid  item xs={12} sm={12}>
                                    <Typography
                                        gutterBottom
                                        variant="h6"
                                        color="textSecondary"
                                        >
                                        Equipamentos específicos
                                    </Typography>
                                    </Grid>

                                    <Grid item xs={12} sm={4}>
                                        <FormControl className={classes.formControl}>
                                            <InputLabel id="label-descricao">Descrição</InputLabel>
                                            <Select
                                                labelId="label-descricao"
                                                id="select_tipo_equipamento_id_1"
                                                value={form.select_tipo_equipamento_id_1}
                                                name='select_tipo_equipamento_id_1'
                                                onChange={(e) => {handleChange(e)}}
                                            >
                                                    <MenuItem key={1} value={1}>Ar condicionado</MenuItem>
                                                    <MenuItem key={2} value={2}>Motor</MenuItem>
                                                    <MenuItem key={3} value={3}>Aquecedor</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField type="number" id="potencia_1" label="Potência (KW)" style={{"width":"100%"}} name='potencia_1' onChange={e => handleChange(e) }/> 
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <FormControl className={classes.formControl}>
                                            <InputLabel id="label_local_equipamento_1">Cômodo</InputLabel>
                                            <Select
                                                labelId="label_local_equipamento_1"
                                                id="select_local_equipamento_1"
                                                value={form.select_local_equipamento_1}
                                                name='select_local_equipamento_1'
                                                onChange={(e) => {handleChange(e)}}
                                            >
                                                    <MenuItem key={1} value={1}>Oficina</MenuItem>
                                                    <MenuItem key={2} value={2}>Sala</MenuItem>
                                                    <MenuItem key={3} value={3}>Banheiro</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} sm={4}>
                                        <FormControl className={classes.formControl}>
                                            <InputLabel id="label-descricao-2">Descrição</InputLabel>
                                            <Select
                                                labelId="label-descricao-2"
                                                id="select_tipo_equipamento_id_2"
                                                value={form.select_tipo_equipamento_id_2}
                                                name='select_tipo_equipamento_id_2'
                                                onChange={(e) => {handleChange(e)}}
                                            >
                                                    <MenuItem key={1} value={1}>Ar condicionado</MenuItem>
                                                    <MenuItem key={2} value={2}>Motor</MenuItem>
                                                    <MenuItem key={3} value={3}>Aquecedor</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField type="number" id="potencia_2" label="Potência (KW)" style={{"width":"100%"}} name='potencia_2' onChange={e => handleChange(e) }/> 
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <FormControl className={classes.formControl}>
                                            <InputLabel id="label_local_2">Cômodo</InputLabel>
                                            <Select
                                                labelId="label-local_2"
                                                id="select_local_equipamento_id_2"
                                                value={form.select_local_equipamento_id_2}
                                                name='select_local_equipamento_id_2'
                                                onChange={(e) => {handleChange(e)}}
                                            >
                                                    <MenuItem key={1} value={1}>Oficina</MenuItem>
                                                    <MenuItem key={2} value={2}>Sala</MenuItem>
                                                    <MenuItem key={3} value={3}>Banheiro</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} sm={4}>
                                        <FormControl className={classes.formControl}>
                                            <InputLabel id="label-descricao-3">Descrição</InputLabel>
                                            <Select
                                                labelId="label-descricao-3"
                                                id="select_tipo_equipamento_id_3"
                                                value={form.select_tipo_equipamento_id_3}
                                                name='select_tipo_equipamento_id_3'
                                                onChange={(e) => {handleChange(e)}}
                                            >
                                                    <MenuItem key={1} value={1}>Ar condicionado</MenuItem>
                                                    <MenuItem key={2} value={2}>Motor</MenuItem>
                                                    <MenuItem key={3} value={3}>Aquecedor</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField type="number" id="potencia_3" label="Potência (KW)" style={{"width":"100%"}} name='potencia_3' onChange={e => handleChange(e) }/> 
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <FormControl className={classes.formControl}>
                                            <InputLabel id="label-local_3">Cômodo</InputLabel>
                                            <Select
                                                labelId="label-local_3"
                                                id="select_local_equipamento_id_3"
                                                value={form.select_local_equipamento_id_3}
                                                name="select_local_equipamento_id_3"
                                                onChange={(e) => {handleChange(e)}}
                                            >
                                                    <MenuItem key={1} value={1}>Oficina</MenuItem>
                                                    <MenuItem key={2} value={2}>Sala</MenuItem>
                                                    <MenuItem key={3} value={3}>Banheiro</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    
                                </Grid>
                                    
                                <Grid container spacing={3} className={classes.container}>
                                
                                    <Grid  item xs={12} sm={12}>
                                    <Typography
                                        gutterBottom
                                        variant="h6"
                                        color="textSecondary"
                                        >
                                        Carga instalada
                                    </Typography>
                                    </Grid>

                                    <Grid item xs={12} sm={3}>
                                        <FormControl className={classes.formControl}>
                                            <InputLabel id="label-local-_1">Cômodo</InputLabel>
                                            <Select
                                                labelId="label-local_1"
                                                id="select_local_carga_id_1"
                                                value={form.select_local_carga_id_1}
                                                name='select_local_carga_id_1'
                                                onChange={(e) => {handleChange(e)}}
                                            >
                                                    <MenuItem key={1} value={1}>Oficina</MenuItem>
                                                    <MenuItem key={2} value={2}>Sala</MenuItem>
                                                    <MenuItem key={3} value={3}>Banheiro</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField type="number" id="iluminacao_1" label="Iluminação (KW)" style={{"width":"100%"}} name='iluminacao_1' onChange={e => handleChange(e) }/> 
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField type="number" id="tug_1" label="TUG's (KW)" style={{"width":"100%"}} name='tug_1' onChange={e => handleChange(e) }/> 
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField type="number" id="tue_1" label="TUE's (KW)" style={{"width":"100%"}} name='tue_1' onChange={e => handleChange(e) }/> 
                                    </Grid>

                                    <Grid item xs={12} sm={3}>
                                        <FormControl className={classes.formControl}>
                                            <InputLabel id="label-local-_2">Cômodo</InputLabel>
                                            <Select
                                                labelId="label-local_2"
                                                id="select_local_carga_id_2"
                                                value={form.select_local_carga_id_2}
                                                name='select_local_carga_id_2'
                                                onChange={(e) => {handleChange(e)}}
                                            >
                                                    <MenuItem key={1} value={1}>Oficina</MenuItem>
                                                    <MenuItem key={2} value={2}>Sala</MenuItem>
                                                    <MenuItem key={3} value={3}>Banheiro</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField type="number" id="iluminacao_2" label="Iluminação (KW)" style={{"width":"100%"}} name='iluminacao_2' onChange={e => handleChange(e) }/> 
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField type="number" id="tug_2" label="TUG's (KW)" style={{"width":"100%"}} name='tug_2' onChange={e => handleChange(e) }/> 
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField type="number" id="tue_2" label="TUE's (KW)" style={{"width":"100%"}} name='tue_2' onChange={e => handleChange(e) }/> 
                                    </Grid>

                                    <Grid item xs={12} sm={3}>
                                        <FormControl className={classes.formControl}>
                                            <InputLabel id="label-local-_3">Cômodo</InputLabel>
                                            <Select
                                                labelId="label-local_3"
                                                id="select_local_carga_id_3"
                                                value={form.select_local_carga_id_3}
                                                name='select_local_carga_id_3'
                                                onChange={(e) => {handleChange(e)}}
                                            >
                                                    <MenuItem key={1} value={1}>Oficina</MenuItem>
                                                    <MenuItem key={2} value={2}>Sala</MenuItem>
                                                    <MenuItem key={3} value={3}>Banheiro</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField type="number" id="iluminacao_3" label="Iluminação (KW)" style={{"width":"100%"}} name='iluminacao_3' onChange={e => handleChange(e) }/> 
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField type="number" id="tug_3" label="TUG's (KW)" style={{"width":"100%"}} name='tug_3' onChange={e => handleChange(e) }/> 
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField type="number" id="tue_3" label="TUE's (KW)" style={{"width":"100%"}} name='tue_3' onChange={e => handleChange(e) }/> 
                                    </Grid>

                                    <Grid item xs={12} sm={3}>
                                        <FormControl className={classes.formControl}>
                                            <InputLabel id="label-local-_4">Cômodo</InputLabel>
                                            <Select
                                                labelId="label-local_4"
                                                id="select_local_carga_id_4"
                                                value={form.select_local_carga_id_4}
                                                name='select_local_carga_id_4'
                                                onChange={(e) => {handleChange(e)}}
                                            >
                                                    <MenuItem key={1} value={1}>Oficina</MenuItem>
                                                    <MenuItem key={2} value={2}>Sala</MenuItem>
                                                    <MenuItem key={3} value={3}>Banheiro</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField type="number" id="iluminacao_4" label="Iluminação (KW)" style={{"width":"100%"}} name='iluminacao_4' onChange={e => handleChange(e) }/> 
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField type="number" id="tug_4" label="TUG's (KW)" style={{"width":"100%"}} name='tug_4' onChange={e => handleChange(e) }/> 
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField type="number" id="tue_4" label="TUE's (KW)" style={{"width":"100%"}} name='tue_4' onChange={e => handleChange(e) }/> 
                                    </Grid>
                                </Grid>

                                <Grid container spacing={3} className={classes.container}>
                                    <Grid item xs={12} sm={12}>
                                        <Button style={{'width':'100%'}} variant="contained" color="primary">
                                            Simular
                                        </Button>
                                    </Grid>
                                </Grid>                             

                                <Grid container spacing={3} className={classes.container}>
                                
                                    <Grid  item xs={12} sm={12}>
                                    <Typography
                                        gutterBottom
                                        variant="h6"
                                        color="textSecondary"
                                        >
                                        Previsão Final
                                    </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <TextField disabled type="number" id="resultado_final" label="Previsão de carga" style={{"width":"100%"}} name='resultado_final' /> 
                                    </Grid>
                                </Grid>

                            </Grid>
                        </form>
                        
                    </Container>  
                    <Drawer
                        className={classes.drawer}
                        variant="persistent"
                        anchor="right"
                        open={openFilter}
                        classes={{
                        paper: classes.drawerPaper,
                        }}
                    >
                    <div className={classes.drawerHeader}>
                    <IconButton onClick={handleFilterOpen}>
                        {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                    </div>
                    <Divider />
                        <List>
                            <ListItem button key='empresa_1'>
                                <SelectEmpresas onChange={handleEditEmpresa} value={empresaId} />
                            </ListItem>
                        </List>
                    <Divider />
                    <Button style={{'margin': '10px'}} variant="contained" color="primary" onClick={handleRefresh} >Consultar</Button>          
                </Drawer>             
            </Scrollbar>            
        </Page>

    )

}

export default PrevisaoConsumo;