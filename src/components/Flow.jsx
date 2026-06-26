import { useEffect, useState } from 'react'
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
  const rerollWord = (slot, wordIndex) => dispatch({ type: 'rerollWord', stepN: step.n, slot, wordIndex, ts: Date.now() })
  const manualWord = (slot, wordIndex, text) => {
    text = text.trim()
    if (text) dispatch({ type: 'manualWord', stepN: step.n, slot, wordIndex, text, ts: Date.now() })
  }
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
            ? step.slots.map(slot => (
                slot.kind === 'nickname'
                  ? <NicknameSlotCard key={slot.k} slot={slot} state={get(slot)}
                      onRerollWord={wordIndex => rerollWord(slot, wordIndex)}
                      onManualWord={(wordIndex, text) => manualWord(slot, wordIndex, text)} />
                  : <SlotCard key={slot.k} slot={slot} state={get(slot)}
                      onDraw={() => draw(slot)}
                      onManual={t => manual(slot, t)} />
              ))
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

function SlotCard({ slot, state, onDraw, onManual, onRerollWord }) {
  const [manualOpen, setManualOpen] = useState(false)
  const [text, setText] = useState(state.cur?.source === 'manual' ? state.cur.plain : '')
  const cur = state.cur
  const fresh = cur && cur._t && Date.now() - cur._t < 1200
  useEffect(() => { setText(state.cur?.source === 'manual' ? state.cur.plain : '') }, [state.cur?.plain, state.cur?.source])

  return (
    <div className="slot">
      <div className="slot-head"><span className="lab">{slot.lab}</span><span className="die-tag">{slot.die}</span></div>
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

function NicknameSlotCard({ slot, state, onRerollWord, onManualWord }) {
  const cur = state.cur
  const words = cur?.words || ['', '', '']

  return (
    <div className="nickname-stack">
      {[0, 1, 2].map(i => (
        <NicknameWordCard key={i}
          index={i}
          label={FLOW_COPY.slot.nicknamePart(i + 1)}
          word={words[i]}
          num={cur?.segmentNums?.[i]}
          source={cur?.segmentSources?.[i]}
          fresh={cur?._wordIndex === i && cur?._t && Date.now() - cur._t < 1200}
          onDraw={() => onRerollWord(i)}
          onManual={text => onManualWord(i, text)} />
      ))}
      <div className="nickname-preview">
        <div className="nickname-preview-label">{slot.lab}</div>
        {cur?.name
          ? <>
              <div className="rttl">「{cur.name}」</div>
              <div className="rextra">{FLOW_COPY.result.wordsOnlyHint}</div>
            </>
          : <div className="placeholder">{FLOW_COPY.slot.nicknamePreviewEmpty}</div>}
      </div>
    </div>
  )
}

function NicknameWordCard({ index, label, word, num, source, fresh, onDraw, onManual }) {
  const [manualOpen, setManualOpen] = useState(false)
  const [text, setText] = useState(source === 'manual' ? word : '')
  useEffect(() => { setText(source === 'manual' ? word : '') }, [source, word])

  return (
    <div className="slot">
      <div className="slot-head"><span className="lab">{label}</span><span className="die-tag">d100</span></div>
      <div className={'stage' + (word ? '' : ' empty')}>
        <Seal key={fresh ? `word-${index}-${num}` : `word-${index}-${num ?? 'empty'}`}
          res={num ? { num } : null} size={108} empty={!num} emptyLabel={FLOW_COPY.slot.emptySeal} stamp={fresh} />
        <div className="result">
          {word ? <div className="rttl">{word}</div> : <div className="placeholder">{FLOW_COPY.slot.nicknameWordEmpty(index + 1)}</div>}
        </div>
      </div>
      <div className="controls">
        <button className="btn cast" onClick={onDraw}>{word ? FLOW_COPY.slot.redraw : FLOW_COPY.slot.draw('d100')}</button>
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
