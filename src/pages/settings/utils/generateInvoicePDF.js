import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import reshaperModule from 'arabic-persian-reshaper';
import bidiFactory from 'bidi-js';
import { loadVazirmatnBase64 } from './fontBase64Loader';

const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100;
const isRTL = (language) => language === 'fa' || language === 'ps';

const createTextFormatter = (language) => {
  if (!isRTL(language)) return (value) => String(value ?? '');

  const bidi = bidiFactory();
  return (value) => {
    const text = String(value ?? '');
    const shaped = reshaperModule.default.PersianShaper.convertArabic(text);
    return bidi.getReorderedString(shaped, bidi.getEmbeddingLevels(shaped));
  };
};

const formatMoney = (value) => round2(Number(value) || 0).toFixed(2);

export const generateInvoicePDF = async ({
  sale,
  exchangeRate,
  shopProfile,
  language,
  t,
}) => {
  const fmt = createTextFormatter(language);
  const rtl = isRTL(language);

  const doc = new jsPDF({
    unit: 'mm',
    format: [80, 297],
    compress: true,
  });

  if (rtl) {
    const vazirmatnBase64 = await loadVazirmatnBase64();
    doc.addFileToVFS('Vazirmatn-Regular.ttf', vazirmatnBase64);
    doc.addFont('Vazirmatn-Regular.ttf', 'Vazirmatn', 'normal');
    doc.setFont('Vazirmatn', 'normal');
  } else {
    doc.setFont('helvetica', 'normal');
  }

  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 4;
  let cursorY = 8;

  const drawLine = () => {
    doc.setDrawColor(220);
    doc.line(marginX, cursorY, pageWidth - marginX, cursorY);
    cursorY += 3;
  };

  const drawText = (text, options = {}) => {
    const { size = 10, bold = false } = options;
    doc.setFontSize(size);
    if (!rtl) doc.setFont(undefined, bold ? 'bold' : 'normal');

    const align = rtl ? 'right' : 'left';
    const x = rtl ? pageWidth - marginX : marginX;
    doc.text(fmt(text), x, cursorY, { align });
    cursorY += size * 0.45 + 2;
  };

  const shopName = shopProfile?.shopName || 'HisabBook Store';
  const shopPhone = shopProfile?.shopPhone || '';
  const shopAddress = shopProfile?.shopAddress || '';

  drawText(shopName, { size: 14, bold: true });
  if (shopPhone) drawText(`${t('settings.shopPhone', 'Shop Phone')}: ${shopPhone}`, { size: 9 });
  if (shopAddress) drawText(`${t('settings.shopAddress', 'Shop Address')}: ${shopAddress}`, { size: 9 });
  drawLine();

  drawText(`${t('common.dateAdded', 'Date')}: ${sale.saleDate}`, { size: 9 });
  drawText(`${t('reports.title', 'Reports')}: ${sale.invoiceNumber}`, { size: 9 });
  drawText(`${t('pos.customerName', 'Customer Name')}: ${sale.customerName || 'Walk-in'}`, { size: 9 });
  drawText(`${t('common.currency', 'Currency')}: ${sale.currency}`, { size: 9 });
  drawLine();

  const head = [
    [
      fmt(t('pos.item', 'Item')),
      fmt(t('pos.identifier', 'IMEI/Serial')),
      fmt(t('pos.qty', 'Qty')),
      fmt(t('pos.unitPrice', 'Unit')),
      fmt(t('pos.subtotal', 'Subtotal')),
    ],
  ];

  const body = (sale.items || []).map((item) => {
    const identifier = item.imei || item.serialNumber || '';
    const qty = Number(item.quantity) || 1;
    const unit = Number(item.sellPrice) || 0;
    const subtotal = unit * qty;
    return [
      fmt(item.name),
      fmt(identifier),
      String(qty),
      formatMoney(unit),
      formatMoney(subtotal),
    ];
  });

  autoTable(doc, {
    startY: cursorY,
    head,
    body,
    theme: 'grid',
    styles: {
      font: rtl ? 'Vazirmatn' : 'helvetica',
      fontSize: 8.5,
      cellPadding: 1.4,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [245, 245, 245],
      textColor: [30, 30, 30],
      lineColor: [220, 220, 220],
      lineWidth: 0.2,
      halign: rtl ? 'right' : 'left',
    },
    bodyStyles: {
      textColor: [25, 25, 25],
      lineColor: [230, 230, 230],
      lineWidth: 0.2,
      halign: rtl ? 'right' : 'left',
    },
    columnStyles: {
      2: { halign: 'center', cellWidth: 8 },
      3: { halign: 'right', cellWidth: 13 },
      4: { halign: 'right', cellWidth: 15 },
    },
    margin: { left: marginX, right: marginX },
    didDrawPage: (data) => {
      cursorY = data.cursor.y + 3;
    },
  });

  cursorY = (doc.lastAutoTable?.finalY || cursorY) + 4;
  drawLine();

  const totalInSaleCurrency = Number(sale.totalAmount) || 0;
  const totalUSD = sale.currency === 'AFN' ? totalInSaleCurrency / exchangeRate : totalInSaleCurrency;
  const totalAFN = sale.currency === 'AFN' ? totalInSaleCurrency : totalInSaleCurrency * exchangeRate;

  const paid = Number(sale.amountPaid) || 0;
  const due = Number(sale.dueAmount) || 0;
  const change = Number(sale.changeAmount) || 0;

  drawText(
    `${t('common.total', 'Total')}: ${formatMoney(totalInSaleCurrency)} ${sale.currency}`,
    { size: 10, bold: true }
  );
  drawText(`USD: ${formatMoney(totalUSD)}   AFN: ${formatMoney(totalAFN)}`, { size: 9 });

  if (sale.saleType === 'Exchange' && sale.tradeInDeduction) {
    drawText(
      `${t('pos.tradeIn', 'Trade-in')}: -${formatMoney(sale.tradeInDeduction)} ${sale.currency}`,
      { size: 9 }
    );
  }

  drawText(`${t('pos.amountPaid', 'Amount Paid')}: ${formatMoney(paid)} ${sale.currency}`, {
    size: 9,
  });
  drawText(`${t('pos.dueAmount', 'Due Amount')}: ${formatMoney(due)} ${sale.currency}`, {
    size: 9,
  });
  drawText(`${t('pos.returnChange', 'Return Change')}: ${formatMoney(change)} ${sale.currency}`, {
    size: 9,
  });

  cursorY += 2;
  drawLine();
  drawText(t('pos.thankYou', 'Thank you for your purchase!'), { size: 9 });

  const fileName = `${sale.invoiceNumber}.pdf`;

  // Download
  doc.save(fileName, { returnPromise: true });

  // Print (best-effort; may be blocked by browser popup rules)
  try {
    doc.autoPrint();
    const blobUrl = doc.output('bloburl');
    const win = window.open(blobUrl);
    if (win) {
      win.focus();
      setTimeout(() => {
        try {
          win.print();
        } catch {
          // ignore
        }
      }, 350);
    }
  } catch {
    // ignore printing failures
  }

  // Let the browser flush UI before we release the lock/backdrop.
  await new Promise((resolve) => requestAnimationFrame(() => resolve()));
};
