import React, {useState, useEffect} from 'react';
import Page from 'material-ui-shell/lib/containers/Page'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar/Scrollbar'
import TextField from '@material-ui/core/TextField';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { CircularProgress , Container, Grid, Button, Toolbar, DialogActions, Divider , Link, } from '@material-ui/core';
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
import SelectEmpresasEnergia from 'componentes/SelectEmpresasEnergia/SelectEmpresasEnergia';


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

const CadastroFatura = () => {

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

    const [uc, setUc] = useState('');
    const [fatura, setFatura] = useState('');
    const [listaUcs, setListaUcs] = useState([]);
        
    const [dadosTabela, setDadosTabela] = useState({
        rows: [],
        columns:[],
    })

    const [empresaEnergiaId, setEmpresaEnergiaId] = useState('');
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
        //console.log('fatura', fatura)
        Object.assign(form, fatura);
        setForm(form);
    }
    
    const getAllFaturas = () => {
        //console.log("getAllFaturas", uc, inicio, fim);
        ApiSage.get(`fatura/findAll?uc=${uc}&inicio=${inicio}&fim=${fim}`).then(
            (response) => {
                retornoGetAllFaturas(response.data);
            }
        ).catch( (error) => {
            //console.log(error.response);
            setAlertaRetorno({
                open: true,
                tipo: 'error',
                msg: `Falha ao buscar todas as faturas: Sem dados para os critérios de consulta`
            });
        });
    }

    /*
    useEffect (() => {
        getAllFaturas()
    }, [])
*/

    const retornoGetAllFaturas2 = (ucs) => {
        let ucsTable = [];
        console.log(ucs)
        for( let i in ucs){
            ucsTable.push({id: i, uc: ucs[i].faturaKey.ucId, dataVencimento: ucs[i].dataVencimento, dataFaturamento: ucs[i].dataFaturamento, 
                            kwh: ucs[i].kwh, kvarh: ucs[i].kvarh, valor: ucs[i].valor})
        }
        setRows(ucsTable);
    }

    const retornoGetAllFaturas = (ucs) => {

        let ucAjustada = [];
        for(let i = 0; i < ucs.length; ++i){
            ucs[i]['uc'] = ucs[i]['faturaKey']['ucId'];
            ucs[i]['faturaKey'] = null;
            ucs[i]['id'] = i;
            ucAjustada.push(ucs[i]);
        }
            
        let ucsTable = {
            rows: [],
            columns: [],
        };
        ucsTable.rows = ucAjustada;

        let uc = ucAjustada[0];
        let colunas = []
        for (let column in uc){
            colunas.push({field: column, headerName: column, width: 170});
        }
            
        ucsTable.columns = colunas;

        setDadosTabela(ucsTable);
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
                    
                    setAlertaRetorno({
                        open: true,
                        tipo: 'error',
                        msg: `Falha ao salvar fatura: ${error.response.data.message}`
                    });
                });
    }

    const postFaturaPdf = () => {
        let dados = '';
        ApiSage.post('fatura/upLoadFaturaPdf', dados)
            .then( (response) => {
                retornoPostFaturaPdf(response);
                setModal({open: false, mensagem: ''});
            })
            .catch((error) => {
                setAlertaRetorno({
                    open: true,
                    tipo: 'error',
                    msg: `Falha ao salvar fatura: ${error.response.data.message}`
                });
            });
    }

    const retornoPostFaturaPdf = (retorno) => {
        console.log('retornoPostFaturaPdf', retorno);
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
        console.log(e.target.name , e.target.files, e.target.files[0])
   /*     setForm({
            ...form,
            [e.target.name] : e.target.files[0],
        }) */
        const data = new FormData();
        data.append("fatura", e.target.files[0]);

        let mes = form.faturaKey_mes < 10 ? '0' + form.faturaKey_mes : form.faturaKey_mes;
        ApiSage.post(`fatura/${empresaId}_${form.faturaKey_ucId}_${form.faturaKey_ano}_${mes}/upLoad`, data)
            .then( (response) => {
                console.log(response);
                
                
            })
            .catch((error) => {
                console.log(error.response);

            });
            
    }

    const baixarPdf = () => {
        ApiSage.get(`fatura/downloadFile/fatura_${empresaId}_${form.faturaKey_ucId}_${form.faturaKey_ano}_${form.faturaKey_mes}.pdf`, {responseType: 'blob'})
                .then( response => {
                    const content = response.headers['content-type'];
                    download(response.data, 'fatura', content);
                }).catch( (error) => {
                    console.log(error.response);
                });
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

    const handleSubmitPDF = (e) => {
        e.preventDefault();
        postFaturaPdf();
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

    const handleChangeEmpresaEnergia = (e) =>{
        setEmpresaEnergiaId(e);
    }

    const handleChangeUcLeitorFatura = (e) => {
        setUc(e.target.value);
    }

    const handleChangeLeitorFaturaPdf = (e) => {
        setFatura(e.target.files[0]);
    }

    const handleSubmitLeitorPDF = (e) => {
        const data = new FormData();
        data.append("fatura", fatura);
        e.preventDefault();
        ApiSage.post(`fatura/${uc}/upLoadFaturaPdfComLeitura`, data)
            .then( (response) => {
                setAlertaRetorno(
                    {open:true, 
                    msg: 'Fatura Salva', 
                    tipo: 'success'
                });
                //console.log(response);
            })
            .catch((error) => {
                setAlertaRetorno({open:true, msg: `Falha ao salvar: ${error.response}`, tipo: 'error'});
                //console.log(error.response);
            });
    }

    return (
        
        <Page pageTitle={intl.formatMessage({ id: 'CadastroFatura' , defaultMessage: 'Cadastro de Faturas'})}
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
                <div style={{ margin: '15px', height: '85%'}}>
                    <DataGrid rows={dadosTabela.rows} columns={dadosTabela.columns}  pageSize={15}  onRowSelected={handleSelecionarLinha}/>                    
                </div>

                <Tooltip title="Add" aria-label="add" style={{'margin-left':'15px'}}>
                    <Fab color="primary" className={classes.fab}>
                        <AddIcon onClick={handleAdd}/>
                    </Fab>
                </Tooltip>

                <Snackbar open={alertaRetorno.open} autoHideDuration={8000} onClose={handleCloseMsgRetorno}>
                    <Alert onClose={handleCloseMsgRetorno} severity={alertaRetorno.tipo}>
                        {alertaRetorno.msg}
                    </Alert>
                </Snackbar>

                    <Container maxWidth="lg"> 
                        
                        <Dialog
                            fullWidth={true}
                            maxWidth="lg"
                            open={modal.open}
                            onClose={handleCloseModal}
                            aria-labelledby="max-width-dialog-title"
                        >
                            <DialogTitle id="max-width-dialog-title">Cadastro Fatura</DialogTitle>
                            <DialogContent>
                            <DialogContentText>
                                {modal.mensagem}
                            </DialogContentText>
                                <form className={classes.form} autoComplete="off" onSubmit={e => handleSubmit(e)}>
                                    <Grid container spacing={3} className={classes.container}>
                                        <Grid item xs={12} sm={2}>
                                            <TextField required id="faturaKey_ucId" label="UC" name='faturaKey_ucId' style={{"width":"100%"}} onChange={ e => handleChange(e) } value={form.faturaKey_ucId}/>
                                            {erros.faturaKey_ucId && <p className='error-input'>{erros.faturaKey_ucId}</p>}
                                        </Grid>
                                        
                                        
                                    { /* retirar a pedido do Affonso
                                         <Grid item xs={12} sm={2}>
                                            <SelectFaturaTipo required name='faturaTipo' onChange={handleSelecionarFaturaTipo} value={form.faturaTipo_id}/>
                                            {erros.faturaTipo && <p className='error-input'>{erros.faturaTipo}</p>}
                                        </Grid>
                                    */ }
                                        <Grid item xs={12} sm={6}>
                                            <TextField required type='number' name='nfe' id="nfe" label="NFe" style={{"width":"100%"}} onChange={e => handleChange(e) } value={form.nfe} InputLabelProps={{shrink: true,}}/>
                                            {erros.nfe && <p className='error-input'>{erros.nfe}</p>}
                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <TextField required type="month" name='dataFaturamentoString'  id="dataFaturamentoString" label="Faturamento" style={{"width":"100%"}} onChange={e => handleChangeDataFaturamento(e) } value={form.dataFaturamentoString.substring(0,7)}  InputLabelProps={{shrink: true,}}/>
                                            {erros.dataFaturamentoString && <p className='error-input'>{erros.dataFaturamentoString}</p>}
                                        </Grid>
                                        
                                        <Grid item xs={12} sm={2}>
                                            <TextField required type='date' name='dataVencimentoString' id="dataVencimentoString" label="Vencimento" style={{"width":"100%"}} onChange={e => handleChange(e) } value={form.dataVencimentoString} InputLabelProps={{shrink: true,}}/>
                                            {erros.dataVencimentoString && <p className='error-input'>{erros.dataVencimentoString}</p>}
                                        </Grid>
                                        

                                        <Grid item xs={12} sm={2}>
                                            <TextField required type="number" id="kwh" label="Kwh" style={{"width":"100%"}} name='kwh' onChange={e => handleChange(e) } value={form.kwh}/>
                                            {erros.kwh && <p className='error-input'>{erros.kwh}</p>}
                                        </Grid>

                                        <Grid item xs={12} sm={2}>
                                            <TextField required type="number" id="kvarh" label="Kvarh" style={{"width":"100%"}} name='kvarh' onChange={e => handleChange(e) } value={form.kvarh}/>
                                            {erros.kvarh && <p className='error-input'>{erros.kvarh}</p>}
                                        </Grid>
                                        
                                        <Grid item xs={12} sm={2}>
                                            <TextField required type="number" id="valorEnergia" label="Valor Energia" style={{"width":"100%"}} name='valEnergia' onChange={e => handleChange(e) } value={form.valEnergia}/>
                                            {erros.valEnergia && <p className='error-input'>{erros.valEnergia}</p>}
                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <TextField required type="number" id="bandeira" label="Valor Bandeira" style={{"width":"100%"}} name='valBandeira' onChange={e => handleChange(e) } value={form.valBandeira}/>
                                            {erros.valBandeira && <p className='error-input'>{erros.valBandeira}</p>}
                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <TextField required type="number" id="imposto" label="Valor Impostos" style={{"width":"100%"}} name='valImposto' onChange={e => handleChange(e) } value={form.valImposto}/>
                                            {erros.valImposto && <p className='error-input'>{erros.valImposto}</p>}
                                        </Grid>

                                        <Grid item xs={12} sm={2}>
                                            <TextField required type="number" id="valor" label="Valor Final" style={{"width":"100%"}} name='valor' onChange={e => handleChange(e) } value={form.valor}/>
                                            {erros.valor && <p className='error-input'>{erros.valor}</p>}
                                        </Grid>
                                                                
                                    </Grid>
                                      
                                    <DialogActions>
                                        <Button type='submit' color="primary">
                                            Salvar
                                        </Button>
                                    </DialogActions>
                                </form>
                                <form className={classes.form} autoComplete="off" onSubmit={e => handleSubmitPDF(e)}>
                                    <Grid container spacing={3} className={classes.container}>
                                        <Grid item xs={12} sm={4}>
                                            <SelectEmpresasEnergia onChange={e=> handleChangeEmpresaEnergia(e)}/>
                                        </Grid>
                                        <Grid item xs={12} sm={8}>
                                            <TextField type="file" id="faturaPdf" label="Importar Fatura PDF" style={{"width":"100%"}} name='faturaPdf' onChange={e => handleChangeFaturaPdf(e) }/> 
                                        </Grid>
                                    </Grid>
                                    <DialogActions>
                                        <Button type='submit' color="primary">
                                            Salvar Fatura PDF
                                        </Button>
                                    </DialogActions>                 
                                </form>
                                <form className={classes.form} autoComplete="off" onSubmit={e => handleSubmitLeitorPDF(e)}>
                                    <Grid container spacing={3} className={classes.container}>
                                        <Grid item xs={12} sm={4}>
                                            <TextField required id="uc" label="UC" name='uc' style={{"width":"100%"}} onChange={ e => handleChangeUcLeitorFatura(e) } value={uc}/>
                                        </Grid>
                                        <Grid item xs={12} sm={8}>
                                            <TextField type="file" id="faturaPdf" label="Importar Fatura PDF" style={{"width":"100%"}} name='faturaPdf' onChange={e => handleChangeLeitorFaturaPdf(e) }/> 
                                        </Grid>
                                    </Grid>
                                    <DialogActions>
                                        <Button type='submit' color="primary">
                                            Salvar e ler Fatura PDF
                                        </Button>
                                    </DialogActions>                 
                                </form>
                            </DialogContent>
                            
                        </Dialog>
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
                            <ListItem button key='ucs'>
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="label-ucs">UCs</InputLabel>
                                    <Select
                                    labelId="label-ucs"
                                    id="select-id"
                                    value={uc}
                                    onChange={handleEditUc}
                                    >
                                    {listaUcs.map(u => (
                                        <MenuItem key={u.id} value={u.id}>{u.nome}</MenuItem>
                                    ))}
                                    </Select>
                                </FormControl>
                            </ListItem>
                        </List>
                    <Divider />
                    <List>
                        <ListItem button key='dt_1'>
                            <TextField
                                id="inicio"
                                label="Início"
                                type="month"
                                defaultValue={mesAnoInicio}
                                className={classes.textField}
                                InputLabelProps={{
                                shrink: true,
                                }}
                                onChange={handleEditInicio}
                            />
                        </ListItem>
                        <ListItem button key='dt_2'>
                            <TextField
                                id="fim"
                                label="Fim"
                                type="month"
                                defaultValue={mesAnoFim}
                                className={classes.textField}
                                InputLabelProps={{
                                shrink: true,
                                }}
                                onChange={handleEditFim}
                            />
                        </ListItem>
                    </List>  
                    <Divider />
                    <Button style={{'margin': '10px'}} variant="contained" color="primary" onClick={handleRefresh} >Consultar</Button>          
                </Drawer>             
            </Scrollbar>            
        </Page>

    )

}

export default CadastroFatura;