import React, {useState, useEffect} from 'react';
import Page from 'material-ui-shell/lib/containers/Page'
import { makeStyles } from '@material-ui/core/styles';
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar/Scrollbar'
import TextField from '@material-ui/core/TextField';

import { CircularProgress , Container, Grid, Button, Divider, Toolbar, Checkbox} from '@material-ui/core';
import { DataGrid, getIdFromRowElem } from '@material-ui/data-grid';

import MuiAlert from '@material-ui/lab/Alert';
import {  FormControl, InputLabel,Select, MenuItem } from '@material-ui/core';
import { useIntl } from 'react-intl'
import ApiSage from '../../services/ApiSage'
import SelectEmpresas from '../../componentes/SelectEmpresas/SelectEmpresas.js';

import Alerta from '../../componentes/Alerta/Alerta.js';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import SelectEmpresasEnergia from 'componentes/SelectEmpresasEnergia/SelectEmpresasEnergia';
import SelectFaturaTipo from 'componentes/SelectFaturaTipo/SelectFaturaTipo.js';
import SelectEstado from 'componentes/SelectEstado/SelectEstado.js';
import SelectCidade from  'componentes/SelectCidade/SelectCidade.js';

import {unificarDados, desUnificarDados} from 'services/Obj.js';
import SelectCnpj from 'componentes/SelectCnpj/SelectCnpj';

import './style.css';
import SelectAtivo from "../../componentes/SelectAtivo/SelectAtivo";

const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
        marginTop: theme.spacing(2),
        paddingTop: '1px',
        paddingBottom: '1px',
      },
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
    formControl: {
        paddingTop: 1,
        paddingBottom: 1,
        minWidth: 120,
        width: '100%',
    },
  }));



