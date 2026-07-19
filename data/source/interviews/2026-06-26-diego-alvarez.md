# Source artifact — Customer interview, Diego Alvarez (Brightline Logistics)

<!--
VERBATIM AUDIT ANCHOR — never edited after creation.
Transcript of a live call, lightly cleaned for filler words only. Content unchanged.
-->

- **Kind:** interview
- **Date:** 2026-06-26
- **Participants:** PM (interviewer); Diego Alvarez — RevOps Lead, Brightline Logistics (~400 seats, flagship account)
- **Format:** 30-min video call, notes + partial transcript
- **Purpose:** Follow up on activation being flat; understand what Brightline reps are actually experiencing with Flo → Salesforce sync.

---

**PM:** Thanks for making time, Diego. I want to keep this open-ended — I'm not here to defend anything. We're seeing activation sit flat and I'm trying to understand what's actually happening on your side. Can you walk me through how Flo is working for your reps right now?

**Diego:** Honestly? It *was* working. That's the frustrating part. When we rolled out, setup was smooth — your team helped us map the fields, we did the Salesforce connection in an afternoon, reps were getting call notes into the CRM automatically. For the first couple months I was telling other RevOps people to look at Flo.

**PM:** So the initial setup and field mapping wasn't the pain point.

**Diego:** No. Setup was fine. I want to be clear about that because I know that's usually where people complain. Our problem started *after* everything was already working. That's what makes it insidious.

**PM:** Tell me about that.

**Diego:** So back in — I want to say early May — our Salesforce admin did a cleanup. Renamed a bunch of custom fields to fit a new naming convention. Normal hygiene, they do it a couple times a year. `Deal_Stage_Notes__c` became `Sales_Stage_Notes__c`, that kind of thing. Nobody thought twice about it because it's *our* Salesforce, we own those fields.

**PM:** And what happened to the sync?

**Diego:** It just... stopped writing those fields. Silently. No error. No email. Nothing in the app that said "hey, your mapping is broken." Flo kept processing the calls — the reps could see their meetings getting transcribed — but the data wasn't landing in Salesforce anymore. Or it was landing in the wrong place, half-populated records.

**PM:** How did the reps experience that?

**Diego:** Here's the thing — they didn't get an error either. From a rep's point of view, they just noticed over a week or two that "Flo isn't putting my notes in Salesforce anymore." No alert, no red banner, nothing. So what does a busy AE do? They shrug and go back to typing it in manually. They don't file a ticket. They don't email me. They just quietly stop relying on it.

**PM:** So they don't churn loudly, they churn silently.

**Diego:** Exactly. And this is what I've been trying to flag for a while. I had reps who were *active* — daily users — and then they just went dark on Flo. If you looked at your usage numbers you'd probably see them drop off and have no idea why. It wasn't that they didn't like it. It's that it broke and never told anyone, so they lost trust and stopped opening it.

**PM:** How many reps are we talking about?

**Diego:** At Brightline? I'd estimate a dozen-plus were affected by that one field rename before I even understood what was going on. And I only figured it out because two of my senior AEs happened to mention it in the same week and I went digging. If they hadn't, I'd still think Flo was fine and just quietly getting less used.

**PM:** When you went digging — was there anywhere in Flo that showed you the mapping was broken?

**Diego:** No. That's my actual ask, if you want it plainly. There is no sync-health view. Nothing tells me "the mapping between this Flo field and this Salesforce field is dead." I had to reverse-engineer it by comparing what was in the transcripts versus what made it into the records. For a 400-seat account that's insane. A field rename in Salesforce should not silently take down sync with zero signal.

**PM:** If we could surface that — some kind of alert when a mapping breaks — would that change the picture?

**Diego:** Enormously. Ninety percent of my frustration isn't that it broke. Software breaks. It's that it broke *silently* and I found out from hallway complaints weeks later. If I'd gotten an alert the day that field rename broke the mapping, I'd have fixed it in an hour and no rep would ever have lost faith in the tool. The silence is the churn risk, not the bug.

**PM:** Is this a one-time thing tied to that May cleanup, or ongoing?

**Diego:** Ongoing risk. Any Salesforce admin at any customer can rename or re-type a field any day of the week — it's routine. As long as your sync assumes the mapping is static and fails silently when it isn't, this will keep happening to every account that actively maintains their Salesforce. The bigger and more sophisticated the customer, the *more* they groom their fields, so ironically your best accounts are the most exposed.

**PM:** That's a sharp point. Anything else on your list while I have you?

**Diego:** That's the one that matters. Everything else is noise compared to this. Give me visibility when the mapping breaks and I'll be your reference account again. Right now I'm spending my own time being your monitoring system, and that doesn't scale for me or you.

**PM:** Understood. This is exactly what I needed. Thank you, Diego.

**Diego:** Anytime. Fix the silence.
