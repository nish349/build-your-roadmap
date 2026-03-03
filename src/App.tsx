import { useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Layers,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Target,
} from 'lucide-react';
import {
  BACKEND_OPTIONS,
  DATABASE_OPTIONS,
  DEFAULT_WIZARD_STATE,
  EXPERTISE_ORDER,
  EXPERTISE_PROFILES,
  FRONTEND_OPTIONS,
  GOAL_LABELS,
  STORAGE_KEY,
  TESTING_DEPTH_LABELS,
} from './app/catalog';
import { generateRoadmap, getVisibleOptions, sanitizeWizardState } from './app/engine';
import { useLocalStorageState } from './app/useLocalStorageState';
import type {
  GoalType,
  RoadmapSkill,
  StackOption,
  TestingDepth,
  WizardState,
} from './app/types';

type ViewMode = 'wizard' | 'results';

interface SessionState {
  wizard: WizardState;
  step: number;
  mode: ViewMode;
}

interface ChoiceCardProps {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  tags?: string[];
  meta?: string;
  disabled?: boolean;
}

const STEPS: Array<{ title: string; description: string }> = [
  { title: 'Profile', description: 'Set expertise and objective.' },
  { title: 'Frontend', description: 'Choose your UI stack.' },
  { title: 'Backend', description: 'Choose your server stack.' },
  { title: 'Database', description: 'Choose your persistence model.' },
  { title: 'Preferences', description: 'Set time and depth.' },
];

const LAST_STEP_INDEX = STEPS.length - 1;

const INITIAL_SESSION: SessionState = {
  wizard: DEFAULT_WIZARD_STATE,
  step: 0,
  mode: 'wizard',
};

function tierClassName(tier: RoadmapSkill['tier']): string {
  if (tier === 'core') {
    return 'bg-emerald-100 text-emerald-700';
  }

  if (tier === 'advanced') {
    return 'bg-amber-100 text-amber-700';
  }

  return 'bg-blue-100 text-blue-700';
}

function optionById(options: StackOption[], id: string | null): StackOption | null {
  if (!id) {
    return null;
  }
  return options.find((option) => option.id === id) ?? null;
}

