import { pool } from './db.js';
import { createApp } from './app.js';

await pool.query('SELECT 1');
console.log('Database connected');
const app = await createApp();
app.listen(3000, () => console.log('Server: http://localhost:3000'));
