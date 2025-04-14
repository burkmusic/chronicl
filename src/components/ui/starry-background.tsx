import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  brightness: number;
}

export function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to window size
    const resizeCanvas = () => {
      // Set the canvas dimensions to match the window size
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Also set the CSS size to ensure it covers the entire viewport
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
    };
    
    // Initial resize
    resizeCanvas();
    
    // Add resize listener
    window.addEventListener('resize', resizeCanvas);

    // Create stars
    const stars: Star[] = Array.from({ length: 300 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5, // Slightly smaller stars for crispness
      speed: Math.random() * 0.3 + 0.05,
      brightness: Math.random() * 0.5 + 0.5, // Increased minimum brightness
    }));

    // Animation loop
    const animate = () => {
      // Clear with a very dark blue background
      ctx.fillStyle = 'rgba(10, 15, 30, 0.1)'; // Reduced opacity for better star visibility
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Enable crisp rendering
      ctx.imageSmoothingEnabled = false;

      stars.forEach((star) => {
        // Move star
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }

        // Draw star with sharp edges
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
        ctx.fill();

        // Add a small point of bright light in the center
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, star.brightness + 0.3)})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgb(10, 15, 30)',
        zIndex: -1
      }}
    />
  );
} 