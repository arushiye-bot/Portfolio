import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Stars() {
  const mat = useRef();
  const { pos, ph, sz } = useMemo(() => {
    const n = 700, pos = new Float32Array(n * 3), ph = new Float32Array(n), sz = new Float32Array(n);
    for (let i = 0; i < n; i++) { pos[i * 3] = (Math.random() - .5) * 140; pos[i * 3 + 1] = (Math.random() - .5) * 90; pos[i * 3 + 2] = -20 - Math.random() * 60; ph[i] = Math.random() * 6.28; sz[i] = Math.random() < .08 ? 3.2 : 1 + Math.random() * 1.2; }
    return { pos, ph, sz };
  }, []);
  useFrame((s) => { mat.current.uniforms.uTime.value = s.clock.elapsedTime; });
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={pos} count={pos.length / 3} itemSize={3} />
        <bufferAttribute attach="attributes-aPhase" array={ph} count={ph.length} itemSize={1} />
        <bufferAttribute attach="attributes-aSize" array={sz} count={sz.length} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial ref={mat} transparent depthWrite={false} blending={THREE.AdditiveBlending} uniforms={{ uTime: { value: 0 } }}
        vertexShader={`attribute float aPhase; attribute float aSize; uniform float uTime; varying float vA;
          void main(){ vA = .45 + .55 * sin(uTime * (.8 + aPhase * .15) + aPhase * 3.0); vec4 mv = modelViewMatrix * vec4(position,1.0); gl_PointSize = aSize * 2.4 * (60.0 / -mv.z); gl_Position = projectionMatrix * mv; }`}
        fragmentShader={`varying float vA; void main(){ float d = length(gl_PointCoord - .5); if(d > .5) discard; gl_FragColor = vec4(1.0, .97, .9, vA * smoothstep(.5, .0, d)); }`} />
    </points>
  );
}

function Aurora({ y, z, seed, h }) {
  const mat = useRef();
  useFrame((s) => { mat.current.uniforms.uTime.value = s.clock.elapsedTime; });
  return (
    <mesh position={[0, y, z]}>
      <planeGeometry args={[150, 26, 120, 1]} />
      <shaderMaterial ref={mat} transparent depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide}
        uniforms={{ uTime: { value: 0 }, uSeed: { value: seed }, uHue: { value: h } }}
        vertexShader={`uniform float uTime; uniform float uSeed; varying vec2 vUv;
          void main(){ vUv = uv; vec3 p = position; p.y += sin(p.x * .09 + uTime * .25 + uSeed) * 5.0 + sin(p.x * .21 - uTime * .4) * 1.6; gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0); }`}
        fragmentShader={`uniform float uTime; uniform float uSeed; uniform float uHue; varying vec2 vUv;
          vec3 hsv(float h, float s, float v){ vec3 k = clamp(abs(mod(h * 6.0 + vec3(0.,4.,2.), 6.0) - 3.0) - 1.0, 0.0, 1.0); return v * mix(vec3(1.0), k, s); }
          void main(){ float band = pow(sin(vUv.y * 3.14159), 2.2); float rays = .55 + .45 * sin(vUv.x * 38.0 + uTime * .7 + uSeed) * sin(vUv.x * 11.0 - uTime * .3);
            float hue = fract(uHue + vUv.x * .45 + sin(uTime * .08 + uSeed) * .08); vec3 c = hsv(hue, .75, 1.0);
            gl_FragColor = vec4(c * band * rays, band * rays * .34); }`} />
    </mesh>
  );
}

function Comet() {
  const ref = useRef(); const N = 70;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const col = useMemo(() => new THREE.Color(), []);
  useFrame((s) => {
    const m = ref.current; const t = s.clock.elapsedTime, period = 11, dur = 3.6, u = (t % period) / dur, cyc = Math.floor(t / period);
    const dir = cyc % 2 ? -1 : 1, y0 = 22 - (cyc % 3) * 5;
    for (let i = 0; i < N; i++) {
      const f = i / N; const up = u - f * .09;
      if (u > 1.1 || up < 0 || up > 1) { dummy.scale.setScalar(0); }
      else { dummy.position.set(dir * (-52 + up * 104) , y0 - up * 14 + Math.sin(i * .4) * .15, -40); dummy.scale.setScalar(i === 0 ? 1.1 : (1 - f) * .55 + .05); }
      dummy.updateMatrix(); m.setMatrixAt(i, dummy.matrix);
      col.setRGB(1, .9 - f * .3, .6 - f * .4).multiplyScalar(i === 0 ? 1.4 : (1 - f) * .9); m.setColorAt(i, col);
    }
    m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[null, null, N]} frustumCulled={false}>
      <sphereGeometry args={[1, 10, 8]} />
      <meshBasicMaterial transparent blending={THREE.AdditiveBlending} depthWrite={false} />
    </instancedMesh>
  );
}

function Rig() {
  useFrame((s) => { s.camera.position.x += ((s.pointer.x * 2.5) - s.camera.position.x) * .03; s.camera.position.y += ((s.pointer.y * 1.2) - s.camera.position.y) * .03; s.camera.lookAt(0, 0, -30); });
  return null;
}

export default function Sky3D({ active }) {
  return (
    <Canvas style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} dpr={[1, 1.5]} frameloop={active ? 'always' : 'never'} camera={{ fov: 60, position: [0, 0, 0] }} gl={{ antialias: false, alpha: true }}>
      <Stars />
      <Aurora y={14} z={-32} seed={0} h={.35} />
      <Aurora y={7} z={-36} seed={2} h={.55} />
      <Aurora y={20} z={-40} seed={4} h={.85} />
      <Comet />
      <Rig />
    </Canvas>
  );
}
