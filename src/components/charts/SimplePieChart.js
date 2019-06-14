import React, { Component } from 'react';
import { ResponsiveContainer, PieChart, Pie, Sector, Cell } from 'recharts';
import { withTheme } from '@material-ui/core/styles'

function SimplePieChart(props) {
    const { theme, data } = props;

    return (
      <ResponsiveContainer width="99%" height={400}>
      <PieChart>
        {/* <Pie data={data01} dataKey="value" cx={200} cy={200} outerRadius={60} fill="#8884d8" /> */}
        <Pie data={data} dataKey="weight" cx={200} cy={200} innerRadius={70} outerRadius={90} fill="#82ca9d" label />
      </PieChart>
      </ResponsiveContainer>   
    );
  }

export default withTheme((SimplePieChart));
