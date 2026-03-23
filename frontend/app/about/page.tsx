'use client';

const THEME = {
  bg: '#0F172A',
  card: '#1E293B',
  primary: '#6366F1',
  primaryGradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
  primaryHover: '#4F46E5',
  secondary: '#94A3B8',
  white: '#FFFFFF'
};

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', background: THEME.bg, fontFamily: 'Inter, sans-serif' }}>
      {/* Navbar Shared Component logic (Inline for simplicity) */}
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
          <a href="/" style={{ color: THEME.secondary, textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>Home</a>
          <a href="/subjects" style={{ color: THEME.secondary, textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>Courses</a>
          <a href="/materials" style={{ color: THEME.secondary, textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>Materials</a>
          <a href="/about" style={{ color: THEME.primary, textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>About</a>
          
          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 10px' }}></div>
          <a href="/auth/login" style={{ color: THEME.white, textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>Sign In</a>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '100px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ color: THEME.primary, fontSize: '14px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>Our Mission</div>
          <h1 style={{ color: THEME.white, fontSize: '48px', fontWeight: '800', letterSpacing: '-1px', marginBottom: '24px', lineHeight: '1.2' }}>
            Democratizing education <br/> with Artificial Intelligence.
          </h1>
          <p style={{ color: THEME.secondary, fontSize: '20px', lineHeight: '1.6' }}>
            We believe that everyone deserves access to a dedicated, patient, and knowledgeable tutor 24/7. CourseLit bridges the gap between premium content and personalized learning.
          </p>
        </div>

        <img src="https://placehold.co/1200x600/1E293B/C7D2FE?text=About+Us+Team" alt="Team" style={{ width: '100%', borderRadius: '24px', marginBottom: '60px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} />

        <div style={{ background: THEME.card, padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h2 style={{ color: THEME.white, fontSize: '28px', fontWeight: '800', marginBottom: '20px' }}>The CourseLit Story</h2>
          <p style={{ color: THEME.secondary, fontSize: '16px', lineHeight: '1.8', marginBottom: '20px' }}>
            Started in 2026, CourseLit emerged from a simple realization: standard video courses are passive. You watch, but if you get stuck, you're on your own. Forums are slow, and private tutors are expensive.
          </p>
          <p style={{ color: THEME.secondary, fontSize: '16px', lineHeight: '1.8' }}>
            By integrating a powerful conversational AI directly into the learning experience, paired with meticulously crafted curricula and granular progress tracking, we've created an environment that feels like having an expert sitting right next to you.
          </p>
        </div>
      </div>
    </div>
  );
}
