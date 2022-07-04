import {useEffect, useState} from 'react';
import ApiSage from '../../services/ApiSage';

import Page from 'material-ui-shell/lib/containers/Page'
import { makeStyles } from '@material-ui/core/styles';
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar/Scrollbar'
import TextField from '@material-ui/core/TextField';

import Alerta from '../../componentes/Alerta/Alerta.js';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { CircularProgress , Container, Grid, Paper, Toolbar, Button} from '@material-ui/core';

import { useIntl } from 'react-intl'


import SelectEmpresasEnergia from 'componentes/SelectEmpresasEnergia/SelectEmpresasEnergia';
import SelectFaturaTipo from 'componentes/SelectFaturaTipo/SelectFaturaTipo.js';

import {desUnificarDados} from '../../services/Obj';

import SaveAltIcon from '@material-ui/icons/SaveAlt';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';


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
    msgWrapper: {
        whiteSpace: 'pre-wrap',
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
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
      },
  }));


const CadastroFaturaMascaraPdf = () => {

    const intl = useIntl()
    const classes = useStyles();

    const preForm = {
        id: '',
        empresaEnergia_id: '',
        faturaTipo_id: '',
        campos: [],
        faturaTeste: '',
    }
    const [erros, setErros] = useState({});
    const [processando, setProcessando] = useState(false);
    const [alertaRetorno , setAlertaRetorno] = useState({open:false, msg: '', tipo: 'error'})
    const [submitting, setSubmitting] = useState(false);
    const [open, setOpen] = useState(false);

    const [metodos, setMetodos] = useState([]);

    const limparCampos = () => {

    }

    const Alert = (props) => {return <MuiAlert elevation={6} variant="filled" {...props} />;}

    const handleCloseMsgRetorno = (event, reason) => {
        if(reason === 'clickaway')
            return;
        setAlertaRetorno({
            ...alertaRetorno,
            open: false,
        })
    }


    const handleCloseModal = () => {
        limparCampos();
        setOpenModal(false);
    }

    const handleAdd = () => {
        setOpenModal(true);
        setMensagemAcaoModal('Adicionar uma nova Unidade Consumidora');
        //Object.assign(preForm, {['empresa_id'] : empresaSelecionada});
        setForm(preForm);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
       // setErros(validade(form));
        setSubmitting(true);
    }


    const [openModal, setOpenModal] = useState(false);
    const [mensagemAcaoModal, setMensagemAcaoModal] = useState('');

   // const [campos, setCampos] = useState([]);
  //  const [camposOriginais, setCamposOriginais] = useState([]);
  //  const [fieldsMap, setFieldsMap] = useState('');

    const [form, setForm] = useState(preForm);

    const [listaCampos , setListaCampos] = useState([]);
    const [camposRequisicao, setCamposRequisicao] = useState([]);
    //const [listaCamposUtilizados, setListaCamposUtilizados] = useState('');
    const [listaCamposDisponiveis, setListaCamposDisponiveis] = useState([]);
    const [liberarNovoRegistro, setLiberarNovoRegistro] = useState(1);

    const [dadosFatura, setDadosFatura] = useState([]);

    const novoRegistro = (nome, tipo) => ( {
            [nome+'_id']: -1,
            [nome+'_nome']: nome,
            [nome+'_tipo']: tipo,
            [nome+'_pagina']: 0,
            [nome+'_metodo']: '',
            [nome+'_parametros']: '',
            [nome+'_x']: 0,
            [nome+'_y']: 0,
            [nome+'_width']: 0,
            [nome+'_height']: 0,
            ['campo']:nome,
        });

    const newParametro = (par)=>({
        id: par.id,
        nome: par.nome,
        tipoDado: par.tipoDado,
        valor: par.valor,
    })

    const processaCampos = (campos) => {
        setCamposRequisicao(campos);
        let fields = [];
        fields.push('EMPRESA');
        campos.map( c => {
            fields.push(c.nome);
        });
        setListaCampos(fields)
    }

    const concatenarParametros = (param) => {
        let separador = '', retorno = '';
        for(let p in param){
            retorno += separador + param[p].valor;
            separador='; ';
        }
        return retorno;
    }
   
    const processaCamposArmanezados = (id, camposReturn) =>{
        let fields = [];
        let camposIniciais = listaCampos.map(c => c);
        console.log('camposReturn', camposReturn);
        camposReturn.map( (c, i) => {
            fields.push({
                [c.nome+'_id']: c.id,
                [c.nome+'_nome']: c.nome,
                [c.nome+'_tipo']: c.tipo,
                [c.nome+'_pagina']: c.pagina,
                [c.nome+'_x']: c.x,
                [c.nome+'_y']: c.y,
                [c.nome+'_width']: c.width,
                [c.nome+'_height']: c.height,
                [c.nome+'_metodo']: c.metodo,
                [c.nome+'_parametros']: concatenarParametros(c.parametros),
                ['campo']:c.nome,
            });
            camposIniciais = camposIniciais.filter(i => i !== c.nome);
        });

        camposIniciais.unshift('---desmarcar---');
        setListaCamposDisponiveis(camposIniciais);

        setForm({
            ...form,
            ['id']: id,
            ['campos']: fields,
        });
        setLiberarNovoRegistro(1);
    }

    const visualizaCamposPdf = () => {
        try {
            const data = new FormData();
            data.append("fatura", form.faturaTeste);
           // .post(`fatura/${form.empresaEnergia_id}/${form.faturaTipo_id}/upLoadTeste`, data)
            ApiSage.post(`faturaMascara/${form.id}/visualizarCampos`, data, {responseType:'arraybuffer'})
              .then((response) => {
                const file = new Blob([response.data], { type: "application/pdf" });
                const dados  = window.URL.createObjectURL(file);
               
                window.open(dados, "fatura_campos");
                //pdfWindow.location.href = dados;         
                //console.log('visualizaCamposPdf', response.data);
                //const content = response.headers['content-type'];
                //download(response.data, 'fatura', content);


              })
              .catch((error) => {
                //console.log(error);
                setAlertaRetorno({
                    open: true,
                    msg: `Falha ao visualizar campos: ${error.response.data.message}`,
                    tipo: `error`
                })
              });
          } catch (error) {
            return { error };
          }
    }

    const getCampos = () => {
        
        ApiSage.get(`faturaMascara/listaCamposFatura`)
                .then((response) => {
                    console.log(response.data);
                    processaCampos(response.data);
                }).catch((error) => {
                    setAlertaRetorno({
                        open: true,
                        msg: `Falha ao listar campos: ${error.response.data.message}`,
                        tipo: `error`
                    })
                });
    }

    const getMetodos = () => {
        
        ApiSage.get(`faturaMascara/listaMetodos`)
                .then((response) => {
                    console.log(response.data);
                    retornoMetodos(response.data);
                }).catch((error) => {
                    let erro = error.response;
                    console.log('erro get faturaMascara/listaMetodos: ', erro);
                });
    }

    const retornoMetodos = (retorno) =>{
        
        retorno.forEach(c => {
            c['assinatura'] = c.nome + "("+param(c.parametros) + ')'
        });
        console.log(retorno);
        setMetodos(retorno);
    }

    const param = (vetor) => {
        let p = '', separador = '';
        vetor.forEach( (el, i) => {
            if( i > 0){
                p += separador + el;
                separador = '; ';
            }
        })
        return p;
    }


    const getFormMascaraFatura = () => {
       console.log(form.empresaEnergia_id, form.faturaTipo_id)
        if(form.empresaEnergia_id <= 0 || form.faturaTipo_id <= 0)
            return;
        ApiSage.get(`faturaMascara?distribuidoraId=${form.empresaEnergia_id}&tipoFaturaId=${form.faturaTipo_id}`)
                .then((response) => {
                    let dado = response.data;
                    console.log('getFormMascaraFatura', dado);
                    if(dado.id == null){
                        dado.id = -1;
                        dado.campos = [];
                    }
                    processaCamposArmanezados(dado.id, dado.campos)
                    setDadosFatura([]);
                }).catch((error) => {
                    let erro = error.response;
                    console.log('erro get getListaUcs: ', erro);
                    setAlertaRetorno({
                        open: true,
                        msg: `Falha buscar mascara: ${error.response.data.message}`,
                        tipo: `error`
                    })
                });

    }

    const postMascaraFatura = (registro) => {
        setProcessando(true);
        console.log('postMascaraFatura', registro);
        ApiSage.post(`faturaMascara`, registro)
            .then((response) => {
                console.log('postMascaraFatura', response);
                getFormMascaraFatura();
                setProcessando(false);
                setAlertaRetorno({
                    open: true,
                    msg: `Campo salvo com sucesso`,
                    tipo: `success`
                })
            }).catch((error) => {
                //console.log('postMascaraFatura error', error.response);
                setProcessando(false);
                setAlertaRetorno({
                    open: true,
                    msg: `Falha ao salvar: ${error.response.data.message}`,
                    tipo: `error`
                })
            });
    }

    const deleteConfigCampo = (id) => {
        setProcessando(true);
        ApiSage.delete(`faturaMascara/deleteCampo?CampoId=${id}`)
                .then((response) => {
                    console.log('deleteConfigCampo', response);
                    getFormMascaraFatura();
                    setProcessando(false);
                    setAlertaRetorno({
                        open: true,
                        msg: `Campo deletado com sucesso`,
                        tipo: `success`
                    })
                }).catch((error) => {
                    //console.log('deleteConfigCampo error', error.response);
                    setProcessando(false);
                    setAlertaRetorno({
                        open: true,
                        msg: `Falha ao remover campos: ${error.response.data.message}`,
                        tipo: `error`
                    })
                });
    }

    const handleChange = (e) => {
        console.log(e.target);
        let campos = form.campos;
        form.campos.map( (c, i) => {
            if(typeof c[e.target.name] !== 'undefined')
                campos[i][e.target.name] = e.target.value;
        })
        setForm({...form, 
            ['campos']: campos,    
        });
    }

    const handleChangeFaturaTipo_id = (value) =>{
        setForm({...form, 
            ['faturaTipo_id']: value,    
        });
    }

    const handleChangeEmpresaEnergia_id = (value) =>{
        setForm({...form, 
            ['empresaEnergia_id']: value,    
        });
    }

    useEffect(()=>{
        console.log(form);
        getFormMascaraFatura();
    },[form.empresaEnergia_id, form.faturaTipo_id])

    useEffect(()=>{
        getCampos();
    },[])

    useEffect(()=>{
        getMetodos();
    },[])


    const save = (campo) => {
        console.log(campo);
        let registro =  form.campos.filter(function (c) { return c.campo === campo })[0];
        let obj = desUnificarDados(registro, '_');
        obj[obj.campo]['empresaEnergia_id'] = form.empresaEnergia_id;
        obj[obj.campo]['faturaTipo_id'] = form.faturaTipo_id;
        postMascaraFatura(obj[obj.campo]);
        console.log('save', campo, registro, obj);
    }

    const remove = (campo) => {
        let registro = form.campos.filter(function (c) { return c.campo === campo })[0];
        let id = registro[campo+"_id"];
        console.log('remove registro 1', registro);
        if(id > 0){
            deleteConfigCampo(id);
        }else{
            registro = zerarCampo(registro);
            upDateCampo(registro);
        }
        console.log('remove registro 2', registro);
    }

    const zerarCampo = (registro) => {
        let campo = registro.campo;
        registro[campo+'_id'] = -1;
        registro[campo+'_tipo'] = 0;
        registro[campo+'_pagina'] = 0;
        registro[campo+'_x'] = 0;
        registro[campo+'_y'] = 0;
        registro[campo+'_width'] = 0;
        registro[campo+'_height'] = 0;
        registro[campo+'_metodo'] = '';
        registro[campo+'_parametros'] = '';
        return registro;
    }

    const upDateCampo = (registro) => {
        let campos = form.campos;
        form.campos.map( ({campo},i ) => {
            if(campo === registro.campo)
                campos[i] = registro;
        })
        setForm({
            ...form,
            ['campos']: campos,
        })
    }

    const localizaTipoCampo = (nomeCampo) => {
        for(let i in camposRequisicao){
            if(camposRequisicao[i].nome === nomeCampo)
                return camposRequisicao[i].tipo;
        }
        return "";
    }

    const handleOnChangeNovoCampo = (e) => {
        console.log('handleOnChangeNovoCampo', e);
        if(liberarNovoRegistro===0 || e.target.value === '---desmarcar---')
            return;
        let registro = novoRegistro(e.target.value, localizaTipoCampo(e.target.value));
        let vetor = form.campos;
        vetor.push(registro);
        setForm({...form, 
            ['campos']: vetor,    
        });
        setLiberarNovoRegistro(0);
    }

    const handleChangeFaturaPdf = (e) => {
        setForm({
            ...form,
            ['faturaTeste']:  e.target.files[0],
        })

    }

    const handleChangeMetodoSelecionado = (e,campo) => {
        let par = '', separador = '';
        for(let i in metodos){
            if(e.target.value == metodos[i].nome){
                for(let u  = 1; u < metodos[i].parametros.length; ++u){
                    par += separador + metodos[i].parametros[u];
                    separador = '; ';
                }
            }
        }
        let campos = form.campos;
        console.log('campos', campos);
        let camposAtualizados = [];
        campos.map( c => {
            
            if(c.campo === campo){
                c[campo+'_metodo'] = e.target.value;
                c[campo+'_parametros'] = par;
            }
            console.log(c);
            camposAtualizados.push(c);
        });
        setForm({...form, 
            ['campos'] : camposAtualizados,   
        });
    }

    const handleVisualizarDados = (e) => {
        const data = new FormData();
        data.append("fatura", form.faturaTeste);
        console.log('data', data);
        ApiSage.post(`fatura/${form.empresaEnergia_id}/${form.faturaTipo_id}/upLoadTeste`, data)
                .then((resp) => {
                    console.log('fatura/upLoadTeste', resp)
                    let lista = [];
                    let count = 1;
                    for(let i in resp.data){
                        lista.push({id: count++,nome: i, valor:resp.data[i]});
                        console.log(i, resp.data[i]);
                    }
                    setDadosFatura(lista);
                })
                .catch((error) =>{ 
                    //console.log('Error:  fatura/upLoadTeste', error.response );
                    setAlertaRetorno({
                        open: true,
                        msg: `Falha ao visualizar dados: ${error.response.data.message}`,
                        tipo: `error`
                    })
                });
    }

    const gerarLinha = (texto) =>{
        console.log(texto);
        let linhas = [];
        if(!texto.includes('\n'))
            return texto;
        
        linhas = texto.split('\n');
        console.log(linhas);
        return linhas.map(l => <br>{l}</br>);
    }

    const handleTestar = () => {
        setOpen(!open);
    }

    return (
        <Page 
                pageTitle={intl.formatMessage({ id: 'CadastroFaturaPdf' , defaultMessage: 'Cadastro de Faturas automaticamente'})}
                appBarContent={
                    <Toolbar disableGutters>
                        {processando ? <CircularProgress /> : `` }
                    </Toolbar>
                }
            >
                <Scrollbar style={{ height: '100%', width: '100%', display: 'flex', flex: 1 }} >
                    
                <Snackbar open={alertaRetorno.open} autoHideDuration={8000} onClose={handleCloseMsgRetorno}>
                    <Alert onClose={handleCloseMsgRetorno} severity={alertaRetorno.tipo}>
                        {alertaRetorno.msg}
                    </Alert>
                </Snackbar>
                    

                    <Container> 
                    <form className={classes.form} autoComplete="off" onSubmit={e => handleSubmit(e)}>
                                        <Grid container spacing={3} className={classes.container}>
          
                                            <Grid item xs={12} sm={4}>
                                                <SelectEmpresasEnergia required name='empresaEnergia_id' required onChange={handleChangeEmpresaEnergia_id} value={form.empresaEnergia_id}/>
                                                {erros.empresaEnergia_id && <p className='error-input'>{erros.empresaEnergia_id}</p>}
                                            </Grid> 
                                            <Grid item xs={12} sm={4}>
                                                <SelectFaturaTipo required  name='faturaTipo_id' required onChange={handleChangeFaturaTipo_id} value={form.faturaTipo_id}/>
                                                {erros.faturaTipo_id && <p className='error-input'>{erros.faturaTipo_id}</p>}
                                            </Grid> 
                                            <Grid item xs={12} sm={4}>
                                                <FormControl className={classes.formControl}>
                                                    <InputLabel id="label-add">Add</InputLabel>
                                                    <Select labelId="label-add" style={{'width':'100%', 'margin-left':'20px'}} onChange={e => handleOnChangeNovoCampo(e)}>
                                                        {listaCamposDisponiveis.map( (d, i) => <MenuItem key={i} value={d}>{d}</MenuItem>)}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            
                                            { form.campos.map( (c, i) => (
                                                    
                                                    <>
                                                    <Grid item xs={12} sm={1}>
                                                        <TextField disabled type="number" id={c.campo+"_id"} label="Id" style={{"width":"100%"}} name={c.campo+"_id"} onChange={e => handleChange(e) } value={c[c.campo+"_id"]}/>
                                                    </Grid>
                                                    <Grid item xs={12} sm={3}>
                                                        <TextField disabled type="text" id={c.campo+"_nome"} label="Nome" style={{"width":"100%"}} name={c.campo+"_nome"} onChange={e => handleChange(e) } value={c[c.campo+"_nome"]}/>
                                                    </Grid>
                                                    <Grid item xs={12} sm={2}>
                                                        <TextField disabled type="text" id={c.campo+"_tipo"} label="Tipo" style={{"width":"100%"}} name={c.campo+"_tipo"} onChange={e => handleChange(e) } value={c[c.campo+"_tipo"]}/>
                                                    </Grid>
                                                    <Grid item xs={12} sm={1}>
                                                        <TextField type="number" id={c.campo+"_pagina"} label="Página" style={{"width":"100%"}} name={c.campo+"_pagina"} onChange={e => handleChange(e) } value={c[c.campo+"_pagina"]}/>
                                                    </Grid>
                                                    <Grid item xs={12} sm={1}>
                                                        <TextField type="number" id={c.campo+"_x"} label="X" style={{"width":"100%"}} name={c.campo+"_x"} onChange={e => handleChange(e) } value={c[c.campo+"_x"]}/>
                                                    </Grid>
                                                    <Grid item xs={12} sm={1}>
                                                        <TextField type="number" id={c.campo+"_y"} label="Y" style={{"width":"100%"}} name={c.campo+"_y"} onChange={e => handleChange(e) } value={c[c.campo+"_y"]}/>
                                                    </Grid>
                                                    <Grid item xs={12} sm={1}>
                                                        <TextField type="number" id={c.campo+"_width"} label="Lagura" style={{"width":"100%"}} name={c.campo+"_width"} onChange={e => handleChange(e) } value={c[c.campo+"_width"]}/>
                                                    </Grid>
                                                    <Grid item xs={12} sm={1}>
                                                        <TextField type="number" id={c.campo+"_height"} label="Altura"  style={{"width":"100%"}} name={c.campo+"_height"} onChange={e => handleChange(e) } value={c[c.campo+"_height"]}/>
                                                    </Grid>
                                                    <Grid item xs={12} sm={1} >
                                                       <SaveAltIcon onClick={() => save(c.campo)} color='primary' style={{'margin':'13px 5px 5px 5px'}} cursor='pointer'/>
                                                       <DeleteForeverIcon onClick={() => remove(c.campo)} color='secondary' style={{'margin':'13px 5px 5px 5px'}} cursor='pointer'/>
                                                    </Grid>
                                                    <Grid item xs={0} sm={1}>

                                                    </Grid>
                                                    <Grid item xs={12} sm={7}>
                                                        <FormControl className={classes.formControl}>
                                                            <InputLabel id="label-metodos">Metodos</InputLabel>
                                                            <Select labelId="label-metodos" style={{'width':'100%'}} onChange={e => handleChangeMetodoSelecionado(e, c.campo)} value={c[c.campo+'_metodo']} >
                                                                <MenuItem key={0} value={''}>{''}</MenuItem>
                                                                {metodos.map( (m,i) => <MenuItem key={i} value={m.nome}>{m.assinatura}</MenuItem> )}
                                                            </Select>
                                                        </FormControl>    
                                                    </Grid>
                                                    <Grid item xs={12} sm={4}>
                                                        <TextField type="text" id={c.campo+"_parametros"} label="Parametros"  style={{"width":"100%"}} name={c.campo+"_parametros"} onChange={e => handleChange(e) } value={c[c.campo+"_parametros"]}/>
                                                    </Grid>
                                                    
                                                    </>
                                            ))}
                                         
                                            <Grid item xs={12} sm={12}>
                                            { form.campos.length <= 0 ? 
                                                <Button variant="contained" disabled style={{'width':'100%'}}>Testar</Button>
                                                :
                                                <Button variant="contained"  onClick={handleTestar} style={{'width':'100%'}}>Testar</Button>
                                            }
                                            </Grid>
                                            {open ? <>
                                            <Grid item xs={12} sm={8}>
                                                <TextField type="file" id="faturaPdf" label="Importar Fatura PDF" style={{"width":"95%"}} name='faturaPdf' onChange={e => handleChangeFaturaPdf(e) } />
                                            </Grid>
                                            <Grid item xs={12} sm={2}>
                                                <Button variant="contained" style={{'width':'100%'}} color="primary" onClick={e => handleVisualizarDados(e) }>
                                                    Dados
                                                </Button>
                                                
                                                
                                            </Grid>
                                            <Grid item xs={12} sm={2}>
                                                <Button variant="contained" style={{'width':'100%'}} color="primary" onClick={e => visualizaCamposPdf(e) }>
                                                    PDF
                                                </Button>
                                            </Grid>
                                            <Grid item xs={12} sm={12}>
                                            Resultados:
                                            </Grid>
                                            <Grid container spacing={3}>
                                                {
                                                    dadosFatura.map(d => 
                                                        <>
                                                        <Grid item xs={3}>
                                                            <Paper className={classes.paper}>{d.nome}</Paper>
                                                        </Grid>
                                                        <Grid item xs={7}>
                                                            <Paper className={classes.paper}>
                                                                <div className={classes.msgWrapper}>
                                                                    {d.valor[0]}
                                                                </div>
                                                            </Paper>
                                                        </Grid>
                                                        <Grid item xs={2}>
                                                            <Paper className={classes.paper}>{d.valor[1]}</Paper>
                                                        </Grid>
                                                        </>
                                                    )
                                                }
                                            </Grid>
                                            </>
                                            : null }
                                        </Grid>
                                        
                                    </form>
                                                                                   
                    </Container>            
                </Scrollbar>        
                    
            </Page>
    )
}

export default CadastroFaturaMascaraPdf;