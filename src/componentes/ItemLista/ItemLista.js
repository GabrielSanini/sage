import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import TocIcon from '@material-ui/icons/Toc';
import ApiSage from '../../services/ApiSage';

const ItemLista = (props) => {

    const {nome, qtRegistros, onClickViewDados} = props;
    const [open, setOpen] = React.useState(false);
    const [campos, setCampos] = React.useState([]);
    const handleClick = () =>{
        if(open){
            setCampos([]);
        }else{
            getCampos();
        }
        setOpen(!open);
    }

    const getCampos =() => {
        ApiSage.get(`window/listaCamposTabela?nome=${nome}`)
                .then((response) => {
                    setCampos(response.data);
                }).catch((error) => {
                    let erro = error.response;
                    console.log('erro getListaTabelas: ', erro);
                });
    }

    return (
        <>
            <ListItem key={nome} onClick={handleClick}>
                <ListItemIcon>
                <TocIcon fontSize='small' onClick={(e) => {onClickViewDados(nome, e)}}/>
                </ListItemIcon>
                <ListItemText primary={nome + ' ('+qtRegistros+')'} />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List dense={true} component="div" >
                    {
                        campos.map(c => (
                            <ListItem  sx={{ pl: 1 }}>
                                <ListItemIcon>
                                </ListItemIcon>
                                <ListItemText primary={c[0].toUpperCase() + '  ' + c[1]} />
                            </ListItem>
                        ))
                    }
               
                </List>
            </Collapse>
        </>
    )
}

export default ItemLista;
