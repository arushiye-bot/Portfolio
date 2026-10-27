import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { SITE, SECTIONS } from '../content.js';
import SectionBody, { Tags, Projects } from './SectionBody.jsx';

const Sky3D = lazy(() => import('./Sky3D.jsx'));
const Moon3D = lazy(() => import('./Moon3D.jsx'));

class Safe extends React.Component {
  state = { bad: false };
  static getDerivedStateFromError() { return { bad: true }; }
  componentDidCatch() {}
  render() { return this.state.bad ? this.props.fallback ?? null : this.props.children; }
}

const Ghost = () => (
  <svg viewBox="0 0 30 34" width="34" height="38" className="tghost" aria-hidden="true">
    <path d="M3 30V15a12 12 0 0 1 24 0v15l-4-3-4 3-4-3-4 3-4-3z" fill="#eef2ff" />
    <rect x="9" y="12" width="3" height="6" fill="#2b2f5e" /><rect x="18" y="12" width="3" height="6" fill="#2b2f5e" />
  </svg>
);

export default function Classic({ open, onPlay, scrollRef }) {
  const [about, work, skills, contact] = ['about', 'work', 'skills', 'contact'].map((id) => SECTIONS.find((s) => s.id === id));
  const go = (e, id) => { e.preventDefault(); document.getElementById('c-' + id)?.scrollIntoView({ behavior: 'smooth' }); };
  return (
    <div id="classic" ref={scrollRef} className={open ? 'show' : ''}>
      <Safe><Suspense fallback={null}><Sky3D active={open} /></Suspense></Safe>
      <header>
        <b>{SITE.name}</b>
        <nav>{SECTIONS.map((s) => <a key={s.id} href={`#c-${s.id}`} onClick={(e) => go(e, s.id)}>{s.short}</a>)}
          <a href="#c-projects" onClick={(e) => go(e, 'projects')}>PROJECTS</a></nav>
        <button id="play" className="btn" onClick={onPlay}>🎮 Play the game</button>
      </header>
      <section className="hero">
        <div className="herotext">
          <h1>Hi, I’m {SITE.name}</h1>
          <p className="role">{SITE.title}</p>
          <p className="tag">{SITE.tagline}</p>
        </div>
        <div className="moonbox">
          <Safe fallback={<div className="moonflat" />}><Suspense fallback={null}><Moon3D active={open} /></Suspense></Safe>
          <small className="mh">◀ drag the moon to rotate ▶</small>
        </div>
      </section>
      <motion.section id="c-about" className="glass" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px', root: scrollRef }} transition={{ duration: .6 }}>
        <h2>{about.title}</h2><SectionBody s={about} />
      </motion.section>
      <section id="c-work">
        <h2 className="plain">{work.title}</h2>
        <div className="timeline">
          <div className="rail"><div className="line" /><div className="ghostwrap"><Ghost /></div></div>
          <div className="jobs">
            {work.jobs.map((j, i) => (
              <motion.div className="jobcard glass" key={j.company} initial={{ opacity: .15, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, margin: '-25% 0px -25% 0px', root: scrollRef }} transition={{ type: 'spring', stiffness: 120, damping: 16 }}>
                <span className="node" />
                <b>{j.role}</b> · {j.company} <i>{j.when}</i>
                {j.industry && <div className="ind">{j.industry}</div>}
                <ul>{j.bullets.map((b, k) => <li key={k}>{b}</li>)}</ul>
                <Tags tags={j.tags} />
              </motion.div>
            ))}
            <SectionBody s={{ id: 'work', jobs: [] }} />
          </div>
        </div>
      </section>
      <motion.section id="c-projects" className="glass" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px', root: scrollRef }}>
        <h2>Projects</h2><Projects />
      </motion.section>
      <motion.section id="c-skills" className="glass" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px', root: scrollRef }}>
        <h2>{skills.title}</h2><SectionBody s={skills} />
      </motion.section>
      <motion.section id="c-contact" className="glass" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px', root: scrollRef }}>
        <h2>{contact.title}</h2><SectionBody s={contact} />
      </motion.section>
      <footer>Thanks for visiting my portfolio ♥</footer>
    </div>
  );
}
