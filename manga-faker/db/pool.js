// db/pool.js
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',
  host: 'db.aypeafbpzlevlcnsrjjs.supabase.co',
  database: 'postgres',
  password: 'Litzy2023',
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

export default pool;
