import axios from 'axios';
import authHeader from './authHeader';

const API_URL = 'http://localhost:8080/api/users';

class UserService {
  getPublicContent() {
    return axios.get(API_URL + '/');
  }

  deleteUser(userId) {
    return axios.delete(API_URL + '/' + userId, { headers: authHeader() });
  }

  updateUser(userId, userData) {
    return axios.put(API_URL + '/' + userId, userData, { headers: authHeader() });
  }

  addRoleToUser(userId, roleName) {
    const role = { name: roleName };

    return axios.put(`${API_URL}/${userId}/roles`, role, { 
      headers: authHeader() 
    });
  }
  deleteRoleFromUser(userId, roleName) {
    const role = { name: roleName };
    return axios.delete(`${API_URL}/${userId}/roles`, {
      headers: authHeader(),
      data: role, // Send the role data in the request body
    });
  }

  getAllUsers() {
    return axios.get(API_URL + '/all', { headers: authHeader() });
  }

  getUserBoard() {
    return axios.get(API_URL + '/user', { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + '/mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + '/admin', { headers: authHeader() });
  }
}

export default new UserService();
