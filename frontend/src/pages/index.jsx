import React, { Component } from 'react';
import { Api, Rpc, SignatureProvider } from 'eosjs2'; // https://github.com/EOSIO/eosjs2

// material-ui dependencies
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

// eosio endpoint
const endpoint = "http://127.0.0.1:8888";



// set up styling classes using material-ui "withStyles"
const styles = theme => ({
  card: {
    margin: 20,
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  formButton: {
    marginTop: theme.spacing.unit,
    width: "100%",
  },
  pre: {
    background: "#ccc",
    padding: 10,
    marginBottom: 0.
  },
});

// Index component
class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      hbTable: [] // to store the table rows from smart contract
    };
  }

  
  
  getTable() {
    const rpc = new Rpc.JsonRpc(endpoint);
    rpc.get_table_rows({
      "json": true,
      "code": "heartbeatacc",   // contract who owns the table
      "scope": "heartbeatacc",  // scope of the table
      "table": "hbstruct",    // name of the table as specified by the contract abi
      "limit": 100,
    }).then(result => this.setState({ hbTable: result.rows }));
  }

  componentDidMount() {
    this.getTable();
  }

  render() {
    const { hbTable } = this.state;
    const { classes } = this.props;

    // generate each note as a card
    const generateCard = (key, timestamp, user, data) => {
      var cardData = JSON.parse(data);
      if(!cardData.server_version)
        return (<span/>);
        
      return  (
      <Card className={classes.card} key={key}>
        <CardContent>
          <Typography variant="headline" component="h2">
            {user}
          </Typography>
          <Typography style={{fontSize:12}} color="textSecondary" gutterBottom>
            {new Date(timestamp*1000).toString()}
          </Typography>
          <Typography component="pre">
            <table>
              <tbody>
                
                  {Object.keys(cardData).map(key=>{
                    return <tr><td>{key}:</td> <td>{cardData[key]}</td> </tr>
                  })}
                  
                
              </tbody>
            </table>
            
          </Typography>
        </CardContent>
      </Card>
    )};
    let noteCards = hbTable.map((row, i) =>
      generateCard(i, row.timestamp, row.user, row.metadata_json));
    return (
      <div>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="title" color="inherit">
              BP Heartbeat Viewer
            </Typography>
          </Toolbar>
        </AppBar>
        {noteCards}
      </div>
    );
  }

}

export default withStyles(styles)(Index);
