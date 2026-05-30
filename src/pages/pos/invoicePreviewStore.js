let currentInvoicePdf = null;

export const setCurrentInvoicePdf = (pdf) => {
  currentInvoicePdf = pdf;
};

export const getCurrentInvoicePdf = () => currentInvoicePdf;

export const clearCurrentInvoicePdf = () => {
  currentInvoicePdf = null;
};
