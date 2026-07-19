# Source artifact — Customer interview, Lena Whitfield (Meridian Retail Group)

<!--
VERBATIM AUDIT ANCHOR — never edited after creation.
Transcript of a live call, lightly cleaned for filler words only. Content unchanged.
-->

- **Kind:** interview
- **Date:** 2026-07-01
- **Participants:** PM (interviewer); Lena Whitfield — RevOps Lead, Meridian Retail Group (~150 seats, second enterprise account)
- **Format:** 30-min video call, notes + partial transcript
- **Purpose:** Independent read on the activation problem — is Meridian seeing anything like the flat-activation pattern, and what's driving it on their side?

---

**PM:** Thanks Lena. I'm talking to a few accounts because our activation numbers have been stuck and I want to understand it from the customer side rather than guess. No agenda — where does Flo stand for your team right now?

**Lena:** Mixed, honestly. When it works it's great. But we've had a rocky few months getting everyone actually using it, and there was a stretch where sync just… stopped for a chunk of our reps and we didn't understand why.

**PM:** Let's take those one at a time. Start with the sync stopping — what happened?

**Lena:** So this was maybe six weeks ago. We had a Salesforce managed package update go through — one of our billing integrations pushed a change that altered a couple of field types. We didn't touch anything ourselves, it came in with the package. And after that, a set of our reps just stopped getting their Flo notes into Salesforce.

**PM:** Did you get any error or warning from Flo?

**Lena:** No. Nothing. That's the part that got me — there was no signal at all. The reps didn't get an error, I didn't get an email, there was nothing in the dashboard that said "hey, this stopped working." I only found out because a manager escalated that his team's notes were missing. By then it had been broken for probably two weeks.

**PM:** That's very close to what another account described — a field change on the Salesforce side silently breaking the mapping with nothing surfaced.

**Lena:** Yeah, I'd believe that's a pattern. The difference for us is we didn't even do it on purpose — it came through a package. So it's not just admins renaming things, it's anything that changes the field schema underneath you. And here's my honest problem: even once I knew it was broken, I couldn't fix it myself. We don't have a dedicated Salesforce admin. I'm RevOps, I'm not a Salesforce developer. I had to wait for our contractor.

**PM:** So if Flo had just alerted you the day it broke — would that have solved it?

**Lena:** Partly. It would've saved me the two weeks of not knowing, which matters. But an alert that says "your mapping is broken" and then leaves me to fix it? I'd still be stuck, because I don't have the person who *can* fix it. What I'd actually want is either Flo re-detecting the field and offering to remap it for me, or at minimum telling me exactly which field and what to change. A bare alarm isn't enough for a team like mine. For a big account with a Salesforce admin on staff, sure, an alert is probably all they need. We're not that.

**PM:** That's a really useful distinction. Let me switch to the other thing you mentioned — the rocky rollout.

**Lena:** Right. So honestly, day to day, the breakage was a scary two weeks, but the thing that's cost us the most activation is just… getting new reps onboarded. We hire in waves — we brought on like 30 reps this spring — and getting them from "account created" to "actually syncing meetings" is slow. The setup steps aren't obvious, reps don't know what they're supposed to connect, and a bunch of them just never finished. They're technically seats but they never activated.

**PM:** Do you think that's a setup-complexity problem or an onboarding-guidance problem?

**Lena:** Guidance, mostly. The mapping setup itself wasn't hard for me to do once — I did it. But a new rep dropped into it with no hand-holding doesn't know what "good" looks like, so they stall. If I look at my non-active seats, way more of them are "never got through onboarding" than "was working and then broke." The breakage was dramatic and scary; the onboarding drop-off is the quiet majority of my problem.

**PM:** That's an important contrast — because the other account I spoke to said essentially the opposite: for them setup was smooth and runtime breakage was the whole story.

**Lena:** I can see that. They probably have a mature Salesforce org and a full RevOps bench. We're leaner, and we churn through new reps faster. So the same product hits us in a different spot. For us it's onboarding first, breakage second. For them maybe it's the reverse. I wouldn't want you to fix only one and think you solved it.

**PM:** That's exactly the kind of thing I needed to hear. Anything else on your mind?

**Lena:** Just — whatever you do about the silent breakage, remember not everyone has a Salesforce expert to act on an alert. Design it for the team that doesn't. That's us.

**PM:** Noted, and thank you. This was genuinely helpful.

**Lena:** Anytime.
