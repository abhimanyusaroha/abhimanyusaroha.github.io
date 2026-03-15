import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

export default function PreFooterMarquee() {
    const sectionRef = useRef(null);
    const trackRef = useRef(null);
    const sentenceRef = useRef(null);

    useEffect(() => {
        // Skip on mobile
        if (window.innerWidth < 768) return;

        const slSection = sectionRef.current;
        const slTrack = trackRef.current;
        const slSentence = sentenceRef.current;

        if (!slSection || !slTrack || !slSentence) return;

        const typeSplit = new SplitType(slSentence, {
            types: "words, chars",
            tagName: "span",
        });

        const chars = Array.from(slSentence.querySelectorAll(".char"));

        // Measure travel distance
        const trackWidth = slTrack.scrollWidth;
        const viewW = window.innerWidth;

        // Text starts fully off the right edge, exits fully off the left
        const startX = viewW * 1.05;
        const endX = -(trackWidth - viewW * 0.1);
        const totalTravel = Math.abs(endX - startX);

        // Set section height to exact travel distance — zero dead scroll
        const scrollDistance = totalTravel * 0.95;
        slSection.style.height = `calc(100vh + ${scrollDistance}px)`;

        // Position track at start (off right edge)
        gsap.set(slTrack, { x: startX });

        // ─── STEP 3: Per-character tilt and squash ────────────────
        chars.forEach((char, i) => {
            const tilt = i % 2 === 0 ? -6 : 6;
            const squash = i % 3 === 0 ? 0.75 : 0.88;

            gsap.set(char, {
                y: 120,
                opacity: 0,
                rotation: tilt,
                scaleY: squash,
                transformOrigin: "bottom center",
            });
        });

        // ─── MAIN TIMELINE ────────────────────────────────────────
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: slSection,
                start: "top top",
                end: () => `+=${scrollDistance}`,
                scrub: 3,
                pin: false,
                invalidateOnRefresh: true,
            },
        });

        // 1. Slide entire track from right to left
        tl.to(
            slTrack,
            {
                x: endX,
                ease: "none",
                duration: 1,
            },
            0
        );

        // ─── STEP 2: Fixed stagger so every letter completes ──────
        const STAGGER_WINDOW = 0.62;
        const CHAR_DURATION = 0.38;
        const staggerEach = STAGGER_WINDOW / Math.max(chars.length - 1, 1);

        tl.to(
            chars,
            {
                y: 0,
                opacity: 1,
                rotation: 0,
                scaleY: 1,
                ease: "elastic.out(1.2, 0.45)",
                stagger: {
                    each: staggerEach,
                    from: "start",
                },
                duration: CHAR_DURATION,
                onComplete: () => {
                    gsap.set(chars, { clearProps: "transform,opacity" });
                },
            },
            0
        );

        // ─── CLEANUP ──────────────────────────────────────────────
        return () => {
            ScrollTrigger.getAll().forEach((st) => {
                if (st.vars?.trigger === slSection) st.kill();
            });
            tl.kill();
            typeSplit.revert();
        };
    }, []);

    return (
        <section ref={sectionRef} className="sl-section">
            <div className="sl-sticky">
                <div ref={trackRef} className="sl-track">
                    <p ref={sentenceRef} className="sl-sentence">
                        PIXELS WITH PURPOSE. SYSTEMS WITH LOGIC. PRODUCTS THAT SHIP.
                    </p>
                </div>
            </div>
        </section>
    );
}
