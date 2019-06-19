import React, { Component } from 'react';
import { PieChart, Pie, Sector } from 'recharts';
import ResponsiveContainer from 'recharts/lib/component/ResponsiveContainer';
import { withTheme } from '@material-ui/styles';

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={-5} textAnchor="middle" fill={fill}>Stocks 90%</text>
      <text x={cx} y={cy} dy={20} textAnchor="middle" fill={fill}>Bonds 10%</text>
    
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill} />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill} />
      
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{payload.ticker}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    </g>
  );
};

class ComplexPieChart extends Component {
  constructor(props) {
  super(props)
  this.state = {
    activeIndex: 0,
    activeShape: null,
  };
}
  
  onPieEnter = (data, index) => {
    this.setState({
      activeIndex: index,
    });
  };

  onPieLeave = (data, index) => {
    this.setState({
        activeIndex: null,
        activeShape: null,
      });
  }

  render() {
    const { theme, data } = this.props
    const { activeIndex, activeShape } = this.state;
    
    return (
      <ResponsiveContainer width="99%" height={220}>
      <PieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={data}
          cx="50%"
          cy="50%"
          innerRadius="50%"
          outerRadius="60%"
          // cx={200}
          // cy={200}
          // innerRadius={60}
          // outerRadius={80}
          fill={theme.palette.primary.main}
          // "#8884d8"
          dataKey="weight"
          onMouseEnter={this.onPieEnter} />
          {/* onMouseLeave={this.onPieLeave} */}
      </PieChart>
      </ResponsiveContainer>
    );
  }
}

export default withTheme((ComplexPieChart));