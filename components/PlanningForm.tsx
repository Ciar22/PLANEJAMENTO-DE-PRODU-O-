
import React, { useState, useEffect } from 'react';
import { ProductionPlan, ProductionLine } from '../types';
import { PRODUCTION_LINES } from '../constants';
import { Calendar, Save, RotateCcw, XCircle, Info, Hash } from 'lucide-react';

interface PlanningFormProps {
  onSave: (plan: ProductionPlan) => void;
  initialData?: ProductionPlan | null;
  onCancel?: () => void;
}

export const PlanningForm: React.FC<PlanningFormProps> = ({ onSave, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    customer: '',
    productType: '',
    city: '',
    orderReceiptDate: '',
    negotiatedDeadlineDays: 0,
    manufacturingTimeDays: 0,
    productionLine: 'MTL-01' as ProductionLine,
    // Novos campos para entrada manual
    expectedDeliveryDate: '',
    productionEntryDeadline: '',
    daysUntilProduction: 0,
    completionForecast: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        customer: initialData.customer,
        productType: initialData.productType,
        city: initialData.city,
        orderReceiptDate: initialData.orderReceiptDate,
        negotiatedDeadlineDays: initialData.negotiatedDeadlineDays,
        manufacturingTimeDays: initialData.manufacturingTimeDays,
        productionLine: initialData.productionLine,
        expectedDeliveryDate: initialData.expectedDeliveryDate,
        productionEntryDeadline: initialData.productionEntryDeadline,
        daysUntilProduction: initialData.daysUntilProduction,
        completionForecast: initialData.completionForecast,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer || !formData.orderReceiptDate) return;

    const plan: ProductionPlan = {
      id: initialData?.id || crypto.randomUUID(),
      ...formData,
      createdAt: initialData?.createdAt || new Date().toISOString(),
    };

    onSave(plan);
  };

  const handleClear = () => {
    setFormData({
      customer: '',
      productType: '',
      city: '',
      orderReceiptDate: '',
      negotiatedDeadlineDays: 0,
      manufacturingTimeDays: 0,
      productionLine: 'MTL-01',
      expectedDeliveryDate: '',
      productionEntryDeadline: '',
      daysUntilProduction: 0,
      completionForecast: '',
    });
  };

  const inputClasses = "mt-1 block w-full rounded-md border-gray-300 bg-white text-black shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm h-10 px-3 border transition-colors font-medium";
  const labelClasses = "block text-sm font-semibold text-gray-800 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Text Fields */}
        <div className="col-span-2 md:col-span-1">
          <label className={labelClasses}>Cliente</label>
          <input
            type="text"
            required
            className={inputClasses}
            value={formData.customer}
            onChange={e => setFormData(prev => ({ ...prev, customer: e.target.value }))}
            placeholder="Nome do cliente"
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <label className={labelClasses}>Tipo de Produto</label>
          <input
            type="text"
            required
            className={inputClasses}
            value={formData.productType}
            onChange={e => setFormData(prev => ({ ...prev, productType: e.target.value }))}
            placeholder="Ex: Bobinas, Chapas..."
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <label className={labelClasses}>Cidade</label>
          <input
            type="text"
            required
            className={inputClasses}
            value={formData.city}
            onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
            placeholder="Cidade de destino"
          />
        </div>

        {/* Date and Numbers */}
        <div className="col-span-2 md:col-span-1">
          <label className={labelClasses}>Data de Recebimento do Pedido</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 text-gray-500" size={16} />
            <input
              type="date"
              required
              className={`${inputClasses} pl-10`}
              value={formData.orderReceiptDate}
              onChange={e => setFormData(prev => ({ ...prev, orderReceiptDate: e.target.value }))}
            />
          </div>
        </div>

        <div className="col-span-2 md:col-span-1">
          <label className={labelClasses}>Prazo Negociado (dias)</label>
          <input
            type="number"
            min="0"
            required
            className={inputClasses}
            value={formData.negotiatedDeadlineDays}
            onChange={e => setFormData(prev => ({ ...prev, negotiatedDeadlineDays: parseInt(e.target.value) || 0 }))}
          />
        </div>

        <div className="col-span-2 md:col-span-1">
          <label className={labelClasses}>Tempo de Fabricação (dias)</label>
          <input
            type="number"
            min="0"
            required
            className={inputClasses}
            value={formData.manufacturingTimeDays}
            onChange={e => setFormData(prev => ({ ...prev, manufacturingTimeDays: parseInt(e.target.value) || 0 }))}
          />
        </div>

        <div className="col-span-2">
          <label className={labelClasses}>Linha de Produção</label>
          <select
            className={inputClasses}
            value={formData.productionLine}
            onChange={e => setFormData(prev => ({ ...prev, productionLine: e.target.value as ProductionLine }))}
          >
            {PRODUCTION_LINES.map(line => (
              <option key={line} value={line}>{line}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Manual Data Section (Previously Automatic) */}
      <div className="pt-6 border-t border-gray-100">
        <h3 className="text-sm font-bold text-green-700 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Info size={16} />
          Dados de Prazos e Previsão
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Data Prevista de Entrega</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 text-gray-500" size={16} />
              <input
                type="date"
                required
                className={`${inputClasses} pl-10`}
                value={formData.expectedDeliveryDate}
                onChange={e => setFormData(prev => ({ ...prev, expectedDeliveryDate: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Limite Entrada Produção</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 text-gray-500" size={16} />
              <input
                type="date"
                required
                className={`${inputClasses} pl-10`}
                value={formData.productionEntryDeadline}
                onChange={e => setFormData(prev => ({ ...prev, productionEntryDeadline: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Dias p/ Entrar em Produção</label>
            <div className="relative">
              <Hash className="absolute left-3 top-2.5 text-gray-500" size={16} />
              <input
                type="number"
                required
                className={`${inputClasses} pl-10 ${formData.daysUntilProduction < 0 ? 'text-red-700 font-bold' : 'text-black font-bold'}`}
                value={formData.daysUntilProduction}
                onChange={e => setFormData(prev => ({ ...prev, daysUntilProduction: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Previsão de Finalização</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 text-gray-500" size={16} />
              <input
                type="date"
                required
                className={`${inputClasses} pl-10`}
                value={formData.completionForecast}
                onChange={e => setFormData(prev => ({ ...prev, completionForecast: e.target.value }))}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button
          type="submit"
          className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <Save size={20} />
          {initialData ? 'Atualizar Registro' : 'Salvar Planejamento'}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 border border-gray-300"
          >
            <XCircle size={20} />
            Cancelar Edição
          </button>
        ) : (
          <button
            type="button"
            onClick={handleClear}
            className="flex-1 bg-white text-black px-6 py-3 rounded-lg font-bold border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <RotateCcw size={20} />
            Limpar Campos
          </button>
        )}
      </div>
    </form>
  );
};
