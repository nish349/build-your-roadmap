import {
  API_AND_INTEGRATION_SKILLS,
  AUTH_SECURITY_SKILLS,
  BACKEND_SKILLS_BY_OPTION,
  DEVOPS_SKILLS,
  ENTERPRISE_AUTH_SKILLS,
  ENTERPRISE_DEVOPS_SKILLS,
  ENTERPRISE_REALTIME_SKILLS,
  EXPERTISE_ORDER,
  EXPERTISE_PROFILES,
  FRONTEND_SKILLS_BY_OPTION,
  GOAL_SKILLS,
  LIGHT_DEPLOYMENT_SKILLS,
  OPTION_GROUPS,
  REALTIME_SKILLS,
  TESTING_SKILLS_BY_DEPTH,
  CORE_FOUNDATION_SKILLS,
  DATABASE_SKILLS_BY_OPTION,
} from './catalog';
import type {
  AlternativePath,
  ExpertiseLevel,
  GeneratedRoadmap,
  OptionGroup,
  RoadmapCategory,
  SkillTemplate,
  StackOption,
  WizardState,
} from './types';

const MIN_WEEKLY_HOURS = 3;
const MAX_WEEKLY_HOURS = 40;

const EXPERTISE_RANK: Record<ExpertiseLevel, number> = {
  novice: 0,
  competent: 1,
  polishing: 2,
};

function hasAccess(current: ExpertiseLevel, minExpertise?: ExpertiseLevel): boolean {
  if (!minExpertise) {
    return true;
  }

  return EXPERTISE_RANK[current] >= EXPERTISE_RANK[minExpertise];
}

function roundHours(hours: number): number {
  return Math.max(2, Math.round(hours));
}

function clampWeeklyHours(value: number): number {
  return Math.min(MAX_WEEKLY_HOURS, Math.max(MIN_WEEKLY_HOURS, value));
}

function toRoadmapCategory(
  id: string,
  title: string,
  objective: string,
  templates: SkillTemplate[],
  expertise: ExpertiseLevel,
  multiplier: number,
): RoadmapCategory {
  const filteredTemplates = templates.filter((template) =>
    hasAccess(expertise, template.minExpertise),
  );

  const skills = filteredTemplates.map((template) => {
    const adjustedHours = roundHours(template.cch * multiplier);
    return {
      id: template.id,
      title: template.title,
      explanation: template.explanation,
      tier: template.tier,
      baseHours: template.cch,
      adjustedHours,
    };
  });

  const subtotalHours = skills.reduce((sum, skill) => sum + skill.adjustedHours, 0);

  return {
    id,
    title,
    objective,
    skills,
    subtotalHours,
  };
}

function stackSkill(option: StackOption, prefix: string): SkillTemplate {
  return {
    id: `${prefix}-${option.id}`,
    title: `${option.label} Fundamentals`,
    explanation: option.description,
    cch: option.cch,
    tier: 'core',
    minExpertise: option.minExpertise,
  };
}

function pickAlternatives(
  category: string,
  selectedId: string,
  options: StackOption[],
  expertise: ExpertiseLevel,
): AlternativePath {
  const alternatives = options
    .filter((option) => option.id !== selectedId)
    .filter((option) => hasAccess(expertise, option.minExpertise))
    .slice(0, 3)
    .map((option) => ({
      id: option.id,
      label: option.label,
      reason: option.description,
    }));

  return { category, options: alternatives };
}

