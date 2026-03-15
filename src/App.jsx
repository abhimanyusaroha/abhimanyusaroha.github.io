import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import './index.css';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [openFaq, setOpenFaq] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Cursor logic
    const dot = document.getElementById('cur-dot');
    const ring = document.getElementById('cur-ring');
    let mx = -300, my = -300;
    let rx = -300, ry = -300;
    let reqId;

    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    document.addEventListener('mousemove', onMove);

    const loop = () => {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      if (dot && ring) {
        dot.style.left = mx + 'px';
        dot.style.top = my + 'px';
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
      }
      reqId = requestAnimationFrame(loop);
    };
    reqId = requestAnimationFrame(loop);

    // Scroll reveal logic
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.reveal').forEach(el => io.observe(el));

    // Nav tint logic
    const navEl = document.getElementById('nav');
    const onScroll = () => {
      if (navEl) {
        navEl.style.background = window.scrollY > 20 ? 'var(--nav-bg)' : 'var(--nav-bg)';
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // ─── Lenis smooth scroll ──────────────────────────────────────────────
    const lenis = new Lenis({
      duration: 1.8,           // How long the inertia scroll lasts (seconds)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo ease-out
      smooth: true,
      smoothTouch: false,      // Keep native touch on mobile
      touchMultiplier: 2,
    });

    // Hook Lenis into requestAnimationFrame
    let lenisRafId;
    const lenisRaf = (time) => {
      lenis.raf(time);
      lenisRafId = requestAnimationFrame(lenisRaf);
    };
    lenisRafId = requestAnimationFrame(lenisRaf);

    // Intercept anchor clicks and use Lenis.scrollTo
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { duration: 2.0, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    };

    document.addEventListener('click', handleAnchorClick);
    // ─────────────────────────────────────────────────────────────────────

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(reqId);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('click', handleAnchorClick);
      cancelAnimationFrame(lenisRafId);
      lenis.destroy();
      io.disconnect();
    };
  }, []);

  // Hover classes for cursor
  useEffect(() => {
    const handleMouseEnter = (e) => {
      if (!e.target.matches('.proj-split, .proj-split *')) {
        document.body.classList.add('c-hover');
      }
    };
    const handleMouseLeave = () => document.body.classList.remove('c-hover');

    const handleProjEnter = () => {
      document.body.classList.remove('c-hover');
      document.body.classList.add('c-view');
    };
    const handleProjLeave = () => document.body.classList.remove('c-view');

    const hoverEls = document.querySelectorAll('a, button, .svc-row, .tc, .astat, .faq-item, .chip, .photo-box');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    const projEls = document.querySelectorAll('.proj-split, .play-card');
    projEls.forEach(el => {
      el.addEventListener('mouseenter', handleProjEnter);
      el.addEventListener('mouseleave', handleProjLeave);
    });

    return () => {
      hoverEls.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      projEls.forEach(el => {
        el.removeEventListener('mouseenter', handleProjEnter);
        el.removeEventListener('mouseleave', handleProjLeave);
      });
    };
  }, []);



  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      {/* WELCOME ANIMATION */}
      <div id="welcome">
        <div id="welcome-text">ABHIMANYU SAROHA</div>
        <div id="welcome-line"></div>
      </div>

      {/* CURSOR */}
      <div id="cur-dot"></div>
      <div id="cur-ring"><span id="cur-label">VIEW</span></div>

      {/* NAV */}
      <nav id="nav">
        <a className="nav-logo" href="#">ABHIMANYU <em>SAROHA</em></a>

        {/* Desktop Links */}
        <ul className="nav-links">
          <li><a href="#works">Works</a></li>
          <li><a href="#experience">Experience</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="https://drive.google.com/file/d/14hs7C0MBlUkLx9UE76gZtUHloqJWA8zL/view?usp=sharing" target="_blank" rel="noopener noreferrer">RÉSUMÉ <span className="nav-resume-icon">↗</span></a></li>
        </ul>

        <div className="nav-right">
          <ThemeToggle />
          <div className="avail"><div className="avail-dot"></div>Available for work</div>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span className={`bar ${menuOpen ? 'open' : ''}`}></span>
            <span className={`bar ${menuOpen ? 'open' : ''}`}></span>
          </button>
        </div>
      </nav>

      {/* MOBILE NAV OVERLAY */}
      <div className={`mobile-nav-overlay ${menuOpen ? 'active' : ''}`}>
        <button className="close-menu" onClick={() => setMenuOpen(false)}>✕</button>
        <ul className="mobile-nav-links">
          <li><a href="#works" onClick={() => setMenuOpen(false)}>Works</a></li>
          <li><a href="#experience" onClick={() => setMenuOpen(false)}>Experience</a></li>
          <li><a href="#about" onClick={() => setMenuOpen(false)}>About</a></li>
          <li><a href="#services" onClick={() => setMenuOpen(false)}>Services</a></li>
          <li><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a></li>
          <li><a href="https://drive.google.com/file/d/14hs7C0MBlUkLx9UE76gZtUHloqJWA8zL/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="mobile-resume-link">RÉSUMÉ <span className="nav-resume-icon">↗</span></a></li>
        </ul>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-meta-row">
          <span className="hero-meta">Product Designer · India · 2026</span>
          <span className="hero-meta">001 / Intro</span>
        </div>

        <div className="hero-hl-block">
          <div className="hl-top">
            <span className="star-icon">✻</span>
            <span className="hl-line1">PIXELS</span>
          </div>
          <div className="hl-middle-left">
            <p className="hl-intro">
              Hi, I'm Abhimanyu. I design products that ship fast because I don't work like it's 2020 anymore.
              <br /><span style={{ color: 'var(--muted)' }}>Faster than your last agency. Cheaper than your next hire.</span>
            </p>
            <a href="https://drive.google.com/file/d/14hs7C0MBlUkLx9UE76gZtUHloqJWA8zL/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="hero-resume-btn">
              <span className="hero-resume-arrow">↓</span> DOWNLOAD RÉSUMÉ
            </a>
          </div>
          <div className="hl-middle-right">
            <span className="hl-word2">WITH</span>
          </div>
          <div className="hl-bottom">
            <span className="hl-line3">PURPOSE</span>
          </div>
        </div>

        <div className="hero-bottom">
          <div className="hero-stats-row">
            <div className="hstat">
              <span className="hstat-n">1.5+</span>
              <span className="hstat-l">Years Shipping</span>
            </div>
            <div className="hstat-divider"></div>
            <div className="hstat">
              <span className="hstat-n">12+</span>
              <span className="hstat-l">Products Worked On</span>
            </div>
            <div className="hstat-divider"></div>
            <div className="hstat">
              <span className="hstat-n">6+</span>
              <span className="hstat-l">Industries</span>
            </div>
          </div>
          <div className="hero-cta">
            <a href="#works" className="btn btn-fill"><span>View Work</span></a>
            <a href="#contact" className="btn btn-ghost">Let's Talk</a>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          <span className="marquee-item">Human-AI Collaboration</span>
          <span className="marquee-item">Explainable AI (XAI)</span>
          <span className="marquee-item">System Architecture</span>
          <span className="marquee-item">Graceful Degradation</span>
          <span className="marquee-item">Agentic Workflows</span>
          <span className="marquee-item">Human-in-the-Loop</span>
          <span className="marquee-item">Trust Mechanisms</span>
          <span className="marquee-item">Prompt-to-UI Mapping</span>
          <span className="marquee-item">LLM Orchestration</span>
          <span className="marquee-item">Edge Case Fallbacks</span>
          <span className="marquee-item">Product Design</span>
          {/* duplicate */}
          <span className="marquee-item">Human-AI Collaboration</span>
          <span className="marquee-item">Explainable AI (XAI)</span>
          <span className="marquee-item">System Architecture</span>
          <span className="marquee-item">Graceful Degradation</span>
          <span className="marquee-item">Agentic Workflows</span>
          <span className="marquee-item">Human-in-the-Loop</span>
          <span className="marquee-item">Trust Mechanisms</span>
          <span className="marquee-item">Prompt-to-UI Mapping</span>
          <span className="marquee-item">LLM Orchestration</span>
          <span className="marquee-item">Edge Case Fallbacks</span>
          <span className="marquee-item">Product Design</span>
        </div>
      </div>

      {/* WORKS */}
      <section id="works" className="reveal">
        <div className="sec-header">
          <div className="sec-eye">002 / Works</div>
          <div className="sec-big">Featured<br />Projects</div>
        </div>

        {/* JUBEE */}
        <div className="proj-split" data-cursor="view">
          <div className="proj-vis" style={{ background: `url('/jubee-new.png') center/cover no-repeat var(--off)` }}>
            <div className="proj-vis-tag">Enterprise AI Platform</div>
            <div className="proj-vis-url">jubee001.vercel.app</div>
          </div>
          <div className="proj-info">
            <div>
              <div className="proj-cat">Legal Tech · Enterprise · 2026</div>
              <div className="proj-meta" style={{ color: 'var(--muted)', fontFamily: '"DM Mono", monospace', fontSize: '10px', letterSpacing: '0.1em', marginTop: '6px', marginBottom: '16px', textTransform: 'uppercase' }}>→ 4 WEEKS · 2026 · SOLO</div>
              <div className="proj-title">JUBEE</div>
              <p className="proj-sub">9-module legal AI platform. Designed end-to-end solo in 4 weeks using Figma Make + Claude. Shipped to production.</p>
              <div className="proj-chips">
                <span className="chip hi">Human-in-the-Loop</span>
                <span className="chip hi">9 Modules</span>
                <span className="chip">Enterprise-Grade</span>
                <span className="chip">Agentic Validation</span>
                <span className="chip">Claude</span>
              </div>
            </div>
            <div className="proj-links-row">
              <a href="https://jubee001.vercel.app/login" target="_blank" rel="noreferrer" className="proj-link">View Live Platform</a>
              <a href="https://www.behance.net/gallery/244312605/Jubee-Legal-Productivity-Ecosystem-UX-Case-Study" target="_blank" rel="noreferrer" className="proj-link">View Case Study</a>
            </div>
          </div>
        </div>

        {/* MADEASME */}
        <div className="proj-split" data-cursor="view">
          <div className="proj-vis" style={{
            background: `url('/MadeasMe.png') center/cover no-repeat var(--off)`
          }}>
            <div className="proj-vis-tag">Multi-Vendor</div>
            <div className="proj-vis-url">madeasme.com</div>
          </div>
          <div className="proj-info">
            <div>
              <div className="proj-cat">Fashion E-Commerce · 2025</div>
              <div className="proj-meta" style={{ color: 'var(--muted)', fontFamily: '"DM Mono", monospace', fontSize: '10px', letterSpacing: '0.1em', marginTop: '6px', marginBottom: '16px', textTransform: 'uppercase' }}>→ 34 WEEKS · 2025 · SOLO</div>
              <div className="proj-title">MADE<br />AS ME</div>
              <p className="proj-sub">Personal portfolio experiment. Built and shipped in 34 weeks using AI-assisted design workflow end to end.</p>
              <div className="proj-chips">
                <span className="chip hi">4 Surfaces</span>
                <span className="chip">POS + Mobile</span>
                <span className="chip">Admin Dashboard</span>
                <span className="chip">Multi-Vendor</span>
              </div>
            </div>
            <div className="proj-links-row">
              <a href="https://madeasme.com" target="_blank" rel="noreferrer" className="proj-link">View Live Platform</a>
              <a href="https://www.behance.net/gallery/242095089/MadeAsMe-A-Ecommerce-Ecosystem" target="_blank" rel="noreferrer" className="proj-link">View Case Study</a>
            </div>
          </div>
        </div>

        {/* VR TRAINING */}
        <a href="https://www.behance.net/gallery/242494633/VR-Safety-Training-App" target="_blank" rel="noreferrer" className="proj-split" data-cursor="view">
          <div className="proj-vis" style={{ background: `url('/vr-safety-new.jpg') center/cover no-repeat var(--off)` }}>
            <div className="proj-vis-tag">Global Recognition</div>
            <div className="proj-vis-url">Spatial UX · Industrial</div>
          </div>
          <div className="proj-info">
            <div>
              <div className="proj-cat">Spatial UX · VR · International Recognition</div>
              <div className="proj-meta" style={{ color: 'var(--muted)', fontFamily: '"DM Mono", monospace', fontSize: '10px', letterSpacing: '0.1em', marginTop: '6px', marginBottom: '16px', textTransform: 'uppercase' }}>→ 12 WEEKS · 2024–2025 · SOLO</div>
              <div className="proj-title">VR SAFETY<br />TRAINING</div>
              <p className="proj-sub">Immersive VR retail experience. Designed and delivered solo over 12 weeks. Full design system built from scratch.</p>
              <div className="proj-chips">
                <span className="chip hi">International Recognition</span>
                <span className="chip">Spatial / VR</span>
                <span className="chip">3D Interactions</span>
              </div>
            </div>
            <div className="proj-link">View Case Study</div>
          </div>
        </a>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="reveal">
        <div className="sec-header">
          <div className="sec-eye">003 / Experience</div>
          <div className="sec-big">Where I've<br />Worked</div>
        </div>

        {/* Row 01 — Job */}
        <div className="exp-row">
          <div className="exp-n">01</div>
          <div className="exp-company">
            <div className="exp-company-name">MONKHUB INNOVATIONS</div>
            <div className="exp-company-loc">Gurugram, Haryana</div>
            <div className="exp-dates">May 2024 – Present</div>
            <hr className="exp-rule" />
          </div>
          <div className="exp-main">
            <div className="exp-role">
              <span className="role-line1">PRODUCT</span>
              <span className="role-line2"> DESIGNER</span>
            </div>
            <p className="exp-bio">High-autonomy designer shipping production-ready products across e-commerce, legal tech, SaaS, VR, and retail — integrating AI into every layer of the process.</p>

            {/* Responsibility bullets */}
            <ul className="exp-bullets">
              <li><span className="exp-dash">—</span><span>Owned <strong>end-to-end design</strong> for <strong>12+ shipped digital products</strong>, improving usability, engagement, and conversion across diverse platforms.</span></li>
              <li><span className="exp-dash">—</span><span>Integrated <strong>Claude, ChatGPT, and MCPs</strong> for research synthesis, content generation, rapid prototyping, and UX copywriting — cutting <strong>iteration cycles significantly</strong>.</span></li>
              <li><span className="exp-dash">—</span><span>Leveraged <strong>Figma Make</strong> to generate complete, production-grade UI screens through <strong>prompt engineering</strong> — enabling solo delivery of multi-feature platforms.</span></li>
              <li><span className="exp-dash">—</span><span>Used <strong>Anti-Gravity, Stitch, and Flow</strong> to automate repetitive design operations and <strong>scale design system components</strong> across products.</span></li>
              <li><span className="exp-dash">—</span><span>Architected <strong>scalable design systems</strong> that accelerated delivery speed and enforced <strong>UI consistency</strong> across platforms.</span></li>
              <li><span className="exp-dash">—</span><span>Partnered with <strong>product managers and engineers</strong> to define problem spaces, shape solutions, and ship <strong>production-ready features</strong>.</span></li>
            </ul>
          </div>
          <ul className="exp-pills">
            <li>— 12+ Shipped Products</li>
            <li>— AI-Integrated Workflow</li>
            <li>— 6+ Industries</li>
            <li>— 0→1 Ownership</li>
          </ul>
        </div>
      </section>

      {/* ABOUT */}
      <div className="about-split reveal" id="about">
        <div className="about-photo" style={{ background: `url('/about-me-v4.jpg') center/cover no-repeat` }}>
        </div>
        <div className="about-text">
          <div className="about-bigname">ABHIMANYU<br />SAROHA</div>
          <div className="about-role">AI-First Product Designer · India</div>
          <p className="about-bio">
            <strong style={{ color: 'var(--black)' }}>One of the few designers in India who uses AI as a core workflow tool — not a buzzword.</strong>
          </p>
          <p className="about-bio" style={{ marginTop: '20px' }}>
            AI-first Product Designer from India. <strong>I build real products that ship — 12+ of them.</strong> My workflow runs on Anti-Gravity, Claude & MCPs. That's the work part, moving on.<br /><br />
            I'm a Charles Leclerc fan which is just a fancy way of saying I've developed an unmatched level of emotional endurance watching a man in a red car be <strong>incredibly fast</strong> and somehow still not win. It's fine. I'm fine.<br /><br />
            Outside of that I'm usually on a skateboard convincing myself I'm Tony Hawk, deep in a rabbit hole about the latest Mac or phone drop, or watching tech reviews I definitely don't need at 2am.<br /><br />
            I've also tried learning Spanish three times. Nailed uno, dos, tres every single time. Bueno días, bueno noches, and whatever you call bueno afternoon — fluent enough to start a conversation, not fluent enough to finish one. <strong>Let's work together in English.</strong>
          </p>
          <div className="about-links">
            <a href="https://www.linkedin.com/in/abhimanyusaroha/" target="_blank" rel="noreferrer" className="alink">LinkedIn</a>
            <a href="https://www.behance.net/abhimanyusaroha" target="_blank" rel="noreferrer" className="alink">Behance</a>
            <a href="https://dribbble.com/Saroha22" target="_blank" rel="noreferrer" className="alink">Dribbble</a>
          </div>
        </div>
      </div >

      <div className="about-stats reveal">
        <div className="astat"><div className="astat-n">1.5+</div><div className="astat-l">Years Shipping</div></div>
        <div className="astat"><div className="astat-n">12+</div><div className="astat-l">Products Worked On</div></div>
        <div className="astat"><div className="astat-n">6+</div><div className="astat-l">Industries</div></div>
      </div>

      {/* IMAGE CAROUSEL — REMOVED PER REQUEST, KEPT FOR FUTURE USE
      <section className="image-carousel-sec reveal">
        <div className="carousel-track">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="carousel-img-wrap">
              <img src="/about-me-v3.jpg" alt="Carousel item" />
            </div>
          ))}
        </div>
      </section>
      */}

      {/* TOOLS */}
      <section id="stack" className="reveal">
        <div className="sec-header">
          <div className="sec-eye">005 / My Stack</div>
          <div className="sec-big">Tools</div>
        </div>
        <div className="tools-grid">
          <div className="tc primary"><div className="tc-name">Claude</div><div className="tc-label">AI Research & UX Logic</div></div>
          <div className="tc primary"><div className="tc-name">Anti-Gravity</div><div className="tc-label">AI Design Workflow</div></div>
          <div className="tc primary"><div className="tc-name">MCPs</div><div className="tc-label">Workflow Automation</div></div>
          <div className="tc primary"><div className="tc-name">System Mapping</div><div className="tc-label">Architecture & Logic</div></div>
          <div className="tc"><div className="tc-name">Figma</div><div className="tc-label">Design Tool</div></div>
          <div className="tc"><div className="tc-name">LLM Orchestration</div><div className="tc-label">Prompt-to-UI Flow</div></div>
          <div className="tc"><div className="tc-name">Cursor</div><div className="tc-label">AI Code Assistant</div></div>
          <div className="tc"><div className="tc-name">UX Research</div><div className="tc-label">Human-in-the-loop</div></div>
          <div className="tc"><div className="tc-name">Framer</div><div className="tc-label">Website Builder</div></div>
          <div className="tc"><div className="tc-name">Flow</div><div className="tc-label">Design Automation</div></div>
          <div className="tc"><div className="tc-name">Prototypes</div><div className="tc-label">Interaction Design</div></div>
          <div className="tc"><div className="tc-name">Notion</div><div className="tc-label">Productivity</div></div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="reveal">
        <div className="sec-header">
          <div className="sec-eye">006 / What I Offer</div>
          <div className="sec-big">Services</div>
        </div>
        <div className="svc-row">
          <div className="svc-n">01</div>
          <div className="svc-name">Product<br />Design</div>
          <ul className="svc-items">
            <li>End-to-end UX for web and mobile</li>
            <li>Wireframes, flows, high-fidelity UI</li>
            <li>Conversion-focused interaction design</li>
            <li>Design systems that actually scale</li>
          </ul>
        </div>
        <div className="svc-row">
          <div className="svc-n">02</div>
          <div className="svc-name">AI Product<br />Design</div>
          <ul className="svc-items">
            <li>Designing human-in-the-loop (HITL) interfaces</li>
            <li>Trust, transparency, and explainable AI</li>
            <li>LLM-assisted workflows & edge case handling</li>
            <li>System architecture & graceful degradation</li>
          </ul>
        </div>
        <div className="svc-row">
          <div className="svc-n">03</div>
          <div className="svc-name">E-Commerce<br />&amp; SaaS</div>
          <ul className="svc-items">
            <li>Marketplace &amp; checkout optimization</li>
            <li>Admin dashboards and ops tooling</li>
            <li>POS systems — offline ↔ online sync</li>
            <li>Retention &amp; habit-forming UX patterns</li>
          </ul>
        </div>
        <div className="svc-row">
          <div className="svc-n">04</div>
          <div className="svc-name">AI-Ready<br />Systems</div>
          <ul className="svc-items">
            <li>Scalable components for dynamic AI outputs</li>
            <li>Cross-platform UI consistency</li>
            <li>Prompt-to-UI component mapping</li>
            <li>Handoff-ready, dev-friendly specs</li>
          </ul>
        </div>
      </section>

      {/* PLAYGROUND */}
      <section id="playground" className="reveal playground-sec">
        <div className="sec-header">
          <div className="sec-eye">004 / Playground</div>
          <div className="sec-big">My<br />Playground</div>
        </div>

        <div className="play-row">
          {/* Card 1 — Retro Portfolio */}
          <div className="play-card">
            <div className="play-video-wrap">
              <video autoPlay muted loop playsInline src="/Retro Portfolio.mov?v=2" style={{ width: '100%', height: '100%', objectFit: 'cover' }}></video>
            </div>
            <div className="play-info">
              <span className="made-by-chip">Made with Claude + Anti-Gravity</span>
              <h3 className="play-title">Retro Portfolio</h3>
              <p className="play-sub">A nostalgic take on personal branding — CRT aesthetics, retro UI patterns, and analog warmth.</p>
            </div>
          </div>

          {/* Card 2 — Animated Portfolio */}
          <div className="play-card">
            <div className="play-video-wrap">
              <video autoPlay muted loop playsInline src="/Animated Portfolio.mov?v=2" style={{ width: '100%', height: '100%', objectFit: 'cover' }}></video>
            </div>
            <div className="play-info">
              <span className="made-by-chip">Made with Claude + Anti-Gravity</span>
              <h3 className="play-title">Animated Portfolio</h3>
              <p className="play-sub">Motion-driven experience design — fluid transitions, kinetic typography, and immersive scroll.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="reveal">
        <div className="sec-header">
          <div className="sec-eye">008 / FAQ</div>
          <div className="sec-big">Asked &amp;<br />Answered</div>
        </div>
        {[
          {
            q: 'What does "AI-first" mean for a designer?',
            a: 'It means I design the system architecture alongside the UX. I map out where the LLM hallucination risks are, how the human intercepts errors, and how the interface builds trust.'
          },
          {
            q: 'Can AI really build production-ready products?',
            a: 'Jubee is live proof — an enterprise platform where AI dynamically drafts legal workflows while humans act as the final reviewers, reducing manual routing by 90%.'
          },
          {
            q: 'Do you work with startups or established companies?',
            a: "Both. Most of my 12+ shipped products were 0→1 builds. I'm comfortable with ambiguity, enjoy shaping product strategy, and don't need a perfectly defined brief to get started."
          },
          {
            q: 'How fast do you actually move?',
            a: "Fast. Anti-Gravity and Claude compress timelines significantly. What used to take a 2-week design sprint can reach high-fidelity in 3–4 days. I'm not cutting corners — I'm cutting the parts that don't need human time."
          },
          {
            q: 'What industries have you worked in?',
            a: 'Fashion e-commerce, legal tech, F&amp;B / retail, industrial safety (VR), SaaS, and enterprise operations. Six domains, 12+ products, one designer.'
          },
          {
            q: 'How do I get started?',
            a: "Drop me an email at abhimanyusaroha@gmail.com. Tell me what you're building and where it's stuck. I'll respond within 24 hours."
          }
        ].map((faq, i) => (
          <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`} onClick={() => toggleFaq(i)}>
            <div className="faq-hdr">
              <div className="faq-q">{faq.q}</div>
              <div className="faq-ico">+</div>
            </div>
            <div className="faq-body">
              <div className="faq-body-in" dangerouslySetInnerHTML={{ __html: faq.a }} />
            </div>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="footer-new" id="contact">

        {/* Scrolling Marquee Banner */}
        <div className="footer-marquee-wrap">
          <div className="footer-marquee-track">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="footer-marquee-item">LET'S WORK TOGETHER —&nbsp;</span>
            ))}
          </div>
        </div>

        {/* Grid Background */}
        <div className="footer-grid-bg" aria-hidden="true" />

        {/* Center Content */}
        <div className="footer-center">
          <div className="footer-eyebrow">009 / Let's work together</div>
          <h2 className="footer-headline">
            <span className="footer-hl-outline">PIXELS</span>
            {' '}WITH PURPOSE
          </h2>
          <p className="footer-sub">
            I design systems where AI amplifies human capabilities, creating experiences that are intelligent, transparent, and built for scale.
          </p>
          <a href="mailto:abhimanyusaroha@gmail.com" className="footer-email">
            ABHIMANYUSAROHA@GMAIL.COM
          </a>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bar">
          <div className="footer-bar-name">ABHIMANYU SAROHA</div>
          <div className="footer-bar-copy">© 2026 — Designed by a human. Built with AI.</div>
          <div className="footer-bar-social">
            <a href="https://www.linkedin.com/in/abhimanyusaroha/" target="_blank" rel="noreferrer">IN</a>
            <a href="https://www.behance.net/abhimanyusaroha" target="_blank" rel="noreferrer">BE</a>
            <a href="https://dribbble.com/Saroha22" target="_blank" rel="noreferrer">DR</a>
          </div>
        </div>

      </footer>
    </>
  );
}

export default App;
