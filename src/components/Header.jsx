export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="header">
      <div className="logo-wrapper">
        <div className="logo">
          <i className="fa-solid fa-wand-magic-sparkles" />
        </div>
        <h1>AI Image Generator</h1>
      </div>

      <button className="theme-toggle" type="button" aria-label="Toggle theme" onClick={onToggleTheme}>
        <i className={theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon'} />
      </button>
    </header>
  );
}
