
import React, {useState, useEffect} from 'react';
import ApiSage from '../../services/ApiSage'


import FormControl from '@material-ui/core/FormControl';
import { CircularProgress , Container, Grid, Button, Divider , Toolbar, Paper,InputLabel,Select, MenuItem  } from '@material-ui/core';
import Page from 'material-ui-shell/lib/containers/Page'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar/Scrollbar'
import TextField from '@material-ui/core/TextField';
import { useIntl } from 'react-intl'
import Chart from "react-google-charts";
import { blue, red } from '@material-ui/core/colors';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RefreshIcon from '@material-ui/icons/Refresh';
import FilterListIcon from '@material-ui/icons/FilterList';
import Drawer from '@material-ui/core/Drawer';
import ListItem from '@material-ui/core/ListItem';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';


import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';

import SelectEmpresas from '../../componentes/SelectEmpresas/SelectEmpresas.js';

import './style.css';

const drawerWidth = 250;

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
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
      },
      drawerPaper: {
        width: drawerWidth,
      },
      textField: {
          marginLeft: '5px',
          marginRight: '5px',
      }
  }));

const IndicadoresComparativo = () => {

    const classes = useStyles();
    const intl = useIntl()

    const theme = useTheme();

    const [openFilter, setOpenFilter] = useState(false);
    const [processando, setProcessando] = useState();

    const [empresaId, setEmpresaId] = useState('');
    const [faturamento, setFaturamento] = useState(false);
    const [qtdeVendasMensal, setQtdeVendasMensal] = useState(false);
    const [areaLojaMetrosQuadrados, setAreaLojaMetrosQuadrados] = useState(true);
    const [atributo, setAtributo] = useState('AreaLojaMetrosQuadrados');
    const [cargaInstalada, setCargaInstalada] = useState(false);
    const [cargaHorariaMensal, setCargaHorariaMensal] = useState(false);
    const [qtdeFuncionarios, setQtdeFuncionarios] = useState(false);

    const [dadosGraficoSuperior,setDadosGraficoSuperior] = useState([['uc','teste'],['a',23],['b',233]]);
    const [dadosGraficoInferior,setDadosGraficoInferior] = useState([]);

    const [soma, setSoma] = useState(0);
    const [media, setMedia] = useState(0);

    const [dados, setDados] = useState();

    const [ucs, setUcs] = useState([]);
    const [cidades, setCidades] = useState([]);

    const preFiltro = {
        cidadesSelecionadas: [],
        ucsSelecionadas: [],
        inicio: '2020-09',
        fim: '2021-01',
        minArea: '',
        maxArea: '',
        minFaturamento: '',
        maxFaturamento: '',
        minPotencia: '',
        maxPotencia: '',
        maioresConsumos: 15,
    }
    
    const [filtros, setFiltros] = useState(preFiltro);

 /*   
    const [cidadesSelecionadas, setCidadesSelecionadas] = useState([]);
    
    const [ucsSelecionadas, setUcsSelecionadas] = useState([]);
   
    const [inicio, setInicio] = useState('2020-09');
    const [fim, setFim] = useState('2021-01');

    const [minArea, setMinArea] = useState('');
    const [maxArea, setMaxArea] = useState('');

    const [minFaturamento, setMinFaturamento] = useState('');
    const [maxFaturamento, setMaxFaturamento] = useState('');

    const [minPotencia, setMinPotencia] = useState('');
    const [maxPotencia, setMaxPotencia] = useState('');

    const [maioresConsumos, setMaioresConsumos] = useState(15);
*/
    const getListaUcs= () => {
        ApiSage.get(`unidadeConsumidora/findAllByEmpresa?empresaId=${empresaId}`)
                .then((response) => {
                    setUcs(criarListaUcs(response.data));
                }).catch((error) => {
                    let erro = error.response;
                    console.log('erro get getListaUcs: ', erro);
                });
    }

    const criarListaUcs = (ucs) => {
        let vetor = [];
        ucs.forEach(u => vetor.push({id: u.id, nome: u.nome}));
        return vetor;
    }

    useEffect (() => {
        if(empresaId !== ''){
            getCidades(empresaId);
            getListaUcs(empresaId);
            getDados(filtros.inicio, filtros.fim, filtros.cidadesSelecionadas, empresaId);
        }
    }, [empresaId]); 

    const toggleAreaLojaMetrosQuadrados = () => {
        let valor = areaLojaMetrosQuadrados;
        limparChecks();
        setAreaLojaMetrosQuadrados(!valor);
        handleGraficoInferior('areaLojaMetrosQuadrados',dados);
    }
    const toggleFaturamento = () => {
        let valor = faturamento;
        limparChecks();
        setFaturamento(!valor);
        handleGraficoInferior('faturamento',dados);
    }
    const toggleQtdeVendasMensal = ()=>{
        let valor = qtdeVendasMensal;
        limparChecks();
        setQtdeVendasMensal(!valor);
        handleGraficoInferior('qtdeVendasMensal',dados);
    }
    const toggleCargaInstalada = () => {
        let valor = cargaInstalada;
        limparChecks();
        setCargaInstalada(!valor);
        handleGraficoInferior('cargaInstalada',dados);
    }
    const toggleCargaHorariaMensal = () => {
        let valor = cargaHorariaMensal;
        limparChecks();
        setCargaHorariaMensal(!valor);
        handleGraficoInferior('cargaHorariaMensal',dados);
    }
    const toggleQtdeFuncionarios = () => {
        let valor = qtdeFuncionarios;
        limparChecks();
        setQtdeFuncionarios(!valor);
        // getComparacaoAtributos('qtdeFuncionarios');
        handleGraficoInferior('qtdeFuncionarios',dados);
    }

    const limparChecks = () => {
        setAreaLojaMetrosQuadrados(false);
        setFaturamento(false);
        setQtdeVendasMensal(false);
        setCargaInstalada(false);
        setCargaHorariaMensal(false);
        setQtdeFuncionarios(false);
    }

    const getCidades = (empresaId) => {
        ApiSage.get(`indicador/consultaCidades?empresaId=${empresaId}`)
        .then((response) => {
            console.log('getCidades', response.data);
            let dados = [];
            for(let i in response.data.dados){
                if(response.data.dados[i][1] != null){
                    let obj = {
                        id : response.data.dados[i][1],
                        nome : response.data.dados[i][0]
                    }
                    dados.push(obj);
                }
            }
            console.log(dados)
            setCidades(dados);
        }).catch((error) => {
            let retorno = error.response;
        });
    }
    
    const getDados = (ini, fi, cd, emp) => {
        //setAtributo(atributo);
        console.log(ini, fi)
        //console.log('cidadesSelecionadas', cidadesSelecionadas);
        ApiSage.get(`indicador/comparativoUc?inicio=${ini}-01&fim=${fi}-01&cidades=${cd.join(",")}&empresaId=${emp}
                                            &maioresConsumos=${filtros.maioresConsumos}&ucs=${filtros.ucsSelecionadas.join(',')}&minArea=${filtros.minArea}
                                            &maxArea=${filtros.maxArea}&minFaturamento=${filtros.minFaturamento}&maxFaturamento=${filtros.maxFaturamento}
                                            &minPotencia=${filtros.minPotencia}&maxPotencia=${filtros.maxPotencia}`)
                .then((response) => {
                    console.log(response);
                    let dados = response.data;
                    setDados(dados);
                    retornoGetDados(dados);
                }).catch((error) => {
                    let retorno = error.response;
                });

    }

    const retornoGetDados = (retorno) => {
        handleGraficoSuperior(retorno);
        handleGraficoInferior(atributo, retorno);
        somaConsumo(retorno.dados);
        mediaConsumo(retorno.dados);
        console.log(retorno);
    }

    const handleGraficoSuperior = (retorno) => {
        let vetor = []
        vetor.push( [retorno.cabecalho[6], retorno.cabecalho[1]]);
        for(let i in retorno.dados)
            vetor.push( [retorno.dados[i][6], retorno.dados[i][1]]);
        vetor.sort((a,b)=>{return b[1] - a[1]});
        setDadosGraficoSuperior(vetor);
        console.log('handleGraficoSuperior ', vetor);
    }

    const handleGraficoInferior = (atributo, retorno) => {
        let vetor = []
        let u = 0;
        for(let i in retorno.cabecalho){
            if (retorno.cabecalho[i] === atributo)
                u = parseInt(i);
        }
        console.log(atributo);
        vetor.push( [retorno.cabecalho[6], 'Consumo / ' + atributo ]);
        for(let i in retorno.dados)
            vetor.push( [ retorno.dados[i][6], retorno.dados[i][3] / retorno.dados[i][u]]);
            vetor.sort((a,b)=>{return b[1] - a[1]});
        setDadosGraficoInferior(vetor);
        console.log('handleGraficoInferior ', vetor);
    }

 /*   const handleEditCidades = (e) => {
        console.log(e.target);
        setCidadesSelecionadas(e.target.value);
        
    }

    const handleEditInicio = (e) => {
        let ini = e.target.value;
        setInicio(ini);
        //getDados(ini, fim);
    }

    const handleEditFim = (e) => {
        let fi = e.target.value;
        setFim(e.target.value);
        //getDados(inicio, fi);
    }
   */ 
    const somaConsumo = (dados) => {
        let soma = 0;
        for(let i in dados){
            soma += dados[i][1];
        }
        setSoma(soma);
    }

    const mediaConsumo = (dados) => {
        let soma = 0;
        console.log('mediaConsumo: ', dados);
        for(let i in dados)
            soma += dados[i][1];
        
        if(soma > 0 && dados.length>0)
            setMedia(soma/dados.length);
        else
            setMedia(0);
    }
    
    const handleRefresh = () =>{
        getDados(filtros.inicio, filtros.fim, filtros.cidadesSelecionadas, empresaId);
    }

    const handleFilterOpen = () => {
        setOpenFilter(!openFilter);
    }

    const handleEditEmpresa = (valor) => {
        setEmpresaId(valor);
    }

    /*
    const handleEditMaioresConsumos = (e) =>{
        setMaioresConsumos(e.target.value);
    }

    const handleEditUc = (e) => {
        setUcsSelecionadas(e.target.value);
    }

    const handleEditMinArea = (e) =>{
        setMinArea(e.target.value);
    }

    const handleEditMaxArea = (e) =>{
        setMaxArea(e.target.value);
    }

    const handleEditMinFaturamento = (e) =>{

    } */

    const handleChangeFiltros = (e) => {
        setFiltros({...filtros,
            [e.target.name]: e.target.value}
        )
    }

    const GraficoSuperior = () => {
        return  <Chart id='graficoSuperior'
                    width='100%'
                    height='100%'
                    chartType="Bar"
                    loader={<div>Consultando informações</div>}
                    data={dadosGraficoSuperior}
                    options={{
                        // Material design options
                        chart: {
                            title: 'Maiores consumos',
                            subtitle: 'Unidades consumidoras',
                            backgroundColor: {
                                fill: 'red',
                                opacity: 0.1,
                             },
                        },
                        chartArea: {
                            backgroundColor: {
                                fill: 'red',
                                opacity: 0.1,
                             },
                         },
                         backgroundColor: {
                            fill: 'red',
                            opacity: 0.1,
                         },
                            
                        
                    }}
                    // For tests
                    rootProps={{ 'data-testid': '2' }}
                    
                    />
    }
    
    return (
        
        <Page pageTitle={intl.formatMessage({ id: `IndicadorComparativo` , defaultMessage: 'Comparativos'})}
                appBarContent = {
                    <Toolbar disableGutters>
                        {processando ? <CircularProgress /> : `` }
                                                
                        <RefreshIcon style={{"cursor":"pointer", "margin-right":"15px"}} onClick={handleRefresh} />
                        <FilterListIcon style={{"cursor":"pointer"}} onClick={handleFilterOpen}/>
                    </Toolbar>
                }
        >
            <Scrollbar
            style={{ height: '100%', width: '100%', display: 'flex', flex: 1 }}
            >
            <Container > 
                    <Grid container spacing={3} className={classes.container}>
                                                
                        <Grid item xs={12} sm={12}>
                            <Paper className={classes.paper} style={{'height':'450px'}}>
                                {dadosGraficoSuperior.length > 0 ? <GraficoSuperior /> : ``}
                            </Paper>
                        </Grid>
                        
                        <Grid item xs={12} sm={4}>
                            <Paper className={classes.paper} style={{'height':'150px'}}>
                                <h4>Numero de Ucs:</h4>
                                <p className={classes.p} >{dadosGraficoSuperior.length -1}</p>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Paper className={classes.paper} style={{'height':'150px'}}>
                                <h4>Consumo:</h4>
                                <p className={classes.p} >{soma.toFixed(0)} KWh</p>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Paper className={classes.paper} style={{'height':'150px'}}>
                                <h4>Média consumo:</h4>
                                <p className={classes.p} >{media.toFixed(0)} KWh</p>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Paper className={classes.paper} style={{'height':'300px'}}>
                                <FormGroup>
                                    <FormControlLabel
                                        control={<Switch id="area" size="small" checked={areaLojaMetrosQuadrados} onChange={toggleAreaLojaMetrosQuadrados} color="primary" />}
                                        label="Área"
                                    />
                                    <FormControlLabel
                                        control={<Switch size="small" checked={qtdeFuncionarios} onChange={toggleQtdeFuncionarios} color="primary" />}
                                        label="Funcionários"
                                    />
                                    <FormControlLabel
                                        control={<Switch size="small" checked={cargaInstalada} onChange={toggleCargaInstalada} color="primary" />}
                                        label="Potência"
                                    />
                                    <FormControlLabel
                                        control={<Switch size="small" checked={faturamento} onChange={toggleFaturamento} color="primary" />}
                                        label="Faturamento"
                                    />
                                    <FormControlLabel
                                        control={<Switch size="small" checked={cargaHorariaMensal} onChange={toggleCargaHorariaMensal} color="primary" />}
                                        label="Funcionamento"
                                    />
                                    <FormControlLabel
                                        control={<Switch size="small" checked={qtdeVendasMensal} onChange={toggleQtdeVendasMensal} color="primary" />}
                                        label="Atendimentos"
                                    />
                                </FormGroup>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={9}>
                            <Paper className={classes.paper} style={{'height':'300px'}}>
                                <Chart  id='graficoInferior'
                                    width='100%'
                                    height='100%'
                                    chartType="Bar"
                                    loader={<div>Consultando informações</div>}
                                    data={dadosGraficoInferior}
                                    color ={['primary']}
                                    options={{
                                        // Material design options
                                        chart: {
                                        title: 'Comparando consumo e atributos',
                                        subtitle: `${atributo} vs Consumo`,
                                        },
                                    }}
                                    // For tests
                                    rootProps={{ 'data-testid': '2' }}
                                />
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
                        <ListItem button key='cidade'>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="label-cidade">Cidade</InputLabel>
                                <Select
                                labelId="label-cidade"
                                id="select-cidade"
                                value={filtros.cidadesSelecionadas}
                                onChange={handleChangeFiltros}
                                name='cidadesSelecionadas'
                                style={{'width':'100%'}}
                                multiple
                                >
                                {cidades.map(c => ( <MenuItem key={c.nome+"_"+c.id} value={c.id}>{c.nome}</MenuItem>))}
                                </Select>
                            </FormControl>
                        </ListItem>
                        <ListItem button key='ucs'>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="label-ucs">UCs</InputLabel>
                                <Select
                                labelId="label-ucs"
                                id="select-id"
                                value={filtros.ucsSelecionadas}
                                onChange={handleChangeFiltros}
                                name='ucsSelecionadas' 
                                multiple
                                >
                                {ucs.map(u => (
                                    <MenuItem key={u.id} value={u.id}>{u.nome}</MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                        </ListItem>
                        <ListItem button key='area'>
                            <TextField className={classes.formControl} style={{'width':'49%', 'margin-right':'2%'}} id="minArea" type="number" label="Min Área" value={filtros.minArea}  name='minArea'  onChange={handleChangeFiltros}/>
                            <TextField className={classes.formControl} style={{'width':'49%'}} id="maxArea" type="number" label="Max Área" value={filtros.maxArea}  name='maxArea'  onChange={handleChangeFiltros}/>
                        </ListItem>
                        <ListItem button key='faturamento'>
                            <TextField className={classes.formControl} style={{'width':'49%', 'margin-right':'2%'}} id="minFaturamento" type="number" label="Min Fatura" title='Min Faturamento' value={filtros.minFaturamento}  name='minFaturamento'  onChange={handleChangeFiltros}/>
                            <TextField className={classes.formControl} style={{'width':'49%'}} id="maxFaturamento" type="number" label="Max Fatura" title='Max Faturamento' value={filtros.maxFaturamento}  name='maxFaturamento'  onChange={handleChangeFiltros}/>
                        </ListItem>
                        <ListItem button key='potencia'>
                            <TextField className={classes.formControl} style={{'width':'49%', 'margin-right':'2%'}} id="minPotencia" type="number" label="Min Potência" value={filtros.minPotencia}  name='minPotencia'  onChange={handleChangeFiltros}/>
                            <TextField className={classes.formControl} style={{'width':'49%'}} id="maxPotencia" type="number" label="Max Potência" value={filtros.maxPotencia}  name='maxPotencia'  onChange={handleChangeFiltros}/>
                        </ListItem>
                        <ListItem button key='MaioresValores'>
                            <TextField className={classes.formControl} id="maioresConsumos" type="number" label="Maiores Consumos" value={filtros.maioresConsumos} name='maioresConsumos' onChange={handleChangeFiltros}/>
                        </ListItem>
                    </List>
                <Divider />
                <List>
                    <ListItem button key='dt_1'>
                        <TextField
                            id="inicio"
                            label="Início"
                            type="month"
                            name='inicio'
                            defaultValue={filtros.inicio}
                            className={classes.textField}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            onChange={handleChangeFiltros}
                        />
                    </ListItem>
                    <ListItem button key='dt_2'>
                        <TextField
                            id="fim"
                            label="Fim"
                            type="month"
                            name='fim'
                            defaultValue={filtros.fim}
                            className={classes.textField}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            onChange={handleChangeFiltros}
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

export default IndicadoresComparativo;