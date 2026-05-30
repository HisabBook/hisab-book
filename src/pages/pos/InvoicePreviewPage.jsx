import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { ROUTE_PATHS } from '../../constants/routePaths';
import {
  clearCurrentInvoicePdf,
  getCurrentInvoicePdf,
} from './invoicePreviewStore';

const STORAGE_KEY = 'hisabbook:lastInvoicePdf';

const InvoicePreviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const iframeRef = useRef(null);
  const [pdfDataUrl, setPdfDataUrl] = useState('');
  const [fileName, setFileName] = useState('invoice.pdf');

  useEffect(() => {
    const locationPdf = location.state;
    if (locationPdf?.blobUrl) {
      setPdfDataUrl(locationPdf.blobUrl);
      if (locationPdf.fileName) setFileName(locationPdf.fileName);
      return;
    }

    const cached = getCurrentInvoicePdf();
    if (cached?.blobUrl) {
      setPdfDataUrl(cached.blobUrl);
      if (cached.fileName) setFileName(cached.fileName);
      return;
    }

    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      if (parsed?.blobUrl) setPdfDataUrl(parsed.blobUrl);
      if (parsed?.fileName) setFileName(parsed.fileName);
    } catch {
      setPdfDataUrl('');
    }
  }, [location.state]);

  useEffect(() => {
    return () => {
      if (pdfDataUrl) URL.revokeObjectURL(pdfDataUrl);
    };
  }, [pdfDataUrl]);

  const previewTitle = useMemo(() => fileName || 'Invoice PDF', [fileName]);

  const handleClose = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    if (pdfDataUrl) URL.revokeObjectURL(pdfDataUrl);
    clearCurrentInvoicePdf();
    navigate(ROUTE_PATHS.POS, { replace: true });
  };

  const handlePrint = () => {
    const iframeWindow = iframeRef.current?.contentWindow;
    if (iframeWindow) {
      iframeWindow.focus();
      iframeWindow.print();
    }
  };

  return (
    <Paper
      sx={{
        minHeight: 'calc(100vh - 96px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction='row' justifyContent='space-between' alignItems='center' gap={2}>
          <Typography variant='h6' fontWeight={700}>
            {previewTitle}
          </Typography>
          <Stack direction='row' gap={1}>
            {pdfDataUrl && (
              <Button component='a' href={pdfDataUrl} download={fileName}>
                Download
              </Button>
            )}
            {pdfDataUrl && (
              <Button variant='outlined' onClick={handlePrint}>
                Print
              </Button>
            )}
            <Button variant='outlined' onClick={handleClose}>
              Back to POS
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, bgcolor: 'grey.100' }}>
        {pdfDataUrl ? (
          <Box
            component='iframe'
            ref={iframeRef}
            title='Invoice PDF Preview'
            src={pdfDataUrl}
            sx={{ width: '100%', height: '100%', border: 0 }}
          />
        ) : (
          <Box sx={{ p: 3 }}>
            <Typography variant='body1'>No invoice PDF found.</Typography>
            <Button onClick={handleClose} sx={{ mt: 2 }}>
              Return to POS
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default InvoicePreviewPage;
