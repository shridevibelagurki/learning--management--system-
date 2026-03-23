import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Book, Loader2, Star } from 'lucide-react';
import apiClient from '../../lib/apiClient';

function clampPercent(n) {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await apiClient.get('/api/subjects');
        // backend returns: { subjects, total }
        setSubjects(response.data?.subjects || []);
      } catch (error) {
        console.error('Failed to fetch subjects', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 color="#4f46e5" size={48} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-slate-900 mb-3">Explore Courses</h1>
        <p className="text-slate-500 text-lg">
          Discover top-tier educational content designed to elevate your skills to the next level.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => {
          const watchedPercent = clampPercent(
            Number(subject.students_watch_percentage ?? subject.progress_percentage ?? 0)
          );
          const rating = Number(subject.rating ?? 4.7);
          const lessonsCount = Number(subject.total_lessons ?? 0);
          const durationHours = Number(subject.duration_hours ?? 0);
          const feeNumber = subject.price == null ? null : Number(subject.price);
          const feeLabel =
            feeNumber == null || Number.isNaN(feeNumber) ? 'Free' : `$${feeNumber.toLocaleString()}`;

          return (
            <div
              key={subject.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex flex-col"
            >
              <div className="h-44 bg-slate-100">
                <img
                  className="h-full w-full object-cover"
                  src={subject.thumbnail_url || 'https://via.placeholder.com/600x300?text=Course'}
                  alt={subject.title || 'Course thumbnail'}
                  loading="lazy"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold uppercase tracking-wide">
                    {subject.category || 'Course'}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{subject.language || 'English'}</span>
                </div>

                <h3 className="mt-4 text-xl font-semibold text-slate-900">{subject.title}</h3>

                {!!subject.instructor_name && (
                  <p className="text-slate-600 text-sm mt-1">By {subject.instructor_name}</p>
                )}

                <div className="mt-3 flex items-center gap-2 text-sm text-slate-700">
                  <Star size={16} className="text-amber-500 fill-amber-400" />
                  <span className="font-semibold">{rating.toFixed(1)}</span>
                  <span className="text-slate-500">Ratings</span>
                </div>

                <div className="mt-4 bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Watched</span>
                    <span className="font-semibold text-indigo-700">{watchedPercent}%</span>
                  </div>
                  <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all"
                      style={{ width: `${watchedPercent}%` }}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Book size={14} />
                      {lessonsCount} lessons
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={14} />
                      {durationHours}h
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Fee: {feeLabel}</div>
                    <div className="text-xs text-slate-500">Includes {lessonsCount} lessons</div>
                  </div>

                  <Link
                    to={`/subjects/${subject.id}`}
                    className="inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 transition"
                  >
                    Start learning
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Subjects;
