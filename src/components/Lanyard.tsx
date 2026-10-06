/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

import cardGLB from '../assets/lanyard/card.glb';
import lanyard from '../assets/lanyard/lanyard.png';
import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

// 1x1 transparent pixel — lets useTexture be called unconditionally when a
// front/back image isn't supplied.
const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// The card model's front face is UV-mapped to the LEFT half of the texture
// atlas and the back face to the RIGHT half (measured from card.glb). Each
// custom image is composited into its own half so the two faces render
// independently, aspect-preserving (no stretching).
const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

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
  anchorX?: number;
}

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1,
  anchorX = 0
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="lanyard-wrapper">
      <Canvas
        camera={{ position: position, fov: fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[0, 6, 10]} intensity={1.2} />
        <directionalLight position={[-4, 2, 6]} intensity={0.5} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band
            isMobile={isMobile}
            frontImage={frontImage}
            backImage={backImage}
            imageFit={imageFit}
            lanyardImage={lanyardImage}
            lanyardWidth={lanyardWidth}
            anchorX={anchorX}
          />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={1}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={1.5}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={1.5}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
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

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1,
  anchorX = 0
}: {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardImage?: string | null;
  lanyardWidth?: number;
  anchorX?: number;
}) {
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

  const segmentProps: any = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 4, linearDamping: 4 };
  const { nodes, materials } = useGLTF(cardGLB) as any;
  const texture = useTexture(lanyardImage || lanyard) as THREE.Texture;
  // useTexture must be called unconditionally; use a blank pixel when an image
  // isn't supplied for a given face, then skip compositing it below.
  const frontTex = useTexture(frontImage || BLANK_PIXEL) as THREE.Texture;
  const backTex = useTexture(backImage || BLANK_PIXEL) as THREE.Texture;

  // Composite the front/back images into the card's texture atlas (front = left
  // half, back = right half). Each image is drawn aspect-preserving (no stretch).
  const cardMap = useMemo(() => {
    const baseMap = materials?.base?.map;
    if (!baseMap) return null;
    if (!frontImage && !backImage) return baseMap;

    const baseImg = baseMap.image;
    if (!baseImg) return baseMap;
    const W = baseImg.width || 1024;
    const H = baseImg.height || 1024;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return baseMap;
    // Keep the original baked atlas for the card edges and any untouched face.
    ctx.drawImage(baseImg, 0, 0, W, H);

    const drawModernFrontBadge = (img: any, rect: any) => {
      const rx = rect.x * W;
      const ry = rect.y * H;
      const rw = rect.w * W;
      const rh = rect.h * H;

      // 1. Clean Crisp White Base for the card (no grayish tint)
      ctx.save();
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(rx, ry, rw, rh);

      // 2. Full-bleed Portrait Photo across top portion (Actual photo - NO artificial filter)
      if (img && img.width && img.height) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(rx, ry, rw, rh * 0.75);
        ctx.clip();

        // Fit cover across the card width
        const targetW = rw;
        const targetH = rh * 0.72;
        const scale = Math.max(targetW / img.width, targetH / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        const dx = rx + (targetW - dw) / 2;
        const dy = ry;

        // Actual authentic photograph without artificial filter or grayish cast
        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.restore();
      }

      // 3. Asymmetrical Matte Black Wave Block (deep black, not gray)
      const y1 = ry + rh * 0.60;
      const y2 = ry + rh * 0.68;
      const curveStartX = rx + rw * 0.58;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(rx, y1);
      ctx.lineTo(curveStartX, y1);
      ctx.bezierCurveTo(
        rx + rw * 0.75, y1,
        rx + rw * 0.78, y2,
        rx + rw, y2
      );
      ctx.lineTo(rx + rw, ry + rh);
      ctx.lineTo(rx, ry + rh);
      ctx.closePath();
      ctx.fillStyle = '#0f0f11';
      ctx.fill();

      // 4. Typography on the Dark Block: SURAJ Kumar Sharma - big, bold, filling negative space
      const padX = 36;
      const textLeft = rx + padX;

      // White Name: SURAJ Kumar Sharma (52px bold, massive & prominent)
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 52px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('SURAJ', textLeft, y1 + 30);
      ctx.font = '900 42px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Kumar Sharma', textLeft, y1 + 86);

      // Bottom Row: "Visual Designer" left-aligned, "ID #0009256" right-aligned
      const bottomY = ry + rh - 40;
      ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#E4E4E7';
      ctx.fillText('Visual Designer', textLeft, bottomY);

      ctx.textAlign = 'right';
      ctx.font = '700 20px "Plus Jakarta Sans", monospace, sans-serif';
      ctx.fillStyle = '#E4E4E7';
      ctx.fillText('ID #0009256', rx + rw - padX, bottomY);

      // 5. Top clip slot punch hole
      ctx.fillStyle = '#111113';
      const slotW = 50;
      const slotH = 12;
      const slotX = rx + (rw - slotW) / 2;
      const slotY = ry + 24;
      const r = slotH / 2;
      ctx.beginPath();
      ctx.moveTo(slotX + r, slotY);
      ctx.lineTo(slotX + slotW - r, slotY);
      ctx.arc(slotX + slotW - r, slotY + r, r, -Math.PI / 2, Math.PI / 2);
      ctx.lineTo(slotX + r, slotY + slotH);
      ctx.arc(slotX + r, slotY + r, r, Math.PI / 2, -Math.PI / 2);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    const drawModernBackBadge = (rect: any) => {
      const rx = rect.x * W;
      const ry = rect.y * H;
      const rw = rect.w * W;
      const rh = rect.h * H;

      ctx.save();
      // Matte dark background
      ctx.fillStyle = '#0f0f11';
      ctx.fillRect(rx, ry, rw, rh);

      // Top slot hole
      ctx.fillStyle = '#27272a';
      const slotW = 50;
      const slotH = 12;
      const slotX = rx + (rw - slotW) / 2;
      const slotY = ry + 24;
      const r = slotH / 2;
      ctx.beginPath();
      ctx.moveTo(slotX + r, slotY);
      ctx.lineTo(slotX + slotW - r, slotY);
      ctx.arc(slotX + slotW - r, slotY + r, r, -Math.PI / 2, Math.PI / 2);
      ctx.lineTo(slotX + r, slotY + slotH);
      ctx.arc(slotX + r, slotY + r, r, Math.PI / 2, -Math.PI / 2);
      ctx.closePath();
      ctx.fill();

      // Bold vertical brand text
      ctx.save();
      ctx.translate(rx + 68, ry + rh - 60);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 36px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('# SURAJ KUMAR SHARMA', 0, 0);
      ctx.restore();

      // Clean footer on back
      ctx.fillStyle = '#A1A1AA';
      ctx.font = '700 15px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Visual Designer', rx + 36, ry + rh - 40);
      ctx.textAlign = 'right';
      ctx.fillText('ID #0009256', rx + rw - 36, ry + rh - 40);

      ctx.restore();
    };

    if (frontTex?.image) {
      drawModernFrontBadge(frontTex.image, FRONT_UV_RECT);
    }
    drawModernBackBadge(BACK_UV_RECT);

    const composite = new THREE.CanvasTexture(canvas);
    composite.colorSpace = THREE.SRGBColorSpace;
    composite.flipY = baseMap.flipY;
    composite.anisotropy = 16;
    composite.needsUpdate = true;
    return composite;
  }, [frontImage, backImage, imageFit, frontTex, backTex, materials]);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  const [dragged, drag] = useState<any>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 2.18, 0]
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && card.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current && j1.current && j2.current && j3.current && card.current && band.current) {
      [j1, j2].forEach(ref => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[anchorX, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[1.15, 1.6, 0.01]} />
          <group
            scale={3.2}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={e => ((e.target as any).releasePointerCapture(e.pointerId), drag(false))}
            onPointerDown={e => (
              (e.target as any).setPointerCapture(e.pointerId),
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
            )}
          >
            {nodes?.card && (
              <mesh geometry={nodes.card.geometry}>
                <meshPhysicalMaterial
                  map={cardMap}
                  map-anisotropy={16}
                  clearcoat={isMobile ? 0 : 0.3}
                  clearcoatRoughness={0.1}
                  roughness={0.2}
                  metalness={0.0}
                  reflectivity={0.2}
                />
              </mesh>
            )}
            {nodes?.clip && (
              <mesh geometry={nodes.clip.geometry}>
                <meshStandardMaterial color="#1a1a1c" roughness={0.35} metalness={0.85} />
              </mesh>
            )}
            {nodes?.clamp && (
              <mesh geometry={nodes.clamp.geometry}>
                <meshStandardMaterial color="#111113" roughness={0.4} metalness={0.85} />
              </mesh>
            )}
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={lanyardWidth}
        />
      </mesh>
    </>
  );
}

useGLTF.preload(cardGLB);
