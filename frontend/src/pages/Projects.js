import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  InputAdornment
} from '@mui/material';
import {
  Add,
  Search,
  FilterList
} from '@mui/icons-material';

import { useApp } from '../contexts/AppContext';
import ProjectCard from '../components/ui/ProjectCard';
import { projectsAPI } from '../services/api';
import { PROJECT_TYPES, PROJECT_STATUS } from '../utils/constants';

const Projects = () => {
  const { setLoading, setError, projects, setProjects } = useApp();
  
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    projectType: '',
    status: '',
    vintageYear: ''
  });

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, filters]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const response = await projectsAPI.getProjects({ limit: 50 });
      setProjects(response.data.projects);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = [...projects];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Project type filter
    if (filters.projectType) {
      filtered = filtered.filter(project => project.projectType === filters.projectType);
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(project => project.status === filters.status);
    }

    // Vintage year filter
    if (filters.vintageYear) {
      filtered = filtered.filter(project => project.vintageYear.toString() === filters.vintageYear);
    }

    setFilteredProjects(filtered);
  };

  const handleFilterChange = (field) => (event) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      projectType: '',
      status: '',
      vintageYear: ''
    });
  };

  const getUniqueVintageYears = () => {
    const years = projects.map(project => project.vintageYear);
    return [...new Set(years)].sort((a, b) => b - a);
  };

  const projectTypeCounts = PROJECT_TYPES.reduce((acc, type) => {
    acc[type] = projects.filter(p => p.projectType === type).length;
    return acc;
  }, {});

  const statusCounts = Object.values(PROJECT_STATUS).reduce((acc, status) => {
    acc[status] = projects.filter(p => p.status === status).length;
    return acc;
  }, {});

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Environmental Projects
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Discover and support verified carbon reduction projects worldwide
        </Typography>
      </Box>

      {/* Filters and Search */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="end">
          {/* Search */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search projects"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Project Type Filter */}
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Project Type</InputLabel>
              <Select
                value={filters.projectType}
                label="Project Type"
                onChange={handleFilterChange('projectType')}
              >
                <MenuItem value="">All Types</MenuItem>
                {Object.entries(projectTypeCounts).map(([type, count]) => (
                  <MenuItem key={type} value={type}>
                    {type} ({count})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Status Filter */}
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={handleFilterChange('status')}
              >
                <MenuItem value="">All Status</MenuItem>
                {Object.entries(statusCounts).map(([status, count]) => (
                  <MenuItem key={status} value={status}>
                    {status} ({count})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Vintage Year Filter */}
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Vintage Year</InputLabel>
              <Select
                value={filters.vintageYear}
                label="Vintage Year"
                onChange={handleFilterChange('vintageYear')}
              >
                <MenuItem value="">All Years</MenuItem>
                {getUniqueVintageYears().map(year => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Actions */}
          <Grid item xs={12} sm={6} md={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={clearFilters}
                fullWidth
              >
                Clear
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Active Filters */}
        {(searchTerm || Object.values(filters).some(f => f)) && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {searchTerm && (
              <Chip
                label={`Search: "${searchTerm}"`}
                onDelete={() => setSearchTerm('')}
                size="small"
              />
            )}
            {filters.projectType && (
              <Chip
                label={`Type: ${filters.projectType}`}
                onDelete={() => handleFilterChange('projectType')({ target: { value: '' } })}
                size="small"
              />
            )}
            {filters.status && (
              <Chip
                label={`Status: ${filters.status}`}
                onDelete={() => handleFilterChange('status')({ target: { value: '' } })}
                size="small"
              />
            )}
            {filters.vintageYear && (
              <Chip
                label={`Year: ${filters.vintageYear}`}
                onDelete={() => handleFilterChange('vintageYear')({ target: { value: '' } })}
                size="small"
              />
            )}
          </Box>
        )}
      </Paper>

      {/* Results Count */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" component="h2">
          {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'} Found
        </Typography>
      </Box>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <Grid container spacing={3}>
          {filteredProjects.map((project) => (
            <Grid item xs={12} md={6} lg={4} key={project.projectId}>
              <ProjectCard 
                project={project} 
                showActions={true}
                onViewDetails={(project) => {
                  // Navigate to project details
                  window.location.href = `/projects/${project.projectId}`;
                }}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 8, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No projects found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm || Object.values(filters).some(f => f) 
              ? 'Try adjusting your search criteria or filters' 
              : 'No projects are currently available'
            }
          </Typography>
          {(searchTerm || Object.values(filters).some(f => f)) && (
            <Button variant="outlined" onClick={clearFilters}>
              Clear All Filters
            </Button>
          )}
        </Paper>
      )}
    </Container>
  );
};

export default Projects;