const CadastroUc = () => {

    const intl = useIntl()
    const classes = useStyles();

    const [empresaSelecionada, setEmpresaSelecionada] = useState('');
    const [ativo, setAtivo] = useState(1);

    const preForm = () => {
        return {   
            id: '',
            nome: '',
            centroCusto: '',
            cnpj_razaoSocial: '',
            cnpj_id: '',
            cnpj_cnpj: '',
            empresa_id: empresaSelecionada,
            empresaEnergiaList: [],
            empresaEnergia_id: '',
            empresaEnergia_nome: '',
            faturaTipo_id: '',
            faturaTipo_nome: '',
            endereco_id: '',
            endereco_estado: '',
            endereco_estadoId: '',
            endereco_cidade: '',
            endereco_cidadeId: '',
            endereco_bairro: '',
            endereco_rua: '',
            endereco_numero: '',
            endereco_bloco: '',
            endereco_apto: '',
            endereco_latitude: '',
            endereco_longitude: '',
            endereco_endCepId: '',
            faturamento: '',
            qtdeVendasMensal: '',
            areaLojaMetrosQuadrados: '',
            qtdeLampadas: '',
            cargaInstalada: '',
            cargaHorariaMensal: '',
            qtdeFuncionarios: '',
            qtdeFases:'',
            parceiroNegocio: '',
            contaContrato: '',
            debitoEmConta: '',
            contaPlurimensal: '',
            dtInicioContrato: ' ',
            dtFimContrato: ' ',
            codigoTarifa: '',
            classeFaturamento: '',
            subCategoria_codigo:'NA',
            faturaSubTipo_id:'',
            demandaContratada:'',
            demandaContratadaPonta:'',
            demandaContratadaForaPonta:'',
            tensao_id:'',
            numeroMedidor:'',
            ativa:1,
            isAtendimentoPrioritario:'',
            isGeracaoDistribuida:''
        }
    }



    const [form, setForm] = useState(preForm);
    const [erros, setErros] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (event) =>{
        setForm({
            ...form,
            [event.target.name]: event.target.value
        })
    }

    function validade(){
        console.log(form)
        let erros = {};
        if(!form.id || form.id.length < 2)
            erros.id = `Id inválido!`;
        if(!form.nome || form.nome.length < 2)
            erros.nome = `Nome inválido!`;
        if(!form.cnpj_id)
            erros.cnpj_id = `Selecionar Cnpj!`;
        if(!form.empresa_id)
            erros.empresa_id = `Selecionar Empresa`;
        if(!form.empresaEnergia_id)
            erros.empresaEnergia_id = `Selecionar distribuidora`;
        if(!form.faturaTipo_id)
            erros.faturaTipo_id = `Selecionar Categoria`;
        if(!form.endereco_estado || form.endereco_estado.length < 2)
            erros.endereco_estado = "Selecionar Estado";
        if(!form.endereco_cidade || form.endereco_cidade.length < 2)
            erros.endereco_cidade = "*Cidade inválido!";
        if(!form.endereco_bairro || form.endereco_bairro.length < 1)
            erros.endereco_bairro = "*Bairro inválido!";
        if(!form.endereco_rua)
            erros.endereco_rua = "*Rua inválida!";
        if(!form.endereco_numero)
            erros.endereco_numero = "*Numero inválido!";
/*
        if(form.endereco_bloco.length > 1)
            erros.endereco_bloco = "*Bloco deve possuir 1 caracter!"
        if(!form.faturamento || form.faturamento < 0)
            erros.faturamento = "*Faturamento inválido!";
        if(!form.qtdeVendasMensal || form.qtdeVendasMensal < 0)
            erros.qtdeVendasMensal = "*Vendas inválidas";
        if(!form.areaLojaMetrosQuadrados || form.areaLojaMetrosQuadrados <0)
            erros.areaLojaMetrosQuadrados = "*Area inválida";
        if(!form.qtdeLampadas || form.qtdeLampadas <0)
            erros.qtdeLampadas = "*invalido";
        if(!form.cargaInstalada || form.cargaInstalada <0)
            erros.cargaInstalada = "*invalido";
        if(!form.cargaHorariaMensal || form.cargaHorariaMensal <0)
            erros.cargaHorariaMensal = "*invalido";
        if(!form.qtdeFuncionarios || form.qtdeFuncionarios <0)
            erros.qtdeFuncionarios = "*invalido";

        if(!form.qtdeFases)
            erros.qtdeFases = '*Inválido';

        if(!form.centroCusto)
            erros.centroCusto = '*Inválido';
*/
        return erros;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setErros(validade(form));
        setSubmitting(true);
    }

    useEffect(()=>{
        if(Object.keys(erros).length === 0 && submitting){
            postUC();
        }
        setSubmitting(false);
    })

    const [processando, setProcessando] = useState(false);

    const [alertaRetorno , setAlertaRetorno] = useState({open:false, msg: '', tipo: 'error'})

    const [openModal, setOpenModal] = useState(false);
    const [mensagemAcaoModal, setMensagemAcaoModal] = useState('');

    const [rows, setRows] = useState([]);

    const [columns] = useState([
        { field: 'id', headerName: 'UC', width: 180 },
        { field: 'nome', headerName: 'NOME', width: 300 },
        { field: 'cnpj_razaoSocial', headerName: 'RAZÃO SOCIAL', width: 300 , hide: true},    
        { field: 'endereco_estado', headerName: 'ESTADO', width: 250 },
        { field: 'cnpj_id', headerName: 'CNPJ', width: 200 , hide: true},
        { field: 'endereco_cidade', headerName: 'CIDADE', width: 250},
        { field: 'endereco_id', headerName: 'Endereco Id', width: 70 , hide: true},
        { field: 'endereco_bairro', headerName: 'BAIRRO', width: 70 , hide: true},
        { field: 'endereco_rua', headerName: 'RUA', width: 70 , hide: true},
        { field: 'endereco_numero', headerName: 'NUM', width: 70 , hide: true},
        { field: 'endereco_bloco', headerName: 'BC', width: 70 , hide: true},
        { field: 'faturamento', headerName: 'Faturamento', width: 70 , hide: true},
        { field: 'qtdeVendasMensal', headerName: 'Vendas', width: 70 , hide: true},
        { field: 'areaLojaMetrosQuadrados', headerName: 'Área', width: 70 , hide: true},
        { field: 'qtdeLampadas', headerName: 'Lampadas', width: 70 , hide: true},
        { field: 'cargaInstalada', headerName: 'Carga', width: 70 , hide: true},
        { field: 'cargaHorariaMensal', headerName: 'Aberto', width: 70 , hide: true},
        { field: 'qtdeFuncionarios', headerName: 'Funcionários', width: 70 , hide: true},
        { field: 'empresaEnergia_id', headerName: 'Funcionários', width: 70 , hide: true},
        { field: 'empresaEnergia_nome', headerName: 'Funcionários', width: 70 , hide: true},
        { field: 'qtdeFases', headerName: 'Qtde Fases', width: 50, hide: true},
        { field: 'centroCusto', headerName: 'CC', width: 50, hide: true},
    ]);

    const getUc = (uc) => {
        console.log('getUc -> uc: ', uc)
        ApiSage.get(`unidadeConsumidora/findById?id=${uc.id}`).then(
            (response) => {
                console.log('ApiSage.get', response);
                retornoGetUc(response);
            }
        ).catch( (error) => {
            setAlertaRetorno({
                open: true,
                tipo: 'error',
                msg: `Falha ao buscar empresa ${uc.nome}: ${error.reponse.data.message}`,
            });
        });
    }

    const retornoGetUc = (response) => {
        let uc = response.data.unidadeConsumidora;
        let obj = unificarDados(uc,'');
        Object.assign(obj, {['empresa_id'] : empresaSelecionada});
        console.log('obj', obj);
        setForm(obj);
    }

    const getAllUCs = (empresaId, ativo) => {
        ApiSage.get(`unidadeConsumidora/findyAllByEmpresaWhithEnderecoAndDistribuidora?empresaId=${empresaId}&ativo=${ativo}`).then(
            (response) => {
                retornoGetAllUCs(response.data);
            }
        ).catch( (error) => {
            setAlertaRetorno({
                open: true,
                tipo: 'error',
                msg: `Falha ao buscar UCs: ${error.response.data.message}`,
            });
        });
    }

    const retornoGetAllUCs = (unidadeConsumidoraList) => {
        let ucs = [];
        for( let i in unidadeConsumidoraList){
            ucs.push(unificarDados(unidadeConsumidoraList[i],''));
        }
        console.log('ucs', ucs);
        setRows(ucs);
    }
    
    const postUC= () => {

        const dados = desUnificarDados(form, "_")
        console.log('postUc', dados);
        setProcessando(true);
        ApiSage.post('unidadeConsumidora', dados)
                .then( (response) => {
                    retornoPostUC(response);
                    getAllUCs(empresaSelecionada);
                    setProcessando(false);
                })
                .catch((error) => {
                    setAlertaRetorno({
                        open: true,
                        tipo: 'error',
                        msg: `Falha ao salvar uc: ${error.reponse.data.message}`,
                    });
                    setProcessando(false);
                });
        setOpenModal(false);
    }

    const retornoPostUC = (response) => {
        setAlertaRetorno({
            open: true,
            tipo: 'success',
            msg: `Uc ${response.data.nome} salva com sucesso`,
        });
    }

    const limparCampos = () => {
        setForm(preForm);
    }

    const handleSelecionarEmpresa = (e) => {
        setRows([]);
        setEmpresaSelecionada(e);
        getAllUCs(e, ativo);

    }
    const handleSelecionarAtivo = (e) => {
        setRows([]);
        setAtivo(e);
        console.log(e)
        getAllUCs(empresaSelecionada, e);
    }


    const handleSelecionarLinha = (e) => {
        limparCampos();
        //setMensagemAcaoModal('Editar Unidade Consumidora existente.')
        setOpenModal(true);
        getUc(e.data);
        
    }

    const handleCloseModal = () => {
        limparCampos();
        setOpenModal(false);
    }

    const handleAdd = () => {
        setOpenModal(true);
        setMensagemAcaoModal('Adicionar uma nova Unidade Consumidora');
       // Object.assign(preForm, {['empresa_id'] : empresaSelecionada});
        setForm(preForm);
    }

    const handleSelecionarEmpresaEnergia = (e) => {
        setForm({... form, ['empresaEnergia_id'] : e});
    }


    const handleSelecionarFaturaTipo = (e) => {

        if(form.faturaTipo_id < 5 && e >= 5 || form.faturaTipo_id >= 5 && e < 5 ){
            setForm({
                ...form,
                ['faturaTipo_id']: e,
                ['demandaContratada']: '',
                ['demandaContratadaPonta']: '',
                ['demandaContratadaForaPonta']: ''
            })
        }else{
            setForm({
                ...form,
                ['faturaTipo_id']: e
            })
        }

    }

    const handleSelecionarCnpj = (e) => {
        console.log('handleSelecionarCnpj', e);
        setForm({
            ...form,
            ['cnpj_id']: e[0],
            ['cnpj_razaoSocial']: e[1],
        });
    }

    const [checkVerificaCep, setCheckVerificaCep] = useState(false);

    const handleEditeCheckVerificaCep = (e) => {
        setCheckVerificaCep(!checkVerificaCep);
        if(e.target.checked)
            getDadosCep();
    }

    const getDadosCep = () => {

        ApiSage.get(`cep/findByIdComEstadoECidade?id=${form.endereco_endCepId}`).then(
            (response) => {

                let cep = response.data;
                setCheckVerificaCep(false);
                setForm({
                    ...form,
                    endereco_estadoId: cep.endEstado.id,
                    endereco_estado: cep.endEstado.nome,
                    endereco_cidadeId: cep.endCidade.id,
                    endereco_cidade: cep.endCidade.nome,
                    endereco_bairro: cep.bairro === null ? '' : cep.bairro,
                    endereco_rua: cep.rua === null ? '': cep.rua,
                });
            }
        ).catch( (error) => {
            console.log(error.response);
            setCheckVerificaCep(false);
        });
    }

    const handleSelecionarEstado = (estado) =>{
        setForm({
            ...form,
            endereco_estadoId: estado.id,
            endereco_estado: estado.nome,
        }) 
    }

    const handleSelecionarCidade  = (cidade) =>{
        setForm({
            ...form,
            endereco_cidadeId: cidade.id,
            endereco_cidade: cidade.nome,
        }) 
    }

    return (
        
        <Page 
            pageTitle={intl.formatMessage({ id: 'CadastroUc' , defaultMessage: 'Cadastro de Unidade consumidoras'})}
            appBarContent={
                <Toolbar disableGutters>
                    {processando ? <CircularProgress /> : `` }
                    <div style={{"width":"180px"}}>
                        <SelectAtivo onChange={handleSelecionarAtivo} value={ativo}/>
                    </div>
                    <div style={{"width":"250px"}}>
                        <SelectEmpresas onChange={handleSelecionarEmpresa} value={form.empresa_id} />
                    </div>
                </Toolbar>
            }
        >
            <Scrollbar style={{ height: '100%', width: '100%', display: 'flex', flex: 1 }} >
                
                <div style={{ margin: '15px', height: '85%'}}>
                    <DataGrid rows={rows} columns={columns} pageSize={15}  onRowSelected={handleSelecionarLinha}/>
                </div>

                <Tooltip title="Add" aria-label="add" style={{'margin-left':'15px'}}>
                    <Fab color="primary" className={classes.fab}>
                        <AddIcon onClick={handleAdd}/>
                    </Fab>
                </Tooltip>

                {alertaRetorno.open ? <Alerta atributos = {alertaRetorno}/> : ``}

                <Container maxWidth="lg"> 
                    
                    <Dialog
                            fullWidth={true}
                            maxWidth="lg"
                            open={openModal}
                            onClose={handleCloseModal}
                            aria-labelledby="max-width-dialog-title"
                        >
                            <DialogTitle id="max-width-dialog-title">Cadastro Unidade Consumidora</DialogTitle>
                            <DialogContent>
                            <DialogContentText>
                                {mensagemAcaoModal}
                            </DialogContentText>
                                <form className={classes.form} autoComplete="off" onSubmit={e => handleSubmit(e)}>
                                    <Grid container spacing={3} className={classes.container}>
                                        <Grid item xs={12} sm={3}>
                                            <TextField  required type="text" id="id" name="id" label="Nro UC" style={{"width":"100%"}} onChange={ e => handleChange(e)} value={form.id}/>
                                            {erros.id && <p className='error-input'>{erros.id}</p>}
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField required  id="nome" name="nome" label="Nome Uc" style={{"width":"100%"}} onChange={ e => handleChange(e)} value={form.nome}/>
                                            {erros.nome && <p className='error-input'>{erros.nome}</p>}
                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <SelectEmpresasEnergia required name='empresaEnergia_id' required onChange={handleSelecionarEmpresaEnergia} value={form.empresaEnergia_id}/>
                                            {erros.empresaEnergia_id && <p className='error-input'>{erros.empresaEnergia_id}</p>}
                                        </Grid>

                                        <Grid item xs={12} sm={3}>
                                            <TextField required type="text" id="numeroMedidor" name="numeroMedidor" label="Número Medidor" style={{"width":"100%"}} onChange={e => handleChange(e)} value={form.numeroMedidor}/>
                                        </Grid>
                                        
                                        <Grid item xs={12} sm={3}>
                                            <SelectCnpj required name='cnpj_id' onChange={handleSelecionarCnpj} empresaId={form.empresa_id} value={form.cnpj_id}/>
                                            {erros.cnpj_id && <p className='error-input'>{erros.cnpj_id}</p>}
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField disabled id="razaoSocial" name="cnpj_razaoSocial"  label="Razão Social" style={{"width":"100%"}} value={form.cnpj_razaoSocial}/>
                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <TextField id="centroCusto" name="centroCusto"  label="Centro Custo" type='number' style={{"width":"100%"}}  onChange={e => handleChange(e)}  value={form.centroCusto}/>
                                            {erros.centroCusto && <p className='error-input'>{erros.centroCusto}</p>}
                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <TextField required  id="endereco_endCepId" name="endereco_endCepId" label="CEP" style={{"width":"100%"}} onChange={e => handleChange(e)} value={form.endereco_endCepId}/>
                                            {erros.endereco_endCepId && <p className='error-input'>{erros.endereco_endCepId}</p>}
                                        </Grid>
                                        <Grid item xs={12} sm={1}>
                                            <Checkbox
                                                checked={checkVerificaCep}
                                                onChange={handleEditeCheckVerificaCep}
                                                name="checkedF"
                                                indeterminate
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={1}>
                                            <TextField disabled id="endereco_id"  name="endereco_id" label="Id end" style={{"width":"100%"}} onChange={e => handleChange(e)} value={form.endereco_id}/>
                                            
                                        </Grid>

                                        <Grid item xs={12} sm={3}>
                                            <SelectEstado required id="estado"  name="endereco_estado" label="Estado"  value={form.endereco_estadoId} onChange={handleSelecionarEstado} style={{"width":"100%"}} /> 
                                           {// <TextField required id="estado"  name="endereco_estado" label="Estado" style={{"width":"100%"}} onChange={e => handleChange(e)} value={form.endereco_estado}/>
                                            }
                                            {erros.endereco_estado && <p className='error-input'>{erros.endereco_estado}</p>}
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <SelectCidade required id="cidade"  name="endereco_cidade" label="Cidade" estadoId={form.endereco_estadoId}  value={form.endereco_cidadeId} onChange={handleSelecionarCidade} style={{"width":"100%"}} /> 

                                            {//<TextField required id="cidade"  name="endereco_cidade" label="Cidade" style={{"width":"100%"}} onChange={e => handleChange(e)} value={form.endereco_cidade}/>
                                            }
                                            {erros.endereco_cidade && <p className='error-input'>{erros.endereco_cidade}</p>}
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField required id="bairro" name="endereco_bairro" label="Bairro" style={{"width":"100%"}} onChange={e => handleChange(e)} value={form.endereco_bairro}/>
                                            {erros.endereco_bairro && <p className='error-input'>{erros.endereco_bairro}</p>}
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField required id="rua" name="endereco_rua"  label="Rua" style={{"width":"100%"}} onChange={e => handleChange(e)} value={form.endereco_rua}/>
                                            {erros.endereco_rua && <p className='error-input'>{erros.endereco_rua}</p>}
                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <TextField required type="number" name="endereco_numero" id="numero" label="Nro" style={{"width":"100%"}} onChange={e => handleChange(e)} value={form.endereco_numero}/>
                                            {erros.endereco_numero && <p className='error-input'>{erros.endereco_numero}</p>}
                                        </Grid>
                                        <Grid item xs={12} sm={1}>
                                            <TextField id="bloco" name="endereco_bloco"  label="Bloco" style={{"width":"100%"}} onChange={e => handleChange(e)} value={form.endereco_bloco}/>
                                        </Grid>
                                        <Grid item xs={12} sm={1}>
                                            <TextField type="number"  id="apto" name="endereco_apto"  label="Apto" style={{"width":"100%"}} onChange={e => handleChange(e)} value={form.endereco_apto}/>
                                        </Grid>

                                        <Grid item xs={12} sm={2}>
                                            <TextField type="number"  id="latitude" name="endereco_latitude"  label="Latitude" style={{"width":"100%"}} onChange={e => handleChange(e)} value={form.endereco_latitude}/>
                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <TextField type="number"  id="longitude" name="endereco_longitude"  label="Longitude" style={{"width":"100%"}} onChange={e => handleChange(e)} value={form.endereco_longitude}/>
                                        </Grid>

                                        <Divider flexItem  />

                                        <Grid item xs={12} sm={4}>
                                            <TextField required type="number" id="parceiroNegocio" name="parceiroNegocio" label="Parceiro negócio" style={{"width":"100%"}} onChange={e => handleChange(e)} value={form.parceiroNegocio}/>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField required type="number" id="contaContrato" name="contaContrato" label="Conta contrato" style={{"width":"100%"}} onChange={e => handleChange(e)} value={form.contaContrato}/>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <FormControl className={classes.formControl}>
                                                <InputLabel id="label-debitoEmConta">Débito em conta</InputLabel>
                                                <Select
                                                    labelId="label-debitoEmConta"
                                                    id="select-debitoEmConta-id"
                                                    name='debitoEmConta'
                                                    value={form.debitoEmConta}
                                                    onChange={e => handleChange(e)}>
                                                    <MenuItem key={1} value={1}>SIM</MenuItem>
                                                    <MenuItem key={2} value={0}>NÃO</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <FormControl className={classes.formControl}>
                                                <InputLabel id="label-contaPlurimensal">Plurimensal</InputLabel>
                                                <Select
                                                    labelId="label-contaPlurimensal"
                                                    id="select-contaPlurimensal-id"
                                                    name='contaPlurimensal'
                                                    value={form.contaPlurimensal}
                                                    onChange={e => handleChange(e)}
                                                >
                                                    <MenuItem key={1} value={1}>SIM</MenuItem>
                                                    <MenuItem key={2} value={0}>NÃO</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <FormControl className={classes.formControl}>
                                                <InputLabel id="label-isAtendimentoPrioritario">Prioritário</InputLabel>
                                                <Select
                                                    labelId="label-isAtendimentoPrioritario"
                                                    id="select-isAtendimentoPrioritario-id"
                                                    name='isAtendimentoPrioritario'
                                                    value={form.isAtendimentoPrioritario}
                                                    onChange={e => handleChange(e)}
                                                >
                                                    <MenuItem key={1} value={1}>SIM</MenuItem>
                                                    <MenuItem key={2} value={0}>NÃO</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={1}>
                                            <FormControl className={classes.formControl}>
                                                <InputLabel id="label-isGeracaoDistribuida">GD</InputLabel>
                                                <Select
                                                    labelId="label-isGeracaoDistribuida"
                                                    id="select-isGeracaoDistribuida-id"
                                                    name='isGeracaoDistribuida'
                                                    value={form.isGeracaoDistribuida}
                                                    onChange={e => handleChange(e)}
                                                >
                                                    <MenuItem key={1} value={1}>SIM</MenuItem>
                                                    <MenuItem key={2} value={0}>NÃO</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <TextField required type="date" id="dtInicioContrato" name="dtInicioContrato" label="Início contrato" style={{"width":"100%"}} onChange={e => handleChange(e)} value={form.dtInicioContrato}/>
                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <TextField required type="date" id="dtFimContrato" name="dtFimContrato" label="Fim contrato" style={{"width":"100%"}} onChange={e => handleChange(e)} value={form.dtFimContrato}/>
                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <TextField required type="text" id="codigoTarifa" name="codigoTarifa" label="Codigo tarifa" style={{"width":"100%"}} onChange={e => handleChange(e)} value={form.codigoTarifa}/>
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <TextField required type="text" id="classeFaturamento" name="classeFaturamento" label="Classe Faturamento" style={{"width":"100%"}} onChange={e => handleChange(e)} value={form.classeFaturamento}/>
                                        </Grid>


                                        <Divider flexItem  />

                                        <Grid item xs={12} sm={2}>
                                            <SelectFaturaTipo required  name='faturaTipo_id' required onChange={handleSelecionarFaturaTipo} value={form.faturaTipo_id}/>
                                            {erros.faturaTipo_id && <p className='error-input'>{erros.faturaTipo_id}</p>}
                                        </Grid>
                                        {form.faturaTipo_id < 5 ? // Se BT
                                            <>
                                                <Grid item xs={12} sm={2}>
                                                    <FormControl className={classes.formControl}>
                                                        <InputLabel id="label-fases">Qtde fases</InputLabel>
                                                        <Select
                                                            required
                                                            labelId="label-fases"
                                                            id="select-fases-id"
                                                            name='qtdeFases'
                                                            value={form.qtdeFases}
                                                            onChange={e => handleChange(e)}>
                                                            <MenuItem key={1} value={1}>MONOFÁSICO</MenuItem>
                                                            <MenuItem key={2} value={2}>BIFÁSICO</MenuItem>
                                                            <MenuItem key={3} value={3}>TRIFÁSICO</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} sm={2}>
                                                    <FormControl className={classes.formControl}>
                                                        <InputLabel id="label-tensao_id">Tensão</InputLabel>
                                                        <Select
                                                            required
                                                            labelId="label-tensao_id"
                                                            id="select-tensao_id-id"
                                                            name='tensao_id'
                                                            value={form.tensao_id}
                                                            onChange={e => handleChange(e)}>
                                                            <MenuItem key={1} value={1}>127</MenuItem>
                                                            <MenuItem key={2} value={2}>220</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={12} sm={2}>
                                                    <FormControl className={classes.formControl}>
                                                        <InputLabel id="label-faturaSubTipo_id">Sub tipo Tarifa</InputLabel>
                                                        <Select
                                                            required
                                                            labelId="label-faturaSubTipo_id"
                                                            id="select-faturaSubTipo_id-id"
                                                            name='faturaSubTipo_id'
                                                            value={form.faturaSubTipo_id}
                                                            onChange={e => handleChange(e)}>
                                                            <MenuItem key={1} value={1}>Convencional</MenuItem>
                                                            <MenuItem key={2} value={2}>Tarifa Branca</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            </>
                                            : // Se MT
                                            <>
                                                <Grid item xs={12} sm={2}>
                                                    <FormControl className={classes.formControl}>
                                                        <InputLabel id="label-subCategoria_codigo">Categoria</InputLabel>
                                                        <Select
                                                            labelId="label-subCategoria_codigo"
                                                            id="select-subCategoria_codigo-id"
                                                            name='subCategoria_codigo'
                                                            value={form.subCategoria_codigo}
                                                            onChange={e => handleChange(e)}>
                                                            <MenuItem key={1} value='ACL'>ACL</MenuItem>
                                                            <MenuItem key={2} value='ACR'>ACR</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} sm={2}>
                                                    <FormControl className={classes.formControl}>
                                                        <InputLabel id="label-faturaSubTipo_id">Sub tipo Tarifa</InputLabel>
                                                        <Select
                                                            labelId="label-faturaSubTipo_id"
                                                            id="select-faturaSubTipo_id-id"
                                                            name='faturaSubTipo_id'
                                                            value={form.faturaSubTipo_id}
                                                            onChange={e => handleChange(e)}>
                                                            <MenuItem key={1} value={3}>Verde</MenuItem>
                                                            <MenuItem key={2} value={4}>Azul</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} sm={2}>
                                                    <FormControl className={classes.formControl}>
                                                        <InputLabel id="label-tensao_id">Tensão</InputLabel>
                                                        <Select
                                                            required
                                                            labelId="label-tensao_id"
                                                            id="select-tensao_id-id"
                                                            name='tensao_id'
                                                            value={form.tensao_id}
                                                            onChange={e => handleChange(e)}>
                                                            <MenuItem key={1} value={3}>13.800</MenuItem>
                                                            <MenuItem key={2} value={4}>23.000</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            </>
                                        }
                                        {    form.faturaSubTipo_id == 3 && form.faturaTipo_id >= 5 ?
                                            <Grid item xs={12} sm={3}>
                                                <TextField required type="number" id="demandaContratada" name="demandaContratada" label="Demanda Contratada" style={{"width":"100%"}} onChange={e => handleChange(e)} value={form.demandaContratada}/>
                                            </Grid>
                                            : ''
                                        }
                                        { form.faturaSubTipo_id == 4 &&  form.faturaTipo_id >= 5?
                                            <>
                                                <Grid item xs={12} sm={3}>
                                                    <TextField required type="number" id="demandaContratadaPonta" name="demandaContratadaPonta" label="Demanda Contratada P" style={{"width":"100%"}} onChange={e => handleChange(e)} value={form.demandaContratadaPonta}/>
                                                </Grid>
                                                <Grid item xs={12} sm={3}>
                                                    <TextField required type="number" id="demandaContratadaForaPonta" name="demandaContratadaForaPonta" label="Demanda Contratada FP" style={{"width":"100%"}} onChange={e => handleChange(e)} value={form.demandaContratadaForaPonta}/>
                                                </Grid>
                                            </>
                                            : ''
                                        }
                                        <Grid item xs={12} sm={2}>
                                            <FormControl className={classes.formControl}>
                                                <InputLabel id="label-ativa">Ativa</InputLabel>
                                                <Select
                                                    labelId="label-ativa"
                                                    id="select-ativa-id"
                                                    name='ativa'
                                                    value={form.ativa}
                                                    onChange={e => handleChange(e)}
                                                >
                                                    <MenuItem key={1} value={1}>SIM</MenuItem>
                                                    <MenuItem key={2} value={0}>NÃO</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <DialogActions>
                                        <Button type="submit" color="secondary">
                                            Salvar
                                        </Button>
                                    </DialogActions>
                                </form>
                            </DialogContent>
                            
                        </Dialog>
                </Container>            
            </Scrollbar>            
        </Page>

    )

}

export default CadastroUc;