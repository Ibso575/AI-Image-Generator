const API_KEY = "YOUR_GEMINI_API_KEY";

const MODEL_ENDPOINTS = {
  "gemini-2.0-flash-preview-image-generation": "gemini-2.0-flash-preview-image-generation",
  "gemini-2.0-flash": "gemini-2.0-flash",
  "black-forest-labs/FLUX.1-dev": "gemini-2.0-flash-preview-image-generation",
  "black-forest-labs/FLUX.1-schnell": "gemini-2.0-flash-preview-image-generation",
  "stabilityai/stable-diffusion-xl-base-1.0": "gemini-2.0-flash-preview-image-generation",
  "runwayml/stable-diffusion-v1-5": "gemini-2.0-flash-preview-image-generation",
  "prompthero/openjourney": "gemini-2.0-flash-preview-image-generation",
};

const ASPECT_RATIO = {
  "1/1": "1:1",
  "16/9": "16:9",
  "9/16": "9:16",
};

const promptInput = document.getElementById("promptInput");
const promptBtn = document.getElementById("randomPrompt");
const modelSelect = document.getElementById("modelSelect");
const imageCountSelect = document.getElementById("imageCountSelect");
const aspectRatioSelect = document.getElementById("aspectRatioSelect");
const generateBtn = document.getElementById("generateBtn");
const galleryGrid = document.getElementById("galleryGrid");
const themeToggle = document.querySelector(".theme-toggle");

const promptPool = [
  "A witch's cottage in fall with magic herbs in the garden",
  "An enchanted futuristic city at sunrise",
  "A peaceful garden with floating glowing lanterns",
  "A cozy cabin beside a lake in winter",
  "An ancient forest with crystal trees and a hidden path",
  "A minimal sci-fi room with moonlight and neon details",
  "A magical castle in the clouds with golden birds",
  "A colorful tropical garden with tiny fantasy creatures",
];

function randomPrompt() {
  const prompt = promptPool[Math.floor(Math.random() * promptPool.length)];
  promptInput.value = prompt;
}

function renderLoadingCards(count) {
  const number = Math.min(Math.max(Number(count) || 1, 1), 4);
  galleryGrid.innerHTML = "";

  for (let i = 0; i < number; i++) {
    const card = document.createElement("article");
    card.className = "img-card loading";

    card.innerHTML = `
      <div class="status-container">
        <div class="spinner"><span class="spinner-core"></span></div>
        <p class="status-text">Generating...</p>
      </div>
      <img class="result-img" src="./img/test.png" alt="">
      <div class="img-overlay">
        <button class="img-download-btn" type="button">
          <i class="fa-solid fa-download"></i>
        </button>
      </div>
    `;

    galleryGrid.appendChild(card);
  }
}

function endpointForModel(model) {
  return MODEL_ENDPOINTS[model] || "gemini-2.0-flash-preview-image-generation";
}

function buildGeminiUrl(model) {
  const modelName = endpointForModel(model);
  return `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;
}

async function generateImage(prompt, model, ratio) {
  const url = buildGeminiUrl(model);
  const payload = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
      imageConfig: {
        aspectRatio: ASPECT_RATIO[ratio] || "1:1",
      },
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.error?.message || "Gemini image generation failed");
  }

  const data = await response.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];

  const imagePart = parts.find(
    (part) => part.inlineData && part.inlineData.mimeType?.startsWith("image/")
  );

  if (!imagePart) {
    throw new Error("No image returned by Gemini API");
  }

  const mimeType = imagePart.inlineData.mimeType || "image/png";
  const imageData = imagePart.inlineData.data;
  return `data:${mimeType};base64,${imageData}`;
}

function placeImage(card, imageDataUrl) {
  const img = card.querySelector(".result-img");
  img.src = imageDataUrl;
  img.alt = "Generated image";
  card.classList.remove("loading");

  const status = card.querySelector(".status-container");
  if (status) {
    status.remove();
  }
}

async function generateImages() {
  const prompt = promptInput.value.trim();
  const model = modelSelect.value;
  const count = Number(imageCountSelect.value || 1);
  const ratio = aspectRatioSelect.value || "1/1";

  if (!prompt) {
    promptInput.focus();
    return;
  }

  if (!model) {
    modelSelect.focus();
    return;
  }

  if (!ratio) {
    aspectRatioSelect.focus();
    return;
  }

  renderLoadingCards(count);
  generateBtn.disabled = true;
  generateBtn.innerHTML = `<span>Generating...</span>`;

  try {
    const imagePromises = [];

    for (let i = 0; i < count; i++) {
      imagePromises.push(
        generateImage(prompt, model, ratio)
          .then((imageDataUrl) => {
            const card = galleryGrid.children[i];
            if (card) {
              placeImage(card, imageDataUrl);
            }
          })
          .catch((error) => {
            const card = galleryGrid.children[i] || galleryGrid.appendChild(document.createElement("article"));
            card.className = "img-card loading";
            card.innerHTML = `<div class="status-container"><div class="spinner"><span class="spinner-core"></span></div><p class="status-text">${error.message || "Generation error"}</p></div>`;
          })
      );
    }

    await Promise.all(imagePromises);

    galleryGrid.querySelectorAll(".img-download-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const card = event.currentTarget.closest(".img-card");
        const img = card.querySelector(".result-img");
        const link = document.createElement("a");
        link.href = img.src;
        link.download = "generated-image.png";
        document.body.appendChild(link);
        link.click();
        link.remove();
      });
    });
  } catch (error) {
    galleryGrid.innerHTML = "";
    const errorCard = document.createElement("article");
    errorCard.className = "img-card loading";
    errorCard.innerHTML = `<div class="status-container"><div class="spinner"><span class="spinner-core"></span></div><p class="status-text">${error.message || "Failed to generate image"}</p></div>`;
    galleryGrid.appendChild(errorCard);
  } finally {
    generateBtn.disabled = false;
    generateBtn.innerHTML = `<i class="fa-solid fa-wand-sparkles"></i><span>Generate</span>`;
  }
}

promptBtn.addEventListener("click", randomPrompt);
generateBtn.addEventListener("click", generateImages);

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const icon = themeToggle.querySelector("i");
  icon.classList.toggle("fa-moon");
  icon.classList.toggle("fa-sun");
});
