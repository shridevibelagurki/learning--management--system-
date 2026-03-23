'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import apiClient from '@/lib/apiClient';

export default function SubjectDetailPage() {
  const params = useParams();
  const subjectId = params.subjectId;
  const [subject, setSubject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  
  const playerRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);
  const lastSyncedPercentRef = useRef<number>(0);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const response = await apiClient.get(`/api/subjects/${subjectId}`);
        setSubject(response.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    if (subjectId) fetchSubject();

    // Load YouTube IFrame API if not already present
    if (typeof window !== 'undefined' && !(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, [subjectId]);

  // Handle YouTube Player Initialization
  useEffect(() => {
    if (!selectedLesson) return;

    const videoId = getYouTubeId(selectedLesson.video_url);
    if (!videoId) return;

    const initPlayer = () => {
      if (playerRef.current) {
        playerRef.current.loadVideoById(videoId);
        return;
      }

      playerRef.current = new (window as any).YT.Player('youtube-player', {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          modestbranding: 1,
          rel: 0
        },
        events: {
          onStateChange: (event: any) => {
            if (event.data === (window as any).YT.PlayerState.PLAYING) {
              startTracking();
            } else {
              stopTracking();
            }
            if (event.data === (window as any).YT.PlayerState.ENDED) {
              syncProgress(100, true);
            }
          }
        }
      });
    };

    if ((window as any).YT && (window as any).YT.Player) {
      initPlayer();
    } else {
      (window as any).onYouTubeIframeAPIReady = initPlayer;
    }

    return () => stopTracking();
  }, [selectedLesson]);

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const startTracking = () => {
    if (progressIntervalRef.current) return;
    progressIntervalRef.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const current = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();
        if (duration > 0) {
          const percent = Math.floor((current / duration) * 100);
          // Only sync if progress moved significantly (every 5%)
          if (percent > lastSyncedPercentRef.current + 5 || percent >= 98) {
            syncProgress(percent);
          }
        }
      }
    }, 2000);
  };

  const stopTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const syncProgress = async (percent: number, isCompleted: boolean = false) => {
    if (!selectedLesson) return;
    lastSyncedPercentRef.current = percent;
    
    try {
      await apiClient.post('/api/progress/lesson', {
        lessonId: selectedLesson.id,
        subjectId: parseInt(subjectId as string),
        isCompleted: isCompleted || percent >= 95,
        watchPercent: percent
      });

      // Update local state for immediate feedback
      setSubject((prev: any) => {
        const newLessons = prev.lessons.map((l: any) => 
          l.id === selectedLesson.id ? { ...l, is_completed: isCompleted || percent >= 95, watch_percent: percent } : l
        );
        const completedCount = newLessons.filter((l: any) => l.is_completed).length;
        return {
          ...prev,
          lessons: newLessons,
          progress_percentage: Math.round((completedCount / (prev.total_lessons || newLessons.length || 1)) * 100),
          completed_lessons: completedCount
        };
      });
    } catch (err) {
      console.error('Failed to sync progress:', err);
    }
  };

  const toggleLessonComplete = async (lessonId: number, currentStatus: boolean) => {
    setUpdating(lessonId);
    try {
      await apiClient.post('/api/progress/lesson', {
        lessonId,
        subjectId: parseInt(subjectId as string),
        isCompleted: !currentStatus,
        watchPercent: !currentStatus ? 100 : 0
      });

      // Update local state
      setSubject((prev: any) => {
        const newLessons = prev.lessons.map((l: any) => 
          l.id === lessonId ? { ...l, is_completed: !currentStatus, watch_percent: !currentStatus ? 100 : 0 } : l
        );
        
        const completedCount = newLessons.filter((l: any) => l.is_completed).length;
        const totalCount = prev.total_lessons || newLessons.length || 1;
        
        return {
          ...prev,
          lessons: newLessons,
          progress_percentage: Math.round((completedCount / totalCount) * 100),
          completed_lessons: completedCount
        };
      });
    } catch (error) {
      console.error('Failed to update progress:', error);
    } finally {
      setUpdating(null);
    }
  };

  const playVideo = (lesson?: any) => {
    if (lesson) {
      setSelectedLesson(lesson);
      lastSyncedPercentRef.current = lesson.watch_percent || 0;
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    // If no lesson passed, try to find the first incomplete one
    const firstIncomplete = subject?.lessons?.find((l: any) => !l.is_completed);
    if (firstIncomplete) {
      playVideo(firstIncomplete);
      return;
    }

    // Fallback to the first lesson if all are complete
    if (subject?.lessons?.length > 0) {
      playVideo(subject.lessons[0]);
      return;
    }

    const links: { [key: number]: string } = {
      20: 'https://www.youtube.com/playlist?list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU',
      21: 'https://www.youtube.com/playlist?list=PLy2T2Tj2a2kL8JqHnXrVxQvZ8QYfRcBQ',
      22: 'https://www.youtube.com/playlist?list=PLsyeobzWxl7oZ-fxDYkOToURHhMuWD1BK',
      23: 'https://www.youtube.com/playlist?list=PLy2T2Tj2a2kL9JqHnXrVxQvZ8QYfRcBQ',
      34: 'https://www.youtube.com/watch?v=Q33KBiDriJY',
      35: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p',
      36: 'https://www.youtube.com/watch?v=usYySG1nbfI',
      37: 'https://www.youtube.com/playlist?list=PLdo5W4Nhv31bbKJzrsKfMpo_grxuLlLsR',
      38: 'https://www.youtube.com/playlist?list=PLZoTAELMXVOsVpJzKbEwCgB5T3pZ6rXgF'
    };
    const url = links[parseInt(subjectId as string)];
    if (url) {
      window.open(url, '_blank');
    } else {
      window.open(`https://www.youtube.com/results?search_query=${subject?.title}+full+course`, '_blank');
    }
  };

  const THEME = {
    bg: '#0F172A',
    card: '#1E293B',
    primary: '#6366F1',
    primaryGradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
    secondary: '#94A3B8',
    white: '#FFFFFF',
    success: '#10B981'
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', color: THEME.white, background: THEME.bg, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>Loading your course...</div>;
  if (!subject) return <div style={{ textAlign: 'center', padding: '100px', color: THEME.white, background: THEME.bg, minHeight: '100vh' }}>Course not found</div>;

  return (
    <div style={{ minHeight: '100vh', background: THEME.bg, padding: '40px 20px', fontFamily: 'Inter, sans-serif' }}>
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
          <a href="/subjects" style={{ color: THEME.primary, textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>Courses</a>
          <a href="/materials" style={{ color: THEME.secondary, textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>Materials</a>
          <a href="/about" style={{ color: THEME.secondary, textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>About</a>
          
          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 10px' }}></div>
          <a href="/subjects" style={{ color: THEME.white, textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>Back to Courses</a>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '40px auto 0 auto' }}>
        <div style={{ 
          background: THEME.card, 
          borderRadius: '24px', 
          overflow: 'hidden', 
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ position: 'relative', minHeight: '420px', background: '#000' }}>
            {selectedLesson ? (
              <div id="youtube-player" style={{ width: '100%', height: '420px' }}></div>
            ) : (
              <>
                <img 
                  src={subject.thumbnail_url || 'https://placehold.co/1000x500/1E293B/white?text=' + subject.title} 
                  alt={subject.title} 
                  style={{ width: '100%', height: '420px', objectFit: 'cover' }}
                  onError={(e: any) => e.target.src = 'https://placehold.co/1000x500/6366F1/white?text=' + subject.title}
                />
                <div style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  background: 'linear-gradient(to bottom, transparent 30%, rgba(15, 23, 42, 0.95) 95%)' 
                }}></div>
              </>
            )}
            
            <div style={{ 
              position: 'absolute', 
              bottom: '40px', 
              left: '40px', 
              right: '40px',
              pointerEvents: 'none' // Don't block clicking lessons if overlaying
            }}>
              <div style={{ fontSize: '12px', color: THEME.primary, fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px' }}>{subject.category}</div>
              <h1 style={{ color: THEME.white, fontSize: '42px', fontWeight: '800', margin: '0 0 10px 0', lineHeight: '1.2', letterSpacing: '-1px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{subject.title}</h1>
              <div style={{ color: THEME.secondary, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
                <span>Taught by <strong style={{ color: THEME.white }}>{subject.instructor_name || 'Expert Instructor'}</strong></span>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div style={{ padding: '40px', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
            <div style={{ flex: '2', minWidth: '300px' }}>
              <div style={{ marginBottom: '40px' }}>
                <h2 style={{ color: THEME.white, fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>About this course</h2>
                <p style={{ color: THEME.secondary, lineHeight: '1.8', fontSize: '16px', marginBottom: '32px' }}>{subject.description}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ color: THEME.secondary, fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>LESSONS</div>
                    <div style={{ color: THEME.white, fontSize: '20px', fontWeight: '800' }}>{subject.total_lessons || 0}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ color: THEME.secondary, fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>LEVEL</div>
                    <div style={{ color: THEME.white, fontSize: '20px', fontWeight: '800' }}>{subject.level}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ color: THEME.secondary, fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>DURATION</div>
                    <div style={{ color: THEME.white, fontSize: '20px', fontWeight: '800' }}>{subject.duration_hours || '15'}h</div>
                  </div>
                </div>
              </div>

              {/* Lesson Items */}
              <div>
                <h2 style={{ color: THEME.white, fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Course Curriculum</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {subject.lessons?.map((lesson: any) => (
                    <div key={lesson.id} style={{ 
                      background: 'rgba(255,255,255,0.03)', 
                      borderRadius: '16px', 
                      padding: '20px',
                      border: '1px solid rgba(255,255,255,0.05)',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      {/* Granular horizontal progress bar */}
                      <div style={{ 
                        position: 'absolute', 
                        bottom: 0, 
                        left: 0, 
                        height: '4px', 
                        width: `${lesson.watch_percent || (lesson.is_completed ? 100 : 0)}%`,
                        background: THEME.primaryGradient,
                        transition: 'width 0.3s ease'
                      }}></div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ 
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '12px', 
                            background: lesson.is_completed ? THEME.success : 'rgba(255,255,255,0.05)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            fontSize: '18px',
                            color: THEME.white
                          }}>
                            {lesson.is_completed ? '✓' : lesson.order_index}
                          </div>
                          <div>
                            <div style={{ color: THEME.white, fontWeight: '600', fontSize: '16px' }}>{lesson.title}</div>
                            <div style={{ color: THEME.secondary, fontSize: '13px' }}>{lesson.duration_minutes} min video</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button 
                            onClick={() => playVideo(lesson)}
                            style={{ 
                              background: selectedLesson?.id === lesson.id ? THEME.primaryGradient : 'rgba(255,255,255,0.1)', 
                              color: THEME.white, 
                              border: 'none', 
                              padding: '8px 16px', 
                              borderRadius: '8px', 
                              fontSize: '13px', 
                              fontWeight: '600', 
                              cursor: 'pointer',
                              boxShadow: selectedLesson?.id === lesson.id ? '0 4px 12px rgba(99,102,241,0.3)' : 'none'
                            }}
                          >
                            {selectedLesson?.id === lesson.id ? '⚡ Watching' : '▶ Play'}
                          </button>
                          <button 
                            disabled={updating === lesson.id}
                            onClick={() => toggleLessonComplete(lesson.id, lesson.is_completed)}
                            style={{ 
                              background: lesson.is_completed ? THEME.success : 'transparent', 
                              color: THEME.white, 
                              border: `1px solid ${lesson.is_completed ? THEME.success : 'rgba(255,255,255,0.2)'}`, 
                              padding: '8px 16px', 
                              borderRadius: '8px', 
                              fontSize: '13px', 
                              fontWeight: '600', 
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            {updating === lesson.id ? '...' : (lesson.is_completed ? 'Completed' : 'Mark Done')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!subject.lessons || subject.lessons.length === 0) && (
                    <div style={{ color: THEME.secondary, fontSize: '15px' }}>
                      Full curriculum details coming soon. Use the 'Start Learning' button to view context on YouTube.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ flex: '1', minWidth: '280px' }}>
              <div style={{ 
                background: 'rgba(15, 23, 42, 0.4)', 
                backdropFilter: 'blur(10px)', 
                padding: '30px', 
                borderRadius: '24px', 
                border: '1px solid rgba(255,255,255,0.08)',
                position: 'sticky',
                top: '100px'
              }}>
                {subject.progress_percentage !== undefined && (
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ color: THEME.white, fontSize: '14px', fontWeight: '700' }}>Overall Progress</span>
                      <span style={{ color: THEME.primary, fontSize: '14px', fontWeight: '800' }}>{subject.progress_percentage}%</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${subject.progress_percentage}%`, 
                        height: '100%', 
                        background: THEME.primaryGradient,
                        transition: 'width 0.5s ease'
                      }}></div>
                    </div>
                  </div>
                )}

                <div style={{ color: THEME.secondary, fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Course Price</div>
                <div style={{ color: THEME.white, fontSize: '36px', fontWeight: '800', marginBottom: '24px' }}>
                  {subject.price === 0 ? 'Free' : `₹${subject.price}`}
                </div>
                
                <button 
                  onClick={() => playVideo()}
                  style={{ 
                    width: '100%', 
                    background: THEME.primaryGradient, 
                    color: THEME.white, 
                    border: 'none', 
                    padding: '16px', 
                    borderRadius: '14px', 
                    fontWeight: '800', 
                    fontSize: '16px',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(99,102,241,0.3)',
                    transition: 'all 0.3s ease',
                    marginBottom: '16px'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(99,102,241,0.4)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(99,102,241,0.3)';
                  }}
                >
                  🚀 Start Learning Now
                </button>
                
                <p style={{ color: THEME.secondary, fontSize: '12px', textAlign: 'center', margin: 0 }}>
                  Full lifetime access • Certificate of completion
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}