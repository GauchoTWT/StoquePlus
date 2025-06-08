import { Button } from './components/ui/button';
import { toast } from './components/ui/use-toast';
import { Download, Upload } from 'lucide-react';

export const BackupRestore = ({ products, setProducts }) => {
  // 1. Exportar dados (Backup)
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
      });
    } catch (error) {
      toast({
        title: "Erro no backup",
        description: "Ocorreu um erro ao exportar os dados.",
        variant: "destructive",
      });
    }
  };

  // 2. Importar dados (Restore)
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        
        // Validação básica dos dados
        if (!Array.isArray(importedData) || !importedData.every(item => item.id && item.name)) {
          throw new Error("Formato inválido");
        }

        // Confirmação do usuário
        if (confirm(`Deseja importar ${importedData.length} itens?\nIsso substituirá seu estoque atual.`)) {
          setProducts(importedData);
          localStorage.setItem('inventory-products', JSON.stringify(importedData));
          
          toast({
            title: "Importação concluída!",
            description: `Foram importados ${importedData.length} itens.`,
          });
        }
      } catch (error) {
        toast({
          title: "Erro na importação",
          description: "O arquivo não é um backup válido.",
          variant: "destructive",
        });
      }
    };

    reader.onerror = () => {
      toast({
        title: "Erro na leitura",
        description: "Não foi possível ler o arquivo.",
        variant: "destructive",
      });
    };

    reader.readAsText(file);
    e.target.value = ''; // Reset para permitir reimportação do mesmo arquivo
  };

  return (
    <div className="flex gap-3 mb-6">
      {/* Botão Exportar */}
      <Button
        onClick={handleBackup}
        variant="outline"
        className="gap-2 text-emerald-500 hover:text-emerald-400 border-emerald-500 hover:bg-emerald-500/10"
      >
        <Download className="h-4 w-4" />
        Exportar Dados
      </Button>

      {/* Botão Importar (hidden input) */}
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