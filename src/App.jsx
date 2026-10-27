import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SITE, SECTIONS, CHECKPOINTS } from './content.js';
import { createGame } from './game.js';
import { music } from './music.js';
import SectionBody, { Links } from './components/SectionBody.jsx';
import Checkpoint from './components/Checkpoint.jsx';

const Classic = lazy(() => import('./components/Classic.jsx'));
const getRecruiter = () => { try { return localStorage.getItem('recruiterMode') === '1'; } catch { return false; } };
const getSaved = () => { try { return localStorage.getItem('visitorName') || ''; } catch { return ''; } };

export default function App() {
  const canvasRef = useRef(null), gameRef = useRef(null), classicRef = useRef(null), doneCP = useRef(new Set());
  const saved = useRef(getSaved());
  const [stage, setStage] = useState('welcome');      // welcome | welcoming | play
  const [name, setName] = useState(saved.current);
  const [score, setScore] = useState(0);
  const [prog, setProg] = useState(0);
  const [toast, setToast] = useState(null);
  const [fact, setFact] = useState(null);
  const [card, setCard] = useState(null);
  const [cp, setCp] = useState(null);
  const [ended, setEnded] = useState(false);
  const [menu, setMenu] = useState(false);
  const [classic, setClassic] = useState(false);
  const [visited, setVisited] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [recruiter, setRecruiter] = useState(getRecruiter);
  const recruiterRef = useRef(recruiter);
  recruiterRef.current = recruiter;

  useEffect(() => {
    const game = createGame(canvasRef.current, {
      onScore: setScore, onProgress: setProg,
      toast: (msg) => setToast({ id: Math.random(), msg }),
      fact: (text) => setFact({ id: Math.random(), text }),
      openSection: (id) => setCard(id), openCheckpoint: (i) => { if (recruiterRef.current) setFact({ id: Math.random(), text: CHECKPOINTS[i].emoji + ' ' + CHECKPOINTS[i].highlight, star: true }); else setCp(i); }, onEnd: () => setEnded(true),
    });
    gameRef.current = game; window.__g = game;
    return () => game.destroy();
  }, []);

  useEffect(() => { const g = gameRef.current; if (!g) return; g.setPaused(stage !== 'play' || card !== null || cp !== null || ended || classic); g.setIdle(classic); }, [stage, card, cp, ended, classic]);
  useEffect(() => { if (!fact) return; const t = setTimeout(() => setFact(null), 6500); return () => clearTimeout(t); }, [fact]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2300); return () => clearTimeout(t); }, [toast]);
  useEffect(() => { const k = (e) => { if (e.key === 'Escape') { setCard(null); setMenu(false); } }; addEventListener('keydown', k); return () => removeEventListener('keydown', k); }, []);

  const toggleRecruiter = () => setRecruiter((r) => { const n = !r; try { localStorage.setItem('recruiterMode', n ? '1' : '0'); } catch {} return n; });
  const toggleMusic = useCallback(() => setMusicOn(music.toggle()), []);
  const openClassic = (on) => {
    if (on) { setVisited(true); if (music.on) setMusicOn(music.toggle()); }
    setClassic(on); setMenu(false);
  };
  const submit = (e) => {
    e.preventDefault();
    const n = (e.target.elements.name.value.trim() || 'friend').slice(0, 14);
    try { localStorage.setItem('visitorName', n); } catch {}
    setName(n); setStage('welcoming');
    setTimeout(() => { setStage('play'); gameRef.current.start(n); }, 1400);
  };
  const jump = (id) => {
    setMenu(false);
    if (classic) { document.getElementById('c-' + id)?.scrollIntoView({ behavior: 'smooth' }); return; }
    if (stage === 'play' && !ended) gameRef.current.teleport(id);
  };
  const doneCheckpoint = (pts) => {
    if (cp !== null && !doneCP.current.has(cp) && pts > 0) { doneCP.current.add(cp); gameRef.current.addScore(pts); setToast({ id: Math.random(), msg: `+${pts} from checkpoint ${cp + 1}` }); }
    setCp(null);
  };
  const press = (k, v) => (e) => { e.preventDefault(); gameRef.current?.setKey(k, v); };
  const section = card && SECTIONS.find((s) => s.id === card);
  const playing = stage === 'play';

  return (
    <>
      <canvas id="game" ref={canvasRef} />

      <AnimatePresence>
        {stage !== 'play' && (
          <motion.div id="welcome" key="w" exit={{ opacity: 0 }} transition={{ duration: .5 }}>
            {stage === 'welcome' ? (
              <>
                <h1>{saved.current ? `Welcome back, ${saved.current}!` : 'Hi! Thank you for viewing my portfolio'}</h1>
                <p>{saved.current ? 'Good to see you again. Press Start to play again.' : 'What’s your name?'}</p>
                <form onSubmit={submit}>
                  <input name="name" defaultValue={saved.current} maxLength={14} placeholder="Your name" autoComplete="off" autoFocus />
                  <button type="submit" className="btn">Start ▶</button>
                </form>
                <button type="button" className={'rmode' + (recruiter ? ' on' : '')} onClick={toggleRecruiter}>{recruiter ? '✔ Recruiter mode on: no games, just highlights' : '👔 Recruiter mode: skip the games'}</button>
              </>
            ) : (
              <><h1>Welcome, {name}!</h1><p>Use ← → to walk, SPACE to jump. Have fun!</p></>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {playing && (
        <>
          <div id="hud">SCORE <span>{String(score).padStart(4, '0')}</span><small>← → move · SPACE jump · bump the ? blocks</small></div>
          <div id="prog"><i style={{ width: Math.round(Math.min(1, prog) * 100) + '%' }} /></div>
        </>
      )}

      <button id="burger" className={menu ? 'open' : ''} aria-label="Menu" onClick={() => setMenu((m) => !m)}><span /><span /><span /></button>
      <AnimatePresence>
        {menu && (
          <motion.div id="menu" key="m" initial={{ opacity: 0, scale: .92, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .92, y: -10 }} transition={{ type: 'spring', stiffness: 380, damping: 26 }}>
            {SECTIONS.map((s, i) => (
              <motion.button key={s.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .04 * i }} onClick={() => jump(s.id)}><span>{s.short[0]}</span>{s.short}</motion.button>
            ))}
            <hr />
            <button onClick={toggleRecruiter}>👔 Recruiter mode: <b>{recruiter ? 'ON' : 'OFF'}</b></button>
            <button onClick={toggleMusic}>♪ Music: <b>{musicOn ? 'ON' : 'OFF'}</b></button>
            <button onClick={() => openClassic(!classic)}>{classic ? '🎮 Back to the game' : '📜 Classic page'}</button>
          </motion.div>
        )}
      </AnimatePresence>

      <button id="music" className={musicOn ? 'on' : ''} aria-label="Toggle music" onClick={toggleMusic}>{musicOn ? '♪' : '♪̸'}</button>
      {!classic && <button id="skip" onClick={() => openClassic(true)}>📜 Skip to classic page</button>}

      <AnimatePresence>
        {fact && <motion.div className="factbar" key={fact.id} initial={{ opacity: 0, y: -24, x: '-50%', scale: .92 }} animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }} exit={{ opacity: 0, y: -16, x: '-50%' }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>{fact.star ? '' : '💡 '}{fact.text}</motion.div>}
      </AnimatePresence>

      <AnimatePresence>
        {toast && <motion.div id="toast" key={toast.id} initial={{ opacity: 0, y: -14, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: -10, x: '-50%' }}>{toast.msg}</motion.div>}
      </AnimatePresence>

      <AnimatePresence>
        {section && (
          <motion.div className="overlay" key="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(e) => e.target === e.currentTarget && setCard(null)}>
            <motion.div className="box" initial={{ scale: .5, y: 80, rotate: -4 }} animate={{ scale: 1, y: 0, rotate: 0 }} exit={{ scale: .8, opacity: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
              <button className="x" aria-label="Close" onClick={() => setCard(null)}>✕</button>
              <h2>{section.title}</h2><SectionBody s={section} />
            </motion.div>
          </motion.div>
        )}
        {cp !== null && <Checkpoint key={'cp' + cp} index={cp} onDone={doneCheckpoint} />}
        {ended && (
          <motion.div className="overlay" key="end" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div className="box end" initial={{ scale: .6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 240, damping: 16 }}>
              <h2>Thank you for visiting my portfolio, {name}!</h2>
              <p>Final score: <b>{score}</b></p>
              <div className="links">
                <a href={`mailto:${SITE.email}`}>✉️ Email me</a><a href={SITE.calendly} target="_blank" rel="noopener noreferrer">📅 Book a meeting</a>
                <a href={SITE.links.linkedin} target="_blank" rel="noopener noreferrer">💼 LinkedIn</a><a href={SITE.links.github} target="_blank" rel="noopener noreferrer">🐙 GitHub</a>
              </div>
              <button className="btn" onClick={() => location.reload()}>↺ Play again</button>{' '}
              <button className="btn" onClick={() => { setEnded(false); openClassic(true); }}>📜 Classic page</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {playing && !classic && <div id="pad">
        <div className="grp2"><button onPointerDown={press('arrowleft', true)} onPointerUp={press('arrowleft', false)} onPointerLeave={press('arrowleft', false)} onPointerCancel={press('arrowleft', false)}>◀</button>
          <button onPointerDown={press('arrowright', true)} onPointerUp={press('arrowright', false)} onPointerLeave={press('arrowright', false)} onPointerCancel={press('arrowright', false)}>▶</button></div>
        <div className="grp2"><button className="wide" onPointerDown={press(' ', true)} onPointerUp={press(' ', false)} onPointerLeave={press(' ', false)} onPointerCancel={press(' ', false)}>JUMP</button></div>
      </div>}

      {visited && <Suspense fallback={null}><Classic open={classic} onPlay={() => openClassic(false)} scrollRef={classicRef} /></Suspense>}
    </>
  );
}
