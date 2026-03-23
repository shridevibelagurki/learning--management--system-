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

export default function MaterialsPage() {
  const materials = [
    { title: 'Python 3 Cheat Sheet', type: 'PDF', size: '2.4 MB', icon: '📄' },
    { title: 'React 18 Architecture Diagram', type: 'Image', size: '1.1 MB', icon: '🖼️' },
    { title: 'Node.js Express Starter Template', type: 'ZIP', size: '840 KB', icon: '📦' },
    { title: 'SQL Advanced Queries Reference', type: 'PDF', size: '3.2 MB', icon: '📄' },
    { title: 'Docker Compose Examples', type: 'ZIP', size: '120 KB', icon: '📦' },
    { title: 'Git & GitHub Workflow Guide', type: 'PDF', size: '1.8 MB', icon: '📄' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: THEME.bg, fontFamily: 'Inter, sans-serif' }}>
      {/* Navbar Shared Component logic */}
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
          <a href="/materials" style={{ color: THEME.primary, textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>Materials</a>
          <a href="/about" style={{ color: THEME.secondary, textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>About</a>
          
          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 10px' }}></div>
          <a href="/auth/login" style={{ color: THEME.white, textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>Sign In</a>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '80px 20px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ color: THEME.white, fontSize: '40px', fontWeight: '800', letterSpacing: '-1px', marginBottom: '16px' }}>
            Course Materials & Resources
          </h1>
          <p style={{ color: THEME.secondary, fontSize: '18px', maxWidth: '600px', lineHeight: '1.6' }}>
            Download cheat sheets, starter templates, and reference guides to accelerate your learning alongside our courses.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {materials.map((m, i) => (
            <div key={i} style={{ 
              background: THEME.card, 
              padding: '24px', 
              borderRadius: '16px', 
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s, border-color 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ fontSize: '32px' }}>{m.icon}</div>
                <div style={{ background: 'rgba(255,255,255,0.05)', color: THEME.secondary, fontSize: '11px', fontWeight: '700', padding: '4px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>
                  {m.type}
                </div>
              </div>
              <h3 style={{ color: THEME.white, fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0', lineHeight: '1.4' }}>{m.title}</h3>
              <div style={{ color: THEME.secondary, fontSize: '13px', marginBottom: '24px' }}>Size: {m.size}</div>
              
              <button style={{ 
                marginTop: 'auto',
                background: 'rgba(99,102,241,0.1)', 
                color: THEME.primary, 
                border: 'none', 
                padding: '12px', 
                borderRadius: '10px', 
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'}
              >
                ↓ Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
