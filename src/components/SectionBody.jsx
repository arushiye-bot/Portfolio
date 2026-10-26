import React from 'react';
import { SITE, PROJECTS } from '../content.js';

export function Links() {
  return (
    <div className="links">
      <a href={SITE.links.resume} target="_blank" rel="noopener noreferrer">📄 Resume</a>
      <a href={SITE.links.linkedin} target="_blank" rel="noopener noreferrer">💼 LinkedIn</a>
      <a href={SITE.links.github} target="_blank" rel="noopener noreferrer">🐙 GitHub</a>
    </div>
  );
}

export default function SectionBody({ s }) {
  if (s.id === 'about') return (<>{s.lines.map((l, i) => <p key={i}>{l}</p>)}<Links /></>);
  if (s.id === 'work') return (
    <>
      {s.jobs.map((j) => (
        <div className="job" key={j.company}>
          <b>{j.role}</b> · {j.company} <i>{j.when}</i>
          <ul>{j.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
        </div>
      ))}
      <h4>Things I’m proud of</h4>
      {PROJECTS.map((p) => <div className="job" key={p.name}><b>{p.name}</b> — {p.desc}</div>)}
    </>
  );
  if (s.id === 'skills') return (
    <>{Object.entries(s.groups).map(([n, items]) => (
      <div className="grp" key={n}><b>{n}</b><div>{items.map((i) => <span className="chip" key={i}>{i}</span>)}</div></div>
    ))}</>
  );
  return (
    <>
      <p>Let’s build something together!</p>
      <div className="links">
        <a href={`mailto:${SITE.email}`}>✉️ Email me</a>
        <a href={SITE.calendly} target="_blank" rel="noopener noreferrer">📅 Book a meeting</a>
        <a href={SITE.links.linkedin} target="_blank" rel="noopener noreferrer">💼 LinkedIn</a>
        <a href={SITE.links.github} target="_blank" rel="noopener noreferrer">🐙 GitHub</a>
      </div>
    </>
  );
}
