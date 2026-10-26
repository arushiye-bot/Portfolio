import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CHECKPOINTS } from '../content.js';
import { sfx } from '../music.js';

function Fact({ c, onDone }) {
  return (<><p className="big">{c.text}</p><button className="btn" onClick={() => onDone(50)}>Collect +50 ✨</button></>);
}

function Quiz({ c, onDone }) {
  const [pick, setPick] = useState(null);
  const right = pick === c.answer;
  return (
    <>
      <p className="big">{c.question}</p>
      <div className="opts">
        {c.options.map((o, i) => (
          <button key={o} disabled={pick !== null} className={'opt' + (pick !== null ? (i === c.answer ? ' good' : i === pick ? ' bad' : '') : '')}
            onClick={() => { setPick(i); sfx(i === c.answer ? 'coin' : 'hurt'); }}>{o}</button>
        ))}
      </div>
      {pick !== null && (<><p className="note">{right ? '✅ Nice! ' : '❌ Not quite. '}{c.explain}</p>
        <button className="btn" onClick={() => onDone(right ? 100 : 20)}>Continue (+{right ? 100 : 20})</button></>)}
    </>
  );
}

const LABELS = ['clean_orders', 'valid_user', 'gold_row', 'ok_event', 'verified_id', 'good_batch'];
const BAD = ['null_id', 'schema_err', 'dup_row', 'low_conf', 'bad_date'];

function Catch({ c, onDone }) {
  const [phase, setPhase] = useState('ready');       // ready | run | over
  const [items, setItems] = useState([]);
  const [caught, setCaught] = useState(0);
  const [left, setLeft] = useState(12);
  const id = useRef(0);
  useEffect(() => {
    if (phase !== 'run') return;
    const spawn = setInterval(() => {
      const bad = Math.random() < 0.35;
      setItems((a) => [...a, { id: id.current++, bad, x: 6 + Math.random() * 76, label: (bad ? BAD : LABELS)[Math.floor(Math.random() * (bad ? BAD : LABELS).length)] }]);
    }, 520);
    const tick = setInterval(() => setLeft((s) => { if (s <= 1) { setPhase('over'); return 0; } return s - 1; }), 1000);
    return () => { clearInterval(spawn); clearInterval(tick); };
  }, [phase]);
  const hit = (it) => { setItems((a) => a.filter((x) => x.id !== it.id)); if (it.bad) { setCaught((n) => Math.max(0, n - 1)); sfx('hurt'); } else { setCaught((n) => n + 1); sfx('coin'); } };
  const drop = (it) => setItems((a) => a.filter((x) => x.id !== it.id));
  const pts = Math.min(150, caught * 10);
  return (
    <>
      <p className="note">{c.text}</p>
      {phase === 'ready' && <button className="btn" onClick={() => setPhase('run')}>Start (12 s)</button>}
      {phase !== 'ready' && (
        <>
          <div className="hudrow"><span>Time {left}s</span><span>Clean: {caught}</span></div>
          <div className="arena">
            {phase === 'run' && items.map((it) => (
              <button key={it.id} className={'rec ' + (it.bad ? 'badrec' : 'goodrec')} style={{ left: it.x + '%' }}
                onPointerDown={(e) => { e.preventDefault(); hit(it); }} onAnimationEnd={() => drop(it)}>{it.bad ? '✗ ' : '✓ '}{it.label}</button>
            ))}
            {phase === 'over' && <div className="over">Done! {caught} clean records passed the gate.</div>}
          </div>
        </>
      )}
      {phase === 'over' && <button className="btn" onClick={() => onDone(pts)}>Collect +{pts}</button>}
    </>
  );
}

export default function Checkpoint({ index, onDone }) {
  const c = CHECKPOINTS[index];
  const Body = { fact: Fact, quiz: Quiz, catch: Catch }[c.type];
  return (
    <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="box cp" initial={{ scale: .6, y: 60, rotate: -3 }} animate={{ scale: 1, y: 0, rotate: 0 }} exit={{ scale: .8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
        <div className="cpbadge">Checkpoint {index + 1}</div>
        <h2><span className="emo">{c.emoji}</span> {c.title}</h2>
        <Body c={c} onDone={onDone} />
        <button className="skip-link" onClick={() => onDone(0)}>skip</button>
      </motion.div>
    </motion.div>
  );
}
