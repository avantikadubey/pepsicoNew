import React from 'react';
import { Global } from '@emotion/core';

export default () => (
  <Global
    styles={() => ({
      body: {
        backgroundColor: '#fafafa'
      }
    })}
  />
);
