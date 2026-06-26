import { STEPS } from '../lib/tables'
import { PROGRESS_COPY } from '../content/copy'

export default function Progress({ stepIndex, slots, onStep, onView, view }) {
  return (
    <nav className="prog" aria-label={PROGRESS_COPY.ariaLabel}>
      {STEPS.map((s, i) => {
        const done = s.slots.length && s.slots.every(sl => slots[s.n + '.' + sl.k]?.cur)
        const any = s.slots.some(sl => slots[s.n + '.' + sl.k]?.cur)
        const cls = i === stepIndex && view !== 'summary' ? 'cur'
          : (done || any || (!s.slots.length && i < stepIndex)) ? 'done' : ''
        return (
          <button className={'pip ' + cls} key={i} title={PROGRESS_COPY.stepTitle(s)} onClick={() => onStep(i)}>
            <span className="dot" /><span className="pn">{s.n}</span>
          </button>
        )
      })}
      <button className={'pip ' + (view === 'summary' ? 'cur' : '')} title={PROGRESS_COPY.summaryTitle} onClick={() => onView('summary')}>
        <span className="dot" /><span className="pn">{PROGRESS_COPY.summaryLabel}</span>
      </button>
    </nav>
  )
}
