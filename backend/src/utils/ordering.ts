import pool from '../config/database';

export interface VideoSequence {
  videoId: number;
  orderIndex: number;
  sectionOrder: number;
}

export async function getVideoSequence(subjectId: number): Promise<VideoSequence[]> {
  const [rows] = await pool.execute(
    `SELECT 
      v.id as videoId,
      v.order_index as orderIndex,
      s.order_index as sectionOrder
    FROM videos v
    JOIN sections s ON v.section_id = s.id
    WHERE s.subject_id = ?
    ORDER BY s.order_index ASC, v.order_index ASC`,
    [subjectId]
  );
  
  return rows as VideoSequence[];
}

export async function getPreviousVideoId(
  subjectId: number, 
  currentVideoId: number
): Promise<number | null> {
  const sequence = await getVideoSequence(subjectId);
  const currentIndex = sequence.findIndex(v => v.videoId === currentVideoId);
  
  if (currentIndex > 0) {
    return sequence[currentIndex - 1].videoId;
  }
  
  return null;
}

export async function getNextVideoId(
  subjectId: number, 
  currentVideoId: number
): Promise<number | null> {
  const sequence = await getVideoSequence(subjectId);
  const currentIndex = sequence.findIndex(v => v.videoId === currentVideoId);
  
  if (currentIndex < sequence.length - 1) {
    return sequence[currentIndex + 1].videoId;
  }
  
  return null;
}

export async function isVideoUnlocked(
  userId: number,
  subjectId: number,
  videoId: number
): Promise<boolean> {
  const previousVideoId = await getPreviousVideoId(subjectId, videoId);
  
  if (!previousVideoId) {
    return true;
  }
  
  const [rows] = await pool.execute(
    `SELECT is_completed FROM video_progress 
     WHERE user_id = ? AND video_id = ?`,
    [userId, previousVideoId]
  );
  
  const progress = (rows as any[])[0];
  return progress?.is_completed === true;
}