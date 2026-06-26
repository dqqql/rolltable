import { useState } from 'react'
import { STEPS, SECTIONS, roll, readopt, diePrompt, trim } from '../lib/tables'
import { APP_COPY, FLOW_COPY, TABLES_COPY } from '../content/copy'
import Seal from './Seal'
import Progress from './Progress'

export default function Flow({ stepIndex, slots, dispatch, onView, onStep }) {
  const step = STEPS[stepIndex]
  const sec = SECTIONS[step.sec]
  const firstOfSec = stepIndex === 0 || STEPS[stepIndex - 1].sec !== step.sec
  const guide = (sec.steps.find(s => s.n === step.n) || {}).text || ''

  const get = slot => slots[step.n + '.' + slot.k] || { cur: null, hist: [] }

  const draw = slot => dispatch({ type: 'draw', stepN: step.n, slot, res: roll(slot), ts: Date.now() })
  const manual = (slot, text) => { text = text.trim(); if (text) dispatch({ type: 'manual', stepN: step.n, slot, text, ts: Date.now() }) }

  // 赊账栏：本页所有槽位的历史骰印，最新在上
  const histRows = []
  step.slots.forEach(slot => get(slot).hist.forEach(h => histRows.push({ slot, h })))
  histRows.sort((a, b) => b.h.ts - a.h.ts)

  return (
    <>
      <Progress stepIndex={stepIndex} slots={slots} onStep={onStep} onView={onView} />
      <div className="flow-grid">
        <aside className="tab-col">
          <h4>{FLOW_COPY.history.title}</h4>
          <div className="meta">{FLOW_COPY.history.meta}</div>
          <div className="tab-list">
            {histRows.length === 0
              ? <div className="tab-empty">{FLOW_COPY.history.emptyTop}<br />{FLOW_COPY.history.emptyBottom}</div>
              : histRows.map((r, i) => {
                  const cur = get(r.slot).cur
                  const used = cur && cur.plain === r.h.plain
                  return (
                    <button className={'tab-item' + (used ? ' used' : '')} key={i}
                      title={FLOW_COPY.history.reuseTitle}
                      onClick={() => {
                        const res = r.h.source === 'manual'
                          ? { source: 'manual', num: TABLES_COPY.result.manualNum, plain: r.h.plain }
                          : readopt(r.slot, r.h)
                        dispatch({ type: 'readopt', stepN: step.n, slot: r.slot, res: { ...res, _t: Date.now() } })
                      }}>
                      <Seal mini size={40} res={r.h.source === 'manual' ? null : { num: r.h.num }} empty={r.h.source === 'manual'} emptyLabel={r.h.num} />
                      <span className="tx"><b>{r.slot.lab}</b><br />{trim(r.h.plain, 42)}</span>
                    </button>
                  )
                })}
          </div>
        </aside>

        <main>
          <span className="sec-badge">{sec.name}</span>
          <h2 className="step-q">{step.q}</h2>
          {firstOfSec && sec.intro &&
            <div className="intro">{sec.intro.split('\n').map((p, i) => <p key={i}>{p}</p>)}</div>}
          {guide &&
            <p className="guide"><span className="src">{FLOW_COPY.guideLabel(step.n)}</span>{guide}</p>}

          {step.slots.length
            ? step.slots.map(slot => <SlotCard key={slot.k} slot={slot} state={get(slot)} onDraw={() => draw(slot)} onManual={t => manual(slot, t)} />)
            : <div className="slot"><div className="stage blank"><div className="placeholder">{FLOW_COPY.blankStep}</div></div></div>}

          <div className="flow-nav">
            <button className="btn ghost" onClick={() => stepIndex === 0 ? onView('home') : onStep(stepIndex - 1)}>
              {stepIndex === 0 ? APP_COPY.backHome : FLOW_COPY.nav.prev}
            </button>
            <button className="btn cast" onClick={() => stepIndex === STEPS.length - 1 ? onView('summary') : onStep(stepIndex + 1)}>
              {stepIndex === STEPS.length - 1 ? FLOW_COPY.nav.summary : FLOW_COPY.nav.next}
            </button>
          </div>
        </main>
      </div>
    </>
  )
}

function SlotCard({ slot, state, onDraw, onManual }) {
  const [manualOpen, setManualOpen] = useState(false)
  const [text, setText] = useState(state.cur?.source === 'manual' ? state.cur.plain : '')
  const cur = state.cur
  const fresh = cur && cur._t && Date.now() - cur._t < 1200

  return (
    <div className="slot">
      <div className="slot-head"><span className="lab">{slot.lab}</span><span>{slot.die}</span></div>
      <div className={'stage' + (cur ? '' : ' empty')}>
        <Seal key={cur ? cur._t : 'empty'} res={cur} size={108} empty={!cur} emptyLabel={FLOW_COPY.slot.emptySeal} stamp={fresh} />
        <div className="result">
          {cur ? <ResultBody cur={cur} /> : <div className="placeholder">{diePrompt(slot)}</div>}
        </div>
      </div>
      <div className="controls">
        <button className="btn cast" onClick={onDraw}>{cur ? FLOW_COPY.slot.redraw : FLOW_COPY.slot.draw(slot.die)}</button>
        <button className="btn ghost" onClick={() => setManualOpen(o => !o)}>{FLOW_COPY.slot.manualToggle}</button>
        {manualOpen &&
          <div className="manual">
            <input autoFocus value={text} placeholder={FLOW_COPY.slot.manualPlaceholder}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { onManual(text); setManualOpen(false) } }} />
            <button className="btn" onClick={() => { onManual(text); setManualOpen(false) }}>{FLOW_COPY.slot.manualSubmit}</button>
          </div>}
      </div>
    </div>
  )
}

function ResultBody({ cur }) {
  if (cur.source === 'manual')
    return <><div className="rttl">{cur.plain}</div><div className="rextra"><span className="hand">{FLOW_COPY.result.manualTag}</span></div></>
  if (cur.wordsOnly)
    return <>
      <div className="nick">{cur.words.map((w, i) => <span key={i}>{w}</span>)}</div>
      <div className="rttl">「{cur.name}」</div>
      <div className="rextra">{FLOW_COPY.result.wordsOnlyHint}</div>
    </>
  return <>
    {cur.group && <div className="group">{cur.group}</div>}
    {cur.title && <div className="rttl">{cur.title}</div>}
    <div className="rbody">{cur.body}</div>
  </>
}
