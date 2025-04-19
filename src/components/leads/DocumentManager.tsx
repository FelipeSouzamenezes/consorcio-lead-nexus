
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lead, Document, useLeads } from '@/contexts/LeadsContext';
import { Upload, File, Trash2, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type DocumentManagerProps = {
  lead: Lead;
};

export const DocumentManager: React.FC<DocumentManagerProps> = ({ lead }) => {
  const { uploadDocument, deleteDocument } = useLeads();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      // Check file types - only allow PDFs
      const invalidFiles = acceptedFiles.filter(
        (file) => file.type !== 'application/pdf'
      );
      
      if (invalidFiles.length) {
        toast({
          title: 'Tipo de arquivo inválido',
          description: 'Somente arquivos PDF são permitidos',
          variant: 'destructive',
        });
        return;
      }

      try {
        setIsUploading(true);
        
        // Process each file sequentially
        for (const file of acceptedFiles) {
          await uploadDocument(lead.id, file);
        }
        
        toast({
          title: 'Documento enviado com sucesso',
          description: `${acceptedFiles.length} documento(s) adicionado(s)`,
        });
      } catch (error) {
        toast({
          title: 'Erro ao enviar documento',
          description: 'Não foi possível completar o upload',
          variant: 'destructive',
        });
      } finally {
        setIsUploading(false);
      }
    },
    [lead.id, uploadDocument, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    disabled: isUploading,
  });

  const handleDeleteDocument = (documentId: string) => {
    deleteDocument(lead.id, documentId);
    toast({
      title: 'Documento excluído',
      description: 'O documento foi removido com sucesso',
    });
  };

  // Format date helper
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-8 text-center transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-muted/40'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload
              className={`h-8 w-8 mb-2 ${
                isDragActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            />
            {isUploading ? (
              <p className="text-sm font-medium">Enviando...</p>
            ) : (
              <>
                <p className="text-sm font-medium">
                  {isDragActive
                    ? 'Solte os arquivos aqui...'
                    : 'Arraste e solte arquivos PDF aqui, ou clique para selecionar'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Apenas arquivos PDF são aceitos
                </p>
              </>
            )}
          </div>
        </div>

        {/* Documents list */}
        {lead.documents.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Data de Upload</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lead.documents.map((doc: Document) => (
                <TableRow key={doc.id}>
                  <TableCell className="flex items-center space-x-2">
                    <File className="h-4 w-4 text-muted-foreground" />
                    <span>{doc.name}</span>
                  </TableCell>
                  <TableCell>{formatDate(doc.uploadedAt)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" asChild>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" download>
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteDocument(doc.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhum documento encontrado para este lead
            </p>
          </div>
        )}
        
        <div className="flex justify-between items-center pt-2">
          <Badge variant="outline" className="text-muted-foreground">
            Total: {lead.documents.length} documento(s)
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
