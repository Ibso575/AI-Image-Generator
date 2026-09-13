import ImageCard from './ImageCard.jsx';

export default function ImageGrid({ generatedImages, isLoading, aspectRatio }) {
  if (isLoading) {
    return (
      <section className="gallery-grid">
        <ImageCard key="loading" loading={true} aspectRatio={aspectRatio} />
      </section>
    );
  }

  if (!generatedImages.length) {
    return <section className="gallery-grid" />;
  }

  return (
    <section className="gallery-grid">
      {generatedImages.map((image, index) => (
        <ImageCard key={`${image}-${index}`} image={image} loading={false} aspectRatio={aspectRatio} />
      ))}
    </section>
  );
}
