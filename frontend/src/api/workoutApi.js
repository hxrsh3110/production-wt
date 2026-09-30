import API from './client';

export const workoutApi = {
  getLogs: () => API.get('/workouts'),
  logSet: (data) => API.post('/workouts', data),
  clearLogs: () => API.delete('/workouts'),
  getDiskLogs: () => API.get('/workouts/disk-logs'),
  pipeStream: (payload) => API.post('/workouts/stream-pipe', { payload })
};

export default workoutApi;
