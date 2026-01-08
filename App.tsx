
import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { PlanningForm } from './components/PlanningForm';
import { RecordsTable } from './components/RecordsTable';
import { ProductionPlan } from './types';
import { STORAGE_KEY } from './constants';
import { LayoutDashboard, TableProperties, Factory, Download, Upload } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'form' | 'records'>('form');
  const [plans, setPlans] = useState<ProductionPlan[]>([]);
  const [editingPlan, setEditingPlan] = useState<ProductionPlan | null>(null);

  // Load data on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        setPlans(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse stored data", e);
      }
    }
  }, []);

  // Save data on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  }, [plans]);

  const handleSavePlan = (plan: ProductionPlan) => {
    if (editingPlan) {
      setPlans(prev => prev.map(p => p.id === plan.id ? plan : p));
      setEditingPlan(null);
    } else {
      setPlans(prev => [plan, ...prev]);
    }
    setActiveTab('records');
  };

  const handleEdit = (plan: ProductionPlan) => {
    setEditingPlan(plan);
    setActiveTab('form');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      setPlans(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleCancelEdit = () => {
    setEditingPlan(null);
  };

  const handleImportData = (importedPlans: ProductionPlan[]) => {
    if (window.confirm(`Deseja importar ${importedPlans.length} registros? Isso não apagará seus dados atuais, apenas adicionará os novos.`)) {
      setPlans(prev => [...importedPlans, ...prev]);
      setActiveTab('records');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Layout activeTab={activeTab} setActiveTab={(tab) => {
        setActiveTab(tab);
        if (tab === 'form') setEditingPlan(null);
      }}>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'form' ? (
            <div className="max-w-3xl mx-auto">
              <div className="mb-8 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center md:justify-start gap-2">
                  <Factory className="text-green-600" />
                  {editingPlan ? 'Editar Planejamento' : 'Novo Planejamento'}
                </h2>
                <p className="text-gray-500 mt-1">Preencha os dados do pedido. O salvamento é automático no seu navegador.</p>
              </div>
              <PlanningForm 
                onSave={handleSavePlan} 
                initialData={editingPlan} 
                onCancel={editingPlan ? handleCancelEdit : undefined}
              />
            </div>
          ) : (
            <div>
              <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <TableProperties className="text-green-600" />
                    Registros do Dia
                  </h2>
                  <p className="text-gray-500 mt-1">Gerencie seus pedidos. Use os botões abaixo para backup ou relatórios.</p>
                </div>
              </div>
              <RecordsTable 
                plans={plans} 
                onEdit={handleEdit} 
                onDelete={handleDelete}
                onImport={handleImportData}
              />
            </div>
          )}
        </main>
      </Layout>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-around items-center z-50 shadow-lg">
        <button 
          onClick={() => { setActiveTab('form'); setEditingPlan(null); }}
          className={`flex flex-col items-center gap-1 ${activeTab === 'form' ? 'text-green-600' : 'text-gray-400'}`}
        >
          <LayoutDashboard size={24} />
          <span className="text-xs font-bold uppercase">Cadastro</span>
        </button>
        <button 
          onClick={() => setActiveTab('records')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'records' ? 'text-green-600' : 'text-gray-400'}`}
        >
          <TableProperties size={24} />
          <span className="text-xs font-bold uppercase">Registros</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
