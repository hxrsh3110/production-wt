import API from './client';

export const systemApi = {
  getHealth: () => API.get('/system/health'),
  getFactorial: (n) => API.get('/system/algorithms/factorial', { params: { n } }),
  getVolumeTable: (load, sets) => API.get('/system/algorithms/volume-table', { params: { load, sets } }),
  getMacrocycleSum: (days) => API.get('/system/algorithms/sum-n', { params: { days } }),
  getPackages: () => API.get('/system/packages')
};

export default systemApi;
