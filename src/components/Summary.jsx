import { useEffect, useMemo, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { STEPS, SECTIONS, valText } from '../lib/tables'
import { SUMMARY_COPY } from '../content/copy'
import Progress from './Progress'

export default function Summary({ slots, dispatch, onView, onStep }) {
  const billRef = useRef(null)
  const measureRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState('')
  const [splitIndex, setSplitIndex] = useState(null)

  const get = (n, k) => slots[n + '.' + k]?.cur || null
  const filled = STEPS.some(s => s.slots.some(sl => get(s.n, sl.k)))
  const teamName = get(7, 'name')?.name || ''

  const flash = m => { setToast(m); setTimeout(() => setToast(''), 2600) }

  async function exportImage() {
    if (!billRef.current) return
    setBusy(true)
    try {
      const source = billRef.current
      const bounds = source.getBoundingClientRect()
      const wrapper = document.createElement('div')
      wrapper.style.position = 'fixed'
      wrapper.style.left = '-10000px'
      wrapper.style.top = '0'
      wrapper.style.width = `${Math.ceil(bounds.width)}px`
      wrapper.style.pointerEvents = 'none'
      wrapper.style.opacity = '0'

      const clone = source.cloneNode(true)
      clone.style.width = '100%'
      clone.style.maxWidth = 'none'
      clone.style.margin = '0'
      wrapper.appendChild(clone)
      document.body.appendChild(wrapper)

      const c = await html2canvas(clone, {
        backgroundColor: '#d8d5bd',
        scale: Math.min(2, (window.devicePixelRatio || 1) * 1.5),
        useCORS: true,
        width: Math.ceil(bounds.width),
        height: Math.ceil(clone.scrollHeight),
        windowWidth: Math.ceil(bounds.width),
        windowHeight: Math.ceil(clone.scrollHeight),
      })
      wrapper.remove()
      const a = document.createElement('a')
      a.download = SUMMARY_COPY.export.filename
      a.href = c.toDataURL('image/png')
      a.click()
      flash(SUMMARY_COPY.export.success)
    } catch (e) {
      flash(SUMMARY_COPY.export.error)
    } finally {
      setBusy(false)
    }
  }

  // 双栏：分章标题横跨整行，问答条目在两列中流动
  const rows = []
  let lastSec = -1
  STEPS.forEach(step => {
    if (step.sec !== lastSec) { rows.push({ kind: 'sec', name: SECTIONS[step.sec].name, key: 's' + step.sec }); lastSec = step.sec }
    step.slots.forEach(sl => {
      const cur = get(step.n, sl.k)
      rows.push({ kind: 'qa', step, sl, cur, key: step.n + '.' + sl.k })
    })
  })

  useEffect(() => {
    const bill = billRef.current
    const measure = measureRef.current
    if (!bill || !measure || !filled) {
      setSplitIndex(null)
      return
    }

    const recalc = () => {
      if (window.innerWidth <= 760) {
        setSplitIndex(rows.length)
        return
      }

      const gap = 32
      const colWidth = Math.max(260, Math.floor((bill.clientWidth - gap) / 2))
      measure.style.width = `${colWidth}px`

      requestAnimationFrame(() => {
        const items = Array.from(measure.children)
        if (!items.length) {
          setSplitIndex(rows.length)
          return
        }

        const heights = items.map(item => item.getBoundingClientRect().height)
        const total = heights.reduce((sum, height) => sum + height, 0)
        const half = total / 2
        let acc = 0
        let nextIndex = rows.length

        for (let i = 0; i < heights.length; i++) {
          acc += heights[i]
          if (acc >= half) {
            nextIndex = i + 1
            break
          }
        }

        while (nextIndex < rows.length && rows[nextIndex - 1]?.kind === 'sec') nextIndex -= 1
        while (nextIndex < rows.length && rows[nextIndex]?.kind === 'qa' && rows[nextIndex - 1]?.kind === 'qa' && rows[nextIndex].step.sec === rows[nextIndex - 1].step.sec) {
          break
        }
        while (nextIndex > 0 && rows[nextIndex - 1]?.kind === 'qa' && rows[nextIndex]?.kind === 'qa' && rows[nextIndex].step.sec === rows[nextIndex - 1].step.sec && acc - heights[nextIndex - 1] > half) {
          acc -= heights[nextIndex - 1]
          nextIndex -= 1
        }

        setSplitIndex(Math.max(1, Math.min(nextIndex, rows.length)))
      })
    }

    recalc()
    window.addEventListener('resize', recalc)
    return () => window.removeEventListener('resize', recalc)
  }, [filled, rows])

  const split = splitIndex ?? rows.length
  const leftRows = useMemo(() => rows.slice(0, split), [rows, split])
  const rightRows = useMemo(() => rows.slice(split), [rows, split])
  const twoColumn = filled && splitIndex !== null && split < rows.length && window.innerWidth > 760

  return (
    <>
      <Progress stepIndex={0} slots={slots} onStep={onStep} onView={onView} view="summary" />
      <div className="sum-actions">
        <button className="btn cast" onClick={exportImage} disabled={busy}>{busy ? SUMMARY_COPY.export.busy : SUMMARY_COPY.export.idle}</button>
        <button className="btn ghost" onClick={() => onStep(0)}>{SUMMARY_COPY.actions.revise}</button>
        <button className="btn ghost" onClick={() => dispatch({ type: 'rollAllStay', ts: Date.now() })}>{SUMMARY_COPY.actions.reroll}</button>
      </div>

      <div className="bill" ref={billRef}>
        <div className="bill-head">
          <div className="k">{SUMMARY_COPY.bill.kicker}</div>
          <h2>{SUMMARY_COPY.bill.title}</h2>
          <div className="cons">{teamName ? SUMMARY_COPY.bill.teamSummary(teamName) : SUMMARY_COPY.bill.fallbackSummary}</div>
        </div>

        {filled
          ? <div className={'bill-grid' + (twoColumn ? ' two-col' : '')}>
              <div className="bill-col">
                {leftRows.map(r => <SummaryRow key={r.key} row={r} />)}
              </div>
              {twoColumn && <div className="bill-col">
                {rightRows.map(r => <SummaryRow key={r.key} row={r} />)}
              </div>}
            </div>
          : <div className="bill-empty">{SUMMARY_COPY.bill.emptyState}</div>}

        <div className="bill-foot">{SUMMARY_COPY.bill.footer}</div>
      </div>

      <div className="bill-measure" aria-hidden="true">
        <div className="bill-col" ref={measureRef}>
          {rows.map(r => <SummaryRow key={'m-' + r.key} row={r} />)}
        </div>
      </div>

      {toast && <div className="toast show">{toast}</div>}
    </>
  )
}

function SummaryRow({ row }) {
  if (row.kind === 'sec') return <div className="bill-sec">{row.name}</div>

  return (
    <div className="qa2">
      <div className="qa2-l"><span className="qn">{row.step.n}</span><span className="ql">{row.sl.lab}<small>{row.sl.die}</small></span></div>
      {row.cur
        ? <div className="qv"><span className="pin">{row.cur.num}</span>{valText(row.cur)}{row.cur.source === 'manual' && <span className="hand">{SUMMARY_COPY.bill.manualTag}</span>}</div>
        : <div className="qv empty">{SUMMARY_COPY.bill.emptyValue}</div>}
    </div>
  )
}
