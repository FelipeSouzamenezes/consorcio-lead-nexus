
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export type LeadStatus = 'new' | 'contacted' | 'documentation' | 'completed' | 'lost';

export type Document = {
  id: string;
  name: string;
  url: string;
  uploadedAt: Date;
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  creditValue: number;
  status: LeadStatus;
  sellerId: string;
  sellerName: string;
  createdAt: Date;
  documents: Document[];
};

type LeadsContextType = {
  leads: Lead[];
  isLoading: boolean;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'documents'>) => void;
  updateLeadStatus: (leadId: string, status: LeadStatus) => void;
  uploadDocument: (leadId: string, file: File) => Promise<void>;
  deleteDocument: (leadId: string, documentId: string) => void;
  getLeadsBySellerFilter: (sellerId?: string) => Lead[];
};

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

// Mock leads data
const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    name: 'João Silva',
    phone: '(11) 98765-4321',
    email: 'joao@email.com',
    creditValue: 50000,
    status: 'new',
    sellerId: '2',
    sellerName: 'Vendedor 1',
    createdAt: new Date('2023-01-15'),
    documents: [],
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    phone: '(11) 91234-5678',
    email: 'maria@email.com',
    creditValue: 75000,
    status: 'contacted',
    sellerId: '2',
    sellerName: 'Vendedor 1',
    createdAt: new Date('2023-02-10'),
    documents: [
      {
        id: 'd1',
        name: 'Identidade.pdf',
        url: '#',
        uploadedAt: new Date('2023-02-12'),
      },
    ],
  },
  {
    id: '3',
    name: 'Carlos Santos',
    phone: '(21) 99876-5432',
    email: 'carlos@email.com',
    creditValue: 120000,
    status: 'completed',
    sellerId: '2',
    sellerName: 'Vendedor 1',
    createdAt: new Date('2023-01-05'),
    documents: [
      {
        id: 'd2',
        name: 'Contrato.pdf',
        url: '#',
        uploadedAt: new Date('2023-01-07'),
      },
      {
        id: 'd3',
        name: 'Comprovante_Renda.pdf',
        url: '#',
        uploadedAt: new Date('2023-01-10'),
      },
    ],
  },
];

export const LeadsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real application, we would fetch leads from an API
    setIsLoading(false);
  }, []);

  const addLead = (newLeadData: Omit<Lead, 'id' | 'createdAt' | 'documents'>) => {
    const newLead: Lead = {
      ...newLeadData,
      id: (leads.length + 1).toString(),
      createdAt: new Date(),
      documents: [],
    };

    setLeads((prevLeads) => [...prevLeads, newLead]);
    
    // In a real app, here we would send an email notification
    console.log(`Email notification sent for new lead: ${newLead.name}`);
  };

  const updateLeadStatus = (leadId: string, status: LeadStatus) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === leadId ? { ...lead, status } : lead
      )
    );
  };

  const uploadDocument = async (leadId: string, file: File): Promise<void> => {
    // In a real app, we would upload the file to a storage service
    // For now, we'll create a mock URL
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate upload delay

    const newDocument: Document = {
      id: `d${Math.floor(Math.random() * 1000)}`,
      name: file.name,
      url: URL.createObjectURL(file), // In a real app, this would be the URL from the storage service
      uploadedAt: new Date(),
    };

    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === leadId
          ? { ...lead, documents: [...lead.documents, newDocument] }
          : lead
      )
    );
  };

  const deleteDocument = (leadId: string, documentId: string) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              documents: lead.documents.filter((doc) => doc.id !== documentId),
            }
          : lead
      )
    );
  };

  const getLeadsBySellerFilter = (sellerId?: string) => {
    // If the user is an admin and no sellerId is provided, return all leads
    if (user?.role === 'admin' && !sellerId) {
      return leads;
    }
    
    // If sellerId is provided, filter by that seller
    if (sellerId) {
      return leads.filter((lead) => lead.sellerId === sellerId);
    }
    
    // If the user is not an admin, return only their leads
    return leads.filter((lead) => lead.sellerId === user?.id);
  };

  return (
    <LeadsContext.Provider
      value={{
        leads,
        isLoading,
        addLead,
        updateLeadStatus,
        uploadDocument,
        deleteDocument,
        getLeadsBySellerFilter,
      }}
    >
      {children}
    </LeadsContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadsContext);
  if (context === undefined) {
    throw new Error('useLeads must be used within a LeadsProvider');
  }
  return context;
};
