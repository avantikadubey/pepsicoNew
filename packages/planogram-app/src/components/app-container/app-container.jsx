/* eslint-disable react/forbid-prop-types */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import * as actions from '../../@planogram/store/state/actions';
import {
  activityType,
  subActivityType
} from '../../@planogram/store/state/utility';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as _ from 'lodash';
import TabContainer from '../tab-container/tab-container';
import TabPlaceholder from '../tab-placeholder/tab-placeholder';
import fritolay from '../../../static/Fritolay.svg';
import { StoreSelector } from '../store-selector';
import {
  //ProgressLoader,
  ProgressModal
  //progressStatusType
} from '@planogram/design-system';
import {
  isLoadingChains,
  isSuccessForSaveAsTemplate,
  //isSuccessForDeleteConfiguration,
  isSuccessForUploadFile,
  isSuccessForSavePlanogramForPos,
  isLoadingSavePlanogramForPos,
  isLoadingForSaveConfiguration,
  isSuccessForSaveConfiguration,
  isSuccessForSaveAsConfiguration,
  isSuccessForUpdateProductForBackStock,
  isLoadingForUpdateProductForBackStock,
  isLoadingPlanogramsForConfig,
  isSuccessForSaveSimulationConfiguration
} from '../../@planogram/store/state/utility';
import classNames from 'classnames';
import MessageHandlingContainer from '../message-handling-container/message-handling-container';
import withErrorHandler from '../hoc/with-error-handler/with-error-handler';
import axios from '../../shared/axios-planogram';

