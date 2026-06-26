import { DATA } from '../lib/tables'
import { TABLE_VIEW_COPY } from '../content/copy'

// 单张随机表的排版（速查窗口与流程内复用）
export default function TableView({ t, kind, label }) {
  const arr = DATA[t]
  return (
    <div className="tv">
      {label ? <div className="tv-sub">{label}</div> : null}
      {kind === 'nickname' ? <NickRows arr={arr} />
        : kind === 'place' ? <PlaceRows arr={arr} />
        : <SimpleRows arr={arr} kind={kind} />}
    </div>
  )
}

function NickRows({ arr }) {
  return (
    <div className="nick-tbl">
      <div className="h pt">{TABLE_VIEW_COPY.nicknameHeaders[0]}</div>
      <div className="h">{TABLE_VIEW_COPY.nicknameHeaders[1]}</div>
      <div className="h">{TABLE_VIEW_COPY.nicknameHeaders[2]}</div>
      <div className="h">{TABLE_VIEW_COPY.nicknameHeaders[3]}</div>
      {arr.map((r, i) => (
        <Fragment3 key={i} i={i + 1} a={r.a} b={r.b} c={r.c} />
      ))}
    </div>
  )
}
function Fragment3({ i, a, b, c }) {
  return (<>
    <div className="c pt">{i}</div><div className="c">{a}</div><div className="c">{b}</div><div className="c">{c}</div>
  </>)
}

function PlaceRows({ arr }) {
  let cur = ''
  const out = []
  arr.forEach(e => {
    if (e.group !== cur) { out.push(<div className="grp" key={'g' + e.n}>{e.group}</div>); cur = e.group }
    out.push(
      <div className="row" key={e.n}>
        <span className="pt">{e.n}</span>
        <span className="ct"><b>{e.title}</b>　<small>{e.text}</small></span>
      </div>
    )
  })
  return <div className="rows">{out}</div>
}

function SimpleRows({ arr, kind }) {
  return (
    <div className="rows">
      {arr.map((e, i) => {
        let pt = i + 1, body
        if (kind === 'plain') body = e
        else if (kind === 'titletext') { pt = e.n || i + 1; body = <><b>{e.title}</b>　{e.text}</> }
        else if (kind === 'occasion') body = <><b>{e.text}</b>　<small>{e.detail}</small></>
        else if (kind === 'pt') { pt = e.pt || i + 1; body = e.text }
        return (
          <div className="row" key={i}>
            <span className="pt">{pt}</span>
            <span className="ct">{body}</span>
          </div>
        )
      })}
    </div>
  )
}
