import React from 'react';
import { Button } from '../shared/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';
import { PageType } from '../../lib/useRouter';

interface NavigationProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="mb-8 border-b border-slate-200 bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-slate-800">Contract Intelligence</h1>
            <div className="flex space-x-1">
              <Button
                variant={currentPage === 'intelligence' ? 'default' : 'ghost'}
                onClick={() => onNavigate('intelligence')}
                className={`px-4 py-2 ${currentPage === 'intelligence' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'}`}
              >
                Document Analysis
              </Button>
              <Button
                variant={currentPage === 'chat' ? 'default' : 'ghost'}
                onClick={() => onNavigate('chat')}
                className={`px-4 py-2 ${currentPage === 'chat' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200'}`}
              >
                Contract Chat
              </Button>
              <Button
                variant={currentPage === 'search' ? 'default' : 'ghost'}
                onClick={() => onNavigate('search')}
                className={`px-4 py-2 ${currentPage === 'search' ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200'}`}
              >
                Enhanced Search
              </Button>
              <Button
                variant={currentPage === 'agents' ? 'default' : 'ghost'}
                onClick={() => onNavigate('agents')}
                className={`px-4 py-2 ${currentPage === 'agents' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200'}`}
              >
                Documentation
              </Button>
              {user?.role === 'admin' && (
                <Button
                  variant={currentPage === 'users' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('users')}
                  className={`px-4 py-2 ${currentPage === 'users' ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200'}`}
                >
                  User Management
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-3 rounded-full bg-slate-50 px-3 py-1.5 ring-1 ring-slate-200">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold leading-none text-slate-700">{user.username}</span>
                  <span className="text-[10px] uppercase text-slate-500">{user.role}</span>
                </div>
              </div>
            )}
            <Button 
              variant="ghost" 
              onClick={logout}
              className="text-slate-500 hover:text-red-600"
              title="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};