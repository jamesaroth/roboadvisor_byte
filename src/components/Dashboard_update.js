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
import SimpleBarChart from './charts/SimpleBarChart';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import Loading from './common/Loading';
import Topbar from './Topbar';
import SimpleTable from './charts/SimpleTable';
import ComplexPieChart from './charts/ComplexPieChart';
import moment from 'moment';

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
    paddingBottom: 200
  },
  grid: {
    width: 1200,
    margin: `0 ${theme.spacing.unit * 2}px`,
    [theme.breakpoints.down('sm')]: {
      width: 'calc(100% - 20px)'
    }
  },
  loadingState: {
    opacity: 0.05
  },
  paper: {
    padding: theme.spacing.unit * 3,
    textAlign: 'left',
    color: theme.palette.text.secondary
  },
  rangeLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.unit * 2
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
    padding: theme.spacing.unit * 2,
    textAlign: 'center'
  },
  block: {
    padding: theme.spacing.unit * 2,
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
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4
  },
  charts: {
    textAlign: 'center'
  }
});

const endpoint = 'http://0.0.0.0:5000/weights/optimize'
const chart_endpoint = 'http://localhost:5000/allocated/chart'

class Dashboard_update extends Component {

  state = {
    loading: true,
    amount: 5,
    // period: 3,
    // start: 0,
    // monthlyInterest: 0,
    // totalInterest: 0,
    // monthlyPayment: 0,
    // totalPayment: 0,
    data: [],
    holdings: [],
  };

  updateTableValues() {
    const { amount } = this.state;
    let params = {'vol': Number(amount)}
    const promise = fetch(endpoint, {
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(params),
        mode: 'cors',
        method: 'post'
    });
    
    promise.then(blob=>blob.json())
    .then(json => this.setState({holdings: json[0].allocations}))
  }

  updateChartValues() {
    fetch(chart_endpoint).then(blob => blob.json()).then(json => {
      this.setState({data: json})
    })
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

  componentDidMount() {
    this.updateTableValues();
    this.updateChartValues(); 
  }

  handleChangeAmount = (event, value) => {
    this.setState({amount: value, loading: false});
    this.updateTableValues();
  }

  render() {
    const { classes, rows } = this.props;
    const { amount, data, holdings, loading } = this.state;
    const currentPath = this.props.location.pathname
    let dataFormatted = []
    dataFormatted = this.reformatData(data)

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={currentPath} />
        <div className={classes.root}>
          <Grid container justify="center">
            <Grid spacing={24} alignItems="center" justify="center" container className={classes.grid}>
              <Grid item xs={12}>
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
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper className={classes.paper}>
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
              <Grid item xs={12} md={8}>
                <Paper className={classes.paper} style={{position: 'relative'}}>
                <div className={classes.box}>
                    <Typography style={{textTransform: 'uppercase'}} color='secondary' gutterBottom>
                      Portfolio Allocation
                    </Typography>
                    {/* <Typography variant="body2" gutterBottom>
                      A first title style <br/> with two lines
                    </Typography> */}
                </div>
                <Loading loading={loading} />
                    <div className={loading ? classes.loadingState : ''}>
                      
                      <Loading loading={loading} />
                      <div className={loading ? classes.loadingState : ''}>
                {/* <div className={classes.blockCenter}> */}
                    <ComplexPieChart data={holdings}/>
                    {/* </div> */}
                    </div>
                    </div>
                </Paper>
              </Grid> 
              <Grid container spacing={24} justify="center">
                <Grid item xs={12}>
                  <Paper className={classes.paper} style={{position: 'relative'}}>
                  <Typography style={{textTransform: 'uppercase'}} color='secondary' gutterBottom>
                      Portfolio Allocation
                    </Typography>
                    <Loading loading={loading} />
                    <div className={loading ? classes.loadingState : ''}>
                      
                      <Loading loading={loading} />
                      <div className={loading ? classes.loadingState : ''}>
                        <SimpleTable rows={holdings} />
                      </div>
                    </div>
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
