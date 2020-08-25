/* eslint-disable react/forbid-prop-types */
import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import InfographicConfig from '../../../static/infographics/Infographic_Config.png';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '40px',
    marginTop: '147px',
    '& img': {
      maxWidth: '100%',
      margin: '0 auto',
      display: 'block'
    }
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
    height: '48px',
    display: 'block'
  }
}));

const TabPlaceholder = () => {
  const classes = useStyles();
  return (
    <Fragment>
      <Container maxWidth="xl">
        <Typography component="div" className={classes.root}>
          <span className={classes.tabContainer}></span>
          <img src={InfographicConfig} alt="Infographic Configuration" />
        </Typography>
      </Container>
    </Fragment>
  );
};

export default TabPlaceholder;
