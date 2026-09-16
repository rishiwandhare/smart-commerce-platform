// ==============================================================================
// Authentication & Persona Context
// Provides logged-in state, role authorization, and 1-click persona switching
// ==============================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_PERSONAS } from '../data/mockUsers';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Default to Customer persona for instant interactive exploration
  const [currentUser, setCurrentUser] = useState(() => {
    const savedRole = localStorage.getItem('price_comparator_active_persona');
    return MOCK_PERSONAS[savedRole] || MOCK_PERSONAS.customer;
  });

  const [activePersonaRole, setActivePersonaRole] = useState(currentUser.role);

  // Switch persona helper (Customer, Shopkeeper, Admin)
  const switchPersona = (role) => {
    if (MOCK_PERSONAS[role]) {
      const persona = MOCK_PERSONAS[role];
      setCurrentUser(persona);
      setActivePersonaRole(role);
      localStorage.setItem('price_comparator_active_persona', role);
    }
  };

  const login = (email, password, role = 'customer') => {
    switchPersona(role);
    return true;
  };

  const logout = () => {
    // Revert to demo guest or customer
    switchPersona('customer');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activePersonaRole,
        switchPersona,
        login,
        logout,
        isCustomer: currentUser?.role === 'customer',
        isShopkeeper: currentUser?.role === 'shopkeeper',
        isAdmin: currentUser?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
