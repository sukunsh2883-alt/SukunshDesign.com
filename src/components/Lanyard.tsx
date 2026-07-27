/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';
import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

// 1x1 transparent pixel
const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// Create default texture for single black lanyard strap
function createDefaultLanyardTexture(): string {
  if (typeof document === 'undefined') return BLANK_PIXEL;
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return BLANK_PIXEL;

  // Dark matte charcoal strap
  ctx.fillStyle = '#111115';
  ctx.fillRect(0, 0, 2048, 256);

  // Woven edge stitching borders
  ctx.strokeStyle = '#27272a';
  ctx.lineWidth = 6;
  ctx.strokeRect(0, 8, 2048, 240);

  // Repeating white "SUKUNSH" pattern along the strap
  ctx.font = '900 44px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let x = 140; x < 2048; x += 360) {
    ctx.fillStyle = '#f4f4f5';
    ctx.fillText('SUKUNSH', x, 128);

    ctx.fillStyle = '#71717a';
    ctx.fillText('✦', x + 180, 128);
  }

  return canvas.toDataURL();
}

const DEFAULT_LANYARD_TEX = createDefaultLanyardTexture();

function drawAtomicEmblem(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number = 1,
  color: string = '#000000'
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 18 * scale;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Ring 1: Rotated -35 deg
  ctx.save();
  ctx.rotate((-35 * Math.PI) / 180);
  ctx.beginPath();
  ctx.ellipse(0, 0, 120 * scale, 56 * scale, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Ring 2: Rotated 35 deg
  ctx.save();
  ctx.rotate((35 * Math.PI) / 180);
  ctx.beginPath();
  ctx.ellipse(0, 0, 120 * scale, 56 * scale, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Central nucleus / dot
  ctx.beginPath();
  ctx.arc(-24 * scale, -12 * scale, 14 * scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function createDefaultFrontCard(): string {
  if (typeof document === 'undefined') return BLANK_PIXEL;
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 900;
  const ctx = canvas.getContext('2d');
  if (!ctx) return BLANK_PIXEL;

  // Crisp clean white card background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 600, 900);

  // 2. PICTURE OF ME (Centered Profile Portrait)
  const px = 150, py = 180, pw = 300, ph = 360, pr = 18;
  
  // Outer Photo Frame & Drop Shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(px - 6, py - 6, pw + 12, ph + 12, pr + 4);
  ctx.fill();
  ctx.restore();

  // Clipped Portrait Area
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(px, py, pw, ph, pr);
  ctx.clip();

  // Portrait Backdrop Gradient
  const bgGrad = ctx.createLinearGradient(px, py, px + pw, py + ph);
  bgGrad.addColorStop(0, '#27272a');
  bgGrad.addColorStop(0.5, '#18181b');
  bgGrad.addColorStop(1, '#09090b');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(px, py, pw, ph);

  // Soft Studio Lighting Flare
  const flare = ctx.createRadialGradient(px + pw * 0.5, py + ph * 0.35, 10, px + pw * 0.5, py + ph * 0.35, 180);
  flare.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
  flare.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = flare;
  ctx.fillRect(px, py, pw, ph);

  // Stylized Portrait Illustration (Sukunsh - Visual Designer)
  const cx = px + pw / 2;
  const cy = py + ph / 2;

  // Body / Torso / Dark Turtleneck
  ctx.fillStyle = '#18181b';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 180, 120, 110, 0, 0, Math.PI * 2);
  ctx.fill();

  // Neck
  ctx.fillStyle = '#d4a373';
  ctx.fillRect(cx - 28, cy + 30, 56, 50);

  // Head Oval
  ctx.fillStyle = '#e0a96d';
  ctx.beginPath();
  ctx.ellipse(cx, cy - 10, 68, 82, 0, 0, Math.PI * 2);
  ctx.fill();

  // Modern Hairstyle (Dark Textured Hair)
  ctx.fillStyle = '#18181b';
  ctx.beginPath();
  ctx.ellipse(cx - 2, cy - 55, 74, 52, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx - 30, cy - 60, 45, 0, Math.PI * 2);
  ctx.arc(cx + 25, cy - 65, 42, 0, Math.PI * 2);
  ctx.arc(cx, cy - 80, 50, 0, Math.PI * 2);
  ctx.fill();

  // Glasses Frame (Visual Designer Style)
  ctx.strokeStyle = '#09090b';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(cx - 48, cy - 25, 40, 30, 8);
  ctx.roundRect(cx + 8, cy - 25, 40, 30, 8);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 8, cy - 12);
  ctx.lineTo(cx + 8, cy - 12);
  ctx.stroke();

  // Eyes behind glasses
  ctx.fillStyle = '#18181b';
  ctx.beginPath();
  ctx.arc(cx - 28, cy - 10, 5, 0, Math.PI * 2);
  ctx.arc(cx + 28, cy - 10, 5, 0, Math.PI * 2);
  ctx.fill();

  // Subtle Smile & Nose
  ctx.strokeStyle = '#b58352';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - 2, cy + 2);
  ctx.lineTo(cx + 2, cy + 14);
  ctx.lineTo(cx + 8, cy + 14);
  ctx.stroke();

  ctx.strokeStyle = '#18181b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy + 22, 18, 0.1, Math.PI - 0.1);
  ctx.stroke();

  // Photo Overlay Badge Tag
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillRect(px + 12, py + ph - 38, 120, 26);
  ctx.fillStyle = '#09090b';
  ctx.font = '800 12px sans-serif';
  ctx.fillText('★ VERIFIED', px + 22, py + ph - 21);

  ctx.restore();

  // 3. TEXT & DETAILS BELOW PHOTO
  ctx.fillStyle = '#0a0a0c';
  ctx.font = '900 42px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SUKUNSH', 300, 605);

  ctx.fillStyle = '#71717a';
  ctx.font = '700 18px sans-serif';
  ctx.fillText('VISUAL DESIGNER & ARTIST', 300, 642);

  // Decorative Accent Divider Line
  ctx.strokeStyle = '#1d1e1e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(220, 672);
  ctx.lineTo(380, 672);
  ctx.stroke();

  // Bottom ID Badge Barcode Strip
  ctx.fillStyle = '#18181b';
  const barX = 140;
  const barY = 710;
  for (let i = 0; i < 48; i++) {
    const w = (i % 3 === 0 ? 6 : i % 2 === 0 ? 4 : 2);
    ctx.fillRect(barX + i * 7, barY, w, 40);
  }

  ctx.fillStyle = '#a1a1aa';
  ctx.font = '600 13px monospace';
  ctx.fillText('ID-982026 • SUKUNSH.DESIGN', 300, 775);

  return canvas.toDataURL();
}

