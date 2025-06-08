import React, { useState } from "react";
import PropTypes from 'prop-types';
import { Button } from "./ui/button";
import { toast } from "../hooks/useToast";
import { PRODUCT_CATEGORIES, STORAGE_AREAS } from "../lib/constants";
import { motion } from "framer-motion";

export const ProductForm = ({ 
  formData, 
  setFormData, 
  onSubmit, 
  onCancel,
  isEditing = false
}) => {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }
    
    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória';
    }
    
    if (!formData.area) {
      newErrors.area = 'Área é obrigatória';
    }
    
    if (!formData.quantity || isNaN(formData.quantity) || parseInt(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantidade deve ser um número positivo';
    }
    
    if (!formData.minStock || isNaN(formData.minStock) || parseInt(formData.minStock) <= 0) {
      newErrors.minStock = 'Estoque mínimo deve ser um número positivo';
    } else if (parseInt(formData.minStock) > parseInt(formData.quantity)) {
      newErrors.minStock = 'Estoque mínimo não pode ser maior que a quantidade atual';
    }
    
    // Número do lote não é mais obrigatório
    
    if (!formData.unit.trim()) {
      newErrors.unit = 'Unidade é obrigatória';
    }
    
    if (formData.category === PRODUCT_CATEGORIES.RAW_MATERIALS) {
      if (formData.expirationDate) {
        const today = new Date();
        const expDate = new Date(formData.expirationDate);
        
        if (expDate < today) {
          newErrors.expirationDate = 'Data de validade não pode ser no passado';
        } else if (expDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)) {
          newErrors.expirationDate = 'Data de validade muito próxima (menos de 7 dias)';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateField = (name, value) => {
    const newErrors = {...errors};
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Nome é obrigatório';
        } else if (value.trim().length < 2) {
          newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
        } else {
          newErrors.name = '';
        }
        break;
        
      case 'quantity':
        if (!value || isNaN(value) || parseInt(value) <= 0) {
          newErrors.quantity = 'Digite um número positivo';
        } else {
          newErrors.quantity = '';
        }
        break;
        
      case 'minStock':
        if (!value || isNaN(value) || parseInt(value) <= 0) {
          newErrors.minStock = 'Digite um número positivo';
        } else if (formData.quantity && parseInt(value) > parseInt(formData.quantity)) {
          newErrors.minStock = 'Não pode ser maior que a quantidade atual';
        } else {
          newErrors.minStock = '';
        }
        break;
        
      case 'batch':
        // Lote não é mais obrigatório
        newErrors.batch = '';
        break;
        
      case 'expirationDate':
        if (value && formData.category === PRODUCT_CATEGORIES.RAW_MATERIALS) {
          const today = new Date();
          const expDate = new Date(value);
          
          if (expDate < today) {
            newErrors.expirationDate = 'Data não pode ser no passado';
          } else if (expDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)) {
            newErrors.expirationDate = 'Data muito próxima (menos de 7 dias)';
          } else {
            newErrors.expirationDate = '';
          }
        } else {
          newErrors.expirationDate = '';
        }
        break;
        
      default:
        if (!value.trim()) {
          newErrors[name] = 'Campo obrigatório';
        } else {
          newErrors[name] = '';
        }
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
    
    if (validateForm()) {
      onSubmit();
    } else {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os erros antes de continuar",
        type: "error"
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

          {/* Campo Lote (opcional) */}
          <div>
            <input
              name="batch"
              type="text"
              placeholder="Número do Lote (opcional)"
              value={formData.batch}
              onChange={handleChange}
              className={`px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full`}
            />
          </div>

          {/* Campo Pallet */}
          <div className="flex gap-2">
            <div className="flex-1">
              <select
                name="palletType"
                value={formData.palletType || ''}
                onChange={handleChange}
                className={`px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full`}
              >
                <option value="">Selecione o pallet (opcional)</option>
                <option value="tampa">Tampa</option>
                <option value="pote">Pote</option>
                <option value="caixas">Caixas</option>
                <option value="materia-prima">Matéria Prima</option>
                <option value="insumos">Insumos</option>
              </select>
            </div>
            <div>
              <input
                name="palletQuantity"
                type="number"
                min="0"
                placeholder="Qtd"
                value={formData.palletQuantity || ''}
                onChange={handleChange}
                className={`w-24 px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
              />
            </div>
          </div>

          {/* Campo Imagem */}
          <div>
            <label className="block text-slate-400 text-sm mb-2">Imagem do produto (opcional)</label>
            <input
              name="image"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleChange}
              className={`px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-500 file:text-white hover:file:bg-emerald-600`}
            />
          </div>

          {/* Campo Observações */}
          <div className="md:col-span-2">
            <textarea
              name="notes"
              placeholder="Observações (opcional)"
              value={formData.notes || ''}
              onChange={handleChange}
              rows={3}
              className={`px-4 py-3 bg-slate-800/50 border ${errors.notes ? 'border-red-500' : 'border-slate-600'} rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full resize-none`}
            />
          </div>
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

ProductForm.propTypes = {
  formData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    minStock: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    area: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired,
    batch: PropTypes.string,
    palletType: PropTypes.string,
    palletQuantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    image: PropTypes.object,
    notes: PropTypes.string
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isEditing: PropTypes.bool
};