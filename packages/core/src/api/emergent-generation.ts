import { GenerationOptions, GenerationResult, SeedConfig } from '../types.js';
import { StoryletDatabase, WorldState, NarrativeContext, Storylet } from '../narrative/storylet.js';
import { NarrativeOrchestrator, AgentConfig, AgentOutput, NarrativeScratchpad } from '../agents/narrative-agents.js';
import { generateFromSeed } from './generateFromSeed.js';

export interface EmergentGenerationOptions extends GenerationOptions {
  storyletCount?: number;
  agentConfiguration?: AgentConfig[];
  narrativeDepth?: 'surface' | 'medium' | 'deep';
  emergentMode?: boolean;
  maxIterations?: number;
  creativityLevel?: number;
  collaborationRounds?: number;
}

export interface EmergentGenerationResult extends GenerationResult {
  generatedStorylets: Storylet[];
  narrativeAnalysis: {
    worldState: WorldState;
    agentOutputs: AgentOutput[];
    emergentElements: string[];
    complexityScore: number;
    narrativeCoherence: number;
  };
  expansionSuggestions: string[];
  dynamicElements: {
    characterArcs: any[];
    plotBranches: any[];
    worldEvents: any[];
  };
}

export async function generateEmergentMyth(
  seedPath: string,
  options: EmergentGenerationOptions = { target: 'godot' }
): Promise<EmergentGenerationResult> {
  // Set defaults
  const opts = {
    storyletCount: 20,
    narrativeDepth: 'medium' as const,
    emergentMode: true,
    maxIterations: 3,
    creativityLevel: 0.7,
    collaborationRounds: 2,
    ...options
  };

  console.log(`🌟 Starting emergent myth generation...`);
  console.log(`📖 Storylets: ${opts.storyletCount}, Depth: ${opts.narrativeDepth}, Iterations: ${opts.maxIterations}`);

  // 1. Parse initial seed (reuse existing logic)
  const seedConfig = await parseSeedFile(seedPath);
  
  // 2. Initialize storylet database
  const storyletDb = new StoryletDatabase();
  const initialStorylets = generateBaseStorylets(seedConfig, opts);
  initialStorylets.forEach(storylet => storyletDb.addStorylet(storylet));

  // 3. Create world state from seed
  const worldState = createWorldStateFromSeed(seedConfig);
  
  // 4. Initialize narrative context
  const narrativeContext = createNarrativeContext(seedConfig, opts);

  // 5. Spawn narrative agents
  const orchestrator = new NarrativeOrchestrator();
  const agents = NarrativeOrchestrator.createDefaultAgents();
  agents.forEach(agent => orchestrator.addAgent(agent));

  // 6. Emergent generation loop
  const allAgentOutputs: AgentOutput[] = [];
  let currentIteration = 0;

  while (currentIteration < opts.maxIterations) {
    console.log(`🔄 Iteration ${currentIteration + 1}/${opts.maxIterations}`);

    // Create scratchpad for agents
    const scratchpad: NarrativeScratchpad = {
      currentWorldState: worldState,
      narrativeContext,
      activeStorylets: storyletDb.getStorylets(),
      generationGoals: extractGenerationGoals(seedConfig, opts),
      constraints: extractConstraints(seedConfig),
      previousOutputs: allAgentOutputs
    };

    // Run agent collaboration
    const iterationOutputs = await orchestrator.orchestrateGeneration(scratchpad);
    allAgentOutputs.push(...iterationOutputs);

    // Process agent outputs and update world state
    processAgentOutputs(iterationOutputs, storyletDb, worldState, narrativeContext);

    currentIteration++;

    // Check for convergence
    if (checkConvergence(iterationOutputs, opts)) {
      console.log(`✅ Convergence reached at iteration ${currentIteration}`);
      break;
    }
  }

  // 7. Generate enhanced multi-target projects
  const baseResult = await generateBaseProject(seedConfig, options);
  
  // 8. Create emergent analysis
  const narrativeAnalysis = analyzeNarrativeComplexity(
    worldState,
    allAgentOutputs,
    storyletDb.getStorylets()
  );

  // 9. Generate expansion suggestions
  const expansionSuggestions = generateExpansionSuggestions(narrativeAnalysis, allAgentOutputs);

  // 10. Extract dynamic elements
  const dynamicElements = extractDynamicElements(allAgentOutputs, worldState);

  console.log(`🎯 Generated ${storyletDb.getStorylets().length} total storylets`);
  console.log(`🤖 Processed ${allAgentOutputs.length} agent outputs`);
  console.log(`📊 Complexity score: ${narrativeAnalysis.complexityScore.toFixed(2)}`);

  return {
    ...baseResult,
    generatedStorylets: storyletDb.getStorylets(),
    narrativeAnalysis,
    expansionSuggestions,
    dynamicElements
  };
}

