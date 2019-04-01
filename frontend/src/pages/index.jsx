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
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { Responsive, WidthProvider } from "react-grid-layout";
import './index.css'
const ResponsiveReactGridLayout = WidthProvider(Responsive);

// eosio endpoint
var debug = false;
var endpoint = "http://127.0.0.1:8888";
if(debug)
  endpoint = "http://127.0.0.1:8888";

if(window.location.host ==  "heartbeat.liquideos.com"){
  endpoint = "http://api.eosrio.io";
}

if(window.location.host ==  "jungle-heartbeat.liquideos.com"){
  endpoint = "http://dev.cryptolions.io:38888";
}


const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

// set up styling classes using material-ui "withStyles"
const styles = theme => ({
  card: {
    margin: 5,
    maxWidth: "600px"
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
    background: "#eee",
    padding: 4,
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

  componentDidMount() {
    this.getTable();
  }

  generateLayout(cards) {
    return cards.map(function(item, i) {
      const y = 4;
      return {
        x: (i * 2) % 12,
        y: Math.floor(i / 6) * y,
        w: 2,
        h: y,
        i: i.toString()
      };
    });
  }

  
  getTable() {
    if(debug){
      var testData = [
        {"user":"eosliquideos","metadata_json":"{\"server_version\":\"a228b1dc\",\"actor_blacklist_hash\":\"00000000\",\"head_block_num\":23797,\"test1\":1,\"test1a\":1,\"test1b\":1,\"test1c\":1,\"test1\":2,\"test3\":1,\"test1\":4}","timestamp":1535710409},
        {"user":"starteosiobp","metadata_json":"{\"server_version\":\"a228b1dc\",\"actor_blacklist_hash\":\"00000000\",\"head_block_num\":23797}","timestamp":1535710409},
        {"user":"eos42freedom","metadata_json":"{\"server_version\":\"a228b1dc\",\"actor_blacklist_hash\":\"00000000\",\"head_block_num\":23797}","timestamp":1535710409},
        {"user":"eosnewyorkio","metadata_json":"{\"server_version\":\"a228b1dc\",\"actor_blacklist_hash\":\"00000000\",\"head_block_num\":23797,\"test1\":1,\"test1\":2,\"test3\":1,\"test1\":4}","timestamp":1535710409},
        {"user":"eosfishrocks","metadata_json":"{\"server_version\":\"a228b1dc\",\"actor_blacklist_hash\":\"00000000\",\"head_block_num\":23797}","timestamp":1535710409},
        {"user":"zbeosbp11111","metadata_json":"{\"server_version\":\"a228b1dc\",\"actor_blacklist_hash\":\"00000000\",\"head_block_num\":23797}","timestamp":1535710409},
        {"user":"eoshuobipool","metadata_json":"{\"server_version\":\"a228b1dc\",\"actor_blacklist_hash\":\"00000000\",\"head_block_num\":23797}","timestamp":1535710409},
        {"user":"jedaaaaaaaaa","metadata_json":"{\"server_version\":\"a228b1dc\",\"actor_blacklist_hash\":\"00000000\",\"head_block_num\":23797}","timestamp":1535710409},
      ];
      for (var i = 0; i < 50; i++) {
        testData.push({"user":"eostestbp" + i,"metadata_json":"{\"server_version\":\"a228b1dc\",\"actor_blacklist_hash\":\"00000000\",\"head_block_num\":23797}","timestamp":1535710409});
      }
      this.setState({ hbTable:testData
      });
      return;
    }
    const rpc = new Rpc.JsonRpc(endpoint);
    rpc.get_table_rows({
      "json": true,
      "code": "eosheartbeat",   // contract who owns the table
      "scope": "eosheartbeat",  // scope of the table
      "table": "hbstruct",    // name of the table as specified by the contract abi
      "limit": 444
    }).then(result =>{
      console.log(result.rows)
      this.setState({ hbTable: result.rows })
    });
  }

  render() {
    let { hbTable } = this.state;
    const { classes } = this.props;

    // generate each note as a card
    const generateCard = (key, timestamp, user, data) => {
      let cardData
      try {
        cardData = JSON.parse(data);
      } catch (error) {
        console.log(error)
        return false
      }
      let minH = Math.floor(Object.keys(cardData).length / 2) + 2;
      if(!cardData.version)
        return (<span/>);
        
      return  (
      <Card className={classes.card} key={key} data-grid={{ w: 2, h: minH, x: (key * 2) % 6, y: Math.floor(key / 3)}}>
        <CardContent  style={{padding:5}}>
          <Typography variant="headline" style={{fontSize:18, color: "#ddf" }} component="h2">
            {user}
          </Typography>
          <Typography style={{fontSize:7}} color="default" gutterBottom>
            {new Date(timestamp*1000).toString()}
          </Typography>
          
            <table>
              <tbody>
                
                  {Object.keys(cardData).map(key=>{
                    let item;
                    if(typeof(cardData[key]) === 'object'){
                      item = Object.keys(cardData[key]).map(i => {
                        return `${i}: ${cardData[key][i]} `
                      })
                    } else {
                      item = cardData[key]
                    }
                    return (
                      <tr>
                        <td>
                          <Typography style={{fontSize:10}}  color="textSecondary" component="pre">
                          {key}:
                          </Typography>
                          </td> <td>
                          <Typography style={{fontSize:10}}  color="textPrimary" component="pre">
                          {item}
                          </Typography>
                        </td> 
                      </tr>
                    )
                  })}
                  
                
              </tbody>
            </table>
            
          
        </CardContent>
      </Card>
    )};
    
    // if(debug && hbTable.length){
    //   var temp = [];
    //   for (var i = 0; i < 100; i++) {
    //     temp.push(hbTable[0]);
    //   }
    //   hbTable = temp;
    // } 
    hbTable = hbTable.filter(i => {
      try {
        JSON.parse(i.metadata_json)
        return true
      } catch (error) {
        console.log(error)
        return false
      }
    })
    let cards = hbTable.map((row, i) =>
      generateCard(i, row.timestamp, row.user, row.metadata_json));

    return (
      <MuiThemeProvider theme={theme}>
        <div style={{background: "#0f0f0f", height: "100%", width: "100%"}}>
          <AppBar position="static" style={{background: "#000"}} >
            <Toolbar>
              <div style={{"display": "flex", "alignItems":"center"}} >
                <img src="eos-logo.png" width="32" height="32"/> 
                <img src="heartbeat.png" width="32" height="32"/>
                <Typography variant="title" color="inherit">
                  <div style={{"marginLeft":"15px"}}> BP Heartbeat Viewer </div>
                </Typography>
              </div>
            </Toolbar>
          </AppBar>
          <Typography variant="title" color="inherit" style={{fontSize:9, color: "#fff", "marginLeft":"5px" }}>
            The following information is collected through the <a style={{fontSize:9, color: "#faa" }} href="https://github.com/bancorprotocol/eos-producer-heartbeat-plugin">nodeos bp heartbeat plugin</a>. The data shown here is provided voluntarily by each BP and is <b>not validated</b> by LiquidEOS nor anyone in any way. 
          </Typography>
         <ResponsiveReactGridLayout
          className="layout"
          items={cards.length}
          rowHeight={25}
          // cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          // WidthProvider option
          isDraggable={false}
          isResizable={false}
          layouts={{}}
          // measureBeforeMount={false}
          // useCSSTransforms={true}
          compactType={'vertical'}
          preventCollision={true}
        >
          {cards}
        </ResponsiveReactGridLayout>
          
        </div>
      </MuiThemeProvider>
    );
  }

}

export default withStyles(styles)(Index);