function createDefaultBackCard(): string {
  if (typeof document === 'undefined') return BLANK_PIXEL;
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 900;
  const ctx = canvas.getContext('2d');
  if (!ctx) return BLANK_PIXEL;

  // Crisp clean white card background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 600, 900);

  ctx.fillStyle = '#0a0a0c';
  ctx.font = '900 52px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SUKUNSH', 300, 430);

  ctx.fillStyle = '#71717a';
  ctx.font = '700 20px sans-serif';
  ctx.fillText('VISUAL DESIGNER & ARTIST', 300, 480);

  ctx.fillStyle = '#09090b';
  ctx.font = '600 16px sans-serif';
  ctx.fillText('DELHI • BIHAR • INDIA', 300, 520);

  ctx.fillStyle = '#18181b';
  ctx.font = '600 14px monospace';
  ctx.fillText('SCAN TO CONNECT', 300, 765);

  return canvas.toDataURL();
}

const DEFAULT_FRONT_CARD = createDefaultFrontCard();
const DEFAULT_BACK_CARD = createDefaultBackCard();

// ============================================================================
// LANYARD CONFIGURATION SETTINGS
// ============================================================================
export const DEFAULT_LANYARD_SETTINGS = {
  gravity: [0, -28, 0] as [number, number, number],
  springStrength: 1.2,
  damping: 4.5,
  mouseInfluence: 0.3,
  scrollInfluence: 0.3,
  idleSway: 0.2,
  maximumRotation: 4.0,
  strapLength: 1.1,
  cardWeight: 0.8,
};

export interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardImage?: string | null;
  lanyardWidth?: number;
  cardGlbPath?: string;
  // Interactive Physics Settings
  springStrength?: number;
  damping?: number;
  mouseInfluence?: number;
  scrollInfluence?: number;
  idleSway?: number;
  maximumRotation?: number;
  strapLength?: number;
  cardWeight?: number;
  anchorX?: number;
}

