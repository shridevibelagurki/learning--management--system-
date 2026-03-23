import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Home, Info, Video } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/subjects', label: 'Subjects', icon: BookOpen },
    { path: '/materials', label: 'Materials', icon: Video },
    { path: '/about', label: 'About', icon: Info },
  ];

  return (
    <nav style={{
      background: '#1e293b',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
          
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{ background: '#6366f1', padding: '8px', borderRadius: '8px' }}>
              <BookOpen color="white" size={24} />
            </div>
            <span style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>
              CourseLit
            </span>
          </Link>

          <div style={{ display: 'flex', gap: '24px' }}>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    textDecoration: 'none',
                    color: isActive ? '#818cf8' : '#cbd5e1',
                    fontWeight: isActive ? '600' : '400',
                    transition: 'color 0.2s ease',
                    borderBottom: isActive ? '2px solid #818cf8' : '2px solid transparent',
                    padding: '20px 0'
                  }}
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navigation;
