---
title: "What n8n is, and why we build clinic automations on it"
description: "A plain-language explanation of n8n for clinic owners: what it does, why it suits dental practices, and what owning your workflows really means."
date: 2026-11-18
image: "/images/blog/why-we-build-on-n8n.png"
imageAlt: "An n8n-style workflow with five completed steps: trigger, AI step, rules, calendar and booked."
tags: ["n8n", "Automation basics"]
---

If you have spoken to us, you have heard the name n8n a lot. Here is what it is, in plain language, and why we chose it for dental clinic work.

## What n8n does

n8n is a workflow automation tool. You connect the apps you already use, such as your website form, WhatsApp, your calendar and your practice software, and you describe what should happen between them: *when this arrives, check that, then do this.*

Each workflow is drawn as a chain of steps, called nodes. That makes it easy to see exactly what happens to a booking request from the moment it arrives to the moment it lands in the schedule.

## Why it suits clinics

**You can see every step.** Each run is logged. If a patient says they never got a reminder, you can open that execution and see what happened, step by step.

**It connects to almost anything.** n8n has ready-made connectors for common tools, and anything with an API can be connected with an HTTP step. That matters for practice software, which varies a lot from clinic to clinic.

**AI is one step, not the whole system.** When we use AI, for example to read a free-text booking request and pull out the treatment and urgency, it sits inside a workflow with clear rules around it. Anything clinical is routed to your team, never answered by the AI.

**It can run on your own account.** n8n can be self-hosted or used through n8n's own cloud. Either way, the workflows, credentials and data sit in an account your clinic controls.

## What "you own it" means

When a project ends, you keep:

- the workflows themselves, running in your account
- the accounts and API keys they use
- written documentation of what each workflow does and how to change it

If you ever stop working with us, everything keeps running, and another developer can pick it up.

## When n8n isn't the answer

Sometimes the best fix is a setting in software you already pay for. If your practice software has a built-in reminder feature that does the job, we will tell you to use it. Automation should solve a real problem, not add another tool.

---

Curious what this looks like in practice? Browse our [example builds](/#work), or [get in touch](/contact/) to talk through your clinic's workflows.
