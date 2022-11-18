import React, {useState, useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import Grafico from 'componentes/Grafico/Grafico';
import { Box, Grid, Button  } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ApiSage from '../../services/ApiSage';
import Lista from '../../componentes/Lista/Lista';
import {DataGrid} from '@material-ui/data-grid';

import {Paper} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    formControl: {
        paddingTop: 1,
        paddingBottom: 1,
        minWidth: 120,
        width: '100% !important' ,
    },
}));


const View = (props) => {

    const classes = useStyles();

    const [nome, setNome] = useState('view_'+ props.id )
    const [tabelas, setTabelas] = useState([]);
    const [consultaSql, setConsultaSql] = useState(props.consultaSql);
    const [grafico, setGrafico] = useState(props.grafico);
    const [filtros, setFiltros] = useState(props.filtros);


    const [dados, setDados] = useState([])
    const [dadosGraf, setDadosGraf] = useState([]);
    
    const handleChangeConsultaSql = (event) => {
        setConsultaSql(event.target.value);
    };


    useEffect(()=>{
        getListaTabelas();
    }, [])

    const getListaTabelas = () => {
        ApiSage.get(`window/listaTabelas`)
                .then((response) => {
                    setTabelas(response.data);
                    console.log('tabelas', tabelas, response.data);
                }).catch((error) => {
                    let erro = error.response;
                    console.log('erro getListaTabelas: ', erro);
                });
    }

    const onClickViewDados = (nomeTabela) => {
        ApiSage.get(`window/amostraDadosTabela?nome=${nomeTabela}`)
        .then((response) => {
            carregaAmostra(response.data);
            console.log('carregaAmostra', response.data);
        }).catch((error) => {
            let erro = error.response;
            console.log('erro amostraDadosTabela: ', erro);
        });
    }

    const [rows, setRows] = React.useState([]);
    const [columns, setColumns] = React.useState([]);

    const carregaAmostra = (dados) => {
        setColumns(ajustaColunas(dados.cabecalho));
        setRows(ajustaLinhas(dados.cabecalho, dados.dados));
    }

    const ajustaLinhas = (cabecalho, linhas) => {
        let lis = [];
        let id = true;
        if(cabecalho.indexOf("id") === -1)
            id = false;
        for(let i in linhas){
            let linha = linhas[i];
            let o = {};
            if(!id)
                o.id = i;
            for(let u in linha ){
                o[cabecalho[u]] = linha[u];
            }
            lis.push(o);
        }
        //console.log('linhas', lis);
        return lis;
    }

    const ajustaColunas = (cabecalho) => {
        let cols = [];
        if(cabecalho.indexOf("id") === -1)
            cols.push({field: 'id', headerName: 'id', hide: true});

        for(let i in cabecalho)
            cols.push({field: cabecalho[i],  width: 150, headerName: cabecalho[i]})
            
        return cols;
    }

    const garantirEspacoEntreLinhas = (texto) => {
        return texto.replaceAll("\n"," \n");
    }

    const carregarDadosTabela = () => {
        ApiSage.get(`window/consultaGenerica?sql=${garantirEspacoEntreLinhas(consultaSql)}`)
            .then((response) => {
                console.log('consultaGenerica', response.data)
                
                carregaAmostra(response.data);
                //carregarDadosGrafico(response.data);
            }).catch((error) => {
                let erro = error.response;
                console.log('erro getListaTabelas: ', erro);
            });
    }

    const handleChangeConsulta = (e) => {
        setConsultaSql(e.target.value);
    }

    const carregaGrafico = (info) => {
        let registros = info.dados;
        registros.unshift(info.cabecalho);
        setDadosGraf(registros);
        console.log('registros graf',dadosGraf)
    }

    const carregarDadosGrafico = (data) => {
        ApiSage.get(`window/consultaGenerica?sql=${garantirEspacoEntreLinhas(consultaSql)}`)
            .then((response) => {
                console.log('consultaGenerica', response.data)
                
                carregaGrafico(response.data);
                
            }).catch((error) => {
                let erro = error.response;
                console.log('erro carregarDadosGrafico: ', erro);
            });
    }


    return (
        
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
                >
        {
        //<input id="outlined-basic" label="Outlined" variant="outlined" />
        }
      
        <Grid container spacing={2} >
            <Grid item xs={3}>
                
                    <Lista tabelas={tabelas} onClickViewDados={onClickViewDados} />
               
            </Grid>
            <Grid item xs={9}>
                <Grid container>
                    <Grid item xs={7}>
                        

                            <TextField className={classes.formControl}
                                id="outlined-textarea"
                                label="Consulta:"
                                placeholder="digite a consulta"
                                multiline
                                rows={16}
                                onChange={handleChangeConsulta}
                            />
                            <Button onClick={carregarDadosTabela} variant="outlined">Tabela</Button>
                            <Button onClick={carregarDadosGrafico} variant="outlined">Grafico</Button>
                        
                    </Grid>
                  
                    <Grid item xs={4}  >
                        <>
                        <Grafico dados={dadosGraf} chartEditor={null} chartWrapper={null} />
                        </>
                   </Grid>

                    <Grid item xs={12} style={{  height:450}}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            checkboxSelection
                        />               
                    </Grid>
                </Grid>
            </Grid>
            
        </Grid>
      </Box>
    )

}

export default View;