function buildWiseNotes(
  expertise: ExpertiseLevel,
  frontend: StackOption,
  backend: StackOption,
  database: StackOption,
  wizard: WizardState,
): string[] {
  const notes: string[] = [];

  if (frontend.id === 'react' && backend.id === 'node-express') {
    notes.push(
      'If project scope grows, NestJS is a strong next step for modular structure and team scaling.',
    );
  }

  if (frontend.id === 'nextjs' && backend.id === 'node-express') {
    notes.push(
      'You can keep thin APIs in Next.js route handlers and reserve Express for domain-heavy services.',
    );
  }

  if (database.id === 'mongodb' && backend.id === 'java-spring') {
    notes.push(
      'Spring + MongoDB can work well, but enforce schema governance early to avoid data drift.',
    );
  }

  if (wizard.includeRealtime && !wizard.includeDevops) {
    notes.push(
      'Realtime features are enabled without DevOps depth, so add monitoring and incident playbooks early.',
    );
  }

  if (wizard.includeEnterprise) {
    notes.push(
      'Enterprise mode is active, so advanced architecture and operational reliability tracks are included.',
    );
  }

  if (wizard.testingDepth === 'starter') {
    notes.push(
      'Starter testing is lightweight; add integration and E2E coverage once your first release stabilizes.',
    );
  }

  if (expertise === 'novice') {
    notes.push(
      'Keep scope tight: ship one end-to-end project first, then layer in advanced tooling incrementally.',
    );
  }

  if (wizard.goal === 'scale-architect' && wizard.weeklyHours < 8) {
    notes.push(
      'Scale-architect goals are ambitious with low weekly hours, so expect a longer timeline and staged milestones.',
    );
  }

  if (
    (frontend.id === 'react' || frontend.id === 'nextjs') &&
    (backend.id === 'node-express' || backend.id === 'node-nest')
  ) {
    notes.push(
      'TypeScript end-to-end is a high-leverage choice for this stack and reduces integration defects.',
    );
  }

  if (notes.length === 0) {
    notes.push(
      'Your stack is balanced. Focus on project repetition and deployment discipline to build confidence quickly.',
    );
  }

  return notes;
}

function findOption(group: OptionGroup, id: string): StackOption | null {
  const match = OPTION_GROUPS[group].find((option) => option.id === id);
  return match ?? null;
}

export function getVisibleOptions(group: OptionGroup, expertise: ExpertiseLevel | null): StackOption[] {
  if (!expertise) {
    return OPTION_GROUPS[group];
  }

  return OPTION_GROUPS[group].filter((option) => hasAccess(expertise, option.minExpertise));
}

export function sanitizeWizardState(state: WizardState): WizardState {
  const expertise = state.expertise;
  const fallbackExpertise = EXPERTISE_ORDER[0];
  const effectiveExpertise = expertise ?? fallbackExpertise;

  const frontendVisible = getVisibleOptions('frontend', effectiveExpertise);
  const backendVisible = getVisibleOptions('backend', effectiveExpertise);
  const databaseVisible = getVisibleOptions('database', effectiveExpertise);

  const frontendId = frontendVisible.some((option) => option.id === state.frontendId)
    ? state.frontendId
    : null;
  const backendId = backendVisible.some((option) => option.id === state.backendId)
    ? state.backendId
    : null;
  const databaseId = databaseVisible.some((option) => option.id === state.databaseId)
    ? state.databaseId
    : null;

  const includeEnterprise = expertise !== 'novice' && state.includeEnterprise;

  return {
    ...state,
    frontendId,
    backendId,
    databaseId,
    includeEnterprise,
    weeklyHours: clampWeeklyHours(state.weeklyHours),
  };
}

export function isWizardComplete(state: WizardState): boolean {
  return Boolean(state.expertise && state.frontendId && state.backendId && state.databaseId);
}

