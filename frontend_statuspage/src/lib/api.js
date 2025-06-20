import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

export async function fetchStatusHistory() {
  try {
    const response = await axios.get(`${API_URL}/api/status/history`);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching status history:', error);
    throw error;
  }
}

