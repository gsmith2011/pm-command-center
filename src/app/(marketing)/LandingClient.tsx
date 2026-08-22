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

    // nav shadow
    const nav = navRef.current;
    const onScroll = () => nav?.classList.toggle("lp-stuck", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // reveals
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

    // brief assembly
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

    // kick off brief when it scrolls into view (once)
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
              <a href="#surfaces">Surfaces</a>
              <a href="#how">How it works</a>
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
              <a className="lp-textlink" href="#how">
                See how it works
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
                      <b>Resourcing tension is time-boxed</b>
                      <span className="lp-tag lp-t-crit lp-mono">Decision due</span>
                    </div>
                    <div className="lp-item-desc">
                      <code>T1</code> forces on <b>2026-07-28</b> &mdash; sync-health build vs.
                      onboarding staffing. Open pending leadership sign-off.
                    </div>
                  </div>
                </div>
                <div className="lp-item">
                  <span className="lp-stripe lp-s-warn" />
                  <div className="lp-item-main">
                    <div className="lp-item-top">
                      <b>Relationship debt with Jordan</b>
                      <span className="lp-tag lp-t-warn lp-mono">28d cold</span>
                    </div>
                    <div className="lp-item-desc">
                      High-influence, high-friction, and untouched since the roadmap cut.
                    </div>
                  </div>
                </div>
                <div className="lp-item">
                  <span className="lp-stripe lp-s-good" />
                  <div className="lp-item-main">
                    <div className="lp-item-top">
                      <b>Field-mapping hypothesis is gaining ground</b>
                      <span className="lp-tag lp-t-good lp-mono">New evidence</span>
                    </div>
                    <div className="lp-item-desc">
                      3 mid-market interviews now point the same way. Promote to{" "}
                      <code>insights.md</code>?
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

      {/* clarity band */}
      <section className="lp-clarity">
        <div className="lp-wrap lp-sec">
          <p className="lp-reveal">
            Your thinking already lives in a folder. PM Brain keeps your strategy, hypotheses,
            decisions, and interview notes as plain markdown. <b>PM Command Center reads that
            folder and shows the whole picture on one screen</b>, so you stop reconstructing it
            file by file.
          </p>
        </div>
      </section>

      {/* benefits */}
      <section className="lp-sec">
        <div className="lp-wrap">
          <div className="lp-sec-head lp-reveal">
            <div className="lp-kick">Outcomes</div>
            <h2 className="lp-h2">What you get out of it.</h2>
          </div>
          <div className="lp-benefits">
            {[
              {
                icon: <Ic.bell />,
                h: "Walk into Monday knowing what needs your attention.",
                p: "A standing sweep flags forcing dates, decisions left open too long, and relationships going quiet — while there’s still time to act.",
              },
              {
                icon: <Ic.rotate />,
                h: "Stop re-arguing settled calls.",
                p: "Every decision keeps its evidence and the one condition that would reverse it. Options you ruled out stay on the page, so they don’t come back around.",
              },
              {
                icon: <Ic.shield />,
                h: "Trust what you’re reading.",
                p: "Every claim links back to where it came from, and real disagreement stays visible instead of being averaged away.",
              },
            ].map((b, i) => (
              <div className="lp-benefit lp-reveal" key={i} style={{ ["--d" as string]: `${i * 0.07}s` }}>
                <div className="lp-benefit-ic">{b.icon}</div>
                <h3>{b.h}</h3>
                <p>{b.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* surfaces */}
      <section className="lp-sec" id="surfaces">
        <div className="lp-wrap">
          <div className="lp-sec-head lp-reveal">
            <div className="lp-kick">What&rsquo;s inside</div>
            <h2 className="lp-h2">Everything you&rsquo;re tracking, in one place.</h2>
            <p>Not a dashboard of vanity metrics &mdash; a working memory that stays honest: one home for every fact, provenance on every claim, and disagreements kept in the open.</p>
          </div>
          <div className="lp-bento">
            <div className="lp-card lp-c4 lp-reveal">
              <div className="lp-card-ic"><Ic.chart /></div>
              <h3>Hypotheses, weighed by evidence</h3>
              <p>Each belief shows what supports it, what argues against it, and how confident you should be &mdash; so one fresh anecdote never tips the scale.</p>
              <div className="lp-hyp">
                <div className="lp-hyp-title">&ldquo;Sync breaks when Salesforce fields get remapped&rdquo;</div>
                <div className="lp-hyp-split">
                  <span className="lp-hyp-for" style={{ flex: 4 }} />
                  <span className="lp-hyp-against" style={{ flex: 1 }} />
                </div>
                <div className="lp-hyp-meta">
                  <span className="lp-hyp-legend"><b>4</b> for &middot; <b>1</b> against</span>
                  <span className="lp-conf">Medium confidence</span>
                </div>
              </div>
            </div>

            <div className="lp-card lp-c2 lp-reveal" style={{ ["--d" as string]: ".07s" }}>
              <div className="lp-card-ic"><Ic.checkSq /></div>
              <h3>Decisions that keep their receipts</h3>
              <p>Every record carries its evidence, its status, and the condition that would reverse it.</p>
              <div className="lp-mini-callout">
                <span className="lp-mini-k">Reverses if</span>sync error rate climbs back over 2%
              </div>
            </div>

            <div className="lp-card lp-c3 lp-reveal">
              <div className="lp-card-ic"><Ic.users /></div>
              <h3>Stakeholders, mapped by influence and friction</h3>
              <p>See who can move your roadmap, who&rsquo;s pushing against it, and who&rsquo;s gone quiet too long.</p>
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

            <div className="lp-card lp-c3 lp-reveal" style={{ ["--d" as string]: ".07s" }}>
              <div className="lp-card-ic"><Ic.clock /></div>
              <h3>Strategy tensions, kept in the open</h3>
              <p>When a weak signal collides with a committed bet, the conflict is surfaced and escalated, not quietly resolved.</p>
              <div className="lp-mini-callout lp-mini-warn">
                <span className="lp-mini-k">Open</span>
                <code>T1</code> &middot; resourcing &middot; forcing 2026-07-28
              </div>
            </div>

            <div className="lp-card lp-c2 lp-reveal">
              <div className="lp-card-ic"><Ic.list /></div>
              <h3>The ingestion feed</h3>
              <p>New input lands here first, and is only promoted once it recurs.</p>
              <div className="lp-mini-feed">
                <div><span className="lp-mini-dot" /><b>Interview</b> &middot; Salesforce sync friction</div>
                <div><span className="lp-mini-dot" /><b>Exit survey</b> &middot; notification overload</div>
              </div>
            </div>

            <div className="lp-card lp-c4 lp-reveal" style={{ ["--d" as string]: ".07s" }}>
              <div className="lp-card-ic"><Ic.activity /></div>
              <h3>A weekly health check</h3>
              <p>Broken links, stale notes, untagged claims, drifting indexes &mdash; caught automatically, every week, and surfaced rather than silently fixed.</p>
              <div className="lp-mini-callout">
                <span className="lp-mini-k">Last sweep</span>2 stale notes &middot; 1 untagged claim &middot; indexes clean
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* how it works */}
      <section className="lp-sec" id="how">
        <div className="lp-wrap">
          <div className="lp-sec-head lp-reveal">
            <div className="lp-kick">How it works</div>
            <h2 className="lp-h2">It runs the same five moves on every signal, so nothing lands without a trace.</h2>
          </div>
          <div className="lp-loop lp-reveal">
            <div className="lp-track" />
            {[
              ["Ingest", "The source is copied word-for-word before anything is synthesized. The original is never edited."],
              ["Classify", "Observation, interpretation, hypothesis, decision, or assumption — every item wears its type."],
              ["Retrieve", "It searches the folder before it asks you. Smallest-sufficient context, not a document dump."],
              ["Act", "Synthesis and routing, citing the exact files it drew from, so you can audit the reasoning."],
              ["Write back", "Hypotheses promoted or demoted, decisions logged, indexes kept in sync."],
            ].map(([h, p], i) => (
              <div className="lp-stage" key={i}>
                <div className="lp-sdot" />
                <span className="lp-sn lp-mono">STEP 0{i + 1}</span>
                <h4>{h}</h4>
                <p>{p}</p>
              </div>
            ))}
          </div>
          <div className="lp-usage lp-reveal">
            <Ic.folder />
            <p>
              <b>Point it at your workspace.</b> Set <code>BRAIN_DIR</code> to your PM Brain
              folder and it reads live &mdash; no database, no export, and no changes to your files.
            </p>
          </div>
        </div>
      </section>

      {/* principles */}
      <section className="lp-sec">
        <div className="lp-wrap">
          <div className="lp-sec-head lp-reveal">
            <div className="lp-kick">Why you can trust it</div>
            <h2 className="lp-h2">Most tools get more confident as they get more wrong. This one is built to stay honest.</h2>
          </div>
          <div className="lp-prin">
            {[
              ["It never makes things up.", "No invented quotes, no guessed numbers, no motives pulled from thin air. When it doesn’t know, it says so."],
              ["Every claim shows its source.", "A claim without provenance is flagged, not trusted."],
              ["Facts and interpretations stay separate.", "“The customer said X” and “the customer is frustrated” are stored as different kinds of thing."],
              ["Correlation isn’t promoted to cause.", "A small sample is a watch item, not a verdict. Confidence only rises on evidence that survives the check."],
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
  bell: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" /></svg>
  ),
  rotate: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 019-9 9 9 0 016.7 3M21 3v5h-5M21 12a9 9 0 01-9 9 9 9 0 01-6.7-3M3 21v-5h5" /></svg>
  ),
  shield: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z" /><path d="M9 12l2 2 4-4" /></svg>
  ),
  chart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M7 14l4-4 3 3 5-6" /></svg>
  ),
  checkSq: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>
  ),
  users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>
  ),
  clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
  ),
  list: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h10" /></svg>
  ),
  activity: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
  ),
  folder: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
  ),
};
