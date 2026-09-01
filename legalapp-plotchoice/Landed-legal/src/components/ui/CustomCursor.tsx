import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [hoverState, setHoverState] = useState<'default' | 'button' | 'card' | 'input'>('default');
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const followerPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Only enable for desktop mice without reduced motion
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isFinePointer && !prefersReducedMotion) {
      setEnabled(true);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!isVisible) setIsVisible(true);

      // Instant 0ms Zero-Latency Hardware-Synchronized Lead Dot
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check hovered elements with high responsiveness
      const target = e.target as HTMLElement | null;
      if (target) {
        if (target.closest('input, select, textarea')) {
          setHoverState('input');
        } else if (target.closest('a, button, [role="button"]')) {
          setHoverState('button');
        } else if (target.closest('.group, [data-card]')) {
          setHoverState('card');
        } else {
          setHoverState('default');
        }
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);

    // High-Sensitivity Low-Latency Follower (High lerp 0.55 for instant snappy glide)
    let animId: number;
    const animateFollower = () => {
      const lerp = 0.55; // Ultra-snappy high-sensitivity responsiveness
      followerPos.current.x += (mousePos.current.x - followerPos.current.x) * lerp;
      followerPos.current.y += (mousePos.current.y - followerPos.current.y) * lerp;

      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${followerPos.current.x}px, ${followerPos.current.y}px, 0)`;
      }

      animId = requestAnimationFrame(animateFollower);
    };
    animId = requestAnimationFrame(animateFollower);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [enabled, isVisible]);

  if (!enabled) return null;

  // Dynamic state styles for the outer halo
  let followerClass = 'w-7 h-7 -ml-3.5 -mt-3.5 border border-sky-400/60 bg-sky-400/5';
  if (isClicking) {
    followerClass = 'w-5 h-5 -ml-2.5 -mt-2.5 border-2 border-slate-900 bg-sky-500/30 scale-90';
  } else if (hoverState === 'button') {
    followerClass = 'w-12 h-12 -ml-6 -mt-6 border-2 border-sky-500 bg-sky-400/15 shadow-lg shadow-sky-400/30 scale-110';
  } else if (hoverState === 'card') {
    followerClass = 'w-14 h-14 -ml-7 -mt-7 border border-sky-400 bg-sky-400/10 shadow-md shadow-sky-300/20 scale-105';
  } else if (hoverState === 'input') {
    followerClass = 'w-4 h-9 -ml-2 -mt-4.5 rounded-md border-2 border-sky-500 bg-sky-500/10';
  }

  return (
    <div className={`pointer-events-none fixed inset-0 z-50 transition-opacity duration-150 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* 1. Snappy High-Sensitivity Outer Halo */}
      <div
        ref={followerRef}
        className={`fixed top-0 left-0 rounded-full transition-[width,height,margin,border-color,background-color,transform] duration-100 ease-out will-change-transform ${followerClass}`}
      />

      {/* 2. Instant 0ms Zero-Latency Center Precision Dot */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 w-2.5 h-2.5 -ml-[5px] -mt-[5px] rounded-full transition-transform duration-75 will-change-transform ${
          isClicking
            ? 'scale-125 bg-slate-900 shadow-sm'
            : hoverState === 'button'
            ? 'scale-125 bg-sky-600 shadow-md shadow-sky-500/60 ring-2 ring-white'
            : 'bg-slate-900 shadow-xs shadow-slate-900/40 ring-1.5 ring-sky-300'
        }`}
      />
    </div>
  );
};
