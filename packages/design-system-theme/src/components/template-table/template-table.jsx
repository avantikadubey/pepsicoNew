import React from 'react';
import { forwardRef } from 'react';
import MaterialTable from 'material-table';
import PropTypes from 'prop-types';
import { ConfigModal } from './../config-modal';
import DeleteIcon from '@material-ui/icons/Delete';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Save from '@material-ui/icons/Save';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
const TemplateTable = ({isLoadingAssociateTemplate, saveAssocTemplate, data, loading, currentLoadingType, template, open, handleClose, handleOpen, modalType, deleteSelectedTemplate, configData, isLoadingTemplateDelete, handleOnChange, customPlanoName}) => {
  const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Save: forwardRef((props, ref) => <Save {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  };

  const [state, setState] = React.useState({
    columns: [
      { title: 'Template Name', field: 'templateName' },
    ],
    data: template,
  });
  console.log('table23');
  return (
    <div>
    <MaterialTable
      icons={tableIcons}
      title="Template List"
      columns={state.columns}
      data={state.data}
      actions={[
        {
          icon: tableIcons.Delete,
          tooltip: 'Delete template',
          onClick: (event, rowData) => {
          console.log('rowData', rowData);
          let data = {type:'deleteTemplate', rowData};
          handleOpen(data);
      }
        },
        {
          icon: tableIcons.Save,
          tooltip: 'Copy template',
          onClick: (event, rowData) => { console.log('333', event);
          let data = {type: 'copyTemplate', rowData}
          handleOpen(data);
        }
        },
      ]}
      options={{
        actionsColumnIndex: -1
      }}
    />
     <ConfigModal
       open={open}
        handleClose={handleClose}
        deleteSelectedTemplate={deleteSelectedTemplate}
        configData={configData}
        modalType={modalType}
        isLoadingTemplateDelete={isLoadingTemplateDelete}
        loading={loading}
        currentLoadingType={currentLoadingType}
        handleOnChange={handleOnChange}
        customPlanoName={customPlanoName}
        data={data}
        saveAssocTemplate={saveAssocTemplate}
        isLoadingAssociateTemplate={isLoadingAssociateTemplate}
      /> 
     </div>
  );
}

TemplateTable.propTypes = {
	template: PropTypes.array.isRequired,
}

export default TemplateTable