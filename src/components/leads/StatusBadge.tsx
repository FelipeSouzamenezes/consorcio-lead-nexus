
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { LeadStatus } from '@/contexts/LeadsContext';

const statusConfig = {
  new: {
    label: 'Novo',
    color: 'bg-status-new text-white',
  },
  contacted: {
    label: 'Contato Feito',
    color: 'bg-status-contacted text-white',
  },
  documentation: {
    label: 'Documentação Enviada',
    color: 'bg-status-documentation text-white',
  },
  completed: {
    label: 'Venda Concluída',
    color: 'bg-status-completed text-white',
  },
  lost: {
    label: 'Perdido',
    color: 'bg-status-lost text-white',
  },
};

type StatusBadgeProps = {
  status: LeadStatus;
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status];

  return (
    <Badge className={config.color} variant="outline">
      {config.label}
    </Badge>
  );
};
