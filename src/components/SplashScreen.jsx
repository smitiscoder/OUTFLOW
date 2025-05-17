import { useEffect, useRef } from "react";

const SplashScreen = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: null, y: null, radius: 50 });
  const imageDataRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Set radius for particle interaction
    const setMouseRadius = () => {
      mouseRef.current.radius = window.innerWidth < 768 ? 20 : 50;
    };

    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      setMouseRadius();
      createParticles();
    };

    // Particle class
    class Particle {
      constructor(x, y) {
        const imageData = imageDataRef.current;
        this.x = x + (canvas.width - imageData.width) / 2;
        this.y = y + (canvas.height - imageData.height) / 2;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = 0.6; // Same particle size for both mobile and PC
        this.density = Math.random() * 30 + 1;
        this.color = "#ffffff";
        this.angle = Math.random() * 2 * Math.PI;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      update() {
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
          let directionX = Math.cos(angle) * force * this.density * 0.6;
          let directionY = Math.sin(angle) * force * this.density * 0.6;
          this.x -= directionX;
          this.y -= directionY;
        } else {
          this.angle += 0.01;
          this.x += (this.baseX - this.x) * 0.05 + Math.cos(this.angle) * 0.3;
          this.y += (this.baseY - this.y) * 0.05 + Math.sin(this.angle) * 0.3;
        }
      }
    }

    // Create particles
    const createParticles = () => {
      particlesRef.current = [];
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isMobile = window.innerWidth < 768;
      const fontSize = Math.min(canvas.width * (isMobile ? 0.15 : 0.2), isMobile ? 90 : 120); // Smaller font on mobile
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.letterSpacing = "10px"; // Same letter spacing

      const text = "OUTFLOW";
      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;
      const maxWidth = canvas.width * 0.85;
      if (textWidth > maxWidth) {
        const scale = maxWidth / textWidth;
        ctx.font = `bold ${fontSize * scale}px Arial`;
      }

      ctx.fillText(text, canvas.width / 2, canvas.height / 2);

      imageDataRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const step = 3; // Same step for same particle count
      for (let y = 0; y < imageDataRef.current.height; y += step) {
        for (let x = 0; x < imageDataRef.current.width; x += step) {
          let index = (y * imageDataRef.current.width + x) * 4;
          if (imageDataRef.current.data[index + 3] >= 128) {
            particlesRef.current.push(new Particle(x, y));
          }
        }
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    // Handle mouse/touch movement
    const updateMousePosition = (x, y) => {
      mouseRef.current.x = x;
      mouseRef.current.y = y;
    };

    const handleMouseMove = (e) => {
      updateMousePosition(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        updateMousePosition(touch.clientX, touch.clientY);
      }
    };

    const clearMouse = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    // Init
    setMouseRadius();
    resizeCanvas();
    animate();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("mouseout", clearMouse);
    window.addEventListener("touchend", clearMouse);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseout", clearMouse);
      window.removeEventListener("touchend", clearMouse);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden"
      style={{ backgroundColor: "#0D0D0D" }}
    >
      <canvas ref={canvasRef} className="absolute w-full h-full" />
    </div>
  );
};

export default SplashScreen;