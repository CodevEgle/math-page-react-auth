import axios from 'axios';
import authHeader from './authHeader';

const API_URL = 'http://localhost:8080/api/years';

class YearsService {
  getYears() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  createYear(newYear){
    return axios.post(`http://localhost:8080/api/years`, newYear, {
      headers: authHeader(),
    });
  }
  
  deleteYear(id) {
    return axios.delete(`http://localhost:8080/api/years/${id}`, {
      headers: authHeader(),
    });
  }
  
  editYear(id, updatedYear) {
    return axios.put(`http://localhost:8080/api/years/edit/${id}`, updatedYear, {
      headers: authHeader(),
    });
  }

  getTheories(topicId) {
    return axios.get(`http://localhost:8080/api/topics/${topicId}/theories`, { headers: authHeader() });
  }

  getAssessmentQuestions(assessmentId) {
    return axios.get(`http://localhost:8080/api/assessments/${assessmentId}/questions`, {
      headers: authHeader(),
    });
  }
  getAssessmentsByTopicId(topicId) {
    return axios.get(`http://localhost:8080/api/topics/${topicId}/assessments`, { headers: authHeader() });
  }

  submitGrade(gradeDto) {
    return axios.post(`http://localhost:8080/api/grades/add`, gradeDto, { headers: authHeader() });
  }
  
  getGrades(userId) {
    return axios.get(`http://localhost:8080/api/grades/${userId}`, { headers: authHeader() });
  }
}

export default new YearsService();
