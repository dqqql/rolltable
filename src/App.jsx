import { useReducer, useCallback } from 'react'
import { STEPS, roll, rerollNicknameWord, manualNicknameWord } from './lib/tables'
import Home from './components/Home'
import Lookup from './components/Lookup'
import Flow from './components/Flow'
import Summary from './components/Summary'
import { APP_COPY, TABLES_COPY } from './content/copy'

const initial = { view: 'home', step: 0, slots: {}, lookup: null }
const id = (n, k) => n + '.' + k

function reducer(s, a) {
  switch (a.type) {
    case 'view': return { ...s, view: a.view, lookup: null }
    case 'step': return { ...s, step: a.step, view: 'flow' }
    case 'lookup': return { ...s, lookup: a.key }
    case 'closeLookup': return { ...s, lookup: null }
    case 'draw': {
      const k = id(a.stepN, a.slot.k)
      const prev = s.slots[k] || { hist: [] }
      const cur = { ...a.res, _t: a.ts }
      const hist = [{ num: a.res.sealNum ?? a.res.num, plain: a.res.plain, source: 'draw', ts: a.ts, ...(a.res.segments ? { segments: a.res.segments } : {}) }, ...prev.hist]
      return { ...s, slots: { ...s.slots, [k]: { cur, hist } } }
    }
    case 'manual': {
      const k = id(a.stepN, a.slot.k)
      const prev = s.slots[k] || { hist: [] }
      const cur = { source: 'manual', num: TABLES_COPY.result.manualNum, plain: a.text, _t: a.ts }
      const hist = [{ num: TABLES_COPY.result.manualNum, plain: a.text, source: 'manual', ts: a.ts }, ...prev.hist]
      return { ...s, slots: { ...s.slots, [k]: { cur, hist } } }
    }
    case 'readopt': {
      const k = id(a.stepN, a.slot.k)
      const prev = s.slots[k]; if (!prev) return s
      return { ...s, slots: { ...s.slots, [k]: { ...prev, cur: a.res } } }
    }
    case 'rerollWord': {
      const k = id(a.stepN, a.slot.k)
      const prev = s.slots[k] || { hist: [] }
      if (a.slot.kind !== 'nickname') return s
      const cur = { ...rerollNicknameWord(prev.cur, a.wordIndex), _t: a.ts, _wordIndex: a.wordIndex }
      const hist = [{ num: cur.sealNum ?? cur.num, plain: cur.plain, source: 'draw', ts: a.ts, segments: cur.segments }, ...prev.hist]
      return { ...s, slots: { ...s.slots, [k]: { cur, hist } } }
    }
    case 'manualWord': {
      const k = id(a.stepN, a.slot.k)
      const prev = s.slots[k] || { hist: [] }
      if (a.slot.kind !== 'nickname') return s
      const cur = { ...manualNicknameWord(prev.cur, a.wordIndex, a.text), _t: a.ts, _wordIndex: a.wordIndex }
      const hist = [{ num: cur.sealNum ?? cur.num, plain: cur.plain, source: 'draw', ts: a.ts, segments: cur.segments }, ...prev.hist]
      return { ...s, slots: { ...s.slots, [k]: { cur, hist } } }
    }
    case 'setSlots':
      return { ...s, slots: a.slots, ...(a.view ? { view: a.view } : {}) }
    default: return s
  }
}

function rollEverything(ts) {
  const slots = {}
  STEPS.forEach(step => step.slots.forEach(sl => {
    const res = { ...roll(sl), _t: ts }
    slots[id(step.n, sl.k)] = {
      cur: res,
      hist: [{ num: res.sealNum ?? res.num, plain: res.plain, source: 'draw', ts, ...(res.segments ? { segments: res.segments } : {}) }],
    }
  }))
  return slots
}

export default function App() {
  const [state, raw] = useReducer(reducer, initial)

  // 包一层：把「全部随机 / 全部重抽」的随机计算放到 dispatch 之外，避开 StrictMode 双调用
  const dispatch = useCallback(a => {
    if (a.type === 'rollAll') return raw({ type: 'setSlots', slots: rollEverything(Date.now()), view: 'summary' })
    if (a.type === 'rollAllStay') return raw({ type: 'setSlots', slots: rollEverything(Date.now()) })
    raw(a)
  }, [])

  const onGo = k => {
    if (k === 'lookup') dispatch({ type: 'view', view: 'lookup' })
    else if (k === 'flow') dispatch({ type: 'step', step: 0 })
    else if (k === 'random') dispatch({ type: 'rollAll' })
  }
  const onView = view => dispatch({ type: 'view', view })
  const onStep = step => dispatch({ type: 'step', step })

  const folio = {
    home: APP_COPY.folio.home,
    lookup: APP_COPY.folio.lookup,
    flow: APP_COPY.folio.flow(STEPS[state.step], STEPS.length),
    summary: APP_COPY.folio.summary,
  }[state.view]

  return (
    <div className="book"><div className="book-inner"><div className="page">
      <header className="mast">
        <div>
          <div className="brand">{APP_COPY.brand}</div>
          <h1 className="title" onClick={() => onView('home')} role="button" tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onView('home')} style={{ cursor: 'pointer' }}>{APP_COPY.title}</h1>
          <div className="sub">{APP_COPY.subtitle}</div>
        </div>
        <div className="folio">
          {state.view !== 'home' && <button className="lnk" onClick={() => onView('home')}>{APP_COPY.backHome}</button>}
          <div>{folio}</div>
        </div>
      </header>

      {state.view === 'home' && <Home onGo={onGo} />}
      {state.view === 'lookup' &&
        <Lookup open={state.lookup}
          onOpen={key => dispatch({ type: 'lookup', key })}
          onClose={() => dispatch({ type: 'closeLookup' })} />}
      {state.view === 'flow' &&
        <Flow stepIndex={state.step} slots={state.slots} dispatch={dispatch} onView={onView} onStep={onStep} />}
      {state.view === 'summary' &&
        <Summary slots={state.slots} dispatch={dispatch} onView={onView} onStep={onStep} />}
    </div></div></div>
  )
}
