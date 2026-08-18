import type { InterviewLevel } from "@/types/content";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { QUESTION_COUNT_OPTIONS, type Mode, type QuestionCount } from "@/lib/simulator/session";

export function SimulatorConfig({
  topics,
  level,
  topic,
  mode,
  questionCount,
  onLevelChange,
  onTopicChange,
  onModeChange,
  onQuestionCountChange,
  onStart,
  dict,
}: {
  topics: string[];
  level: InterviewLevel | "todos";
  topic: string;
  mode: Mode;
  questionCount: QuestionCount;
  onLevelChange: (level: InterviewLevel | "todos") => void;
  onTopicChange: (topic: string) => void;
  onModeChange: (mode: Mode) => void;
  onQuestionCountChange: (count: QuestionCount) => void;
  onStart: () => void;
  dict: Dictionary;
}) {
  return (
    <div className="rounded-md border border-[var(--color-border)] p-6">
      <h2 className="text-lg font-semibold text-[var(--color-text)]">{dict.simulator.configureTitle}</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--color-text)]">{dict.simulator.levelLabel}</span>
          <select
            value={level}
            onChange={(e) => onLevelChange(e.target.value as InterviewLevel | "todos")}
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2"
          >
            <option value="todos">{dict.simulator.allLevels}</option>
            <option value="pleno">{dict.simulator.levelLabels.pleno}</option>
            <option value="senior">{dict.simulator.levelLabels.senior}</option>
            <option value="tech-lead">{dict.simulator.levelLabels["tech-lead"]}</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--color-text)]">{dict.simulator.topicLabel}</span>
          <select
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2"
          >
            <option value="todos">{dict.simulator.allTopics}</option>
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--color-text)]">{dict.simulator.questionCountLabel}</span>
          <select
            value={questionCount}
            onChange={(e) => onQuestionCountChange(Number(e.target.value) as QuestionCount)}
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2"
          >
            {QUESTION_COUNT_OPTIONS.map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </label>
      </div>
      <fieldset className="mt-4">
        <legend className="text-sm font-medium text-[var(--color-text)]">{dict.simulator.modeLabel}</legend>
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(["aberta", "multipla-escolha"] as const).map((m) => (
            <label
              key={m}
              className={`cursor-pointer rounded-md border p-3 text-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--color-accent)] ${
                mode === m ? "border-[var(--color-accent)]" : "border-[var(--color-border)]"
              }`}
            >
              <input
                type="radio"
                name="mode"
                className="sr-only"
                checked={mode === m}
                onChange={() => onModeChange(m)}
              />
              <span className="font-medium text-[var(--color-text)]">{dict.simulator.modeLabels[m]}</span>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                {dict.simulator.modeDescriptions[m]}
              </p>
            </label>
          ))}
        </div>
      </fieldset>
      <button
        type="button"
        onClick={onStart}
        className="mt-6 rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white"
      >
        {dict.simulator.startButton}
      </button>
    </div>
  );
}
