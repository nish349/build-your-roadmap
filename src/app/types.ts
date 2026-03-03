export type ExpertiseLevel = 'novice' | 'competent' | 'polishing';

export type GoalType = 'job-ready' | 'project-builder' | 'scale-architect';

export type TestingDepth = 'starter' | 'standard' | 'strict';

export type OptionGroup = 'frontend' | 'backend' | 'database';

export interface StackOption {
  id: string;
  group: OptionGroup;
  label: string;
  description: string;
  cch: number;
  minExpertise?: ExpertiseLevel;
  tags: string[];
}

export interface WizardState {
  expertise: ExpertiseLevel | null;
  goal: GoalType;
  frontendId: string | null;
  backendId: string | null;
  databaseId: string | null;
  weeklyHours: number;
  includeRealtime: boolean;
  includeDevops: boolean;
  includeEnterprise: boolean;
  testingDepth: TestingDepth;
}

export interface SkillTemplate {
  id: string;
  title: string;
  explanation: string;
  cch: number;
  tier: 'core' | 'recommended' | 'advanced';
  minExpertise?: ExpertiseLevel;
}

export interface RoadmapSkill {
  id: string;
  title: string;
  explanation: string;
  tier: 'core' | 'recommended' | 'advanced';
  baseHours: number;
  adjustedHours: number;
}

export interface RoadmapCategory {
  id: string;
  title: string;
  objective: string;
  skills: RoadmapSkill[];
  subtotalHours: number;
}

export interface AlternativeOption {
  id: string;
  label: string;
  reason: string;
}

export interface AlternativePath {
  category: string;
  options: AlternativeOption[];
}

export interface SelectedStack {
  expertise: ExpertiseLevel;
  goal: GoalType;
  frontend: StackOption;
  backend: StackOption;
  database: StackOption;
}

export interface GeneratedRoadmap {
  selectedStack: SelectedStack;
  expertiseMultiplier: number;
  totalHours: number;
  estimatedWeeks: number;
  categories: RoadmapCategory[];
  wiseNotes: string[];
  alternatives: AlternativePath[];
}
