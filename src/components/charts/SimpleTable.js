import React from 'react';
import { withTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 300,
  },
}))

const numeral = require('numeral');
numeral.defaultFormat('0.0%');

function SimpleTable(props) {
  const { theme, rows } = props;
  const classes = useStyles();
  
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Ticker</TableCell>
            <TableCell align="right">% Allocation</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => 
             (
            <TableRow key={row.ticker}>
              <TableCell component="th" scope="row">
                {row.ticker}
              </TableCell>
              <TableCell key={row.weight} align="right">{numeral(row.weight).format('0.0%')}</TableCell>
            </TableRow> 
             ))}
             
        </TableBody>
      </Table>
    </Paper>
  );
}

export default withTheme((SimpleTable));