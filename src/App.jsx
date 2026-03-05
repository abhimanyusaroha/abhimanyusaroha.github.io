import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import './index.css';

function App() {
  const [openFaq, setOpenFaq] = useState(null);

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
    }, { threshold: 0.06 });

    document.querySelectorAll('.reveal').forEach(el => io.observe(el));

    // Nav tint logic
    const navEl = document.getElementById('nav');
    const onScroll = () => {
      if (navEl) {
        navEl.style.background = window.scrollY > 20 ? 'rgba(242,240,235,.98)' : 'rgba(242,240,235,.93)';
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

    const projEls = document.querySelectorAll('.proj-split');
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
        <div id="welcome-text">ABHIMANYU</div>
        <div id="welcome-line"></div>
      </div>

      {/* CURSOR */}
      <div id="cur-dot"></div>
      <div id="cur-ring"><span id="cur-label">VIEW</span></div>

      {/* NAV */}
      <nav id="nav">
        <a className="nav-logo" href="#">ABHIMANYU <em>SAROHA</em></a>
        <ul className="nav-links">
          <li><a href="#services">Services</a></li>
          <li><a href="#works">Works</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="nav-right">
          <div className="avail"><div className="avail-dot"></div>Available for work</div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-meta-row">
          <span className="hero-meta">Product Designer · India · 2025</span>
          <span className="hero-meta">001 / Intro</span>
        </div>

        <div className="hero-hl-block">
          <div className="hl-top">
            <span className="star-icon">✻</span>
            <span className="hl-line1">PIXELS</span>
          </div>
          <div className="hl-middle-left">
            <p className="hl-intro">
              Product Designer specializing in <strong>AI-native experiences and intelligent systems.</strong>
              <br />Designing human-in-the-loop workflows, trust-building feedback systems, and LLM-assisted automation.
            </p>
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
              <span className="hstat-l">Live Products</span>
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

      {/* SERVICES */}
      <section id="services" className="reveal">
        <div className="sec-header">
          <div className="sec-eye">002 / Services</div>
          <div className="sec-big">What I<br />Do</div>
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

      {/* WORKS */}
      <section id="works" className="reveal">
        <div className="sec-header">
          <div className="sec-eye">003 / Works</div>
          <div className="sec-big">Featured<br />Projects</div>
        </div>

        {/* JUBEE */}
        <a href="https://jubee001.vercel.app/login" target="_blank" rel="noreferrer" className="proj-split" data-cursor="view">
          <div className="proj-vis" style={{ background: `url('/made-as-me.png') center/cover no-repeat #060e02` }}>
            <div className="proj-vis-tag">Enterprise AI Platform</div>
            <div className="proj-vis-url">jubee001.vercel.app</div>
          </div>
          <div className="proj-info">
            <div>
              <div className="proj-cat">Legal Tech · Enterprise · 2024</div>
              <div className="proj-title">JUBEE</div>
              <p className="proj-sub">A 9-module enterprise legal platform featuring dynamic LLM document drafting and asynchronous human validation loops.</p>
              <div className="proj-chips">
                <span className="chip hi">Human-in-the-Loop</span>
                <span className="chip hi">9 Modules</span>
                <span className="chip">Enterprise-Grade</span>
                <span className="chip">Agentic Validation</span>
                <span className="chip">Claude</span>
              </div>
            </div>
            <div className="proj-link">View Live Platform</div>
          </div>
        </a>

        {/* MADEASME */}
        <a href="https://madeasme.com" target="_blank" rel="noreferrer" className="proj-split" data-cursor="view">
          <div className="proj-vis" style={{
            background: `url('/made-as-me.png') center/cover no-repeat #110d07`
          }}>
            <div className="proj-vis-tag">Multi-Vendor</div>
            <div className="proj-vis-url">madeasme.com</div>
          </div>
          <div className="proj-info">
            <div>
              <div className="proj-cat">Fashion E-Commerce · 2024</div>
              <div className="proj-title">MADE<br />AS ME</div>
              <p className="proj-sub">Discovery to checkout. Consumer app to ops dashboard. One connected ecosystem across 4 surfaces.</p>
              <div className="proj-chips">
                <span className="chip hi">4 Surfaces</span>
                <span className="chip">POS + Mobile</span>
                <span className="chip">Admin Dashboard</span>
                <span className="chip">Multi-Vendor</span>
              </div>
            </div>
            <div className="proj-link">View Project</div>
          </div>
        </a>

        {/* VR TRAINING */}
        <a href="#" className="proj-split" data-cursor="view">
          <div className="proj-vis" style={{ background: `url('/made-as-me.png') center/cover no-repeat #050812` }}>
            <div className="proj-vis-tag">Global Recognition</div>
            <div className="proj-vis-url">Spatial UX · Industrial</div>
          </div>
          <div className="proj-info">
            <div>
              <div className="proj-cat">Spatial UX · VR · International Recognition</div>
              <div className="proj-title">VR SAFETY<br />TRAINING</div>
              <p className="proj-sub">Spatial UX for industrial safety. Real scenarios, real consequences. Built for decisions under pressure.</p>
              <div className="proj-chips">
                <span className="chip hi">🏆 International Award</span>
                <span className="chip">Spatial / VR</span>
                <span className="chip">3D Interactions</span>
              </div>
            </div>
            <div className="proj-link">View Case Study</div>
          </div>
        </a>
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
              <video autoPlay muted loop playsInline src="/Retro Portfolio.mov" style={{ width: '100%', height: '100%', objectFit: 'cover' }}></video>
            </div>
            <h3 className="play-title">Retro Portfolio</h3>
            <p className="play-sub">A nostalgic take on personal branding — CRT aesthetics, retro UI patterns, and analog warmth.</p>
            <div className="play-link">Explore <span>→</span></div>
          </div>

          {/* Card 2 — Animated Portfolio */}
          <div className="play-card">
            <div className="play-video-wrap">
              <video autoPlay muted loop playsInline src="/Animated Portolio.mov" style={{ width: '100%', height: '100%', objectFit: 'cover' }}></video>
            </div>
            <h3 className="play-title">Animated Portfolio</h3>
            <p className="play-sub">Motion-driven experience design — fluid transitions, kinetic typography, and immersive scroll.</p>
            <div className="play-link">Explore <span>→</span></div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="reveal">
        <div className="sec-header">
          <div className="sec-eye">005 / Experience</div>
          <div className="sec-big">Where I've<br />Worked</div>
        </div>

        {/* Row 01 — Job */}
        <div className="exp-row">
          <div className="exp-n">01</div>
          <div className="exp-company">
            <div className="exp-company-name">MONKHUB INNOVATIONS</div>
            <div className="exp-company-loc">Gurugram, Haryana</div>
            <hr className="exp-rule" />
            <div className="exp-dates">May 2024 – Present</div>
          </div>
          <div className="exp-main">
            <div className="exp-role">Product<br />Designer</div>
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

      {/* TOOLS */}
      <section className="reveal">
        <div className="sec-header">
          <div className="sec-eye">006 / Stack</div>
          <div className="sec-big">Tools</div>
        </div>
        <div className="tools-grid">
          <div className="tc primary"><div className="tc-name">System Mapping</div><div className="tc-label">Architecture & Logic</div></div>
          <div className="tc primary"><div className="tc-name">Claude</div><div className="tc-label">AI Research & UX Logic</div></div>
          <div className="tc primary"><div className="tc-name">MCPs</div><div className="tc-label">Workflow Automation</div></div>
          <div className="tc primary"><div className="tc-name">Anti-Gravity</div><div className="tc-label">AI Design Workflow</div></div>
          <div className="tc"><div className="tc-name">Figma</div><div className="tc-label">Design Tool</div></div>
          <div className="tc"><div className="tc-name">LLM Orchestration</div><div className="tc-label">Prompt-to-UI Flow</div></div>
          <div className="tc"><div className="tc-name">UX Research</div><div className="tc-label">Human-in-the-loop</div></div>
          <div className="tc"><div className="tc-name">Cursor</div><div className="tc-label">AI Code Assistant</div></div>
          <div className="tc"><div className="tc-name">Framer</div><div className="tc-label">Website Builder</div></div>
          <div className="tc"><div className="tc-name">Prototypes</div><div className="tc-label">Interaction Design</div></div>
          <div className="tc"><div className="tc-name">Flow</div><div className="tc-label">Design Automation</div></div>
          <div className="tc"><div className="tc-name">Notion</div><div className="tc-label">Productivity</div></div>
        </div>
      </section>

      {/* ABOUT */}
      <div className="about-split reveal" id="about">
        <div className="about-photo" style={{ background: `url('/about-me.jpg') center/cover no-repeat` }}>
        </div>
        <div className="about-text">
          <div className="about-bigname">ABHIMANYU<br />SAROHA</div>
          <div className="about-role">AI-First Product Designer · India</div>
          <p className="about-bio">
            A product designer who's been <strong>quietly going AI-first before it was a buzzword.</strong><br /><br />
            I design systems where AI amplifies human capabilities rather than replacing them. I build trust through explainable interfaces and seamless automation fallbacks.<br /><br />
            <strong>I don't just use AI to design faster. I design the AI experience itself.</strong>
          </p>
          <div className="about-links">
            <a href="https://www.linkedin.com/in/abhimanyusaroha/" target="_blank" rel="noreferrer" className="alink">LinkedIn</a>
            <a href="https://www.behance.net/abhimanyusaroha" target="_blank" rel="noreferrer" className="alink">Behance</a>
            <a href="https://dribbble.com/Saroha22" target="_blank" rel="noreferrer" className="alink">Dribbble</a>
            <a href="https://abhimanyusarohaportfolio.framer.website" target="_blank" rel="noreferrer" className="alink">Portfolio</a>
          </div>
        </div>
      </div >

      <div className="about-stats reveal">
        <div className="astat"><div className="astat-n">1.5+</div><div className="astat-l">Years Shipping</div></div>
        <div className="astat"><div className="astat-n">12+</div><div className="astat-l">Live Products</div></div>
        <div className="astat"><div className="astat-n">6+</div><div className="astat-l">Industries</div></div>
        <div className="astat"><div className="astat-n dim">0</div><div className="astat-l">Design Handoff Friction</div></div>
      </div>

      {/* FAQ */}
      <section className="reveal">
        <div className="sec-header">
          <div className="sec-eye">007 / FAQ</div>
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
          <div className="footer-eyebrow">008 / Let's work together</div>
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
          <div className="footer-bar-copy">© 2025 — Designed by a human. Built with AI.</div>
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
