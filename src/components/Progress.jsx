import { STEPS } from '../lib/tables'

export default function Progress({ stepIndex, slots, onStep, onView, view }) {
  return (
    <nav className="prog" aria-label="进度">
      {STEPS.map((s, i) => {
        const done = s.slots.length && s.slots.every(sl => slots[s.n + '.' + sl.k]?.cur)
        const any = s.slots.some(sl => slots[s.n + '.' + sl.k]?.cur)
        const cls = i === stepIndex && view !== 'summary' ? 'cur'
          : (done || any || (!s.slots.length && i < stepIndex)) ? 'done' : ''
        return (
          <button className={'pip ' + cls} key={i} title={`第 ${s.n} 栏 · ${s.q}`} onClick={() => onStep(i)}>
            <span className="dot" /><span className="pn">{s.n}</span>
          </button>
        )
      })}
      <button className={'pip ' + (view === 'summary' ? 'cur' : '')} title="总表" onClick={() => onView('summary')}>
        <span className="dot" /><span className="pn">账单</span>
      </button>
    </nav>
  )
}
