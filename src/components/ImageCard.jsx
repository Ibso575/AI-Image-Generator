export default function ImageCard({ image, loading }) {
  if (loading) {
    return (
      <article className="img-card loading">
        <div className="status-container">
          <div className="spinner"><span className="spinner-core" /></div>
          <p className="status-text">Generating...</p>
        </div>
        <img className="result-img" src="/img/test.png" alt="" />
        <div className="img-overlay">
          <button className="img-download-btn" type="button">
            <i className="fa-solid fa-download" />
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className="img-card">
      <img className="result-img" src={image} alt="Generated" />
      <div className="img-overlay">
        <button className="img-download-btn" type="button">
          <i className="fa-solid fa-download" />
        </button>
      </div>
    </article>
  );
}
