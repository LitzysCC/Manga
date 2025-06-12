// controllers/mangaController.js
import pool from '../db/pool.js';

export async function createManga(manga) {
  const { title, transmicion, genero, fecha, volumen, autor } = manga;
  const result = await pool.query(
    'INSERT INTO "Manga" (title, "Transmicion", "Genero", "Fecha_Publicacion", "Volumen", autor) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [title, transmicion, genero, fecha, volumen, autor]
  );
  return result.rows[0];
}

export async function getAllManga() {
  const result = await pool.query('SELECT * FROM "Manga"');
  return result.rows;
}

export async function getMangaById(id) {
  const result = await pool.query('SELECT * FROM "Manga" WHERE id = $1', [id]);
  return result.rows[0];
}

export async function updateManga(id, updatedData) {
  const { title, transmicion, genero, fecha, volumen, autor } = updatedData;
  const result = await pool.query(
    `UPDATE "Manga" SET title = $1, "Transmicion" = $2, "Genero" = $3, "Fecha_Publicacion" = $4, "Volumen" = $5, autor = $6 WHERE id = $7 RETURNING *`,
    [title, transmicion, genero, fecha, volumen, autor, id]
  );
  return result.rows[0];
}

export async function deleteManga(id) {
  await pool.query('DELETE FROM "Manga" WHERE id = $1', [id]);
  return { message: 'Manga eliminado' };
}
