import axios from 'axios';
import * as MockAdapter from 'axios-mock-adapter';
import chainsJSON from '../../data/planogram-stores.json';
import configsJSON from '../../data/planogram-configs.json';
import pogsJSON from '../../data/planogram-annotation.json';
import pogsTwoJSON from '../../data/planogram-annotation-two.json';
import productsJson from '../../data/planogram-search-products.json';
import backStockProductsJson from '../../data/planogram-product-backstock.json';
const mockAPIs = process.env.MOCK_APIS || 'false';
const planogramURL = `${process.env.PLANOGRAM_API_URL}`;
// This sets the mock adapter on the default instance
const initMock = () => {
  const mock = new MockAdapter(axios);
  // Mock any GET request to /users
  // arguments for reply are (status, data, headers)
  // Get planograms allocation for given configuration ID
  mock.onGet('/pogs', { params: { configId: 'config_1' } }).reply(200, pogsJSON);
  mock.onGet('/pogs', { params: { configId: 'config_2' } }).reply(200, pogsTwoJSON);
  // Get Chains and Stores
  mock.onGet('/stores').reply(200, chainsJSON);
  // Get the configurations for given store
  mock.onGet('/configs').reply(200, configsJSON);
  mock.onGet('/search').reply(200, productsJson);
  mock.onGet('/backstock').reply(200, backStockProductsJson);
};

if (mockAPIs === 'true') {
  initMock();
}

const instance = axios.create({
  baseURL: planogramURL
});

export default instance;
