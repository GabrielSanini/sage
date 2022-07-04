
import React, {useState,useEffect} from 'react';
import ApiSage from '../../services/ApiSage'

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { CircularProgress , Container, Grid, Button, Divider , Toolbar, Paper } from '@material-ui/core';
import Page from 'material-ui-shell/lib/containers/Page'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar/Scrollbar'
import TextField from '@material-ui/core/TextField';
import { useIntl } from 'react-intl'
import Chart from "react-google-charts";
import { red } from '@material-ui/core/colors';

import FilterListIcon from '@material-ui/icons/FilterList';

import Drawer from '@material-ui/core/Drawer';
import ListItem from '@material-ui/core/ListItem';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';


import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';

import SelectEmpresas from '../../componentes/SelectEmpresas/SelectEmpresas.js';

import './style.css';

const useStyles = makeStyles((theme) => ({
    formControl: {
        width: '100%',
      },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        marginTop: '2px',
    },
    p:{
        fontSize: '45px',
        color: red,
        marginTop: '0px',
    }
  }));

const IndicadoresUc = () => {

    const classes = useStyles();
    const intl = useIntl()
    
    const theme = useTheme();

    const [openFilter, setOpenFilter] = useState(false);
    const [processando, setProcessando] = useState();

    const [empresaId, setEmpresaId] = useState('');
    const [evolucaoUc,setEvolucaoUc] = useState([]);
    const [distribuicao, setDistribuicao] = useState([]);
    const [uc, setUc] = useState();
    const [listaUcs, setListaUcs] = useState([]);

    const [soma, setSoma] = useState(0);
    const [media, setMedia] = useState(0);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);

    const [dados, setDados] = useState();

    const [consumoPrevistoRealizado, setConsumoPrevistoRealizado] = useState([]);
    const [gapPrevistoRealizado, setGapPrevistoRealizado] = useState([]);
    
    
    const mesAnoInicio = () => {
        return (new Date()).getFullYear() + '-01';
    }

    const mesAnoFim = () => {
        return (new Date()).getFullYear() + '-12';
    }

    const [inicio, setInicio] = useState(mesAnoInicio);
    const [fim, setFim] = useState(mesAnoFim);


    const getDadosUcEvolucao = (ini, fi, uc) => {
        ApiSage.get(`indicador/consultaUc?inicio=${ini}-01&fim=${fi}-01&uc=${uc}&empresaId=${empresaId}`)
                .then((response) => {
                    retornoGetDadosUcEvolucao(response.data);
                }).catch((error) => {
                    let erro = error.response;
                    console.log('erro get getDadosUcEvolucao: ', erro);
                });
    }

    const getKwhConsumidoVsPrevisto = (ini, fi, uc) => {
        ApiSage.get(`indicador/consultaDemandaExecutadoComPlanejada?uc=${uc}&inicio=${ini}-01&fim=${fi}-01`)
                .then((response) => {
                    retornoGetKwhConsumidoVsPrevisto(response.data);
                }).catch((error) => {
                    let erro = error.response;
                    console.log('erro get getDadosUcEvolucao: ', erro);
                });
    }

    const retornoGetKwhConsumidoVsPrevisto = (retorno) => {
        console.log('retornoGetKwhConsumidoVsPrevisto', retorno);
        let graficoEvolucao = [['data', 'Executado', 'Previsto']];
        let graficoGap = [['data', 'Economizado', 'Excedente', 'Acumulado']]
        let dados = retorno.dados;
        let gapAcumulado = 0;
        for(let i in dados){
            let data = dados[i][0].split('-');
            let linha = [new Date(data[0], data[1]), dados[i][2], dados[i][3]]
            graficoEvolucao.push(linha);

            let valor = dados[i][2] - dados[i][3] ;
            gapAcumulado = gapAcumulado + valor;
            let linhaGap = [new Date(data[0], data[1]), valor < 0 ? valor: 0, valor >= 0 ? valor: 0, gapAcumulado]
            graficoGap.push(linhaGap);
        }

        console.log('graficoGap', graficoGap);
        setConsumoPrevistoRealizado(graficoEvolucao);
        setGapPrevistoRealizado(graficoGap);
    }

    const getListaUcs= () => {
        ApiSage.get(`unidadeConsumidora/findAllByEmpresa?empresaId=${empresaId}`)
                .then((response) => {
                    setListaUcs(criarListaUcs(response.data));
                }).catch((error) => {
                    let erro = error.response;
                    console.log('erro get getListaUcs: ', erro);
                });
    }

    const getDadosUcDistribuicaoValor = (ini, fi, uc) => {
        ApiSage.get(`indicador/consultaSomaParcelasUc?inicio=${ini}-01&fim=${fi}-01&uc=${uc}`)
                .then((response) => {
                    console.log('getDadosUcDistribuicaoValor', response);
                    retornoGetDadosUcDistribuicaoValor(response.data);
                }).catch((error) => {
                    let erro = error.response;
                    console.log('erro get getDadosUcDistribuicaoValor: ', erro);
                });
    }
    
    useEffect(() => {
        if(empresaId !== '')
            getListaUcs(empresaId);
    }, [empresaId]); 

    const criarListaUcs = (ucs) => {
        let vetor = [];
        ucs.forEach(u => vetor.push({id: u.id, nome: u.nome}));
        return vetor;
    }

    const retornoGetDadosUcDistribuicaoValor = (retorno) => {
        let vetor = [['Tipo', 'Parcela']];
        for(let i = 0; i < retorno.dados[0].length; ++i)
            vetor.push([retorno.cabecalho[i], retorno.dados[0][i]]);
        //console.log('vetor dist: ', vetor);
        setDistribuicao(vetor);
    }

    const retornoGetDadosUcEvolucao = (retorno) => {
        console.log('retornoGetDadosUcEvolucao', retorno);
        let vetor = [['mes', 'KWH', 'KVARH', 'VALOR']];
        let dados = retorno.dados;
        for(let i in dados){
            let linha = [new Date(dados[i][5], dados[i][4]), dados[i][1], dados[i][2], dados[i][3]];
            console.log('linha', linha)
            vetor.push(linha);
        }
        console.log('vetor: ', vetor);
        //setEvolucaoUc(vetor);
        minMaxConsumo(dados);
        somaConsumo(dados);
    }

    const handleEditInicio = (e) => {
        console.log('inicio: ', e);
        let ini = e.target.value;
        setInicio(ini);
        getDadosUcEvolucao(ini, fim, uc);
        getDadosUcDistribuicaoValor(ini, fim, uc);
    }

    const handleEditFim = (e) => {
        console.log('fim: ', e);
        let fi = e.target.value;
        setFim(fi);
        getDadosUcEvolucao(inicio, fi, uc);
        getDadosUcDistribuicaoValor(inicio, fi, uc);
    }
    
    const handleEditUc = (e) => {
        console.log('uc: ', e);
        let uc = e.target.value;
        setUc(uc);
        getKwhConsumidoVsPrevisto(inicio, fim, uc);
        getDadosUcEvolucao(inicio, fim, uc);
        getDadosUcDistribuicaoValor(inicio, fim, uc);
    }

    const minMaxConsumo = (dados) => {
        let minInicial = 999999999999;
        let min = minInicial;
        let max = 0;
        for(let i in dados){
            max = dados[i][1] > max ? dados[i][1] : max;
            min = dados[i][1] < min ? dados[i][1] : min;
        }
        min = (min === minInicial ? 0 : min);
        setMin(min);
        setMax(max);
    }

    const mediaConsumo = (dados) => {
        let soma = 0;
        console.log('mediaConsumo: ', dados);
        for(let i in dados)
            soma += dados[i][3];
        
        setMedia(soma/dados.length);
    }

    const somaConsumo = (dados) => {
        let soma = 0;
        console.log('somaConsumo: ', dados);
        for(let i in dados)
            soma += dados[i][1];
        setSoma(soma);
    }

    const handleRefresh = () =>{

        getKwhConsumidoVsPrevisto(inicio, fim, uc);
        getDadosUcEvolucao(inicio, fim, uc);
        getDadosUcDistribuicaoValor(inicio, fim, uc);
    }

    const handleFilterOpen = () => {
        setOpenFilter(!openFilter);
    }

    const handleEditEmpresa = (valor) => {
        setEmpresaId(valor);
    }


    const GraficoEvolucao = () => {
        return  <Chart id='graficoEvolucao'
                    width='100%'
                    height='100%'
                    chartType="Line"
                    loader={<div>Consultando informações</div>}
                    data={consumoPrevistoRealizado}
                    options={{
                        // Material design options
                        vAxis: { minValue: 0},
                        hAxis: { minValue: 0},
                        chart: {
                            title: 'Consumo Previsto vs Realizado',
                        },
                        curveType: 'function',
                        series: {
                            0: { lineDashStyle: [ 2, 2] },
                        },
                    }}
                    // For tests
                    rootProps={{ 'data-testid': '2' }}
                />
    }

    const GraficoGapPrevistoVsRealizado = () => {
        return  <Chart id='gapPrevistoRealizado'
                    width='100%'
                    height='100%'
                    chartType="ComboChart"
                    loader={<div>Consultando informações</div>}
                    data={gapPrevistoRealizado}
                    options={{
                        // Material design options
                        chart: {
                            title: 'Gap Previsto vs Realizado',
                        },
                        curveType: 'function',
                        colors: ['#6f9654', '#e2431e', '#f1ca3a'],
                        seriesType: 'bars',
                        series: {2: {type: 'line'}}
                    }}
                    // For tests
                    rootProps={{ 'data-testid': '2' }}
                />
    }
    
    return (
        
        <Page pageTitle={intl.formatMessage({ id: 'IndicadoresUc' , defaultMessage: 'Indicador UC'})}
                appBarContent = {
                    <Toolbar disableGutters>
                        {processando ? <CircularProgress /> : `` }
                        
                        <FilterListIcon style={{"cursor":"pointer"}} onClick={handleFilterOpen}/>
                    </Toolbar>
                }
        >
            <Scrollbar
            style={{ height: '100%', width: '100%', display: 'flex', flex: 1 }}
            >
            <Container > 
                    <Grid style={{"margin-top": "5px"}} container spacing={3} className={classes.container}>
                        <Grid item xs={12} sm={4}>
                            <Paper className={classes.paper} style={{'height':'150px'}}>
                                <h4>Categoria:</h4>
                                <p className={classes.p} >B1</p>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Paper className={classes.paper} style={{'height':'150px'}}>
                                <h4>Menor consumo:</h4>
                                <p className={classes.p} >{min.toFixed(0)} KWh</p>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Paper className={classes.paper} style={{'height':'150px'}}>
                                <h4>Maior consumo:</h4>
                                <p className={classes.p} >{max.toFixed(0)} KWh</p>
                            </Paper>
                        </Grid>                
                        <Grid item xs={12} sm={12}>
                            <Paper className={classes.paper} style={{'height':'450px'}}>
                                {consumoPrevistoRealizado.length > 0 ? <GraficoEvolucao /> : ``}
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Paper className={classes.paper} style={{'height':'450px'}}>
                                {gapPrevistoRealizado.length > 0 ? <GraficoGapPrevistoVsRealizado /> : ``}
                            </Paper>
                        </Grid>
                        
                       
                        <Grid item xs={12} sm={4}>
                            <Paper className={classes.paper} style={{'height':'250px'}}>
                            <Chart
                                width={'100%'}
                                height={'100%'}
                                chartType="PieChart"
                                loader={<div>Carregando dados</div>}
                                data={distribuicao}
                                options={{
                                   // backgroundColor: 'red',
                                   // backgroundOpacity: 0.5,
                                    title: 'Distribuição custo',
                                    // Just add this option
                                    pieHole: 0.4,
                                }}
                                rootProps={{ 'data-testid': '3' }}
                                />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={9}>
                            <Paper className={classes.paper} style={{'height':'300px'}}>
                               
                            </Paper>
                        </Grid>
                    </Grid>

            </Container>   
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="right"
                open={openFilter}
                classes={{
                paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                <IconButton onClick={handleFilterOpen}>
                    {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
                </div>
                <Divider />
                    <List>
                        <ListItem button key='empresa_1'>
                            <SelectEmpresas onChange={handleEditEmpresa} value={empresaId} />
                        </ListItem>
                        
                        <ListItem button key='ucs'>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="label-ucs">UCs</InputLabel>
                                <Select
                                labelId="label-ucs"
                                id="select-id"
                                value={uc}
                                onChange={handleEditUc}
                                >
                                {listaUcs.map(u => (
                                    <MenuItem key={u.id} value={u.id}>{u.nome}</MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                        </ListItem>
                    </List>
                <Divider />
                <List>
                    <ListItem button key='dt_1'>
                        <TextField
                            id="inicio"
                            label="Início"
                            type="month"
                            defaultValue={inicio}
                            className={classes.textField}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            onChange={handleEditInicio}
                        />
                    </ListItem>
                    <ListItem button key='dt_2'>
                        <TextField
                            id="fim"
                            label="Fim"
                            type="month"
                            defaultValue={fim}
                            className={classes.textField}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            onChange={handleEditFim}
                        />
                    </ListItem>
                </List>  
                <Divider />
                <Button style={{'margin': '10px'}} variant="contained" color="primary" onClick={handleRefresh} >Consultar</Button>          
            </Drawer>               
        </Scrollbar>            
    </Page>
    )
}

export default IndicadoresUc;