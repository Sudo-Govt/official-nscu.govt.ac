const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('nscu_token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    return response.json();
  }

  // Authentication
  async login(userId: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ userId, password }),
    });
  }

  // User operations
  async getAllUsers() {
    return this.request('/users');
  }

  async createUser(userData: any) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId: string, updates: any) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteUser(userId: string) {
    return this.request(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // Student operations
  async getAllStudents() {
    return this.request('/students');
  }

  async createStudent(studentData: any) {
    return this.request('/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  }

  async getStudentByUserId(userId: string) {
    return this.request(`/students/by-user/${userId}`);
  }

  // Fee transactions
  async getFeeTransactionsByStudent(studentId: string) {
    return this.request(`/fee-transactions/student/${studentId}`);
  }

  async createFeeTransaction(transactionData: any) {
    return this.request('/fee-transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  // SMTP settings
  async getSmtpSettings() {
    return this.request('/smtp-settings');
  }

  async updateSmtpSettings(settingsData: any) {
    return this.request('/smtp-settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    });
  }

  // Courses
  async getAllCourses() {
    return this.request('/courses');
  }

  async getStudentCourses(studentId: string) {
    return this.request(`/courses/student/${studentId}`);
  }
}

export const apiService = new ApiService();