import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Compass } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ExplorationItem } from "../portfolioData";

interface ExplorationsProps {
  onSelectImage: (item: { imageUrl: string; title: string }) => void;
  explorations: ExplorationItem[];
}

interface PhysicsBody {
  id: string;
  title: string;
  imageUrl: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  angle: number;
  angularVelocity: number;
  isDragging: boolean;
  type: "item" | "badge";
  badgeText?: string;
  badgeBg?: string;
}

export default function Explorations({ onSelectImage, explorations }: ExplorationsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const requestRef = useRef<number | null>(null);
  
  // Track mouse coordinates relative to the sandbox container
  const mouseRef = useRef({ x: 0, y: 0, isActive: false, px: 0, py: 0 });
  const [isFullscreenOn, setIsFullscreenOn] = useState(false);

  // Simulation controls state
  const [gravityType, setGravityType] = useState<"down" | "center" | "none">("none");
  const [magneticMode, setMagneticMode] = useState<boolean>(true);
  const [isFrictionHigh, setIsFrictionHigh] = useState<boolean>(false);
  const [bodies, setBodies] = useState<PhysicsBody[]>([]);

  // Ref container to access bodies in animation frame loop without stale closures
  const bodiesRef = useRef<PhysicsBody[]>([]);
  const dragInfoRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);

  // Initialize bodies position in random grid clusters inside the box
  const initSimulation = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const boxW = rect.width || 1200;
    const boxH = rect.height || 650;

    // Create physics bodies for explorations, plus 2 organic editorial cards to match screenshot texture
    const initialBodies: PhysicsBody[] = [];
    
    // Add exploration items
    explorations.forEach((item, index) => {
      // Stagger positions across the container
      const col = index % 3;
      const row = Math.floor(index / 3);
      const startX = boxW * 0.15 + col * (boxW * 0.25) + (Math.random() - 0.5) * 40;
      const startY = boxH * 0.2 + row * (boxH * 0.25) + (Math.random() - 0.5) * 40;

      // Card sizing: responsive relative scale matching device size
      const isMobile = boxW < 768;
      const itemW = isMobile ? 190 : 330;
      const itemH = isMobile ? 130 : 220;

      initialBodies.push({
        id: item.id,
        title: item.title,
        imageUrl: item.imageUrl,
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * 1.8,
        vy: (Math.random() - 0.5) * 1.8,
        width: itemW,
        height: itemH,
        angle: 0,
        angularVelocity: 0,
        isDragging: false,
        type: "item",
      });
    });

    bodiesRef.current = initialBodies;
    setBodies([...initialBodies]);
  };

  // Re-run on resize and mount
  useEffect(() => {
    initSimulation();
    
    // Set up ResizeObserver for the interactive container
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Adjust positions when resized to keep inside viewport
        const rect = entry.contentRect;
        bodiesRef.current = bodiesRef.current.map((body) => {
          const x = Math.min(Math.max(body.x, body.width / 2), rect.width - body.width / 2);
          const y = Math.min(Math.max(body.y, body.height / 2), rect.height - body.height / 2);
          return { ...body, x, y };
        });
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Dynamically sync explorations when modified in real-time
  useEffect(() => {
    if (!containerRef.current || bodiesRef.current.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const boxW = rect.width || 1200;
    const boxH = rect.height || 650;
    const isMobile = boxW < 768;
    const itemW = isMobile ? 190 : 330;
    const itemH = isMobile ? 130 : 220;

    const currentBodyIds = new Set(bodiesRef.current.filter((b) => b.type === "item").map((b) => b.id));
    const propIds = new Set(explorations.map((item) => item.id));

    // 1. Filter out physically deleted items
    let updatedBodies = bodiesRef.current.filter((b) => b.type !== "item" || propIds.has(b.id));

    // 2. Identify new objects to spawn with random position at the top-mid section
    const newItems = explorations.filter((item) => !currentBodyIds.has(item.id));
    newItems.forEach((item) => {
      const startX = boxW * 0.5 + (Math.random() - 0.5) * 120;
      const startY = boxH * 0.2 + (Math.random() - 0.5) * 60;

      updatedBodies.push({
        id: item.id,
        title: item.title,
        imageUrl: item.imageUrl,
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * 2.4,
        vy: (Math.random() - 0.5) * 2.4,
        width: itemW,
        height: itemH,
        angle: 0,
        angularVelocity: 0,
        isDragging: false,
        type: "item",
      });
    });

    if (newItems.length > 0 || updatedBodies.length !== bodiesRef.current.length) {
      bodiesRef.current = updatedBodies;
      setBodies([...updatedBodies]);
    }
  }, [explorations]);

  // Set up gravity loop
  useEffect(() => {
    const updatePhysics = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const boundsW = rect.width;
      const boundsH = rect.height;

      // Physics variables
      const airResistance = isFrictionHigh ? 0.9 : 0.982;
      const gravityVal = gravityType === "down" ? 0.18 : 0;
      const boundaryBounce = 0.48;

      const updated = bodiesRef.current.map((body) => {
        // Skip default movement if user is actively dragging this card
        if (body.isDragging && dragInfoRef.current?.id === body.id) {
          // Track cursor-guided movement inside coordinate constraints
          const targetX = mouseRef.current.x - (dragInfoRef.current?.offsetX || 0);
          const targetY = mouseRef.current.y - (dragInfoRef.current?.offsetY || 0);
          
          // Smooth follow lerping
          const nextVx = (targetX - body.x) * 0.18;
          const nextVy = (targetY - body.y) * 0.18;

          return {
            ...body,
            vx: nextVx,
            vy: nextVy,
            x: targetX,
            y: targetY,
            angularVelocity: 0,
            angle: 0,
          };
        }

        let vx = body.vx;
        let vy = body.vy;

        // 1. Gravity Vector Forces
        if (gravityType === "down") {
          vy += gravityVal;
        } else if (gravityType === "center") {
          // Gravity pull to center point of layout
          const targetCenterX = boundsW / 2;
          const targetCenterY = boundsH / 2;
          const forceX = (targetCenterX - body.x) * 0.0012;
          const forceY = (targetCenterY - body.y) * 0.0012;
          vx += forceX;
          vy += forceY;
        }

        // 2. Cursor Gravitational Pull (Magnet Flow Simulation)
        if (magneticMode && mouseRef.current.isActive) {
          const dx = mouseRef.current.x - body.x;
          const dy = mouseRef.current.y - body.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Cards get drawn in dynamic swirling wind
          if (distance < 500) {
            const pullStrength = 0.12 * (1 - distance / 500);
            // Gravitational flow pull
            vx += (dx / (distance + 1)) * pullStrength;
            vy += (dy / (distance + 1)) * pullStrength;

            // Swirl / Vortex cross force
            vx += (-dy / (distance + 1)) * pullStrength * 0.25;
            vy += (dx / (distance + 1)) * pullStrength * 0.25;
          }
        }

        // 3. Integrate positions
        vx *= airResistance;
        vy *= airResistance;
        vx = Math.min(Math.max(vx, -7), 7);
        vy = Math.min(Math.max(vy, -7), 7);
        let x = body.x + vx;
        let y = body.y + vy;

        // 4. Keep Rotation at 0 to avoid random spinning
        let angularVelocity = 0;
        let angle = 0;

        // 5. Container boundaries elastic collision
        const marginX = body.width / 2;
        const marginY = body.height / 2;

        if (x < marginX) {
          x = marginX;
          vx = -vx * boundaryBounce;
        } else if (x > boundsW - marginX) {
          x = boundsW - marginX;
          vx = -vx * boundaryBounce;
        }

        if (y < marginY) {
          y = marginY;
          vy = -vy * boundaryBounce;
        } else if (y > boundsH - marginY) {
          y = boundsH - marginY;
          vy = -vy * boundaryBounce;
        }

        return {
          ...body,
          x,
          y,
          vx,
          vy,
          angle,
          angularVelocity,
        };
      });

      // 6. Body-to-Body AABB (Axis-Aligned Bounding Box) overlap resolution with multiple iterations
      // Using multiple solver iterations ensures that stacked cards push each other completely out of overlap.
      for (let iteration = 0; iteration < 1; iteration++) {
        for (let i = 0; i < updated.length; i++) {
          for (let j = i + 1; j < updated.length; j++) {
            const b1 = updated[i];
            const b2 = updated[j];

            const w1 = b1.width;
            const h1 = b1.height;
            const w2 = b2.width;
            const h2 = b2.height;

            // Half-widths and half-heights
            const hW1 = w1 / 2;
            const hH1 = h1 / 2;
            const hW2 = w2 / 2;
            const hH2 = h2 / 2;

            // Difference in centers
            const dx = b2.x - b1.x;
            const dy = b2.y - b1.y;

            // Overlaps along each axis
            const overlapX = (hW1 + hW2) - Math.abs(dx);
            const overlapY = (hH1 + hH2) - Math.abs(dy);

            if (overlapX > 0 && overlapY > 0) {
              // Overlap exists! Displace along the axis of least penetration
              if (overlapX < overlapY) {
                const signX = dx >= 0 ? 1 : -1;
                // Add a small separation buffer to prevent floating point sticking
                const pushX = signX * (overlapX + 0.5) * 0.28;

                  if (!b1.isDragging && !b2.isDragging) {
                  b1.x -= pushX;
                  b2.x += pushX;
                  // Absorb velocity / bounce slightly
                  const relativeVx = b2.vx - b1.vx;
                  b1.vx += relativeVx * 0.05;
                  b2.vx -= relativeVx * 0.05;
                } else if (b1.isDragging) {
                  // b1 is held fixed, push b2 completely
                  b2.x += signX * (overlapX + 0.5);
                  b2.vx = 0;
                } else if (b2.isDragging) {
                  // b2 is held fixed, push b1 completely
                  b1.x -= signX * (overlapX + 0.5);
                  b1.vx = 0;
                }
              } else {
                const signY = dy >= 0 ? 1 : -1;
                // Add a small separation buffer to prevent floating point sticking
                const pushY = signY * (overlapY + 0.5) * 0.28;

                if (!b1.isDragging && !b2.isDragging) {
                  b1.y -= pushY;
                  b2.y += pushY;
                  // Absorb velocity / bounce slightly
                  const relativeVy = b2.vy - b1.vy;
                  b1.vy += relativeVy * 0.05;
                  b2.vy -= relativeVy * 0.05;
                } else if (b1.isDragging) {
                  // b1 is held fixed, push b2 completely
                  b2.y += signY * (overlapY + 0.5);
                  b2.vy = 0;
                } else if (b2.isDragging) {
                  // b2 is held fixed, push b1 completely
                  b1.y -= signY * (overlapY + 0.5);
                  b1.vy = 0;
                }
              }
            }
          }
        }
      }

      // 7. Final Boundary enforcement to clamp all cards inside the container
      for (let i = 0; i < updated.length; i++) {
        const body = updated[i];
        if (body.isDragging) continue;

        const marginX = body.width / 2;
        const marginY = body.height / 2;

        if (body.x < marginX) {
          body.x = marginX;
          body.vx = -body.vx * boundaryBounce;
        } else if (body.x > boundsW - marginX) {
          body.x = boundsW - marginX;
          body.vx = -body.vx * boundaryBounce;
        }

        if (body.y < marginY) {
          body.y = marginY;
          body.vy = -body.vy * boundaryBounce;
        } else if (body.y > boundsH - marginY) {
          body.y = boundsH - marginY;
          body.vy = -body.vy * boundaryBounce;
        }
      }

      bodiesRef.current = updated;
      setBodies(updated);
      requestRef.current = requestAnimationFrame(updatePhysics);
    };

    requestRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gravityType, magneticMode, isFrictionHigh]);

  // Handle pointer tracking
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseRef.current.px = mouseRef.current.x;
    mouseRef.current.py = mouseRef.current.y;
    mouseRef.current.x = x;
    mouseRef.current.y = y;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, bodyId: string) => {
    e.stopPropagation();
    if (!containerRef.current) return;
    
    // Select clicked body
    const bodyIndex = bodiesRef.current.findIndex((b) => b.id === bodyId);
    if (bodyIndex === -1) return;

    const body = bodiesRef.current[bodyIndex];
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Save offset from central pivot to retain fluid grabbability
    dragInfoRef.current = {
      id: bodyId,
      offsetX: clickX - body.x,
      offsetY: clickY - body.y,
    };

    bodiesRef.current = bodiesRef.current.map((b) => 
      b.id === bodyId ? { ...b, isDragging: true, vx: 0, vy: 0 } : b
    );
  };

  const handleGlobalPointerUp = () => {
    if (!dragInfoRef.current) return;

    const draggedId = dragInfoRef.current.id;
    dragInfoRef.current = null;

    // Throw simulation frings cards immediately on release
    bodiesRef.current = bodiesRef.current.map((body) => {
      if (body.id === draggedId) {
        // Calculate fling speed with mouse move history
        const flingVx = (mouseRef.current.x - mouseRef.current.px) * 0.42;
        const flingVy = (mouseRef.current.y - mouseRef.current.py) * 0.42;

        return {
          ...body,
          isDragging: false,
          vx: Math.min(Math.max(flingVx, -8), 8),
          vy: Math.min(Math.max(flingVy, -8), 8),
          angularVelocity: 0,
          angle: 0,
        };
      }
      return body;
    });
  };

  // Disperse / Scatter items from the center
  const triggerExplosion = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    bodiesRef.current = bodiesRef.current.map((body) => {
      // Vector outward directions
      const angle = Math.random() * Math.PI * 2;
      const speed = 5 + Math.random() * 5;
      return {
        ...body,
        x: centerX + Math.cos(angle) * 30,
        y: centerY + Math.sin(angle) * 30,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        angularVelocity: 0,
        angle: 0,
      };
    });
  };

  return (
    <div
      id="explorations"
      onPointerMove={handlePointerMove}
      onPointerUp={handleGlobalPointerUp}
      onPointerLeave={() => { mouseRef.current.isActive = false; }}
      onPointerEnter={() => { mouseRef.current.isActive = true; }}
      className={`relative select-none overflow-hidden bg-transparent text-neutral-950 border-none ${
        isFullscreenOn ? "min-h-screen py-6" : "h-[620px] md:h-[750px]"
      } transition-all duration-500`}
    >
      {/* Dynamic Backglow ambient point */}
      <div className="absolute top-[25%] left-[30%] w-[450px] h-[450px] rounded-full bg-[#FF6A00]/5 blur-[140px] pointer-events-none" />



      {/* Physics Interactive Container bounded box */}
      <div 
        ref={containerRef} 
        className="relative w-full h-full z-10 overflow-hidden"
      >
        {bodies.map((body) => {
          return (
            <div
              key={body.id}
              onPointerDown={(e) => handlePointerDown(e, body.id)}
              style={{
                position: "absolute",
                left: `${body.x}px`,
                top: `${body.y}px`,
                width: `${body.width}px`,
                height: `${body.height}px`,
                transform: `translate3d(-50%, -50%, 0) rotate(${body.angle}deg)`,
                willChange: "transform",
                backfaceVisibility: "hidden",
                cursor: body.isDragging ? "grabbing" : "grab",
                touchAction: "none",
              }}
              className="z-10 group transform-gpu selection:bg-transparent"
            >
              {body.type === "item" ? (
                // Pristine floating uncropped sticker image with generous transparent negative spaces
                <div 
                  onClick={() => {
                    if (Math.abs(body.vx) < 1.2 && Math.abs(body.vy) < 1.2) {
                      onSelectImage({ imageUrl: body.imageUrl, title: body.title });
                    }
                  }}
                  className="w-full h-full overflow-visible flex items-center justify-center relative group/st cursor-pointer"
                >
                  <img
                    src={body.imageUrl}
                    alt={body.title}
                    className="w-full h-full object-contain select-none pointer-events-none transform-gpu transition-transform duration-200 group-hover/st:scale-[1.03] active:scale-95"
                    referrerPolicy="no-referrer"
                    draggable="false"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              ) : (
                // Accent Badge Editorial layout (Screenshot mock cards) - Seamless Light mode
                <div 
                  className={`w-full h-full rounded-2xl border p-4 flex flex-col justify-between shadow-[0_12px_40px_rgba(0,0,0,0.04)] relative overflow-hidden bg-white/95 backdrop-blur-md select-none pointer-events-none ${body.id === "badge-magazine" ? "border-emerald-200/80" : "border-amber-200/80"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-extrabold tracking-widest text-[#FF6A00] uppercase">
                      BOARD ELEMENT
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  
                  <div className="pt-1 select-none">
                    <h4 className="text-[13px] font-sans font-black tracking-tight leading-tight uppercase text-neutral-800">
                      {body.title}
                    </h4>
                    <p className="text-[8px] text-[#FF6A00] font-semibold tracking-wide uppercase mt-0.5">
                      Sukunsh Showcase
                    </p>
                  </div>

                  <div className="flex select-none">
                    <span className={`px-2 py-0.5 rounded text-[7px] font-sans font-black tracking-widest uppercase ${body.badgeBg}`}>
                      {body.badgeText}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Base interactive instructional label */}
      <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-none select-none">
        <div className="flex items-center gap-1.5 bg-white/95 border border-neutral-200 px-3.5 py-2 rounded-full text-neutral-700 text-[9px] uppercase font-bold tracking-widest shadow-md">
          <Compass className="h-3.5 w-3.5 text-neutral-400 animate-spin-slow" />
          <span>Fling or grab cards to float in zero gravity</span>
        </div>
        <span className="text-neutral-400 text-[8.5px] tracking-widest uppercase font-mono">
          Interactive Canvas Engine v2.0
        </span>
      </div>

    </div>
  );
}
