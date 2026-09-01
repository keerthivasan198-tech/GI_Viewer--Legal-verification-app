import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { ToolItem } from '../../types';
import { getPropertyContext } from '../../utils/propertyContext';

interface InteractiveToolCardProps {
  tool: ToolItem;
}

export const InteractiveToolCard: React.FC<InteractiveToolCardProps> = ({ tool }) => {
  const ctx = getPropertyContext();
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [transformStyle, setTransformStyle] = useState('');

  const displayImage = tool.cardImage || tool.imageBanner || '/images/tools/ec_infographic.jpg';

  const params = new URLSearchParams();
  if (ctx.district) params.set('district', ctx.district);
  if (ctx.taluk) params.set('taluk', ctx.taluk);
  if (ctx.village) params.set('village', ctx.village);
  if (ctx.survey) params.set('survey', ctx.survey);
  if (ctx.subdiv) params.set('subdiv', ctx.subdiv);
  if (ctx.patta) params.set('patta', ctx.patta);
  if (ctx.owner) params.set('owner', ctx.owner);
  if (ctx.road) params.set('road', ctx.road);
  if (ctx.area_display) params.set('area', ctx.area_display);
  const targetPath = params.toString() ? `${tool.path}?${params.toString()}` : tool.path;

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });

    // Subtle 3D tilt angles
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`
    );
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <Link
      ref={cardRef}
      to={targetPath}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out'
      }}
      className="group relative flex flex-col transition-all duration-300 ease-out will-change-transform pb-2"
    >
      {/* 1. ONLY THE IMAGE ON TOP (Clean, Uncropped, Rounded Corners, No Nested Backgrounds) */}
      <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-sm group-hover:shadow-2xl transition-all duration-500 mb-5">
        <img
          src={displayImage}
          alt={tool.title}
          className="w-full h-full object-cover object-center transform group-hover:scale-103 transition-transform duration-700 ease-out"
          loading="eager"
        />

        {/* Dynamic Cursor Spotlight Effect directly on the image */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{
            background: `radial-gradient(380px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.18), transparent 70%)`
          }}
        />
      </div>

      {/* 2. BELOW THE IMAGE: ONLY TOOL NAME ON LEFT & ARROW ON RIGHT + UNDERLINE */}
      <div className="pt-1 pb-4 border-b-2 border-slate-900/15 flex items-center justify-between gap-4">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-sky-600 transition-colors leading-tight">
          {tool.title}
        </h3>

        {/* Square Launch Button with Diagonal Arrow ↗ */}
        <div className="w-10 h-10 rounded-md bg-slate-900 text-white flex items-center justify-center shrink-0 group-hover:bg-sky-600 group-hover:scale-105 transition-all duration-200 shadow-xs">
          <ArrowUpRight className="w-5 h-5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
};
