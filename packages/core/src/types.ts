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
}

export interface EntityConfig {
  name: string;
  type: string;
  alignment: string;
  description?: string;
  attributes?: Record<string, any>;
  effects?: string[];
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

export interface EnvironmentConfig {
  name: string;
  type: string;
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

export interface Generator {
  generate(seed: SeedConfig, options: GenerationOptions): Promise<void>;
}
