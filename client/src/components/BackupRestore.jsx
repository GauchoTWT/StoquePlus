import React from 'react';
import PropTypes from 'prop-types';
import { Button } from './ui/button';
import { toast } from '../hooks/useToast';
import { Download, Upload } from 'lucide-react';

export const BackupRestore = ({ products, setProducts }) => {
  const handleBackup = () => {
    try {
      const dataStr = JSON.stringify(products, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup-estoque_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Backup realizado!",
        description: "Seus dados foram exportados com sucesso.",
        type: "success"
      });
    } catch (error) {
      toast({
        title: "Erro no backup",
        description: "Ocorreu um erro ao exportar os dados.",
        type: "error"
      });
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        
        if (!Array.isArray(importedData) || !importedData.every(item => item.id && item.name)) {
          throw new Error("Formato inválido");
        }

        if (confirm(`Deseja importar ${importedData.length} itens?\nIsso substituirá seu estoque atual.`)) {
          setProducts(importedData);
          localStorage.setItem('inventory-products', JSON.stringify(importedData));
          
          toast({
            title: "Importação concluída!",
            description: `Foram importados ${importedData.length} itens.`,
            type: "success"
          });
        }
      } catch (error) {
        toast({
          title: "Erro na importação",
          description: "O arquivo não é um backup válido.",
          type: "error"
        });
      }
    };

    reader.onerror = () => {
      toast({
        title: "Erro na leitura",
        description: "Não foi possível ler o arquivo.",
        type: "error"
      });
    };

    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="flex gap-3 mb-6">
      <Button
        onClick={handleBackup}
        variant="outline"
        className="gap-2 text-emerald-500 hover:text-emerald-400 border-emerald-500 hover:bg-emerald-500/10"
      >
        <Download className="h-4 w-4" />
        Exportar Dados
      </Button>

      <Button
        asChild
        variant="outline"
        className="gap-2 text-blue-500 hover:text-blue-400 border-blue-500 hover:bg-blue-500/10"
      >
        <label>
          <Upload className="h-4 w-4" />
          Importar Dados
          <input 
            type="file" 
            accept=".json" 
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </Button>
    </div>
  );
};

BackupRestore.propTypes = {
  products: PropTypes.array.isRequired,
  setProducts: PropTypes.func.isRequired,
};