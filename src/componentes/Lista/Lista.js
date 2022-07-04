import React from 'react';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';

import ItemLista from '../../componentes/ItemLista/ItemLista';


const Lista = (props) => {

  const {tabelas, onClickViewDados} = props;

  return (
    <List 
      dense = {true}
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Tabelas
        </ListSubheader>
      }
    >
      {
        tabelas.map((t) => (
          <ItemLista nome={t[0]} qtRegistros={t[1]} onClickViewDados={onClickViewDados}/>
        ))
      }
    </List>
  );
}

export default Lista;