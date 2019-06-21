import React,  { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter, Link } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/lab/Slider';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Loading from './common/Loading';
import Topbar from './Topbar';
import SimpleTable from './charts/SimpleTable';
import ComplexPieChart from './charts/ComplexPieChart';
import moment from 'moment';
import SimpleLineChart from './charts/SimpleLineChart';
import { CircularProgress } from '@material-ui/core';
import TextField from '@material-ui/core/TextField'

const numeral = require('numeral');
numeral.defaultFormat('0,000');

const backgroundShape = require('../images/shape.svg');

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey['100'],
    overflow: 'hidden',
    background: `url(${backgroundShape}) no-repeat`,
    backgroundSize: 'cover',
    backgroundPosition: '0 400px',
    paddingBottom: 200,
    marginTop: 20,
  },
  grid: {
    width: 1200,
    margin: `0 ${theme.spacing(2)}px`,
    [theme.breakpoints.down('sm')]: {
      width: 'calc(100% - 20px)'
    },
  },
  loadingState: {
    opacity: 0.05
  },  
  paper: {
    padding: theme.spacing(3),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    margin: theme.spacing(.25),
    flexGrow: 1,
  },
  rangeLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: theme.spacing(2)
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  outlinedButtom: {
    textTransform: 'uppercase',
    margin: theme.spacing.unit
  },
  actionButtom: {
    textTransform: 'uppercase',
    margin: theme.spacing.unit,
    width: 152,
    height: 36
  },
  blockCenter: {
    padding: theme.spacing(2),
    textAlign: 'center'
  },
  block: {
    padding: theme.spacing(2),
  },
  loanAvatar: {
    display: 'inline-block',
    verticalAlign: 'center',
    width: 16,
    height: 16,
    marginRight: 10,
    marginBottom: -2,
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main
  },
  interestAvatar: {
    display: 'inline-block',
    verticalAlign: 'center',
    width: 16,
    height: 16,
    marginRight: 10,
    marginBottom: -2,
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.light
  },
  inlining: {
    display: 'inline-block',
    marginRight: 10
  },
  buttonBar: {
    display: 'flex'
  },
  noBorder: {
    borderBottomStyle: 'hidden'
  },
  mainBadge: {
    textAlign: 'center',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4)
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  }});

const endpoint = 'http://0.0.0.0:5000/optimized/personal/holding'
const chart_endpoint = 'http://localhost:5000/allocated/chart'

class Dashboard_update extends Component {

  state = {
    refresh_weight: false,
    refresh_chart: false,
    loading_weight: true,
    loading_chart: true,
    amount: 5,
    data: [],
    holdings: [],
    StockTicker: "",
    ShareAmt: "",
    Date: ""};

  async updateTableValues() {
    const { amount, StockTicker } = this.state;
    let params = {'vol': Number(amount), 'ticker': StockTicker}
    const promise = fetch(endpoint, {
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(params),
        mode: 'cors',
        method: 'post'
    });
    
    await promise.then(blob=>blob.json()).then(json => this.setState({holdings: json[0].allocations, loading_weight: false}))
  }

  async updateChartValues() {
      await fetch(chart_endpoint).then(blob => blob.json()).then(json => {
      this.setState({data: json, loading_chart: false, refresh_chart: false})
    })

  }

  reformatData = (data) => {
    const copy = data
      let i = 0
      for (i in copy) {
        copy[i].date = moment(copy[i].date).format("MMM-YYYY")
      }
    return copy
  }

  reformatTable = (data) => {
      const copy = data
        for (let i in copy) {
            for (let key in copy[i]) {
                if ((copy[i][key] < 0.01)) {
                    copy.splice(i, 1)
                }
            }
        }
        console.log(copy)
      return copy
  }

  handleTextFieldChange = (event) => {
    this.setState({[event.target.id]: event.target.value });
    console.log(this.state.StockTicker)
  };

  // componentDidUpdate() {
  //   this.updateTableValues();
  //   this.updateChartValues(); 
  // }
  
  componentDidUpdate() {
    
  }

  handleChangeAmount = (event, value) => {
    this.setState({amount: value, refresh_chart: true, refresh_weight: true});
  }

  handleSubmit = (event) => {
    this.updateTableValues();
    this.updateChartValues();
  }