class AppContainer extends React.PureComponent {
  render() {
    const {
      classes,
      labels,
      currentConfig,
      currentLoadingType,
      loading,
      activity,
      subActivity,
      user,
      logoutUser,
      success,
      status,
      statusMessage,
      error
    } = this.props;
    const hideTabContainer = currentConfig.storeId === '__UNSELECTED__';
    const { tabs } = labels;
    let planogramSalesAllocation = 0;

    planogramSalesAllocation = _.sumBy(currentConfig.pogs, function(sum) {
      return parseInt(sum.salesAllocation) ? parseInt(sum.salesAllocation) : 0;
    });
    // let allocationClass = planogramSalesAllocation === 100 ? true : false;
    const hidePanel =
      (activity === activityType.CONFIGURATION &&
        subActivity === subActivityType.EDIT_CONFIGURATION) ||
      (activity === activityType.SIMULATION &&
        subActivity === subActivityType.SUCCESS_SIMULATION);

    return (
      <Fragment>
        {/* {error && (
          <ProgressModal status={status} statusMessage={statusMessage} />
        )} */}
        {isLoadingChains(loading, currentLoadingType) && (
          <ProgressModal status={status} statusMessage={statusMessage} />
        )}
        {isLoadingSavePlanogramForPos(loading, currentLoadingType) && (
          <ProgressModal status={status} statusMessage={statusMessage} />
        )}
        {isLoadingForSaveConfiguration(loading, currentLoadingType) && (
          <ProgressModal status={status} statusMessage={statusMessage} />
        )}
        {isLoadingForUpdateProductForBackStock(loading, currentLoadingType) && (
          <ProgressModal status={status} statusMessage={statusMessage} />
        )}
        {/* {isLoadingPlanogramsForConfig(loading, currentLoadingType) && (
          <ProgressModal status={status} statusMessage={statusMessage}/>
        )} */}
        <section className={classes.root}>
          <Toolbar className={classes.containerSpacing}>
            <Grid container>
              <Grid
                item
                xs={12}
                className={classNames({
                  [classes.headerRoot]: hidePanel === false,
                  [classes.hidePanel]: hidePanel === true
                })}
              >
                <div
                  className={classNames({
                    [classes.sticky]: hidePanel === false,
                    [classes.hidePanel]: hidePanel === true
                  })}
                >
                  <Grid
                    item
                    xs={12}
                    className={`${classes.flexRow} ${classes.rowLogo}`}
                    spacing={2}
                    container
                  >
                    <Grid item sm={4} className={classes.heading}>
                      <span className={classes.logo}>
                        <img src={fritolay} alt="Fritolay Logo" />
                      </span>
                      <Typography component="h4" variant="h4" gutterBottom>
                        {/* <span className={classes.separator}>{'|'}</span> */}
                        Precision Ordering Store{' '}
                        <span className={classes.sublabel}>Simulator</span>
                      </Typography>
                    </Grid>
                    <Grid item sm={5} className={classes.storeSelectorDropdown}>
                      <StoreSelector labels={labels} />
                    </Grid>
                    <Grid item sm={3} className={classes.userSection}>
                      <FontAwesomeIcon
                        className={classes.login}
                        icon={['fas', 'user-circle']}
                        size="2x"
                      />
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        className={classes.userTextSection}
                      >
                        <i className={classes.useName}>{user}</i>
                        <span className={classes.separator}>{'|'}</span>
                        {'Logout'}
                      </Typography>
                      <FontAwesomeIcon
                        className={classes.logOut}
                        icon={['far', 'sign-out']}
                        size="2x"
                        onClick={() => logoutUser()}
                      />
                    </Grid>
                  </Grid>
                </div>
              </Grid>
              <Grid item xs={12} className={classes.tabHeader}>
                {/* <div className={classes.storeSelector}><StoreSelector labels={labels} /></div> */}
                {hideTabContainer === false ? (
                  <TabContainer labels={tabs} hidePanel={hidePanel} />
                ) : (
                  <TabPlaceholder />
                )}
              </Grid>
            </Grid>
          </Toolbar>
        </section>
        {activity === 0 &&
        currentConfig.pogs.length > 0 &&
        !currentConfig.editMode &&
        !isLoadingPlanogramsForConfig(loading, currentLoadingType) ? (
          <Grid
            item
            className={classNames(classes.totalSalesContainer, {
              [classes.totalSalesContainerGreen]:
                planogramSalesAllocation === 100,
              [classes.totalSalesContainerRed]: planogramSalesAllocation > 100,
              [classes.totalSalesContainerYellow]:
                planogramSalesAllocation < 100
            })}
          >
            <Typography component="span" className={classes.totalSalesValue}>
              {planogramSalesAllocation}%
            </Typography>
            <CircularProgress
              className={classes.progress}
              variant="static"
              size={55}
              value={
                planogramSalesAllocation > 100 ? 100 : planogramSalesAllocation
              }
            />
            <Typography component="span" className={classes.totalSalesLabel}>
              Total Sales Allocation
            </Typography>
          </Grid>
        ) : null}
        {/*
          success = true or false
          loadingType = what is being saved
          error
          loading
          load progress only if loading === true or error !== null or success && loadingType is oneof[SaveAs template, SavePOS, Save Config]
          get LoadingMessage(loading,loadingType) = statusMessage
          progressStatusType.SUCCESS,FAILURE,LOADING
          a.	Check if loadingtype is on of
          i.	Save As xxxx
          ii.	Save xxx
          iii.	Upload xxxx
          b.	VALID = If loadingType is one we want 
          c.	Check error (ADD TO maptoProps of app-container)
          d.	Get status message for loading type (write a utility function for message based on the the type) 
          e.	If VALID then call ProgressModal with status and message
          f.	If error !== null
          i.	Set status = -1 
          g.	If success 
          i.	Set status = 2
          h.	If loading
          i.	Set status = 1
          i.	Default
          i.	Set Status = 0 //hidden

          <ProgressModal status , statusMessage>
          */}
        <MessageHandlingContainer />
        {isSuccessForSaveAsTemplate(success, currentLoadingType) && (
          <ProgressModal status={status} statusMessage={statusMessage} />
        )}
        {isSuccessForSaveSimulationConfiguration(
          success,
          currentLoadingType
        ) && <ProgressModal status={status} statusMessage={statusMessage} />}
        {isSuccessForUploadFile(success, currentLoadingType) && (
          <ProgressModal status={status} statusMessage={statusMessage} />
        )}
        {isSuccessForSaveConfiguration(success, currentLoadingType) && (
          <ProgressModal status={status} statusMessage={statusMessage} />
        )}
        {isSuccessForSaveAsConfiguration(success, currentLoadingType) && (
          <ProgressModal status={status} statusMessage={statusMessage} />
        )}
        {isSuccessForSavePlanogramForPos(success, currentLoadingType) && (
          <ProgressModal status={status} statusMessage={statusMessage} />
        )}
        {isSuccessForUpdateProductForBackStock(success, currentLoadingType) && (
          <ProgressModal status={status} statusMessage={statusMessage} />
        )}
      </Fragment>
    );
  }
}

AppContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  labels: PropTypes.object.isRequired
};

const mapStateToProps = ({ pog }) => {
  return {
    currentConfig: pog.current.config,
    currentLoadingType: pog.loadingType,
    loading: pog.loading,
    activity: pog.current.activity,
    subActivity: pog.current.subActivity,
    success: pog.success,
    error: pog.error,
    status: pog.status,
    statusMessage: pog.statusMessage
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateStoreForConfiguration: (id) =>
      dispatch(actions.loadConfigurationsForStore(id))
  };
};

const ConnectedAppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(AppContainer, axios));

