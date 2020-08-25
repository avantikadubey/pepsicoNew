import React, { Fragment, useEffect, useState } from 'react';
import { Grid, Button, TextField, InputAdornment, CircularProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as _ from 'lodash';
import * as actions from '../../@planogram/store/state/actions';
import { activityType, isLoadingAssociateTemplate, isLoadingTemplateDelete } from '../../@planogram/store/state/utility';
import { TemplateTable } from '@planogram/design-system';
import NumberFormat from 'react-number-format'
import PropTypes from 'prop-types'


function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        })
      }}
      isNumericString
      allowNegative={false}
      format="###"
    />
  )
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}

const HandleTemplateContainer = React.memo(({ classes }) => {
  const loading = useSelector(({ pog }) => pog.loading);
  const currentLoadingType = useSelector(({ pog }) => pog.loadingType);
  const configList = useSelector(({ pog }) => pog.storeConfigs);
  const currentActivity = useSelector(({ pog }) => pog.current.activity);
  const templateList = useSelector(({ pog }) => pog.templateList);
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [modalType, setModalType] = React.useState(null);
  const [selectedTemp, setSelectedTemp] = React.useState(null);
  const [newPlanogramValue, setNewPlanogramValue] = React.useState(null);
  const [assoConfig, setAssoConfig] = React.useState(null);
  const [templateName, setTemplateName] = React.useState([]);
  let templateName2 = [];
  let configArray = [];
  _.forEach(templateList, function(template){
    templateName2.push({templateName: template.tmplName})
  });
_.forEach(configList, function(value, key) {
  let configValue = {
    id: value.configId,
    simName: value.configName
  }
  configArray.push(configValue);
});

console.log('currentLoadingType', currentLoadingType);
console.log('loading', loading);
  useEffect(() => {
    setTemplateName(templateName2);
    handleClose();
  }, [templateList, loading, currentLoadingType]);
 
  const handleOpen = (data) => {
    let tempId = _.find(templateList, { 'tmplName': data.rowData.templateName});
    setSelectedTemp(tempId.tmplId);
    setModalType(data.type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteSelectedTemplate = () => {
    let data = {
      templateId: selectedTemp
    };
    dispatch(actions.deleteSelectedTemplate(data));
  };

  const handleTemplateAssoc = (event, value) => {
    setAssoConfig(value.id);
  };

  const handleCustomPlanoName = (event, value) => {
    setNewPlanogramValue(event.target.value);
  };

  const saveAssocTemplate = () => {
    console.log('save');
    let data = {
      configId: assoConfig,
      tmplId: selectedTemp,
      locationCode : newPlanogramValue
    };
    dispatch(actions.saveAssociateTemplate(data));
  }

  return (
    <Fragment>
      {currentActivity === activityType.TEMPLATE && (
        <Grid container>
           <Grid item xs={12}>
             <TemplateTable isLoadingAssociateTemplate={isLoadingAssociateTemplate} saveAssocTemplate={saveAssocTemplate} data={newPlanogramValue} loading={loading} currentLoadingType={currentLoadingType} template={templateName} open={open} handleOpen={handleOpen} handleClose={handleClose} modalType={modalType} deleteSelectedTemplate={deleteSelectedTemplate} configData={configArray} isLoadingTemplateDelete={isLoadingTemplateDelete} handleOnChange={handleTemplateAssoc} customPlanoName={handleCustomPlanoName}/>
           </Grid>
        </Grid>
      )}
    </Fragment>
  );
});

export default withStyles((theme)=> ({
  cta: {
    textAlign: 'center',
    paddingTop: 20,
  },
  btn: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: '10px 35px',
    height: 'auto',
    cursor: 'pointer',
    marginRight: '20px',
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    },
  },
  search: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',    
    borderColor: theme.palette.grey[500],
    '& .MuiFilledInput-adornedEnd input' :{
      padding: '20px 12px 5px',
    },
    '& svg.fa-search': {
      width: '20px', 
      height: '20px',
      '& path': {
        fill: theme.palette.grey[500]
      },
    },
  },
  searchArea: {
    // backgroundColor: theme.palette.grey[200],
    // borderBottom: '1px solid',
    marginBottom: 20,
    display: 'flex',
    justifyContent: 'space-between',
  },
  resetBtn:{
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: '10px 25px',
    height: 'auto',
    cursor: 'pointer',
    marginLeft: '20px',
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    },
  },
  resetInput:{
    backgroundColor: theme.palette.common.white,
    border: '1px solid',    
    borderColor: theme.palette.grey[500],
    marginTop: '10px',
    '& input' :{
      padding: '20px 12px 5px',
    },
  },
  resetArea:{
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row-reverse',
  },
  resetLoader:{
    display: 'block',
    margin: '0 auto'
  },
}))(HandleTemplateContainer);
