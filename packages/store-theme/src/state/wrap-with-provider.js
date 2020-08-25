import React from 'react';
import { Provider } from 'react-redux';
import { initStore } from './my-store';

import createStore from './create-store';

// eslint-disable-next-line react/display-name,react/prop-types
export default ({ element }) => {
  // Instantiating store in `wrapRootElement` handler ensures:
  //  - there is fresh store for each SSR page
  //  - it will be called only once in browser, when React mounts
  const store = createStore();
  // In case there is any initialization actions to be performed
  // initStore method will dispatch them
  initStore(store);

  return <Provider store={store}>{element}</Provider>;
};