  render() {
    const { classes, rows } = this.props;
    const { amount, data, holdings, loading_chart, loading_weight } = this.state;
    const currentPath = this.props.location.pathname
    let dataFormatted = []
    let tableFormatted = []
    dataFormatted = this.reformatData(data)
    tableFormatted = this.reformatTable(holdings)

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={currentPath} />
        <div className={classes.root}>
          <Grid container justify="center" flexGrow="1">
            <Grid spacing={24} alignItems="center" justify="center" container className={classes.grid}>
              <Grid item xs={12}>
                <div className={classes.topBar}>
                  <div className={classes.block}>
                    <Typography variant="h6" gutterBottom>Most Stockowners are concentrated in the shares of their employer</Typography>
                    <Typography variant="body1">
                      Input your current stock holdings and your desired risk tolerance for a customized portfolio
                    </Typography>
                  </div>
                </div>
              </Grid>
              <Grid container alignItems="stretch" height="100%">
              <Grid item xs={12} md={4}>
                <Paper className={classes.paper}>
                    <Typography style={{textTransform: 'uppercase'}} color='secondary' gutterBottom>
                      Risk Tolerance
                    </Typography>
                  <div>
                    <Typography variant="subtitle1" gutterBottom>
                      How would you rate your level risk tolerance?
                    </Typography>
                    <Typography variant="body1">
                      Use slider to set your risk tolerance on a scale of 1-10 (10 = Highest level of risk tolerance)
                    </Typography>
                    <div className={classes.blockCenter}>
                      <Typography color='secondary' variant="h6" gutterBottom>
                        {numeral(amount).format()}
                      </Typography>
                    </div>
                    <div>
                      <Slider
                        value={amount}
                        min={1}
                        max={10}
                        step={1}
                        onChange={this.handleChangeAmount}
                      />
                    </div>
                    <div className={classes.rangeLabel}>
                      <div>
                        <Typography variant="subtitle2">
                          1 (lowest risk tolerance)
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="subtitle2">
                          10 (highest risk tolerance)
                        </Typography>
                      </div>
                    </div>
                  </div>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                  <Paper className={classes.paper} style={{position: 'relative'}}>
                  <Typography style={{textTransform: 'uppercase'}} color='secondary' gutterBottom>
                      Personal Holdings
                    </Typography>
                    <form className={classes.container} noValidate autoComplete="off">
                        <TextField
                          id="StockTicker"
                          label="Enter Stock Ticker"
                          className={classes.textField}
                          value={this.state.StockTicker}
                          onChange={this.handleTextFieldChange}
                          margin="normal"
                          variant="outlined"
                        />
                        <TextField
                          id="ShareAmt"
                          label="Number of Shares"
                          className={classes.textField}
                          value={this.state.ShareAmt}
                          onChange={this.handleTextFieldChange}
                          margin="normal"
                          variant="outlined"
                        />
                        <TextField
                          id="Date"
                          label="Holding Date"
                          type="date"
                          value={this.state.Date}
                          defaultValue="2021-01-31"
                          onChange={this.handleTextFieldChange}
                          className={classes.textField}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                    <div>
                    <Button variant="outlined" className={classes.outlinedButtom} onClick={() => this.handleSubmit()}>
                      Submit
                    </Button>
                  </div>
                  </form>
                  </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper className={classes.paper} style={{position: 'relative'}}>
                
                <div className={classes.box}>
                    <Typography style={{textTransform: 'uppercase'}} color='secondary' gutterBottom>
                      Portfolio Allocation
                    </Typography>
                </div>
                      {/* <CircularProgress >  */}
                      <div className={loading_weight ? classes.loadingState : ''}>
                    <ComplexPieChart data={holdings}/>
                    </div>
                </Paper>
              </Grid> 
              </Grid>
              <Grid container spacing={24} justify="center">
              <Grid item xs={12} md={4}>
              <Paper className={classes.paper} style={{position: 'relative'}}>
                  <Typography style={{textTransform: 'uppercase'}} color='secondary' gutterBottom>
                      Portfolio Allocation
                    </Typography>
                        <SimpleTable rows={tableFormatted} />
                  </Paper>
              </Grid>
                <Grid item xs={12} md={8}>
                  <Paper className={classes.paper} style={{position: 'relative'}}>
                  <Typography style={{textTransform: 'uppercase'}} color='secondary' gutterBottom>
                      Portfolio Historical Performance
                    </Typography>
                        <SimpleLineChart data={dataFormatted} />
                  </Paper>
              </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    )
  }
}

export default withRouter(withStyles(styles)(Dashboard_update));
