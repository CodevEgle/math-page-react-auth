import axios from 'axios';

const API_URL = 'http://localhost:8080/api/years';

class YearsService {
  getYears() {
    return axios.get(API_URL);
  }
}

export default new YearsService();
