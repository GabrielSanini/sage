import Button from '@material-ui/core/Button'
import Page from 'material-ui-shell/lib/containers/Page'
import Paper from '@material-ui/core/Paper'
import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { useIntl } from 'react-intl'
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import URL from '../../services/URL';

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


const ChangePassword = (props) => {

  const getUsarname = (props) => {
    let search = props.location.search;
    let dados = search.split('ey=')[1].split('__');
    return dados[0];
  }

  const getToken = (props) => {
    let search = props.location.search;
    let dados = search.split('ey=')[1].split('__');
    return dados[1];
  }

  const classes = useStyles()
  const intl = useIntl()
  const [userName] = useState(getUsarname(props))
  const [token] = useState(getToken(props))
  const [password, setPassword] = useState('')
  const [passwordConfirmar, setPasswordConfirmar] = useState('')
  const [openRetorno, setOpenRetorno] = useState(false)
  const [tipoRetorno, setTipoRetorno] = useState('')
  const [mensagemRetorno, setMensagemRetorno] = useState('')

  const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />
  }

  const handleCloseRetorno = () =>{
    setOpenRetorno(false)
  }

  function handleSubmit(event) {
    event.preventDefault()

    axios.post(`${URL}/savePassword`, 
                      { "userName": userName,
                         "token": token,
                         "password": password,
                         "passwordConfirmar": passwordConfirmar})
                      .then(function (response) {
                        setMensagemRetorno('Senha atualizada com sucesso!')
                        setTipoRetorno('success')
                        setOpenRetorno(true)
                      })
                      .catch(function (error) {
                        console.log(error.response);
                        setMensagemRetorno(error.response.data.error)
                        setTipoRetorno('error')
                        setOpenRetorno(true)
                      });
  }

  return (
    <Page pageTitle={intl.formatMessage({ id: 'reset_action' })}>
      <Paper className={classes.paper} elevation={6}>
        <div className={classes.container}>
          <Typography component="h1" variant="h5">
            {intl.formatMessage({ id: 'reset_action' })}
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit} noValidate>
            <TextField
              value={userName}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label={intl.formatMessage({ id: 'username' })}
              name="username"
              type="username"
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
              id="password"
              label={intl.formatMessage({ id: 'password' })}
              name="password"
              type="password"
              autoComplete="current-password"
              autoFocus
            />
            <TextField
              value={passwordConfirmar}
              onInput={(e) => setPasswordConfirmar(e.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password_confirmar"
              label={intl.formatMessage({ id: 'password_confirmar' })}
              type="password"
              id="password_confirmar"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {intl.formatMessage({ id: 'reset_action' })}
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
            <Link to="/signin">
              {intl.formatMessage({ id: 'signin' })}
            </Link>
          </div>

          <Snackbar open={openRetorno} autoHideDuration={6000} onClose={handleCloseRetorno}>
            <Alert onClose={handleCloseRetorno} severity={tipoRetorno}>
              <strong>Falha! </strong>{mensagemRetorno}
            </Alert>
          </Snackbar> 
        </div>
      </Paper>
    </Page>
  )
}

export default ChangePassword;
