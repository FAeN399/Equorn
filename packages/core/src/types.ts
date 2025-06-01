/**
 * Core type definitions for Equorn
 */

export interface SeedConfig {
  name: string;
  version: string;
  author: string;
  description: string;
  entity?: EntityConfig;
  environment?: EnvironmentConfig;
  quests?: QuestConfig[];
  export?: ExportConfig;
  // Enhanced narrative fields
  characters?: Record<string, Character>;
  environments?: Record<string, Environment>;
  items?: Record<string, Item>;
  metadata?: {
    genre?: string;
    themes?: string[];
    mood?: string;
  };
  narrative?: {
    themes: string[];
    pacing: 'slow' | 'medium' | 'fast';
    complexity: 'simple' | 'branching' | 'emergent';
    agencyLevel: number; // 0-1 scale
    storylets?: StoryletSeed[];
  };
  dynamics?: {
    characterArcs: CharacterArc[];
    conflictEscalation: ConflictPattern[];
    worldEvents: TemporalEvent[];
  };
}

export interface Character {
  name: string;
  description?: string;
  type?: string;
  alignment?: string;
  attributes?: Record<string, any>;
  appearance?: {
    form: string;
    height: string;
    features: Array<Record<string, string>>;
  };
  lore?: {
    origin: string;
    purpose: string;
    weaknesses: string;
  };
  powers?: {
    name: string;
    description: string;
    effects: string[];
  }[];
  interactions?: {
    trigger: string;
    response: string;
  }[];
  relationships?: Array<{
    entity: string;
    type: string;
    notes: string;
  }>;
}

export interface Environment {
  name: string;
  type?: string;
  description?: string;
  features?: Array<{ [feature: string]: string }>;
  seasons?: Array<{
    name: string;
    events: string[];
  }>;
  atmosphere?: {
    sound?: string;
    light?: string;
    weather?: string;
  };
}

export interface Item {
  name: string;
  description?: string;
  type?: string;
  attributes?: Record<string, any>;
  effects?: string[];
}

export interface StoryletSeed {
  trigger: string;
  content: string;
  weight?: number;
  tags?: string[];
}

export interface CharacterArc {
  characterId: string;
  stages: string[];
  conflicts: string[];
  growth: string[];
}

export interface ConflictPattern {
  type: 'internal' | 'interpersonal' | 'societal' | 'environmental';
  escalation: string[];
  resolution?: string[];
}

export interface TemporalEvent {
  trigger: string;
  effects: string[];
  timing: 'early' | 'middle' | 'late' | 'any';
}

// Legacy interfaces for backward compatibility
export interface EntityConfig extends Character {}
export interface EnvironmentConfig extends Environment {}

export interface QuestConfig {
  name: string;
  trigger: string;
  objective: string;
  type: string;
  description?: string;
  reward?: string;
  completion?: string;
  followup?: string;
  steps?: Array<{
    name?: string;
    description?: string;
    hints?: string[];
  }>;
}

export interface ExportTargetConfig {
  scene?: string;
  character?: string;
  theme?: string;
  primaryColor?: string;
  accentColor?: string;
  fonts?: {
    heading: string;
    body: string;
  };
}

export interface ExportConfig {
  [key: string]: ExportTargetConfig;
}

export interface GenerationOptions {
  target: 'godot' | 'unity' | 'web' | 'docs';
  outputDir?: string;
  verbose?: boolean;
}

export interface GenerationResult {
  files: string[];
  generationTime: number;
  statistics: {
    totalFiles: number;
    linesOfCode: number;
    targetPlatform: string;
  };
}

export interface Generator {
  generate(seed: SeedConfig, options: GenerationOptions): Promise<void>;
}
