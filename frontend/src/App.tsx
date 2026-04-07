import { useEffect } from 'react';
import { ThemeProvider } from './components/shared/theme-provider';
import { Navigation } from './components/layout/Navigation';
import { ChatPage } from './pages/ChatPage';
import { IntelligencePage } from './pages/IntelligencePage';
import { DocumentationPage } from './pages/DocumentationPage';
import { SearchPage } from './pages/SearchPage';
import { LoginPage } from './pages/LoginPage';
import { UserManagementPage } from '@/pages/UserManagementPage';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { ContractHistoryProvider } from './contexts/ContractHistoryContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import { useRouter, RouterProvider } from './lib/useRouter';
import './App.css';

function MainApp() {
  const { currentPage, navigate } = useRouter();
  const { isLoading, isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && currentPage === 'login') {
      navigate('intelligence');
    } else if (!isAuthenticated && currentPage !== 'login') {
      navigate('login');
    }
  }, [isAuthenticated, currentPage, navigate, isLoading]);

  if (currentPage === 'login') {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'chat':
        return <ChatPage />;
      case 'intelligence':
        return <IntelligencePage />;
      case 'agents':
        return <DocumentationPage />;
      case 'search':
        return (
          <ErrorBoundary>
            <SearchPage />
          </ErrorBoundary>
        );
      case 'users':
        return <UserManagementPage />;
      default:
        return <IntelligencePage />;
    }
  };

  return (
    <ProtectedRoute>
      <Navigation currentPage={currentPage} onNavigate={navigate} />
      <div className="mt-8">
        {renderPage()}
      </div>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <RouterProvider initialPage="intelligence">
      <AuthProvider>
        <ContractHistoryProvider>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <div className="min-h-screen bg-slate-50">
              <div className="mx-auto max-w-7xl p-6">
                <MainApp />
              </div>
            </div>
          </ThemeProvider>
        </ContractHistoryProvider>
      </AuthProvider>
    </RouterProvider>
  );
}

export default App;