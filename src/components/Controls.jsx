export default function Controls({
  selectedModel,
  setSelectedModel,
  imageCount,
  setImageCount,
  aspectRatio,
  setAspectRatio,
  isLoading,
  onGenerate,
}) {
  return (
    <div className="prompt-actions">
      <div className="select-wrapper">
        <select id="modelSelect" className="custom-select" required value={selectedModel} onChange={(event) => setSelectedModel(event.target.value)}>
          <option value="" disabled>Select Mode</option>
          <option value="gemini-2.0-flash-preview-image-generation">Gemini Image 2.0</option>
          <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
          <option value="black-forest-labs/FLUX.1-dev">FLUX.1-dev</option>
          <option value="black-forest-labs/FLUX.1-schnell">FLUX.1-schnell</option>
          <option value="stabilityai/stable-diffusion-xl-base-1.0">Stable Diffusion XL</option>
          <option value="runwayml/stable-diffusion-v1-5">Stable Diffusion v1.5</option>
          <option value="prompthero/openjourney">Openjourney</option>
        </select>
      </div>

      <div className="select-wrapper">
        <select id="imageCountSelect" className="custom-select" required value={imageCount} onChange={(event) => setImageCount(Number(event.target.value))}>
          <option value="" disabled>Image Count</option>
          <option value="1">1 Image</option>
          <option value="2">2 Images</option>
          <option value="3">3 Images</option>
          <option value="4">4 Images</option>
        </select>
      </div>

      <div className="select-wrapper">
        <select id="aspectRatioSelect" className="custom-select" required value={aspectRatio} onChange={(event) => setAspectRatio(event.target.value)}>
          <option value="" disabled>Aspect Ratio</option>
          <option value="1/1">Square (1:1)</option>
          <option value="16/9">Landscape (16:9)</option>
          <option value="9/16">Portrait (9:16)</option>
        </select>
      </div>

      <button type="button" id="generateBtn" className="generate-btn" onClick={onGenerate} disabled={isLoading}>
        <i className="fa-solid fa-wand-sparkles" />
        <span>{isLoading ? 'Generating...' : 'Generate'}</span>
      </button>
    </div>
  );
}
