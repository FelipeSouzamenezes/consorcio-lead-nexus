
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { LeadStatus, useLeads } from '@/contexts/LeadsContext';
import { CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const statusOptions = [
  { value: 'new', label: 'Novo' },
  { value: 'contacted', label: 'Contato Feito' },
  { value: 'documentation', label: 'Documentação Enviada' },
  { value: 'completed', label: 'Venda Concluída' },
  { value: 'lost', label: 'Perdido' },
];

type StatusUpdateButtonProps = {
  leadId: string;
  currentStatus: LeadStatus;
};

export const StatusUpdateButton: React.FC<StatusUpdateButtonProps> = ({
  leadId,
  currentStatus,
}) => {
  const { updateLeadStatus } = useLeads();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (status: LeadStatus) => {
    if (status === currentStatus) return;
    
    setIsUpdating(true);
    try {
      updateLeadStatus(leadId, status);
      toast({
        title: 'Status atualizado',
        description: `Status alterado para "${statusOptions.find(opt => opt.value === status)?.label}"`,
      });
    } catch (error) {
      toast({
        title: 'Erro ao atualizar status',
        description: 'Não foi possível alterar o status',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isUpdating} className="w-[180px] justify-start">
          {isUpdating ? (
            'Atualizando...'
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Atualizar Status
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        {statusOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleStatusChange(option.value as LeadStatus)}
            className={currentStatus === option.value ? 'bg-muted font-medium' : ''}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
