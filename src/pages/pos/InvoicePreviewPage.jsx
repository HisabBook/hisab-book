import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { ROUTE_PATHS } from '../../constants/routePaths';
import EmptyState from '../../components/ui/EmptyState';
import {
  clearCurrentInvoicePdf,
  getCurrentInvoicePdf,
} from './invoicePreviewStore';

const STORAGE_KEY = 'hisabbook:lastInvoicePdf';

const InvoicePreviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const iframeRef = useRef(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
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
    <Box
      sx={{
        minHeight: 'calc(100vh - 96px)',
        display: 'grid',
        gap: 2,
        p: { xs: 1, sm: 1.5, md: 2 },
        borderRadius: 4,
        bgcolor: isDark ? 'rgba(2, 12, 27, 0.94)' : theme.palette.background.default,
        border: '1px solid',
        borderColor: isDark ? 'rgba(148, 163, 184, 0.12)' : theme.palette.divider,
        backgroundImage: isDark
          ? 'radial-gradient(circle at top left, rgba(5, 214, 125, 0.08), transparent 26%), radial-gradient(circle at top right, rgba(59, 130, 246, 0.12), transparent 24%)'
          : 'none',
        overflow: 'hidden',
      }}
    >
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: isDark ? 'rgba(7, 25, 44, 0.88)' : theme.palette.background.paper,
          border: '1px solid',
          borderColor: isDark ? 'rgba(148, 163, 184, 0.12)' : theme.palette.divider,
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent='space-between'
            alignItems={{ xs: 'flex-start', md: 'center' }}
            gap={2.5}
          >
            <Box sx={{ minWidth: 0, pr: { md: 2 } }}>
              <Typography
                variant='h6'
                fontWeight={800}
                color={isDark ? 'common.white' : 'text.primary'}
                sx={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
              >
                Invoice Preview
              </Typography>
              <Typography
                variant='body2'
                color={isDark ? 'rgba(226, 232, 240, 0.72)' : 'text.secondary'}
              >
                Review the invoice before downloading or printing it.
              </Typography>
            </Box>

            <Stack
              direction='row'
              spacing={2}
              flexWrap='wrap'
              sx={{
                width: { xs: '100%', md: 'auto' },
                justifyContent: { xs: 'stretch', md: 'flex-end' },
                alignItems: 'stretch',
              }}
            >
              {pdfDataUrl && (
                <Box sx={{ flex: '0 0 auto' }}>
                  <Button
                    component='a'
                    href={pdfDataUrl}
                    download={fileName}
                    variant='contained'
                    startIcon={<PictureAsPdfRoundedIcon />}
                    sx={{
                      minWidth: { xs: '100%', sm: 160 },
                    }}
                  >
                    Download
                  </Button>
                </Box>
              )}
              {pdfDataUrl && (
                <Box sx={{ flex: '0 0 auto' }}>
                  <Button
                    variant='outlined'
                    onClick={handlePrint}
                    startIcon={<PrintRoundedIcon />}
                    sx={{
                      minWidth: { xs: '100%', sm: 140 },
                    }}
                  >
                    Print
                  </Button>
                </Box>
              )}
              <Box sx={{ flex: '0 0 auto' }}>
                <Button
                  variant='outlined'
                  onClick={handleClose}
                  startIcon={<ArrowBackRoundedIcon />}
                  sx={{
                    minWidth: { xs: '100%', sm: 160 },
                  }}
                >
                  Back to POS
                </Button>
              </Box>
            </Stack>
          </Stack>

          <Divider
            sx={{
              my: 2.5,
              borderColor: isDark ? 'rgba(148, 163, 184, 0.14)' : theme.palette.divider,
            }}
          />

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.75}
            sx={{
              color: isDark ? 'rgba(226, 232, 240, 0.74)' : 'text.secondary',
              alignItems: { xs: 'flex-start', sm: 'center' },
            }}
          >
            <Box
              sx={{
                px: 1.75,
                py: 0.9,
                borderRadius: 2.5,
                bgcolor: isDark ? 'rgba(15, 30, 49, 0.72)' : theme.palette.grey[100],
              }}
            >
              <Typography variant='body2' sx={{ fontWeight: 700 }}>
                File: {previewTitle}
              </Typography>
            </Box>
            <Box
              sx={{
                px: 1.75,
                py: 0.9,
                borderRadius: 2.5,
                bgcolor: isDark ? 'rgba(15, 30, 49, 0.72)' : theme.palette.grey[100],
              }}
            >
              <Typography variant='body2' sx={{ fontWeight: 700 }}>
                Status: {pdfDataUrl ? 'Ready' : 'Missing'}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          borderRadius: 3,
          border: '1px solid',
          borderColor: isDark ? 'rgba(148, 163, 184, 0.12)' : theme.palette.divider,
          bgcolor: isDark ? 'rgba(7, 25, 44, 0.84)' : theme.palette.background.paper,
          overflow: 'hidden',
          boxShadow: isDark ? '0 20px 60px rgba(2, 8, 23, 0.28)' : theme.shadows[2],
        }}
      >
        {pdfDataUrl ? (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              p: { xs: 1, sm: 2 },
              overflow: 'auto',
              bgcolor: isDark ? 'rgba(2, 12, 27, 0.35)' : theme.palette.grey[50],
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Box
              component='iframe'
              ref={iframeRef}
              title='Invoice PDF Preview'
              src={pdfDataUrl}
              sx={{
                width: '100%',
                maxWidth: 960,
                minHeight: { xs: 640, md: 900 },
                height: '100%',
                border: 0,
                bgcolor: 'common.white',
                borderRadius: 2,
                boxShadow: theme.shadows[4],
              }}
            />
          </Box>
        ) : (
          <EmptyState
            icon={<PictureAsPdfRoundedIcon sx={{ fontSize: 56, mb: 1.5, opacity: 0.55 }} />}
            color={isDark ? 'rgba(226, 232, 240, 0.72)' : 'text.secondary'}
            message='No invoice PDF found'
            details='Go back to POS and finish a checkout to generate a preview.'
          />
        )}
      </Box>
    </Box>
  );
};

export default InvoicePreviewPage;
