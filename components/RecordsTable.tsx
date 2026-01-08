
import React, { useState, useMemo, useRef } from 'react';
import { ProductionPlan } from '../types';
import { PRODUCTION_LINES } from '../constants';
import { exportToPDF, getStatusColor } from '../utils';
import { format, isSameDay } from 'date-fns';
import { Search, Filter, FileDown, Edit2, Trash2, ChevronLeft, ChevronRight, AlertTriangle, Download, Upload } from 'lucide-react';

/**
 * Fix: Removed parseISO import as it was reported missing from date-fns.
 * Using native new Date() for parsing ISO strings instead.
 */

interface RecordsTableProps {
  plans: ProductionPlan[];
  onEdit: (plan: ProductionPlan) => void;
  onDelete: (id: string) => void;
  onImport: (plans: ProductionPlan[]) => void;
}

export const RecordsTable: React.FC<RecordsTableProps> = ({ plans, onEdit, onDelete, onImport }) => {
  const [filters, setFilters] = useState({
    date: '',
    customer: '',
    productionLine: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredPlans = useMemo(() => {
    return plans.filter(plan => {
      const matchCustomer = plan.customer.toLowerCase().includes(filters.customer.toLowerCase());
      const matchLine = !filters.productionLine || plan.productionLine === filters.productionLine;
      // Using new Date() instead of parseISO
      const matchDate = !filters.date || isSameDay(new Date(plan.createdAt), new Date(filters.date));
      return matchCustomer && matchLine && matchDate;
    });
  }, [plans, filters]);

  const handleExportPDF = () => {
    if (filteredPlans.length === 0) {
      alert('Nenhum dado para exportar com os filtros atuais.');
      return;
    }
    exportToPDF(filteredPlans);
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(plans, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `backup_producao_${format(new Date(), 'yyyy-MM-dd')}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (Array.isArray(json)) {
          onImport(json);
        } else {
          alert("Arquivo inválido. Formato de backup não reconhecido.");
        }
      } catch (err) {
        alert("Erro ao ler o arquivo de backup.");
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Limpa o input
  };

  const clearFilters = () => {
    setFilters({ date: '', customer: '', productionLine: '' });
  };

  return (
    <div className="space-y-6">
      {/* Mini Actions Bar */}
      <div className="flex flex-wrap gap-3 justify-end">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".json" 
          className="hidden" 
        />
        <button
          onClick={handleImportClick}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
        >
          <Upload size={16} />
          Importar Backup
        </button>
        <button
          onClick={handleExportJSON}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
        >
          <Download size={16} />
          Exportar Backup
        </button>
      </div>

      {/* Filters Area */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4 text-black font-bold uppercase tracking-tight">
          <Filter size={18} className="text-green-600" />
          Filtros de Busca
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Data de Cadastro</label>
            <input
              type="date"
              className="w-full rounded-md border-gray-300 bg-white text-black shadow-sm focus:border-green-500 focus:ring-green-500 text-sm h-10 border px-3"
              value={filters.date}
              onChange={e => setFilters(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Cliente</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Pesquisar cliente..."
                className="w-full pl-10 rounded-md border-gray-300 bg-white text-black shadow-sm focus:border-green-500 focus:ring-green-500 text-sm h-10 border px-3"
                value={filters.customer}
                onChange={e => setFilters(prev => ({ ...prev, customer: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Linha de Produção</label>
            <select
              className="w-full rounded-md border-gray-300 bg-white text-black shadow-sm focus:border-green-500 focus:ring-green-500 text-sm h-10 border px-3 font-medium"
              value={filters.productionLine}
              onChange={e => setFilters(prev => ({ ...prev, productionLine: e.target.value }))}
            >
              <option value="">Todas as linhas</option>
              {PRODUCTION_LINES.map(line => (
                <option key={line} value={line}>{line}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={handleExportPDF}
              className="flex-1 bg-green-600 text-white h-10 px-4 rounded-md font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm shadow-md"
            >
              <FileDown size={18} />
              GERAR PDF
            </button>
            <button
              onClick={clearFilters}
              className="px-4 h-10 rounded-md border border-gray-300 bg-white text-black font-semibold hover:bg-gray-50 transition-colors text-sm shadow-sm"
            >
              Limpar
            </button>
          </div>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white border-b-2 border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">Cliente / Produto</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">Prazos</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">Produção</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-black uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredPlans.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic font-medium">
                    Nenhum registro encontrado com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-green-50/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-black">{plan.customer}</div>
                      <div className="text-xs text-gray-600 font-medium">{plan.productType} • {plan.city}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs text-gray-600 font-medium">
                        Entrega: <span className="font-bold text-black">{plan.expectedDeliveryDate ? format(new Date(plan.expectedDeliveryDate), 'dd/MM/yyyy') : '---'}</span>
                      </div>
                      <div className="text-xs text-gray-600 font-medium">
                        Entrada Prod: <span className="font-bold text-black">{plan.productionEntryDeadline ? format(new Date(plan.productionEntryDeadline), 'dd/MM/yyyy') : '---'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs font-bold px-2 py-1 bg-green-100 text-green-900 rounded-md border border-green-200 inline-block">
                        {plan.productionLine}
                      </div>
                      <div className="text-xs text-gray-600 mt-1 font-medium">
                        Fabr: {plan.manufacturingTimeDays}d
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-xs font-bold px-3 py-1 border rounded-full inline-flex items-center gap-1 shadow-sm ${getStatusColor(plan.daysUntilProduction).replace('text-green-600', 'text-green-700').replace('text-red-600', 'text-red-700').replace('text-orange-600', 'text-orange-700')}`}>
                        {plan.daysUntilProduction < 0 && <AlertTriangle size={12} />}
                        {plan.daysUntilProduction === 0 ? 'ENTRA HOJE' : 
                          plan.daysUntilProduction < 0 ? `ATRASADO ${Math.abs(plan.daysUntilProduction)}D` : 
                          `FALTAM ${plan.daysUntilProduction}D`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onEdit(plan)}
                          className="text-green-700 hover:text-green-900 p-1.5 rounded-full hover:bg-green-100 transition-all"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => onDelete(plan.id)}
                          className="text-red-700 hover:text-red-900 p-1.5 rounded-full hover:bg-red-100 transition-all"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Mobile View Summary */}
        <div className="bg-white px-6 py-3 border-t border-gray-100 flex justify-between items-center">
          <span className="text-xs font-bold text-gray-600 uppercase tracking-tight">
            Total de {filteredPlans.length} registros
          </span>
          <div className="flex gap-1">
             <button className="p-1.5 text-gray-400 hover:text-black transition-colors disabled:opacity-30" disabled>
               <ChevronLeft size={20} />
             </button>
             <button className="p-1.5 text-gray-400 hover:text-black transition-colors disabled:opacity-30" disabled>
               <ChevronRight size={20} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