async function parseSeedFile(seedPath: string): Promise<SeedConfig> {
  // Reuse existing seed parsing logic
  const fs = await import('fs');
  const yaml = await import('js-yaml');
  
  const seedContent = fs.readFileSync(seedPath, 'utf8');
  return yaml.load(seedContent) as SeedConfig;
}

function generateBaseStorylets(seedConfig: SeedConfig, options: EmergentGenerationOptions): Storylet[] {
  const storylets: Storylet[] = [];
  
  // Extract characters and create character-based storylets
  if (seedConfig.characters) {
    Object.entries(seedConfig.characters).forEach(([charId, character]) => {
      // Character introduction storylet
      storylets.push({
        id: `intro-${charId}`,
        name: `${character.name} Introduction`,
        trigger: `when story begins or ${character.name.toLowerCase()} first appears`,
        content: {
          description: `Introduce ${character.name} to the story`,
          actions: [
            `${character.name} makes their first appearance`,
            `Establish ${character.name}'s personality and role`,
            `Show ${character.name} in their element`
          ],
          consequences: [
            `${character.name} is established in the narrative`,
            `Other characters can interact with ${character.name}`,
            `${character.name}'s story arc begins`
          ]
        },
        weight: 100,
        tags: ['introduction', 'character', character.name.toLowerCase()],
        cooldown: 3600
      });

      // Character development storylet
      if (character.description) {
        storylets.push({
          id: `develop-${charId}`,
          name: `${character.name} Development`,
          trigger: `when ${character.name.toLowerCase()} is present and story needs development`,
          content: {
            description: `Develop ${character.name}'s character through action`,
            actions: [
              `${character.name} faces a personal challenge`,
              `Character traits are revealed through behavior`,
              `${character.name} makes a significant choice`
            ],
            consequences: [
              `${character.name} grows as a character`,
              `Relationships with ${character.name} evolve`,
              `New story possibilities emerge`
            ]
          },
          weight: 80,
          tags: ['development', 'character', character.name.toLowerCase()],
          cooldown: 1800
        });
      }
    });
  }

  // Extract environments and create exploration storylets
  if (seedConfig.environments) {
    Object.entries(seedConfig.environments).forEach(([envId, environment]) => {
      storylets.push({
        id: `explore-${envId}`,
        name: `Exploring ${environment.name}`,
        trigger: `when characters arrive at ${environment.name.toLowerCase()}`,
        content: {
          description: `Characters explore and discover ${environment.name}`,
          actions: [
            `Detailed description of ${environment.name}`,
            `Characters notice important details`,
            `Hidden aspects of the location are revealed`
          ],
          consequences: [
            `${environment.name} becomes familiar`,
            `New paths or secrets are discovered`,
            `Characters gain environmental knowledge`
          ]
        },
        weight: 90,
        tags: ['exploration', 'environment', environment.name.toLowerCase()],
        prerequisites: [`approaching_${envId}`]
      });
    });
  }

  // Extract items and create discovery storylets
  if (seedConfig.items) {
    Object.entries(seedConfig.items).forEach(([itemId, item]) => {
      storylets.push({
        id: `discover-${itemId}`,
        name: `Discovering ${item.name}`,
        trigger: `when characters search or explore`,
        content: {
          description: `Characters discover the ${item.name}`,
          actions: [
            `The ${item.name} is found in an interesting location`,
            `Characters examine and understand its significance`,
            `Decision about what to do with the ${item.name}`
          ],
          consequences: [
            `${item.name} is added to inventory`,
            `New story possibilities open up`,
            `Characters gain a useful tool or information`
          ]
        },
        weight: 70,
        tags: ['discovery', 'item', item.name.toLowerCase()],
        cooldown: 900
      });
    });
  }

  // Create general narrative storylets
  storylets.push(
    {
      id: 'opening-scene',
      name: 'Story Opening',
      trigger: 'when story begins',
      content: {
        description: 'Set the stage and hook the audience',
        actions: [
          'Establish the setting and atmosphere',
          'Introduce the central premise',
          'Create immediate engagement'
        ],
        consequences: [
          'Story officially begins',
          'Audience is invested',
          'Narrative momentum is established'
        ]
      },
      weight: 200,
      tags: ['opening', 'structure'],
      cooldown: 86400 // Only once per day
    },
    {
      id: 'plot-twist',
      name: 'Unexpected Revelation',
      trigger: 'when tension is medium and story needs surprise',
      content: {
        description: 'Introduce an unexpected plot development',
        actions: [
          'Reveal hidden information',
          'Subvert audience expectations',
          'Change the direction of the story'
        ],
        consequences: [
          'Story takes new direction',
          'Characters must adapt to new reality',
          'Audience engagement increases'
        ]
      },
      weight: 60,
      tags: ['twist', 'surprise', 'plot'],
      cooldown: 3600
    },
    {
      id: 'emotional-moment',
      name: 'Emotional Core Scene',
      trigger: 'when characters need emotional development',
      content: {
        description: 'Focus on character emotions and relationships',
        actions: [
          'Characters share vulnerable moments',
          'Emotional stakes are clarified',
          'Relationships deepen or strain'
        ],
        consequences: [
          'Character bonds strengthen or break',
          'Emotional investment increases',
          'Character motivations become clearer'
        ]
      },
      weight: 85,
      tags: ['emotion', 'character', 'relationship'],
      cooldown: 1200
    }
  );

  return storylets.slice(0, options.storyletCount || 20);
}

