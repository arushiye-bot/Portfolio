import React from 'react';
import { SITE, CERTS, PROJECTS } from '../content.js';

export function Links() {
  return (
    <div className="links">
      <a href={SITE.links.resume} target="_blank" rel="noopener noreferrer">📄 Resume</a>
      <a href={SITE.links.linkedin} target="_blank" rel="noopener noreferrer">💼 LinkedIn</a>
      <a href={SITE.links.github} target="_blank" rel="noopener noreferrer">🐙 GitHub</a>
    </div>
  );
}

export function Certs() {
  return (
    <div className="certs">
      {CERTS.map((c) => (
        <div className="cert" key={c.name}><div className="ic">🏅</div><div><b>{c.name}</b><br />{c.detail}</div></div>
      ))}
    </div>
  );
}

export function Tags({ tags }) {
  return <div>{tags.map(([t, cls]) => <span className={'chip ' + cls} key={t}>{t}</span>)}</div>;
}

export function Projects() {
  return (
    <>
      {PROJECTS.map((p) => (
        <div className="job" key={p.name}>
          <b>{p.name}</b>
          <p>{p.desc}</p>
          <div>{p.tools.map((t) => <span className="chip dv" key={t}>{t}</span>)}</div>
          <div className="links">
            <a href={p.link} target="_blank" rel="noopener noreferrer">🐙 View code on GitHub</a>
            {p.live && <a href={p.live} target="_blank" rel="noopener noreferrer">🌐 Live site</a>}
          </div>
        </div>
      ))}
    </>
  );
}

export default function SectionBody({ s }) {
  if (s.id === 'about') return (<>{s.lines.map((l, i) => <p key={i}>{l}</p>)}<Links /></>);
  if (s.id === 'work') return (
    <>
      {s.jobs.map((j) => (
        <div className="job" key={j.company}>
          <b>{j.role}</b> · {j.company} <i>{j.when}</i>
          {j.industry && <div className="ind">{j.industry}</div>}
          <ul>{j.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
          <Tags tags={j.tags} />
        </div>
      ))}
    </>
  );
  if (s.id === 'skills') return (
    <>
      {s.groups.map((g) => (
        <div className="grp" key={g.name}><h3>{g.name.toUpperCase()}</h3><div>{g.items.map((i) => <span className={'chip ' + g.cls} key={i}>{i}</span>)}</div></div>
      ))}
      <Certs />
    </>
  );
  return (
    <>
      <p>Open to chat about data platforms, lakehouses and GenAI on governed data.</p>
      <div className="contactgrid">
        <a className="ccard" href={SITE.links.github} target="_blank" rel="noopener noreferrer"><span className="av">🐙</span><span><b>arushiye-bot</b><small>github.com/arushiye-bot</small></span></a>
        <a className="ccard" href={SITE.calendly} target="_blank" rel="noopener noreferrer"><span className="av cal">📅</span><span><b>Book 30 minutes</b><small>calendly.com/arushiye/30min</small></span></a>
      </div>
      <div className="links">
        <a href={`mailto:${SITE.email}`}>✉️ Email me</a>
        <a href={SITE.links.linkedin} target="_blank" rel="noopener noreferrer">💼 LinkedIn</a>
        <a href={SITE.links.resume} target="_blank" rel="noopener noreferrer">📄 Resume</a>
      </div>
    </>
  );
}
