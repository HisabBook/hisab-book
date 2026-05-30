let cachedVazirmatnBase64 = null;

const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
};

export const loadVazirmatnBase64 = async () => {
  if (cachedVazirmatnBase64) return cachedVazirmatnBase64;

  const response = await fetch('/fonts/Vazirmatn-Regular.ttf');
  if (!response.ok) throw new Error('Failed to load Vazirmatn font');
  const buffer = await response.arrayBuffer();
  cachedVazirmatnBase64 = arrayBufferToBase64(buffer);
  return cachedVazirmatnBase64;
};

