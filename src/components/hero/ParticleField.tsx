import { useEffect, useRef } from 'react';

/** Decorative, pointer-responsive field. No network, images or animation package. */
export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0, height = 0, frame = 0, visible = true;
    const pointer = { x: -1000, y: -1000 };
    const dots = Array.from({ length: 64 }, (_, i) => ({
      x: ((i * 173 + 41) % 997) / 997,
      y: ((i * 271 + 73) % 991) / 991,
      size: i % 5 === 0 ? 1.7 : .8,
      phase: i * 1.41,
    }));
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width; height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr; canvas.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const move = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left; pointer.y = event.clientY - rect.top;
    };
    const leave = () => { pointer.x = -1000; pointer.y = -1000; };
    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      const still = reduced.matches;
      dots.forEach(dot => {
        let x = dot.x * width + (still ? 0 : Math.sin(time * .00016 + dot.phase) * 13);
        let y = dot.y * height + (still ? 0 : Math.cos(time * .00012 + dot.phase) * 16);
        const dx = x - pointer.x, dy = y - pointer.y, distance = Math.hypot(dx, dy);
        if (!still && distance < 145 && distance > 0) { x += dx / distance * (145 - distance) * .19; y += dy / distance * (145 - distance) * .19; }
        context.beginPath(); context.arc(x, y, dot.size, 0, Math.PI * 2);
        context.fillStyle = dot.size > 1 ? 'rgba(207,244,118,.44)' : 'rgba(214,231,201,.25)'; context.fill();
        if (!still && distance < 125) {
          context.beginPath(); context.moveTo(x, y); context.lineTo(pointer.x, pointer.y);
          context.strokeStyle = `rgba(207,244,118,${(1 - distance / 125) * .14})`; context.lineWidth = .6; context.stroke();
        }
      });
      if (visible && !still) frame = requestAnimationFrame(draw);
    };
    const restart = () => { cancelAnimationFrame(frame); draw(performance.now()); };
    const observer = new ResizeObserver(() => { resize(); if (reduced.matches) draw(0); });
    const intersection = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) restart(); else cancelAnimationFrame(frame); });
    observer.observe(canvas); intersection.observe(canvas);
    const host = canvas.parentElement;
    host?.addEventListener('pointermove', move); host?.addEventListener('pointerleave', leave);
    reduced.addEventListener('change', restart); resize(); restart();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect(); reduced.removeEventListener('change', restart); host?.removeEventListener('pointermove', move); host?.removeEventListener('pointerleave', leave); };
  }, []);
  return <canvas className="landing-particles" ref={canvasRef} aria-hidden="true" />;
}
