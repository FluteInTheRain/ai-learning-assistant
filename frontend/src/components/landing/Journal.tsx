import type { Post } from '../../content/types'
import './Journal.css'

interface JournalProps {
  kicker: string
  title: string
  body: string
  posts: Post[]
}

export function Journal({ kicker, title, body, posts }: JournalProps) {
  return (
    <section id="journal" className="section">
      <div className="journal-head" data-reveal>
        <div>
          <div className="section-kicker">{kicker}</div>
          <h2 className="section-title">{title}</h2>
        </div>
        <p className="section-lede">{body}</p>
      </div>
      <div className="journal-list">
        {posts.map((post) => (
          <a href="#journal" className="journal-post" key={post.title} data-reveal>
            <span className="journal-post__date">{post.date}</span>
            <div>
              <div className="journal-post__title">{post.title}</div>
              <div className="journal-post__body">{post.body}</div>
            </div>
            <span className="journal-post__tag">{post.tag}</span>
          </a>
        ))}
      </div>
    </section>
  )
}
