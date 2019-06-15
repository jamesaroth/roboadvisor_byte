import React, { Component } from 'react'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { withTheme } from '@material-ui/core/styles';
import moment from 'moment'

function SimpleLineChart(props) {
  const { theme, data } = props;

  return (          
  <ResponsiveContainer width="99%" height={300}>
  <LineChart data={data}
  margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis type="category" dataKey="date" interval="preserveStartEnd"/>
  <YAxis tickFormatter={(tick) => 100 * tick + "%"} />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="total_return" stroke="#8884d8" dot={false} />
  </LineChart>
  </ResponsiveContainer>
        )
    }

export default withTheme((SimpleLineChart));
