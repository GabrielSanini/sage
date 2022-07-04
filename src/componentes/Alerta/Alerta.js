import {useState} from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';      


const Alerta = (props) => {
    //const [propriedades, setPropriedades] = useState(props);

    //const [open, setOpen] = useState(props.open);
  //  const close = (event, reason) => {
  //      if(reason === 'clickaway')
 //           return;
 //       setOpen(false)
//    }
    
    function Alert (props) {return (<MuiAlert elevation={6} variant="filled" {...props} />)}

    return (
        <Snackbar open={props.open} autoHideDuration={4000} onClose={props.handleClose}>
            <Alert onClose={props.handleClose} severity={props.tipo}>
                {props.msg}
            </Alert>
        </Snackbar>
    );
}

export default Alerta;