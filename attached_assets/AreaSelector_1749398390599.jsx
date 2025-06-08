
import React from "react";
import { Button } from "./components/ui/button";
import { Factory, Warehouse } from "lucide-react";
import { STORAGE_AREAS } from "./lib/constants";
import { motion } from "framer-motion";

export const AreaSelector = ({ selectedArea, onAreaChange }) => {
  return (
    <div className="flex gap-4 mb-8">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          onClick={() => onAreaChange(STORAGE_AREAS.PRODUCTION)}
          className={`flex items-center gap-2 px-6 py-3 ${
            selectedArea === STORAGE_AREAS.PRODUCTION
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-slate-700 hover:bg-slate-600"
          }`}
        >
          <Factory className="h-5 w-5" />
          Área de Produção
        </Button>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          onClick={() => onAreaChange(STORAGE_AREAS.WAREHOUSE)}
          className={`flex items-center gap-2 px-6 py-3 ${
            selectedArea === STORAGE_AREAS.WAREHOUSE
              ? "bg-purple-500 hover:bg-purple-600"
              : "bg-slate-700 hover:bg-slate-600"
          }`}
        >
          <Warehouse className="h-5 w-5" />
          Armazenamento
        </Button>
      </motion.div>
    </div>
  );
};
