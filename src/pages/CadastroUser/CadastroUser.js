import React, {useState, useEffect} from 'react';
import Page from 'material-ui-shell/lib/containers/Page'
import { makeStyles } from '@material-ui/core/styles';
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar/Scrollbar'
import TextField from '@material-ui/core/TextField';

import { CircularProgress , Container, Grid, Button, FormControl, InputLabel,Select, MenuItem, Input } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useIntl } from 'react-intl'
import ApiSage from '../../services/ApiSage'
import SelectEmpresas from 'componentes/SelectEmpresas/SelectEmpresas';


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
      marginTop: theme.spacing(0),
      width: '100%',
    },
    container:{
      padding: theme.spacing(3)
    },
    formControl: {
      margin: theme.spacing(0),
      minWidth: 120,
      width: '100%',
    },
    button: {
      margin: theme.spacing(1),
      width: '100%',
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
      },
    chip: {
        margin: 2,
      },
    noLabel: {
        marginTop: theme.spacing(3),
      },
  }));

const CadastroUser = () => {

    const intl = useIntl()
    const classes = useStyles();

    const preForm = {
        username: '',
        nome: '',
        email: '',
        telefone: '',
        empresa_id: '',
        rolesSelecionadas: [],
        expirou: 1,
    }

    const [form, setForm] = useState(preForm);

    const[empresas, setEmpresas] = useState([]);
    const[roles, setRoles] = useState([]);

    const[processando, setProcessando] = useState(false);

    const[msgRetornoAtiva, setMsgRetornoAtiva] = useState(false);
    const[msgRetornoTipo, setMsgRetornoTipo] = useState();
    const[msgRetorno, setMsgRetorno] = useState();

    const[rows, setRows] = useState([]);
    const[columns, setColumns] = useState([
        { field: 'id', headerName: 'UserName', width: 150},
        { field: 'email', headerName: 'Email', width: 250},
        { field: 'expirou', headerName: 'Expirou', width: 100},
        { field: 'empresa', headerName: 'Empresa', width: 150},
    ]);


    const handleChange = (e) => {
        console.log('handleChange', e.target);
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    const handleChangeTelefone = (e) => {
        let fone = parseInt(e.target.value);
        setForm({
            ...form,
            ['telefone']: fone,
        });
    }

    const handleChangeRole = (e) => {
        console.log('handleChangeRole', e.target);
        let roles = [];
        roles.push(e.target.value);
        setForm({
            ...form,
            ['rolesSelecionadas']: roles,
        });
    }

    const handleChangeSelectEmpresa = (valor) => {
        //console.log('handleChangeSelectEmpresa', e);
        setForm({
            ...form,
           ['empresa_id']: valor,
        });
    }

    const handleCloseMsgRetorno = (e) => {
        console.log('handleCloseMsgRetorno', e);
    }



    const limparCampos = () => {
    }

    const postUser = () => {
        console.log('postUser', {form});
        ApiSage.post('user', form).
                        then((response) => {
                            getFindAllUsers();
                        }).catch( (error) => {
                            console.log('error postUser: ', error.data);
                        });
    }

    const getFindById = () => {
        ApiSage.get('user/findById?id'+ form.username).
                    then( (response) => {
                        console.log(response);
                    }).catch( (error) => {
                        console.log(error.response);
                    });
    }

    const getFindAllUsers = () => {
        ApiSage.get('user/findAll').
                    then( (response) => {
                        console.log('user/findAll', response);
                        atualizaTabelaUsuarios(response.data);
                    }).catch( (error) => {
                        console.log(error.response);
                    });
    }

    const atualizaTabelaUsuarios = (users) => {
        let linhas = [];
        let count = 1;
        for(let i in users){
            linhas.push({
                id: users[i].username, email: users[i].email, expirou:'', empresa: ''
            })
        }
        console.log(linhas, columns);
        setRows(linhas);
    }

    const getAllEmpresas = () => {
        ApiSage.get('empresa/findAll').then(
            (response) => {
                console.log('empresas', response.data);
                retornoGetAllEmpresas(response.data);
            }
        ).catch( (error) => {
            setMsgRetornoAtiva(true);
            setMsgRetornoTipo('error');
            //setMsgRetorno(`Falha ao buscar empresas: ${error.reponse.data.message}`);
        });
    }
    
    const retornoGetAllEmpresas = (empresas) =>{
        console.log('setEmpresas', empresas);
        setEmpresas(empresas);
    }

    const getAllRoles = () => {
        ApiSage.get('role/findAll').then(
            (response) => {
                console.log('roles', response);
                retornoGetAllRoles(response.data);
            }
        ).catch( (error) => {
            setMsgRetornoAtiva(true);
            setMsgRetornoTipo('error');
            setMsgRetorno(`Falha ao buscar Roles: ${error.reponse.data.message}`);
        });
    }

    const retornoGetAllRoles = (roles) => {
        console.log(roles);
        setRoles(roles);
    }

    const getDadosIniciais = () => {
        //getAllEmpresas();
        getAllRoles();
        getFindAllUsers();
    }

    useEffect ( () => {
        getDadosIniciais();
    }, [] );

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }
    
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
          style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
          },
        },
      };

    return (
        <Page pageTitle={intl.formatMessage({ id: 'CadastroUser' , defaultMessage: 'Cadastro de usuários'})}>
            <Scrollbar
            style={{ height: '100%', width: '100%', display: 'flex', flex: 1 }}
            >

                <Container maxWidth="lg"> 
                    
                    <div>
                        <form className={classes.root} noValidate autoComplete="off">
                            <Grid container spacing={3} className={classes.container}>
                                <Grid item xs={12} sm={3}>
                                    <TextField required id="username" label="UserName" style={{"width":"100%"}} name="username" onChange={ (e)=> {handleChange(e)}} value={form.username}/>
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                    <TextField required  id="nome" label="Nome" style={{"width":"100%"}} name="nome"  onChange={ (e)=> {handleChange(e)}} value={form.nome}/>
                                </Grid>
                                <Grid item xs={12} sm={5}>
                                    <TextField required id="email" label="Email" style={{"width":"100%"}} name="email"  onChange={ (e)=> {handleChange(e)}} value={form.email}/>
                                </Grid>
                                <Grid item xs={12} sm={7}>
                                    <TextField required id="telefone" label="Telefone" style={{"width":"100%"}} name="telefone" type='number' onChange={  (e)=> {handleChangeTelefone(e)}} value={form.telefone}/>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="label-expirou">Estado expirou</InputLabel>
                                        <Select
                                            labelId="label-expirou"
                                            id="expirou"
                                            style={{"width":"100%"}}
                                            value={form.expirou}
                                            name="expirou"
                                            onChange={(e)=> {handleChange(e)}}
                                        >
                                            <MenuItem key={1} value={0}>Sim</MenuItem>
                                            <MenuItem key={2} value={1}>Não</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                   {/* <FormControl className={classes.formControl}>
                                        <InputLabel id="label-empresas">Empresa</InputLabel>
                                        <Select
                                            labelId="label-empresas"
                                            id="select-empresa-id"
                                            multiple
                                            value={form.empresasSelecionadas}
                                            name="empresasSelecionadas"
                                            onChange={handleChange}
                                        >
                                            {empresas.map((e) => (
                                                <MenuItem key={e.id} value={e.id}>{e.nome}</MenuItem>
                                            ))}
                                        </Select>
                                            </FormControl> */}
                                    <SelectEmpresas onChange={handleChangeSelectEmpresa} value={form.empresa_id} />
                                </Grid>
                              
                                <Grid item xs={12} sm={4}>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="label-roles">Perfis</InputLabel>
                                        <Select
                                            
                                            labelId="label-roles"
                                            id="select-role-id"
                                            value={form.rolesSelecionadas}
                                            name='rolesSelecionadas'
                                            onChange={(e)=>{handleChangeRole(e)}}
                                        >
                                            {roles.map( (r) => (
                                                <MenuItem key={r.name} value={r.name}>{r.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                
                                <Grid item xs={12} sm={6}>
                                    <Button variant="contained" color="danger" className={classes.button} onClic={limparCampos}>Cancelar</Button>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Button
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    onClick={postUser}
                                    >
                                    Salvar
                                    </Button>
                                </Grid>
                                
                            </Grid>
                        </form>
                    </div>
                   
                    {processando ? <CircularProgress /> : `` }

                    <Snackbar open={msgRetornoAtiva} autoHideDuration={6000} onClose={handleCloseMsgRetorno}>
                        <Alert onClose={handleCloseMsgRetorno} severity={msgRetornoTipo}>
                            {msgRetorno}
                        </Alert>
                    </Snackbar> 
                    <DataGrid rows={rows} columns={columns} pageSize={5} />
                </Container>            
            </Scrollbar>            
        </Page>
    )
}

export default CadastroUser;