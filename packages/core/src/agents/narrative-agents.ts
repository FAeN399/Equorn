import { WorldState, NarrativeContext, Storylet } from '../narrative/storylet.js';

export interface NarrativeScratchpad {
  currentWorldState: WorldState;
  narrativeContext: NarrativeContext;
  activeStorylets: Storylet[];
  generationGoals: string[];
  constraints: string[];
  previousOutputs: AgentOutput[];
}

export interface AgentOutput {
  agentId: string;
  type: 'character-development' | 'conflict-generation' | 'exposition' | 'dialogue' | 'scene-setting';
  content: {
    text?: string;
    suggestions?: string[];
    worldStateChanges?: Partial<WorldState>;
    newStorylets?: Storylet[];
    metadata?: Record<string, any>;
  };
  confidence: number; // 0-1
  reasoning: string;
}

export interface AgentConfig {
  personality: 'creative' | 'logical' | 'dramatic' | 'subtle';
  focus: 'character' | 'plot' | 'world' | 'dialogue';
  collaborationStyle: 'leading' | 'supportive' | 'contrarian';
  creativityLevel: number; // 0-1
}

export abstract class NarrativeAgent {
  abstract role: 'planner' | 'writer' | 'evaluator';
  abstract agentId: string;
  protected config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
  }

  abstract process(scratchpad: NarrativeScratchpad): Promise<AgentOutput>;

  protected generateId(): string {
    return `${this.agentId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export class CharacterAgent extends NarrativeAgent {
  role = 'planner' as const;
  agentId = 'character-agent';

  async process(scratchpad: NarrativeScratchpad): Promise<AgentOutput> {
    const { currentWorldState, narrativeContext } = scratchpad;
    
    // Analyze character development opportunities
    const characters = Array.from(currentWorldState.characters.values());
    const underdevelopedCharacters = characters.filter(char => 
      char.relationships.length < 2 || !char.motivation
    );

    const suggestions: string[] = [];
    const newStorylets: Storylet[] = [];

    // Generate character development suggestions
    for (const character of underdevelopedCharacters) {
      suggestions.push(`Develop ${character.name}'s backstory and motivation`);
      
      // Create a character development storylet
      newStorylets.push({
        id: this.generateId(),
        name: `${character.name} Introspection`,
        trigger: `when ${character.name.toLowerCase()} is present and tension is low`,
        content: {
          description: `${character.name} reflects on their past and reveals deeper motivations`,
          actions: [
            `${character.name} shares a memory from their past`,
            `Internal monologue reveals hidden fears or desires`,
            `Character makes a decision that shows their true nature`
          ],
          consequences: [
            `Other characters understand ${character.name} better`,
            `${character.name}'s motivation becomes clearer`,
            `Sets up future character conflict or growth`
          ]
        },
        weight: this.config.creativityLevel * 100,
        tags: ['character-development', 'introspection', character.name.toLowerCase()],
        cooldown: 1800 // 30 minutes
      });
    }

    // Identify relationship development opportunities
    const relationships = Array.from(currentWorldState.relationships.values());
    const staticRelationships = relationships.filter(rel => 
      Math.abs(rel.strength) < 0.3 && rel.history.length < 2
    );

    for (const relationship of staticRelationships) {
      const charA = currentWorldState.characters.get(relationship.characterA);
      const charB = currentWorldState.characters.get(relationship.characterB);
      
      if (charA && charB) {
        newStorylets.push({
          id: this.generateId(),
          name: `${charA.name}-${charB.name} Interaction`,
          trigger: `when both ${charA.name.toLowerCase()} and ${charB.name.toLowerCase()} are present`,
          content: {
            description: `${charA.name} and ${charB.name} have a meaningful interaction that develops their relationship`,
            actions: [
              `${charA.name} reveals something personal to ${charB.name}`,
              `${charB.name} shows unexpected understanding or conflict`,
              `Their relationship dynamic shifts subtly`
            ],
            consequences: [
              `Relationship strength changes`,
              `New shared history is created`,
              `Sets up future interactions between them`
            ]
          },
          weight: 80,
          tags: ['relationship', 'character-interaction', charA.name.toLowerCase(), charB.name.toLowerCase()],
          cooldown: 900
        });
      }
    }

    return {
      agentId: this.agentId,
      type: 'character-development',
      content: {
        suggestions,
        newStorylets,
        metadata: {
          analysedCharacters: characters.length,
          underdevelopedCount: underdevelopedCharacters.length,
          relationshipOpportunities: staticRelationships.length
        }
      },
      confidence: 0.8,
      reasoning: `Analyzed ${characters.length} characters and identified ${underdevelopedCharacters.length} needing development. Created ${newStorylets.length} character-focused storylets.`
    };
  }
}

