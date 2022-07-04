import React from 'react'
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions';

import TrackChanges from '@material-ui/icons/TrackChanges'
import FileCopy from '@material-ui/icons/FileCopy'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';

import analise from '../../imagens/analise.jpg';
import telaMonitor from '../../imagens/tela-monitor.png';
import bigData from '../../imagens/big-data.png'
import planilha from '../../imagens/planilha.png';
import engrenagem from '../../imagens/engrenagem.png';
import user from '../../imagens/user.png';
import linkedin from '../../imagens/linkedin.png';


const PackageCard = ({ title, command, description, icons, minTamanhoCabecalho }) => {

  return (
    <Card elevation={4} style={{ margin: 18, maxWidth: 350 }}>
      <CardContent>
        <Typography gutterBottom variant="h4" component="h2" height={minTamanhoCabecalho}>
          {title}
        </Typography>
        {command != '' ? (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              backgroundColor: '#F3F4F4',
                              padding: 8,
                            }}
                          >
                            <Typography
                                                gutterBottom
                                                variant="body1"
                                                color="textSecondary"
                                                component="h2"
                                              >
                                                {command}
                                              </Typography>
                            <IconButton
                              aria-label="Icon button"
                              onClick={() => {
                                if (window.clipboardData) {
                                  // Internet Explorer
                                  window.clipboardData.setData('Text', command)
                                } else {
                                  try {
                                    navigator.clipboard.writeText(command)
                                  } catch (error) {}
                                }
                              }}
                            >
                              <FileCopy />
                            </IconButton>
                          </div>
                          ) 
          : ``} 

        <br />
        {icons}
        <br />
        <Typography variant="body2" component="div">
          {description}
        </Typography>
      </CardContent>
    </Card>
  )
}

