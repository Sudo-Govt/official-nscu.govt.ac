import bcrypt from 'bcryptjs';

// Mock database using localStorage
class MockDatabase {
  private getTable(tableName: string): any[] {
    const data = localStorage.getItem(`nscu_${tableName}`);
    return data ? JSON.parse(data) : [];
  }

  private setTable(tableName: string, data: any[]): void {
    localStorage.setItem(`nscu_${tableName}`, JSON.stringify(data));
  }

  // Initialize default data
  init() {
    // Create default admin user if not exists
    const users = this.getTable('users');
    const adminExists = users.find(u => u.user_id === 'admin');
    
    if (!adminExists) {
      const hashedPassword = bcrypt.hashSync('admin123', 12);
      users.push({
        id: 1,
        user_id: 'admin',
        password: hashedPassword,
        full_name: 'System Administrator',
        role: 'admin',
        email: 'admin@nscu.govt.ac',
        is_active: true,
        created_at: new Date().toISOString()
      });
      this.setTable('users', users);
    }

    // Create default SMTP settings
    const smtpSettings = this.getTable('smtp_settings');
    if (smtpSettings.length === 0) {
      smtpSettings.push({
        id: 1,
        smtp_host: 'localhost',
        smtp_port: 587,
        smtp_user: 'noreply@nscu.govt.ac',
        smtp_password: 'change_this_password',
        from_email: 'noreply@nscu.govt.ac',
        from_name: 'NSCU System',
        encryption_type: 'tls',
        is_active: true
      });
      this.setTable('smtp_settings', smtpSettings);
    }
  }

  // User operations
  getUserByUserId(userId: string) {
    const users = this.getTable('users');
    return users.find(u => u.user_id === userId && u.is_active);
  }

  getAllUsers() {
    return this.getTable('users');
  }

  createUser(userData: any) {
    const users = this.getTable('users');
    const newUser = {
      id: users.length + 1,
      ...userData,
      created_at: new Date().toISOString(),
      is_active: true
    };
    users.push(newUser);
    this.setTable('users', users);
    return newUser;
  }

  updateUser(userId: string, updates: any) {
    const users = this.getTable('users');
    const index = users.findIndex(u => u.user_id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      this.setTable('users', users);
      return users[index];
    }
    return null;
  }

  deleteUser(userId: string) {
    const users = this.getTable('users');
    const filtered = users.filter(u => u.user_id !== userId);
    this.setTable('users', filtered);
    return true;
  }

  // Student operations
  getAllStudents() {
    return this.getTable('students');
  }

  createStudent(studentData: any) {
    const students = this.getTable('students');
    const newStudent = {
      id: students.length + 1,
      ...studentData,
      created_at: new Date().toISOString()
    };
    students.push(newStudent);
    this.setTable('students', students);
    return newStudent;
  }

  getStudentByUserId(userId: string) {
    const students = this.getTable('students');
    return students.find(s => s.user_id === userId);
  }

  // Fee transaction operations
  getFeeTransactionsByStudent(studentId: string) {
    const transactions = this.getTable('fee_transactions');
    return transactions.filter(t => t.student_id === studentId);
  }

  createFeeTransaction(transactionData: any) {
    const transactions = this.getTable('fee_transactions');
    const newTransaction = {
      id: transactions.length + 1,
      ...transactionData,
      created_at: new Date().toISOString()
    };
    transactions.push(newTransaction);
    this.setTable('fee_transactions', transactions);
    return newTransaction;
  }

  // SMTP settings operations
  getSmtpSettings() {
    const settings = this.getTable('smtp_settings');
    return settings[0] || null;
  }

  updateSmtpSettings(settingsData: any) {
    const settings = this.getTable('smtp_settings');
    if (settings.length > 0) {
      settings[0] = { ...settings[0], ...settingsData };
    } else {
      settings.push({ id: 1, ...settingsData });
    }
    this.setTable('smtp_settings', settings);
    return settings[0];
  }

  // Course operations
  getAllCourses() {
    return this.getTable('courses');
  }

  getStudentCourses(studentId: string) {
    const studentCourses = this.getTable('student_courses');
    return studentCourses.filter(sc => sc.student_id === studentId);
  }
}

const mockDb = new MockDatabase();
mockDb.init();

export default mockDb;