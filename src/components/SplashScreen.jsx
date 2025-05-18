import { useEffect, useRef } from "react";

const SplashScreen = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: null, y: null, radius: 40 });
  const imageDataRef = useRef(null);
  const animationStartRef = useRef(null);
  const textAnimationRef = useRef({ opacity: 0, scale: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    let animationFrameId;

    // Particle class for desktop
    class Particle {
      constructor(x, y) {
        const imageData = imageDataRef.current;
        this.x = x + (canvas.width / window.devicePixelRatio - imageData.width) / 2;
        this.y = y + (canvas.height / window.devicePixelRatio - imageData.height) / 2;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = 1.5;
        this.density = Math.random() * 20 + 1;
        this.color = "#DFDFDF";
        this.angle = Math.random() * 2 * Math.PI;
        this.alpha = 0;
        this.targetAlpha = 1;
      }

      draw() {
        ctx.fillStyle = `rgba(223, 223, 223, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      update(deltaTime) {
        if (this.alpha < this.targetAlpha) {
          this.alpha += deltaTime * 0.002;
          if (this.alpha > this.targetAlpha) this.alpha = this.targetAlpha;
        }

        let dx = mouseRef.current.x - this.x;
        let dy = mouseRef.current.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (
          mouseRef.current.x !== null &&
          mouseRef.current.y !== null &&
          distance < mouseRef.current.radius
        ) {
          let angle = Math.atan2(dy, dx);
          let force = (mouseRef.current.radius - distance) / mouseRef.current.radius;
          let directionX = Math.cos(angle) * force * this.density * 0.4;
          let directionY = Math.sin(angle) * force * this.density * 0.4;

          this.x -= directionX;
          this.y -= directionY;
        } else {
          this.angle += 0.02;
          this.x += (this.baseX - this.x) * 0.1 + Math.cos(this.angle) * 0.2;
          this.y += (this.baseY - this.y) * 0.1 + Math.sin(this.angle) * 0.2;
        }
      }
    }

    const createParticles = () => {
      particlesRef.current = [];
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const fontSize = Math.min((canvas.width / window.devicePixelRatio) * 0.2, 120);
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillStyle = "#DFDFDF";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const text = "OUTFLOW";
      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;
      const maxWidth = (canvas.width / window.devicePixelRatio) * 0.9;
      if (textWidth > maxWidth) {
        const scale = maxWidth / textWidth;
        ctx.font = `bold ${fontSize * scale}px Arial`;
      }

      ctx.fillText(
        text,
        canvas.width / window.devicePixelRatio / 2,
        canvas.height / window.devicePixelRatio / 2
      );

      imageDataRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const step = 3;
      for (let y = 0; y < imageDataRef.current.height; y += step) {
        for (let x = 0; x < imageDataRef.current.width; x += step) {
          let index = (y * imageDataRef.current.width + x) * 4;
          if (imageDataRef.current.data[index + 3] >= 128) {
            particlesRef.current.push(new Particle(x, y));
          }
        }
      }
    };

    const drawText = (opacity, scale) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0D0D0D";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const fontSize = Math.min((canvas.width / window.devicePixelRatio) * 0.3, 80);
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillStyle = `rgba(223, 223, 223, ${opacity})`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const text = "OUTFLOW";
      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;
      const maxWidth = (canvas.width / window.devicePixelRatio) * 0.9;
      if (textWidth > maxWidth) {
        const scaleFactor = maxWidth / textWidth;
        ctx.font = `bold ${fontSize * scaleFactor}px Arial`;
      }

      ctx.save();
      ctx.translate(
        canvas.width / window.devicePixelRatio / 2,
        canvas.height / window.devicePixelRatio / 2
      );
      ctx.scale(scale, scale);
      ctx.fillText(text, 0, 0);
      ctx.restore();
    };

    const animate = (time) => {
      if (!animationStartRef.current) animationStartRef.current = time;
      const elapsed = time - animationStartRef.current;

      if (isMobile) {
        const progress = Math.min(elapsed / 1000, 1);
        const opacity = progress;
        const scale = 0.5 + 0.5 * progress;
        textAnimationRef.current = { opacity, scale };
        drawText(opacity, scale);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#0D0D0D";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        particlesRef.current.forEach((p) => {
          p.update(16); // Assume approx 60fps for deltaTime
          p.draw();
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform before scaling
      ctx.scale(dpr, dpr);

      mouseRef.current = { x: null, y: null, radius: isMobile ? 50 : 40 };

      animationStartRef.current = performance.now();
      if (!isMobile) {
        createParticles();
      }
    };

    const updateMousePosition = (e) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      let x, y;

      if (e.touches) {
        x = (e.touches[0].clientX - rect.left) * dpr;
        y = (e.touches[0].clientY - rect.top) * dpr;
      } else {
        x = (e.clientX - rect.left) * dpr;
        y = (e.clientY - rect.top) * dpr;
      }

      mouseRef.current.x = x / dpr;
      mouseRef.current.y = y / dpr;
    };

    const clearMouse = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    resizeCanvas();
    requestAnimationFrame(animate);
    window.addEventListener("resize", resizeCanvas);
    canvas.addEventListener("mousemove", updateMousePosition);
    canvas.addEventListener("mouseleave", clearMouse);
    canvas.addEventListener("touchmove", updateMousePosition, { passive: false });
    canvas.addEventListener("touchend", clearMouse);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", updateMousePosition);
      canvas.removeEventListener("mouseleave", clearMouse);
      canvas.removeEventListener("touchmove", updateMousePosition);
      canvas.removeEventListener("touchend", clearMouse);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden" style={{ backgroundColor: "#0D0D0D" }}>
      <canvas ref={canvasRef} className="absolute w-full h-full touch-none" />
    </div>
  );
};

export default SplashScreen;
