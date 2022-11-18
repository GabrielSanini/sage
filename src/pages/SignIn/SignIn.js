import Button from '@material-ui/core/Button'
import Page from 'material-ui-shell/lib/containers/Page'
import Paper from '@material-ui/core/Paper'
import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { useAuth } from 'base-shell/lib/providers/Auth'
import { useHistory } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { useMenu } from 'material-ui-shell/lib/providers/Menu'
import { login } from "../../services/auth.js";
import axios from 'axios';
import URL from  '../../services/URL';
import Alerta from '../../componentes/Alerta/Alerta.js'

const useStyles = makeStyles((theme) => ({
  
  paper: {
    width: 'auto',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(620 + theme.spacing(6))]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(
      3
    )}px`,
  },
  avatar: {
    margin: theme.spacing(1),
    width: 192,
    height: 192,
    color: theme.palette.secondary.main,
  },
  form: {
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: `100%`,
  },
}))


const SignIn = () => {
  const classes = useStyles()
  const intl = useIntl()
  const history = useHistory()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { setAuthMenuOpen } = useMenu()
  const { setAuth } = useAuth();

  const handleCloseAlert = () => {
    return setAlertaRetorno({
      ...alertaRetorno,
      open:false,
    });
  }

  const [alertaRetorno, setAlertaRetorno] = useState({open:false, tipo: '', msg: '', handleClose: handleCloseAlert}); 
  

  const handleSubmit = (event) => {
    console.log('chegou no login')
    event.preventDefault()
    console.log('chegou no login')
    axios.post(`${URL}/authenticate`, 
                      {"username": username,"password": password})
                      .then(function (response) {
                        console.log(response.data);
                        logar(response.data);
                      })
                      .catch(function (error) {
                        setAlertaRetorno({
                          ...alertaRetorno,
                          open: true,
                          msg: erro(error),
                          tipo: 'error',
                        })
                      });
  }

  const erro = (error) => {
    if(typeof error.response === 'undefined' )
      return `Falha na conexão com o servidor`;
    
    if(error.response.data.status === 401)
      return `Usuário ou senha errados`;
    return error.response.data.message;
  }

  const logar = (obj) => {
    console.log( 'entrou no logar', obj);
    login(obj.token);
    authenticate({
      displayName: 'Usuário',
      email: obj.email,
    })
  }
  
  const authenticate = (user) => {
    setAuth({ isAuthenticated: true, ...user })
    setAuthMenuOpen(false)

    let _location = history.location

    let _route = '/IndicadoresComparativo'
    console.log(_location.state, _location.state.from)
    if (_location.state && _location.state.from) {
      if(_location.state.from.pathname !== "/signin")
        _route = _location.state.from.pathname
      history.push(_route)
    } else {
      history.push(_route)
    }
  }

  console.log(alertaRetorno);

  return (
    <Page pageTitle={intl.formatMessage({ id: 'sign_in' })}> 
      <Paper className={classes.paper} elevation={6}>
        <div className={classes.container}>
          <Typography component="h1" variant="h5">
            {intl.formatMessage({ id: 'sign_in' })}
          </Typography>
          <form className={classes.form}  noValidate>
            <TextField
              value={username}
              onInput={(e) => setUsername(e.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label={intl.formatMessage({ id: 'username' })}
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              value={password}
              onInput={(e) => setPassword(e.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label={intl.formatMessage({ id: 'password' })}
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              className={classes.submit}
            >
              {intl.formatMessage({ id: 'sign_in' })}
            </Button>
          </form>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <Link to="/password_reset">
              {intl.formatMessage({ id: 'forgot_password' })}?
            </Link>
            <Link to="/signup">
              {intl.formatMessage({ id: 'registration' })}
            </Link>
          </div>
           <Alert {...alertaRetorno}/>
        </div>
      </Paper>
    </Page>
  )

  function Alert(props){
    console.log('Alert', props);
    if(props == null)
      return null;
    return (<Alerta {...props}/> );
  }
}


export default SignIn
