import React from 'react'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { withTheme } from '@material-ui/core/styles';

function SimpleLineChart(props) {
  const { theme, data } = props;

  return (          
  <ResponsiveContainer width="99%" height={450}>
  <LineChart data={data}
      margin={{ top: 10, right: 5, left: 5, bottom: 5 }}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis type="category" dataKey="date" interval="preserveStartEnd"/>
  <YAxis tickFormatter={(tick) => (100*tick).toFixed(2) + "%"} />
  <Tooltip />
  
  <Line type="monotone" dataKey="total_return" stroke="#8884d8" dot={false} />
  </LineChart>
  </ResponsiveContainer>
        )
    }

export default withTheme((SimpleLineChart));
