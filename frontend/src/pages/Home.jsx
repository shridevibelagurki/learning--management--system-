import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Rocket, Shield, Users } from 'lucide-react';

const Home = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
      {/* Hero Section */}
      <section style={{ 
        textAlign: 'center', 
        padding: '64px 20px', 
        background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)', 
        color: 'white', 
        borderRadius: '24px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '24px', color: 'white' }}>
          Master Your Future with CourseLit
        </h1>
        <p style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto', marginBottom: '40px', color: '#e0e7ff' }}>
          The ultimate platform for interactive learning, expert-led courses, and AI-powered assistance. Accelerate your career today.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link to="/subjects" style={{
            padding: '16px 32px',
            background: 'white',
            color: '#4f46e5',
            borderRadius: '99px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            Explore Courses
          </Link>
          <Link to="/about" style={{
            padding: '16px 32px',
            background: 'transparent',
            border: '2px solid rgba(255,255,255,0.3)',
            color: 'white',
            borderRadius: '99px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            transition: 'background 0.2s',
          }}>
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2.5rem', color: '#1e293b' }}>Why Choose Us?</h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>We provide the best tools to ensure your success.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px' }}>
          {[
            { icon: Rocket, title: 'Fast Learning', desc: 'Accelerate your skills with our curated, high-quality curriculum.' },
            { icon: Users, title: 'Expert Instructors', desc: 'Learn directly from industry veterans and renowned educators.' },
            { icon: BookOpen, title: 'Interactive Materials', desc: 'Engage with video content, quizzes, and live AI tutoring.' },
            { icon: Shield, title: 'Verified Certificates', desc: 'Earn recognized certificates upon course completion.' },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} style={{
                background: 'white',
                padding: '32px',
                borderRadius: '16px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                textAlign: 'center'
              }}>
                <div style={{ 
                  background: '#eef2ff', 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  margin: '0 auto 24px auto'
                }}>
                  <Icon color="#4f46e5" size={32} />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: '#0f172a' }}>{feature.title}</h3>
                <p style={{ color: '#64748b', lineHeight: '1.6' }}>{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;
