"use client";

import { useState } from "react";
import Link from "next/link";

type Role = "SWE" | "PM" | "Designer" | "Sales";

interface RubricPoint {
  text: string;
}

interface Question {
  type: "behavioral" | "technical";
  label: string;
  text: string;
  rubric: [RubricPoint, RubricPoint, RubricPoint];
}

const QUESTIONS: Record<Role, [Question, Question]> = {
  SWE: [
    {
      type: "behavioral",
      label: "SWE · Behavioral · Collaboration",
      text: "Tell me about a time you disagreed with a technical decision made by your team. How did you handle it?",
      rubric: [
        { text: "Describes the specific disagreement with context (what the decision was, why you disagreed, what was at stake)" },
        { text: "Explains how you raised the concern constructively — data, prototypes, or a written proposal rather than just pushback" },
        { text: "States the outcome: whether you changed the decision, aligned on a compromise, or accepted it and moved on — and what you learned" },
      ],
    },
    {
      type: "technical",
      label: "SWE · Technical · System Design",
      text: "Design a URL shortener like bit.ly. Walk through your approach at a high level — components, data model, and the one trade-off you would flag first.",
      rubric: [
        { text: "Identifies core components: API layer, ID generation (base-62 encoding or hash), key-value store for slug → URL, and a redirect service" },
        { text: "Explains the data model: a table/store with short_code, long_url, created_at, and optionally click_count or TTL" },
        { text: "Names the primary trade-off clearly — e.g. read-heavy vs. write-heavy caching strategy, collision handling in hash-based IDs, or consistency vs. availability for the redirect path" },
      ],
    },
  ],
  PM: [
    {
      type: "behavioral",
      label: "PM · Behavioral · Prioritization",
      text: "Walk me through a time you had to say no to a feature request from a stakeholder. How did you handle it?",
      rubric: [
        { text: "Sets up the situation: who the stakeholder was, what they asked for, and why it competed with other priorities" },
        { text: "Explains the framework used to decide — impact vs. effort, OKR alignment, user research, or opportunity cost — not just intuition" },
        { text: "Describes how you communicated the decision: what you said, how the stakeholder reacted, and whether you offered an alternative or timeline" },
      ],
    },
    {
      type: "technical",
      label: "PM · Technical · Metrics",
      text: "You launch a new onboarding flow. After two weeks, activation rate is up 8% but D7 retention is down 3%. What do you do?",
      rubric: [
        { text: "Distinguishes between correlation and causation — acknowledges the retention drop may or may not be caused by the new onboarding" },
        { text: "Proposes a diagnostic plan: segment by cohort (new vs. existing users), check if the retention drop pre-dates the launch, and identify which step in onboarding correlates with churn" },
        { text: "Outlines a decision framework: hold/rollback/iterate thresholds, who needs to be looped in, and what a follow-up experiment would look like" },
      ],
    },
  ],
  Designer: [
    {
      type: "behavioral",
      label: "Designer · Behavioral · Critique",
      text: "Describe a time your design was significantly changed based on feedback. How did you respond?",
      rubric: [
        { text: "Gives concrete context: what you designed, who gave feedback, and what specifically they pushed back on" },
        { text: "Shows how you evaluated the feedback — which parts were valid user needs vs. personal preference, and how you separated the two" },
        { text: "Describes the outcome: what changed, what you defended and why, and what you would do differently next time" },
      ],
    },
    {
      type: "technical",
      label: "Designer · Technical · Design System",
      text: "You are building a new component library from scratch for a team of 12 engineers and 4 designers. What are the three decisions you make first?",
      rubric: [
        { text: "Defines the token layer first: color, spacing, typography, and border-radius as design tokens before touching components — so visual decisions are centralized and swappable" },
        { text: "Establishes contribution and versioning conventions: who can add components, how variants are named, and how breaking changes are communicated (e.g. semver, changelogs)" },
        { text: "Chooses the distribution and documentation strategy: a Storybook for discovery, a package for consumption, and a single source of truth that keeps Figma and code in sync" },
      ],
    },
  ],
  Sales: [
    {
      type: "behavioral",
      label: "Sales · Behavioral · Objection Handling",
      text: "Tell me about a deal you almost lost. What was the objection and how did you turn it around?",
      rubric: [
        { text: "Names the specific objection — price, timing, competitor, internal champion leaving — not a vague 'they had concerns'" },
        { text: "Explains the tactic used: reframing ROI, introducing a new stakeholder, offering a proof-of-concept, or adjusting the proposal — with concrete detail" },
        { text: "Gives the result: did you close the deal, and if so at what terms? If not, what did you learn about your qualifying process?" },
      ],
    },
    {
      type: "technical",
      label: "Sales · Technical · Discovery",
      text: "You have a 30-minute discovery call with a VP of Engineering at a 200-person SaaS company. What are your first five questions?",
      rubric: [
        { text: "Opens with a situational question to understand current state: tech stack, team structure, or the problem that triggered this conversation — not a product pitch" },
        { text: "Includes at least one implication question that surfaces the cost of the status quo: 'What happens if this isn't solved in the next quarter?'" },
        { text: "Ends the sequence with a question about decision-making process: who else is involved, what the evaluation criteria are, and what the timeline looks like" },
      ],
    },
  ],
};

