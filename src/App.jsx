import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import PromptInput from './components/PromptInput.jsx';
import Controls from './components/Controls.jsx';
import ImageGrid from './components/ImageGrid.jsx';
import { generateImages } from './services/pollinationsApi.js';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1/1');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const randomPrompt = () => {
    const prompts = [
      "A witch's cottage in fall with magic herbs in the garden",
      "An enchanted futuristic city at sunrise",
      "A peaceful garden with floating glowing lanterns",
      "A cozy cabin beside a lake in winter",
      "An ancient forest with crystal trees and a hidden path",
      "A minimal sci-fi room with moonlight and neon details",
      "A magical castle in the clouds with golden birds",
      "A colorful tropical garden with tiny fantasy creatures",
    ];

    setPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  };

  const handleGenerate = async () => {
    if (isLoading) {
      return;
    }

    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) {
      setError('Please describe the image you want.');
      return;
    }

    setError('');
    setIsLoading(true);
    setGeneratedImages([]);

    try {
      const images = await generateImages({ prompt: cleanPrompt, aspectRatio });
      setGeneratedImages(images);
    } catch (err) {
      setError(err.message || 'Image generation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <Header theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} />

      <main className="main-content">
        <section className="prompt-form">
          <PromptInput prompt={prompt} setPrompt={setPrompt} randomPrompt={randomPrompt} />

          <Controls
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            isLoading={isLoading}
            onGenerate={handleGenerate}
          />

          {error && <div className="error-box">{error}</div>}

          <ImageGrid generatedImages={generatedImages} isLoading={isLoading} aspectRatio={aspectRatio} />
        </section>
      </main>
    </div>
  );
}
