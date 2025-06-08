import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './components/ui/button';
import { toast } from './hooks/useToast';
import { AreaSelector } from './components/AreaSelector';
import { BackupRestore } from './components/BackupRestore';
import { ProductForm } from './components/ProductForm';
import { StockChart } from './components/StockChart';

import { 
  Package, 
  Plus, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  BarChart3,
  Calendar,
  Eye,
  Trash2
} from 'lucide-react';
import { STORAGE_AREAS, PRODUCT_CATEGORIES, SAMPLE_PRODUCTS } from './lib/constants';

const InventoryApp = () => {
  const [products, setProducts] = useState([]);
  const [selectedArea, setSelectedArea] = useState(STORAGE_AREAS.PRODUCTION);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    minStock: '',
    area: '',
    unit: '',
    batch: '',
    palletType: '',
    palletQuantity: '',
    image: null,
    notes: ''
  });

  useEffect(() => {
    const savedProducts = localStorage.getItem('inventory-products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(SAMPLE_PRODUCTS);
      localStorage.setItem('inventory-products', JSON.stringify(SAMPLE_PRODUCTS));
    }
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('inventory-products', JSON.stringify(products));
    }
  }, [products]);

  const handleUpdateStock = (id, newQuantity) => {
    setProducts(products.map(product => 
      product.id === id 
        ? { ...product, quantity: newQuantity, lastUpdated: new Date().toISOString() }
        : product
    ));
    
    toast({
      title: "Estoque atualizado!",
      description: "Quantidade alterada com sucesso!",
      type: "success"
    });
  };

  function handleDeleteProduct(id) {
    setProducts(products.filter(product => product.id !== id));
    toast({
      title: "Item removido",
      description: "Item excluído do estoque!",
      type: "success"
    });
  }

  const handleMoveProduct = (id, targetArea) => {
    setProducts(products.map(product => 
      product.id === id 
        ? { ...product, area: targetArea, lastUpdated: new Date().toISOString() }
        : product
    ));
    
    const areaName = targetArea === STORAGE_AREAS.PRODUCTION ? 'Produção' : 'Armazenamento';
    toast({
      title: "Item movimentado!",
      description: `Item movido para ${areaName}`,
      type: "success"
    });
  };

  const handleAddProduct = () => {
    const now = new Date();
    const newProduct = {
      ...formData,
      id: Date.now(),
      quantity: parseInt(formData.quantity),
      minStock: parseInt(formData.minStock),
      palletQuantity: formData.palletQuantity ? parseInt(formData.palletQuantity) : 0,
      addedAt: now.toISOString(),
      addedDate: now.toLocaleDateString('pt-BR'),
      addedTime: now.toLocaleTimeString('pt-BR'),
      lastUpdated: now.toISOString(),
    };
    setProducts([...products, newProduct]);
    setShowAddForm(false);
    setFormData({
      name: '',
      category: '',
      quantity: '',
      minStock: '',
      area: '',
      unit: '',
      batch: '',
      palletType: '',
      palletQuantity: '',
      image: null,
      notes: ''
    });
    toast({
      title: "Item adicionado!",
      description: `Adicionado em ${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR')}`,
      type: "success"
    });
  };

  const filteredProducts = products.filter(product =>
    product.area === selectedArea &&
    (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.supplier.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const areaProducts = products.filter(product => product.area === selectedArea);
  const lowStockProducts = areaProducts.filter(product => product.quantity <= product.minStock);
  const totalItems = areaProducts.reduce((sum, product) => sum + product.quantity, 0);
  const expiringProducts = areaProducts.filter(product => 
    product.expirationDate && 
    new Date(product.expirationDate) <= new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold gradient-text mb-4 floating">
            Controle de Estoque
          </h1>
          <p className="text-slate-300 text-lg">
            Gestão de Matérias-Primas e Insumos
          </p>
        </motion.div>

        <AreaSelector 
          selectedArea={selectedArea}
          onAreaChange={setSelectedArea}
        />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="glass-effect rounded-xl p-6 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total de Itens</p>
                <p className="text-3xl font-bold text-white">{areaProducts.length}</p>
              </div>
              <Package className="h-12 w-12 text-emerald-500" />
            </div>
          </div>

          <div className="glass-effect rounded-xl p-6 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Unidades Totais</p>
                <p className="text-3xl font-bold text-white">{totalItems}</p>
              </div>
              <BarChart3 className="h-12 w-12 text-blue-500" />
            </div>
          </div>

          <div className="glass-effect rounded-xl p-6 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">
                  {selectedArea === STORAGE_AREAS.PRODUCTION ? 'Itens a Vencer' : 'Estoque Baixo'}
                </p>
                <p className="text-3xl font-bold text-red-400">
                  {selectedArea === STORAGE_AREAS.PRODUCTION 
                    ? expiringProducts.length 
                    : lowStockProducts.length}
                </p>
              </div>
              {selectedArea === STORAGE_AREAS.PRODUCTION 
                ? <Calendar className="h-12 w-12 text-red-500 pulse-animation" />
                : <AlertTriangle className="h-12 w-12 text-red-500 pulse-animation" />
              }
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar por nome, categoria ou fornecedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          
          <BackupRestore products={products} setProducts={setProducts} />
          
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            Adicionar Item
          </Button>
        </motion.div>

        {showAddForm && (
          <ProductForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleAddProduct}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-effect rounded-xl overflow-hidden"
        >
          <div className="p-6 border-b border-slate-600">
            <h3 className="text-2xl font-bold text-white">
              {selectedArea === STORAGE_AREAS.PRODUCTION ? 'Área de Produção' : 'Área de Armazenamento'}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-slate-300 font-semibold">Item</th>
                  <th className="px-6 py-4 text-left text-slate-300 font-semibold">Categoria</th>
                  <th className="px-6 py-4 text-left text-slate-300 font-semibold">Quantidade</th>
                  <th className="px-6 py-4 text-left text-slate-300 font-semibold">Preço</th>
                  <th className="px-6 py-4 text-left text-slate-300 font-semibold">Adicionado em</th>
                  <th className="px-6 py-4 text-left text-slate-300 font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-slate-300 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <motion.tr 
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-slate-700 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{product.name}</p>
                        <p className="text-slate-400 text-sm">{product.supplier}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{product.category}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={product.quantity}
                          onChange={(e) => handleUpdateStock(product.id, parseInt(e.target.value))}
                          className="w-20 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-center focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <span className="text-slate-400 text-sm">{product.unit}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {product.price ? `R$ ${product.price.toFixed(2)}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-300">
                        <div className="text-sm">{product.addedDate || 'N/A'}</div>
                        <div className="text-xs text-slate-400">{product.addedTime || ''}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {product.quantity <= product.minStock ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                          <TrendingDown className="h-3 w-3 mr-1" />
                          Estoque Baixo
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Normal
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedProduct(product)}
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        
        <StockChart products={filteredProducts} />
        
        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setSelectedProduct(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="glass-effect rounded-xl p-6 m-4 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-white mb-4">Detalhes do Item</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-slate-400 text-sm">Nome:</span>
                    <p className="text-white font-medium">{selectedProduct.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-sm">Categoria:</span>
                    <p className="text-white">{selectedProduct.category}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-sm">Fornecedor:</span>
                    <p className="text-white">{selectedProduct.supplier}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-sm">Lote:</span>
                    <p className="text-white">{selectedProduct.batch}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-sm">Quantidade:</span>
                    <p className="text-white">{selectedProduct.quantity} {selectedProduct.unit}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-sm">Estoque Mínimo:</span>
                    <p className="text-white">{selectedProduct.minStock} {selectedProduct.unit}</p>
                  </div>
                  {selectedProduct.price && (
                    <div>
                      <span className="text-slate-400 text-sm">Preço Unitário:</span>
                      <p className="text-white">R$ {selectedProduct.price.toFixed(2)}</p>
                    </div>
                  )}
                  {selectedProduct.addedDate && (
                    <div>
                      <span className="text-slate-400 text-sm">Adicionado em:</span>
                      <p className="text-white">{selectedProduct.addedDate} às {selectedProduct.addedTime}</p>
                    </div>
                  )}
                  {selectedProduct.notes && (
                    <div>
                      <span className="text-slate-400 text-sm">Observações:</span>
                      <p className="text-white">{selectedProduct.notes}</p>
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => setSelectedProduct(null)}
                  className="w-full mt-6 bg-slate-700 hover:bg-slate-600"
                >
                  Fechar
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InventoryApp;