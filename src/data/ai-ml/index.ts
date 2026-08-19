import { aiCourses } from './roadmap';
import { aiLessons, type AiLesson } from './lessons';

export type { AiLesson };
export { aiCourses, aiLessons };
export { aiLessonCount } from './roadmap';

export function getAiCourse(slug: string) {
  return aiCourses.find((c) => c.slug === slug);
}

export function getAiLesson(slug: string) {
  return aiLessons.find((l) => l.slug === slug);
}

export function aiLessonsForCourse(courseSlug: string) {
  return aiLessons.filter((l) => l.courseSlug === courseSlug);
}

export function getAiSelection(slug: string | null) {
  if (!slug) return { kind: 'intro' as const };
  const course = getAiCourse(slug);
  if (course) return { kind: 'course' as const, course };
  const lesson = getAiLesson(slug);
  if (lesson) return { kind: 'lesson' as const, lesson, course: getAiCourse(lesson.courseSlug) };
  return { kind: 'intro' as const };
}
