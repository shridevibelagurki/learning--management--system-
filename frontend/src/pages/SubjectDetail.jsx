import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, PlayCircle, CheckCircle, Loader2 } from 'lucide-react';
import apiClient from '../../lib/apiClient';
import { toYouTubeEmbedUrl } from '../youtube';

function clampPercent(n) {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

const SubjectDetail = () => {
  const { subjectId } = useParams();
  const [searchParams] = useSearchParams();
  const autoplay = searchParams.get('autoplay') === '1';

  const [subject, setSubject] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState('English');

  const [loading, setLoading] = useState(true);

  const fakeLessons = useMemo(
    () => [
      {
        id: 101,
        title: 'Introduction to the Course',
        duration: '5:30',
        video_url: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
        is_completed: true,
        watch_percent: 100,
      },
      {
        id: 102,
        title: 'Setting Up Your Environment',
        duration: '12:45',
        video_url: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
        is_completed: 0,
        watch_percent: 0,
      },
      {
        id: 103,
        title: 'Core Concepts Part 1',
        duration: '18:20',
        video_url: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
        is_completed: 0,
        watch_percent: 0,
      },
      {
        id: 104,
        title: 'Core Concepts Part 2',
        duration: '22:15',
        video_url: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
        is_completed: 0,
        watch_percent: 0,
      },
      {
        id: 105,
        title: 'Final Project Instructions',
        duration: '8:10',
        video_url: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
        is_completed: 0,
        watch_percent: 0,
      },
    ],
    []
  );

  const iframeSrc = useMemo(() => {
    const base = toYouTubeEmbedUrl(selectedLesson?.video_url);
    if (!base) return '';
    const sep = base.includes('?') ? '&' : '?';
    // mute=1 helps autoplay on most browsers.
    return `${base}${sep}autoplay=${autoplay ? 1 : 0}&mute=1&rel=0`;
  }, [selectedLesson, autoplay]);

  const fetchSubjectWithLanguages = async (lang) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/subjects/${subjectId}/with-languages`, {
        params: { lang: lang || 'English' },
      });

      const data = response.data;
      setSubject(data);
      setAvailableLanguages(data.available_languages || []);
      setCurrentLanguage(data.current_language || lang || 'English');

      const fetchedLessons = data.lessons && data.lessons.length > 0 ? data.lessons : [];
      if (fetchedLessons.length > 0) {
        setLessons(fetchedLessons);
        setSelectedLesson(fetchedLessons[0]);
      } else {
        setLessons(fakeLessons);
        setSelectedLesson(fakeLessons[0]);
      }
    } catch (error) {
      console.error('Failed to fetch subject details', error);

      // Fallback to non-language endpoint (keeps the videos working).
      try {
        const fallback = await apiClient.get(`/api/subjects/${subjectId}`);
        setSubject(fallback.data);

        const fetchedLessons = fallback.data?.lessons && fallback.data.lessons.length > 0 ? fallback.data.lessons : [];
        if (fetchedLessons.length > 0) {
          setLessons(fetchedLessons);
          setSelectedLesson(fetchedLessons[0]);
        } else {
          setLessons(fakeLessons);
          setSelectedLesson(fakeLessons[0]);
        }
      } catch {
        // Last-resort fallback
        setSubject(null);
        setLessons(fakeLessons);
        setSelectedLesson(fakeLessons[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjectWithLanguages('English');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectId]);

  const markLessonComplete = async (lessonIdToMark) => {
    setLessons((prev) =>
      prev.map((l) => (l.id === lessonIdToMark ? { ...l, is_completed: 1, watch_percent: 100 } : l))
    );

    try {
      await apiClient.put('/api/progress/lesson', {
        lessonId: lessonIdToMark,
        subjectId,
        isCompleted: 1,
        watchPercent: 100,
      });
    } catch (error) {
      console.warn('Could not save progress to backend. You might not be logged in.', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 color="#4f46e5" size={48} className="animate-spin" />
      </div>
    );
  }

  if (!subject) {
    return <div className="text-center mt-10">Course not found</div>;
  }

  return (
    <div className="space-y-8">
      <Link
        to="/subjects"
        className="flex items-center gap-2 text-slate-500 no-underline font-medium hover:text-slate-700"
      >
        <ArrowLeft size={20} /> Back to Courses
      </Link>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold uppercase tracking-wide">
              {subject.category}
            </span>
            <h1 className="text-4xl font-bold text-slate-900 mt-4">{subject.title}</h1>
            {!!subject.description && <p className="text-slate-500 text-lg mt-2">{subject.description}</p>}

            <div className="mt-4 text-slate-700 flex flex-wrap gap-x-6 gap-y-2">
              <span>
                <strong>Instructor:</strong> {subject.instructor_name || 'Expert Instructor'}
              </span>
              <span>
                <strong>Level:</strong> {subject.level || 'All Levels'}
              </span>
              <span>
                <strong>Fee:</strong> {subject.price != null ? `$${Number(subject.price).toLocaleString()}` : 'Free'}
              </span>
            </div>
          </div>

          {availableLanguages.length > 0 && (
            <div className="min-w-[220px]">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Course language</label>
              <select
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm"
                value={currentLanguage}
                onChange={(e) => fetchSubjectWithLanguages(e.target.value)}
              >
                {availableLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-8 items-start">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
          <div className="w-full aspect-video bg-black flex items-center justify-center">
            {selectedLesson ? (
              <iframe
                width="100%"
                height="100%"
                src={iframeSrc}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <span className="text-white">No lesson selected</span>
            )}
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-900">{selectedLesson?.title || 'Lesson Video'}</h2>
            <p className="text-slate-500 mt-2">
              Watch the video above to continue your learning journey. Your progress syncs when you’re logged in.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 max-h-[800px] overflow-y-auto">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Course Content</h3>

          <div className="flex flex-col gap-4">
            {lessons.map((lesson, idx) => {
              const isSelected = selectedLesson?.id === lesson.id;
              const isCompleted = Boolean(lesson.is_completed);
              const watchPercent = clampPercent(Number(lesson.watch_percent ?? (isCompleted ? 100 : 0)));

              return (
                <div
                  key={lesson.id}
                  className={`p-4 rounded-xl cursor-pointer border transition-all ${
                    isSelected ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                  onClick={() => setSelectedLesson(lesson)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {isCompleted ? (
                        <CheckCircle size={20} color="#10b981" />
                      ) : (
                        <PlayCircle size={20} color={isSelected ? '#4f46e5' : '#94a3b8'} />
                      )}
                      <span className="font-semibold text-slate-900 truncate">
                        {idx + 1}. {lesson.title}
                      </span>
                    </div>
                    <span className="text-slate-500 text-sm whitespace-nowrap">{lesson.duration_minutes ?? lesson.duration}</span>
                  </div>

                  <div className="mt-3 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isCompleted ? 'bg-emerald-500' : isSelected ? 'bg-indigo-500' : 'bg-indigo-300'
                      }`}
                      style={{ width: `${watchPercent}%` }}
                    />
                  </div>

                  {!isCompleted && isSelected && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markLessonComplete(lesson.id);
                      }}
                      className="mt-3 inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-3 py-2 transition"
                    >
                      Mark as Done
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectDetail;
