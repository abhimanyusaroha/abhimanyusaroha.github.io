import React, { useEffect, useRef } from 'react';

/**
 * GlowGridCanvas
 * A minimal animated background: subtle dot grid + floating glow nodes.
 * Inspired by OpenAI, Vercel, and Linear's hero aesthetics.
 * - Faint grid of tiny dots for structure
 * - A handful of larger soft-glow nodes that slowly orbit the center
 * - Mouse proximity gently repels nearby nodes
 */
const NeuralCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let rafId;

        // ─── CONFIG ──────────────────────────────────────────────────────────
        const GRID_SPACING = 48;         // Spacing between grid dots
        const GRID_DOT_RADIUS = 1.0;     // Tiny grid dots
        const GRID_COLOR = 'rgba(160, 150, 200, 0.18)'; // Very faint soft purple

        const NODE_COUNT = 22;           // Few, premium - not dense
        const NODE_MIN_R = 2.5;
        const NODE_MAX_R = 5.0;
        // Radial layout params: nodes sit in a ring that avoids the dead center
        const INNER_RADIUS_RATIO = 0.18; // Push nodes away from dead center
        const OUTER_RADIUS_RATIO = 0.46; // Keep them in the mid-background

        const NODE_COLOR = '180, 160, 230'; // Soft purple-grey in RGB
        const NODE_SPEED = 0.18;          // Very slow drift

        const MOUSE_RADIUS = 160;
        const MOUSE_FORCE = 0.08;
        // ─────────────────────────────────────────────────────────────────────

        let nodes = [];
        let mouse = { x: -9999, y: -9999 };

        const resize = () => {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
            initNodes();
        };

        const onMouseMove = (e) => {
            const r = canvas.getBoundingClientRect();
            mouse.x = e.clientX - r.left;
            mouse.y = e.clientY - r.top;
        };
        const onMouseLeave = () => { mouse.x = -9999; mouse.y = -9999; };

        class Node {
            constructor() {
                this.reset();
            }
            reset() {
                const cx = canvas.width / 2;
                const cy = canvas.height / 2;
                const minR = Math.min(canvas.width, canvas.height) * INNER_RADIUS_RATIO;
                const maxR = Math.min(canvas.width, canvas.height) * OUTER_RADIUS_RATIO;
                const angle = Math.random() * Math.PI * 2;
                const radius = minR + Math.random() * (maxR - minR);
                this.x = cx + Math.cos(angle) * radius;
                this.y = cy + Math.sin(angle) * radius;
                this.r = NODE_MIN_R + Math.random() * (NODE_MAX_R - NODE_MIN_R);
                const speed = NODE_SPEED * (0.5 + Math.random());
                const dir = Math.random() * Math.PI * 2;
                this.vx = Math.cos(dir) * speed;
                this.vy = Math.sin(dir) * speed;
                // Pulse phase for soft breathing opacity
                this.phase = Math.random() * Math.PI * 2;
                this.phaseSpeed = 0.004 + Math.random() * 0.008;
                this.baseOpacity = 0.3 + Math.random() * 0.35;
            }

            update() {
                // Gentle drift
                this.x += this.vx;
                this.y += this.vy;
                this.phase += this.phaseSpeed;

                // Soft boundary bounce inside hero — keep nodes in the central area
                const cx = canvas.width / 2;
                const cy = canvas.height / 2;
                const maxDist = Math.min(canvas.width, canvas.height) * OUTER_RADIUS_RATIO + 40;
                const dx0 = this.x - cx;
                const dy0 = this.y - cy;
                const dist0 = Math.sqrt(dx0 * dx0 + dy0 * dy0);
                if (dist0 > maxDist) {
                    // Nudge back toward center gently
                    this.vx -= (dx0 / dist0) * 0.015;
                    this.vy -= (dy0 / dist0) * 0.015;
                }

                // Mouse repulsion
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const distSq = dx * dx + dy * dy;
                if (distSq < MOUSE_RADIUS * MOUSE_RADIUS && distSq > 0.01) {
                    const dist = Math.sqrt(distSq);
                    const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                    this.vx += (dx / dist) * force * MOUSE_FORCE;
                    this.vy += (dy / dist) * force * MOUSE_FORCE;
                }

                // Speed cap + friction so nothing flies off
                const spd = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                const maxSpd = 0.8;
                if (spd > maxSpd) {
                    this.vx = (this.vx / spd) * maxSpd;
                    this.vy = (this.vy / spd) * maxSpd;
                }
                this.vx *= 0.995;
                this.vy *= 0.995;
            }

            draw() {
                const opacity = this.baseOpacity + 0.2 * Math.sin(this.phase);

                // Outer soft glow (very large, very transparent)
                const glowGrad = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.r * 8
                );
                glowGrad.addColorStop(0, `rgba(${NODE_COLOR}, ${opacity * 0.18})`);
                glowGrad.addColorStop(1, `rgba(${NODE_COLOR}, 0)`);
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r * 8, 0, Math.PI * 2);
                ctx.fillStyle = glowGrad;
                ctx.fill();

                // Crisp core dot
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${NODE_COLOR}, ${opacity * 0.85})`;
                ctx.fill();
            }
        }

        const initNodes = () => {
            nodes = [];
            for (let i = 0; i < NODE_COUNT; i++) {
                nodes.push(new Node());
            }
        };

        const drawGrid = () => {
            const w = canvas.width;
            const h = canvas.height;
            // Offset so grid aligns to a neat pattern from the center
            const offX = (w / 2) % GRID_SPACING;
            const offY = (h / 2) % GRID_SPACING;

            ctx.fillStyle = GRID_COLOR;
            for (let x = offX; x < w; x += GRID_SPACING) {
                for (let y = offY; y < h; y += GRID_SPACING) {
                    ctx.beginPath();
                    ctx.arc(x, y, GRID_DOT_RADIUS, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGrid();
            nodes.forEach(n => { n.update(); n.draw(); });
            rafId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        canvas.addEventListener('mousemove', onMouseMove);
        canvas.addEventListener('mouseleave', onMouseLeave);
        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            canvas.removeEventListener('mousemove', onMouseMove);
            canvas.removeEventListener('mouseleave', onMouseLeave);
            cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0, left: 0,
                width: '100%', height: '100%',
                zIndex: 0,
                pointerEvents: 'auto',
            }}
        />
    );
};

export default NeuralCanvas;
