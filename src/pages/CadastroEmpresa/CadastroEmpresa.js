
import React, {useState, useEffect} from 'react';
import Page from 'material-ui-shell/lib/containers/Page'
import { makeStyles } from '@material-ui/core/styles';
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar/Scrollbar'
import TextField from '@material-ui/core/TextField';


import { CircularProgress , Container, Grid, Button, Toolbar, Checkbox } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';

import { useIntl } from 'react-intl';
import ApiSage from '../../services/ApiSage';
import Alerta from '../../componentes/Alerta/Alerta.js';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import { unificarDados, desUnificarDados } from 'services/Obj';
import ListaCnpj from 'componentes/SelectCnpj/ListaCnpj';
import './style.css';

const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
        marginTop: theme.spacing(2),
        paddingTop: '1px',
        paddingBottom: '1px',
      },
    },
    selectEmpty: {
     // marginTop: theme.spacing(2),
      marginTop: theme.spacing(2),
      width: '100%',
    },
    container:{
      padding: theme.spacing(3)
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    button: {
      margin: theme.spacing(1),
      width: '100%',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        width: 'fit-content',
        minHeight: '350px',
      },
      formControlLabel: {
        marginTop: theme.spacing(1),
      },
      dividerFullWidth: {
        margin: `5px 0 0 ${theme.spacing(2)}px`,
      },
      dividerInset: {
        margin: `5px 0 0 ${theme.spacing(9)}px`,
      },
  }));

