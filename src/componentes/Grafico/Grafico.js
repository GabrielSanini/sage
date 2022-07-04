
import React, {useState, useEffect} from 'react';
import Chart from "react-google-charts";
import { Button } from '@material-ui/core';

const Grafico = (props) => {

  const [titulo, setTitulo] = useState('');
  const [google, setGoogle] = useState('');
  const [chartEditor, setChartEditor] = useState('');
  const [chartWrapper, setChartWrapper] = useState('');
  const [dados, setDados] = useState(props.dados);
  

  const dialogo = () =>{
    console.log('dados');   
    if (
      chartWrapper === '' ||
      google === '' ||
      chartEditor === ''
    )
      return
        chartEditor.openDialog(chartWrapper);
        const div = document.querySelector('.google-visualization-charteditor-dialog');
        div.classList.remove('google-visualization-charteditor-dialog');

        google.visualization.events.addListener(chartEditor, 'ok', () => {
          const newChartWrapper = chartEditor.getChartWrapper()
          newChartWrapper.draw()
          const newChartOptions = newChartWrapper.getOptions()
          const newChartType = newChartWrapper.getChartType()
          console.log('Chart type changed to ', newChartType)
          console.log('Chart options changed to ', newChartOptions)
        })
  }

  return (
    <div >
      <Chart
        height={'334px'}
        chartType="ScatterChart"
        loader={<div>Carregando...</div>}
        data={props.dados}
        options={{
          title: titulo,
          hAxis: { title: '', minValue: 0, maxValue: 15 },
          vAxis: { title: '', minValue: 0, maxValue: 15 },
          legend: 'none',
        }}
        rootProps={{ 'data-testid': '1' }}
        getChartEditor={({ chartEditor, chartWrapper, google }) => {
          setGoogle(google);
          setChartEditor(chartEditor);
          setChartWrapper(chartWrapper);
        }}
        chartPackages={['corechart', 'controls', 'charteditor']}
      />
      <Button variant="outlined" onClick={(e) => dialogo(e)}>Editar dados</Button>
    </div>
  )


}

export default Grafico;

    

