import ImageCard from './ImageCard.jsx';

export default function ImageGrid({ generatedImages, isLoading, imageCount }) {
  const count = Math.min(Math.max(Number(imageCount) || 4, 1), 4);

  if (isLoading) {
    return (
      <section className="gallery-grid">
        {Array.from({ length: count }).map((_, index) => (
          <ImageCard key={`loading-${index}`} loading={true} />
        ))}
      </section>
    );
  }

  if (!generatedImages.length) {
    return (
      <section className="gallery-grid">
        {Array.from({ length: count }).map((_, index) => (
          <ImageCard key={`placeholder-${index}`} loading={true} />
        ))}
      </section>
    );
  }

  return (
    <section className="gallery-grid">
      {generatedImages.map((image, index) => (
        <ImageCard key={`${image}-${index}`} image={image} loading={false} />
      ))}
    </section>
  );
}
