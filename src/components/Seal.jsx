import { SEAL_COPY } from '../content/copy'

// 封蜡骰印 —— 全站签名元素
export default function Seal({ res, size = 96, empty, mini, stamp, emptyLabel = SEAL_COPY.emptyLabel }) {
  const style = { '--sz': size + 'px' }
  if (empty || !res) {
    return (
      <div className={'seal empty' + (mini ? ' mini' : '')} style={style}>
        <span className="num">{emptyLabel}</span>
      </div>
    )
  }
  const n = res.sealNum !== undefined ? res.sealNum : res.num
  return (
    <div className={'seal' + (stamp ? ' stamp' : '') + (mini ? ' mini' : '')} style={style}>
      <span className="num">{n}</span>
      {res.die ? <span className="die">{res.die}</span> : null}
    </div>
  )
}
