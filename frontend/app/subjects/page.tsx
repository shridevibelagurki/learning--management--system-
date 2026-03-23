'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await apiClient.get('/api/subjects');
        setSubjects(response.data.subjects);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const handleLogout = async () => {
    await apiClient.post('/api/auth/logout');
    localStorage.removeItem('accessToken');
    window.location.href = '/auth/login';
  };

  const filteredSubjects = filter === 'learning' 
    ? subjects.filter((s: any) => (s.progress_percentage || 0) > 0 || s.completed_lessons > 0)
    : subjects;

  const THEME = {
    bg: '#0F172A',
    card: '#1E293B',
    primary: '#6366F1',
    primaryGradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
    secondary: '#94A3B8',
    white: '#FFFFFF'
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', color: THEME.white, background: THEME.bg, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
    <div className="loading-spinner"></div>
    <p>Loading your learning journey...</p>
  </div>;

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
          <a href="/" style={{ color: THEME.secondary, textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>Home</a>
          <a href="/subjects" style={{ color: THEME.primary, textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>Courses</a>
          <a href="/materials" style={{ color: THEME.secondary, textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>Materials</a>
          <a href="/about" style={{ color: THEME.secondary, textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>About</a>
          
          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 10px' }}></div>
          
          <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '4px', display: 'flex' }}>
            <button 
              onClick={() => setFilter('all')}
              style={{ padding: '8px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: filter === 'all' ? THEME.primaryGradient : 'transparent', color: THEME.white, fontWeight: '600', transition: 'all 0.2s', fontSize: '14px' }}
            >Explore</button>
            <button 
              onClick={() => setFilter('learning')}
              style={{ padding: '8px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: filter === 'learning' ? THEME.primaryGradient : 'transparent', color: THEME.white, fontWeight: '600', transition: 'all 0.2s', fontSize: '14px' }}
            >My Learning</button>
          </div>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: THEME.secondary, cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>Logout</button>
        </div>
      </div>

      <div style={{ padding: '60px 40px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px' }}>
           <h2 style={{ color: THEME.white, marginBottom: '8px', fontSize: '32px', fontWeight: '800' }}>
             {filter === 'all' ? 'Featured Courses' : 'Your Progress'}
           </h2>
           <p style={{ color: THEME.secondary, fontSize: '16px' }}>
             {filter === 'all' ? 'Master new skills with our professional-led curriculum.' : 'Pick up right where you left off.'}
           </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '30px' }}>
          {filteredSubjects.map((course: any) => (
            <div key={course.id} style={{ 
              background: THEME.card, 
              borderRadius: '20px', 
              overflow: 'hidden', 
              border: '1px solid rgba(255,255,255,0.05)',
              transition: 'all 0.3s ease',
              display: 'flex', 
              flexDirection: 'column', 
              height: '100%',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{ position: 'relative' }}>
                <img 
                  src={course.thumbnail_url || 'https://placehold.co/600x400/1E293B/white?text=' + course.title} 
                  alt={course.title} 
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  onError={(e: any) => e.target.src = 'https://placehold.co/600x400/6366F1/white?text=' + course.title}
                />
                <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', color: THEME.white, padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600' }}>
                  {course.total_lessons || 0} Lessons
                </div>
              </div>

              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '11px', color: THEME.primary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>{course.category}</span>
                  <span style={{ fontSize: '11px', color: THEME.secondary, fontWeight: '600' }}>{course.level}</span>
                </div>
                
                <h3 style={{ color: THEME.white, margin: '0 0 12px 0', fontSize: '20px', fontWeight: '700', lineHeight: '1.4' }}>{course.title}</h3>
                
                <div style={{ color: THEME.secondary, fontSize: '14px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                   <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
                   <span style={{ fontWeight: '500' }}>{course.instructor_name || 'Expert Instructor'}</span>
                </div>

                {/* Prominent Horizontal Progress Bar */}
                {course.progress_percentage > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: THEME.white, fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                      <span>Course Progress</span>
                      <span>{course.progress_percentage}%</span>
                    </div>
                    <div style={{ height: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '5px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${course.progress_percentage}%`, 
                        background: THEME.primaryGradient,
                        borderRadius: '5px',
                        transition: 'width 1s ease-out'
                      }}></div>
                    </div>
                  </div>
                )}

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ color: THEME.white, fontWeight: '800', fontSize: '18px' }}>
                    {course.price === 0 ? 'Free' : `₹${course.price}`}
                  </div>
                  <a 
                    href={`/subjects/${course.id}`} 
                    style={{ 
                      background: THEME.primaryGradient, 
                      color: THEME.white, 
                      padding: '10px 24px', 
                      borderRadius: '12px', 
                      textDecoration: 'none', 
                      fontWeight: '700', 
                      fontSize: '14px',
                      boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {course.progress_percentage > 0 ? 'Continue learning' : 'Start now'}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}