export default function Lanyard({
  position = [0, 0, 16],
  gravity = DEFAULT_LANYARD_SETTINGS.gravity,
  fov = 22,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1.3,
  cardGlbPath = '/card.glb',
  springStrength = DEFAULT_LANYARD_SETTINGS.springStrength,
  damping = DEFAULT_LANYARD_SETTINGS.damping,
  mouseInfluence = DEFAULT_LANYARD_SETTINGS.mouseInfluence,
  scrollInfluence = DEFAULT_LANYARD_SETTINGS.scrollInfluence,
  idleSway = DEFAULT_LANYARD_SETTINGS.idleSway,
  maximumRotation = DEFAULT_LANYARD_SETTINGS.maximumRotation,
  strapLength = DEFAULT_LANYARD_SETTINGS.strapLength,
  cardWeight = DEFAULT_LANYARD_SETTINGS.cardWeight,
  anchorX,
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const resolvedAnchorX = anchorX ?? (isMobile ? 0 : 2.8);

  return (
    <div className="lanyard-wrapper">
      <Canvas
        camera={{ position: position, fov: fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI * 1.2} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band
            isMobile={isMobile}
            frontImage={frontImage}
            backImage={backImage}
            imageFit={imageFit}
            lanyardImage={lanyardImage}
            lanyardWidth={lanyardWidth}
            cardGlbPath={cardGlbPath}
            springStrength={springStrength}
            damping={damping}
            mouseInfluence={mouseInfluence}
            scrollInfluence={scrollInfluence}
            idleSway={idleSway}
            maximumRotation={maximumRotation}
            strapLength={strapLength}
            cardWeight={cardWeight}
            anchorX={resolvedAnchorX}
          />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardImage?: string | null;
  lanyardWidth?: number;
  cardGlbPath?: string;
  springStrength: number;
  damping: number;
  mouseInfluence: number;
  scrollInfluence: number;
  idleSway: number;
  maximumRotation: number;
  strapLength: number;
  cardWeight: number;
  anchorX?: number;
}

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1.3,
  springStrength,
  damping,
  mouseInfluence,
  scrollInfluence,
  idleSway,
  maximumRotation,
  strapLength,
  cardWeight,
  anchorX = 0,
}: BandProps) {
  const band = useRef<any>(null),
    fixed = useRef<any>(null),
    j1 = useRef<any>(null),
    j2 = useRef<any>(null),
    j3 = useRef<any>(null),
    card = useRef<any>(null);

  const vec = useMemo(() => new THREE.Vector3(), []);
  const ang = useMemo(() => new THREE.Vector3(), []);
  const rot = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const quat = useMemo(() => new THREE.Quaternion(), []);
  const euler = useMemo(() => new THREE.Euler(), []);
  const prevPointer = useRef(new THREE.Vector2());

  const segmentProps = useMemo(() => ({
    type: 'dynamic' as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: damping,
    linearDamping: damping,
    density: cardWeight,
  }), [damping, cardWeight]);

  const texture = useTexture(lanyardImage || DEFAULT_LANYARD_TEX);
  const frontTex = useTexture(frontImage || DEFAULT_FRONT_CARD);
  const backTex = useTexture(backImage || DEFAULT_BACK_CARD);

  // Procedural 3D White Card Geometry with Top Slot Hole
  const proceduralCardGeo = useMemo(() => {
    const shape = new THREE.Shape();
    const w = 1.3, h = 1.95, r = 0.08;
    shape.moveTo(-w / 2 + r, -h / 2);
    shape.lineTo(w / 2 - r, -h / 2);
    shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    shape.lineTo(w / 2, h / 2 - r);
    shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    shape.lineTo(-w / 2 + r, h / 2);
    shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    shape.lineTo(-w / 2, -h / 2 + r);
    shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);

    // Slot hole in top center of card
    const slotPath = new THREE.Path();
    const sw = 0.24, sh = 0.05, sr = 0.02, sy = 0.85;
    slotPath.moveTo(-sw / 2 + sr, sy - sh / 2);
    slotPath.lineTo(sw / 2 - sr, sy - sh / 2);
    slotPath.quadraticCurveTo(sw / 2, sy - sh / 2, sw / 2, sy - sh / 2 + sr);
    slotPath.lineTo(sw / 2, sy + sh / 2 - sr);
    slotPath.quadraticCurveTo(sw / 2, sy + sh / 2, sw / 2 - sr, sy + sh / 2);
    slotPath.lineTo(-sw / 2 + sr, sy + sh / 2);
    slotPath.quadraticCurveTo(-sw / 2, sy + sh / 2, -sw / 2, sy + sh / 2 - sr);
    slotPath.lineTo(-sw / 2, sy - sh / 2 + sr);
    slotPath.quadraticCurveTo(-sw / 2, sy - sh / 2, -sw / 2 + sr, sy - sh / 2);
    shape.holes.push(slotPath);

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.02,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.006,
      bevelThickness: 0.006,
    });
    geo.center();

    // UV mapping for front and back card maps
    const pos = geo.attributes.position;
    const uvs = new Float32Array(pos.count * 2);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const u = (x + w / 2) / w;
      const v = (y + h / 2) / h;
      if (z > 0.004) {
        // Front side -> map to left half [0.0, 0.5]
        uvs[i * 2] = u * 0.5;
        uvs[i * 2 + 1] = v;
      } else if (z < -0.004) {
        // Back side -> map to right half [0.5, 1.0]
        uvs[i * 2] = 0.5 + (1 - u) * 0.5;
        uvs[i * 2 + 1] = v;
      } else {
        // Edges / Bevel
        uvs[i * 2] = 0.25;
        uvs[i * 2 + 1] = 0.5;
      }
    }
    geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    return geo;
  }, []);

  // Plastic / Metal Clamp that loops through card slot
  const proceduralClampGeo = useMemo(() => {
    const geo = new THREE.BoxGeometry(0.30, 0.15, 0.04);
    geo.translate(0, 0.85, 0);
    return geo;
  }, []);

  // Hook / Clip extending from clamp to ring starting point
  const proceduralHookGeo = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.02, 0.02, 0.12, 16);
    geo.translate(0, 0.98, 0);
    return geo;
  }, []);

  // Ring / Buckle where linear strap connects to the starting point of the hook
  const proceduralRingGeo = useMemo(() => {
    const geo = new THREE.TorusGeometry(0.05, 0.012, 16, 32);
    geo.rotateX(Math.PI / 2);
    geo.translate(0, 1.05, 0);
    return geo;
  }, []);

  const compositeTexture = useMemo(() => {
    const W = 2048;
    const H = 2048;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const fW = W / 2; // 1024
    const fH = H;     // 2048

    // Helper to draw written sequence background ("Sukunsh")
    const drawWrittenSequence = (startX: number, width: number, height: number) => {
      ctx.save();
      ctx.fillStyle = '#e5e5eb';
      ctx.font = '800 64px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let y = 100; y < height; y += 140) {
        const shift = (Math.floor(y / 140) % 2) * 120;
        for (let x = startX - 80 + shift; x < startX + width + 160; x += 320) {
          ctx.fillText('Sukunsh', x, y);
        }
      }
      ctx.restore();
    };

    // ==========================================
    // FRONT CARD SIDE (Left Half 0 -> fW)
    // ==========================================
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, fW, fH);

    if (frontTex?.image) {
      if (frontImage) {
        const img = frontTex.image as HTMLImageElement;
        
        // 1. Crystal Clear User Image (Pure white card, no gray strip or watermark)
        const px = 100, py = 180, pw = fW - 200, ph = 1380, pr = 32;

        // Clipped High-Res Image
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(px, py, pw, ph, pr);
        ctx.clip();

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(px, py, pw, ph);

        const imgW = img.width || 1;
        const imgH = img.height || 1;
        const imgAspect = imgW / imgH;
        const frameAspect = pw / ph;

        let drawW = pw;
        let drawH = ph;
        let drawX = px;
        let drawY = py;

        if (imgAspect > frameAspect) {
          drawW = ph * imgAspect;
          drawX = px - (drawW - pw) / 2;
        } else {
          drawH = pw / imgAspect;
          drawY = py - (drawH - ph) / 2;
        }

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        ctx.restore();

        // 2. ONLY THE NAME BELOW THE IMAGE
        ctx.fillStyle = '#09090b';
        ctx.font = '900 88px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SUKUNSH', fW / 2, 1780);
      } else {
        ctx.drawImage(frontTex.image as HTMLImageElement, 0, 0, fW, fH);
      }
    }

    // ==========================================
    // BACK CARD SIDE (Right Half fW -> W)
    // ==========================================
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(fW, 0, fW, fH);

    // Center Name on Back Side
    ctx.fillStyle = '#09090b';
    ctx.font = '900 110px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SUKUNSH', fW + fW / 2, fH / 2);

    if (backTex?.image && !frontImage) {
      ctx.drawImage(backTex.image as HTMLImageElement, fW, 0, fW, fH);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 16;
    tex.needsUpdate = true;
    return tex;
  }, [frontTex, backTex, frontImage]);

  const velocityRef = useRef(new THREE.Vector3());
  const lastPosRef = useRef(new THREE.Vector3());

  // Single vertical lanyard strap curve connected to top linear anchor
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 4.2, 0),
        new THREE.Vector3(0, 3.1, 0),
        new THREE.Vector3(0, 2.0, 0),
        new THREE.Vector3(0, 0.9, 0),
      ])
  );
  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], strapLength]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], strapLength]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], strapLength]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.05, 0]
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  // Handle scroll bounce influence
  const prevScrollY = useRef(typeof window !== 'undefined' ? window.scrollY : 0);
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const deltaY = currentY - prevScrollY.current;
      prevScrollY.current = currentY;

      if (Math.abs(deltaY) > 0.5 && card.current && !dragged) {
        card.current.wakeUp();
        const forceY = Math.max(-0.3, Math.min(0.3, -deltaY * 0.005 * scrollInfluence));
        card.current.applyImpulse({ x: 0, y: forceY, z: 0 }, true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollInfluence, dragged]);

  useFrame((state, delta) => {
    if (dragged && card.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      
      const rawTargetX = vec.x - dragged.x;
      const rawTargetY = vec.y - dragged.y;
      const rawTargetZ = vec.z - dragged.z;

      // Unconstrained full-window movement limits across entire screen frame
      const targetX = Math.max(-35.0, Math.min(35.0, rawTargetX));
      const targetY = Math.max(-25.0, Math.min(25.0, rawTargetY));
      const targetZ = Math.max(-10.0, Math.min(10.0, rawTargetZ));

      if (delta > 0) {
        velocityRef.current.set(
          (targetX - lastPosRef.current.x) / delta,
          (targetY - lastPosRef.current.y) / delta,
          (targetZ - lastPosRef.current.z) / delta
        );
      }
      lastPosRef.current.set(targetX, targetY, targetZ);

      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: targetX, y: targetY, z: targetZ });

      // Continuous front-facing restoring torque while dragging
      const q = card.current.rotation();
      quat.set(q.x, q.y, q.z, q.w);
      euler.setFromQuaternion(quat, 'YXZ');

      let yAngle = euler.y;
      while (yAngle > Math.PI) yAngle -= Math.PI * 2;
      while (yAngle < -Math.PI) yAngle += Math.PI * 2;

      const restoringTorqueY = -yAngle * 0.15;
      card.current.wakeUp();
      card.current.applyTorqueImpulse({ x: 0, y: restoringTorqueY, z: 0 }, true);
    }

    if (fixed.current) {
      // Natural rope lerp interpolation
      [j1, j2].forEach(ref => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)) * springStrength
        );
      });

      // Construct continuous single vertical strap line
      const fixedP = fixed.current?.translation() || new THREE.Vector3(anchorX, 4.2, 0);
      const j1P = j1.current?.lerped || j1.current?.translation() || new THREE.Vector3(anchorX, 3.1, 0);
      const j2P = j2.current?.lerped || j2.current?.translation() || new THREE.Vector3(anchorX, 2.0, 0);
      const j3P = j3.current?.translation() || new THREE.Vector3(anchorX, 0.9, 0);

      curve.points[0].copy(fixedP);
      curve.points[1].copy(j1P);
      curve.points[2].copy(j2P);
      curve.points[3].copy(j3P);

      if (band.current?.geometry) {
        band.current.geometry.setPoints(curve.getPoints(isMobile ? 24 : 48));
      }

      // Mouse influence & Subtle idle sway when not actively dragged
      if (!dragged && card.current) {
        const time = state.clock.getElapsedTime();

        // Mouse motion impulse - gentle reaction
        const mouseDeltaX = state.pointer.x - prevPointer.current.x;
        const mouseDeltaY = state.pointer.y - prevPointer.current.y;

        if (Math.abs(mouseDeltaX) > 0.001 || Math.abs(mouseDeltaY) > 0.001) {
          card.current.wakeUp();
          card.current.applyImpulse(
            {
              x: Math.max(-0.25, Math.min(0.25, mouseDeltaX * 0.25 * mouseInfluence)),
              y: Math.max(-0.25, Math.min(0.25, mouseDeltaY * 0.25 * mouseInfluence)),
              z: 0,
            },
            true
          );
        }

        // Minimal subtle idle sway
        if (idleSway > 0) {
          const swayX = Math.sin(time * 0.8) * 0.0005 * idleSway;
          const swayZ = Math.cos(time * 0.6) * 0.0005 * idleSway;
          card.current.wakeUp();
          card.current.applyTorqueImpulse({ x: swayZ, y: swayX, z: 0 }, true);
        }

        // Automatic front-side restoring torque: orient card back to facing front (y = 0 rad)
        const q = card.current.rotation();
        quat.set(q.x, q.y, q.z, q.w);
        euler.setFromQuaternion(quat, 'YXZ');

        let yAngle = euler.y;
        while (yAngle > Math.PI) yAngle -= Math.PI * 2;
        while (yAngle < -Math.PI) yAngle += Math.PI * 2;

        const restoringTorqueY = -yAngle * 0.12;
        card.current.wakeUp();
        card.current.applyTorqueImpulse({ x: 0, y: restoringTorqueY, z: 0 }, true);

        // Smooth angular velocity decay allowing natural rotation
        ang.copy(card.current.angvel());
        card.current.setAngvel({
          x: Math.max(-1.5, Math.min(1.5, ang.x * 0.90)),
          y: Math.max(-3.0, Math.min(3.0, ang.y * 0.92)),
          z: Math.max(-1.5, Math.min(1.5, ang.z * 0.90)),
        });
      }

      prevPointer.current.set(state.pointer.x, state.pointer.y);
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[anchorX, 4.2, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />

        {/* Top Ceiling / Linear Anchor Mount */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.04, 24]} />
          <meshStandardMaterial color="#d4d4d8" metalness={0.95} roughness={0.15} />
        </mesh>

        <RigidBody position={[0, -1.1, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -2.2, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -3.3, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -4.58, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.65, 0.98, 0.015]} />
          <group
            position={[0, 0, 0]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={e => {
              (e.target as HTMLElement).releasePointerCapture(e.pointerId);
              if (card.current && velocityRef.current) {
                const vx = Math.max(-20, Math.min(20, velocityRef.current.x * 0.7));
                const vy = Math.max(-20, Math.min(20, velocityRef.current.y * 0.7));
                const vz = Math.max(-20, Math.min(20, velocityRef.current.z * 0.7));
                card.current.setLinvel({ x: vx, y: vy, z: vz }, true);
                // Gentle spin velocity on release so it auto-aligns back to facing front
                card.current.setAngvel({ x: 0, y: Math.max(-1, Math.min(1, velocityRef.current.x * 0.1)), z: 0 }, true);
              }
              drag(false);
            }}
            onPointerDown={e => {
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
          >
            {/* White Rounded Card Badge */}
            <mesh geometry={proceduralCardGeo}>
              <meshPhysicalMaterial
                map={compositeTexture}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.25}
                metalness={0.05}
              />
            </mesh>
            {/* Sleek Chrome Metallic Ring at Strap Attachment */}
            <mesh geometry={proceduralRingGeo}>
              <meshStandardMaterial color="#d4d4d8" metalness={0.95} roughness={0.15} />
            </mesh>
            {/* Sleek Chrome Metallic Hook/Clip */}
            <mesh geometry={proceduralHookGeo}>
              <meshStandardMaterial color="#d4d4d8" metalness={0.95} roughness={0.15} />
            </mesh>
            {/* Sleek Chrome Metallic Slot Clamp */}
            <mesh geometry={proceduralClampGeo}>
              <meshStandardMaterial color="#d4d4d8" metalness={0.95} roughness={0.15} />
            </mesh>
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        {/* @ts-ignore */}
        <meshLineGeometry />
        {/* @ts-ignore */}
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[1, -6]}
          lineWidth={lanyardWidth}
        />
      </mesh>
    </>
  );
}
