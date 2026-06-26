import Seal from './Seal'

const CARDS = [
  { k: 'lookup', ord: '一', t: '表格速查', s: '11 张表，逐张翻开', go: '翻阅' },
  { k: 'flow',   ord: '二', t: '标准流程', s: '一步一页，照着书掷骰', go: '开局' },
  { k: 'random', ord: '三', t: '全部随机', s: '一口气掷完，直接看账单', go: '全掷' },
]

export default function Home({ onGo }) {
  return (
    <section className="home-lead-wrap">
      <div className="home-lead">
        <div className="home-copy">
          <h2>今晚的酒钱，记在友谊头上。</h2>
          <p>这不是你们第一次见面。开团之前，用骰子把一段共同的过往翻出来——你们怎么认识、藏过什么、欠过谁、上次分别时说了什么。</p>
          <p>每掷一次骰，就往这本账册上啪地砸下一枚封蜡骰印，把回忆当债务，一条条记下来。</p>
          <div className="by">—— 翻开账册，开始赊账</div>
        </div>
        <div className="hero-seal">
          <div className="halo" />
          <Seal res={{ num: 'd10', die: '骰 · 印' }} size={200} />
        </div>
      </div>
      <nav className="entries">
        {CARDS.map(c => (
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
