export interface Storylet {
  id: string;
  name: string;
  trigger: string; // Natural language condition
  content: {
    description: string;
    actions: string[];
    consequences: string[];
  };
  weight: number;
  cooldown?: number;
  tags: string[];
  lastUsed?: number;
  prerequisites?: string[];
  excludes?: string[];
}

export interface WorldState {
  characters: Map<string, CharacterState>;
  locations: Map<string, LocationState>;
  items: Map<string, ItemState>;
  relationships: Map<string, RelationshipState>;
  globalFlags: Set<string>;
  timelinePosition: number;
  tension: number; // 0-1 scale
  mood: 'tragic' | 'comedic' | 'epic' | 'mysterious' | 'romantic';
}

export interface CharacterState {
  id: string;
  name: string;
  location: string;
  health: number;
  motivation: string;
  relationships: string[];
  inventory: string[];
  flags: Set<string>;
}

export interface LocationState {
  id: string;
  name: string;
  description: string;
  characters: string[];
  items: string[];
  connections: string[];
  flags: Set<string>;
}

export interface ItemState {
  id: string;
  name: string;
  description: string;
  location?: string;
  owner?: string;
  flags: Set<string>;
}

export interface RelationshipState {
  id: string;
  characterA: string;
  characterB: string;
  type: 'friend' | 'enemy' | 'lover' | 'rival' | 'mentor' | 'family';
  strength: number; // -1 to 1
  history: string[];
}

export interface NarrativeContext {
  recentStorylets: string[];
  currentScene: string;
  activeCharacters: string[];
  narrativeGoals: string[];
  pacing: 'slow' | 'medium' | 'fast';
  tension: number;
  lastConflict?: string;
}

export class StoryletDatabase {
  private storylets: Map<string, Storylet> = new Map();
  private usageHistory: Map<string, number[]> = new Map();

  constructor(initialStorylets: Storylet[] = []) {
    initialStorylets.forEach(storylet => {
      this.storylets.set(storylet.id, storylet);
      this.usageHistory.set(storylet.id, []);
    });
  }

  addStorylet(storylet: Storylet): void {
    this.storylets.set(storylet.id, storylet);
    this.usageHistory.set(storylet.id, []);
  }

  removeStorylet(id: string): void {
    this.storylets.delete(id);
    this.usageHistory.delete(id);
  }

  evaluateAvailable(worldState: WorldState, context: NarrativeContext): Storylet[] {
    const available: Storylet[] = [];
    const currentTime = Date.now();

    for (const storylet of this.storylets.values()) {
      // Check cooldown
      if (storylet.cooldown && storylet.lastUsed) {
        const timeSinceUse = currentTime - storylet.lastUsed;
        if (timeSinceUse < storylet.cooldown * 1000) {
          continue;
        }
      }

      // Check if recently used (avoid repetition)
      if (context.recentStorylets.includes(storylet.id)) {
        continue;
      }

      // Evaluate trigger condition
      if (this.evaluateTrigger(storylet.trigger, worldState, context)) {
        // Check prerequisites
        if (storylet.prerequisites && !this.checkPrerequisites(storylet.prerequisites, worldState)) {
          continue;
        }

        // Check exclusions
        if (storylet.excludes && this.checkExclusions(storylet.excludes, worldState)) {
          continue;
        }

        available.push(storylet);
      }
    }

    return available;
  }

  selectNext(available: Storylet[], context: NarrativeContext): Storylet | null {
    if (available.length === 0) return null;

    // Weight-based selection with narrative intelligence
    const weightedStorylets = available.map(storylet => ({
      storylet,
      adjustedWeight: this.calculateAdjustedWeight(storylet, context)
    }));

    // Sort by adjusted weight
    weightedStorylets.sort((a, b) => b.adjustedWeight - a.adjustedWeight);

    // Weighted random selection from top candidates
    const totalWeight = weightedStorylets.reduce((sum, item) => sum + item.adjustedWeight, 0);
    let random = Math.random() * totalWeight;

    for (const { storylet, adjustedWeight } of weightedStorylets) {
      random -= adjustedWeight;
      if (random <= 0) {
        return storylet;
      }
    }

    return weightedStorylets[0].storylet; // Fallback
  }

