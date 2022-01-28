import axios from 'axios';
import { FETCH_USER, SUBMIT_SURVEY } from './types';

const fetchUser = () => async (dispatch) => {
  const res = await axios.get('/api/current_user');
  dispatch({ type: FETCH_USER, payload: res.data });
};

const handleToken = (token) => async (dispatch) => {
  const res = await axios.post('/api/stripe', token);

  dispatch({ type: FETCH_USER, payload: res.data });
};

const submitSurvey = (values, navigate) => async (dispatch) => {
  const res = await axios.post('/api/surveys', values);

  console.log(navigate);
  navigate('/surveys');
  dispatch({ type: FETCH_USER, payload: res.data });
};

export { fetchUser, handleToken, submitSurvey };
