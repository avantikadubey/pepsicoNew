/* eslint-disable react/no-array-index-key */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import classNames from 'classnames';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { useSelector, useDispatch } from 'react-redux';
import { subActivityType } from '../../@planogram/store/state/utility';
import * as actions from '../../@planogram/store/state/actions';
import TabSelector from './tab-selector';

const TabPanel = React.memo(({ children, value, index, ...other }) => {
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
});

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    width: '100%',
    flexGrow: 1
    // border: '1px solid red',
    // marginTop: '192px'
  },
  rootTabPosition: {
    marginTop: '125px'
  },
  hideTabContainer: {
    position: 'relative',
    margin: 0,
    height: 0,
    width: 0
  },
  tabContainer: {
    color: theme.palette.common.black,
    position: 'fixed',
    width: '100%',
    top: 80,
    zIndex: 1,
    backgroundColor: theme.palette.primary.main,
    left: 0,
    right: 0,
    margin: 'auto',
    boxShadow: '0px 8px 5px -8px rgba(0,0,0,0.75)',
    '& .MuiTabs-flexContainer': {
      justifyContent: 'flex-start'
    },
    '& button.Mui-selected': {
      color: theme.palette.primary.contrastText,
      // backgroundColor: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.main,
      border: 'none',
      borderRadius: '3px'
      // boxShadow: '5px 5px 5px 0px rgba(0,0,0,0.54)',
    },
    '& .MuiTabs-fixed': {
      // border: '1px solid',
      maxWidth: '1265px',
      margin: '0 auto',
      [theme.breakpoints.down('lg')]: {
        paddingLeft: 32,
        paddingRight: 32
      },
      [theme.breakpoints.down('sm')]: {
        paddingLeft: 24,
        paddingRight: 24
      }
    }
  },
  selectedTab: {
    //margin: '0 auto',
    marginTop: '.5rem',
    color: theme.palette.primary.main
  },
  simulationPanel: {
    height: '1200px',
  },
  configEditPanel: {
    height: '100vh'
  },
  view: {
    background: theme.palette.grey[50],
  },
  panelContainer: {
    background: theme.palette.grey[50],
    minHeight: '81px',
    display: 'initial',
    margin: 'auto',
    '& .MuiBox-root': {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 50px 20px',
      [theme.breakpoints.down('md')]:{
        padding: '0 30px 20px',
      }
      //  [theme.breakpoints.down('md')]: {
      //   maxWidth: '960px',
      // },
      // [theme.breakpoints.down('sm')]: {
      //   maxWidth: '660px',
      // },
    }
  },
  tabFont: {
    fontSize: theme.typography.subheading.fontSize,
    [theme.breakpoints.down('sm')]:{
      fontSize: theme.typography.body1.fontSize,
      minWidth: '120px',
    },
    float: 'right',
    // background: theme.palette.grey[400],
    backgroundColor: theme.palette.primary.main,
    color: '#ffffff',
    marginRight: '15px',
    // border: `1px solid ${theme.palette.grey[400]}`,
    borderRadius: '1px'
    // border: '1px solid blue',
  },
  indicator: {
    backgroundColor: theme.palette.primary.contrastText
  }
}));

const TabContainer = React.memo(({ labels, hidePanel }) => {
  const classes = useStyles();
  const theme = useTheme();
  const value = useSelector(({ pog }) => pog.current.activity);
  const currentSubActivityType = useSelector(
    ({ pog }) => pog.current.subActivity
  );
  const dispatch = useDispatch();
  function handleChange(event, newValue) {
    dispatch(actions.setCurrentActivityType(newValue));
    dispatch(actions.setSimulationView(false));
    // dispatch(actions.clearSimulationViewTab());
    dispatch(actions.clearSimulationTab());
    // dispatch(actions.clearComparisonData());
  }

  function handleIndexChange(newValue) {
    dispatch(actions.setCurrentActivityType(newValue));
    dispatch(actions.setSimulationView(false));
    // dispatch(actions.clearSimulationViewTab());
    dispatch(actions.clearSimulationTab());
    // dispatch(actions.clearComparisonData());
  }

  const isSimulationView =
    currentSubActivityType === subActivityType.RUN_SIMULATION;
  console.log(isSimulationView);
  return (
    <div
      className={classNames(classes.root, {
        [classes.rootTabPosition]: hidePanel === false
      })}
    >
      {hidePanel === false && (
        <Tabs
          value={value}
          onChange={handleChange}
          className={classNames({
            [classes.tabContainer]: hidePanel === false,
            [classes.hideTabContainer]: hidePanel === true
          })}
          classes={{ indicator: classes.indicator }}
        >
          {labels.map((tabName, key) => (
            <Tab
              className={classes.tabFont}
              label={tabName.name}
              key={key}
              {...a11yProps({ key })}
            />
          ))}
        </Tabs>
      )}
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleIndexChange}
        className={classes.view}
        enableMouseEvents
      >
        {labels.map((item, index) => {
          return (
            <TabPanel
              key={index}
              className={classNames(classes.panelContainer, {
                [classes.simulationPanel]: isSimulationView === true,
                [classes.configEditPanel]: isSimulationView === false,
              })}
              value={index}
              index={index}
              dir={theme.direction}
            >
              <Grid container>
                <Grid item xs={12} className={classes.selectedTab}>
                  <TabSelector labels={labels} value={index} />
                </Grid>
              </Grid>
            </TabPanel>
          );
        })}
      </SwipeableViews>
    </div>
  );
});

TabContainer.propTypes = {
  labels: PropTypes.array.isRequired
};

// const ConnectedTabContainer = connect(mapStateToProps)(TabContainer);

export default TabContainer;
