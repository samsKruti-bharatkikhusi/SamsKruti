"use client";

import { useState } from "react";
import brand from "@/styles/brand.module.css";
import styles from "./the-asking.module.css";

// ── The guide's own WhatsApp ──────────────────────────────────────
// Country code, no "+", no spaces. e.g. "919812345678".
// TODO: set this before /guide goes live — the send button builds a
// wa.me link from it, so an empty value leaves the flow with no exit.
const GUIDE_WHATSAPP = "";

// ── The three questions ───────────────────────────────────────────
// Phrased as feelings, not categories. Aklavya does not know what
// "Hriday" means, and asking him to pick a segment is asking him to
// already understand the city he came here confused about.
type Question = {
  key: "days" | "pull" | "pace";
  ask: string;
  aside?: string;
  options: string[];
  // The honest answer for a first-timer, set apart from the rest.
  out?: string;
};

const QUESTIONS: Question[] = [
  {
    key: "days",
    ask: "How long do you have in Varanasi?",
    aside: "Roughly is fine. It changes everything about what I'd send you to.",
    options: ["One day", "Two or three days", "Four or five days", "A week or more"],
  },
  {
    key: "pull",
    ask: "What pulls you?",
    aside: "There is no wrong answer, and you can want more than one thing.",
    options: [
      "The river and the rituals",
      "The food",
      "The makers and their hands",
      "Just walking, no plan",
    ],
    out: "I don't know — you decide",
  },
  {
    key: "pace",
    ask: "What kind of trip is this?",
    aside: "Both are good trips. They are just not the same trip.",
    options: [
      "Slow. A few things, done properly.",
      "Full. As much as I can hold.",
    ],
  },
];

const ARRIVALS = ["Morning", "Afternoon", "Evening"] as const;

type Answers = Partial<Record<Question["key"], string>>;

export function TheAsking() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [name, setName] = useState("");
  const [arrival, setArrival] = useState<string>("");

  const isHandoff = step === QUESTIONS.length;

  function choose(key: Question["key"], value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    // A beat, so the selection is seen before the screen moves on.
    setTimeout(() => setStep((s) => s + 1), 180);
  }

  // Everything he told us, as one message. No backend: the founder IS
  // the guide, so his answers go straight to a human.
  const message = [
    `Hi — I'd like to be guided in Varanasi.`,
    ``,
    name ? `Name: ${name}` : null,
    `Days: ${answers.days ?? "—"}`,
    `Pulls me: ${answers.pull ?? "—"}`,
    `Pace: ${answers.pace ?? "—"}`,
    arrival ? `I land in the: ${arrival}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const waHref = GUIDE_WHATSAPP
    ? `https://wa.me/${GUIDE_WHATSAPP}?text=${encodeURIComponent(message)}`
    : "";

  return (
    <div className={`${brand.scope} ${styles.asking}`}>
      <div className={styles.bar}>
        <button
          type="button"
          className={`${styles.back}${step === 0 ? ` ${styles.backHidden}` : ""}`}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          aria-label="Previous question"
          tabIndex={step === 0 ? -1 : undefined}
        >
          <span aria-hidden="true">&larr;</span> Back
        </button>
        <span className={styles.count}>
          {isHandoff ? "Almost done" : `Question ${step + 1} of ${QUESTIONS.length}`}
        </span>
      </div>

      <div className={styles.ticks} aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`${styles.tick}${i <= step ? ` ${styles.tickOn}` : ""}`}
          />
        ))}
      </div>

      <main className={styles.stage}>
        {isHandoff ? (
          <div className={`${styles.inner} ${styles.enter}`} key="handoff">
            <h1 className={styles.question}>Where do I send it?</h1>
            <p className={styles.aside}>
              I write these by hand, so give me a few hours. It costs nothing.
            </p>

            <div className={styles.sheet}>
            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryKey}>Days</span>
                <span className={styles.summaryVal}>{answers.days}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryKey}>Pulls you</span>
                <span className={styles.summaryVal}>{answers.pull}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryKey}>Pace</span>
                <span className={styles.summaryVal}>{answers.pace}</span>
              </div>
            </div>

            <div className={styles.fields}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="asking-name">
                  What should I call you?
                </label>
                <input
                  id="asking-name"
                  className={styles.input}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="given-name"
                />
              </div>

              <div className={styles.field}>
                <span className={styles.label}>When do you land?</span>
                <div className={styles.arrivals}>
                  {ARRIVALS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      className={`${styles.arrival}${
                        arrival === a ? ` ${styles.arrivalOn}` : ""
                      }`}
                      aria-pressed={arrival === a}
                      onClick={() => setArrival(a)}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <a
              className={`${styles.send}${!waHref || !name ? ` ${styles.sendOff}` : ""}`}
              href={waHref || undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!waHref || !name}
            >
              Send this to your guide
              <span aria-hidden="true">&rarr;</span>
            </a>
            <p className={styles.fine}>Opens WhatsApp &middot; nothing is charged</p>
            </div>

            <p className={styles.promise}>
              You will not be handed a list. You will be walked through it.
            </p>
          </div>
        ) : (
          <div className={`${styles.inner} ${styles.enter}`} key={step}>
            <h1 className={styles.question}>{QUESTIONS[step].ask}</h1>
            {QUESTIONS[step].aside && (
              <p className={styles.aside}>{QUESTIONS[step].aside}</p>
            )}

            <ul className={styles.options}>
              {QUESTIONS[step].options.map((opt) => {
                const on = answers[QUESTIONS[step].key] === opt;
                return (
                  <li key={opt}>
                    <button
                      type="button"
                      className={`${styles.option}${on ? ` ${styles.optionOn}` : ""}`}
                      aria-pressed={on}
                      onClick={() => choose(QUESTIONS[step].key, opt)}
                    >
                      {opt}
                      <span className={styles.optionMark} aria-hidden="true">
                        &#10003;
                      </span>
                    </button>
                  </li>
                );
              })}

              {QUESTIONS[step].out && (
                <li>
                  <button
                    type="button"
                    className={`${styles.option} ${styles.optionOut}${
                      answers[QUESTIONS[step].key] === QUESTIONS[step].out
                        ? ` ${styles.optionOn}`
                        : ""
                    }`}
                    aria-pressed={answers[QUESTIONS[step].key] === QUESTIONS[step].out}
                    onClick={() => choose(QUESTIONS[step].key, QUESTIONS[step].out!)}
                  >
                    {QUESTIONS[step].out}
                    <span className={styles.optionMark} aria-hidden="true">
                      &#10003;
                    </span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
