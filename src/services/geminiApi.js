const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const MODEL_MAP = {
  'gemini-2.0-flash-preview-image-generation': 'gemini-2.0-flash-preview-image-generation',
  'gemini-2.0-flash': 'gemini-2.0-flash',
};

const ASPECT_MAP = {
  '1/1': '1:1',
  '16/9': '16:9',
  '9/16': '9:16',
};

export async function generateImages({ prompt, model, imageCount, aspectRatio }) {
  if (!API_KEY) {
    throw new Error('VITE_GEMINI_API_KEY is missing. Add it to a .env file.');
  }

  const safeModel = MODEL_MAP[model] || 'gemini-2.0-flash-preview-image-generation';
  const safeCount = Math.min(Math.max(Number(imageCount) || 1, 1), 4);
  const safeAspect = ASPECT_MAP[aspectRatio] || '1:1';

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${safeModel}:generateContent?key=${API_KEY}`;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: `${prompt}\nGenerate a highly detailed visual image with aspect ratio ${safeAspect}.`,
          },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE'],
      imageConfig: {
        aspectRatio: safeAspect,
      },
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const payloadError = await response.json().catch(() => ({}));
    throw new Error(payloadError?.error?.message || 'Gemini image generation failed.');
  }

  const data = await response.json();
  const candidates = data?.candidates ?? [];
  const generatedImages = [];

  for (const candidate of candidates.slice(0, safeCount)) {
    const parts = candidate?.content?.parts ?? [];
    const imagePart = parts.find((part) => part.inlineData?.mimeType?.startsWith('image/'));

    if (imagePart?.inlineData?.data) {
      const mime = imagePart.inlineData.mimeType || 'image/png';
      generatedImages.push(`data:${mime};base64,${imagePart.inlineData.data}`);
    }
  }

  if (!generatedImages.length) {
    throw new Error('Gemini returned no image data.');
  }

  return generatedImages;
}