const CadastroEmpresa = () => {

    const intl = useIntl()
    const classes = useStyles();

    const preForm = {
        id : '',
        nome: '',
        endereco_id: '',
        endereco_endCepId: '',
        endereco_estadoId: '',
        endereco_estado: '',
        endereco_cidadeId: '',
        endereco_cidade: '',
        endereco_bairro: '',
        endereco_rua: '',
        endereco_numero: '',
        endereco_bloco: '',
        endereco_apto: '',
        endereco_latitude: '',
        endereco_longitude: '',
        ativa:1,
    }

    const [checkVerificaCep, setCheckVerificaCep] = useState(false);

    const handleEditeCheckVerificaCep = (e) => {
        setCheckVerificaCep(!checkVerificaCep);
        console.log(e, e.target.checked);
        if(e.target.checked)
            getDadosCep();

    }

    const [form, setForm] = useState(preForm);
    const [erros, setErros] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const [processando, setProcessando] = useState(false);

    const [modal, setModal] = useState({
        open: false,
        mensagem: ''
    })

    const [alertaRetorno , setAlertaRetorno] = useState({open:false, msg: '', tipo: 'error'})

    const [rows, setRows] = useState([]);

    const [columns, setColumns] = useState([
        { field: 'id', headerName: 'ID', width: 110 },
        { field: 'nome', headerName: 'NOME', width: 400 },
        { field: 'endereco_id', headerName: 'ENDERECO_ID', width: 250 , hide: true},
        { field: 'endereco_estado', headerName: 'ESTADO', width: 250 },
        { field: 'endereco_cidade', headerName: 'CIDADE', width: 150},   
        { field: 'endereco_bairro', headerName: 'BAIRRO', width: 70 , hide: true},
        { field: 'endereco_rua', headerName: 'RUA', width: 70 , hide: true},
        { field: 'endereco_numero', headerName: 'NUM', width: 70 , hide: true},
        { field: 'endereco_bloco', headerName: 'BC', width: 70 , hide: true},
        { field: 'endereco_apto', headerName: 'AP', width: 70 , hide: true},
        { field: 'endereco_latitude', headerName: 'LAT', width: 70 , hide: true},
        { field: 'endereco_longitude', headerName: 'LONG', width: 70 , hide: true},
    ]);

    const getEmpresa = (empresa) => {
        setProcessando(true);
        ApiSage.get(`empresa/findById?id=${empresa.id}`).then(
            (response) => {
                retornoGetEmpresa(response.data);
                setProcessando(false);
            }
        ).catch( (error) => {
            setAlertaRetorno({
                open: true,
                tipo: 'error',
                msg: `Falha ao buscar empresa ${empresa.nome}: ${error.response.data.message}`,
            });
            setProcessando(false);
        });
    }

    const getEstados = () => {
        ApiSage.get(`estado/findAll`).then(
            (response) => {
                console.log(response);
            }
        ).catch( (error) => {
            console.log(error.response);
        });
    }

    const getEstadoComMunicipios = () => {
        ApiSage.get(`estado/findByIdComMunicipios?id=${form.endereco_estadoId}`).then(
            (response) => {
                console.log(response);
            }
        ).catch( (error) => {
            console.log(error.response);
        });
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
                    endereco_bairro: cep.bairro,
                    endereco_rua: cep.rua,
                });
            }
        ).catch( (error) => {
            console.log(error.response);
            setCheckVerificaCep(false);
        });
    }

  /*  useEffect(()=>{
        getEstados();
        getEstadoComMunicipios();
        getDadosCep();
    }, []);
*/

    const retornoGetEmpresa = (empresa) => {
        let obj = unificarDados(empresa, '');
        Object.assign(form, obj);
        setForm(form);
    }

    const getAllEmpresas = () => {
        setProcessando(true);
        ApiSage.get('empresa/findAll').then(
            (response) => {
                retornoGetAllEmpresas(response.data);
                setProcessando(false);
            }
        ).catch( (error) => {
            setAlertaRetorno({
                open: true,
                msg: `Falha ao buscar empresas: ${error.reponse.data.message}`,
                tipo: 'error',
            });
            setProcessando(false);
        });
    }

    useEffect (() => {
        getAllEmpresas()
    }, [])

    const retornoGetAllEmpresas = (empresas) => {
        let linhas = [];
        for( let i in empresas)
            linhas.push(unificarDados(empresas[i],''));  
        setRows(linhas);
    }
    
    const postEmpresa = () => {
        let empresa = form.nome;
        setProcessando(true);
        const dados = desUnificarDados(form, "_");
        ApiSage.post('empresa', dados)
                .then( (response) => {
                    retornoPostEmpresa(response.data);
                    setProcessando(false);
                    handleCloseModal();
                })
                .catch((error) => {
                    setAlertaRetorno({
                        open: true,
                        msg: `Falha ao salvar empresa ${empresa}: ${error.reponse.data.message}`,
                        tipo: 'error',
                    });
                    setProcessando(false);
                    handleCloseModal();
                });
    }

    const retornoPostEmpresa = (empresa) => {
        setAlertaRetorno({
            ...alertaRetorno,
            ['open']: true,
            ['msg']: `Empresa ${empresa.nome} salva com sucesso!`,
            ['tipo']: 'success',
        });
        getAllEmpresas();
    }

    const handleSelecionarLinha = (e) => {
        
        limparCampos();
        getEmpresa(e.data);

        setModal({
            ...modal,
            ['open']: true,
            ['mensagem'] : 'Editar empresa existente',
        });
    }   

    const limparCampos = () => {
        setForm(preForm);
    }

    const handleCloseModal = () => {
        limparCampos();
        setModal({
            ...modal,
            ['open']: false,
        });
    }

    const handleAdd = () => {
        limparCampos();
        setModal({
            ...modal,
            ['open']: true,
            ['mensagem'] : 'Adicionar uma nova empresa',
        });
    }

    const handleChange = (event) =>{
        console.log('handleChange', event);
        setForm({
            ...form,
            [event.target.name]: event.target.value
        })
    }

    function validade (){
        let erros = {};
        if(!form.nome || form.nome.length < 4)
            erros.nome = '*O nome deve conter no mínimo 4 caracteres!';
        if(!form.endereco_estado || form.endereco_estado.length < 4)
            erros.endereco_estado = "*Estado inválido!";
        if(!form.endereco_cidade || form.endereco_cidade.length < 3)
            erros.endereco_cidade = "*Cidade inválido!";
        if(!form.endereco_bairro || form.endereco_bairro.length < 3)
            erros.endereco_bairro = "*Bairro inválido!";
        if(!form.endereco_rua)
            erros.endereco_rua = "*Rua inválida!";
        if(!form.endereco_numero || form.endereco_numero <= 0)
            erros.endereco_numero = "*Numero inválido!";
        if(form.endereco_bloco.length > 1)
            erros.endereco_bloco = "*Bloco deve possuir 1 caracter!"
        
            console.log('erros.endereco_cidade',form.endereco_cidade , erros.endereco_cidade);
        setSubmitting(true);
        return erros;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setErros(validade(form));
    }

    useEffect( () => {
        if(Object.keys(erros).length === 0 && submitting){
            postEmpresa();
        }
        setSubmitting(false);
    })



    return (
        
        <Page   pageTitle={intl.formatMessage({ id: 'CadastroEmpresa' , defaultMessage: 'Cadastro de empresa'})}
                appBarContent={
                    <Toolbar disableGutters>
                        {processando ? <CircularProgress color="#f8f8f8"/> : `` }
                    </Toolbar>
                }
        >
            <Scrollbar style={{ height: '100%', width: '100%', display: 'flex', flex: 1 }} >

                <div style={{ margin: '15px', height: '85%'}}>
                    <DataGrid  rows={rows} columns={columns} pageSize={12} onRowSelected={handleSelecionarLinha}/>
                </div>

                <Tooltip title="Add" aria-label="add" style={{'margin-left':'15px'}}>
                    <Fab color="primary" className={classes.fab}>
                        <AddIcon onClick={handleAdd}/>
                    </Fab>
                </Tooltip>

                {alertaRetorno.open ? <Alerta atributos = {alertaRetorno} /> : ``}

                <Container maxWidth="lg"> 
                    
                    <Dialog
                        fullWidth={true}
                        maxWidth="lg"
                        open={modal.open}
                        onClose={handleCloseModal}
                        aria-labelledby="max-width-dialog-title"
                    >
                        <DialogTitle id="max-width-dialog-title">Cadastro Empresa</DialogTitle>
                        <DialogContent>
                        <DialogContentText>
                            {modal.mensagem}
                        </DialogContentText>
                            <form className={classes.form} autoComplete="off" onSubmit={e => handleSubmit(e)}>
                                <Grid container spacing={3} className={classes.container}>
                                    <Grid item xs={12} sm={2}>
                                        <TextField disabled id="id" name="id" label="Nro Id" style={{"width":"100%"}} onChange={e => handleChange(e)} value={form.id}/>
                                        
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField required  id="nome" name="nome" label="Nome" style={{"width":"100%"}} onChange={e => handleChange(e)} value={form.nome}/>
                                        {erros.nome && <p className='error-input'>{erros.nome}</p>}
                                    </Grid>

                                    <Grid item xs={12} sm={3}>
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
                                        <TextField disabled id="endereco_id" name="endereco_id"  label="Id end" style={{"width":"100%"}} onChange={e => handleChange(e)} value={form.endereco_id}/>
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField required id="estado" name="endereco_estado"  label="Estado" style={{"width":"100%"}} onChange={e => handleChange(e)} value={form.endereco_estado}/>
                                        {erros.endereco_estado && <p className='error-input'>{erros.endereco_estado}</p>}
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField required id="cidade"  name="endereco_cidade" label="Cidade" style={{"width":"100%"}} onChange={e => handleChange(e)} value={form.endereco_cidade}/>
                                        {erros.endereco_cidade && <p className='error-input'>{erros.endereco_cidade}</p>}
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField required id="bairro"  name="endereco_bairro" label="Bairro" style={{"width":"100%"}} onChange={e => handleChange(e)} value={form.endereco_bairro}/>
                                        {erros.endereco_bairro && <p className='error-input'>{erros.endereco_bairro}</p>}
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField required id="rua" name="endereco_rua"  label="Rua" style={{"width":"100%"}} onChange={e => handleChange(e)} value={form.endereco_rua}/>
                                        {erros.endereco_rua && <p className='error-input'>{erros.endereco_rua}</p>}
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <TextField required id="numero" name="endereco_numero"  type="number" label="Nro" style={{"width":"100%"}} onChange={e => handleChange(e)} value={form.endereco_numero}/>
                                        {erros.endereco_numero && <p className='error-input'>{erros.endereco_numero}</p>}
                                    </Grid>
                                    <Grid item xs={12} sm={1}>
                                        <TextField required id="bloco" name="endereco_bloco"  label="Bloco" style={{"width":"100%"}} onChange={e => handleChange(e)} value={form.endereco_bloco}/>
                                        {erros.endereco_bloco && <p className='error-input'>{erros.endereco_bloco}</p>}
                                    </Grid>
                                    <Grid item xs={12} sm={1}>
                                        <TextField required id="apto" name="endereco_apto"  type="number" label="Apto" style={{"width":"100%"}} onChange={e => handleChange(e)} value={form.endereco_apto}/>
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <TextField type="number"  id="latitude" name="endereco_latitude"  label="Latitude" style={{"width":"100%"}} onChange={e => handleChange(e)} value={form.endereco_latitude}/>
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <TextField type="number"  id="longitude" name="endereco_longitude"  label="Longitude" style={{"width":"100%"}} onChange={e => handleChange(e)} value={form.endereco_longitude}/>
                                    </Grid>                         
                                    {form.id !== '' ? <ListaCnpj empresaId={form.id}/> : ``}
                                    <DialogActions>
                                        <Button type='submit' color="primary">
                                            Salvar
                                        </Button>
                                    </DialogActions>
                                </Grid>
                            </form>
                        </DialogContent>
                        
                    </Dialog>
                </Container>            
            </Scrollbar>            
        </Page>
    )

}

export default CadastroEmpresa;