function createWorldStateFromSeed(seedConfig: SeedConfig): WorldState {
  const characters = new Map();
  const locations = new Map();
  const items = new Map();
  const relationships = new Map();
  const globalFlags = new Set<string>();

  // Initialize characters
  if (seedConfig.characters) {
    Object.entries(seedConfig.characters).forEach(([id, character]) => {
      characters.set(id, {
        id,
        name: character.name,
        location: 'unknown',
        health: 100,
        motivation: character.description || 'Unknown motivation',
        relationships: [],
        inventory: [],
        flags: new Set()
      });
    });
  }

  // Initialize locations
  if (seedConfig.environments) {
    Object.entries(seedConfig.environments).forEach(([id, environment]) => {
      locations.set(id, {
        id,
        name: environment.name,
        description: environment.description || '',
        characters: [],
        items: [],
        connections: [],
        flags: new Set()
      });
    });
  }

  // Initialize items
  if (seedConfig.items) {
    Object.entries(seedConfig.items).forEach(([id, item]) => {
      items.set(id, {
        id,
        name: item.name,
        description: item.description || '',
        flags: new Set()
      });
    });
  }

  return {
    characters,
    locations,
    items,
    relationships,
    globalFlags,
    timelinePosition: 0,
    tension: 0.2, // Start with low tension
    mood: 'mysterious'
  };
}

function createNarrativeContext(seedConfig: SeedConfig, options: EmergentGenerationOptions): NarrativeContext {
  const activeCharacters = seedConfig.characters ? Object.keys(seedConfig.characters) : [];
  
  return {
    recentStorylets: [],
    currentScene: 'opening',
    activeCharacters,
    narrativeGoals: ['character-development', 'world-building', 'plot-advancement'],
    pacing: options.narrativeDepth === 'surface' ? 'fast' : 
            options.narrativeDepth === 'deep' ? 'slow' : 'medium',
    tension: 0.2
  };
}

function extractGenerationGoals(seedConfig: SeedConfig, options: EmergentGenerationOptions): string[] {
  const goals = ['narrative-coherence', 'character-development'];
  
  if (options.narrativeDepth === 'deep') {
    goals.push('psychological-depth', 'world-building');
  }
  
  if (options.emergentMode) {
    goals.push('emergent-properties', 'surprise-elements');
  }

  return goals;
}

