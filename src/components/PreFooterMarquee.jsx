import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SENTENCE = "PIXELS WITH PURPOSE. SYSTEMS WITH LOGIC. PRODUCTS THAT SHIP.";
const ST_ID = "prefooter-letter-scroll";

export default function PreFooterMarquee() {
    const sectionRef = useRef(null);
    const innerRef = useRef(null);
    const trackRef = useRef(null);
    const textRef = useRef(null);
    const charsRef = useRef([]);
    const shapesRef = useRef([]);
    const tlRef = useRef(null);
    const shapeTweensRef = useRef([]);

    // ── Build character spans ──────────────────────────────────
    const chars = SENTENCE.split("").map((c, i) => (
        <span
            key={i}
            ref={(el) => (charsRef.current[i] = el)}
            className="pf-char"
        >
            {c === " " ? "\u00A0" : c}
        </span>
    ));

    // ── Setup function (runs on mount & resize) ───────────────
    const setup = useCallback(() => {
        const section = sectionRef.current;
        const inner = innerRef.current;
        const track = trackRef.current;
        const charEls = charsRef.current.filter(Boolean);

        if (!section || !inner || !track || charEls.length === 0) return;

        // ── Reduced motion check ──────────────────────────────
        const prefersReduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReduced) {
            section.style.height = "auto";
            gsap.set(track, { x: 0 });
            gsap.set(charEls, { clearProps: "all" });
            section.classList.add("pf-reduced");
            return;
        }

        section.classList.remove("pf-reduced");

        // ── Mobile check ──────────────────────────────────────
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            section.style.height = "auto";
            gsap.set(track, { x: 0 });
            gsap.set(charEls, { clearProps: "all" });
            return;
        }

        // ── Measurements ──────────────────────────────────────
        const viewW = window.innerWidth;
        const trackWidth = track.scrollWidth;
        const startX = viewW;
        const endX = -trackWidth;
        const travel = Math.abs(endX - startX);

        // Section height = 1 viewport (for pin) + travel distance
        section.style.height = `${travel}px`;

        // Initial position: off-screen right
        gsap.set(track, { x: startX });

        // ── Initial char state ────────────────────────────────
        charEls.forEach((char) => {
            gsap.set(char, {
                opacity: 0.18,
                yPercent: 14,
                xPercent: 6,
                skewX: 8,
                filter: "blur(6px)",
                willChange: "transform, opacity, filter",
            });
        });

        // ── Main timeline ─────────────────────────────────────
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${travel}`,
                scrub: 1,
                pin: true,
                pinSpacing: true,
                id: ST_ID,
                invalidateOnRefresh: true,
                anticipatePin: 1,
            },
        });

        // 1. Horizontal slide
        tl.to(
            track,
            {
                x: endX,
                ease: "none",
                duration: 1,
            },
            0
        );

        // 2. Letter-level reveal (staggered)
        const STAGGER_WINDOW = 0.70;
        const CHAR_DURATION = 0.30;
        const staggerEach = STAGGER_WINDOW / Math.max(charEls.length - 1, 1);

        tl.to(
            charEls,
            {
                opacity: 1,
                yPercent: 0,
                xPercent: 0,
                skewX: 0,
                filter: "blur(0px)",
                ease: "power2.out",
                stagger: {
                    each: staggerEach,
                    from: "start",
                },
                duration: CHAR_DURATION,
            },
            0.02 // tiny entry buffer
        );

        tlRef.current = tl;

        // ── Floating shapes animation ─────────────────────────
        const shapeEls = shapesRef.current.filter(Boolean);
        const tweens = [];

        shapeEls.forEach((shape, i) => {
            const yRange = 6 + Math.random() * 12;
            const rotRange = 6;
            const dur = 6 + Math.random() * 8;

            const t1 = gsap.to(shape, {
                y: `+=${yRange}`,
                rotation: rotRange * (i % 2 === 0 ? 1 : -1),
                duration: dur,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
            });

            const t2 = gsap.to(shape, {
                opacity: 0.04 + Math.random() * 0.06,
                duration: dur * 0.7,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
            });

            tweens.push(t1, t2);
        });

        shapeTweensRef.current = tweens;

    }, []);

    // ── Lifecycle ─────────────────────────────────────────────
    useEffect(() => {
        // Kill previous instance if any
        ScrollTrigger.getById(ST_ID)?.kill();
        tlRef.current?.kill();
        shapeTweensRef.current.forEach((t) => t.kill());

        // Small delay to let DOM paint
        const raf = requestAnimationFrame(() => {
            setup();
        });

        // ── ResizeObserver for recalc ─────────────────────────
        let resizeTimeout;
        const ro = new ResizeObserver(() => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                ScrollTrigger.getById(ST_ID)?.kill();
                tlRef.current?.kill();
                shapeTweensRef.current.forEach((t) => t.kill());
                setup();
            }, 200);
        });

        if (sectionRef.current) ro.observe(sectionRef.current);

        // ── Cleanup ───────────────────────────────────────────
        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(resizeTimeout);
            ro.disconnect();
            ScrollTrigger.getById(ST_ID)?.kill();
            tlRef.current?.kill();
            shapeTweensRef.current.forEach((t) => t.kill());
            gsap.killTweensOf(charsRef.current.filter(Boolean));
            gsap.killTweensOf(shapesRef.current.filter(Boolean));
        };
    }, [setup]);

    return (
        <section
            ref={sectionRef}
            className="pf-marquee"
            aria-label="Pre-footer statement: Pixels with purpose. Systems with logic. Products that ship."
        >
            <div ref={innerRef} className="pf-inner">
                {/* Floating background shapes */}
                <div className="pf-shapes" aria-hidden="true">
                    <div
                        ref={(el) => (shapesRef.current[0] = el)}
                        className="pf-shape pf-shape-1"
                    />
                    <div
                        ref={(el) => (shapesRef.current[1] = el)}
                        className="pf-shape pf-shape-2"
                    />
                    <div
                        ref={(el) => (shapesRef.current[2] = el)}
                        className="pf-shape pf-shape-3"
                    />
                    <div
                        ref={(el) => (shapesRef.current[3] = el)}
                        className="pf-shape pf-shape-4"
                    />
                    <div
                        ref={(el) => (shapesRef.current[4] = el)}
                        className="pf-shape pf-shape-5"
                    />
                </div>

                {/* Track with text */}
                <div ref={trackRef} className="pf-track">
                    <h2
                        ref={textRef}
                        className="pf-text"
                        aria-hidden="true"
                    >
                        {chars}
                    </h2>
                </div>
            </div>
        </section>
    );
}
