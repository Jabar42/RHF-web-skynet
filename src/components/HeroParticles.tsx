"use client";

import { useRef, useMemo, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/lib/motion";

// ── Paleta RHF ──────────────────────────────
const MARINO = new THREE.Color("#1F2A3D");
const CAMEL = new THREE.Color("#C2A578");
const MARFIL = new THREE.Color("#F3EFE6");

// ── Sistema de partículas ───────────────────
const COUNT = 500;

function Particles({ frozen }: { frozen: boolean }) {
  const meshRef = useRef<THREE.Points>(null!);
  // Mouse normalized [-1, 1] leído desde window, no del canvas
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  // Geometría y colores (calculados una vez)
  const { geometry, material, phases, speeds, initials } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const ph = new Float32Array(COUNT);
    const sp = new Float32Array(COUNT);
    const init = new Float32Array(COUNT * 3); // guardamos posición inicial

    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 6;
      const z = (Math.random() - 0.5) * 4;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      init[i * 3] = x;
      init[i * 3 + 1] = y;
      init[i * 3 + 2] = z;

      const isCamel = Math.random() < 0.6;
      const base = isCamel ? CAMEL : MARFIL;
      colors[i * 3] = base.r;
      colors[i * 3 + 1] = base.g;
      colors[i * 3 + 2] = base.b;

      ph[i] = Math.random() * Math.PI * 2;
      sp[i] = 0.2 + Math.random() * 0.4;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    return {
      geometry: geo,
      material: mat,
      phases: ph,
      speeds: sp,
      initials: init,
    };
  }, []);

  // Leer mouse desde window (ignora z-index del overlay de texto).
  // Con reduced-motion no se escucha nada: la escena queda quieta.
  useEffect(() => {
    if (frozen) return;
    const onMove = (e: MouseEvent) => {
      // Normalizar a [-1, 1] relativo al viewport
      mouseRef.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.ty = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [frozen]);

  // Animación por frame
  useFrame((state, delta) => {
    if (frozen || !meshRef.current) return;

    const posAttr = meshRef.current.geometry.attributes.position;
    const pos = posAttr.array as Float32Array;
    const t = state.clock.elapsedTime;
    const m = mouseRef.current;

    // Interpolar mouse hacia target (suavizado)
    m.x += (m.tx - m.x) * 3 * delta;
    m.y += (m.ty - m.y) * 3 * delta;

    // Movimiento autónomo + parallax sutil desde posición inicial
    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const wave = Math.sin(t * speeds[i] + phases[i]);

      // Posición base + onda sinusoidal + desplazamiento por mouse
      pos[i3] = initials[i3] + wave * 0.3 + m.x * 0.6;
      pos[i3 + 1] =
        initials[i3 + 1] +
        Math.cos(t * speeds[i] * 0.7 + phases[i]) * 0.25 +
        m.y * 0.4;
      pos[i3 + 2] = initials[i3 + 2] + wave * 0.15;
    }

    // Rotación global sutil del conjunto
    meshRef.current.rotation.y = m.x * 0.15;
    meshRef.current.rotation.x = -m.y * 0.1;

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
  // Si el sistema pide menos movimiento, la escena se dibuja una vez y se
  // congela: se ve el campo de partículas, pero nada se mueve ni escucha el
  // mouse. El bloque CSS de reduced-motion no alcanza a un rAF de Three.js —
  // hay que apagarlo acá.
  const reduced = usePrefersReducedMotion();

  return (
    <Suspense fallback={<FallbackBg />}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        frameloop={reduced ? "demand" : "always"}
        gl={{ antialias: true, alpha: false }}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, #1F2A3D 0%, #161E2B 60%, rgba(107,74,47,.3) 100%)",
        }}
      >
        <Particles frozen={reduced} />
      </Canvas>
    </Suspense>
  );
}
