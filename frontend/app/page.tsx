'use client';

import { useState, useEffect } from 'react';

const THEME = {
  bg: '#0F172A',
  card: '#1E293B',
  primary: '#6366F1',
  primaryGradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
  secondary: '#94A3B8',
  white: '#FFFFFF'
};

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLogged(!!localStorage.getItem('accessToken'));
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: THEME.bg, fontFamily: 'Inter, sans-serif' }}>
      {/* Navbar */}
      <div style={{ 
        padding: '16px 40px', 
        background: 'rgba(30, 41, 59, 0.8)', 
        backdropFilter: 'blur(12px)',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => window.location.href='/'}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: THEME.primaryGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🎓</div>
          <h1 style={{ color: THEME.white, margin: 0, fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px' }}>CourseLit</h1>
        </div>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <a href="/" style={{ color: THEME.primary, textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>Home</a>
          <a href="/subjects" style={{ color: THEME.secondary, textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>Courses</a>
          <a href="/materials" style={{ color: THEME.secondary, textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>Materials</a>
          <a href="/about" style={{ color: THEME.secondary, textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>About</a>
          
          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 10px' }}></div>
          
          {isLogged ? (
            <a href="/subjects" style={{ 
              background: THEME.primaryGradient, 
              color: THEME.white, 
              padding: '8px 24px', 
              borderRadius: '10px', 
              textDecoration: 'none', 
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
            }}>My Dashboard</a>
          ) : (
            <>
              <a href="/auth/login" style={{ color: THEME.white, textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>Sign In</a>
              <a href="/auth/register" style={{ 
                background: 'rgba(255,255,255,0.1)', 
                color: THEME.white, 
                padding: '8px 24px', 
                borderRadius: '10px', 
                textDecoration: 'none', 
                fontWeight: '600',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}>Sign Up</a>
            </>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '120px 20px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        gap: '60px'
      }}>
        <div style={{ flex: 1, position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '20px', color: THEME.primary, fontSize: '13px', fontWeight: '700', marginBottom: '24px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: THEME.primary, display: 'inline-block' }}></span>
            V2.0 NOW LIVE
          </div>
          <h1 style={{ 
            color: THEME.white, 
            fontSize: '64px', 
            fontWeight: '800', 
            lineHeight: '1.1', 
            letterSpacing: '-2px',
            marginBottom: '24px'
          }}>
            Master the tech <br/>
            skills of <span style={{ background: THEME.primaryGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>tomorrow.</span>
          </h1>
          <p style={{ color: THEME.secondary, fontSize: '18px', lineHeight: '1.6', marginBottom: '40px', maxWidth: '480px' }}>
            Transform your career with industry-led curriculum, interactive AI tutoring, and granular progress tracking built for modern learners.
          </p>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="/subjects" 
               style={{ 
                 background: THEME.primaryGradient, 
                 color: THEME.white, 
                 padding: '16px 36px', 
                 borderRadius: '14px', 
                 textDecoration: 'none', 
                 fontWeight: '700',
                 fontSize: '16px',
                 boxShadow: isHovered ? '0 12px 28px rgba(99,102,241,0.4)' : '0 8px 20px rgba(99,102,241,0.3)',
                 transform: isHovered ? 'translateY(-2px)' : 'none',
                 transition: 'all 0.3s ease'
               }}
               onMouseEnter={() => setIsHovered(true)}
               onMouseLeave={() => setIsHovered(false)}
            >
              Start Learning Now
            </a>
            <a href="/about" style={{ 
                 background: 'rgba(255,255,255,0.05)', 
                 color: THEME.white, 
                 border: '1px solid rgba(255,255,255,0.1)',
                 padding: '16px 36px', 
                 borderRadius: '14px', 
                 textDecoration: 'none', 
                 fontWeight: '600',
                 fontSize: '16px',
                 transition: 'all 0.3s ease'
               }}
            >
              Learn More
            </a>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '48px', color: THEME.secondary, fontSize: '13px', fontWeight: '500' }}>
            <div style={{ display: 'flex' }}>
               {[1,2,3,4].map(i => (
                 <div key={i} style={{ width: '32px', height: '32px', borderRadius: '50%', background: THEME.card, border: `2px solid ${THEME.bg}`, marginLeft: i > 1 ? '-12px' : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>👤</div>
               ))}
            </div>
            <span>Over 10,000+ students joined</span>
          </div>
        </div>
        
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            width: '120%', 
            height: '120%', 
            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(15,23,42,0) 70%)',
            pointerEvents: 'none',
            zIndex: 0
          }}></div>
          <div style={{ 
            background: 'rgba(30, 41, 59, 0.4)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: '24px', 
            padding: '24px',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            zIndex: 1,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <img src="https://placehold.co/800x600/1E293B/C7D2FE?text=Code+Editor+Preview" alt="Platform Preview" style={{ width: '100%', borderRadius: '16px' }} />
            
            <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', background: THEME.card, border: '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: THEME.primaryGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🤖</div>
              <div>
                <div style={{ color: THEME.white, fontWeight: '700', fontSize: '14px' }}>AI Tutor Active</div>
                <div style={{ color: THEME.primary, fontSize: '12px', fontWeight: '600' }}>Ready to help 24/7</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features */}
      <div style={{ background: '#0B1120', padding: '100px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ color: THEME.white, fontSize: '36px', fontWeight: '800', marginBottom: '16px' }}>Why learn with CourseLit?</h2>
            <p style={{ color: THEME.secondary, fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>We combine world-class curriculum with next-generation AI tools to make learning 10x more effective.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
            {[
              { icon: '🎥', title: 'Granular Progress Tracking', desc: 'Watch videos directly on the platform and never lose your spot with automatic per-lesson tracking.' },
              { icon: '🤖', title: 'Personal AI Assistant', desc: 'Stuck on a concept? Our built-in AI tutor is aware of your context and explains things brilliantly.' },
              { icon: '💻', title: 'Premium UI Experience', desc: 'A slick, distraction-free environment designed to keep you focused and engaged in the flow.' }
            ].map((f, i) => (
              <div key={i} style={{ background: THEME.card, padding: '40px 30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '40px', marginBottom: '20px' }}>{f.icon}</div>
                <h3 style={{ color: THEME.white, fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>{f.title}</h3>
                <p style={{ color: THEME.secondary, lineHeight: '1.6', fontSize: '15px' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}