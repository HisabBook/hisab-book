// src/utils/generateInvoicePDF.js (or correct path)

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency } from './currencyFormatter';

export const generateInvoicePDF = async (saleData, shopSettings, t, i18n) => {
  try {
    const doc = new jsPDF();
    const isRTL = ['fa', 'ps'].includes(i18n.language);

    // --- DEFENSIVE PROGRAMMING: Provide default fallbacks ---
    const sale = saleData || {};
    const settings = shopSettings || {}; // Prevents crash if shopSettings is undefined
    const saleItems = sale.items || [];

    // --- 1. FONT SETUP (Crucial for RTL) ---
    try {
      const fontResponse = await fetch('/assets/fonts/Vazirmatn-Regular.ttf');
      if (!fontResponse.ok) throw new Error('Font not found');
      const fontBlob = await fontResponse.blob();
      const fontData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(fontBlob);
      });
      doc.addFileToVFS('Vazirmatn-Regular.ttf', fontData);
      doc.addFont('Vazirmatn-Regular.ttf', 'Vazirmatn', 'normal');
      doc.setFont('Vazirmatn');
    } catch (fontError) {
      console.error(
        'Failed to load PDF font. RTL text might not render correctly.',
        fontError
      );
      // The PDF will still generate with a default font.
    }

    // --- 2. DOCUMENT SETUP ---
    const pageMargin = 14;
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setR2L(isRTL);

    // --- 3. HEADER ---
    if (settings.logo) {
      try {
        doc.addImage(settings.logo, 'PNG', pageMargin, pageMargin, 30, 30);
      } catch (e) {
        console.error('Could not add logo to PDF:', e);
      }
    }

    doc.setFontSize(16);
    doc.text(
      settings.name || 'Your Shop',
      isRTL ? pageWidth - pageMargin : pageMargin,
      pageMargin + 10,
      { align: isRTL ? 'right' : 'left' }
    );
    doc.setFontSize(10);
    doc.text(
      settings.address || '',
      isRTL ? pageWidth - pageMargin : pageMargin,
      pageMargin + 18,
      { align: isRTL ? 'right' : 'left' }
    );
    doc.text(
      settings.phone || '',
      isRTL ? pageWidth - pageMargin : pageMargin,
      pageMargin + 26,
      { align: isRTL ? 'right' : 'left' }
    );

    doc.setFontSize(12);
    doc.text(
      t('invoice.title', 'INVOICE'),
      isRTL ? pageMargin : pageWidth - pageMargin,
      pageMargin + 10,
      { align: isRTL ? 'left' : 'right' }
    );
    doc.setFontSize(10);
    doc.text(
      `${t('invoice.number', 'Invoice #')}: ${sale.invoiceNumber || 'N/A'}`,
      isRTL ? pageMargin : pageWidth - pageMargin,
      pageMargin + 18,
      { align: isRTL ? 'left' : 'right' }
    );
    doc.text(
      `${t('invoice.date', 'Date')}: ${new Date(sale.createdAt || Date.now()).toLocaleDateString()}`,
      isRTL ? pageMargin : pageWidth - pageMargin,
      pageMargin + 26,
      { align: isRTL ? 'left' : 'right' }
    );

    // --- 4. CUSTOMER DETAILS ---
    let cursorY = pageMargin + 45;
    doc.text(
      `${t('common.customer', 'Customer')}: ${sale.customerName || 'Walk-in'}`,
      isRTL ? pageWidth - pageMargin : pageMargin,
      cursorY,
      { align: isRTL ? 'right' : 'left' }
    );

    // --- 5. ITEMS TABLE ---
    const tableHead = [
      [
        t('invoice.item', 'Item'),
        t('invoice.quantity', 'Qty'),
        t('invoice.unitPrice', 'Unit Price'),
        t('invoice.total', 'Total'),
      ],
    ];
    const tableBody = saleItems.map((item) => [
      `${item.name}${item.imei ? ` (IMEI: ${item.imei})` : ''}`,
      item.quantity,
      formatCurrency(item.sellPrice, sale.currency || 'USD'),
      formatCurrency(
        (item.sellPrice || 0) * (item.quantity || 1),
        sale.currency || 'USD'
      ),
    ]);

    doc.autoTable({
      startY: cursorY + 5,
      head: tableHead,
      body: tableBody,
      theme: 'grid',
      styles: { font: 'Vazirmatn', halign: isRTL ? 'right' : 'left' },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: 255,
        fontStyle: 'bold',
      },
    });

    // --- 6. TOTALS SECTION ---
    cursorY = doc.autoTable.previous.finalY + 10;
    const totals = [
      [
        t('common.subtotal', 'Subtotal'),
        formatCurrency(sale.subtotal || 0, sale.currency),
      ],
      sale.tradeInDeduction > 0
        ? [
            t('pos.tradeInDeduction', 'Trade-in Deduction'),
            `- ${formatCurrency(sale.tradeInDeduction, sale.currency)}`,
          ]
        : null,
      [
        t('common.total', 'Total'),
        formatCurrency(sale.totalAmount || 0, sale.currency),
      ],
      [
        t('pos.amountPaid', 'Amount Paid'),
        formatCurrency(sale.amountPaid || 0, sale.currency),
      ],
      [
        t('pos.dueAmount', 'Due Amount'),
        formatCurrency(sale.dueAmount || 0, sale.currency),
      ],
    ].filter(Boolean); // Filter out the null trade-in row if not applicable

    doc.autoTable({
      startY: cursorY,
      body: totals,
      theme: 'plain',
      tableWidth: 80,
      margin: { left: isRTL ? pageMargin : pageWidth - pageMargin - 80 },
      styles: { font: 'Vazirmatn', cellPadding: 1.5 },
      columnStyles: {
        0: { halign: isRTL ? 'right' : 'left', fontStyle: 'bold' },
        1: { halign: isRTL ? 'left' : 'right' },
      },
    });

    // --- 7. FOOTER & SAVE ---
    cursorY = doc.internal.pageSize.getHeight() - 20;
    doc.setFontSize(8);
    const footerText =
      settings.invoiceNotes ||
      t('invoice.thankYou', 'Thank you for your business!');
    doc.text(footerText, pageWidth / 2, cursorY, { align: 'center' });

    const pdfBlob = doc.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);
    const fileName = `Invoice-${sale.invoiceNumber || 'receipt'}.pdf`;

    return { blobUrl, fileName };
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    // Return a failure state so the UI can handle it
    return { blobUrl: null, fileName: null, error: 'PDF_GENERATION_FAILED' };
  }
};