export class ConflictAgent extends NarrativeAgent {
  role = 'planner' as const;
  agentId = 'conflict-agent';

  async process(scratchpad: NarrativeScratchpad): Promise<AgentOutput> {
    const { currentWorldState, narrativeContext } = scratchpad;
    
    const suggestions: string[] = [];
    const newStorylets: Storylet[] = [];

    // Analyze tension level and suggest escalation or resolution
    const currentTension = currentWorldState.tension;
    
    if (currentTension < 0.3) {
      suggestions.push('Introduce new conflict to increase dramatic tension');
      
      // Create tension-building storylets
      const relationships = Array.from(currentWorldState.relationships.values());
      const conflictRelationships = relationships.filter(rel => rel.type === 'enemy' || rel.strength < -0.2);
      
      for (const conflict of conflictRelationships.slice(0, 2)) {
        const charA = currentWorldState.characters.get(conflict.characterA);
        const charB = currentWorldState.characters.get(conflict.characterB);
        
        if (charA && charB) {
          newStorylets.push({
            id: this.generateId(),
            name: `${charA.name}-${charB.name} Confrontation`,
            trigger: `when both ${charA.name.toLowerCase()} and ${charB.name.toLowerCase()} are present and tension is low`,
            content: {
              description: `Tension escalates between ${charA.name} and ${charB.name}`,
              actions: [
                `${charA.name} challenges ${charB.name} directly`,
                `Old grievances surface between them`,
                `Their conflict becomes public knowledge`
              ],
              consequences: [
                `Tension increases significantly`,
                `Other characters must choose sides`,
                `The conflict becomes a central plot point`
              ]
            },
            weight: 120,
            tags: ['conflict', 'tension-building', charA.name.toLowerCase(), charB.name.toLowerCase()],
            cooldown: 600
          });
        }
      }
    } else if (currentTension > 0.7) {
      suggestions.push('Consider conflict resolution or climactic confrontation');
      
      // Create resolution or climax storylets
      newStorylets.push({
        id: this.generateId(),
        name: 'Climactic Confrontation',
        trigger: 'when tension is high and multiple conflicts are active',
        content: {
          description: 'Multiple conflicts come to a head in a dramatic confrontation',
          actions: [
            'All major antagonistic forces clash',
            'Characters must make crucial decisions',
            'The central conflict reaches its peak'
          ],
          consequences: [
            'Major plot resolution occurs',
            'Character relationships are permanently altered',
            'New status quo is established'
          ]
        },
        weight: 200,
        tags: ['climax', 'resolution', 'high-tension'],
        cooldown: 3600
      });
    }

    // Identify dormant conflicts that could be reactivated
    const dormantConflicts = Array.from(currentWorldState.relationships.values())
      .filter(rel => rel.type === 'rival' && Math.abs(rel.strength) < 0.4);

    for (const dormant of dormantConflicts.slice(0, 1)) {
      suggestions.push(`Reactivate dormant rivalry between ${dormant.characterA} and ${dormant.characterB}`);
    }

    return {
      agentId: this.agentId,
      type: 'conflict-generation',
      content: {
        suggestions,
        newStorylets,
        worldStateChanges: {
          tension: currentTension < 0.3 ? currentTension + 0.1 : currentTension
        },
        metadata: {
          currentTension,
          conflictCount: Array.from(currentWorldState.relationships.values()).filter(r => r.strength < -0.2).length,
          recommendedAction: currentTension < 0.3 ? 'escalate' : currentTension > 0.7 ? 'resolve' : 'maintain'
        }
      },
      confidence: 0.85,
      reasoning: `Current tension: ${currentTension.toFixed(2)}. ${currentTension < 0.3 ? 'Created tension-building storylets' : currentTension > 0.7 ? 'Suggested climax storylets' : 'Maintaining current conflict level'}.`
    };
  }
}

