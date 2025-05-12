const express = require('express');
const router = express.Router();
const buildsController = require('../controllers/buildsController');

// GET all builds
router.get('/', buildsController.getAllBuilds);

// POST a new build
router.post('/', buildsController.createBuild);

//PUT route for updating a build
router.put('/:id', buildsController.updateBuild);

// DELETE a build
router.delete('/:id', buildsController.deleteBuild);

module.exports = router;
// This code defines the routes for the builds API. It imports the necessary modules, sets up the router, and defines two routes: one for getting all builds and another for creating a new build. The actual logic for handling these requests is defined in the `buildsController` module, which is imported at the top of the file. Finally, the router is exported for use in other parts of the application.
//           <label className="block font-semibold">Base Class</label>