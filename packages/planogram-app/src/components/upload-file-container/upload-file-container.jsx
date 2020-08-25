import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../@planogram/store/state/actions';
import * as _ from 'lodash';
import {
  isLoadingUploadFile,
  activityType,
  isSuccessForUploadFile,
  isLoadingUploadedFileStatus
} from '../../@planogram/store/state/utility';
import { withStyles } from '@material-ui/styles';
import {
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl
} from '@material-ui/core';
import {
  UploadFile,
  DataUploadTable,
  DropDown
} from '@planogram/design-system';
import withErrorHandler from '../hoc/with-error-handler/with-error-handler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from '../../shared/axios-planogram';

class UploadFileContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadType: 'cao',
      browseOption: true,
      status: `or Drop CAO file here.`,
      selectedFile: null,
      ctaDisabledStatus: true,
      defaultSelectedValue: '',
      showDropdown: false,
      configId: null,
      errorStatus: false,
      firstRadioStatus: false
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.currentActivity === activityType.UPLOAD) {
      if (
        prevProps.success !== this.props.success &&
        isSuccessForUploadFile(
          this.props.success,
          this.props.currentLoadingType
        )
      ) {
        this.setState({
          status: `${this.props.message}`,
          ctaDisabledStatus: true
        });
      }
      if (
        this.props.currentConfig.configId !== '__UNSELECTED__' &&
        this.state.configId === null
      ) {
        this.setState({
          configId: this.props.currentConfig.configId
        });
      }
    }
  }

  doNothing = (event) => event.preventDefault();

  handleDropDownChange = (type, configId) => {
    if (configId) {
      this.setState({ configId: configId });
    }
  };

  onDragEnter = (event) => {
    this.setState({ status: `File Detected`, browseOption: false });
    event.preventDefault();
    event.stopPropagation();
  };

  onDragLeave = (event) => {
    this.setState({ status: `or Drop ${this.state.uploadType} file here.` });
    event.preventDefault();
  };

  // onDragOver =(event)  => {
  // 	setStatus(`Drop`)
  // 	event.preventDefault()
  // }

  onDrop = (event) => {
    this.setState({ errorStatus: false });
    let supportedFilesTypes = [
      'text/csv',
      'text/plain',
      'application/vnd.ms-excel'
    ];
    event.preventDefault();
    if (supportedFilesTypes.indexOf(event.dataTransfer.files[0].type) > -1) {
      this.setState({
        status: event.dataTransfer.files[0].name,
        selectedFile: event.dataTransfer.files[0],
        browseOption: false
      });
      event.dataTransfer.files[0] !== null
        ? this.setState({ ctaDisabledStatus: false })
        : this.setState({ ctaDisabledStatus: true });
    } else {
      this.setState({ status: 'Please select csv files only' });
      this.setState({ ctaDisabledStatus: true });
    }
    if (this.state.defaultSelectedValue === '') {
      this.setState({
        ctaDisabledStatus: true,
        errorStatus: true,
        firstRadioStatus: true
      });
    }
  };

  handleUploadType = (event) => {
    let type = event.target.value;
    event.target.value === 'POG'
      ? this.setState({ showDropdown: true })
      : this.setState({ showDropdown: false });
    if (this.state.firstRadioStatus) {
      this.setState({
        uploadType: type.toLowerCase(),
        browseOption: false,
        ctaDisabledStatus: false,
        defaultSelectedValue: type,
        errorStatus: false,
        firstRadioStatus: false
      });
    } else {
      this.setState({
        uploadType: type.toLowerCase(),
        browseOption: true,
        status: `or Drop ${type} file here.`,
        ctaDisabledStatus: true,
        defaultSelectedValue: type,
        errorStatus: false
      });
    }
  };

  // function to handle file browse
  onChangeFile = (event) => {
    this.setState({ errorStatus: false });
    let supportedFilesTypes = [
      'text/csv',
      'text/plain',
      'application/vnd.ms-excel'
    ];
    event.stopPropagation();
    event.preventDefault();
    if (supportedFilesTypes.indexOf(event.target.files[0].type) > -1) {
      this.setState({
        status: event.target.files[0].name,
        selectedFile: event.target.files[0],
        browseOption: false
      });
      event.target.files[0] !== null
        ? this.setState({ ctaDisabledStatus: false })
        : this.setState({ ctaDisabledStatus: true });
    } else {
      this.setState({ status: 'Please select csv files only' });
      this.setState({ ctaDisabledStatus: true });
    }
    if (this.state.defaultSelectedValue === '') {
      this.setState({
        ctaDisabledStatus: true,
        errorStatus: true,
        firstRadioStatus: true
      });
    }
  };

  onClickHandler = (event) => {
    const data = new FormData();
    data.append(this.state.uploadType, this.state.selectedFile);
    if (this.state.defaultSelectedValue === 'POG') {
      data.append('configId', this.state.configId);
    }
    this.props.saveUploadedFile(data);
  };

  onRrefesh = () => {
    this.props.refreshUploadedFile();
  };

  render() {
    const {
      classes,
      loading,
      currentLoadingType,
      uploadDataStatus,
      storeConfigs,
      currentConfig
    } = this.props;
    const {
      status,
      browseOption,
      ctaDisabledStatus,
      defaultSelectedValue
    } = this.state;
    if (this.props.currentActivity === activityType.UPLOAD) {
      // console.log('File upload rendered1');
    }
    const orderByUploadDataStatus = _.orderBy(
      uploadDataStatus,
      ['processTime'],
      ['desc']
    );
    const dropDownType = {
      config: 'config'
    };
    const configSelectList = [];
    _.forEach(storeConfigs, function(value) {
      configSelectList.push([value.configId, value.configName]);
    });
    return (
      <>
        {this.props.currentActivity === activityType.UPLOAD && (
          <Grid container spacing={5} className={classes.root}>
            <Grid item xs={12} className={classes.btnCAO}>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="position"
                  name="position"
                  onChange={this.handleUploadType}
                  row
                >
                  <FormControlLabel
                    value="CAO"
                    control={<Radio color="primary" />}
                    label="CAO File"
                    labelPlacement="end"
                    checked={defaultSelectedValue === 'CAO'}
                  />
                  <FormControlLabel
                    value="POS"
                    control={<Radio color="primary" />}
                    label="POS File"
                    labelPlacement="end"
                    checked={defaultSelectedValue === 'POS'}
                  />
                  <FormControlLabel
                    value="FORECAST"
                    control={<Radio color="primary" />}
                    label="FORECAST File"
                    labelPlacement="end"
                    checked={defaultSelectedValue === 'FORECAST'}
                  />
                  <FormControlLabel
                    value="STORE"
                    control={<Radio color="primary" />}
                    label="STORE File"
                    labelPlacement="end"
                    checked={defaultSelectedValue === 'STORE'}
                  />
                  <FormControlLabel
                    value="POG"
                    control={<Radio color="primary" />}
                    label="POG File"
                    labelPlacement="end"
                    checked={defaultSelectedValue === 'POG'}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            {this.state.errorStatus && (
              <span className={classes.textError}>
                Please select the specific file Type
              </span>
            )}
            {this.state.showDropdown && (
              <Grid className={classes.dropdown}>
                <p>Please select the Configuration</p>
                <DropDown
                  label="Configuration"
                  current={currentConfig.configId}
                  values={configSelectList}
                  type={dropDownType.config}
                  onChange={this.handleDropDownChange}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <UploadFile
                onDragEnter={this.onDragEnter}
                onDragLeave={this.onDragLeave}
                onDrop={this.onDrop}
                onDragOver={this.doNothing}
                status={status}
                browseOption={browseOption}
                onClickHandler={this.onClickHandler}
                onChangeFile={this.onChangeFile}
                ctaDisabledStatus={ctaDisabledStatus}
                isLoadingUploadFile={isLoadingUploadFile}
                loading={loading}
                currentLoadingType={currentLoadingType}
              />
            </Grid>
            <span className={classes.refresh} onClick={() => this.onRrefesh()}>
              Refresh
              <FontAwesomeIcon
                className={classes.buttonAlt}
                icon={['fas', 'sync-alt']}
                size="lg"
                padding={15}
                color="blue"
              />
            </span>
            <Grid item xs={12}>
              <DataUploadTable
                rows={orderByUploadDataStatus}
                isLoadingUploadedFileStatus={isLoadingUploadedFileStatus}
                loading={loading}
                currentLoadingType={currentLoadingType}
              />
            </Grid>
          </Grid>
        )}
      </>
    );
  }
}

const mapStateToProps = ({ pog }) => {
  return {
    success: pog.success,
    error: pog.error,
    message: pog.statusMessage,
    loading: pog.loading,
    currentLoadingType: pog.loadingType,
    currentActivity: pog.current.activity,
    uploadDataStatus: pog.current.config.uploadedFileData,
    storeConfigs: pog.storeConfigs,
    currentConfig: pog.current.config
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveUploadedFile: (value) => dispatch(actions.saveUploadFile(value)),
    refreshUploadedFile: () => dispatch(actions.loadUploadedFileStatus())
  };
};

UploadFileContainer.propTypes = {
  classes: PropTypes.object.isRequired
};

const ConnectedUploadFileContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(UploadFileContainer, axios));

export default withStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: 20
  },
  ctaUpload: {
    width: 'auto',
    height: 'auto',
    //  boxShadow: '1px 1px 5px 0px rgba(0,0,0,0.54)',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: '8px 20px',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  },
  btnCAO: {
    textAlign: 'center'
  },
  dropdown: {
    marginLeft: '457px'
  },
  refresh: {
    marginLeft: '1070px',
    marginBottom: '0px',
    marginTop: '53px',
    cursor: 'pointer'
  },
  buttonAlt: {
    marginLeft: '6px'
  },
  textError: {
    color: 'red',
    marginLeft: '457px'
  }
}))(ConnectedUploadFileContainer);
