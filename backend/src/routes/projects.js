const express = require('express');
const projectController = require('../controllers/projectController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateProjectCreation, validatePagination } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/', validatePagination, projectController.getProjects);
router.get('/:projectId', projectController.getProject);
router.get('/stats/project-stats', projectController.getProjectStats);

// Protected routes
router.post('/', authenticateToken, validateProjectCreation, projectController.createProject);
router.get('/user/my-projects', authenticateToken, projectController.getUserProjects);
router.put('/:projectId', authenticateToken, projectController.updateProject);
router.delete('/:projectId', authenticateToken, projectController.deleteProject);

// Admin/Verifier routes
router.patch('/:projectId/verify', authenticateToken, requireRole(['verifier', 'admin']), projectController.verifyProject);

module.exports = router;