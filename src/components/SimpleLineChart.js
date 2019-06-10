import React from 'react';
import ResponsiveContainer from 'recharts/lib/component/ResponsiveContainer';
import LineChart from 'recharts/lib/chart/LineChart';
import Line from 'recharts/lib/cartesian/Line';
import XAxis from 'recharts/lib/cartesian/XAxis';
import YAxis from 'recharts/lib/cartesian/YAxis';
import Tooltip from 'recharts/lib/component/Tooltip';
import { withTheme } from '@material-ui/core/styles';

const URL = "http://localhost:5000/weights/optimize"

const data = [

]

function SimpleLineChart(props) {
  const { theme, data } = props;
  return (
    <React.Fragment>
    <ResponsiveContainer width="99%" height={225}>
      <LineChart data={data}>
        <XAxis dataKey="name"/>
        <YAxis/>
        <Tooltip/>
        <Line dataKey="Portfolio Value" stroke={theme.palette.primary.main} />
      </LineChart>
    </ResponsiveContainer>
    </React.Fragment>
  );
}

export default withTheme((SimpleLineChart));