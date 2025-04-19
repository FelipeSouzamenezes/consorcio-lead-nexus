
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLeads, Lead } from '@/contexts/LeadsContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/leads/StatusBadge';
import { FileText, UserPlus, DollarSign, CheckCircle, AlertCircle, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { getLeadsBySellerFilter } = useLeads();
  
  const leads = getLeadsBySellerFilter(user?.id);
  
  const completedLeads = leads.filter(lead => lead.status === 'completed');
  const activeLeads = leads.filter(lead => lead.status !== 'completed' && lead.status !== 'lost');
  const lostLeads = leads.filter(lead => lead.status === 'lost');
  
  const totalCommission = completedLeads.reduce((sum, lead) => sum + lead.creditValue * 0.01, 0);
  const pendingCommission = activeLeads.reduce((sum, lead) => sum + lead.creditValue * 0.01, 0);

  // Get the latest leads (up to 5)
  const latestLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <DashboardLayout title="Dashboard">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total de Leads"
          value={leads.length}
          icon={<FileText className="h-5 w-5 text-primary" />}
        />
        <StatCard
          title="Leads Ativos"
          value={activeLeads.length}
          icon={<UserPlus className="h-5 w-5 text-primary" />}
        />
        <StatCard
          title="Comissão Total"
          value={`R$ ${totalCommission.toLocaleString('pt-BR')}`}
          icon={<DollarSign className="h-5 w-5 text-primary" />}
        />
        <StatCard
          title="Comissão Pendente"
          value={`R$ ${pendingCommission.toLocaleString('pt-BR')}`}
          icon={<AlertCircle className="h-5 w-5 text-primary" />}
          description="Estimativa baseada em leads ativos"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Leads */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Leads Recentes</CardTitle>
              <Link to="/leads">
                <Button variant="ghost" size="sm">Ver Todos</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {latestLeads.length > 0 ? (
                <div className="space-y-4">
                  {latestLeads.map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-muted rounded-full p-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">{lead.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {lead.email} • R$ {lead.creditValue.toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={lead.status} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>Nenhum lead cadastrado ainda</p>
                  <Link to="/leads/new">
                    <Button variant="link">Adicionar Novo Lead</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Status Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Status dos Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-status-new"></div>
                    <p className="text-sm">Novos</p>
                  </div>
                  <p className="font-medium">
                    {leads.filter((lead) => lead.status === 'new').length}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-status-contacted"></div>
                    <p className="text-sm">Contato Feito</p>
                  </div>
                  <p className="font-medium">
                    {leads.filter((lead) => lead.status === 'contacted').length}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-status-documentation"></div>
                    <p className="text-sm">Documentação</p>
                  </div>
                  <p className="font-medium">
                    {leads.filter((lead) => lead.status === 'documentation').length}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-status-completed"></div>
                    <p className="text-sm">Venda Concluída</p>
                  </div>
                  <p className="font-medium">
                    {leads.filter((lead) => lead.status === 'completed').length}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-status-lost"></div>
                    <p className="text-sm">Perdido</p>
                  </div>
                  <p className="font-medium">
                    {leads.filter((lead) => lead.status === 'lost').length}
                  </p>
                </div>
                
                <div className="pt-4">
                  <Link to="/leads/new">
                    <Button className="w-full">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Adicionar Novo Lead
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