  markUsed(storyletId: string): void {
    const storylet = this.storylets.get(storyletId);
    if (storylet) {
      storylet.lastUsed = Date.now();
      const history = this.usageHistory.get(storyletId) || [];
      history.push(Date.now());
      this.usageHistory.set(storyletId, history);
    }
  }

  private evaluateTrigger(trigger: string, worldState: WorldState, context: NarrativeContext): boolean {
    // Simple natural language trigger evaluation
    // In a full implementation, this would use NLP or a rule engine
    
    const lowerTrigger = trigger.toLowerCase();
    
    // Character presence triggers
    if (lowerTrigger.includes('when') && lowerTrigger.includes('present')) {
      const characterMatch = lowerTrigger.match(/when (\w+) (?:is )?present/);
      if (characterMatch) {
        const characterName = characterMatch[1];
        return context.activeCharacters.some(char => 
          char.toLowerCase().includes(characterName)
        );
      }
    }

    // Location-based triggers
    if (lowerTrigger.includes('at') || lowerTrigger.includes('in')) {
      const locationMatch = lowerTrigger.match(/(?:at|in) (\w+)/);
      if (locationMatch) {
        const locationName = locationMatch[1];
        return context.currentScene.toLowerCase().includes(locationName);
      }
    }

    // Tension-based triggers
    if (lowerTrigger.includes('tension')) {
      if (lowerTrigger.includes('high') && worldState.tension > 0.7) return true;
      if (lowerTrigger.includes('low') && worldState.tension < 0.3) return true;
      if (lowerTrigger.includes('medium') && worldState.tension >= 0.3 && worldState.tension <= 0.7) return true;
    }

    // Relationship triggers
    if (lowerTrigger.includes('conflict') || lowerTrigger.includes('enemy')) {
      return Array.from(worldState.relationships.values()).some(rel => 
        rel.type === 'enemy' || rel.strength < -0.5
      );
    }

    // Default fallback
    return true;
  }

  private checkPrerequisites(prerequisites: string[], worldState: WorldState): boolean {
    return prerequisites.every(prereq => worldState.globalFlags.has(prereq));
  }

  private checkExclusions(exclusions: string[], worldState: WorldState): boolean {
    return exclusions.some(exclusion => worldState.globalFlags.has(exclusion));
  }

  private calculateAdjustedWeight(storylet: Storylet, context: NarrativeContext): number {
    let weight = storylet.weight;

    // Pacing adjustments
    if (context.pacing === 'fast' && storylet.tags.includes('action')) {
      weight *= 1.5;
    } else if (context.pacing === 'slow' && storylet.tags.includes('contemplative')) {
      weight *= 1.5;
    }

    // Tension adjustments
    if (context.tension > 0.7 && storylet.tags.includes('climax')) {
      weight *= 2.0;
    } else if (context.tension < 0.3 && storylet.tags.includes('buildup')) {
      weight *= 1.3;
    }

    // Narrative goal alignment
    const goalAlignment = context.narrativeGoals.some(goal => 
      storylet.tags.some(tag => tag.includes(goal.toLowerCase()))
    );
    if (goalAlignment) {
      weight *= 1.4;
    }

    // Usage frequency penalty
    const usageHistory = this.usageHistory.get(storylet.id) || [];
    const recentUsage = usageHistory.filter(time => Date.now() - time < 3600000).length; // 1 hour
    weight *= Math.max(0.1, 1 - (recentUsage * 0.2));

    return weight;
  }

  getStorylets(): Storylet[] {
    return Array.from(this.storylets.values());
  }

  getStoryletById(id: string): Storylet | undefined {
    return this.storylets.get(id);
  }

  getStoryletsByTag(tag: string): Storylet[] {
    return Array.from(this.storylets.values()).filter(storylet => 
      storylet.tags.includes(tag)
    );
  }
} 