export default withStyles((theme) => ({
  hidePanel: {
    display: 'none',
    height: 0,
    width: 0
  },
  progressLoader: {
    zIndex: 1000
  },
  totalSalesContainerGreen: {
    background: theme.palette.common.green
  },
  totalSalesContainerRed: {
    background: theme.palette.common.red
  },
  totalSalesContainerYellow: {
    background: theme.palette.common.amber,
    '& span': {
      color: theme.palette.common.black
    },
    '& svg': {
      color: theme.palette.common.black
    }
  },
  totalSalesContainer: {
    right: '0px',
    width: '85px',
    height: '120px',
    bottom: '10%',
    position: 'fixed',
    borderTopLeftRadius: '14px',
    borderBottomLeftRadius: '14px',
    textAlign: 'center',
    padding: '6px'
  },
  totalSalesValue: {
    position: 'absolute',
    left: '0px',
    right: '0px',
    top: '28px',
    bottom: '0px',
    margin: 'auto',
    color: theme.palette.primary.contrastText,
    fontWeight: '700'
  },
  totalSalesLabel: {
    color: theme.palette.primary.contrastText,
    fontSize: '12px'
  },
  progress: {
    color: theme.palette.primary.contrastText
  },
  progressRed: {
    color: theme.palette.primary.contrastText
  },
  progressGreen: {
    color: theme.palette.primary.contrastText
  },
  storeSelectorDropdown: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'left',
    justifyContent: 'center',
    paddingTop: '5px',
    '& >div': {
      width: '100%',
      [theme.breakpoints.down('md')]: {
        maxWidth: '40%'
      }
    },
    '& >div:last-child': {
      marginLeft: 20
    }
  },
  userSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    textAlign: 'center'
  },
  useName: {
    color: theme.palette.secondary.dark,
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  userTextSection: {
    padding: 5,
    lineHeight: 1
  },
  login: {
    color: theme.palette.primary.main,
    marginTop: '.5rem',
    padding: 1
  },
  logOut: {
    color: theme.palette.primary.main,
    marginTop: '.5rem',
    marginRight: '.5rem',
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.secondary.main
    }
  },
  tabHeader: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
    // zIndex: 1,
  },
  storeSelector: {
    display: 'flex',
    position: 'absolute',
    zIndex: 10,
    '& .MuiSelect-selectMenu': {
      '&:last-child': {
        marginLeft: 20
      }
    }
  },
  separator: {
    fontWeight: 300,
    color: '#000000',
    position: 'relative',
    fontSize: '44px'
  },
  sublabel: {
    fontWeight: 300,
    color: '#000000',
    fontSize: '24px',
    [theme.breakpoints.down('md')]: {
      fontSize: 22
    }
  },
  root: {
    flexGrow: 1
  },
  logo: {
    objectFit: 'contain'
  },
  heading: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'left',
    alignItems: 'center',
    '& h4': {
      alignSelf: 'center',
      color: '#000000',
      fontSize: 24,
      fontWeight: 700,
      borderLeft: '2px solid #000000',
      padding: '10px 5px 0',
      marginLeft: '5px',
      [theme.breakpoints.down('md')]: {
        fontSize: 22
      }
    }
  },
  fritolayLogo: {
    textAlign: 'right'
  },
  planogramTitleContainer: {
    alignSelf: 'center',
    marginLeft: '15px'
  },
  containerSpacing: {
    padding: 0
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    padding: 5,
    justifyContent: 'space-between'
  },
  storeDropdown: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    '& section': {
      padding: '0 10px'
    }
  },
  linkTextStyle: {
    color: `black`,
    textDecoration: `none`,
    fontWeight: `900`,
    fontSize: '30px'
  },
  headerTitleEnd: {
    fontWeight: '300',
    marginLeft: '6px',
    top: '1px',
    position: 'relative'
  },
  rowLogo: {
    position: 'fixed',
    top: '0',
    // border: '1px solid green',
    width: '100%',
    zIndex: '1',
    backgroundColor: '#fff',
    left: '0',
    right: '0',
    margin: '0 auto',
    maxWidth: '1920px',
    padding: '0'
  },
  rowDropdownHide: {
    width: '100%',
    height: 0
  },
  rowDropdown: {
    position: 'fixed',
    top: '67px',
    width: '100%',
    zIndex: '1',
    left: '0',
    right: '0',
    margin: 'auto',
    backgroundColor: theme.palette.primary.main
  },
  rowDropdownChild: {
    maxWidth: '1280px',
    margin: '10px auto 10px auto',
    [theme.breakpoints.down('lg')]: {
      // border: '3px solid orange',
      paddingLeft: 32,
      paddingRight: 32,
      maxWidth: '1280px'
    },
    [theme.breakpoints.down('sm')]: {
      // border: '3px solid green',
      paddingLeft: 24,
      paddingRight: 24
    }
  },
  rowTab: {
    // border: '1px solid green'
  },
  sticky: {
    //  position: 'fixed',
  }
}))(ConnectedAppContainer);
