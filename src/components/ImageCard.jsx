export default function ImageCard({ image, loading, aspectRatio = '1/1' }) {
  const ratioClass = {
    '1/1': 'ratio-square',
    '16/9': 'ratio-landscape',
    '9/16': 'ratio-portrait',
  }[aspectRatio] || 'ratio-square';

  const copyImage = async () => {
    try {
      if (!image) return;
      await navigator.clipboard.writeText(image);
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = image;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
    }
  };

  const downloadImage = () => {
    if (!image) return;

    const anchor = document.createElement('a');
    anchor.href = image;
    anchor.download = 'pollinations-image.png';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  if (loading) {
    return (
      <article className={`img-card loading ${ratioClass}`}>
        <div className="status-container">
          <div className="spinner"><span className="spinner-core" /></div>
          <p className="status-text">Generating...</p>
        </div>
        <img className="result-img" src="/img/test.png" alt="" />
        <div className="img-overlay">
          <button className="img-download-btn" type="button" aria-label="Download image">
            <i className="fa-solid fa-download" />
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className={`img-card ${ratioClass}`}>
      <img className="result-img" src={image} alt="Generated" />
      <div className="img-overlay">
        <button className="img-copy-btn" type="button" aria-label="Copy image URL" onClick={copyImage}>
          <i className="fa-solid fa-copy" />
        </button>
        <button className="img-download-btn" type="button" aria-label="Download image" onClick={downloadImage}>
          <i className="fa-solid fa-download" />
        </button>
      </div>
    </article>
  );
}