function extractConstraints(seedConfig: SeedConfig): string[] {
  const constraints = ['maintain-character-consistency', 'respect-world-rules'];
  
  // Add genre constraints if specified
  if (seedConfig.metadata?.genre) {
    constraints.push(`genre-${seedConfig.metadata.genre}`);
  }

  return constraints;
}

function processAgentOutputs(
  outputs: AgentOutput[],
  storyletDb: StoryletDatabase,
  worldState: WorldState,
  narrativeContext: NarrativeContext
): void {
  outputs.forEach(output => {
    // Add new storylets to database
    if (output.content.newStorylets) {
      output.content.newStorylets.forEach(storylet => {
        storyletDb.addStorylet(storylet);
      });
    }

    // Apply world state changes
    if (output.content.worldStateChanges) {
      Object.assign(worldState, output.content.worldStateChanges);
    }

    // Update narrative context based on output type
    if (output.type === 'conflict-generation' && output.content.metadata?.recommendedAction === 'escalate') {
      narrativeContext.tension = Math.min(1, narrativeContext.tension + 0.1);
    }
  });
}

function checkConvergence(outputs: AgentOutput[], options: EmergentGenerationOptions): boolean {
  // Check if agents have reached consensus (high confidence across the board)
  const avgConfidence = outputs.reduce((sum, output) => sum + output.confidence, 0) / outputs.length;
  
  // Check if we're generating enough new content
  const newStoryletCount = outputs.reduce((sum, output) => 
    sum + (output.content.newStorylets?.length || 0), 0
  );

  return avgConfidence > 0.85 && newStoryletCount > 5;
}

async function generateBaseProject(seedConfig: SeedConfig, options: GenerationOptions): Promise<GenerationResult> {
  // Integration with existing generation logic
  const files = await generateFromSeed('temp-seed.yaml', options);
  return {
    files,
    generationTime: Date.now(),
    statistics: {
      totalFiles: files.length,
      linesOfCode: files.reduce((total, file) => total + 100, 0), // Rough estimate
      targetPlatform: options.target
    }
  };
}

function analyzeNarrativeComplexity(
  worldState: WorldState,
  agentOutputs: AgentOutput[],
  storylets: Storylet[]
): any {
  const characterCount = worldState.characters.size;
  const relationshipComplexity = worldState.relationships.size;
  const storyletDiversity = new Set(storylets.flatMap(s => s.tags)).size;
  
  // Calculate complexity score (0-1 scale)
  const complexityScore = Math.min(1, 
    (characterCount * 0.1) + 
    (relationshipComplexity * 0.15) + 
    (storyletDiversity * 0.05) +
    (agentOutputs.length * 0.01)
  );

  // Calculate narrative coherence based on agent confidence
  const avgConfidence = agentOutputs.reduce((sum, output) => sum + output.confidence, 0) / agentOutputs.length;

  return {
    worldState,
    agentOutputs,
    emergentElements: extractEmergentElements(agentOutputs),
    complexityScore,
    narrativeCoherence: avgConfidence
  };
}

function extractEmergentElements(agentOutputs: AgentOutput[]): string[] {
  return agentOutputs
    .flatMap(output => output.content.suggestions || [])
    .filter(suggestion => suggestion.includes('emergent') || suggestion.includes('unexpected'));
}

function generateExpansionSuggestions(narrativeAnalysis: any, agentOutputs: AgentOutput[]): string[] {
  const suggestions = [
    'Add more character backstory elements',
    'Introduce subplot complications',
    'Develop environmental storytelling'
  ];

  // Add specific suggestions based on analysis
  if (narrativeAnalysis.complexityScore < 0.5) {
    suggestions.push('Increase narrative complexity with additional characters or plot threads');
  }

  if (narrativeAnalysis.narrativeCoherence > 0.8) {
    suggestions.push('Consider adding surprising elements to maintain engagement');
  }

  return suggestions;
}

function extractDynamicElements(agentOutputs: AgentOutput[], worldState: WorldState): any {
  return {
    characterArcs: agentOutputs
      .filter(output => output.type === 'character-development')
      .map(output => output.content),
    plotBranches: agentOutputs
      .filter(output => output.type === 'conflict-generation')
      .map(output => output.content),
    worldEvents: agentOutputs
      .filter(output => output.type === 'exposition')
      .map(output => output.content)
  };
} 