export class ExpositionWriter extends NarrativeAgent {
  role = 'writer' as const;
  agentId = 'exposition-writer';

  async process(scratchpad: NarrativeScratchpad): Promise<AgentOutput> {
    const { currentWorldState, narrativeContext } = scratchpad;
    
    const suggestions: string[] = [];
    const newStorylets: Storylet[] = [];

    // Analyze what world-building elements need exposition
    const locations = Array.from(currentWorldState.locations.values());
    const unexploredLocations = locations.filter(loc => 
      loc.characters.length === 0 && !currentWorldState.globalFlags.has(`${loc.id}_explored`)
    );

    // Create world-building storylets
    for (const location of unexploredLocations.slice(0, 2)) {
      suggestions.push(`Provide exposition for ${location.name}`);
      
      newStorylets.push({
        id: this.generateId(),
        name: `Discovering ${location.name}`,
        trigger: `when characters approach ${location.name.toLowerCase()}`,
        content: {
          description: `Characters explore and learn about ${location.name}`,
          actions: [
            `Detailed description of ${location.name}'s appearance and atmosphere`,
            `Characters discover clues about the location's history`,
            `Environmental storytelling reveals past events`
          ],
          consequences: [
            `${location.name} becomes familiar to characters`,
            `New plot hooks are established`,
            `Characters gain knowledge about the world`
          ]
        },
        weight: 90,
        tags: ['exposition', 'world-building', location.name.toLowerCase()],
        prerequisites: [`approaching_${location.id}`]
      });
    }

    // Create opening scene storylets for new story branches
    if (narrativeContext.narrativeGoals.includes('new-story-arc')) {
      newStorylets.push({
        id: this.generateId(),
        name: 'Story Arc Opening',
        trigger: 'when a new story arc begins',
        content: {
          description: 'Set the stage for a new narrative arc with compelling opening',
          actions: [
            'Introduce the central mystery or challenge',
            'Establish stakes and urgency',
            'Hook characters into the new storyline'
          ],
          consequences: [
            'New story arc is officially begun',
            'Characters have clear motivation to proceed',
            'Narrative momentum is established'
          ]
        },
        weight: 150,
        tags: ['exposition', 'opening', 'story-arc'],
        cooldown: 1200
      });
    }

    return {
      agentId: this.agentId,
      type: 'exposition',
      content: {
        suggestions,
        newStorylets,
        metadata: {
          unexploredLocations: unexploredLocations.length,
          totalLocations: locations.length,
          expositionOpportunities: unexploredLocations.length + (narrativeContext.narrativeGoals.includes('new-story-arc') ? 1 : 0)
        }
      },
      confidence: 0.75,
      reasoning: `Identified ${unexploredLocations.length} unexplored locations needing exposition. Created ${newStorylets.length} exposition-focused storylets.`
    };
  }
}

export class DialogueAgent extends NarrativeAgent {
  role = 'writer' as const;
  agentId = 'dialogue-agent';

