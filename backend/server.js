const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://rajvardhan_nscu:Sanam%401985@premium12.web-hosting.com:5432/rajvardhan_nscu_website_db',
  ssl: {
    rejectUnauthorized: false
  }
});

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// JWT secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Initialize database tables
async function initializeTables() {
  const client = await pool.connect();
  try {
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(50) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Students table
    await client.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(100) REFERENCES users(user_id),
        student_id VARCHAR(100) UNIQUE NOT NULL,
        program VARCHAR(255),
        year_of_study INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Fee transactions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS fee_transactions (
        id SERIAL PRIMARY KEY,
        student_id VARCHAR(100),
        amount DECIMAL(10,2),
        transaction_type VARCHAR(100),
        status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // SMTP settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS smtp_settings (
        id SERIAL PRIMARY KEY,
        smtp_host VARCHAR(255),
        smtp_port INTEGER,
        smtp_user VARCHAR(255),
        smtp_password VARCHAR(255),
        from_email VARCHAR(255),
        from_name VARCHAR(255),
        encryption_type VARCHAR(10),
        is_active BOOLEAN DEFAULT true
      )
    `);

    // Courses table
    await client.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        course_code VARCHAR(20) UNIQUE NOT NULL,
        course_name VARCHAR(255) NOT NULL,
        credits INTEGER,
        department VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Student courses table
    await client.query(`
      CREATE TABLE IF NOT EXISTS student_courses (
        id SERIAL PRIMARY KEY,
        student_id VARCHAR(100),
        course_id INTEGER REFERENCES courses(id),
        semester VARCHAR(20),
        grade VARCHAR(5),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create default admin user if not exists
    const adminCheck = await client.query('SELECT * FROM users WHERE user_id = $1', ['admin']);
    if (adminCheck.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      await client.query(`
        INSERT INTO users (user_id, password, full_name, email, role, is_active)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, ['admin', hashedPassword, 'System Administrator', 'admin@nscu.govt.ac', 'admin', true]);
    }

    console.log('Database tables initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    client.release();
  }
}

// Authentication routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { userId, password } = req.body;
    
    const result = await pool.query(
      'SELECT * FROM users WHERE user_id = $1 AND is_active = true',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        user_id: user.user_id, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        user_id: user.user_id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        is_active: user.is_active
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User routes
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, user_id, email, full_name, role, is_active, created_at FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/users', authenticateToken, async (req, res) => {
  try {
    const { user_id, password, email, full_name, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const result = await pool.query(`
      INSERT INTO users (user_id, password, email, full_name, role, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, user_id, email, full_name, role, is_active, created_at
    `, [user_id, hashedPassword, email, full_name, role, true]);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/users/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    
    const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const values = [userId, ...Object.values(updates)];
    
    const result = await pool.query(`
      UPDATE users SET ${setClause}
      WHERE user_id = $1
      RETURNING id, user_id, email, full_name, role, is_active, created_at
    `, values);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Students routes
app.get('/api/students', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/students', authenticateToken, async (req, res) => {
  try {
    const { user_id, student_id, program, year_of_study } = req.body;
    
    const result = await pool.query(`
      INSERT INTO students (user_id, student_id, program, year_of_study)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [user_id, student_id, program, year_of_study]);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// SMTP settings routes
app.get('/api/smtp-settings', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM smtp_settings WHERE is_active = true LIMIT 1');
    res.json(result.rows[0] || null);
  } catch (error) {
    console.error('Error fetching SMTP settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/smtp-settings', authenticateToken, async (req, res) => {
  try {
    const settings = req.body;
    
    // Delete existing settings and insert new ones
    await pool.query('DELETE FROM smtp_settings');
    
    const result = await pool.query(`
      INSERT INTO smtp_settings (smtp_host, smtp_port, smtp_user, smtp_password, from_email, from_name, encryption_type, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [settings.smtp_host, settings.smtp_port, settings.smtp_user, settings.smtp_password, settings.from_email, settings.from_name, settings.encryption_type, true]);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating SMTP settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fee transactions routes
app.get('/api/fee-transactions/student/:studentId', authenticateToken, async (req, res) => {
  try {
    const { studentId } = req.params;
    const result = await pool.query('SELECT * FROM fee_transactions WHERE student_id = $1', [studentId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching fee transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Courses routes
app.get('/api/courses', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM courses');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeTables();
});

module.exports = app;