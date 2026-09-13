export default function PromptInput({ prompt, setPrompt, randomPrompt }) {
  return (
    <div className="prompt-container">
      <textarea
        id="promptInput"
        className="prompt-input"
        placeholder="Describe your imagination in detail..."
        required
        autoFocus
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
      />

      <button type="button" id="randomPrompt" className="prompt-btn" onClick={randomPrompt}>
        <i className="fa-solid fa-dice" />
      </button>
    </div>
  );
}