  async process(scratchpad: NarrativeScratchpad): Promise<AgentOutput> {
    const { currentWorldState, narrativeContext } = scratchpad;
    
    const suggestions: string[] = [];
    const newStorylets: Storylet[] = [];

    // Identify characters who haven't spoken recently
    const characters = Array.from(currentWorldState.characters.values());
    const activeCharacters = narrativeContext.activeCharacters;
    
    // Create dialogue opportunities
    if (activeCharacters.length >= 2) {
      for (let i = 0; i < activeCharacters.length - 1; i++) {
        for (let j = i + 1; j < activeCharacters.length; j++) {
          const charA = activeCharacters[i];
          const charB = activeCharacters[j];
          
          newStorylets.push({
            id: this.generateId(),
            name: `${charA}-${charB} Dialogue`,
            trigger: `when both ${charA.toLowerCase()} and ${charB.toLowerCase()} are present and quiet`,
            content: {
              description: `${charA} and ${charB} engage in meaningful dialogue`,
              actions: [
                `${charA} initiates conversation with ${charB}`,
                `They discuss current events or personal matters`,
                `Subtext reveals deeper character motivations`
              ],
              consequences: [
                `Characters learn more about each other`,
                `Plot information is revealed through conversation`,
                `Relationship dynamics become clearer`
              ]
            },
            weight: 70,
            tags: ['dialogue', 'character-interaction', charA.toLowerCase(), charB.toLowerCase()],
            cooldown: 300
          });
        }
      }
    }

    // Create monologue opportunities for character introspection
    for (const character of activeCharacters.slice(0, 2)) {
      newStorylets.push({
        id: this.generateId(),
        name: `${character} Monologue`,
        trigger: `when ${character.toLowerCase()} is alone and contemplative`,
        content: {
          description: `${character} reflects on recent events through internal monologue`,
          actions: [
            `${character} processes recent experiences`,
            `Internal thoughts reveal character psychology`,
            `Character reaches important realizations`
          ],
          consequences: [
            `Character development occurs`,
            `Player/reader gains insight into character`,
            `Sets up future character decisions`
          ]
        },
        weight: 60,
        tags: ['dialogue', 'monologue', 'introspection', character.toLowerCase()],
        cooldown: 900
      });
    }

    return {
      agentId: this.agentId,
      type: 'dialogue',
      content: {
        suggestions,
        newStorylets,
        metadata: {
          activeCharacters: activeCharacters.length,
          dialogueOpportunities: activeCharacters.length >= 2 ? (activeCharacters.length * (activeCharacters.length - 1)) / 2 : 0,
          monologueOpportunities: activeCharacters.length
        }
      },
      confidence: 0.7,
      reasoning: `Created dialogue opportunities for ${activeCharacters.length} active characters. Generated ${newStorylets.length} dialogue-focused storylets.`
    };
  }
}

export class NarrativeOrchestrator {
  private agents: NarrativeAgent[] = [];
  private collaborationRounds = 3;

  constructor(agents: NarrativeAgent[] = []) {
    this.agents = agents;
  }

  addAgent(agent: NarrativeAgent): void {
    this.agents.push(agent);
  }

  async orchestrateGeneration(scratchpad: NarrativeScratchpad): Promise<AgentOutput[]> {
    const allOutputs: AgentOutput[] = [];

    for (let round = 0; round < this.collaborationRounds; round++) {
      const roundOutputs: AgentOutput[] = [];

      // Run all agents in parallel for this round
      const agentPromises = this.agents.map(agent => 
        agent.process({
          ...scratchpad,
          previousOutputs: allOutputs
        })
      );

      const outputs = await Promise.all(agentPromises);
      roundOutputs.push(...outputs);

      // Update scratchpad with new storylets from this round
      const newStorylets = roundOutputs.flatMap(output => output.content.newStorylets || []);
      scratchpad.activeStorylets.push(...newStorylets);

      allOutputs.push(...roundOutputs);

      // Early termination if agents reach consensus (optional)
      if (round > 0 && this.checkConsensus(roundOutputs)) {
        break;
      }
    }

    return allOutputs;
  }

  private checkConsensus(outputs: AgentOutput[]): boolean {
    // Simple consensus check - if all agents have high confidence
    return outputs.every(output => output.confidence > 0.8);
  }

  static createDefaultAgents(): NarrativeAgent[] {
    const defaultConfig: AgentConfig = {
      personality: 'creative',
      focus: 'plot',
      collaborationStyle: 'supportive',
      creativityLevel: 0.7
    };

    return [
      new CharacterAgent({ ...defaultConfig, focus: 'character' }),
      new ConflictAgent({ ...defaultConfig, personality: 'dramatic' }),
      new ExpositionWriter({ ...defaultConfig, focus: 'world' }),
      new DialogueAgent({ ...defaultConfig, focus: 'dialogue' })
    ];
  }
} 