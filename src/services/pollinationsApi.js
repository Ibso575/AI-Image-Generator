const POLLINATIONS_IMAGE_URL = 'https://image.pollinations.ai/prompt/';

const ASPECT_MAP = {
  '1/1': { width: 1024, height: 1024 },
  '16/9': { width: 1600, height: 900 },
  '9/16': { width: 900, height: 1600 },
};

async function translatePromptToEnglish(prompt) {
  const text = (prompt || '').trim();

  if (!text) {
    return '';
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);

    if (!response.ok) {
      return text;
    }

    const payload = await response.json();
    const translated = payload?.[0]?.map?.((entry) => entry?.[0] ?? '').join('') ?? '';
    return translated || text;
  } catch (error) {
    return text;
  }
}

function preloadImage(sourceUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(sourceUrl);
    img.onerror = () => reject(new Error('Image generation failed. Please try a different prompt.'));
    img.src = sourceUrl;
  });
}

export async function generateImages({ prompt, aspectRatio }) {
  const sourcePrompt = (prompt || '').trim();

  if (!sourcePrompt) {
    throw new Error('Please describe the image you want.');
  }

  const englishPrompt = await translatePromptToEnglish(sourcePrompt);
  const selectedSize = ASPECT_MAP[aspectRatio] || ASPECT_MAP['1/1'];
  const imageUrl = `${POLLINATIONS_IMAGE_URL}${encodeURIComponent(englishPrompt)}?width=${selectedSize.width}&height=${selectedSize.height}&nologo=true`;
  const readyImageUrl = await preloadImage(imageUrl);

  return [readyImageUrl];
}
