let cachedVazirmatnBase64 = null;
let cachedVazirmatnPromise = null;

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
  if (!cachedVazirmatnPromise) {
    cachedVazirmatnPromise = fetch('/fonts/Vazirmatn-Regular.ttf')
      .then((response) => {
        if (!response.ok) throw new Error('Failed to load Vazirmatn font');
        return response.arrayBuffer();
      })
      .then((buffer) => {
        cachedVazirmatnBase64 = arrayBufferToBase64(buffer);
        return cachedVazirmatnBase64;
      })
      .catch((error) => {
        cachedVazirmatnPromise = null;
        throw error;
      });
  }

  return cachedVazirmatnPromise;
};

export const getVazirmatnBase64 = () => cachedVazirmatnBase64;

export const primeVazirmatnBase64 = () => {
  if (!cachedVazirmatnPromise && !cachedVazirmatnBase64) {
    cachedVazirmatnPromise = loadVazirmatnBase64().catch(() => null);
  }

  return cachedVazirmatnPromise;
};

primeVazirmatnBase64();

