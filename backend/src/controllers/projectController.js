const projectService = require('../services/projectService');
const { validateProjectData } = require('../utils/validators');
const logger = require('../utils/logger');

class ProjectController {
  async createProject(req, res) {
    try {
      const projectData = {
        ...req.body,
        ownerAddress: req.user.walletAddress
      };

      const validationErrors = validateProjectData(projectData);
      if (validationErrors.length > 0) {
        return res.status(400).json({ 
          error: 'Validation failed', 
          details: validationErrors 
        });
      }

      const project = await projectService.createProject(projectData);
      
      res.status(201).json({
        message: 'Project created successfully',
        project
      });
    } catch (error) {
      logger.error('Error creating project:', error);
      res.status(500).json({ error: 'Failed to create project' });
    }
  }

  async getProjects(req, res) {
    try {
      const { page, limit, projectType, status, vintageYear, search } = req.query;
      
      const filters = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        projectType,
        status,
        vintageYear,
        search
      };

      const result = await projectService.getProjects(filters);
      
      res.json(result);
    } catch (error) {
      logger.error('Error getting projects:', error);
      res.status(500).json({ error: 'Failed to get projects' });
    }
  }

  async getProject(req, res) {
    try {
      const { projectId } = req.params;
      const project = await projectService.getProjectById(projectId);
      
      res.json({ project });
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).json({ error: error.message });
      }
      logger.error('Error getting project:', error);
      res.status(500).json({ error: 'Failed to get project' });
    }
  }

  async updateProject(req, res) {
    try {
      const { projectId } = req.params;
      const updateData = req.body;

      // Check if user owns the project or is admin
      const project = await projectService.getProjectById(projectId);
      if (project.ownerAddress !== req.user.walletAddress && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to update this project' });
      }

      const updatedProject = await projectService.updateProject(projectId, updateData);
      
      res.json({
        message: 'Project updated successfully',
        project: updatedProject
      });
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).json({ error: error.message });
      }
      logger.error('Error updating project:', error);
      res.status(500).json({ error: 'Failed to update project' });
    }
  }

  async verifyProject(req, res) {
    try {
      const { projectId } = req.params;
      
      if (req.user.role !== 'verifier' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to verify projects' });
      }

      const project = await projectService.verifyProject(projectId, req.user.walletAddress);
      
      res.json({
        message: 'Project verified successfully',
        project
      });
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).json({ error: error.message });
      }
      logger.error('Error verifying project:', error);
      res.status(500).json({ error: 'Failed to verify project' });
    }
  }

  async getUserProjects(req, res) {
    try {
      const projects = await projectService.getUserProjects(req.user.walletAddress);
      
      res.json({ projects });
    } catch (error) {
      logger.error('Error getting user projects:', error);
      res.status(500).json({ error: 'Failed to get user projects' });
    }
  }

  async getProjectStats(req, res) {
    try {
      const stats = await projectService.getProjectStats();
      
      res.json(stats);
    } catch (error) {
      logger.error('Error getting project stats:', error);
      res.status(500).json({ error: 'Failed to get project statistics' });
    }
  }

  async deleteProject(req, res) {
    try {
      const { projectId } = req.params;

      const project = await projectService.getProjectById(projectId);
      if (project.ownerAddress !== req.user.walletAddress && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to delete this project' });
      }

      await project.destroy();
      
      res.json({ message: 'Project deleted successfully' });
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).json({ error: error.message });
      }
      logger.error('Error deleting project:', error);
      res.status(500).json({ error: 'Failed to delete project' });
    }
  }
}

module.exports = new ProjectController();