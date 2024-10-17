import axios from 'axios';
import authHeader from './authHeader';

const API_URL = 'http://localhost:8080/api/years';

class YearsService {
  getYears() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  getTheories(topicId) {
    return axios.get(`http://localhost:8080/api/topics/${topicId}/theories`, { headers: authHeader() });
  }
  
}

export default new YearsService();
