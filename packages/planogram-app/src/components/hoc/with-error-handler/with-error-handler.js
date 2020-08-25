import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Aux from '../aux-component/aux-component';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

const useStyles = makeStyles({
  root: {
    padding: 10,
    margin: 10
  }
});

const ErrorDialog = (props) => {
  const { onClose, open, title, message } = props;
  const classes = useStyles();
  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="simple-dialog-title"
      open={open}
      className={classes.root}
    >
      <DialogTitle id="simple-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {`Unable to load data due to : ${message}`}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

ErrorDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired
};

const withErrorHandler = (WrappedComponent, axios) => {
  return class extends Component {
    state = {
      error: null
    };

    componentWillMount() {
      this.reqInterceptor = axios.interceptors.request.use((req) => {
        this.setState({ error: null });
        return req;
      });
      this.resInterceptor = axios.interceptors.response.use(
        (res) => res,
        (error) => {
          if (error.response && error.response.data && error.response.data.errors){
            this.setState({ error:  {message : error.response.data.errors[0].message} });
          }else {
            this.setState({ error: error });
          }
        }
      );
    }

    componentWillUnmount() {
      if (
        typeof this.reqInterceptor !== 'undefined' &&
        this.reqInterceptor !== null
      ) {
        axios.interceptors.request.eject(this.reqInterceptor);
        axios.interceptors.response.eject(this.resInterceptor);
      }
    }

    errorConfirmedHandler = () => {
      this.setState({ error: null });
    };

    render() {
      return (
        <Aux>
          <ErrorDialog
            title="Error Loading Data"
            message={this.state.error ? this.state.error.message : ''}
            open={this.state.error !== null}
            onClose={this.errorConfirmedHandler}
          />
          <WrappedComponent {...this.props} />
        </Aux>
      );
    }
  };
};

export default withErrorHandler;
