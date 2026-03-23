import React from 'react';

const About = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', padding: '48px', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
      <h1 style={{ fontSize: '3rem', color: '#1e293b', marginBottom: '24px' }}>About CourseLit</h1>
      <p style={{ fontSize: '1.2rem', color: '#475569', lineHeight: '1.8', marginBottom: '32px' }}>
        CourseLit was founded with a single mission: to make premium education accessible, interactive, and deeply engaging for everyone. We believe that learning shouldn't be a passive experience.
      </p>
      
      <h2 style={{ fontSize: '2rem', color: '#1e293b', marginTop: '40px', marginBottom: '16px' }}>Our Vision</h2>
      <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: '1.7', marginBottom: '24px' }}>
        By combining world-class curriculum with cutting-edge Artificial Intelligence, we provide a personalized learning journey. Our AI Chatbot Tutor is available 24/7 to answer your questions, ensuring you're never stuck on a difficult concept.
      </p>

      <div style={{ background: '#eef2ff', padding: '24px', borderRadius: '12px', borderLeft: '4px solid #4f46e5', marginTop: '48px' }}>
        <h3 style={{ margin: 0, color: '#4f46e5', fontSize: '1.25rem' }}>"Education is the passport to the future, for tomorrow belongs to those who prepare for it today."</h3>
      </div>
    </div>
  );
};

export default About;
