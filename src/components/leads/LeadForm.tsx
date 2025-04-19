
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLeads } from '@/contexts/LeadsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export const LeadForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { user } = useAuth();
  const { addLead } = useLeads();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    creditValue: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle credit value with proper formatting
    if (name === 'creditValue') {
      // Remove all non-digit characters
      const sanitizedValue = value.replace(/\D/g, '');
      
      // Convert to number and update the form state
      setFormData({
        ...formData,
        [name]: sanitizedValue,
      });
      return;
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const creditValueNumber = parseInt(formData.creditValue, 10);
      
      if (isNaN(creditValueNumber)) {
        throw new Error('Valor da carta de crédito inválido');
      }

      addLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        creditValue: creditValueNumber,
        status: 'new',
        sellerId: user.id,
        sellerName: user.name,
      });

      toast({
        title: 'Lead adicionado com sucesso',
        description: 'Um email foi enviado para o time comercial.',
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        creditValue: '',
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: 'Erro ao adicionar lead',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format credit value for display
  const formatCreditValue = (value: string) => {
    if (!value) return '';
    return `R$ ${parseInt(value).toLocaleString('pt-BR')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar Novo Lead</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nome do cliente"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="cliente@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="creditValue">Valor da Carta de Crédito</Label>
            <Input
              id="creditValue"
              name="creditValue"
              value={formData.creditValue}
              onChange={handleChange}
              className="text-right"
              placeholder="R$ 0,00"
              required
            />
            {formData.creditValue && (
              <p className="text-sm text-muted-foreground">
                Valor formatado: {formatCreditValue(formData.creditValue)}
              </p>
            )}
            {formData.creditValue && (
              <p className="text-sm text-primary">
                Comissão estimada: R$ {(parseInt(formData.creditValue, 10) * 0.01).toLocaleString('pt-BR')} (1%)
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Adicionando...' : 'Adicionar Lead'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
