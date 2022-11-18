
import React, {useState, useEffect} from 'react';
import ApiSage from '../../services/ApiSage'


import { CircularProgress , Container, Grid, Button, Divider , Toolbar, Paper,InputLabel,Select, MenuItem  } from '@material-ui/core';
import Page from 'material-ui-shell/lib/containers/Page'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar/Scrollbar'
import TextField from '@material-ui/core/TextField';
import { useIntl } from 'react-intl'
import Chart from "react-google-charts";
import { blue, red } from '@material-ui/core/colors';
import RefreshIcon from '@material-ui/icons/Refresh';
import FilterListIcon from '@material-ui/icons/FilterList';
import Drawer from '@material-ui/core/Drawer';
import Grafico from '../../componentes/Grafico/Grafico.js';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import View from 'componentes/View/View';

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

const WindowConstrutor = () => {

  useEffect(()=>{
    getWindows();
  }, [])

  const getWindows= () => {
    ApiSage.get(`window/getWindows`)
            .then((response) => {
              setWindows(response.data);
            }).catch((error) => {
                let erro = error.response;
                console.log('erro window/getWindows: ', erro);
            });

}



  const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  

    const classes = useStyles();
    const intl = useIntl()
    const theme = useTheme();

    const [windows, setWindows] = useState([]);

    const handleFilterOpen = () => {

    }

    const handleRefresh = () => {

    }

    const [value, setValue] = useState(0);

    const handleChangeTabs = (event, newValue) => {
      setValue(newValue);
    };


    const a11yProps = (index) => {
      return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
      };
    }


    const [openFilter, setOpenFilter] = useState(false);
    const [processando, setProcessando] = useState(false);

      return (
        
        <Page pageTitle={intl.formatMessage({ id: `IndicadorComparativo` , defaultMessage: 'Criar View'})}
                appBarContent = {
                    <Toolbar disableGutters>
                        {processando ? <CircularProgress /> : `` }
                                                
                     {//   <RefreshIcon style={{"cursor":"pointer", "margin-right":"15px"}} onClick={handleRefresh} />
                       // <FilterListIcon style={{"cursor":"pointer"}} onClick={handleFilterOpen}/>
                     }
                    </Toolbar>
                }
        >
            <Scrollbar
            style={{ height: '100%', width: '100%', display: 'flex', flex: 1 }}
            >

              <Box sx={{ width: '100%' }}>
                <Box sx={{ maxWidth: 480, bgcolor: 'background.paper' }}>
                  <Tabs
                    value={value}
                    onChange={handleChangeTabs}
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                    aria-label="scrollable force tabs example"
                  >
                    <Tab label="View"  {...a11yProps(0)} />
                    <Tab label="Window" {...a11yProps(1)}/>
                  </Tabs>
                </Box>

                <TabPanel value={value} index={0} >
                    <View id={1} grafico = {''} filtros={[]} consultaSql={''} />
                </TabPanel>
                <TabPanel value={value} index={1} >
                  
                </TabPanel>
              </Box>    
        </Scrollbar>            
    </Page>
    )


    
}


export default WindowConstrutor;