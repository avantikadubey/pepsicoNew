/* eslint-disable react/require-default-props */

import React, { Fragment, useEffect } from 'react';
import { MessageBar } from '@planogram/design-system';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../@planogram/store/state/actions';

const MessageHandlingContainer = () => {
  const [open, setOpen] = React.useState(false);
  const [close, setClose] = React.useState(false);
  const notification = useSelector(({ pog }) => pog.notification);
  const message = useSelector(({ pog }) => pog.notificationMessage);
  const dispatch = useDispatch();
  const handleOpen = () => {
    if (notification && close === false) {
      setOpen(true);
    }
  };

  useEffect(() => {
    handleOpen();
  });

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setClose(true);
    setOpen(false);
    dispatch(actions.setNotification(false));
  };

  return (
    <Fragment>
      {message.text !== null && message.text !== '' && (<MessageBar handleClose={handleClose} open={notification} message={message.text} />)}
      {/* <MessageBar handleClose={handleClose} open={open} message={message.text} /> */}
    </Fragment>
  );
};

export default MessageHandlingContainer;
