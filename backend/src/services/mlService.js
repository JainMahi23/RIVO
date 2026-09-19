import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

const mlClient = axios.create({
  baseURL: `${ML_SERVICE_URL}/ml`,
  timeout: 10000,
});

export async function scoreBusiness(payload) {
  try {
    const response = await mlClient.post('/score', payload);
    return response.data;
  } catch (error) {
    console.error('Error calling ML service /ml/score:', error.message);
    if (error.response) {
       console.error('ML service response error:', error.response.data);
    }
    throw new Error('Machine Learning service is currently unavailable.');
  }
}
