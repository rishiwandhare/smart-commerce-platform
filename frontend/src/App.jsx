import React from 'react';
import AppRouter from './routes/AppRouter';
import { AuthProvider } from './context/AuthContext';
import { UserPreferencesProvider } from './context/UserPreferencesContext';
import { ComparisonProvider } from './context/ComparisonContext';

function App() {
  return (
    <AuthProvider>
      <UserPreferencesProvider>
        <ComparisonProvider>
          <AppRouter />
        </ComparisonProvider>
      </UserPreferencesProvider>
    </AuthProvider>
  );
}

export default App;
