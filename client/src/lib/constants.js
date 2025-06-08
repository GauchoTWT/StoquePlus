export const STORAGE_AREAS = {
  PRODUCTION: "production",
  WAREHOUSE: "warehouse"
};

export const PRODUCT_CATEGORIES = {
  RAW_MATERIALS: "Matéria Prima",
  PACKAGING: "Embalagens",
  SUPPLIES: "Insumos",
  PPE: "EPIs",
  CLEANING: "Materiais de Limpeza",
  FINISHED: "Produtos Acabados"
};

export const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: "Óleo de Argan",
    category: "Matéria Prima",
    quantity: 50,
    minStock: 20,
    price: 89.99,
    supplier: "Cosmetic Oils Brasil",
    area: "production",
    unit: "L",
    batch: "ARG2024001",
    expirationDate: "2025-12-31",
    lastUpdated: new Date().toISOString()
  },
  {
    id: 2,
    name: "Frasco 100ml",
    category: "Embalagens",
    quantity: 1000,
    minStock: 500,
    price: 2.50,
    supplier: "Embalagens Premium",
    area: "warehouse",
    unit: "un",
    batch: "FRS2024001",
    lastUpdated: new Date().toISOString()
  },
  {
    id: 3,
    name: "Máscara N95",
    category: "EPIs",
    quantity: 150,
    minStock: 50,
    price: 5.99,
    supplier: "Safety First",
    area: "warehouse",
    unit: "un",
    batch: "EPI2024001",
    lastUpdated: new Date().toISOString()
  },
  {
    id: 4,
    name: "Essência de Lavanda",
    category: "Matéria Prima",
    quantity: 25,
    minStock: 10,
    price: 120.00,
    supplier: "Aromas & Cia",
    area: "production",
    unit: "L",
    batch: "LAV2024001",
    expirationDate: "2025-06-30",
    lastUpdated: new Date().toISOString()
  }
];