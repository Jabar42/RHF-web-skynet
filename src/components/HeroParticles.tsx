"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ── Paleta RHF ──────────────────────────────
const MARINO = new THREE.Color("#1F2A3D");
const CAMEL = new THREE.Color("#C2A578");
const MARFIL = new THREE.Color("#F3EFE6");

// ── Sistema de partículas ───────────────────
const COUNT = 500;

function Particles() {
  const meshRef = useRef<THREE.Points>(null!);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Geometría y colores (calculados una vez)
  const { geometry, material, phases, speeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const ph = new Float32Array(COUNT);
    const sp = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;

      const isCamel = Math.random() < 0.6;
      const base = isCamel ? CAMEL : MARFIL;
      colors[i * 3] = base.r;
      colors[i * 3 + 1] = base.g;
      colors[i * 3 + 2] = base.b;

      ph[i] = Math.random() * Math.PI * 2;
      sp[i] = 0.2 + Math.random() * 0.4;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    geo.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );

    const mat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    return { geometry: geo, material: mat, phases: ph, speeds: sp };
  }, []);

  // Animación por frame
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const posAttr = meshRef.current.geometry.attributes.position;
    const pos = posAttr.array as Float32Array;
    const t = state.clock.elapsedTime;

    const mx = state.mouse.x * 0.15;
    const my = state.mouse.y * 0.1;

    mouseRef.current.x += (mx - mouseRef.current.x) * 2 * delta;
    mouseRef.current.y += (my - mouseRef.current.y) * 2 * delta;

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      pos[i3 + 1] += Math.sin(t * speeds[i] + phases[i]) * delta * 0.25;
      pos[i3] += Math.cos(t * speeds[i] * 0.7 + phases[i]) * delta * 0.15;
    }

    meshRef.current.position.x = mouseRef.current.x;
    meshRef.current.position.y = mouseRef.current.y;
    meshRef.current.rotation.y = mouseRef.current.x * 0.3;
    meshRef.current.rotation.x = -mouseRef.current.y * 0.2;

    posAttr.needsUpdate = true;
  });

  return <points ref={meshRef} geometry={geometry} material={material} />;
}

// ── Fallback mientras carga ──────────────────
function FallbackBg() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(135deg, #1F2A3D 0%, #161E2B 60%, rgba(107,74,47,.3) 100%)",
      }}
    />
  );
}

// ── Componente exportado ─────────────────────
export default function HeroParticles() {
  return (
    <Suspense fallback={<FallbackBg />}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, #1F2A3D 0%, #161E2B 60%, rgba(107,74,47,.3) 100%)",
        }}
      >
        <Particles />
      </Canvas>
    </Suspense>
  );
}
