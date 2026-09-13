export default function Controls({
  aspectRatio,
  setAspectRatio,
  isLoading,
  onGenerate,
}) {
  return (
    <div className="prompt-actions">
      <div className="aspect-panel">
        <span className="aspect-panel-icon" aria-hidden="true">
          <i className="fa-solid fa-image" />
        </span>

        <div className="aspect-panel-select-wrap">
          <select className="aspect-select" value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}>
            <option value="1/1">Square (1:1)</option>
            <option value="16/9">Landscape (16:9)</option>
            <option value="9/16">Portrait (9:16)</option>
          </select>
        </div>
      </div>

      <button type="button" id="generateBtn" className="generate-btn" onClick={() => onGenerate()} disabled={isLoading}>
        <i className="fa-solid fa-wand-sparkles" />
        <span>{isLoading ? 'Generating...' : 'Generate'}</span>
      </button>
    </div>
  );
}
