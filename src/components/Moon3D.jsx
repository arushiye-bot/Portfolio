import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function texture() {
  const W = 1024, H = 512, c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
  g.fillStyle = '#9a9588'; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 900; i++) { const x = Math.random() * W, y = Math.random() * H, r = 10 + Math.random() * 60, v = 120 + Math.random() * 70; g.fillStyle = `rgba(${v},${v - 4},${v - 14},.07)`; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
  for (let i = 0; i < 260; i++) {
    const r = 3 + Math.pow(Math.random(), 3) * 15, y = Math.random() * H, x = Math.random() * W;
    for (const ox of [0, -W, W]) { const gr = g.createRadialGradient(x + ox, y, r * .3, x + ox, y, r); gr.addColorStop(0, 'rgba(95,91,82,.22)'); gr.addColorStop(.85, 'rgba(110,106,96,.14)'); gr.addColorStop(.94, 'rgba(235,230,215,.28)'); gr.addColorStop(1, 'rgba(235,230,215,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x + ox, y, r, 0, 7); g.fill(); }
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}

export default function Moon3D({ active }) {
  const drag = useRef({ down: false, vx: .003, rx: .25, ry: 1.2, lx: 0, ly: 0 });
  const onDown = (e) => { const d = drag.current; d.down = true; d.lx = e.clientX; d.ly = e.clientY; e.currentTarget.setPointerCapture(e.pointerId); };
  const onMove = (e) => { const d = drag.current; if (!d.down) return; const dx = (e.clientX - d.lx) * .008; d.ry += dx; d.vx = dx; d.rx = Math.max(-1, Math.min(1, d.rx + (e.clientY - d.ly) * .004)); d.lx = e.clientX; d.ly = e.clientY; };
  const onUp = () => { drag.current.down = false; };
  return (
    <div className="moonwrap" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} title="Drag to rotate">
      <Canvas dpr={[1, 2]} frameloop={active ? 'always' : 'never'} camera={{ fov: 32, position: [0, 0, 4.1] }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.9} color="#6a70b0" />
        <directionalLight position={[-3, 1.4, 2.5]} intensity={2.6} color="#fff1d6" />
        <DragMoon drag={drag} />
      </Canvas>
    </div>
  );
}

function DragMoon({ drag }) {
  const ref = useRef(); const tex = useMemo(texture, []);
  useFrame(() => {
    const m = ref.current, d = drag.current;
    if (!d.down) { d.ry += d.vx; d.vx += (.003 - d.vx) * .03; }
    m.rotation.y = d.ry; m.rotation.x = d.rx;
  });
  return (
    <mesh ref={ref} rotation={[.25, 1.2, 0]}>
      <sphereGeometry args={[1, 64, 48]} />
      <meshStandardMaterial map={tex} bumpMap={tex} bumpScale={.8} roughness={.95} metalness={0} />
    </mesh>
  );
}
