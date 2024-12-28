"use client"

import { useState } from 'react';
import { SiWpexplorer } from 'react-icons/si';
import { HiHomeModern } from 'react-icons/hi2';
import { MdAppShortcut } from 'react-icons/md';

interface GlassCardProps {
  icon: React.ReactNode;
  name: string;
  description: string;
  link: string;
  position: 'left' | 'center' | 'right';
  isHovered: boolean;
}

const GlassCard = ({ icon, name, description, link, position, isHovered }: GlassCardProps) => {
  // Define rotation and translation based on position
  const getTransform = () => {
    if (!isHovered) {
      switch (position) {
        case 'left': return 'rotate(-10deg) translateX(10rem) translateY(-1rem)';
        case 'center': return 'rotate(8deg) translateY(-2rem)';
        case 'right': return 'rotate(20deg) translateX(-10rem) translateY(2rem)';
      }
    } else {
      switch (position) {
        case 'left': return 'rotate(0deg) translateX(-2rem)';
        case 'center': return 'rotate(0deg)';
        case 'right': return 'rotate(0deg) translateX(2rem)';
      }
    }
  };

  return (
    <div 
      className={`relative w-[280px] h-[320px] bg-gradient-to-b from-white/10 to-transparent 
        border border-white/10 shadow-[0_25px_25px_rgba(0,0,0,0.25)] 
        flex flex-col justify-start items-center transition-all duration-500
        rounded-lg backdrop-blur-lg p-6 group`}
      style={{ 
        transform: getTransform()
      }}
    >
      <div className="mb-4">
        {icon}
      </div>
      
      <h3 className="text-white text-xl font-semibold mb-3">
        {name}
      </h3>
      
      <p className="text-white/80 text-center text-sm mb-4">
        {description}
      </p>

      <a 
        href={link}
        className="mt-auto text-teal-400 hover:text-teal-300 transition-colors duration-300"
      >
        Learn More →
      </a>
    </div>
  );
};

const GlassCardsContainer = () => {
  const [isHovered, setIsHovered] = useState(false);

  const cards = [
    {
      icon: <SiWpexplorer size={30} className="text-teal-400" />,
      name: "Local Insights",
      description: "Discover hidden gems and popular spots in your new city, curated by locals",
      link: "/discover",
      position: 'left' as const
    },
    {
      icon: <HiHomeModern size={30} className="text-teal-400" />,
      name: "Housing Solutions",
      description: "Find the perfect home with our community-driven rental listings and insights.",
      link: "/rental",
      position: 'center' as const
    },
    {
      icon: <MdAppShortcut size={30} className="text-teal-400" />,
      name: "Essential Apps",
      description: "Get a curated list of must-have apps used by locals for seamless city living.",
      link: "/application",
      position: 'right' as const
    }
  ];

  return (
    <div 
      className="relative flex justify-center items-center gap-4 py-12 px-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {cards.map((card) => (
        <GlassCard 
          key={card.name}
          {...card}
          isHovered={isHovered}
        />
      ))}
    </div>
  );
};

export default GlassCardsContainer;