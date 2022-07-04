import React, {useState,useEffect} from 'react';
import ApiSage from '../../../services/ApiSage';

import { DataGrid } from '@material-ui/data-grid';

import Drawer from '@material-ui/core/Drawer';
import ListItem from '@material-ui/core/ListItem';
import FilterListIcon from '@material-ui/icons/FilterList';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import TextField from '@material-ui/core/TextField';
import { useIntl } from 'react-intl';
import download from 'downloadjs';

import { CircularProgress , Container, Button, Divider , Toolbar, Tooltip } from '@material-ui/core';
import Page from 'material-ui-shell/lib/containers/Page'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar/Scrollbar';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';

import SelectEmpresas from '../../../componentes/SelectEmpresas/SelectEmpresas.js';

import ExportCSV from '../../../componentes/ExportCSV/ExportCSV.js';

import Alerta from '../../../componentes/Alerta/Alerta.js';
import { YearSelection } from '@material-ui/pickers/views/Year/YearView';

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
        marginTop: '0px',
    }
  }));

const ExtratoFaturasMensal = () => {

    const classes = useStyles();
    const intl = useIntl()
    
    const theme = useTheme();

    const preFiltros = {
        anoMes: (new Date()).getFullYear() + '-' + ((new Date()).getMonth()+1 < 10 ? '0'+ ((new Date()).getMonth()+1) : ((new Date()).getMonth()+1) ) ,
        empresaId: ''
    }

    const [filtros, setFiltros] = useState(preFiltros);
    const [processando, setProcessando] = useState(false);
    const [openFilter, setOpenFilter] = useState(false);
    const [openAlerta, setOpenAlerta] = useState(false);
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([        
        { field: 'id',   headerName: 'id', width: 180 , hide: true},
        { field: 'dtVencimento', headerName: 'Data de vencimento', width: 230},
        { field: 'nome', headerName: 'UC', width: 200 },
        { field: 'nfe',  headerName: 'NFe', width: 350 },
        { field: 'cnpj', headerName: 'CNPJ', width: 300},
        { field: 'centroCusto', headerName: 'Centro Custo', width: 150},
        { field: 'valorUnitario', headerName: 'Valor Unitário (R$)', width: 250},
        { field: 'valorTotal', headerName: 'Valor total', width: 150, hide: true},
    ]);

    const getFaturasByEmpresaAndMes = () => {
        ApiSage.get(`fatura/findAllByEmpresaAndFaturamento?anoMes=${filtros.anoMes}&empresaId=${filtros.empresaId}`)
                .then((response) => {
                    retornoGetFaturasByEmpresaAndMes(response.data);
                }).catch((error) => {
                    let erro = error.response;
                    console.log('erro get getDadosUcEvolucao: ', erro);
                });
    }

    const retornoGetFaturasByEmpresaAndMes = (ucs) => {
        let rowsVector = [];
        for(let i in ucs){
            rowsVector.push({
                    id: ucs[i].id,
                    nome: ucs[i].nome ,
                    nfe: ucs[i].faturas[0].nfe,
                    cnpj: ucs[i].cnpj.cnpj,
                    centroCusto: ucs[i].centroCusto,
                    valorUnitario: ucs[i].faturas[0].valor,
                    dtVencimento: ucs[i].faturas[0].dataVencimento,
                    valorTotal: ucs[i].faturas[0].valor
            })
        }
        
        setRows(rowsVector);
        console.log("retornoGetFaturasByEmpresaAndMes", ucs, rowsVector);

    }

    const baixarPdf = (empresaId, ucId, ano, mes) => {
        ApiSage.get(`fatura/downloadFile/fatura_${empresaId}_${ucId}_${ano}_${mes}.pdf`, {responseType: 'blob'})
                .then( response => {
                    const content = response.headers['content-type'];
                    download(response.data, 'fatura', content);
                }).catch( (error) => {
                    console.log(error.response);
                });
    }


    const handleRefresh = () => {
        getFaturasByEmpresaAndMes();
    }

    const handleChange = (e) => {
        setFiltros({
            ...filtros,
            [e.target.name]: e.target.value,
        });
    }

    const handleSelectEmpresa = (e) => {
        setFiltros({
            ...filtros,
            empresaId: e,
        });
    }

    const handleSelecionarLinha = (e) => {
        console.log('handleSelecionarLinha', e);
        let dt = filtros.anoMes.split('-')
        baixarPdf(filtros.empresaId, e.data.id, dt[0], dt[1])
    }

    const handleFilterOpen = () => {
        setOpenFilter(!openFilter);
    }

    const exportarExcel = () => {
        console.log('download');
    }

    return (
        
        <Page 
            pageTitle={intl.formatMessage({ id: 'ExtratoFaturasMensal' , defaultMessage: 'Extrato das faturas mensal'})}
            appBarContent={
                <Toolbar disableGutters>
                    {processando ? <CircularProgress /> : `` }
                    <Tooltip title="Exportar Excel">
                        <IconButton aria-label="Excel" onClick={exportarExcel}>
                            <ExportCSV csvData={rows} fileName="Faturas_por_vencimento"></ExportCSV>

                        </IconButton>
                    </Tooltip>
                    <FilterListIcon style={{"cursor":"pointer"}} onClick={handleFilterOpen}/>
                </Toolbar>
            }
        >
            <Scrollbar style={{ height: '100%', width: '100%', display: 'flex', flex: 1 }} >
                
                <div style={{ margin: '15px', height: '85%'}}>
                    <DataGrid rows={rows} columns={columns} pageSize={15}  onRowSelected={handleSelecionarLinha}/>
                </div>

                <Container maxWidth="lg">  
                   
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
                                <SelectEmpresas onChange={handleSelectEmpresa} value={filtros.empresaId} />
                            </ListItem>
                        </List>
                    <Divider />
                    <List>
                        <ListItem button key='anoMes'>
                            <TextField
                                id="dataFaturamento"
                                label="Mês Faturamento"
                                type="month"
                                name='anoMes'
                                defaultValue={filtros.anoMes}
                                className={classes.textField}
                                InputLabelProps={{
                                shrink: true,
                                }}
                                onChange={handleChange}
                            />
                        </ListItem>
                    </List>  
                    <Divider />
                    <Button style={{'margin': '10px'}} variant="contained" color="primary" onClick={handleRefresh}>Consultar</Button>          
                </Drawer>          
            </Scrollbar>            
        </Page>
    )
}

export default ExtratoFaturasMensal;