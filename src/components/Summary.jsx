import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { STEPS, SECTIONS, valText } from '../lib/tables'
import Progress from './Progress'

export default function Summary({ slots, dispatch, onView, onStep }) {
  const billRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState('')

  const get = (n, k) => slots[n + '.' + k]?.cur || null
  const filled = STEPS.some(s => s.slots.some(sl => get(s.n, sl.k)))
  const teamName = get(7, 'name')?.name || ''

  const flash = m => { setToast(m); setTimeout(() => setToast(''), 2600) }

  async function exportImage() {
    if (!billRef.current) return
    setBusy(true)
    try {
      const c = await html2canvas(billRef.current, {
        backgroundColor: '#d8d5bd',
        scale: Math.min(2, (window.devicePixelRatio || 1) * 1.5),
        useCORS: true,
      })
      const a = document.createElement('a')
      a.download = '你是我的好朋友-友谊账单.png'
      a.href = c.toDataURL('image/png')
      a.click()
      flash('账单已导出 ✓')
    } catch (e) {
      flash('导出失败，请重试')
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

  return (
    <>
      <Progress stepIndex={0} slots={slots} onStep={onStep} onView={onView} view="summary" />
      <div className="sum-actions">
        <button className="btn cast" onClick={exportImage} disabled={busy}>{busy ? '正在出票…' : '⤓ 导出为图片'}</button>
        <button className="btn ghost" onClick={() => onStep(0)}>← 回到流程逐栏修改</button>
        <button className="btn ghost" onClick={() => dispatch({ type: 'rollAllStay', ts: Date.now() })}>↻ 全部重抽</button>
        <button className="btn ghost" onClick={() => onView('home')}>回封面</button>
      </div>

      <div className="bill" ref={billRef}>
        <div className="bill-head">
          <div className="k">YOU ARE MY GOOD FRIEND · THE TAB</div>
          <h2>友谊赊账单</h2>
          <div className="cons">{teamName ? `「${teamName}」一伙的共同往事` : '一伙人的共同往事'}</div>
        </div>

        {filled
          ? <div className="bill-grid">
              {rows.map(r => r.kind === 'sec'
                ? <div className="bill-sec" key={r.key}>{r.name}</div>
                : <div className="qa2" key={r.key}>
                    <div className="qa2-l"><span className="qn">{r.step.n}</span><span className="ql">{r.sl.lab}<small>{r.sl.die}</small></span></div>
                    {r.cur
                      ? <div className="qv"><span className="pin">{r.cur.num}</span>{valText(r.cur)}{r.cur.source === 'manual' && <span className="hand"> · 手填</span>}</div>
                      : <div className="qv empty">（未抽取）</div>}
                  </div>)}
            </div>
          : <div className="bill-empty">账上还是空的——先去掷几把骰。</div>}

        <div className="bill-foot">这不是永别 · 你是我的好朋友</div>
      </div>

      {toast && <div className="toast show">{toast}</div>}
    </>
  )
}
