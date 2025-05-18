const pool = require('../data/db'); // PostgreSQL connection pool
const requireAuth = require('../middleware/requireAuth');

// GET all builds
const getAllBuilds = async (req, res) => {
  try {
    const buildsResult = await pool.query('SELECT * FROM builds ORDER BY created_at DESC');
    const builds = buildsResult.rows;

    // Get all units in a single query
    const unitsResult = await pool.query('SELECT * FROM units ORDER BY id ASC');
    const units = unitsResult.rows;

    // Group units by build_id
    const buildsWithUnits = builds.map(build => ({
      ...build,
      army: units.filter(unit => unit.build_id === build.id),
    }));

    res.status(200).json(buildsWithUnits);
  } catch (err) {
    console.error('Error fetching builds:', err);
    res.status(500).json({ error: 'Failed to fetch builds' });
  }
};

// POST a new build
const createBuild = [requireAuth, async (req, res) => {
  const client = await pool.connect();
  try {
    const { title, notes, is_public, army } = req.body;
    const userId = req.user.id;

    await client.query('BEGIN');

    // Insert the build record
    const buildResult = await client.query(
      'INSERT INTO builds (title, notes, is_public, user_id) VALUES ($1, $2, $3, $4) RETURNING id',
      [title, notes, is_public, userId]
    );
    const buildId = buildResult.rows[0].id;

    // Insert each unit into the units table
    for (const unit of army) {
      const {
        name,
        base_class,
        promoted_class,
        notes,
        inventory,
        weapon_mastery,
        supports,
        stats
      } = unit;

      await client.query(
        `INSERT INTO units (
          build_id, name, base_class, promoted_class, inventory, notes,
          weapon_mastery, supports,
          strmag, skill, speed, luck, defense, resistance, move, constitution
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8,
          $9, $10, $11, $12, $13, $14, $15, $16
        )`,
        [
          buildId,
          name,
          base_class,
          promoted_class,
          Array.isArray(inventory)
            ? inventory.map(item =>
                typeof item === 'string' ? item : item?.name || ""
              )
            : ["", "", "", "", ""],
          notes,
          weapon_mastery,
          supports,
          stats.strmag,
          stats.skill,
          stats.speed,
          stats.luck,
          stats.defense,
          stats.resistance,
          stats.move,
          stats.constitution
        ]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ message: 'Build created successfully', buildId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating build:', err);
    res.status(500).json({ error: 'Failed to create build' });
  } finally {
    client.release();
  }
}];

const updateBuild = [requireAuth, async (req, res) => {
  const buildId = parseInt(req.params.id, 10);
  if (isNaN(buildId)) {
    console.error('❌ Invalid build ID:', req.params.id);
    return res.status(400).json({ error: 'Invalid build ID' });
  }

  const { title, army, notes, is_public } = req.body;

  try {
    await pool.query(
      'UPDATE builds SET title = $1, notes = $2, is_public = $3 WHERE id = $4 and user_id = $5',
      [title, notes, is_public, buildId, req.user.id]
    );

    await pool.query('DELETE FROM units WHERE build_id = $1', [buildId]);

    for (const unit of army) {
      const {
        name,
        base_class,
        promoted_class,
        stats,
        inventory,
        weapon_mastery,
        supports,
        notes
      } = unit;

      await pool.query(
        `INSERT INTO units 
         (build_id, name, base_class, promoted_class, strmag, skill, speed, luck, defense, resistance, move, constitution, inventory, weapon_mastery, supports, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        [
          buildId,
          name,
          base_class,
          promoted_class,
          stats.strmag,
          stats.skill,
          stats.speed,
          stats.luck,
          stats.defense,
          stats.resistance,
          stats.move,
          stats.constitution,
          Array.isArray(inventory)
            ? inventory.map(item =>
                typeof item === 'string' ? item : item?.name || ""
              )
            : ["", "", "", "", ""],
          weapon_mastery,
          supports,
          notes
        ]
      );
    }

    res.status(200).json({ message: 'Build updated successfully' });
  } catch (err) {
    console.error('Error updating build:', err);
    res.status(500).json({ error: 'Failed to update build' });
  }
}];


// DELETE a build
const deleteBuild = [requireAuth, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  console.log("Delete request received for ID:", req.params.id, "Parsed ID:", id);

  if (isNaN(id)) {
  return res.status(400).json({ error: "Invalid build ID" });
  }

  try {
    await pool.query('DELETE FROM builds WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    res.status(204).send(); // 204 = No Content
  } catch (err) {
    console.error('Error deleting build:', err);
    res.status(500).json({ error: 'Failed to delete build' });
  }
}];


module.exports = {
  getAllBuilds,
  createBuild,
  updateBuild,
  deleteBuild
};
