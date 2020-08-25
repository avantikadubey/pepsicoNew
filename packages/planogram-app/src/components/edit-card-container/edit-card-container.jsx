import React, { Fragment, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as actions from '../../@planogram/store/state/actions';
import { Grid, Button, Slide } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  isLoadingPosForPlanogram,
  isLoadingForGetTemplate,
  isLoadingForSaveAsTemplate,
  isSuccessForGetTemplate,
  isSuccessForSaveAsTemplate
} from '../../@planogram/store/state/utility';
import { PlanogramContainer } from '../planogram-container';
import SearchContainer from '../search-container/search-container';
import { ConfigModal } from '@planogram/design-system';
import withErrorHandler from '../hoc/with-error-handler/with-error-handler';
import axios from '../../shared/axios-planogram';

const EditCardContainer = React.memo(({ classes }) => {
  // const zoom = useSelector(({ pog }) => pog.current.zoom);
  const dispatch = useDispatch();
  const currentConfig = useSelector(({ pog }) => pog.current.config);
  const currentPOS = useSelector(({ pog }) => pog.current.planogram);
  const productsForSearch = useSelector(({ pog }) => pog.products);
  const filteredProducts = useSelector(
    ({ pog }) => pog.current.config.filteredProducts
  );
  const selectedProductUPC = useSelector(
    ({ pog }) => pog.current.config.selectedPosition.upc
  );

  const loading = useSelector(({ pog }) => pog.loading);
  const templates = useSelector(({ pog }) => pog.templates);
  const currentLoadingType = useSelector(({ pog }) => pog.loadingType);
  const success = useSelector(({ pog }) => pog.success);
  const { chainName, storeName, pogName } = currentConfig;

  const [open, setOpen] = React.useState(false);
  const [modalType, setModalType] = React.useState(null);
  const [alreadyExistStatus, setAlreadyExistStatus] = React.useState(null);
  const [templateName, setTemplateName] = React.useState(null);
  const handleOpen = (type) => {
    setTemplateName(null);
    setAlreadyExistStatus(null);
    setModalType(type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTemplateName(null);
    setAlreadyExistStatus(null);
  };

  const handleBackClick = () => {
    dispatch(actions.setCurrentSubActivityType(-1));
    dispatch(actions.setEditModeForPlanogram(false));
    dispatch(actions.clearSelectedPlanogram());
    dispatch(actions.clearPlanogramForPos());
  };

  const handleNewTemplateName = (event) => {
    const trimValue = event.target.value.trim();
    dispatch(actions.clearTemplate());
    setTemplateName(trimValue);
    setAlreadyExistStatus(null);
  };

  const handleCheckNameAvailability = () => {
    let mode = 'editMode'
    dispatch(actions.getTemplateName({templateName, mode}));
  };

  useEffect(() => {
    if (isSuccessForGetTemplate(success, currentLoadingType)) {
      setAlreadyExistStatus(templates.length > 0 ? true : false);
    } else if (isSuccessForSaveAsTemplate(success, currentLoadingType)) {
      setOpen(false);
    }
    // else if(isSuccessForSavePlanogramForPos(success, currentLoadingType)){
    //   dispatch(actions.clearPlanogramForPos());
    // }
  }, [success, currentLoadingType, templates.length]);

  const handleSavePlanogram = () => {
    const data = {
      configId: currentConfig.configId,
      pogId: currentConfig.pogId,
      positions: currentConfig.pos
    };
    dispatch(actions.savePlanogramForPos(data));
  };

  const handleSaveAsTemplate = () => {
    const data = {
      tmplName: templateName,
      locationCode: currentConfig.pogName,
      positions: currentConfig.pos
    };

    dispatch(actions.saveAsTemplate(data));
  };
  let uniqueProducts = [];
  if (selectedProductUPC !== '__UNSELECTED__') {
    let products = [];
    if (filteredProducts && filteredProducts.length > 0) {
      // products = filteredProducts.filter((index) => {
      //   return index.upc !== selectedProductUPC;
      // });
      products = filteredProducts;
    }
    uniqueProducts = products;
  } else {
    uniqueProducts = productsForSearch;
  }

  const countFLNA = (type) => {
    const pos = currentConfig.pos
    const filterPos = pos.filter((item) => item.upc.startsWith('0028400'));
    let count;
    if(type === 'flna'){
      count = filterPos.length;
   //   console.log('count1', count);
    } else {
      count = pos.length - filterPos.length
  //    console.log('count2', count);
    }
    return count;
  }

  return (
    <Slide direction="left" in={true} mountOnEnter unmountOnExit>
      <Grid container className={classes.editRoot}>
        <Grid item xs={7} className={classes.edithead}>
          <div className={classes.configDetail}>
            <FontAwesomeIcon
              icon={['fas', 'arrow-left']}
              size="1x"
              className={classes.icon}
              onClick={() => handleBackClick()}
            />

            <Typography
              variant="body1"
              color="inherit"
              className={classes.editText}
            >{`${pogName} - ${storeName} - ${chainName}`}</Typography>
            <Chip
              size="small"
              label="EDIT"
              color="secondary"
              className={classes.editChip}
            />
          </div>
        </Grid>
        <Grid item xs={5} className={classes.editIndicators}>
          <div className={classes.holdingIndicator}></div>
          <span className={classes.indicatorsLabel}>Holding Power</span>
          <div className={classes.stockIndicator}></div>
          <span className={classes.indicatorsLabel}>In stock Inventory</span>
        </Grid>
        {/* <Grid item xs={2}></Grid> */}
        <Grid item xs={12}>
          <hr className={classes.hrTag} />
        </Grid>{' '}
        <Grid item xs={3}></Grid>
        {isLoadingPosForPlanogram(loading, currentLoadingType) ? (
          <Grid item xs={12} className={classes.flexRow}>
            <Grid item xs={12}>
              <CircularProgress
                color="secondary"
                className={classes.spinner}
                size={50}
              />
            </Grid>
          </Grid>
        ) : (
          <Grid container className={classes.planogramHead}>
            <Grid item xs={12} sm={9} md={10} className={classes.flna}>
              <div className={classes.FLNALabel}>Planogram Position Summary</div>
              <div className={classes.FLNALabel}>FLNA occupied position:<span>{`${countFLNA('flna')}`}</span></div>
              <div className={classes.FLNALabel}>Non-FLNA occupied position:<span>{`${countFLNA()}`}</span></div>
            </Grid>
            <Grid item xs={12} className={classes.flexRow}>
              <Grid item xs={12} sm={9} md={10} className={classes.planogramView}>
                <Grid item xs={12}>
                  {currentPOS !== null && (
                    <PlanogramContainer data={currentPOS} />
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12} sm={3} md={2} className={classes.searchContainer}>
                <SearchContainer productsForSearch={uniqueProducts} />
              </Grid>
            </Grid>
            <Grid item xs={12} className={classes.cta}>
              {currentConfig.configName.toLowerCase() !== 'default' ? (
                <Button
                  className={classes.save}
                  color="primary"
                  variant="contained"
                  onClick={() => handleSavePlanogram()}
                  disabled={!currentConfig.dirty}
                >
                  Save Planogram
                </Button>
              ) : null}
              <Button
                className={classes.save}
                variant="contained"
                color="primary"
                onClick={() => handleOpen('saveAsTemplate')}
              >
                Save As Template
              </Button>
              <Button
                className={classes.save}
                variant="contained"
                onClick={() => handleBackClick()}
                color="primary"
              >
                Cancel
              </Button>
              <ConfigModal
                open={open}
                handleClose={handleClose}
                handleOnClick={handleSaveAsTemplate}
                handleOnChange={handleNewTemplateName}
                alreadyExistStatus={alreadyExistStatus}
                handleCheckNameAvailability={handleCheckNameAvailability}
                modalType={modalType}
                data={templateName}
                loading={loading}
                currentLoadingType={currentLoadingType}
                isLoadingForGetTemplate={isLoadingForGetTemplate}
                isLoadingForSaveAsTemplate={isLoadingForSaveAsTemplate}
              />
            </Grid>
          </Grid>
        )}
      </Grid>
    </Slide>
  );
});

const HandlerWrapperEditCardContainer = withErrorHandler(
  EditCardContainer,
  axios
);

export default withStyles((theme) => ({
  hrTag: {
    // marginLeft: '3%',
    border: '1px solid',
    marginRight: '15px',
    borderColor: theme.palette.grey[300]
  },
  stockIndicator: {
    height: '11px',
    width: '11px',
    backgroundColor: theme.palette.common.red,
    marginLeft: '25px'
  },
  holdingIndicator: {
    height: '11px',
    width: '11px',
    backgroundColor: theme.palette.secondary.main
  },
  editRoot: {
    justifyContent: 'space-between',
    background: theme.palette.grey[50]
  },
  indicatorsLabel: {
    fontSize: '12px',
    color: theme.palette.primary.main,
    marginLeft: '2px',
    position: 'relative'
   // top: '2px'
  },
  planogramHead: {
    position: 'relative',
    marginTop: '20px',
  },
  flna: {
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: '-8px',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'center',
  },
  FLNALabel: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: theme.palette.primary.dark,
    position: 'relative',
    padding: '10px',
    paddingBottom: 0,
    background: theme.palette.background.default,
    '& span': {
      fontSize: '16px',
      marginLeft: '5px',
    }
  },
  editIndicators: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 15
  },
  edithead: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    color: theme.palette.primary.main
  },
  editText: {
    margin: '2px'
  },
  editChip: {
    margin: '2px',
    padding: '2px',
    fontSize: 'small'
  },
  searchContainer: {
    //marginLeft: '2vw'
    margin: 0,
    padding: 0
  },
  slider: {
    width: 200
    // height: theme.spacing(1)
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    padding: '10px 0 15px 0'
  },
  cta: {
    textAlign: 'center',
    marginBottom: 20
  },
  save: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: '10px 35px',
    height: 'auto',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    },
    marginRight: '20px'
  },
  spinner: {
    color: theme.palette.primary.main
  },
  btnBack: {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    position: 'relative',
    textAlign: 'left',
    zIndex: 10,
    transition: '0.001s',
    boxShadow: '1px 1px 5px 0px rgba(0,0,0,0.54)',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    },
    '&:hover::before': {
      borderRightColor: theme.palette.primary.dark
    },
    '&:before': {
      content: '""',
      width: 0,
      height: 0,
      borderTop: '18px solid transparent',
      borderBottom: '18px solid transparent',
      borderRight: '18px solid',
      borderRightColor: theme.palette.primary.main,
      position: 'absolute',
      left: '-16px'
      // boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
    }
  },
  icon: {
    marginRight: '10px',
    cursor: 'pointer',
    '& path': {
      color: theme.palette.primary.main
    }
  },
  planogramView: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '1vw'
  },
  zoom: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  editText: {
    fontWeight: 'bold',
    marginRight: 5
  },
  configDetail: {
    backgroundColor: theme.palette.primary.main,
    padding: 3,
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.primary.contrastText,
    paddingRight: 15,
    '& svg': {
      backgroundColor: theme.palette.common.white,
      borderRadius: '50%',
      padding: '7px',
      height: '35px',
      '&.fa-arrow-left': {
        width: '35px'
      }
    }
    /*     '&:hover': {
      backgroundColor: theme.palette.secondary.main
    } */
  }
}))(HandlerWrapperEditCardContainer);
