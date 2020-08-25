import React, { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button, Typography } from '@material-ui/core';
import {
  activityType,
  getFilteredData,
  comparisonDataTransform,
  comparisonDataTransformForDisplay,
  exportCompareToXLS
} from '../../@planogram/store/state/utility';
import * as actions from '../../@planogram/store/state/actions';
import ComparisonOutput from './comparison-output';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InfographicComparison from '../../../static/infographics/Infographic_Comparision.png';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  bgImage: {
    '& img': {
      maxWidth: '100%',
      margin: '0 auto',
      display: 'block'
    }
  },
  fileTypeError: {
    marginTop: 10,
    textAlign: 'center',
    '& p': {
      color: theme.palette.common.red,
    },
  },
  uploadFiles: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '15px',
  },
  btnUpload: {
    //marginLeft: '15px'
    [theme.breakpoints.down('sm')]:{
      fontSize: '12px',
    }
  },
  btnUploadedTrue: {
    backgroundColor: theme.palette.secondary.main,
    [theme.breakpoints.down('sm')]:{
      fontSize: '12px',
    }
  },
  input: {
    display: 'none'
  },
  btnCompareFile: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '20px',
    '&:last-child': {
      marginRight: 0,
    },
    '& p': {
      textAlign: 'center',
      '& svg': {
        marginLeft: 10,
        cursor: 'pointer',
      },
    },
    [theme.breakpoints.down('sm')]:{
      fontSize: '12px',
    }
  },  
  btnCompare: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '20px',
    '&:last-child': {
      marginRight: 0,
    },
    '& button':{
      backgroundColor: theme.palette.common.black
    },
    '& p': {
      textAlign: 'center',
      '& svg': {
        marginLeft: 10,
        cursor: 'pointer',
      },
    },
  },
}));

