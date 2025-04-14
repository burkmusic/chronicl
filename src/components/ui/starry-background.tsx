import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  brightness: number;
  trail: { x: number; y: number; opacity: number }[];
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
      trail: [], // Initialize empty trail array
    }));

    // Animation loop
    const animate = () => {
      // Clear with a solid background
      ctx.fillStyle = 'rgb(10, 15, 30)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Enable crisp rendering
      ctx.imageSmoothingEnabled = false;

      stars.forEach((star) => {
        // Add current position to trail with full opacity
        star.trail.push({ x: star.x, y: star.y, opacity: 1 });
        
        // Limit trail length (adjust for longer/shorter trails)
        if (star.trail.length > 20) {
          star.trail.shift();
        }
        
        // Move star
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
          // Clear trail when star resets
          star.trail = [];
        }

        // Draw trail with decreasing opacity
        for (let i = 0; i < star.trail.length; i++) {
          const point = star.trail[i];
          // Calculate opacity based on position in trail (newer points are more opaque)
          const opacity = (i / star.trail.length) * 0.5;
          
          ctx.beginPath();
          ctx.arc(point.x, point.y, star.size * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.fill();
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