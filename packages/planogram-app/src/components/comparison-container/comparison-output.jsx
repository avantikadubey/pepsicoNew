import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { activityType, subActivityType } from '../../@planogram/store/state/utility';
import ComparisonTabs from './comparison-tabs';

const useStyles = makeStyles(theme => ({
  root: {
      display: 'flex',
  },
  inputField: {
    border: '2px solid',
    borderColor: theme.palette.grey[400],
    borderRadius: '4px', 
    width: '80%',
    background: theme.palette.grey[200],
    '& label': {
      left: '50%',
      marginLeft: '-43px',
      width: '82px',
      color: theme.palette.grey[900] + '!important'
    },
    '& input': {
      textAlign: 'center',
      fontSize: '22px',
      fontWeight: '500',
      color: theme.palette.grey[900],
      [theme.breakpoints.down('sm')]:{
        fontSize: '14px',
      },
    }
},
totalLabel:{
  minWidth: '196px',
  fontWeight: '700',
  fontSize: '20px',
  [theme.breakpoints.down('sm')]:{
    fontSize: '14px',
  },
  },
  textFields:{
    display:'flex'
  },
  totalInventory:{
    display:'flex',
    justifyContent: 'center',
  },
  totalInventoryConatiner:{
    borderTop: '1px solid',
    marginTop: '20px',
    paddingTop: '20px',
    borderColor: theme.palette.grey[400],
  },
  centerItems:{
    textAlign: 'center'
  }
}));


const ComparisonOutput = React.memo(() => {
  const currentActivity = useSelector(({ pog }) => pog.current.activity);
  //const currentSimulate = useSelector(({ pog }) => pog.current.simulate);
  const comparisonInventoryData = useSelector(({ pog }) => pog.current.comparison.comparisonInventoryData);
  let [inStock, setInStock] = useState(['0','0','0']);
  let [outStock, setOutStock] = useState(['0','0','0']);
  const updateStock=()=>{
    let inStockArray=[],outStockArray=[];
    comparisonInventoryData.forEach(element=>{
      inStockArray.push(element.inStock)
      outStockArray.push(element.outStock)
    });
      setInStock(inStockArray)
      setOutStock(outStockArray)
  }

  useEffect(()=>{
    updateStock();
  },[comparisonInventoryData])
  
  let comparisonDataCount = useSelector(({ pog }) => pog.current.comparison.comparisonDataCount);
  if (currentActivity === activityType.COMPARISON) {
    console.log('Comparison output Grid');
  }

  // const { displayOutput, storeOutput} = currentSimulate.viewConfiguration.viewSimulationData;
  // const selectedDate = 1564099200000
  // const calculateInstock = (storeOutput, selectedDate) => {
  //   storeOutput.filter(item => item.simulationDate === selectedDate);
  // }
  // console.log(calculateInstock(storeOutput, selectedDate));

  const classes = useStyles();
  //const [simulationView, setSimulationView] = React.useState(false);

  
  return (
    <Grid container>
      <Grid item xs={12} className={classes.totalInventory} >
      {(comparisonDataCount === 1 || comparisonDataCount === 3  ||  comparisonDataCount === 2 ) && (
        <Grid item xs={4} className={classes.centerItems} >
        <Grid className={classes.totalLabel} >
             Inventory Status (Output-1)
        </Grid>
         
          <Grid className={classes.textFields} >
            <Grid item xs={6} >
                <TextField
                  disabled
                  className={classes.inputField}
                  label="In Stock"
                  margin="normal"
                  variant="filled"
                  value={inStock[0] || 0}
                  InputProps={{
                    disableUnderline: true
                  }}
                  title="Total unique products that are good in inventory"
                />
            </Grid>
            <Grid item xs={6} className={classes.marginLeft} >
                <TextField
                  disabled
                  className={classes.inputField}
                  label="Out of Stock"
                  margin="normal"
                  variant="filled"
                  value={outStock[0] || 0}
                  InputProps={{
                    disableUnderline: true
                  }}
                  title="Total unique product that are either low or out of stock in inventory"
                />
            </Grid>
            </Grid>
          </Grid>
        )}
      {(comparisonDataCount === 3  ||  comparisonDataCount === 2 ) && (
          <Grid item xs={4} className={classes.centerItems} >
        <Grid className={classes.totalLabel} >
             Inventory Status (Output-2)
        </Grid>
         
          <Grid className={classes.textFields} >
            <Grid item xs={6} >
                <TextField
                  disabled
                  className={classes.inputField}
                  label="In Stock"
                  margin="normal"
                  variant="filled"
                  value={inStock[1] || 0}
                  InputProps={{
                    disableUnderline: true
                  }}
                  title="Total unique products that are good in inventory"
                />
            </Grid>
            <Grid item xs={6} className={classes.marginLeft} >
                <TextField
                  disabled
                  className={classes.inputField}
                  label="Out of Stock"
                  margin="normal"
                  variant="filled"
                  value={outStock[1] || 0}
                  InputProps={{
                    disableUnderline: true
                  }}
                  title="Total unique product that are either low or out of stock in inventory"
                />
            </Grid>
            </Grid>
          </Grid>
         )}
        {(comparisonDataCount === 3 ) && (
          <Grid item xs={4} className={classes.centerItems} >
        <Grid className={classes.totalLabel} >
             Inventory Status (Output-3)
        </Grid>
         
          <Grid className={classes.textFields} >
            <Grid item xs={6} >
                <TextField
                  disabled
                  className={classes.inputField}
                  label="In Stock"
                  margin="normal"
                  variant="filled"
                  value={inStock[2] || 0}
                  InputProps={{
                    disableUnderline: true
                  }}
                  title="Total unique products that are good in inventory"
                />
            </Grid>
            <Grid item xs={6} className={classes.marginLeft} >
                <TextField
                  disabled
                  className={classes.inputField}
                  label="Out of Stock"
                  margin="normal"
                  variant="filled"
                  value={outStock[2] || 0}
                  InputProps={{
                    disableUnderline: true
                  }}
                  title="Total unique product that are either low or out of stock in inventory"
            />
            </Grid>
            </Grid>
          </Grid>
        )}          
      </Grid>
      <ComparisonTabs />
    </Grid>
  );
});

export default ComparisonOutput;
