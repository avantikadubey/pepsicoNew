import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../@planogram/store/state/actions';
import { subActivityType } from '../../@planogram/store/state/utility';
import { withStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { MediaCard } from '@planogram/design-system';
//import * as _ from 'lodash';
import classNames from 'classnames';

const CardContainer = ({ classes, labels }) => {
  //let planogramSalesAllocation = 0;
  const dispatch = useDispatch();
  const currentConfig = useSelector(({ pog }) => pog.current.config);

  const handleEditClick = (id, locationCode) => {
    const data = {
      pogId: id,
      configId: currentConfig.configId
    };
    //   console.log('clicked', id);
    dispatch(actions.setCurrentSubActivityType(subActivityType.EDIT_CONFIGURATION));
    dispatch(actions.selectPlanogram({ id, name: locationCode }));
    dispatch(actions.setEditModeForPlanogram(true));
    dispatch(actions.unSelectPlanogramPosition());
    dispatch(actions.setPosForPlanogram(data));
  };

  // method to handle planogram sales allocation
  const handleSalesAllocation = (id) => (event) => {
    let newPlanogramWithSalesAllocation = currentConfig.pogs.find(
      (item) => item.pogId === id
    );
    newPlanogramWithSalesAllocation.salesAllocation = event.target.value;
    dispatch(actions.setPlanogramSalesAllocation(currentConfig.pogs));
  };

  // planogramSalesAllocation = _.sumBy(currentConfig.pogs, function(sum) {
  //   return parseInt(sum.salesAllocation) ? parseInt(sum.salesAllocation) : 0;
  // });

  //count for planogram to add scrollbar
  let PlanogramCount = currentConfig.pogs.length;
  return (
    <Grid container className={classes.root}>
      {/* <Grid item xs={12}>
        {planogramSalesAllocation === 100 ? (
          <Typography
            component="p"
            variant="body2"
            className={classes.totalSales}
          >
            <Typography component="span">
              {labels.totalSalesAllocationLabel}
            </Typography>{' '}
            <Typography component="span" className={classes.totalSalesValue}>
              {planogramSalesAllocation}%
            </Typography>
          </Typography>
        ) : (
          <Typography
            component="p"
            variant="body2"
            className={classes.totalSalesError}
          >
            <Typography component="span">
              {labels.totalSalesAllocationLabel}
            </Typography>{' '}
            <Typography component="span" className={classes.totalSalesValue}>
              {planogramSalesAllocation}%
            </Typography>
          </Typography>
        )}
      </Grid> */}
      <Grid
        container
        className={classes.planogramGridRoot}
        // className={classNames({
        //   [classes.planogramGridRoot]: PlanogramCount <= 4,
        //   [classes.planogramGridRootScroll]: PlanogramCount > 4
        // })}
      >
        {currentConfig &&
          currentConfig.pogs.map((item, key) => {
            return (
              <Grid
                key={key}
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                className={classes.mediaCard}
              >
                <MediaCard
                  data={item}
                  labels={labels.cardSubText}
                  handleEditClick={handleEditClick}
                  handleSalesAllocation={handleSalesAllocation}
                />
              </Grid>
            );
          })}
      </Grid>
    </Grid>
  );
};

CardContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  labels: PropTypes.object.isRequired,
  data: PropTypes.object
};

export default withStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  totalSales: {
    background: theme.palette.grey[800],
    padding: '10px 10px 5px',
    display: 'inline-flex',
    fontWeight: 500,
    alignItems: 'baseline',
    '& span': {
      color: theme.palette.primary.contrastText
    },
    borderRadius: '0px',
    boxShadow: '1px 1px 2px 0px rgba(0,0,0,0.54)'
  },
  totalSalesError: {
    background: theme.palette.error.dark,
    padding: '10px 10px 5px',
    display: 'inline-flex',
    fontWeight: 500,
    alignItems: 'baseline',
    '& span': {
      color: theme.palette.primary.contrastText
    },
    borderRadius: '0px',
    boxShadow: '1px 1px 2px 0px rgba(0,0,0,0.54)'
  },
  totalSalesValue: {
    fontSize: 22,
    paddingLeft: 6
  },
  planogramGridRoot: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: '20px 0'
  },
  planogramGridRootScroll: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: '20px 0',
    maxHeight: '200px',
    overflowY: 'scroll'
  },
  mediaCard: {
    // padding: '0 20px',
    paddingBottom: 30
  }
}))(CardContainer);
