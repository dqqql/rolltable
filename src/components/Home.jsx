import Seal from './Seal'
import { HOME_COPY } from '../content/copy'

export default function Home({ onGo }) {
  return (
    <section className="home-lead-wrap">
      <div className="home-lead">
        <div className="home-copy">
          <h2>{HOME_COPY.hero.title}</h2>
          {HOME_COPY.hero.paragraphs.map((text, index) => <p key={index}>{text}</p>)}
          <div className="by">{HOME_COPY.hero.byline}</div>
        </div>
        <div className="hero-seal">
          <div className="halo" />
          <Seal res={HOME_COPY.seal} size={200} />
        </div>
      </div>
      <nav className="entries">
        {HOME_COPY.cards.map(c => (
          <button className="entry" key={c.k} onClick={() => onGo(c.k)}>
            <span className="idx">{c.ord}</span>
            <span className="ttl">{c.t}<small>{c.s}</small></span>
            <span className="go">{c.go} →</span>
          </button>
        ))}
      </nav>
    </section>
  )
}
