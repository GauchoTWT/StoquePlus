
import React from "react";
import { Button } from "./components/ui/button";
import { PRODUCT_CATEGORIES, STORAGE_AREAS } from "@/lib/constants";
import { motion } from "framer-motion";

export const ProductForm = ({ 
  formData, 
  setFormData, 
  onSubmit, 
  onCancel,
  isEditing = false // Nova prop
}) => {
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    const newErrors = {...errors};
    
    switch (name) {
      case 'name':
        newErrors.name = !value.trim() ? 'Nome é obrigatório' : '';
        break;
      case 'quantity':
        newErrors.quantity = !value || isNaN(value) || value <= 0 
          ? 'Digite um número positivo' 
          : '';
        break;
      case 'minStock':
        newErrors.minStock = !value || isNaN(value) || value <= 0 
          ? 'Digite um número positivo' 
          : '';
        break;
      case 'expirationDate':
        if (value && new Date(value) < new Date()) {
          newErrors.expirationDate = 'Data não pode ser no passado';
        } else {
          newErrors.expirationDate = '';
        }
        break;
      default:
        newErrors[name] = !value ? 'Campo obrigatório' : '';
    }

    setErrors(newErrors);
    return !newErrors[name];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Valida todos os campos
    const isValid = Object.keys(formData).every(key => {
      if (key === 'expirationDate' && formData.category !== PRODUCT_CATEGORIES.RAW_MATERIALS) {
        return true;
      }
      return validateField(key, formData[key]);
    });

    if (isValid) {
      onSubmit();
    } else {
      toast({
        title: "Erro de validação",
        description: "Preencha todos os campos corretamente",
        variant: "destructive"
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass-effect rounded-xl p-6 mb-8"
    >
      <h3 className="text-2xl font-bold text-white mb-6">
        {isEditing ? 'Editar Item' : 'Adicionar Novo Item'}
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Campo Nome */}
          <div>
            <input
              name="name"
              type="text"
              placeholder="Nome do item *"
              value={formData.name}
              onChange={handleChange}
              onBlur={(e) => validateField('name', e.target.value)}
              className={`px-4 py-3 bg-slate-800/50 border ${errors.name ? 'border-red-500' : 'border-slate-600'} rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full`}
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
          </div>
          
          {/* Campo Categoria */}
          <div>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              onBlur={(e) => validateField('category', e.target.value)}
              className={`px-4 py-3 bg-slate-800/50 border ${errors.category ? 'border-red-500' : 'border-slate-600'} rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full`}
            >
              <option value="">Selecione a categoria *</option>
              {Object.values(PRODUCT_CATEGORIES).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
          </div>

          {/* Campo Área */}
          <div>
            <select
              name="area"
              value={formData.area}
              onChange={handleChange}
              onBlur={(e) => validateField('area', e.target.value)}
              className={`px-4 py-3 bg-slate-800/50 border ${errors.area ? 'border-red-500' : 'border-slate-600'} rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full`}
            >
              <option value="">Selecione a área *</option>
              <option value={STORAGE_AREAS.PRODUCTION}>Área de Produção</option>
              <option value={STORAGE_AREAS.WAREHOUSE}>Armazenamento</option>
            </select>
            {errors.area && <p className="text-red-400 text-sm mt-1">{errors.area}</p>}
          </div>

          {/* Campos Quantidade e Unidade */}
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                name="quantity"
                type="number"
                min="1"
                placeholder="Quantidade *"
                value={formData.quantity}
                onChange={handleChange}
                onBlur={(e) => validateField('quantity', e.target.value)}
                className={`px-4 py-3 bg-slate-800/50 border ${errors.quantity ? 'border-red-500' : 'border-slate-600'} rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full`}
              />
              {errors.quantity && <p className="text-red-400 text-sm mt-1">{errors.quantity}</p>}
            </div>
            <div>
              <input
                name="unit"
                type="text"
                placeholder="Unidade *"
                value={formData.unit}
                onChange={handleChange}
                onBlur={(e) => validateField('unit', e.target.value)}
                className={`w-24 px-4 py-3 bg-slate-800/50 border ${errors.unit ? 'border-red-500' : 'border-slate-600'} rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
              />
              {errors.unit && <p className="text-red-400 text-sm mt-1">{errors.unit}</p>}
            </div>
          </div>

          {/* Campo Estoque Mínimo */}
          <div>
            <input
              name="minStock"
              type="number"
              min="1"
              placeholder="Estoque mínimo *"
              value={formData.minStock}
              onChange={handleChange}
              onBlur={(e) => validateField('minStock', e.target.value)}
              className={`px-4 py-3 bg-slate-800/50 border ${errors.minStock ? 'border-red-500' : 'border-slate-600'} rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full`}
            />
            {errors.minStock && <p className="text-red-400 text-sm mt-1">{errors.minStock}</p>}
          </div>

          {/* Campo Fornecedor */}
          <div>
            <input
              name="supplier"
              type="text"
              placeholder="Fornecedor *"
              value={formData.supplier}
              onChange={handleChange}
              onBlur={(e) => validateField('supplier', e.target.value)}
              className={`px-4 py-3 bg-slate-800/50 border ${errors.supplier ? 'border-red-500' : 'border-slate-600'} rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full`}
            />
            {errors.supplier && <p className="text-red-400 text-sm mt-1">{errors.supplier}</p>}
          </div>

          {/* Campo Lote */}
          <div>
            <input
              name="batch"
              type="text"
              placeholder="Número do Lote *"
              value={formData.batch}
              onChange={handleChange}
              onBlur={(e) => validateField('batch', e.target.value)}
              className={`px-4 py-3 bg-slate-800/50 border ${errors.batch ? 'border-red-500' : 'border-slate-600'} rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full`}
            />
            {errors.batch && <p className="text-red-400 text-sm mt-1">{errors.batch}</p>}
          </div>

          {/* Campo Data de Validade (condicional) */}
          {formData.category === PRODUCT_CATEGORIES.RAW_MATERIALS && (
            <div>
              <label className="block text-slate-400 text-sm mb-1">Data de Validade</label>
              <input
                name="expirationDate"
                type="date"
                value={formData.expirationDate}
                onChange={handleChange}
                onBlur={(e) => validateField('expirationDate', e.target.value)}
                className={`px-4 py-3 bg-slate-800/50 border ${errors.expirationDate ? 'border-red-500' : 'border-slate-600'} rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full`}
              />
              {errors.expirationDate && <p className="text-red-400 text-sm mt-1">{errors.expirationDate}</p>}
            </div>
          )}
        </div>
        
        <div className="flex gap-4 mt-6">
          <Button 
            type="submit"
            className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
          >
            {isEditing ? 'Salvar Alterações' : 'Adicionar Item'}
          </Button>
          <Button 
            type="button"
            onClick={onCancel}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </motion.div>
  );
};