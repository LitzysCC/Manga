import pg from 'pg';
import readline from 'readline';

const { Pool } = pg;

const pool = new Pool({
  user: 'postgres.aypeafbpzlevlcnsrjjs',
  host: 'aws-0-us-east-2.pooler.supabase.com',
  database: 'postgres',
  password: 'Litzy2023',
  port: 6543,
  ssl: { rejectUnauthorized: false },
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Utilidad para preguntar algo y esperar respuesta
function preguntar(pregunta) {
  return new Promise((resolve) => {
    rl.question(pregunta, (respuesta) => resolve(respuesta));
  });
}

// ✅ Crear manga con datos del usuario
async function crearManga() {
  const title = await preguntar('Título: ');
  const transmision = await preguntar('¿Está en transmisión? (true/false): ');
  const genero = await preguntar('Género: ');
  const fecha = await preguntar('Fecha de publicación (YYYY-MM-DD): ');
  const volumen = await preguntar('Número de volúmenes: ');
  const autor = await preguntar('Autor: ');

  const result = await pool.query(
    'INSERT INTO "Manga" (title, "Transmicion", "Genero", "Fecha_Publicacion", "Volumen", autor) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [title, transmision === 'true', genero, fecha, parseInt(volumen), autor]
  );

  console.log('\n✅ Manga creado:\n', result.rows[0]);
}

// 📋 Mostrar todos los mangas en tabla
async function leerMangas() {
  const result = await pool.query('SELECT * FROM "Manga" ORDER BY id');

  console.log('\n📚 Lista de mangas:\n');
  console.table(result.rows);
}

// ✏️ Actualizar manga con datos del usuario
async function actualizarManga() {
  const id = await preguntar('ID del manga a actualizar: ');
  const title = await preguntar('Nuevo título: ');
  const transmision = await preguntar('¿Está en transmisión? (true/false): ');
  const genero = await preguntar('Nuevo género: ');
  const fecha = await preguntar('Nueva fecha de publicación (YYYY-MM-DD): ');
  const volumen = await preguntar('Nuevo número de volúmenes: ');
  const autor = await preguntar('Nuevo autor: ');

  const result = await pool.query(
    'UPDATE "Manga" SET title = $1, "Transmicion" = $2, "Genero" = $3, "Fecha_Publicacion" = $4, "Volumen" = $5, autor = $6 WHERE id = $7 RETURNING *',
    [title, transmision === 'true', genero, fecha, parseInt(volumen), autor, parseInt(id)]
  );

  console.log('\n✏️ Manga actualizado:\n', result.rows[0]);
}

// 🗑️ Eliminar manga por ID
async function eliminarManga() {
  const id = await preguntar('ID del manga a eliminar: ');
  const result = await pool.query('DELETE FROM "Manga" WHERE id = $1 RETURNING *', [parseInt(id)]);
  if (result.rowCount > 0) {
    console.log('\n🗑️ Manga eliminado:\n', result.rows[0]);
  } else {
    console.log('\n❌ No se encontró un manga con ese ID.');
  }
}

// Menú
function mostrarMenu() {
  console.log('\n=== MENÚ CRUD MANGAS ===');
  console.log('1. Crear manga');
  console.log('2. Ver todos los mangas');
  console.log('3. Actualizar manga');
  console.log('4. Eliminar manga');
  console.log('5. Salir');

  rl.question('\nSelecciona una opción: ', async (opcion) => {
    switch (opcion) {
      case '1':
        await crearManga();
        break;
      case '2':
        await leerMangas();
        break;
      case '3':
        await actualizarManga();
        break;
      case '4':
        await eliminarManga();
        break;
      case '5':
        console.log('👋 Cerrando aplicación...');
        rl.close();
        await pool.end();
        return;
      default:
        console.log('❌ Opción no válida.');
    }

    mostrarMenu();
  });
}

// Ejecutar menú
mostrarMenu();