function ChoiceCard({
  title,
  description,
  selected,
  onClick,
  tags,
  meta,
  disabled,
}: ChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-2xl border p-4 text-left transition ${
        selected
          ? 'border-amber-400 bg-amber-50 shadow-md shadow-amber-100'
          : 'border-slate-200 bg-white hover:border-slate-300'
      } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
    >
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-xs text-slate-600">{description}</p>
      {meta && <p className="mt-2 text-xs font-medium text-slate-500">{meta}</p>}
      {tags && tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}

interface StackChoiceStepProps {
  options: StackOption[];
  selectedId: string | null;
  hiddenCount: number;
  onChoose: (id: string) => void;
  label: string;
}

function StackChoiceStep({ options, selectedId, hiddenCount, onChoose, label }: StackChoiceStepProps) {
  return (
    <div>
      {hiddenCount > 0 && (
        <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
          {hiddenCount} advanced {label} option(s) are hidden for your current expertise level.
        </p>
      )}
      <div className="grid gap-3 md:grid-cols-2">
        {options.map((option) => (
          <ChoiceCard
            key={option.id}
            title={option.label}
            description={option.description}
            selected={selectedId === option.id}
            onClick={() => onChoose(option.id)}
            tags={option.tags}
          />
        ))}
      </div>
    </div>
  );
}

function App() {
  const [session, setSession] = useLocalStorageState<SessionState>(STORAGE_KEY, INITIAL_SESSION);
  const wizard = sanitizeWizardState(session.wizard);

  const frontendSelection = optionById(FRONTEND_OPTIONS, wizard.frontendId);
  const backendSelection = optionById(BACKEND_OPTIONS, wizard.backendId);
  const databaseSelection = optionById(DATABASE_OPTIONS, wizard.databaseId);

  const frontendOptions = getVisibleOptions('frontend', wizard.expertise);
  const backendOptions = getVisibleOptions('backend', wizard.expertise);
  const databaseOptions = getVisibleOptions('database', wizard.expertise);

  const generatedRoadmap = useMemo(() => generateRoadmap(wizard), [wizard]);

  const stepValid = useMemo(() => {
    if (session.step === 0) {
      return Boolean(wizard.expertise);
    }
    if (session.step === 1) {
      return Boolean(wizard.frontendId);
    }
    if (session.step === 2) {
      return Boolean(wizard.backendId);
    }
    if (session.step === 3) {
      return Boolean(wizard.databaseId);
    }
    return wizard.weeklyHours >= 3;
  }, [session.step, wizard]);

  const progress = Math.round(((session.step + 1) / STEPS.length) * 100);

  const goalEntries = Object.entries(GOAL_LABELS) as Array<
    [GoalType, { label: string; summary: string }]
  >;
  const testingEntries = Object.entries(TESTING_DEPTH_LABELS) as Array<
    [TestingDepth, { label: string; summary: string }]
  >;

  const updateWizard = (patch: Partial<WizardState>) => {
    setSession((previous) => ({
      ...previous,
      mode: 'wizard',
      wizard: sanitizeWizardState({ ...previous.wizard, ...patch }),
    }));
  };

  const goNext = () => {
    if (!stepValid) {
      return;
    }

    setSession((previous) => {
      if (previous.step < LAST_STEP_INDEX) {
        return { ...previous, step: previous.step + 1 };
      }
      return { ...previous, mode: 'results' };
    });
  };

  const goBack = () => {
    setSession((previous) => ({
      ...previous,
      step: Math.max(0, previous.step - 1),
    }));
  };

  const resetSession = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(INITIAL_SESSION);
  };

  const renderWizardStep = () => {
    if (session.step === 0) {
      return (
        <div className="space-y-6">
          <div>
            <p className="mb-3 text-sm font-semibold text-slate-800">Current expertise</p>
            <div className="grid gap-3 md:grid-cols-3">
              {EXPERTISE_ORDER.map((level) => (
                <ChoiceCard
                  key={level}
                  title={EXPERTISE_PROFILES[level].label}
                  description={EXPERTISE_PROFILES[level].summary}
                  selected={wizard.expertise === level}
                  onClick={() => updateWizard({ expertise: level })}
                  meta={`Time multiplier: ${EXPERTISE_PROFILES[level].multiplier.toFixed(2)}x`}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-slate-800">Primary goal</p>
            <div className="grid gap-3 md:grid-cols-3">
              {goalEntries.map(([goal, info]) => (
                <ChoiceCard
                  key={goal}
                  title={info.label}
                  description={info.summary}
                  selected={wizard.goal === goal}
                  onClick={() => updateWizard({ goal })}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (session.step === 1) {
      return (
        <StackChoiceStep
          options={frontendOptions}
          selectedId={wizard.frontendId}
          hiddenCount={FRONTEND_OPTIONS.length - frontendOptions.length}
          onChoose={(frontendId) => updateWizard({ frontendId })}
          label="frontend"
        />
      );
    }

    if (session.step === 2) {
      return (
        <StackChoiceStep
          options={backendOptions}
          selectedId={wizard.backendId}
          hiddenCount={BACKEND_OPTIONS.length - backendOptions.length}
          onChoose={(backendId) => updateWizard({ backendId })}
          label="backend"
        />
      );
    }

    if (session.step === 3) {
      return (
        <StackChoiceStep
          options={databaseOptions}
          selectedId={wizard.databaseId}
          hiddenCount={DATABASE_OPTIONS.length - databaseOptions.length}
          onChoose={(databaseId) => updateWizard({ databaseId })}
          label="database"
        />
      );
    }

    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <label htmlFor="weeklyHours" className="text-sm font-semibold text-slate-800">
            Weekly learning hours
          </label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              id="weeklyHours"
              type="range"
              min={3}
              max={40}
              value={wizard.weeklyHours}
              onChange={(event) =>
                updateWizard({ weeklyHours: Number.parseInt(event.target.value, 10) })
              }
              className="w-full"
            />
            <input
              type="number"
              min={3}
              max={40}
              value={wizard.weeklyHours}
              onChange={(event) =>
                updateWizard({ weeklyHours: Number.parseInt(event.target.value || '3', 10) })
              }
              className="w-24 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
            />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <ChoiceCard
            title="Include Real-time"
            description="WebSockets and messaging modules."
            selected={wizard.includeRealtime}
            onClick={() => updateWizard({ includeRealtime: !wizard.includeRealtime })}
          />
          <ChoiceCard
            title="Include DevOps"
            description="CI/CD, containers, and cloud operations."
            selected={wizard.includeDevops}
            onClick={() => updateWizard({ includeDevops: !wizard.includeDevops })}
          />
          <ChoiceCard
            title="Enterprise Add-ons"
            description="Kubernetes, Terraform, and advanced architecture."
            selected={wizard.includeEnterprise}
            disabled={wizard.expertise === 'novice'}
            onClick={() => updateWizard({ includeEnterprise: !wizard.includeEnterprise })}
          />
        </div>

        {wizard.expertise === 'novice' && (
          <p className="text-xs text-slate-500">
            Enterprise add-ons unlock at Competent level and above.
          </p>
        )}

        <div>
          <p className="mb-3 text-sm font-semibold text-slate-800">Testing depth</p>
          <div className="grid gap-3 md:grid-cols-3">
            {testingEntries.map(([depth, info]) => (
              <ChoiceCard
                key={depth}
                title={info.label}
                description={info.summary}
                selected={wizard.testingDepth === depth}
                onClick={() => updateWizard({ testingDepth: depth })}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const wizardView = (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="rounded-3xl border border-slate-200/70 bg-white/85 p-5 shadow-xl shadow-amber-100/30 backdrop-blur">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Build Flow</h2>
        <div className="mt-5 space-y-3">
          {STEPS.map((step, index) => {
            const active = index === session.step;
            const done = index < session.step;
            return (
              <div
                key={step.title}
                className={`rounded-2xl border px-3 py-3 ${
                  active
                    ? 'border-amber-300 bg-amber-50'
                    : done
                      ? 'border-emerald-200 bg-emerald-50'
                      : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      done
                        ? 'bg-emerald-500 text-white'
                        : active
                          ? 'bg-amber-400 text-slate-900'
                          : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {done ? <CheckCircle2 size={14} /> : index + 1}
                  </span>
                  <p className="font-semibold text-slate-900">{step.title}</p>
                </div>
                <p className="mt-2 text-xs text-slate-600">{step.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Snapshot</p>
          <p className="mt-2">
            Expertise:{' '}
            <span className="font-semibold">
              {wizard.expertise ? EXPERTISE_PROFILES[wizard.expertise].label : 'Not selected'}
            </span>
          </p>
          <p>
            Frontend: <span className="font-semibold">{frontendSelection?.label ?? 'Not selected'}</span>
          </p>
          <p>
            Backend: <span className="font-semibold">{backendSelection?.label ?? 'Not selected'}</span>
          </p>
          <p>
            Database: <span className="font-semibold">{databaseSelection?.label ?? 'Not selected'}</span>
          </p>
        </div>
      </aside>

      <section className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-xl shadow-sky-100/40 backdrop-blur sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Step {session.step + 1} of {STEPS.length}
        </p>
        <h3 className="mt-2 text-2xl font-bold text-slate-900">{STEPS[session.step].title}</h3>
        <p className="mt-1 text-slate-600">{STEPS[session.step].description}</p>

        <div className="mt-6">{renderWizardStep()}</div>

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={session.step === 0}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${
              session.step === 0
                ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                : 'bg-slate-900 text-white hover:bg-slate-700'
            }`}
          >
            <ArrowLeft size={16} />
            Previous
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!stepValid}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold ${
              stepValid
                ? 'bg-amber-400 text-slate-900 hover:bg-amber-300'
                : 'cursor-not-allowed bg-slate-100 text-slate-400'
            }`}
          >
            {session.step === LAST_STEP_INDEX ? 'Generate Roadmap' : 'Continue'}
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );

  const resultsView = generatedRoadmap ? (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-xl shadow-sky-100/40 sm:p-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Golden Path</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Your Personalized Full-Stack Roadmap</h2>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
              <span className="rounded-full bg-slate-100 px-3 py-1">
                {EXPERTISE_PROFILES[generatedRoadmap.selectedStack.expertise].label}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1">
                {GOAL_LABELS[generatedRoadmap.selectedStack.goal].label}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1">
                {generatedRoadmap.selectedStack.frontend.label}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1">
                {generatedRoadmap.selectedStack.backend.label}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1">
                {generatedRoadmap.selectedStack.database.label}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => setSession((previous) => ({ ...previous, mode: 'wizard' }))}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Edit Selections
            </button>
            <button
              type="button"
              onClick={resetSession}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RotateCcw size={16} />
              Start Over
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Hours</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{generatedRoadmap.totalHours}h</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Weekly Pace</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{wizard.weeklyHours}h</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Timeline</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{generatedRoadmap.estimatedWeeks} weeks</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Expertise Factor</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {generatedRoadmap.expertiseMultiplier.toFixed(2)}x
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
        <h3 className="flex items-center gap-2 text-lg font-bold text-amber-900">
          <Lightbulb size={18} />
          Wise Notes
        </h3>
        <ul className="mt-3 space-y-2 text-sm text-amber-900">
          {generatedRoadmap.wiseNotes.map((note) => (
            <li key={note} className="rounded-xl bg-white/70 px-3 py-2">
              {note}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        {generatedRoadmap.categories.map((category) => (
          <article
            key={category.id}
            className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-xl shadow-slate-100/70 sm:p-6"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{category.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{category.objective}</p>
              </div>
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                {category.subtotalHours}h
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {category.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-900">{skill.title}</p>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${tierClassName(skill.tier)}`}>
                        {skill.tier}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{skill.explanation}</p>
                  </div>
                  <div className="shrink-0 rounded-xl bg-white px-3 py-1 text-sm font-semibold text-slate-800">
                    {skill.adjustedHours}h
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-xl shadow-slate-100/70 sm:p-6">
        <h3 className="text-xl font-bold text-slate-900">Alternatives and Next Steps</h3>
        <p className="mt-1 text-sm text-slate-600">
          Optional paths you can switch to later based on project constraints or career goals.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {generatedRoadmap.alternatives.map((alternative) => (
            <div key={alternative.category} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">{alternative.category}</p>
              <div className="mt-3 space-y-3">
                {alternative.options.length > 0 ? (
                  alternative.options.map((option) => (
                    <div key={option.id} className="rounded-xl bg-white p-3">
                      <p className="text-sm font-semibold text-slate-900">{option.label}</p>
                      <p className="mt-1 text-xs text-slate-600">{option.reason}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No additional alternatives at this level.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  ) : null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#fff8ec] via-[#f3f8ff] to-[#eef7f7] text-slate-900">
      <div className="pointer-events-none absolute -left-20 top-[-60px] h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-80px] left-1/4 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />

      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-3xl border border-slate-200/70 bg-white/85 p-5 shadow-xl shadow-amber-100/40 backdrop-blur sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Interactive Roadmap Generator
              </p>
              <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
                Build a Full-Stack Learning Path That Fits Your Level
              </h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-600 sm:text-base">
                Wizard-based roadmap generation with expertise-aware filtering, estimated learning
                timeline, and structured alternatives.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
              <Sparkles size={16} />
              Session auto-saved
            </div>
          </div>
          {session.mode === 'wizard' && (
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-sky-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </header>

        <section className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Aim</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">Beginner to Advanced</p>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 backdrop-blur">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <Target size={14} /> Personalization
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">Expertise + Goal + Stack</p>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 backdrop-blur">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <Clock3 size={14} /> Time Model
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">CCH x Expertise Multiplier</p>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 backdrop-blur">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <Layers size={14} /> Output
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">Golden Path + Alternatives</p>
          </div>
        </section>

        {session.mode === 'wizard' ? wizardView : resultsView}
      </main>
    </div>
  );
}

export default App;
