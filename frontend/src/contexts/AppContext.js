import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import api from '../services/api';

const AppContext = createContext();

// Action types
const ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_PROJECTS: 'SET_PROJECTS',
  SET_MARKET_DATA: 'SET_MARKET_DATA',
  SET_ANALYTICS: 'SET_ANALYTICS',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case ACTION_TYPES.SET_USER:
      return { ...state, user: action.payload };
    
    case ACTION_TYPES.SET_PROJECTS:
      return { ...state, projects: action.payload };
    
    case ACTION_TYPES.SET_MARKET_DATA:
      return { ...state, marketData: action.payload };
    
    case ACTION_TYPES.SET_ANALYTICS:
      return { ...state, analytics: action.payload };
    
    case ACTION_TYPES.SET_ERROR:
      return { ...state, error: action.payload };
    
    case ACTION_TYPES.CLEAR_ERROR:
      return { ...state, error: null };
    
    default:
      return state;
  }
};

const initialState = {
  isLoading: false,
  user: null,
  projects: [],
  marketData: null,
  analytics: null,
  error: null
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { enqueueSnackbar } = useSnackbar();

  const setLoading = (loading) => {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: loading });
  };

  const setUser = (user) => {
    dispatch({ type: ACTION_TYPES.SET_USER, payload: user });
  };

  const setProjects = (projects) => {
    dispatch({ type: ACTION_TYPES.SET_PROJECTS, payload: projects });
  };

  const setMarketData = (marketData) => {
    dispatch({ type: ACTION_TYPES.SET_MARKET_DATA, payload: marketData });
  };

  const setAnalytics = (analytics) => {
    dispatch({ type: ACTION_TYPES.SET_ANALYTICS, payload: analytics });
  };

  const setError = (error) => {
    dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error });
    enqueueSnackbar(error, { variant: 'error' });
  };

  const clearError = () => {
    dispatch({ type: ACTION_TYPES.CLEAR_ERROR });
  };

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      if (state.user) {
        setLoading(true);
        try {
          const [projectsRes, marketRes] = await Promise.all([
            api.get('/projects?limit=6'),
            api.get('/market/overview')
          ]);
          
          setProjects(projectsRes.data.projects);
          setMarketData(marketRes.data);
        } catch (error) {
          console.error('Error loading initial data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadInitialData();
  }, [state.user]);

  const value = {
    ...state,
    setLoading,
    setUser,
    setProjects,
    setMarketData,
    setAnalytics,
    setError,
    clearError
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};