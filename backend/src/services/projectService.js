const { Project, User } = require('../models');
const logger = require('../utils/logger');

class ProjectService {
  async createProject(projectData) {
    try {
      // Generate unique project ID
      const projectId = `PROJ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const project = await Project.create({
        ...projectData,
        projectId
      });

      logger.info('Project created successfully:', { projectId: project.projectId });
      return project;
    } catch (error) {
      logger.error('Error creating project:', error);
      throw new Error('Failed to create project');
    }
  }

  async getProjects(filters = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        projectType,
        status,
        vintageYear,
        search
      } = filters;

      const where = {};
      
      if (projectType) where.projectType = projectType;
      if (status) where.status = status;
      if (vintageYear) where.vintageYear = parseInt(vintageYear);
      
      if (search) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { location: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ];
      }

      const offset = (page - 1) * limit;

      const { count, rows: projects } = await Project.findAndCountAll({
        where,
        include: [{
          model: User,
          as: 'owner',
          attributes: ['walletAddress', 'username', 'company']
        }],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: offset
      });

      return {
        projects,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting projects:', error);
      throw new Error('Failed to get projects');
    }
  }

  async getProjectById(projectId) {
    try {
      const project = await Project.findOne({
        where: { projectId },
        include: [{
          model: User,
          as: 'owner',
          attributes: ['walletAddress', 'username', 'company']
        }]
      });

      if (!project) {
        throw { status: 404, message: 'Project not found' };
      }

      return project;
    } catch (error) {
      if (error.status) throw error;
      logger.error('Error getting project:', error);
      throw new Error('Failed to get project');
    }
  }

  async updateProject(projectId, updateData) {
    try {
      const project = await Project.findOne({ where: { projectId } });
      
      if (!project) {
        throw { status: 404, message: 'Project not found' };
      }

      await project.update(updateData);
      logger.info('Project updated successfully:', { projectId });
      
      return project;
    } catch (error) {
      if (error.status) throw error;
      logger.error('Error updating project:', error);
      throw new Error('Failed to update project');
    }
  }

  async verifyProject(projectId, verifierAddress) {
    try {
      const project = await Project.findOne({ where: { projectId } });
      
      if (!project) {
        throw { status: 404, message: 'Project not found' };
      }

      await project.update({
        status: 'verified',
        verificationDate: new Date(),
        verifierAddress
      });

      logger.info('Project verified successfully:', { projectId, verifierAddress });
      return project;
    } catch (error) {
      if (error.status) throw error;
      logger.error('Error verifying project:', error);
      throw new Error('Failed to verify project');
    }
  }

  async getProjectStats() {
    try {
      const stats = await Project.findAll({
        attributes: [
          'projectType',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('SUM', sequelize.col('totalCredits')), 'totalCredits'],
          [sequelize.fn('SUM', sequelize.col('creditsIssued')), 'creditsIssued'],
          [sequelize.fn('SUM', sequelize.col('co2Reduction')), 'totalCO2Reduction']
        ],
        group: ['projectType']
      });

      const totalStats = await Project.findOne({
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('id')), 'totalProjects'],
          [sequelize.fn('SUM', sequelize.col('totalCredits')), 'totalCredits'],
          [sequelize.fn('SUM', sequelize.col('creditsIssued')), 'creditsIssued'],
          [sequelize.fn('SUM', sequelize.col('co2Reduction')), 'totalCO2Reduction']
        ]
      });

      return {
        byType: stats,
        total: totalStats
      };
    } catch (error) {
      logger.error('Error getting project stats:', error);
      throw new Error('Failed to get project statistics');
    }
  }

  async getUserProjects(walletAddress) {
    try {
      const projects = await Project.findAll({
        where: { ownerAddress: walletAddress },
        include: [{
          model: User,
          as: 'owner',
          attributes: ['walletAddress', 'username', 'company']
        }],
        order: [['createdAt', 'DESC']]
      });

      return projects;
    } catch (error) {
      logger.error('Error getting user projects:', error);
      throw new Error('Failed to get user projects');
    }
  }
}

module.exports = new ProjectService();