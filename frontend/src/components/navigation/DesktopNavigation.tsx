
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const DesktopNavigation: React.FC = () => {
  return (
    <nav className="hidden md:flex items-center space-x-4 flex-grow justify-center">
      {/* Courses Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="nav-link flex items-center gap-1">
            Cursuri <ChevronDown size={14} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="bg-white border border-gray-200">
          <Link to="/courses">
            <DropdownMenuItem>Toate cursurile</DropdownMenuItem>
          </Link>
          <Link to="/courses?category=mathematics">
            <DropdownMenuItem>Matematică</DropdownMenuItem>
          </Link>
          <Link to="/courses?category=physics">
            <DropdownMenuItem>Fizică</DropdownMenuItem>
          </Link>
          <Link to="/courses?category=chemistry">
            <DropdownMenuItem>Chimie</DropdownMenuItem>
          </Link>
          <Link to="/courses?category=biology">
            <DropdownMenuItem>Biologie</DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Link to="/subscriptions" className="nav-link">Abonamente</Link>
      <Link to="/tutoring" className="nav-link">Tutoriat</Link>
      <Link to="/blog" className="nav-link">Blog</Link>
      
      {/* Resources Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="nav-link flex items-center gap-1">
            Resurse <ChevronDown size={14} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="bg-white border border-gray-200">
          <Link to="/resources/materials">
            <DropdownMenuItem>Materiale</DropdownMenuItem>
          </Link>
          <Link to="/faq">
            <DropdownMenuItem>Întrebări frecvente</DropdownMenuItem>
          </Link>
          <Link to="/testimonials">
            <DropdownMenuItem>Testimoniale</DropdownMenuItem>
          </Link>
          <Link to="/help">
            <DropdownMenuItem>Ajutor</DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Combined About & Contact Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="nav-link flex items-center gap-1">
            Informații <ChevronDown size={14} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="bg-white border border-gray-200">
          <Link to="/about">
            <DropdownMenuItem>Despre</DropdownMenuItem>
          </Link>
          <Link to="/contact">
            <DropdownMenuItem>Contact</DropdownMenuItem>
          </Link>
          <Link to="/privacy-policy">
            <DropdownMenuItem>Politica de confidențialitate</DropdownMenuItem>
          </Link>
          <Link to="/terms">
            <DropdownMenuItem>Termeni și condiții</DropdownMenuItem>
          </Link>
          <Link to="/careers">
            <DropdownMenuItem>Cariere</DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

export default DesktopNavigation;
