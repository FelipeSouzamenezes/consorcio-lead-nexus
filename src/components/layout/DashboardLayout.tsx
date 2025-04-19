
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, LogOut, UserPlus, Users, FileText, DollarSign } from 'lucide-react';

type DashboardLayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Top navbar */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-800">Lead Nexus</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-gray-500">Olá, </span>
                <span className="font-medium text-gray-900">{user?.name}</span>
                <span className="ml-2 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                  {isAdmin ? 'Admin' : 'Vendedor'}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r shadow-sm h-[calc(100vh-4rem)] sticky top-16">
          <div className="py-4">
            <nav className="px-2">
              <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Principal
              </p>
              <div className="space-y-1">
                {isAdmin ? (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="group flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-primary-foreground hover:text-primary transition-colors"
                    >
                      <Users className="mr-3 h-5 w-5" />
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/sellers"
                      className="group flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-primary-foreground hover:text-primary transition-colors"
                    >
                      <UserPlus className="mr-3 h-5 w-5" />
                      Vendedores
                    </Link>
                    <Link
                      to="/admin/leads"
                      className="group flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-primary-foreground hover:text-primary transition-colors"
                    >
                      <FileText className="mr-3 h-5 w-5" />
                      Todos os Leads
                    </Link>
                    <Link
                      to="/admin/commissions"
                      className="group flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-primary-foreground hover:text-primary transition-colors"
                    >
                      <DollarSign className="mr-3 h-5 w-5" />
                      Comissões
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/dashboard"
                      className="group flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-primary-foreground hover:text-primary transition-colors"
                    >
                      <User className="mr-3 h-5 w-5" />
                      Meu Dashboard
                    </Link>
                    <Link
                      to="/leads"
                      className="group flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-primary-foreground hover:text-primary transition-colors"
                    >
                      <FileText className="mr-3 h-5 w-5" />
                      Meus Leads
                    </Link>
                    <Link
                      to="/commissions"
                      className="group flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-primary-foreground hover:text-primary transition-colors"
                    >
                      <DollarSign className="mr-3 h-5 w-5" />
                      Minhas Comissões
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{title}</h1>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