const ROLES: Role[] = ["SWE", "PM", "Designer", "Sales"];

const ROLE_LABELS: Record<Role, string> = {
  SWE: "Software Engineer",
  PM: "Product Manager",
  Designer: "Designer",
  Sales: "Sales",
};

export default function TryPage() {
  const [role, setRole] = useState<Role>("SWE");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [checked, setChecked] = useState<boolean[]>([false, false, false]);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);
  const [scores, setScores] = useState<number[]>([]);

  const questions = QUESTIONS[role];
  const q = questions[questionIndex];

  function handleRoleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setRole(e.target.value as Role);
    setQuestionIndex(0);
    setChecked([false, false, false]);
    setRevealed(false);
    setFinished(false);
    setScores([]);
  }

  function toggleCheck(i: number) {
    if (!revealed) return;
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  }

  function handleReveal() {
    setRevealed(true);
  }

  function handleNext() {
    const score = checked.filter(Boolean).length;
    const nextScores = [...scores, score];
    if (questionIndex + 1 >= questions.length) {
      setScores(nextScores);
      setFinished(true);
    } else {
      setScores(nextScores);
      setQuestionIndex((i) => i + 1);
      setChecked([false, false, false]);
      setRevealed(false);
    }
  }

  function handleRestart() {
    setQuestionIndex(0);
    setChecked([false, false, false]);
    setRevealed(false);
    setFinished(false);
    setScores([]);
  }

  const totalScore = scores.reduce((a, b) => a + b, 0);
  const maxScore = questions.length * 3;

  return (
    <div className="min-h-screen bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />
          PrimeInt
        </Link>
        <Link
          href="/#waitlist"
          className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
        >
          Get early access
        </Link>
      </nav>

      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-600">
              Mock session
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">
              Pick your role, start practicing.
            </h1>
          </div>
          <select
            value={role}
            onChange={handleRoleChange}
            className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium focus:border-neutral-900 focus:outline-none focus:ring-4 focus:ring-neutral-900/10"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </div>

        {finished ? (
          <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm text-center">
            <p className="text-5xl font-bold text-neutral-900">
              {totalScore}/{maxScore}
            </p>
            <p className="mt-2 text-sm text-neutral-500">rubric points hit</p>
            <p className="mt-4 text-neutral-600">
              {totalScore === maxScore
                ? "Clean sweep. You hit every rubric point — you are interview-ready."
                : totalScore >= maxScore - 2
                ? "Strong. A couple of gaps to sharpen — almost there."
                : "Good start. Review the rubric points you missed and try again."}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={handleRestart}
                className="rounded-full bg-neutral-900 px-7 py-3.5 font-medium text-white transition hover:bg-neutral-700"
              >
                Try again
              </button>
              <Link
                href="/#waitlist"
                className="rounded-full border border-neutral-300 px-7 py-3.5 font-medium text-neutral-900 transition hover:border-neutral-900"
              >
                Get early access
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
              <span className="text-amber-600">{q.label}</span>
              <span className="text-neutral-400">
                Q {questionIndex + 1} of {questions.length}
              </span>
            </div>

            <p className="mt-5 text-lg leading-relaxed text-neutral-900">{q.text}</p>

            {!revealed ? (
              <button
                onClick={handleReveal}
                className="mt-6 w-full rounded-xl bg-amber-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-amber-700"
              >
                Answer out loud, then reveal rubric →
              </button>
            ) : (
              <>
                <div className="mt-6">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    3-point rubric — check what you hit
                  </p>
                  <div className="grid gap-2">
                    {q.rubric.map((point, i) => (
                      <button
                        key={i}
                        onClick={() => toggleCheck(i)}
                        className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm leading-relaxed transition ${
                          checked[i]
                            ? "border-green-500 bg-green-50 text-green-900"
                            : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-300"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                            checked[i]
                              ? "border-green-500 bg-green-500 text-white"
                              : "border-neutral-300 text-neutral-400"
                          }`}
                        >
                          {checked[i] ? "✓" : i + 1}
                        </span>
                        {point.text}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-right text-xs text-neutral-400">
                    {checked.filter(Boolean).length} / 3 hit
                  </p>
                </div>
                <button
                  onClick={handleNext}
                  className="mt-4 w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
                >
                  {questionIndex + 1 >= questions.length ? "See results" : "Next question →"}
                </button>
              </>
            )}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-neutral-400">
          This is a v0 preview with 2 questions per role.{" "}
          <Link href="/#waitlist" className="underline hover:text-neutral-600">
            Join the waitlist
          </Link>{" "}
          for the full adaptive experience.
        </p>
      </div>
    </div>
  );
}
