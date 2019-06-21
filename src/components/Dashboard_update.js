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
  }
});

const endpoint = 'http://0.0.0.0:5000/faster/optimized/weights'
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
  };

  async updateTableValues() {
    const { amount } = this.state;
    let params = {'vol': Number(amount)}
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

  shouldComponentUpdate(nextState) {
    return nextState.holdings !== this.state.holdings || nextState.data !== this.state.data
  }

  reformatData = (data) => {
    const copy = data
      let i = 0
      for (i in copy) {
        delete copy[i].daily_return
        copy[i].date = moment(copy[i].date).format("MMM-YYYY")
      }
    return copy
  }

  reformatTable = (data) => {
      const copy = data
        for (let i in copy) {
            for (let key in copy[i]) {
                console.log(copy[i][key])
                if ((copy[i][key] < 0.01)) {
                    copy.splice(i,1)
                }
            }
        }
        console.log(copy)
      return copy
  }

  // componentDidUpdate() {
  //   this.updateTableValues();
  //   this.updateChartValues(); 
  // }
  
  componentDidMount() {
    this.updateChartValues();
    this.updateTableValues();
  }

  componentDidUpdate() {
  }

  handleChangeAmount = (event, value) => {
    this.setState({amount: value, refresh_chart: true, refresh_weight: true});
    this.updateTableValues();
  }

  render() {
    const { classes, rows } = this.props;
    const { amount, data, holdings, loading_chart, loading_weight } = this.state;
    const currentPath = this.props.location.pathname
    let dataFormatted = []
    let tableFormatted = []

    dataFormatted = this.reformatData(data)
    tableFormatted = this.reformatTable(holdings)
    console.log(tableFormatted)
    console.log(holdings)

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={currentPath} />
        <div className={classes.root}>
          <Grid container justify="center" flexGrow="1">
            <Grid spacing={24} alignItems="center" justify="center" container className={classes.grid}>
              {/* <Grid item xs={12}>
                <div className={classes.topBar}>
                  <div className={classes.block}>
                    <Typography variant="h6" gutterBottom>Dashboard_update</Typography>
                    <Typography variant="body1">
                      Adjust and play with our sliders.
                    </Typography>
                  </div>
                  <div>
                    <Button variant="outlined" className={classes.outlinedButtom}>
                      Get help
                    </Button>
                  </div>
                </div>
              </Grid> */}
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
              <Grid item xs={12} md={4}>
                  <Paper className={classes.paper} style={{position: 'relative'}}>
                  <Typography style={{textTransform: 'uppercase'}} color='secondary' gutterBottom>
                      Portfolio Allocation
                    </Typography>
                        <SimpleTable rows={tableFormatted} />
                  </Paper>
              </Grid>
              </Grid>
              <Grid container spacing={24} justify="center">
                <Grid item xs={12}>
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
