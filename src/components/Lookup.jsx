import { useEffect } from 'react'
import { LOOKUP, DATA } from '../lib/tables'
import TableView from './TableView'

// 表格速查：卡片墙 + 点开的「跳转窗口」(modal)，不再把所有表塞进一页
export default function Lookup({ open, onOpen, onClose }) {
  const card = open ? LOOKUP.find(c => c.no === open) : null

  return (
    <section className="lk">
      <p className="lk-hint">十张随机表，点开任意一张单独查阅。</p>
      <div className="lk-cards">
        {LOOKUP.map(c => {
          const count = c.subs.reduce((s, x) => s + DATA[x.t].length, 0)
          return (
            <button className="lk-card" key={c.no} onClick={() => onOpen(c.no)}>
              <div className="lk-no">No.{c.no}</div>
              <div className="lk-name">{c.name}</div>
              <div className="lk-q">{c.q}</div>
              <div className="lk-foot"><span className="die">{c.die}</span><span className="cnt">{count} 条 →</span></div>
            </button>
          )
        })}
      </div>
      {card && <TableModal card={card} onClose={onClose} />}
    </section>
  )
}

function TableModal({ card, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={card.name} onClick={e => e.stopPropagation()}>
        <header className="modal-head">
          <div>
            <span className="no">No.{card.no}</span>
            <h3>{card.name}</h3>
            <span className="modal-q">{card.q}</span>
          </div>
          <button className="modal-x" onClick={onClose} aria-label="关闭">✕</button>
        </header>
        <div className="modal-body">
          {card.subs.map((sub, i) => (
            <TableView key={i} t={sub.t} kind={sub.kind} label={sub.label} />
          ))}
        </div>
      </div>
    </div>
  )
}
