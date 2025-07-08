// api/candidates.js
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Verify JWT token for protected routes
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (req.method === 'GET') {
      // Get all candidates
      const result = await pool.query('SELECT * FROM candidates ORDER BY created_at DESC');
      res.status(200).json(result.rows);
      
    } else if (req.method === 'POST') {
      // Create new candidate
      const { name, roll_number, google_drive_link } = req.body;
      
      if (!name || !roll_number || !google_drive_link) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Check if roll number already exists
      const existingCandidate = await pool.query(
        'SELECT * FROM candidates WHERE roll_number = $1', 
        [roll_number]
      );
      
      if (existingCandidate.rows.length > 0) {
        return res.status(400).json({ message: 'Roll number already exists' });
      }

      const result = await pool.query(
        'INSERT INTO candidates (name, roll_number, google_drive_link) VALUES ($1, $2, $3) RETURNING *',
        [name, roll_number, google_drive_link]
      );
      
      res.status(201).json(result.rows[0]);
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Candidates API error:', error);
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ message: 'Invalid token' });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
