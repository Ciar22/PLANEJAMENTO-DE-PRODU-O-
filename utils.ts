
import { addDays, differenceInCalendarDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ProductionPlan } from './types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { APP_NAME } from './constants';

/**
 * Fix: Removed parseISO and subDays imports as they were reported missing from date-fns.
 * Using native new Date() for parsing and addDays(date, -n) for subtraction.
 */

export const calculateDates = (
  receiptDateStr: string,
  deadlineDays: number,
  manufacturingDays: number
) => {
  if (!receiptDateStr) return null;

  // Use new Date() instead of parseISO
  const receiptDate = new Date(receiptDateStr);
  const expectedDeliveryDate = addDays(receiptDate, deadlineDays);
  // Use addDays with negative value instead of subDays
  const productionEntryDeadline = addDays(expectedDeliveryDate, -manufacturingDays);
  const daysUntilProduction = differenceInCalendarDays(productionEntryDeadline, new Date());
  
  // Assuming completion matches expected delivery if started on entry deadline
  const completionForecast = expectedDeliveryDate;

  return {
    expectedDeliveryDate: format(expectedDeliveryDate, 'yyyy-MM-dd'),
    productionEntryDeadline: format(productionEntryDeadline, 'yyyy-MM-dd'),
    daysUntilProduction,
    completionForecast: format(completionForecast, 'yyyy-MM-dd')
  };
};

export const exportToPDF = (plans: ProductionPlan[]) => {
  const doc = new jsPDF({ orientation: 'landscape' });
  const now = format(new Date(), 'dd/MM/yyyy HH:mm');

  doc.setFontSize(18);
  doc.setTextColor(22, 101, 52); // Tailwind green-800
  doc.text(APP_NAME, 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Relatório gerado em: ${now}`, 14, 28);

  const tableColumn = [
    "Cliente", 
    "Produto", 
    "Cidade", 
    "Recebimento", 
    "Prazo (D)", 
    "Entrega", 
    "Fabr. (D)", 
    "Linha", 
    "Entrada Prod.", 
    "Faltam (D)", 
    "Previsão Final"
  ];

  const tableRows = plans.map(p => [
    p.customer,
    p.productType,
    p.city,
    // Use new Date() instead of parseISO
    format(new Date(p.orderReceiptDate), 'dd/MM/yyyy'),
    p.negotiatedDeadlineDays,
    format(new Date(p.expectedDeliveryDate), 'dd/MM/yyyy'),
    p.manufacturingTimeDays,
    p.productionLine,
    format(new Date(p.productionEntryDeadline), 'dd/MM/yyyy'),
    p.daysUntilProduction,
    format(new Date(p.completionForecast), 'dd/MM/yyyy')
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 35,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [22, 101, 52] },
    alternateRowStyles: { fillColor: [240, 253, 244] },
  });

  doc.save(`Relatorio_Producao_${format(new Date(), 'yyyyMMdd_HHmm')}.pdf`);
};

export const getStatusColor = (days: number) => {
  if (days < 0) return 'text-red-600 bg-red-50 border-red-200';
  if (days <= 2) return 'text-orange-600 bg-orange-50 border-orange-200';
  return 'text-green-600 bg-green-50 border-green-200';
};
