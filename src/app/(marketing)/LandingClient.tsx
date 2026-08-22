"use client";

import { useEffect, useRef } from "react";

const APP = "/overview";

export default function LandingClient() {
  const navRef = useRef<HTMLElement | null>(null);
  const summaryRef = useRef<HTMLDivElement | null>(null);
  const scanRef = useRef<HTMLDivElement | null>(null);
  const avatarRef = useRef<HTMLSpanElement | null>(null);
  const metaRef = useRef<HTMLElement | null>(null);
  const itemsRef = useRef<HTMLDivElement | null>(null);

  const SUMMARY =
    "<b>Three things</b> want your attention this week. The resourcing tension you time-boxed is <b>five days from forcing</b>, one high-influence relationship has gone quiet, and the field-mapping hypothesis just picked up its third independent source.";
  const TOTAL = 41;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];
    const T = (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms);
      timers.push(id);
      return id;
    };

    const nav = navRef.current;
    const onScroll = () => nav?.classList.toggle("lp-stuck", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const revs = Array.from(document.querySelectorAll<HTMLElement>(".lp-reveal"));
    let io: IntersectionObserver | null = null;
    if (reduce || !("IntersectionObserver" in window)) {
      revs.forEach((el) => el.classList.add("lp-in"));
    } else {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add("lp-in");
              io!.unobserve(en.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
      );
      revs.forEach((el) => io!.observe(el));
    }

    const summary = summaryRef.current;
    const scan = scanRef.current;
    const scanFill = scan?.querySelector("i") as HTMLElement | null;
    const avatar = avatarRef.current;
    const meta = metaRef.current;
    const items = itemsRef.current
      ? Array.from(itemsRef.current.querySelectorAll<HTMLElement>(".lp-item"))
      : [];

    const finalState = () => {
      if (summary) summary.innerHTML = SUMMARY;
      items.forEach((it) => it.classList.add("lp-show"));
      if (meta) meta.textContent = `generated 06:12 · ${TOTAL} files scanned`;
      scan?.classList.remove("lp-on");
      avatar?.classList.remove("lp-spin");
    };

    const run = () => {
      if (reduce || !summary) {
        finalState();
        return;
      }
      timers.forEach(clearTimeout);
      timers.length = 0;
      items.forEach((it) => it.classList.remove("lp-show"));
      summary.innerHTML = '<span class="lp-cursor"></span>';
      avatar?.classList.add("lp-spin");
      scan?.classList.add("lp-on");
      if (scanFill) scanFill.style.width = "0%";

      let t0: number | null = null;
      const scanMs = 760;
      const step = (ts: number) => {
        if (t0 === null) t0 = ts;
        const p = Math.min(1, (ts - t0) / scanMs);
        if (scanFill) scanFill.style.width = (p * 100).toFixed(1) + "%";
        if (meta) meta.textContent = `scanning · ${Math.round(p * TOTAL)}/${TOTAL} files`;
        if (p < 1) requestAnimationFrame(step);
        else T(startType, 140);
      };
      requestAnimationFrame(step);

      const startType = () => {
        avatar?.classList.remove("lp-spin");
        scan?.classList.remove("lp-on");
        if (meta) meta.textContent = `generated 06:12 · ${TOTAL} files scanned`;
        const tmp = document.createElement("div");
        tmp.innerHTML = SUMMARY;
        const text = tmp.textContent || "";
        let i = 0;
        const type = () => {
          i++;
          if (i >= text.length) {
            summary.innerHTML = SUMMARY;
            T(revealItems, 180);
            return;
          }
          summary.innerHTML =
            text.slice(0, i).replace(/</g, "&lt;") + '<span class="lp-cursor"></span>';
          T(type, 14);
        };
        type();
      };

      const revealItems = () => {
        items.forEach((it, idx) => T(() => it.classList.add("lp-show"), idx * 130));
      };
    };

    let started = false;
    let bio: IntersectionObserver | null = null;
    const briefEl = document.getElementById("lp-brief");
    if (reduce || !("IntersectionObserver" in window)) {
      finalState();
    } else if (briefEl) {
      bio = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting && !started) {
              started = true;
              T(run, 240);
              bio!.disconnect();
            }
          });
        },
        { threshold: 0.35 }
      );
      bio.observe(briefEl);
    }

    const regen = document.getElementById("lp-regen");
    const onRegen = () => run();
    regen?.addEventListener("click", onRegen);

    return () => {
      window.removeEventListener("scroll", onScroll);
      timers.forEach(clearTimeout);
      io?.disconnect();
      bio?.disconnect();
      regen?.removeEventListener("click", onRegen);
    };
  }, []);

  return (
    <div className="lp" data-site="marketing">
      {/* nav */}
      <nav className="lp-nav" ref={navRef}>
        <div className="lp-wrap lp-nav-in">
          <div className="lp-brand">
            <span className="lp-glyph">
              <Ic.loop />
            </span>
            <span>
              PM Command Center
              <small>Built on PM Brain OS</small>
            </span>
          </div>
          <div className="lp-nav-right">
            <div className="lp-nav-links">
              <a href="#inside">What it does</a>
              <a href="#trust">Trust</a>
              <a href="#faq">FAQ</a>
            </div>
            <a className="lp-btn lp-btn-accent" href={APP}>
              Open the live demo
            </a>
          </div>
        </div>
      </nav>

      {/* hero */}
      <header className="lp-hero">
        <div className="lp-grid-bg" />
        <div className="lp-wrap lp-hero-grid">
          <div>
            <span className="lp-pill lp-reveal">
              <span className="lp-dot" />
              A command center for product managers
            </span>
            <h1 className="lp-h1 lp-reveal" style={{ ["--d" as string]: ".05s" }}>
              See where your product thinking stands, <span className="lp-accent">on one screen.</span>
            </h1>
            <p className="lp-lede lp-reveal" style={{ ["--d" as string]: ".12s" }}>
              PM Command Center reads your strategy, decisions, and user evidence from plain
              markdown files and lays them out on one screen &mdash; so you can see what&rsquo;s
              believed, how strong the evidence is, and what needs your attention.
            </p>
            <div className="lp-hero-cta lp-reveal" style={{ ["--d" as string]: ".19s" }}>
              <a className="lp-btn lp-btn-accent lp-btn-lg" href={APP}>
                Open the live demo &rarr;
              </a>
              <a className="lp-textlink" href="#inside">
                See what it does
              </a>
            </div>
            <div className="lp-assure lp-reveal" style={{ ["--d" as string]: ".26s" }}>
              <span>
                <Ic.check /> Traces every claim to its source
              </span>
              <span>
                <Ic.check /> Read-only &mdash; never touches your files
              </span>
              <span>
                <Ic.check /> Invents nothing
              </span>
            </div>
          </div>

          {/* brief */}
          <div className="lp-brief lp-reveal" id="lp-brief" style={{ ["--d" as string]: ".14s" }}>
            <div className="lp-brief-head">
              <div className="lp-brief-title">
                <span className="lp-avatar" ref={avatarRef} />
                <div>
                  <b>Monday Brief</b>
                  <small ref={metaRef} className="lp-mono">
                    generated 06:12 &middot; 41 files scanned
                  </small>
                </div>
              </div>
              <div className="lp-brief-actions">
                <button className="lp-regen" id="lp-regen" aria-label="Regenerate brief" title="Regenerate">
                  <Ic.refresh />
                </button>
                <span className="lp-live lp-mono">
                  <i /> Live
                </span>
              </div>
            </div>
            <div className="lp-brief-body">
              <div className="lp-scan" ref={scanRef}>
                <i />
              </div>
              <div className="lp-summary" ref={summaryRef} />
              <div className="lp-brief-label lp-mono">Needs your attention &middot; 3</div>
              <div ref={itemsRef}>
                <div className="lp-item">
                  <span className="lp-stripe lp-s-crit" />
                  <div className="lp-item-main">
                    <div className="lp-item-top">
                      <b>A decision is coming due</b>
                      <span className="lp-tag lp-t-crit lp-mono">Decision due</span>
                    </div>
                    <div className="lp-item-desc">
                      The build-vs-staffing tradeoff you flagged forces a call in <b>5 days</b>,
                      and it&rsquo;s still open.
                    </div>
                  </div>
                </div>
                <div className="lp-item">
                  <span className="lp-stripe lp-s-warn" />
                  <div className="lp-item-main">
                    <div className="lp-item-top">
                      <b>A key relationship has gone quiet</b>
                      <span className="lp-tag lp-t-warn lp-mono">28d cold</span>
                    </div>
                    <div className="lp-item-desc">
                      Jordan is high-influence and hasn&rsquo;t been touched since the roadmap cut.
                    </div>
                  </div>
                </div>
                <div className="lp-item">
                  <span className="lp-stripe lp-s-good" />
                  <div className="lp-item-main">
                    <div className="lp-item-top">
                      <b>A hunch just got stronger</b>
                      <span className="lp-tag lp-t-good lp-mono">New evidence</span>
                    </div>
                    <div className="lp-item-desc">
                      Three interviews now point the same way &mdash; worth promoting to a belief.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lp-brief-foot lp-mono">
              <span>4 hypotheses &middot; 6 decisions &middot; 9 stakeholders</span>
              <a href={APP}>
                Open command center <Ic.arrow />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* clarity band — lead with the problem */}
      <section className="lp-clarity">
        <div className="lp-wrap lp-sec">
          <div className="lp-clarity-in lp-reveal">
            <p className="lp-clarity-lead">
              Your strategy is in a doc. Decisions are in Slack threads. Research is in a folder
              somewhere. <b>Six weeks later, you can&rsquo;t reconstruct why you chose what you
              chose.</b>
            </p>
            <p className="lp-clarity-sub">
              PM Brain fixes that by keeping all of it as plain markdown in one folder. PM Command
              Center reads that folder and puts the whole picture on one screen &mdash; so the
              state of your thinking is something you can see, not something you have to remember.
            </p>
          </div>
        </div>
      </section>

      {/* what it does — 3-act narrative */}
      <section className="lp-sec" id="inside">
        <div className="lp-wrap">
          <div className="lp-sec-head lp-reveal">
            <div className="lp-kick">What it does</div>
            <h2 className="lp-h2">From scattered notes to a decision you can defend.</h2>
          </div>

          <div className="lp-acts">
            {/* Act 1 */}
            <div className="lp-act lp-reveal">
              <div className="lp-act-text">
                <span className="lp-act-n lp-mono">01</span>
                <h3>Bring the whole picture together.</h3>
                <p>
                  Strategy, decisions, research, and stakeholder notes usually live in five
                  different tools. PM Command Center reads them from a single folder of plain
                  markdown and keeps them current &mdash; every new input synthesized,
                  cross-linked, and swept for problems each week.
                </p>
              </div>
              <div className="lp-act-visual">
                <div className="lp-unify">
                  <div className="lp-unify-src">
                    <span>Interviews</span>
                    <span>Slack</span>
                    <span>Docs</span>
                    <span>Analytics</span>
                  </div>
                  <div className="lp-unify-mid"><Ic.arrow /></div>
                  <div className="lp-unify-out">
                    <Ic.folder />
                    One folder, one screen
                  </div>
                </div>
              </div>
            </div>

            {/* Act 2 — visual left, text right */}
            <div className="lp-act lp-act-rev lp-reveal">
              <div className="lp-act-visual">
                <div className="lp-hyp lp-hyp-lg">
                  <div className="lp-hyp-title">&ldquo;Sync breaks when Salesforce fields get remapped&rdquo;</div>
                  <div className="lp-hyp-split">
                    <span className="lp-hyp-for" style={{ flex: 4 }} />
                    <span className="lp-hyp-against" style={{ flex: 1 }} />
                  </div>
                  <div className="lp-hyp-meta">
                    <span className="lp-hyp-legend"><b>4</b> interviews for &middot; <b>1</b> against</span>
                    <span className="lp-conf">Medium confidence</span>
                  </div>
                  <div className="lp-hyp-src">
                    <span className="lp-mini-k">Source</span>every point traces back to the interview it came from
                  </div>
                </div>
              </div>
              <div className="lp-act-text">
                <span className="lp-act-n lp-mono">02</span>
                <h3>Keep every claim honest.</h3>
                <p>
                  Every claim carries a source you can click back to. Beliefs show the evidence
                  for and against side by side, so confidence reflects what has actually been
                  tested. And when a weak signal collides with a committed bet &mdash; say,{" "}
                  <i>ship the sync fix, or staff onboarding?</i> &mdash; the tradeoff is named and
                  escalated, not quietly buried.
                </p>
              </div>
            </div>

            {/* Act 3 */}
            <div className="lp-act lp-reveal">
              <div className="lp-act-text">
                <span className="lp-act-n lp-mono">03</span>
                <h3>Start the week a step ahead.</h3>
                <p>
                  A standing sweep pulls the few things that need you to the top &mdash; a
                  decision past due, a deadline this week, a key relationship gone quiet &mdash;
                  each with the receipts attached. And every decision keeps the one condition that
                  would change it, so calls you&rsquo;ve made stay made.
                </p>
              </div>
              <div className="lp-act-visual">
                <div className="lp-matrix" aria-hidden="true">
                  <div className="lp-axis-y"><span>High</span><span>Influence</span><span>Low</span></div>
                  <div className="lp-plot">
                    <div className="lp-quad"><span>Champions</span></div>
                    <div className="lp-quad"><span>Manage closely</span></div>
                    <div className="lp-quad"><span>Keep informed</span></div>
                    <div className="lp-quad"><span>Monitor</span></div>
                    <span className="lp-node lp-hot" style={{ top: "26%", left: "76%" }}><i />Jordan</span>
                    <span className="lp-node lp-champ" style={{ top: "30%", left: "26%" }}><i />Diego</span>
                    <span className="lp-node" style={{ top: "70%", left: "44%" }}><i />Lena</span>
                  </div>
                  <div className="lp-axis-x"><span>Low</span><span>Friction</span><span>High</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="lp-usage lp-reveal">
            <Ic.folder />
            <p>
              <b>Point it at your own workspace.</b> Set <code>BRAIN_DIR</code> to your PM Brain
              folder and it reads live &mdash; no database, no export, and no changes to your files.
            </p>
          </div>
        </div>
      </section>

      {/* trust */}
      <section className="lp-sec" id="trust">
        <div className="lp-wrap">
          <div className="lp-sec-head lp-reveal">
            <div className="lp-kick">Why you can trust it</div>
            <h2 className="lp-h2">Most tools get more confident as they get more wrong. This one is built to stay honest.</h2>
          </div>
          <div className="lp-prin">
            {[
              ["It never makes things up.", "No invented quotes, no guessed numbers, no motives pulled from thin air. When it doesn’t know, it says so."],
              ["Facts and opinions stay separate.", "“The customer said X” and “the customer seems frustrated” are stored as different kinds of thing, so an interpretation never hardens into a fact."],
              ["One data point is a flag, not a verdict.", "A single or one-off signal is something to watch, not proof. Confidence only rises when the evidence holds up."],
            ].map(([h, p], i) => (
              <div className="lp-prin-item lp-reveal" key={i} style={{ ["--d" as string]: `${(i % 2) * 0.06}s` }}>
                <span className="lp-pn lp-mono">0{i + 1}</span>
                <div>
                  <h4>{h}</h4>
                  <p>{p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* faq */}
      <section className="lp-sec" id="faq">
        <div className="lp-wrap">
          <div className="lp-sec-head lp-reveal">
            <div className="lp-kick">Questions</div>
            <h2 className="lp-h2">The things people ask first.</h2>
          </div>
          <div className="lp-faq lp-reveal">
            {[
              ["Does it change my files?", <>No. It&rsquo;s read-only &mdash; it renders your markdown and never writes to your workspace.</>],
              ["Where does my data go?", <>Nowhere. It reads the folder on your machine. Nothing is uploaded.</>],
              ["Can I point it at my own workspace?", <>Yes. Set <code>BRAIN_DIR</code> in <code>.env.local</code> to your PM Brain folder. The demo runs on a frozen snapshot.</>],
              ["What&rsquo;s it built on?", <>PM Brain OS, an open-source system for keeping product thinking as markdown. This is the visual layer on top.</>],
              ["Is the demo real?", <>The data isn&rsquo;t. It runs on Flo, a fictional company &mdash; real structure, invented names, quotes, and metrics.</>],
            ].map(([q, a], i) => (
              <details className="lp-q" key={i}>
                <summary>
                  {q}
                  <span className="lp-plus" aria-hidden="true" />
                </summary>
                <div className="lp-q-body">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* closing cta */}
      <section className="lp-sec">
        <div className="lp-wrap">
          <div className="lp-cta lp-reveal">
            <h2>See your Monday, laid out.</h2>
            <p>Walk the live demo running on Flo. Real structure, invented data.</p>
            <a className="lp-btn lp-btn-lg lp-btn-onaccent" href={APP}>
              Open the live demo &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* credit line */}
      <div className="lp-credit">
        <p className="lp-mono">
          Built on{" "}
          <a href="https://github.com/phuryn/pm-brain" target="_blank" rel="noreferrer">
            PM Brain OS
          </a>
          <span className="lp-sep">&middot;</span>
          Demo data is fictional (Flo)
        </p>
      </div>
    </div>
  );
}

/* inline icons */
const Ic = {
  loop: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 11-2.6-6.4M21 4v5h-5" /></svg>
  ),
  check: () => (
    <svg className="lp-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
  ),
  refresh: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 11-2.6-6.4M21 3v6h-6" /></svg>
  ),
  arrow: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  ),
  folder: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
  ),
};
