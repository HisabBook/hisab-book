import { jsPDF } from 'jspdf';

export const generateInvoicePDF = (sale) => {
  try {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('HisabBook Invoice', 14, 20);
    doc.setFontSize(11);
    doc.text(`Invoice: ${sale.invoiceNumber}`, 14, 30);
    doc.text(`Date: ${sale.saleDate}`, 14, 37);
    doc.text(`Customer: ${sale.customerName || 'Walk-in'}`, 14, 44);
    doc.text(`Currency: ${sale.currency}`, 14, 51);
    doc.text(`Total: ${sale.totalAmount.toFixed(2)}`, 14, 58);
    doc.text(`Paid: ${sale.amountPaid.toFixed(2)}`, 14, 65);
    doc.text(`Due: ${sale.dueAmount.toFixed(2)}`, 14, 72);
    doc.text(`Change: ${(sale.changeAmount || 0).toFixed(2)}`, 14, 79);

    let y = 90;
    doc.setFontSize(12);
    doc.text('Items', 14, y);
    y += 8;
    doc.setFontSize(10);
    sale.items.forEach((item) => {
      doc.text(
        `${item.name} x${item.quantity} - ${(Number(item.sellPrice) * Number(item.quantity)).toFixed(2)}`,
        14,
        y
      );
      y += 7;
    });

    doc.save(`${sale.invoiceNumber}.pdf`);
  } catch (error) {
    console.error('Invoice generation failed', error);
  }
};