const PageContent = ({ setComponents }) => {
  return (
    <React.Fragment>
      <div style={{ height: 20 }} />
      <Typography
        variant="h3"
        //color="textSecondary"
        style={{ margin: 16, textAlign: 'center' }}
      >
        A empresa
      </Typography>
      <Grid container >
        <Grid item xs={0} sm={2}>

        </Grid>
        <Grid item xs={12} sm={4}>
            <Typography
            variant="h5"
            component="div"
            color="textSecondary"
            style={{ margin: 16, textAlign: 'justify' }}
            >
              Somos uma <strong>Startup</strong> criada com o objetivo de mudar o jeito como o <strong>gerenciamento</strong> de faturas de energia elétrica é feito,
              afinal, só conseguimos enxergar <strong>novas oportunidades</strong> ao executarmos um gerenciamento eficiente e inteligente.
            </Typography>
        </Grid>
        <Grid item xs={0} sm={1}>

        </Grid>
        <Grid item xs={12} sm={3}>
            <img src={analise} style={{width:'100%', height: '100%'}}/>
        </Grid>
        <Grid item xs={0} sm={2}>

        </Grid>
      </Grid>
      
      <div style={{ height: 30 }} />

      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'space-around',
          flexWrap: 'wrap',
        }}
      >
        <PackageCard
          title={'Monitoramento Sistêmico'}
          command=''
          description={
            'Monitore suas unidades de forma sistêmica, com verificação de desvios e emissão de alertas automáticos.'
          }
          icons={
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-around',
              }}
            >
              <img
                src={telaMonitor}
                alt="react"
                style={{ width: 50, aspectRatio: 1.11 }}
              />
            </div>
          }
          minTamanhoCabecalho ={82}
        />

        <PackageCard
          title={'Volume de Dados'}
          command={''}
          description={
            'Sem limites de unidades cadastradas e com abrangência nacional, cobrindo distribuidoras e permissionárias.'
          }
          icons={
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-around',
              }}
            >
              <img
                src={bigData}
                alt="react"
                style={{ width: 50, aspectRatio: 1.11 }}
              />
            </div>
          }
          minTamanhoCabecalho ={82}
        />
        <PackageCard
          title={'Análise Estruturada'}
          command={''}
          description={'Implemente novos indicadores e mapeie novas oportunidades, de forma automática'}
          icons={
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-around',
              }}
            >
              <img
                src={planilha}
                alt="react"
                style={{ width: 50, aspectRatio: 1.11 }}
              />
            </div>
          }
          minTamanhoCabecalho ={82}
        />
        <PackageCard
          title={'Integração Operacional'}
          command={''}
          description={'Extração de dados automatizada, com possível integração ao seu ERP.'}
          icons={
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-around',
              }}
            >
              <img
                src={engrenagem}
                alt="react"
                style={{ width: 50, aspectRatio: 1.11 }}
              />
            </div>
          }
          minTamanhoCabecalho ={82}
        />
      </div>
      <div style={{ height: 30 }} />
      <div
        ref={(r) => {
          if (r) {
            setComponents(r)
          }
        }}
        style={{
          //height: 400,
          backgroundColor: '#00a7e4',
          backgroundImage: 'radial-gradient( #00a7e4)',
        }}
      >
        <div style={{ height: 30 }} />
        <Typography
          variant="h3"
          //color="textSecondary"
          style={{ margin: 16, textAlign: 'center', color: 'white' }}
        >
          Quem faz a SAGE?
        </Typography>
        <Grid container>
            <Grid  item xs={12} sm={6}>
              <Grid container>
                <Grid item xs={12} sm={6} >
                  <Card style={{ margin: 10, minHeight: 150}}>
                    <CardActionArea>
                      {
                       // <img src={user} height={50}/>
                      }
                      
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                          Affonso Ribeiro
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                          Engenheiro de Energia
                          
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions>
                      <img src={linkedin} height={20}/>
                    </CardActions>
                  </Card>
              
                </Grid>
                <Grid item xs={12} sm={6} >
                  <Card style={{ margin: 10, minHeight: 150}}>
                    <CardActionArea>
                      {
                       // <img src={user} height={50}/>
                      }
                      
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                          Julio Schenato Fonini
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                          MSc Engenharia de Produção
                          <br/>
                          Desenvolvedor de Software

                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions>
                      <img src={linkedin} height={20}/>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} >
                  <Card style={{ margin: 10, minHeight: 150}}>
                    <CardActionArea>
                      {
                       // <img src={user} height={50}/>
                      }
                      
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                          Maicon Ramos
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                          Dr Engenharia Elétrica
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions>
                      <img src={linkedin} height={20}/>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} >
                  <Card style={{ margin: 10, minHeight: 150}}>
                    <CardActionArea>
                      {
                       // <img src={user} height={50}/>
                      }
                      
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                          Mariana Resener
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                          Dra Engenharia Elétrica
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions>
                      <img src={linkedin} height={20}/>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
            <Grid  item xs={12} sm={6}>
              <Typography
              variant="h5"
              component="div"
              color="textSecondary"
              style={{ margin: 16, textAlign: 'justify' }}
              >
                Nossa equipe é formada por engenheiros e pesquisadores de duas das
                melhores universidades do Rio Grande do Sul (UFRGS e UNISINOS). Com
                mais de uma década de experiência em análises do setor energético em 
                grandes empresas de distribuição de energia do Brasil,
                enxergamos na SAGE uma ferramenta capaz de aumentar a eficiência
                da gestão energética empresarial, utilizando tecnologia e inteligência.
              </Typography>
            </Grid>
        </Grid>
      </div>

      <div style={{ height: 30 }} />
      <Typography
        variant="h3"
        //color="textSecondary"
        style={{ margin: 16, textAlign: 'center' }}
      >
        Entre em contato
      </Typography>
      <Typography
        variant="h5"
        component="div"
        color="textSecondary"
        style={{ margin: 16, textAlign: 'center' }}
      >
        Para maiores informações entre em contato com nossos consultores:
      </Typography>
      {//<div style={{ height: 30 }} />
      }
      
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
        }}
      >
        {//<img src={linkedin} alt="react" style={{ width: 40 }} />
        }
      </div>
      <Grid container>
          <Grid item xs={0} sm={4} ></Grid>
          <Grid item xs={12} sm={4} >
            <Typography
              variant="h6"
              component="div"
              color="textSecondary"
              style={{ margin: 20, textAlign: 'left' }}
            >
              E-mail: <strong>comercial@sageiot.com.br</strong>
              <br/>
              Fone: <strong>51 996151072</strong>
              <br/>
              Av. Osvaldo Aranha, 103 206 B- Bom Fim
              <br/>
              Porto Alegre/RS
              <br/>
              CEP: 90220-011
            </Typography>
          </Grid>
          <Grid item xs={0} sm={4} ></Grid>
      </Grid>
     
      <div style={{ height: 30 }} />
      
    </React.Fragment>
  )
}

export default PageContent
