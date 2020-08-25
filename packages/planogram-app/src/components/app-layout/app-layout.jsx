import React, { Fragment } from 'react';
import { SEO } from '@planogram/core';
import { AuthContext } from '@dxp/okta';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import AppContainer from '../app-container/app-container';
import GlobalStyles from './global-styles';
import content from '../../../data/staticData';

// Styles for the Okta widget
// Display only if show is true
// Else hide the widget
const oktaIDStyles = (show) => {
  return show
    ? {
        width: '100%',
        minHeight: '100vh',
        maxHeight: '100%',
        position: 'absolute',
        background: '#fafafa',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        margin: '0 auto',
        zIndex: 10000
      }
    : {
        display: 'none'
      };
};

const BY_PASS_SECURITY = process.env.BY_PASS_SECURITY || 'false';

class AppLayout extends React.Component {
  render() {
    const labels = {
      headerLabels: content.headerContainer,
      inventoryLabels: content.inventoryContainer,
      planogramLabels: content.mediaCardContainer,
      tabs: content.tabs
    };

    return (
      <Fragment>
        <GlobalStyles />
        <SEO title="Planogram configure" />
        {BY_PASS_SECURITY === 'false' && (
          <AuthContext.Consumer>
            {({ user, logoutUser, checkingSession }) => {
              // console.log(`checking session = ${checkingSession}`);
              return (
                <Fragment>
                  {checkingSession && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        margin: '20px',
                        background: '#fff',
                        zIndex: 10
                      }}
                    >
                      <CircularProgress size={24} color="primary" />
                      <Typography
                        variant="caption"
                        gutterBottom
                        align="center"
                        style={{
                          padding: '5px'
                        }}
                      >
                        Authenticating ...
                      </Typography>
                    </div>
                  )}
                  <div id="okta" style={oktaIDStyles(user === false)} />
                  {!checkingSession && (
                    <AppContainer
                      labels={labels}
                      user={user}
                      logoutUser={logoutUser}
                    />
                  )}
                </Fragment>
              );
            }}
          </AuthContext.Consumer>
        )}
        {BY_PASS_SECURITY === 'true' && (
          <AppContainer
            labels={labels}
            user={'Test User'}
            logoutUser={() => console.log('log out')}
          />
        )}
      </Fragment>
    );
  }
}

export default AppLayout;
