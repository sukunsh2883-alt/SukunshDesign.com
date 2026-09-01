import React, { useEffect, useRef, useState } from 'react';

interface LanyardCardProps {
  portraitImage: string;
}

export default function LanyardCard({ portraitImage }: LanyardCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Physics state stored in refs for silky smooth 60fps interaction
  const state = useRef({
    // Card Position & Velocities
    x: 0,
    y: 0,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,

    // Rotation (degrees) & Angular Velocities
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    vRotX: 0,
    vRotY: 0,
    vRotZ: 0,

    // Dragging state
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    cardStartX: 0,
    cardStartY: 0,
    lastMouseX: 0,
    lastMouseY: 0,
    mouseVx: 0,
    mouseVy: 0,
    pointerId: null as number | null,

    // Hover & Mouse Position
    isHovered: false,
    mouseX: 0,
    mouseY: 0,
    mouseActive: false,

    // Device Tilt (Mobile Gyroscope)
    tiltX: 0,
    tiltY: 0,

    // Time tracking
    time: 0,
  });

  // Verlet Rope Physics Nodes (10 nodes)
  const NUM_NODES = 10;
  const ropeNodes = useRef(
    Array.from({ length: NUM_NODES }, (_, i) => ({
      x: 0,
      y: -240 + (i * 240) / (NUM_NODES - 1),
      prevX: 0,
      prevY: -240 + (i * 240) / (NUM_NODES - 1),
    }))
  );

  const [leftSvgPath, setLeftSvgPath] = useState('');
  const [rightSvgPath, setRightSvgPath] = useState('');
  const [topLoopPath, setTopLoopPath] = useState('');
  const [clipPos, setClipPos] = useState({ x: 0, y: 0, rotZ: 0 });
  const [logoPointsLeft, setLogoPointsLeft] = useState<Array<{ x: number; y: number; angle: number }>>([]);
  const [logoPointsRight, setLogoPointsRight] = useState<Array<{ x: number; y: number; angle: number }>>([]);

  useEffect(() => {
    let animId: number;

    const updatePhysics = () => {
      const s = state.current;
      s.time += 0.016;

      // 1. Ambient Pendulum Sway & Gravity Restoring Forces
      const ambientSwayX = Math.sin(s.time * 1.1) * 5 + Math.cos(s.time * 1.9) * 2.5;
      const ambientSwayY = Math.sin(s.time * 2.2) * 1.2;
      const ambientRotZ = Math.sin(s.time * 1.1) * 2.2;

      // Gravity / Restoring stiffness & damping
      const stiffness = 0.042; // Soft spring pull back to vertical
      const damping = 0.925;   // Soft velocity damping
      const rotStiffness = 0.048;
      const rotDamping = 0.88;

      // Target equilibrium position
      let targetX = ambientSwayX + s.tiltX * 18;
      let targetY = ambientSwayY + s.tiltY * 12;
      let targetZ = s.isHovered ? 20 : 0;

      // Mouse Proximity Attraction (when not dragging)
      if (s.mouseActive && !s.isDragging && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2 + s.x;
        const cardCenterY = rect.top + rect.height / 2 + s.y;

        const dx = s.mouseX - cardCenterX;
        const dy = s.mouseY - cardCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 340) {
          const factor = (1 - dist / 340) * 0.18;
          targetX += dx * factor;
          targetY += dy * factor * 0.5;
        }
      }

      if (!s.isDragging) {
        // Accelerate towards target equilibrium
        const fx = (targetX - s.x) * stiffness;
        const fy = (targetY - s.y) * stiffness;
        const fz = (targetZ - s.z) * stiffness;

        s.vx = (s.vx + fx) * damping;
        s.vy = (s.vy + fy) * damping;
        s.vz = (s.vz + fz) * damping;

        s.x += s.vx;
        s.y += s.vy;
        s.z += s.vz;

        // Rotational Springs (3D tilt derived from motion velocity & sway)
        const targetRotX = -s.vy * 0.85 + Math.sin(s.time * 1.7) * 1.5;
        const targetRotY = s.vx * 1.15 + (s.isHovered ? (s.mouseX - window.innerWidth / 2) * 0.015 : 0);
        const targetRotZ = (s.x / 11) + ambientRotZ;

        s.vRotX = (s.vRotX + (targetRotX - s.rotX) * rotStiffness) * rotDamping;
        s.vRotY = (s.vRotY + (targetRotY - s.rotY) * rotStiffness) * rotDamping;
        s.vRotZ = (s.vRotZ + (targetRotZ - s.rotZ) * rotStiffness) * rotDamping;

        s.rotX += s.vRotX;
        s.rotY += s.vRotY;
        s.rotZ += s.vRotZ;
      }

      // 2. Verlet Rope Physics Simulation for Flexible Lanyard
      const nodes = ropeNodes.current;
      const anchorX = 0;
      const anchorY = -235; // Suspended high above container

      // Node 0 fixed to top anchor
      nodes[0].x = anchorX + Math.sin(s.time * 0.8) * 2;
      nodes[0].y = anchorY;

      // Node N-1 attached to card top center connection point
      const cardClipX = s.x;
      const cardClipY = s.y - 172; // Top hole punch location
      nodes[NUM_NODES - 1].x = cardClipX;
      nodes[NUM_NODES - 1].y = cardClipY;

      // Verlet Update for intermediate rope nodes
      const ropeFriction = 0.94;
      const gravityY = 0.38;

      for (let i = 1; i < NUM_NODES - 1; i++) {
        const node = nodes[i];
        const vx = (node.x - node.prevX) * ropeFriction;
        const vy = (node.y - node.prevY) * ropeFriction;

        node.prevX = node.x;
        node.prevY = node.y;

        node.x += vx;
        node.y += vy + gravityY;
      }

      // Distance constraints relaxation (multiple passes for stiff fabric feel)
      const targetSegLength = 25;
      for (let pass = 0; pass < 6; pass++) {
        for (let i = 0; i < NUM_NODES - 1; i++) {
          const n1 = nodes[i];
          const n2 = nodes[i + 1];

          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
          const diff = (dist - targetSegLength) / dist;

          const mx = dx * diff * 0.5;
          const my = dy * diff * 0.5;

          if (i !== 0) {
            n1.x += mx;
            n1.y += my;
          }
          if (i + 1 !== NUM_NODES - 1) {
            n2.x -= mx;
            n2.y -= my;
          }
        }
      }

      // 3. Render Smooth Dual-Strand Strap Loop Paths
      const leftPts: Array<{ x: number; y: number }> = [];
      const rightPts: Array<{ x: number; y: number }> = [];

      for (let i = 0; i < NUM_NODES; i++) {
        const pPrev = nodes[Math.max(0, i - 1)];
        const pNext = nodes[Math.min(NUM_NODES - 1, i + 1)];
        const dx = pNext.x - pPrev.x;
        const dy = pNext.y - pPrev.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;

        const t = i / (NUM_NODES - 1);
        // Strap spread decreases from top loop down to connector clip
        const spread = 20 * Math.pow(1 - t, 0.8) + 3;

        leftPts.push({ x: nodes[i].x - nx * spread, y: nodes[i].y - ny * spread });
        rightPts.push({ x: nodes[i].x + nx * spread, y: nodes[i].y + ny * spread });
      }

      // Build SVG Quad Curves for Left and Right Strands
      let leftPath = `M ${leftPts[0].x} ${leftPts[0].y}`;
      let rightPath = `M ${rightPts[0].x} ${rightPts[0].y}`;

      for (let i = 1; i < NUM_NODES - 1; i++) {
        const leftXc = (leftPts[i].x + leftPts[i + 1].x) / 2;
        const leftYc = (leftPts[i].y + leftPts[i + 1].y) / 2;
        leftPath += ` Q ${leftPts[i].x} ${leftPts[i].y}, ${leftXc} ${leftYc}`;

        const rightXc = (rightPts[i].x + rightPts[i + 1].x) / 2;
        const rightYc = (rightPts[i].y + rightPts[i + 1].y) / 2;
        rightPath += ` Q ${rightPts[i].x} ${rightPts[i].y}, ${rightXc} ${rightYc}`;
      }

      leftPath += ` L ${leftPts[NUM_NODES - 1].x} ${leftPts[NUM_NODES - 1].y}`;
      rightPath += ` L ${rightPts[NUM_NODES - 1].x} ${rightPts[NUM_NODES - 1].y}`;

      // Top Connecting Loop Arc
      const topLoop = `M ${leftPts[0].x} ${leftPts[0].y} C ${leftPts[0].x - 4} ${leftPts[0].y - 22}, ${rightPts[0].x + 4} ${rightPts[0].y - 22}, ${rightPts[0].x} ${rightPts[0].y}`;

      setLeftSvgPath(leftPath);
      setRightSvgPath(rightPath);
      setTopLoopPath(topLoop);

      // Compute Clip Rotation angle from final node segment
      const lastNode = nodes[NUM_NODES - 1];
      const prevNode = nodes[NUM_NODES - 2];
      const clipAngle = (Math.atan2(lastNode.x - prevNode.x, lastNode.y - prevNode.y) * -180) / Math.PI;
      setClipPos({ x: cardClipX, y: cardClipY, rotZ: clipAngle });

      // Compute coordinates & angles for printed white logos along left and right strands
      const logosL: Array<{ x: number; y: number; angle: number }> = [];
      const logosR: Array<{ x: number; y: number; angle: number }> = [];

      for (let i = 1; i < NUM_NODES - 1; i += 2) {
        const p1L = leftPts[i];
        const p2L = leftPts[i + 1];
        const angleL = (Math.atan2(p2L.y - p1L.y, p2L.x - p1L.x) * 180) / Math.PI + 90;
        logosL.push({ x: (p1L.x + p2L.x) / 2, y: (p1L.y + p2L.y) / 2, angle: angleL });

        const p1R = rightPts[i];
        const p2R = rightPts[i + 1];
        const angleR = (Math.atan2(p2R.y - p1R.y, p2R.x - p1R.x) * 180) / Math.PI + 90;
        logosR.push({ x: (p1R.x + p2R.x) / 2, y: (p1R.y + p2R.y) / 2, angle: angleR });
      }
      setLogoPointsLeft(logosL);
      setLogoPointsRight(logosR);

      // 4. Update DOM Transforms directly for smooth performance
      if (cardRef.current) {
        const shadowX = -s.rotY * 1.3;
        const shadowY = 28 + Math.abs(s.rotX) * 1.6 + (s.z * 0.7);
        const shadowBlur = 48 + s.z * 0.8;
        const shadowOpacity = Math.max(0.05, 0.12 - s.z * 0.001);

        cardRef.current.style.transform = `
          translate3d(${s.x}px, ${s.y}px, ${s.z}px)
          rotateX(${s.rotX}deg)
          rotateY(${s.rotY}deg)
          rotateZ(${s.rotZ}deg)
        `;

        cardRef.current.style.boxShadow = `
          ${shadowX}px ${shadowY}px ${shadowBlur}px -12px rgba(0, 0, 0, ${shadowOpacity})
        `;
      }

      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Pointer event handlers for Mouse & Touch Dragging
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const s = state.current;
      s.mouseX = e.clientX;
      s.mouseY = e.clientY;
      s.mouseActive = true;

      if (s.isDragging) {
        const dx = e.clientX - s.dragStartX;
        const dy = e.clientY - s.dragStartY;

        s.mouseVx = e.clientX - s.lastMouseX;
        s.mouseVy = e.clientY - s.lastMouseY;
        s.lastMouseX = e.clientX;
        s.lastMouseY = e.clientY;

        s.x = s.cardStartX + dx;
        s.y = s.cardStartY + dy;

        s.rotX = Math.max(-25, Math.min(25, -s.mouseVy * 1.8));
        s.rotY = Math.max(-30, Math.min(30, s.mouseVx * 2.2));
        s.rotZ = Math.max(-20, Math.min(20, (s.x / 10) + s.mouseVx * 0.8));
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      const s = state.current;
      if (s.isDragging) {
        s.isDragging = false;

        // Transfer release inertia to card springs
        s.vx = Math.max(-26, Math.min(26, s.mouseVx * 0.85));
        s.vy = Math.max(-26, Math.min(26, s.mouseVy * 0.85));

        s.vRotX = Math.max(-14, Math.min(14, -s.mouseVy * 0.9));
        s.vRotY = Math.max(-18, Math.min(18, s.mouseVx * 1.2));
        s.vRotZ = Math.max(-12, Math.min(12, s.mouseVx * 0.5));

        if (s.pointerId !== null && cardRef.current && 'releasePointerCapture' in cardRef.current) {
          try {
            cardRef.current.releasePointerCapture(s.pointerId);
          } catch {}
        }
        s.pointerId = null;
      }
    };

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        state.current.tiltX = Math.max(-1, Math.min(1, e.gamma / 30));
        state.current.tiltY = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
      }
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const s = state.current;
    s.isDragging = true;
    s.dragStartX = e.clientX;
    s.dragStartY = e.clientY;
    s.cardStartX = s.x;
    s.cardStartY = s.y;
    s.lastMouseX = e.clientX;
    s.lastMouseY = e.clientY;
    s.mouseVx = 0;
    s.mouseVy = 0;
    s.pointerId = e.pointerId;

    if ('setPointerCapture' in e.currentTarget) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex h-[620px] min-h-[70vh] w-full max-w-[440px] items-center justify-center select-none touch-none overflow-visible py-6"
      onPointerEnter={() => {
        state.current.isHovered = true;
      }}
      onPointerLeave={() => {
        state.current.isHovered = false;
        state.current.mouseActive = false;
      }}
    >
      {/* Dynamic SVG Canvas for Flexible Black Lanyard Strap & Connector Clip */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible z-10"
        style={{ filter: 'drop-shadow(0px 6px 10px rgba(0,0,0,0.22))' }}
      >
        <defs>
          {/* Black Woven Fabric Gradient */}
          <linearGradient id="blackFabricGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#09090b" />
            <stop offset="30%" stopColor="#18181b" />
            <stop offset="50%" stopColor="#27272a" />
            <stop offset="70%" stopColor="#18181b" />
            <stop offset="100%" stopColor="#09090b" />
          </linearGradient>

          {/* Black Matte Clip Metallic Gradient */}
          <linearGradient id="blackMatteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3f3f46" />
            <stop offset="40%" stopColor="#18181b" />
            <stop offset="80%" stopColor="#09090b" />
            <stop offset="100%" stopColor="#18181b" />
          </linearGradient>

          {/* White Printed Logo Symbol Template */}
          <g id="whiteLogoSymbol">
            <circle cx="0" cy="0" r="1.8" fill="#ffffff" fillOpacity="0.9" />
            <path d="M 0,-3.5 L 0,3.5 M -3.5,0 L 3.5,0" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.85" />
            <polygon points="0,-2.5 2.5,0 0,2.5 -2.5,0" fill="none" stroke="#ffffff" strokeWidth="0.6" strokeOpacity="0.8" />
          </g>
        </defs>

        {/* Center alignment offset: viewBox centered at container middle */}
        <g transform="translate(220, 260)">
          {/* Top Connecting Arch Loop connecting Left and Right Strands */}
          <path
            d={topLoopPath}
            fill="none"
            stroke="url(#blackFabricGrad)"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Left Strand Base Shadow */}
          <path
            d={leftSvgPath}
            fill="none"
            stroke="#000000"
            strokeWidth="15"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.35"
          />
          {/* Right Strand Base Shadow */}
          <path
            d={rightSvgPath}
            fill="none"
            stroke="#000000"
            strokeWidth="15"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.35"
          />

          {/* Left Main Woven Fabric Strap */}
          <path
            d={leftSvgPath}
            fill="none"
            stroke="url(#blackFabricGrad)"
            strokeWidth="13"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right Main Woven Fabric Strap */}
          <path
            d={rightSvgPath}
            fill="none"
            stroke="url(#blackFabricGrad)"
            strokeWidth="13"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Fine Ribbed Woven Texture Edge Highlights */}
          <path
            d={leftSvgPath}
            fill="none"
            stroke="#52525b"
            strokeWidth="0.9"
            strokeDasharray="2 3"
            strokeOpacity="0.35"
          />
          <path
            d={rightSvgPath}
            fill="none"
            stroke="#52525b"
            strokeWidth="0.9"
            strokeDasharray="2 3"
            strokeOpacity="0.35"
          />

          {/* Small Repeated White Logo/Symbol Marks printed on Left and Right Strands */}
          {logoPointsLeft.map((pt, idx) => (
            <use
              key={`left-${idx}`}
              href="#whiteLogoSymbol"
              transform={`translate(${pt.x}, ${pt.y}) rotate(${pt.angle}) scale(1.1)`}
            />
          ))}
          {logoPointsRight.map((pt, idx) => (
            <use
              key={`right-${idx}`}
              href="#whiteLogoSymbol"
              transform={`translate(${pt.x}, ${pt.y}) rotate(${pt.angle}) scale(1.1)`}
            />
          ))}

          {/* Black Matte Connector Clip Assembly at bottom where straps join */}
          <g transform={`translate(${clipPos.x}, ${clipPos.y}) rotate(${clipPos.rotZ})`}>
            {/* Upper Fabric Strap Clamp Housing */}
            <rect
              x="-9"
              y="-13"
              width="18"
              height="9"
              rx="2.5"
              fill="url(#blackMatteGrad)"
              stroke="#52525b"
              strokeWidth="0.6"
            />
            {/* Clamp Rivet Dots */}
            <circle cx="-4" cy="-8.5" r="1.1" fill="#71717a" />
            <circle cx="4" cy="-8.5" r="1.1" fill="#71717a" />

            {/* Black Matte Connector Block */}
            <rect
              x="-7"
              y="-4"
              width="14"
              height="13"
              rx="3"
              fill="url(#blackMatteGrad)"
              stroke="#3f3f46"
              strokeWidth="0.8"
            />

            {/* Metallic Clasp Release Notch */}
            <rect x="-4.5" y="-1" width="9" height="2" fill="#71717a" rx="0.5" />

            {/* Swivel Loop Ring */}
            <ellipse cx="0" cy="12" rx="6" ry="4.5" fill="none" stroke="url(#blackMatteGrad)" strokeWidth="2.5" />

            {/* Short Black Hook/Loop connecting to plastic card punch hole */}
            <path
              d="M -3.5,12 Q 0,19 -3.5,23 L 3.5,23 Q 0,19 3.5,12 Z"
              fill="#18181b"
              stroke="#3f3f46"
              strokeWidth="0.8"
            />
          </g>
        </g>
      </svg>

      {/* Hanging Interactive ID Card Component */}
      <div
        ref={cardRef}
        onPointerDown={handlePointerDown}
        className="relative z-20 cursor-grab active:cursor-grabbing will-change-transform"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1200px',
        }}
      >
        {/* Clear Plastic Badge Sleeve Header Tab with Oval Hole Punch */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none">
          <div className="h-6 w-12 rounded-t-lg border border-neutral-300/80 bg-white/85 backdrop-blur-xs shadow-xs flex items-center justify-center">
            {/* Oval Hole Punch Slot */}
            <div className="h-2 w-5.5 rounded-full border border-neutral-400 bg-neutral-900/20 shadow-inner flex items-center justify-center">
              <div className="h-1 w-3.5 rounded-full bg-neutral-950/40" />
            </div>
          </div>
        </div>

        {/* Solid Polycarbonate ID Card with Smooth 38px Rounded Corners */}
        <div className="relative w-[320px] sm:w-[340px] overflow-hidden rounded-[38px] border-[1.5px] border-neutral-200/90 bg-white p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12),0_4px_16px_rgba(0,0,0,0.04)] ring-1 ring-black/5 transition-all duration-300 hover:border-neutral-300">
          {/* Subtle glossy card reflection highlight */}
          <div className="pointer-events-none absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 transition-opacity duration-500 hover:opacity-100" />

          {/* Portrait Image with Grayscale to Color hover transition */}
          <div className="w-full aspect-[4/5] overflow-hidden rounded-[28px] bg-neutral-100 border border-neutral-200/60 shadow-inner group">
            <img
              src={portraitImage}
              alt="SUKANSH Portrait"
              className="w-full h-full object-cover filter grayscale contrast-105 rounded-[28px] transition-all duration-700 group-hover:grayscale-0 group-hover:scale-[1.03]"
              draggable={false}
            />
          </div>

          {/* Card Footer: Typography & Status Indicator */}
          <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3.5">
            <div>
              <div className="font-sans font-bold tracking-[0.2em] text-sm text-neutral-950 uppercase">
                SUKANSH
              </div>
              <div className="text-[11px] font-mono tracking-wider text-neutral-500 uppercase mt-0.5">
                Visual Designer • IDC IIT Bombay
              </div>
            </div>
            {/* Green pulsing indicator dot */}
            <div
              className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"
              title="Available for work"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