const ComparisonContainer = React.memo(() => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const currentActivity = useSelector(({ pog }) => pog.current.activity);
  let comparisonDataLength = useSelector(
    ({ pog }) => pog.current.comparison.comparisonDataCount
  );
  let currentComparison = useSelector(({ pog }) => pog.current.comparison);
  let filterById = currentComparison.filterById;
  let sortById = currentComparison.sortById;
  let compareById = currentComparison.compareById;
  const [uploadType, setUploadType] = React.useState(null);
  const [loadData, setLoadData] = React.useState(false);
  if (currentActivity === activityType.COMPARISON) {
   // console.log('Comparison Rendered');
  }

  const handleSingleUpload = () => {
    setLoadData(true);
    let filteredData = getFilteredData(
      currentComparison,
      filterById,
      sortById,
      compareById
    );
    dispatch(actions.setComparisonFilterData(filteredData));
  };

  const handleCompareUpload = () => {
    setLoadData(true);
  };

  const handleExport = () => {
    exportCompareToXLS([...currentComparison.comparisonData],'ComparisonResearult');
  };

  // upload file
  const uploadFile = React.createRef();
  const openFileWindow = (type) => {
    setLoadData(false);
    setUploadType(type);
    uploadFile.current.click();
  };

  //Clear upload file
  const clearUploadFile = () => {
    setLoadData(false);
   dispatch(actions.clearComparisonData());
  }
  // function to handle file browse
  const onFileUpload = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const selectedFile = [];
    let supportedFilesTypes = ['application/json'];
    if (
      event.target.files[0] &&
      supportedFilesTypes.indexOf(event.target.files[0].type) > -1
    ) {
      let uploadedFileName = event.target.files[0].name;
      // Begin Reading File
      const reader = new FileReader();
      reader.onload = (e) => {
        let previewJson = JSON.parse(e.target.result);
        selectedFile.push({ uploadedFileName, uploadType, previewJson });
        dispatch(actions.setComparisonData(selectedFile));
        dispatch(actions.checkFileUploadType(false));
      };
      reader.readAsText(event.target.files[0]);
    } else { dispatch(actions.checkFileUploadType(true));}
  };
  console.log('loadData', loadData);
  return (
    <>
      {currentActivity === activityType.COMPARISON && (
        <Fragment>
          <Grid container>
            <input
              type="file"
              ref={uploadFile}
              className={classes.input}
              multiple
              onChange={(event) => onFileUpload(event)}
              onClick={(event)=> { event.target.value = null}}
            />
            {
              currentComparison.fileUploadTypeStatus === true && 
              (<Grid item md={12} className={classes.fileTypeError}><Typography>Please upload JSON format only.</Typography></Grid>)
            }
            <Grid item xs={12} className={classes.uploadFiles}>
              <Grid item xs={3} className={classes.btnCompareFile}>
                <Button
                  color="primary"
                  variant="contained"
                  className={classNames({
                    [classes.btnUpload]: comparisonDataLength === 0,
                    [classes.btnUploadedTrue]: comparisonDataLength >= 1
                  })}
                  onClick={() => openFileWindow('SIM1')}
                >
                  Upload File Output - 1
                </Button>
                {comparisonDataLength >= 1 && ( 
                  <p>{currentComparison.comparisonData[0].uploadedFileName} 
                  </p>)}
              </Grid>

              <Grid item xs={3} className={classes.btnCompareFile}> 
                <Button
                  color="primary"
                  variant="contained"
                  className={classNames({
                    [classes.btnUpload]: comparisonDataLength === 0,
                    [classes.btnUploadedTrue]: comparisonDataLength >= 2
                  })}
                  onClick={() => openFileWindow('SIM2')}
                >
                  Upload File Output - 2
                </Button>
                {comparisonDataLength >=2 && ( 
                  <p>{currentComparison.comparisonData[1].uploadedFileName}
                  </p>  
                )}
              </Grid>
              <Grid item xs={3} className={classes.btnCompareFile}>
                <Button
                  color="primary"
                  variant="contained"
                  className={classNames({
                    [classes.btnUpload]: comparisonDataLength === 0,
                    [classes.btnUploadedTrue]: comparisonDataLength >= 3
                  })}
                  onClick={() => openFileWindow('SIM3')}
                >
                  Upload File Output - 3
                </Button>
               {comparisonDataLength >= 3 && ( 
                <p> 
                  {currentComparison.comparisonData[2].uploadedFileName}
                </p>
               )}
              </Grid>
              <Grid item xs={1} className={classes.btnCompare}>
              {comparisonDataLength > 1 && (
                <Button
                  color="primary"
                  variant="contained"
                  className={classes.btnUpload}
                  onClick={() => handleCompareUpload()}
                >
                  Compare
                </Button>
              )}
              {comparisonDataLength === 1 && (
                <Button
                  color="primary"
                  variant="contained"
                  className={classes.btnUpload}
                  onClick={() => handleSingleUpload()}
                >
                  Execute
                </Button>
              )}
              </Grid>
              <Grid item xs={1} className={classes.btnCompare}>
                {
                  comparisonDataLength > 0 && (
                    <Button
                  color="primary"
                  variant="contained"
                  className={classes.btnUpload}
                  onClick={() => handleExport()}
                >
                  Export
                </Button>
                  )
                }
              </Grid>
              <Grid item xs={1} className={classes.btnCompare}>
                {
                  comparisonDataLength > 0 && (
                  <Button
                  color="primary"
                  variant="contained"
                  className={classes.btnUpload}
                  onClick={() => clearUploadFile()}
                >
                  Clear
                </Button>
                  )
                }
              </Grid>
            </Grid>
          </Grid>
          {loadData === false && (
            <Grid item md={12} className={classes.bgImage}>
              <img src={InfographicComparison} alt="Infographic Comparison" />
            </Grid>
          )}
          {loadData && <ComparisonOutput />}
        </Fragment>
      )}
    </>
  );
});

export default ComparisonContainer;