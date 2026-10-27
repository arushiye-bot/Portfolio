import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CHECKPOINTS } from '../content.js';
import { sfx } from '../music.js';

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

function Match({ c, onDone }) {
  const [r, setR] = useState(0);
  const [wrong, setWrong] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const order = useRef(c.rounds.map((rd) => rd.options.map((o, i) => i).sort(() => Math.random() - .5)));
  const done = r >= c.rounds.length;
  const rd = c.rounds[Math.min(r, c.rounds.length - 1)];
  const pick = (i) => {
    if (i === rd.answer) { sfx('coin'); setWrong(null); setR((n) => n + 1); }
    else { sfx('hurt'); setWrong(i); setMistakes((n) => n + 1); }
  };
  const pts = Math.max(40, 100 - mistakes * 10);
  return (
    <>
      <p className="note">{c.text}</p>
      <div className="hudrow"><span>Round {Math.min(r + 1, c.rounds.length)} / {c.rounds.length}</span><span>{'⭐'.repeat(r)}</span></div>
      {!done ? (
        <>
          <p className="big">{rd.job}</p>
          <div className="opts">
            {order.current[r].map((i) => (
              <button key={rd.options[i]} className={'opt' + (wrong === i ? ' bad' : '')} onClick={() => pick(i)}>{rd.options[i]}</button>
            ))}
          </div>
          {wrong !== null && <p className="note">Not that one. Try another!</p>}
        </>
      ) : (
        <><p className="big">All matched! 🎉</p><button className="btn" onClick={() => onDone(pts)}>Collect +{pts}</button></>
      )}
    </>
  );
}

const AUTO_MS = 8000;

export default function Checkpoint({ index, onDone }) {
  const c = CHECKPOINTS[index];
  const [mode, setMode] = useState('highlight');           // highlight | game
  const [touched, setTouched] = useState(false);
  const doneRef = useRef(onDone); doneRef.current = onDone;
  const Game = c.game ? { quiz: Quiz, match: Match }[c.game.type] : null;

  // Auto-close after a few seconds if the visitor does nothing, so the walk never gets stuck.
  useEffect(() => {
    if (mode !== 'highlight' || touched) return undefined;
    const t = setTimeout(() => doneRef.current(0), AUTO_MS);
    return () => clearTimeout(t);
  }, [mode, touched]);

  return (
    <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="box cp" onPointerDown={() => setTouched(true)} onKeyDown={() => setTouched(true)}
        initial={{ scale: .6, y: 60, rotate: -3 }} animate={{ scale: 1, y: 0, rotate: 0 }} exit={{ scale: .8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
        <div className="cpbadge">Checkpoint {index + 1}</div>
        <h2><span className="emo">{c.emoji}</span> {c.title}</h2>
        {mode === 'highlight' ? (
          <>
            <p className="big">{c.highlight}</p>
            <div className="cpbtns">
              <button className={'btn' + (Game ? ' ghostbtn' : '')} onClick={() => onDone(0)}>{Game ? 'Skip →' : 'Continue →'}</button>
              {Game && <button className="btn" onClick={() => { setTouched(true); setMode('game'); }}>🎮 Play a 20-second challenge (+bonus)</button>}
            </div>
            {!touched && <div className="autobar"><i style={{ animationDuration: AUTO_MS + 'ms' }} /></div>}
          </>
        ) : (
          <>
            <Game c={c.game} onDone={onDone} />
            <div className="cpbtns"><button className="btn ghostbtn" onClick={() => onDone(0)}>Skip game →</button></div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
