import { useEffect, useRef } from 'react';
import { Camera, Video, Mic, MonitorPlay, Film, VideoIcon, Share2, Download } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ICONS = [Camera, Video, Mic, MonitorPlay, Film, VideoIcon, Share2, Download];

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  icon: typeof ICONS[number];
  rotation: number;
  rotationSpeed: number;
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const gradientAngle = useRef(0);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles.current = Array.from({ length: 15 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 20 + Math.random() * 20,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: 0.1 + Math.random() * 0.2,
        icon: ICONS[Math.floor(Math.random() * ICONS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02
      }));
    };

    const drawGradientBackground = () => {
      gradientAngle.current += 0.001;
      const gradient = ctx.createLinearGradient(
        0, 0,
        canvas.width * Math.cos(gradientAngle.current),
        canvas.height * Math.sin(gradientAngle.current)
      );
      
      if (theme === 'light') {
        gradient.addColorStop(0, 'rgba(238, 242, 255, 0.8)');   // Light indigo
        gradient.addColorStop(0.5, 'rgba(249, 250, 251, 0.8)'); // Light gray
        gradient.addColorStop(1, 'rgba(239, 246, 255, 0.8)');   // Light blue
      } else {
        gradient.addColorStop(0, 'rgba(17, 24, 39, 0.8)');      // Dark gray
        gradient.addColorStop(0.5, 'rgba(31, 41, 55, 0.8)');    // Medium gray
        gradient.addColorStop(1, 'rgba(55, 65, 81, 0.8)');      // Light gray
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawParticle = (particle: Particle) => {
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      ctx.globalAlpha = particle.opacity;
      
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', particle.size.toString());
      svg.setAttribute('height', particle.size.toString());
      
      const Icon = particle.icon;
      const iconElement = <Icon size={particle.size} />;
      
      const div = document.createElement('div');
      div.innerHTML = iconElement.type.toString();
      const paths = div.querySelectorAll('path');
      
      paths.forEach(path => {
        const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathElement.setAttribute('d', path.getAttribute('d') || '');
        pathElement.setAttribute('stroke', theme === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)');
        pathElement.setAttribute('stroke-width', '2');
        pathElement.setAttribute('fill', 'none');
        svg.appendChild(pathElement);
      });

      const img = new Image();
      img.src = 'data:image/svg+xml;base64,' + btoa(svg.outerHTML);
      ctx.drawImage(img, -particle.size / 2, -particle.size / 2);
      
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGradientBackground();

      particles.current.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.rotation += particle.rotationSpeed;

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        drawParticle(particle);
      });

      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    createParticles();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ background: theme === 'light' ? 'white' : '#111827' }}
    />
  );
}