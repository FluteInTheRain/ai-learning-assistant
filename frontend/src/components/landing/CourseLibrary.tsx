import { Link } from 'react-router-dom'
import type { Course } from '../../content/types'
import './CourseLibrary.css'

interface CourseLibraryProps {
  kicker: string
  title: string
  allLabel: string
  allTo: string
  courses: Course[]
}

export function CourseLibrary({ kicker, title, allLabel, allTo, courses }: CourseLibraryProps) {
  return (
    <section id="courses" className="section">
      <div className="courses-head" data-reveal>
        <div>
          <div className="section-kicker">{kicker}</div>
          <h2 className="section-title">{title}</h2>
        </div>
        <Link to={allTo}>{allLabel} →</Link>
      </div>
      <div className="courses-grid">
        {courses.map((course) => (
          <div className="course-card" key={course.title} data-reveal>
            <div className="course-card__image">
              <span>{course.img}</span>
            </div>
            <div className="course-card__body">
              <div className="course-card__meta-row">
                <span className="course-card__kicker">{course.kicker}</span>
                <span className="tag tag-outline">{course.level}</span>
              </div>
              <div className="course-card__title">{course.title}</div>
              <div className="course-card__desc">{course.body}</div>
              <div className="course-card__facts">
                <span>{course.lessons}</span>
                <span>{course.hours}</span>
                <span>{course.labs}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
