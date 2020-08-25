/* eslint-disable react/forbid-prop-types */
import React, { useState, Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useTheme,makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import { CardSlider } from '@planogram/design-system';
import * as actions from '../../@planogram/store/state/actions';

const useStyles = makeStyles((theme) => ({
  slider:{
    '& .MuiPaper-rounded': {
      marginRight: '25px',
      },
      [theme.breakpoints.down('xs')]: {
        margin:'5px 0px 5px 0px'
      }, 
  },
    }));
// import * as _ from 'lodash';

const InventorySliders = ({ labels, thresholdValues }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const classes = useStyles();
  
  //Setting Intia
  let [slidersData, setSlidersData] = useState({});

  useEffect(() => {
        setSlidersData({
          lowInventory: parseInt(thresholdValues.lowInventory),
          outOfStock: parseInt(thresholdValues.outOfStock)
        })
      },[thresholdValues]); 

  //callback for slider passed down to cardSlider
  const handleSliderState = (id, sliderValue) => {
    if (id) {
      setSlidersData({
        ...slidersData,
        outOfStock: sliderValue
      });
      dispatch(actions.setCurrentConfigurationOOSInventory({outOfStock: sliderValue}))
    } else {
      setSlidersData({
        ...slidersData,
        lowInventory: sliderValue
      });
      dispatch(actions.setCurrentConfigurationLowInventory({lowInventory: sliderValue}))
    }
  };

  return (
    <Fragment>
      <Grid item xs={12} sm={6} md={6}  className={classes.slider} >
        <CardSlider
          id={0}
          handleSliderState={handleSliderState}
          label={labels.lowInventoryLabel}
          value={slidersData.lowInventory}
          sliderColor={theme.palette.common.amber}
        />
      </Grid>
      <Grid item xs={12}  sm={6 } md={6} className={classes.slider} >

        <CardSlider
          id={1}
          handleSliderState={handleSliderState}
          label={labels.oosInventoryLabel}
          value={slidersData.outOfStock}
          sliderColor={theme.palette.common.red}
        />
      </Grid>
    </Fragment>
  );
};

InventorySliders.propTypes = {
  labels: PropTypes.object,
};

export default InventorySliders;
