
import React from 'react';
import { APP_NAME } from '../constants';
import { Settings, User, Bell, LayoutDashboard, TableProperties } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'form' | 'records';
  setActiveTab: (tab: 'form' | 'records') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Settings className="text-white" size={24} />
              </div>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight hidden sm:block uppercase">
                {APP_NAME}
              </h1>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight sm:hidden">
                PLANEJAMENTO
              </h1>
            </div>

            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => setActiveTab('form')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-16 ${
                  activeTab === 'form'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <LayoutDashboard className="mr-2" size={18} />
                Cadastro
              </button>
              <button
                onClick={() => setActiveTab('records')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-16 ${
                  activeTab === 'records'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <TableProperties className="mr-2" size={18} />
                Registros Diários
              </button>
            </nav>

            <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-gray-500 transition-colors">
                <Bell size={20} />
              </button>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
                JD
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};