export function generateRoadmap(rawState: WizardState): GeneratedRoadmap | null {
  const state = sanitizeWizardState(rawState);

  if (!isWizardComplete(state) || !state.expertise) {
    return null;
  }

  const frontend = findOption('frontend', state.frontendId as string);
  const backend = findOption('backend', state.backendId as string);
  const database = findOption('database', state.databaseId as string);

  if (!frontend || !backend || !database) {
    return null;
  }

  const multiplier = EXPERTISE_PROFILES[state.expertise].multiplier;

  const coreCategory = toRoadmapCategory(
    'core',
    'Core Competency',
    'Build fundamentals that keep every future framework decision stable.',
    [...CORE_FOUNDATION_SKILLS, ...GOAL_SKILLS[state.goal]],
    state.expertise,
    multiplier,
  );

  const frontendCategory = toRoadmapCategory(
    'frontend',
    'Frontend Track',
    'Deliver usable interfaces with a production-ready rendering strategy.',
    [stackSkill(frontend, 'frontend'), ...(FRONTEND_SKILLS_BY_OPTION[frontend.id] ?? [])],
    state.expertise,
    multiplier,
  );

  const backendCategory = toRoadmapCategory(
    'backend',
    'Backend Track',
    'Build secure business logic, APIs, and reliable service boundaries.',
    [stackSkill(backend, 'backend'), ...(BACKEND_SKILLS_BY_OPTION[backend.id] ?? [])],
    state.expertise,
    multiplier,
  );

  const dataCategory = toRoadmapCategory(
    'data',
    'Data Layer',
    'Model persistence and optimize query behavior for expected traffic.',
    [stackSkill(database, 'database'), ...(DATABASE_SKILLS_BY_OPTION[database.id] ?? [])],
    state.expertise,
    multiplier,
  );

  const apiSkills = API_AND_INTEGRATION_SKILLS.filter((skill) => {
    if (skill.id === 'api-trpc') {
      return (
        (frontend.id === 'react' || frontend.id === 'nextjs') &&
        (backend.id === 'node-express' || backend.id === 'node-nest')
      );
    }

    if (skill.id === 'api-grpc') {
      return state.includeEnterprise;
    }

    if (skill.id === 'api-graphql') {
      return state.goal !== 'project-builder';
    }

    return true;
  });

  if (state.includeRealtime) {
    apiSkills.push(...REALTIME_SKILLS);
  }

  if (state.includeRealtime && state.includeEnterprise) {
    apiSkills.push(...ENTERPRISE_REALTIME_SKILLS);
  }

  const apiCategory = toRoadmapCategory(
    'api',
    'API and Integration',
    'Design service contracts that remain stable as product complexity grows.',
    apiSkills,
    state.expertise,
    multiplier,
  );

  const authSkills = [...AUTH_SECURITY_SKILLS];
  if (state.includeEnterprise) {
    authSkills.push(...ENTERPRISE_AUTH_SKILLS);
  }

  const authCategory = toRoadmapCategory(
    'security',
    'Auth and Security',
    'Protect user identity, data integrity, and platform trustworthiness.',
    authSkills,
    state.expertise,
    multiplier,
  );

  const devopsSkills = state.includeDevops ? [...DEVOPS_SKILLS] : [...LIGHT_DEPLOYMENT_SKILLS];
  if (state.includeDevops && state.includeEnterprise) {
    devopsSkills.push(...ENTERPRISE_DEVOPS_SKILLS);
  }

  const devopsCategory = toRoadmapCategory(
    'devops',
    'Cloud and DevOps',
    'Automate delivery and improve reliability as systems evolve.',
    devopsSkills,
    state.expertise,
    multiplier,
  );

  const testingCategory = toRoadmapCategory(
    'testing',
    'Testing and Reliability',
    'Prevent regressions and ship safely with fit-for-purpose test depth.',
    TESTING_SKILLS_BY_DEPTH[state.testingDepth],
    state.expertise,
    multiplier,
  );

  const categories: RoadmapCategory[] = [
    coreCategory,
    frontendCategory,
    backendCategory,
    dataCategory,
    apiCategory,
    authCategory,
    devopsCategory,
    testingCategory,
  ];

  const totalHours = categories.reduce((sum, category) => sum + category.subtotalHours, 0);
  const estimatedWeeks = Math.max(1, Math.ceil(totalHours / state.weeklyHours));

  const alternatives: AlternativePath[] = [
    pickAlternatives('Frontend Alternatives', frontend.id, OPTION_GROUPS.frontend, state.expertise),
    pickAlternatives('Backend Alternatives', backend.id, OPTION_GROUPS.backend, state.expertise),
    pickAlternatives('Database Alternatives', database.id, OPTION_GROUPS.database, state.expertise),
  ];

  const wiseNotes = buildWiseNotes(state.expertise, frontend, backend, database, state);

  return {
    selectedStack: {
      expertise: state.expertise,
      goal: state.goal,
      frontend,
      backend,
      database,
    },
    expertiseMultiplier: multiplier,
    totalHours,
    estimatedWeeks,
    categories,
    wiseNotes,
    alternatives,
  };
}
