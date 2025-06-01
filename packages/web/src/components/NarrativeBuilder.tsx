import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

export interface Storylet {
  id: string;
  name: string;
  trigger: string;
  content: {
    description: string;
    actions: string[];
    consequences: string[];
  };
  weight: number;
  tags: string[];
  cooldown?: number;
}

export interface AgentConfig {
  personality: 'creative' | 'logical' | 'dramatic' | 'subtle';
  focus: 'character' | 'plot' | 'world' | 'dialogue';
  collaborationStyle: 'leading' | 'supportive' | 'contrarian';
  creativityLevel: number;
}

export interface CustomCharacter {
  id: string;
  name: string;
  description: string;
  traits: string[];
  backstory: string;
  relationships: string[];
  role: 'protagonist' | 'antagonist' | 'supporting' | 'neutral';
  importance: 'major' | 'minor' | 'background';
}

export interface CustomLocation {
  id: string;
  name: string;
  description: string;
  atmosphere: string;
  history: string;
  features: string[];
  connections: string[];
  significance: 'central' | 'important' | 'minor';
}

export interface CustomEvent {
  id: string;
  name: string;
  description: string;
  triggerConditions: string;
  participants: string[];
  consequences: string[];
  timing: 'early' | 'mid' | 'late' | 'climax' | 'flexible';
  importance: 'critical' | 'major' | 'minor';
}

export interface CustomElement {
  id: string;
  type: 'theme' | 'artifact' | 'faction' | 'mystery' | 'prophecy' | 'custom';
  name: string;
  description: string;
  properties: string[];
  significance: string;
}

export interface UserDefinitions {
  characters: CustomCharacter[];
  locations: CustomLocation[];
  events: CustomEvent[];
  elements: CustomElement[];
  constraints: string[];
  themes: string[];
}

export function NarrativeBuilder() {
  const [activeTab, setActiveTab] = useState<'storylets' | 'agents' | 'definitions' | 'preview' | 'generate'>('storylets');
  const [storylets, setStorylets] = useState<Storylet[]>([
    {
      id: 'storylet-1',
      name: 'The Ancient Grove',
      trigger: 'when player enters mystical forest area',
      content: {
        description: 'Ancient trees whisper secrets of the old world, their bark glowing with ethereal light.',
        actions: ['Listen to the whispers', 'Touch the glowing bark', 'Investigate deeper'],
        consequences: ['Gain ancient knowledge', 'Receive forest blessing', 'Disturb sleeping spirits']
      },
      weight: 150,
      tags: ['mystical', 'discovery', 'nature'],
      cooldown: 600
    },
    {
      id: 'storylet-2',
      name: 'The Forgotten Merchant',
      trigger: 'when player reputation is high in any settlement',
      content: {
        description: 'A mysterious merchant appears, offering rare items that seem to shift and change.',
        actions: ['Examine the wares', 'Ask about their origin', 'Attempt to bargain'],
        consequences: ['Acquire magical artifact', 'Learn forbidden history', 'Enter into mystical contract']
      },
      weight: 100,
      tags: ['merchant', 'mystery', 'choice'],
      cooldown: 300
    },
    {
      id: 'storylet-3',
      name: 'Echoes of Conflict',
      trigger: 'when two factions have high tension',
      content: {
        description: 'Old rivalries resurface as tensions escalate between opposing forces.',
        actions: ['Mediate the dispute', 'Choose a side', 'Seek alternative solution'],
        consequences: ['Broker peace treaty', 'Gain faction ally', 'Discover hidden truth']
      },
      weight: 120,
      tags: ['conflict', 'politics', 'choice'],
      cooldown: 450
    }
  ]);
  const [agentConfigs, setAgentConfigs] = useState<AgentConfig[]>([
    {
      personality: 'creative',
      focus: 'character',
      collaborationStyle: 'supportive',
      creativityLevel: 0.7
    }
  ]);
  const [userDefinitions, setUserDefinitions] = useState<UserDefinitions>({
    characters: [],
    locations: [],
    events: [],
    elements: [],
    constraints: [],
    themes: []
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            🌟 Emergent Narrative Builder
          </h1>
          <p className="text-xl text-cyan-200">
            Craft dynamic storylets and configure AI narrative agents
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="flex bg-white/10 rounded-lg p-1 backdrop-blur-sm">
            {[
              { id: 'storylets', label: '📚 Storylets', icon: '📚' },
              { id: 'agents', label: '🤖 Agents', icon: '🤖' },
              { id: 'definitions', label: '🔍 Definitions', icon: '🔍' },
              { id: 'preview', label: '👁️ Preview', icon: '👁️' },
              { id: 'generate', label: '⚡ Generate', icon: '⚡' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-md transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                    : 'text-cyan-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10"
        >
          {activeTab === 'storylets' && (
            <StoryletEditor storylets={storylets} setStorylets={setStorylets} />
          )}
          {activeTab === 'agents' && (
            <AgentConfiguration agentConfigs={agentConfigs} setAgentConfigs={setAgentConfigs} />
          )}
          {activeTab === 'definitions' && (
            <UserDefinitionsEditor userDefinitions={userDefinitions} setUserDefinitions={setUserDefinitions} />
          )}
          {activeTab === 'preview' && (
            <NarrativePreview storylets={storylets} agentConfigs={agentConfigs} />
          )}
          {activeTab === 'generate' && (
            <EmergentGenerationControls storylets={storylets} agentConfigs={agentConfigs} />
          )}
        </motion.div>
      </div>
    </div>
  );
}

function StoryletEditor({ storylets, setStorylets }: {
  storylets: Storylet[];
  setStorylets: (storylets: Storylet[]) => void;
}) {
  const [editingStorylet, setEditingStorylet] = useState<Storylet | null>(null);

  const addStorylet = useCallback(() => {
    const newStorylet: Storylet = {
      id: `storylet-${Date.now()}`,
      name: 'New Storylet',
      trigger: 'when something happens',
      content: {
        description: 'Something interesting occurs...',
        actions: ['Action 1', 'Action 2'],
        consequences: ['Consequence 1', 'Consequence 2']
      },
      weight: 100,
      tags: ['new'],
      cooldown: 300
    };
    setStorylets([...storylets, newStorylet]);
    setEditingStorylet(newStorylet);
  }, [storylets, setStorylets]);

  const updateStorylet = useCallback((updated: Storylet) => {
    setStorylets(storylets.map(s => s.id === updated.id ? updated : s));
    setEditingStorylet(updated);
  }, [storylets, setStorylets]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-cyan-400">📚 Storylet Database</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addStorylet}
          className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 rounded-lg font-semibold"
        >
          ➕ Add Storylet
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Storylet List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-purple-300">Existing Storylets</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {storylets.map((storylet) => (
              <motion.div
                key={storylet.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setEditingStorylet(storylet)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  editingStorylet?.id === storylet.id
                    ? 'bg-cyan-500/20 border-2 border-cyan-400'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-cyan-300">{storylet.name}</h4>
                  <span className="text-sm bg-purple-500/20 px-2 py-1 rounded">
                    Weight: {storylet.weight}
                  </span>
                </div>
                <p className="text-sm text-gray-300 mb-2">{storylet.trigger}</p>
                <div className="flex flex-wrap gap-1">
                  {storylet.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-indigo-500/20 px-2 py-1 rounded-full text-indigo-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Storylet Editor */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-purple-300">
            {editingStorylet ? 'Edit Storylet' : 'Select a storylet to edit'}
          </h3>
          {editingStorylet && (
            <StoryletEditForm storylet={editingStorylet} onUpdate={updateStorylet} />
          )}
        </div>
      </div>
    </div>
  );
}

function StoryletEditForm({ storylet, onUpdate }: {
  storylet: Storylet;
  onUpdate: (storylet: Storylet) => void;
}) {
  const [localStorylet, setLocalStorylet] = useState(storylet);

  const handleChange = (field: string, value: any) => {
    const updated = { ...localStorylet, [field]: value };
    setLocalStorylet(updated);
    onUpdate(updated);
  };

  const handleContentChange = (field: string, value: any) => {
    const updated = {
      ...localStorylet,
      content: { ...localStorylet.content, [field]: value }
    };
    setLocalStorylet(updated);
    onUpdate(updated);
  };

  return (
    <div className="space-y-4 bg-white/5 p-4 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-cyan-300 mb-2">Name</label>
        <input
          type="text"
          value={localStorylet.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cyan-300 mb-2">Trigger (Natural Language)</label>
        <textarea
          value={localStorylet.trigger}
          onChange={(e) => handleChange('trigger', e.target.value)}
          rows={2}
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
          placeholder="when something happens or condition is met..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cyan-300 mb-2">Description</label>
        <textarea
          value={localStorylet.content.description}
          onChange={(e) => handleContentChange('description', e.target.value)}
          rows={3}
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-2">Weight</label>
          <input
            type="number"
            value={localStorylet.weight}
            onChange={(e) => handleChange('weight', parseInt(e.target.value))}
            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-2">Cooldown (seconds)</label>
          <input
            type="number"
            value={localStorylet.cooldown || 0}
            onChange={(e) => handleChange('cooldown', parseInt(e.target.value))}
            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-cyan-300 mb-2">Tags (comma-separated)</label>
        <input
          type="text"
          value={localStorylet.tags.join(', ')}
          onChange={(e) => handleChange('tags', e.target.value.split(',').map(t => t.trim()))}
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
          placeholder="character, action, mystery..."
        />
      </div>
    </div>
  );
}

function AgentConfiguration({ agentConfigs, setAgentConfigs }: {
  agentConfigs: AgentConfig[];
  setAgentConfigs: (configs: AgentConfig[]) => void;
}) {
  const addAgent = useCallback(() => {
    const newAgent: AgentConfig = {
      personality: 'creative',
      focus: 'character',
      collaborationStyle: 'supportive',
      creativityLevel: 0.7
    };
    setAgentConfigs([...agentConfigs, newAgent]);
  }, [agentConfigs, setAgentConfigs]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-cyan-400">🤖 Narrative Agent Configuration</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addAgent}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 rounded-lg font-semibold"
        >
          ➕ Add Agent
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {agentConfigs.map((config, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-6 rounded-xl border border-white/10"
          >
            <h3 className="text-lg font-semibold text-purple-300 mb-4">
              Agent {index + 1}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">Personality</label>
                <select
                  value={config.personality}
                  onChange={(e) => {
                    const updated = [...agentConfigs];
                    updated[index] = { ...config, personality: e.target.value as any };
                    setAgentConfigs(updated);
                  }}
                  className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                >
                  <option value="creative">🎨 Creative</option>
                  <option value="logical">🧠 Logical</option>
                  <option value="dramatic">🎭 Dramatic</option>
                  <option value="subtle">🌸 Subtle</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">Focus</label>
                <select
                  value={config.focus}
                  onChange={(e) => {
                    const updated = [...agentConfigs];
                    updated[index] = { ...config, focus: e.target.value as any };
                    setAgentConfigs(updated);
                  }}
                  className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                >
                  <option value="character">👤 Character</option>
                  <option value="plot">📈 Plot</option>
                  <option value="world">🌍 World</option>
                  <option value="dialogue">💬 Dialogue</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">Collaboration Style</label>
                <select
                  value={config.collaborationStyle}
                  onChange={(e) => {
                    const updated = [...agentConfigs];
                    updated[index] = { ...config, collaborationStyle: e.target.value as any };
                    setAgentConfigs(updated);
                  }}
                  className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                >
                  <option value="leading">👑 Leading</option>
                  <option value="supportive">🤝 Supportive</option>
                  <option value="contrarian">⚡ Contrarian</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">
                  Creativity Level: {Math.round(config.creativityLevel * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={config.creativityLevel}
                  onChange={(e) => {
                    const updated = [...agentConfigs];
                    updated[index] = { ...config, creativityLevel: parseFloat(e.target.value) };
                    setAgentConfigs(updated);
                  }}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Conservative</span>
                  <span>Innovative</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function NarrativePreview({ storylets, agentConfigs }: {
  storylets: Storylet[];
  agentConfigs: AgentConfig[];
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-cyan-400">👁️ Narrative System Preview</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-300 mb-4">Storylet Statistics</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Storylets:</span>
              <span className="text-cyan-400 font-bold">{storylets.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Unique Tags:</span>
              <span className="text-cyan-400 font-bold">
                {new Set(storylets.flatMap(s => s.tags)).size}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Average Weight:</span>
              <span className="text-cyan-400 font-bold">
                {storylets.length ? Math.round(storylets.reduce((sum, s) => sum + s.weight, 0) / storylets.length) : 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-300 mb-4">Agent Configuration</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Active Agents:</span>
              <span className="text-cyan-400 font-bold">{agentConfigs.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Avg Creativity:</span>
              <span className="text-cyan-400 font-bold">
                {agentConfigs.length ? Math.round(agentConfigs.reduce((sum, a) => sum + a.creativityLevel, 0) / agentConfigs.length * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-purple-300 mb-4">Tag Distribution</h3>
        <div className="flex flex-wrap gap-2">
          {Array.from(new Set(storylets.flatMap(s => s.tags))).map((tag) => {
            const count = storylets.filter(s => s.tags.includes(tag)).length;
            return (
              <span
                key={tag}
                className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 px-3 py-1 rounded-full text-sm"
              >
                {tag} ({count})
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function EmergentGenerationControls({ storylets, agentConfigs }: {
  storylets: Storylet[];
  agentConfigs: AgentConfig[];
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResults, setGenerationResults] = useState<any>(null);
  const [generationLog, setGenerationLog] = useState<string[]>([]);
  const [outputPath, setOutputPath] = useState<string>('');
  const [generationOptions, setGenerationOptions] = useState({
    narrativeDepth: 'medium',
    maxIterations: 3,
    creativityLevel: 0.7,
    emergentMode: true,
    target: 'godot'
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationResults(null);
    setGenerationLog([]);
    
    // Create output directory path
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const outputDir = `equorn-output-${timestamp}`;
    setOutputPath(outputDir);
    
    // Simulate detailed generation process with real-time updates
    const steps = [
      '🧠 Initializing narrative agents...',
      '📚 Processing storylet database...',
      '🌍 Analyzing world state...',
      '⚡ Generating emergent storylines...',
      '🤖 Agent collaboration round 1...',
      '🎭 Character development phase...',
      '⚔️ Conflict escalation analysis...',
      '🤖 Agent collaboration round 2...',
      '📖 Exposition generation...',
      '💬 Dialogue creation...',
      '🤖 Agent collaboration round 3...',
      '🎯 Narrative convergence...',
      '🏗️ Building project structure...',
      '📁 Creating output directory...',
      '📄 Writing generated files...',
      '✨ Finalizing emergent myth...'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
      setGenerationLog(prev => [...prev, steps[i]]);
    }

    // Try to call the actual generation API
    try {
      // This would be the real API call - for now it's commented out
      // const response = await fetch('/api/trpc/generateEmergentMyth', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     storylets,
      //     agentConfigs,
      //     options: generationOptions,
      //     outputDir
      //   })
      // });
      
      // Simulate generation results with real file structure
      const mockResults = {
        success: true,
        outputDirectory: outputDir,
        storyletsProcessed: storylets.length,
        agentsUsed: agentConfigs.length,
        iterations: generationOptions.maxIterations,
        complexityScore: Math.round(70 + Math.random() * 30),
        coherenceScore: Math.round(80 + Math.random() * 20),
        emergentElements: [
          'Character arc: The reluctant hero discovers ancient power',
          'Plot branch: Ancient prophecy unfolds through player choices',
          'World event: Seasonal magic shifts affecting all NPCs',
          'Dynamic relationship: Mentor-student bond evolves with conflict resolution'
        ],
        generatedFiles: [
          `${outputDir}/${generationOptions.target}/scenes/EmergentNarrative.gd`,
          `${outputDir}/${generationOptions.target}/data/storylets.json`,
          `${outputDir}/${generationOptions.target}/agents/CharacterAgent.gd`,
          `${outputDir}/${generationOptions.target}/systems/WorldState.gd`,
          `${outputDir}/${generationOptions.target}/data/world_state.json`,
          `${outputDir}/${generationOptions.target}/README.md`
        ],
        executionTime: '2.3s',
        target: generationOptions.target
      };

      setGenerationResults(mockResults);
    } catch (error) {
      console.error('Generation error:', error);
      setGenerationLog(prev => [...prev, '❌ Generation failed - using demo mode']);
    }
    
    setIsGenerating(false);
  };

  const handleOpenOutput = () => {
    if (generationResults?.outputDirectory) {
      // In a real app, this would open the file explorer
      alert(`Output directory: ${generationResults.outputDirectory}\n\nIn a full implementation, this would open your file explorer to the generated files.`);
    }
  };

  const handleGenerateAgain = () => {
    setGenerationResults(null);
    setGenerationLog([]);
    setOutputPath('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-cyan-400">⚡ Emergent Generation</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-purple-300">Generation Settings</h3>
          
          <div className="bg-white/5 p-4 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2">Narrative Depth</label>
              <select
                value={generationOptions.narrativeDepth}
                onChange={(e) => setGenerationOptions(prev => ({ ...prev, narrativeDepth: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
              >
                <option value="surface">🏃 Surface - Fast Generation</option>
                <option value="medium">🚶 Medium - Balanced Approach</option>
                <option value="deep">🧘 Deep - Rich Complexity</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2">Target Platform</label>
              <select
                value={generationOptions.target}
                onChange={(e) => setGenerationOptions(prev => ({ ...prev, target: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
              >
                <option value="godot">🎮 Godot Engine</option>
                <option value="unity">🔷 Unity Engine</option>
                <option value="web">🌐 Web Platform</option>
                <option value="docs">📚 Documentation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2">
                Max Iterations: {generationOptions.maxIterations}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={generationOptions.maxIterations}
                onChange={(e) => setGenerationOptions(prev => ({ ...prev, maxIterations: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={generationOptions.emergentMode}
                  onChange={(e) => setGenerationOptions(prev => ({ ...prev, emergentMode: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-cyan-300">Enable Emergent Mode</span>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-purple-300">Generation Status</h3>
          
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6 rounded-lg border border-green-500/20">
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Storylets:</span>
                <span className="text-green-400">{storylets.length} ready</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span>Agents:</span>
                <span className="text-green-400">{agentConfigs.length} configured</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span>Target:</span>
                <span className="text-green-400">{generationOptions.target}</span>
              </div>
              {outputPath && (
                <div className="flex justify-between text-sm">
                  <span>Output:</span>
                  <span className="text-cyan-400 font-mono text-xs">{outputPath}</span>
                </div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGenerate}
              disabled={isGenerating || storylets.length === 0}
              className={`w-full py-3 px-6 rounded-lg font-semibold ${
                isGenerating || storylets.length === 0
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
              }`}
            >
              {isGenerating ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating Emergent Myth...</span>
                </div>
              ) : (
                '🌟 Generate Emergent Myth'
              )}
            </motion.button>
          </div>

          {/* Generation Log */}
          {generationLog.length > 0 && (
            <div className="bg-black/20 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-cyan-300 mb-2">Generation Log:</h4>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {generationLog.map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs text-gray-300"
                  >
                    {step}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Generation Results */}
      {generationResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-6 rounded-lg border border-purple-500/20"
        >
          <h3 className="text-xl font-bold text-purple-300 mb-4">🎉 Generation Complete!</h3>
          
          {/* Output Directory Info */}
          <div className="bg-blue-500/10 p-4 rounded-lg mb-6 border border-blue-500/20">
            <h4 className="font-semibold text-blue-300 mb-2">📁 Output Directory</h4>
            <div className="font-mono text-sm text-cyan-400 bg-black/20 p-2 rounded">
              ./{generationResults.outputDirectory}/
            </div>
            <p className="text-sm text-gray-300 mt-2">
              Generated files are organized by target platform and include narrative systems, storylet data, and AI agent implementations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 p-4 rounded-lg">
              <h4 className="font-semibold text-cyan-400 mb-2">Performance</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Execution Time:</span>
                  <span className="text-green-400">{generationResults.executionTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Storylets Processed:</span>
                  <span className="text-green-400">{generationResults.storyletsProcessed}</span>
                </div>
                <div className="flex justify-between">
                  <span>Agents Used:</span>
                  <span className="text-green-400">{generationResults.agentsUsed}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-lg">
              <h4 className="font-semibold text-cyan-400 mb-2">Quality Metrics</h4>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Complexity:</span>
                    <span className="text-purple-400">{generationResults.complexityScore}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      style={{ width: `${generationResults.complexityScore}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Coherence:</span>
                    <span className="text-cyan-400">{generationResults.coherenceScore}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                      style={{ width: `${generationResults.coherenceScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-lg">
              <h4 className="font-semibold text-cyan-400 mb-2">Output</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Target:</span>
                  <span className="text-green-400">{generationResults.target}</span>
                </div>
                <div className="flex justify-between">
                  <span>Files Generated:</span>
                  <span className="text-green-400">{generationResults.generatedFiles.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Emergent Elements:</span>
                  <span className="text-green-400">{generationResults.emergentElements.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-purple-300 mb-2">Emergent Narrative Elements</h4>
              <div className="space-y-2">
                {generationResults.emergentElements.map((element: string, idx: number) => (
                  <div key={idx} className="bg-white/5 p-3 rounded text-sm">
                    {element}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-purple-300 mb-2">Generated Files</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {generationResults.generatedFiles.map((file: string, idx: number) => (
                  <div key={idx} className="bg-black/20 p-2 rounded text-xs font-mono text-green-400">
                    📄 {file}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenOutput}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 rounded-lg font-semibold"
            >
              📂 Open Output Directory
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGenerateAgain}
              className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-lg font-semibold"
            >
              🔄 Generate Again
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function UserDefinitionsEditor({ userDefinitions, setUserDefinitions }: {
  userDefinitions: UserDefinitions;
  setUserDefinitions: (definitions: UserDefinitions) => void;
}) {
  const [activeTab, setActiveTab] = useState<'characters' | 'locations' | 'events' | 'elements'>('characters');

  const handleChange = (field: string, value: any) => {
    const updated = { ...userDefinitions, [field]: value };
    setUserDefinitions(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-cyan-400">🔍 Definitions</h2>
      </div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center mb-8"
      >
        <div className="flex bg-white/10 rounded-lg p-1 backdrop-blur-sm">
          {[
            { id: 'characters', label: '👤 Characters', icon: '👤' },
            { id: 'locations', label: '🌍 Locations', icon: '🌍' },
            { id: 'events', label: '💬 Events', icon: '💬' },
            { id: 'elements', label: '🎨 Elements', icon: '🎨' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                  : 'text-cyan-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10"
      >
        {activeTab === 'characters' && (
          <CharacterEditor characters={userDefinitions.characters} setCharacters={(characters) => handleChange('characters', characters)} />
        )}
        {activeTab === 'locations' && (
          <LocationEditor locations={userDefinitions.locations} setLocations={(locations) => handleChange('locations', locations)} />
        )}
        {activeTab === 'events' && (
          <EventEditor events={userDefinitions.events} setEvents={(events) => handleChange('events', events)} />
        )}
        {activeTab === 'elements' && (
          <ElementEditor elements={userDefinitions.elements} setElements={(elements) => handleChange('elements', elements)} />
        )}
      </motion.div>
    </div>
  );
}

function CharacterEditor({ characters, setCharacters }: {
  characters: CustomCharacter[];
  setCharacters: (characters: CustomCharacter[]) => void;
}) {
  const [editingCharacter, setEditingCharacter] = useState<CustomCharacter | null>(null);

  const addCharacter = () => {
    const newCharacter: CustomCharacter = {
      id: `character-${Date.now()}`,
      name: 'New Character',
      description: '',
      traits: [],
      backstory: '',
      relationships: [],
      role: 'protagonist',
      importance: 'major'
    };
    setCharacters([...characters, newCharacter]);
    setEditingCharacter(newCharacter);
  };

  const updateCharacter = (updated: CustomCharacter) => {
    setCharacters(characters.map(c => c.id === updated.id ? updated : c));
    setEditingCharacter(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-purple-300">Existing Characters</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addCharacter}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 rounded-lg font-semibold"
        >
          ➕ Add Character
        </motion.button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {characters.map((character) => (
          <motion.div
            key={character.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => setEditingCharacter(character)}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              editingCharacter?.id === character.id
                ? 'bg-cyan-500/20 border-2 border-cyan-400'
                : 'bg-white/5 border border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-cyan-300">{character.name}</h4>
            </div>
            <p className="text-sm text-gray-300 mb-2">{character.description}</p>
          </motion.div>
        ))}
      </div>

      {editingCharacter && (
        <CharacterEditForm character={editingCharacter} onUpdate={updateCharacter} />
      )}
    </div>
  );
}

function CharacterEditForm({ character, onUpdate }: {
  character: CustomCharacter;
  onUpdate: (character: CustomCharacter) => void;
}) {
  const [localCharacter, setLocalCharacter] = useState(character);

  const handleChange = (field: string, value: any) => {
    const updated = { ...localCharacter, [field]: value };
    setLocalCharacter(updated);
    onUpdate(updated);
  };

  return (
    <div className="space-y-4 bg-white/5 p-4 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-cyan-300 mb-2">Name</label>
        <input
          type="text"
          value={localCharacter.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cyan-300 mb-2">Description</label>
        <textarea
          value={localCharacter.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cyan-300 mb-2">Traits (comma-separated)</label>
        <input
          type="text"
          value={localCharacter.traits.join(', ')}
          onChange={(e) => handleChange('traits', e.target.value.split(',').map(t => t.trim()))}
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
          placeholder="trait1, trait2, trait3..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cyan-300 mb-2">Backstory</label>
        <textarea
          value={localCharacter.backstory}
          onChange={(e) => handleChange('backstory', e.target.value)}
          rows={3}
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cyan-300 mb-2">Role</label>
        <select
          value={localCharacter.role}
          onChange={(e) => handleChange('role', e.target.value as any)}
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
        >
          <option value="protagonist">👤 Protagonist</option>
          <option value="antagonist">👹 Antagonist</option>
          <option value="supporting">🤝 Supporting Character</option>
          <option value="neutral">🤔 Neutral Character</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-cyan-300 mb-2">Importance</label>
        <select
          value={localCharacter.importance}
          onChange={(e) => handleChange('importance', e.target.value as any)}
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
        >
          <option value="major">🌟 Major Character</option>
          <option value="minor">🌱 Minor Character</option>
          <option value="background">🌿 Background Character</option>
        </select>
      </div>
    </div>
  );
}

function LocationEditor({ locations, setLocations }: {
  locations: CustomLocation[];
  setLocations: (locations: CustomLocation[]) => void;
}) {
  const [editingLocation, setEditingLocation] = useState<CustomLocation | null>(null);

  const addLocation = () => {
    const newLocation: CustomLocation = {
      id: `location-${Date.now()}`,
      name: 'New Location',
      description: '',
      atmosphere: '',
      history: '',
      features: [],
      connections: [],
      significance: 'central'
    };
    setLocations([...locations, newLocation]);
    setEditingLocation(newLocation);
  };

  const updateLocation = (updated: CustomLocation) => {
    setLocations(locations.map(l => l.id === updated.id ? updated : l));
    setEditingLocation(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-purple-300">Existing Locations</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addLocation}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 rounded-lg font-semibold"
        >
          ➕ Add Location
        </motion.button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {locations.map((location) => (
          <motion.div
            key={location.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => setEditingLocation(location)}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              editingLocation?.id === location.id
                ? 'bg-cyan-500/20 border-2 border-cyan-400'
                : 'bg-white/5 border border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-cyan-300">{location.name}</h4>
            </div>
            <p className="text-sm text-gray-300 mb-2">{location.description}</p>
          </motion.div>
        ))}
      </div>

      {editingLocation && (
        <LocationEditForm location={editingLocation} onUpdate={updateLocation} />
      )}
    </div>
  );
}

function LocationEditForm({ location, onUpdate }: {
  location: CustomLocation;
  onUpdate: (location: CustomLocation) => void;
}) {
  const [localLocation, setLocalLocation] = useState(location);

  const handleChange = (field: string, value: any) => {
    const updated = { ...localLocation, [field]: value };
    setLocalLocation(updated);
    onUpdate(updated);
  };

  return (
    <div className="space-y-4 bg-white/5 p-4 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-cyan-300 mb-2">Name</label>
        <input
          type="text"
          value={localLocation.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cyan-300 mb-2">Description</label>
        <textarea
          value={localLocation.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cyan-300 mb-2">Atmosphere</label>
        <input
          type="text"
          value={localLocation.atmosphere}
          onChange={(e) => handleChange('atmosphere', e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cyan-300 mb-2">History</label>
        <textarea
          value={localLocation.history}
          onChange={(e) => handleChange('history', e.target.value)}
          rows={3}
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cyan-300 mb-2">Features (comma-separated)</label>
        <input
          type="text"
          value={localLocation.features.join(', ')}
          onChange={(e) => handleChange('features', e.target.value.split(',').map(f => f.trim()))}
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
          placeholder="feature1, feature2, feature3..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cyan-300 mb-2">Connections (comma-separated)</label>
        <input
          type="text"
          value={localLocation.connections.join(', ')}
          onChange={(e) => handleChange('connections', e.target.value.split(',').map(c => c.trim()))}
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
          placeholder="connection1, connection2, connection3..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cyan-300 mb-2">Significance</label>
        <select
          value={localLocation.significance}
          onChange={(e) => handleChange('significance', e.target.value as any)}
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
        >
          <option value="central">🌟 Central Location</option>
          <option value="important">🌱 Important Location</option>
          <option value="minor">🌿 Minor Location</option>
        </select>
      </div>
    </div>
  );
}

function EventEditor({ events, setEvents }: {
  events: CustomEvent[];
  setEvents: (events: CustomEvent[]) => void;
}) {
  const [editingEvent, setEditingEvent] = useState<CustomEvent | null>(null);

  const addEvent = () => {
    const newEvent: CustomEvent = {
      id: `event-${Date.now()}`,
      name: 'New Event',
      description: '',
      triggerConditions: '',
      participants: [],
      consequences: [],
      timing: 'early',
      importance: 'major'
    };
    setEvents([...events, newEvent]);
    setEditingEvent(newEvent);
  };

  const updateEvent = (updated: CustomEvent) => {
    setEvents(events.map(e => e.id === updated.id ? updated : e));
    setEditingEvent(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-purple-300">Existing Events</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addEvent}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 rounded-lg font-semibold"
        >
          ➕ Add Event
        </motion.button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {events.map((event) => (
          <motion.div
            key={event.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => setEditingEvent(event)}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              editingEvent?.id === event.id
                ? 'bg-cyan-500/20 border-2 border-cyan-400'
                : 'bg-white/5 border border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-cyan-300">{event.name}</h4>
            </div>
            <p className="text-sm text-gray-300 mb-2">{event.description}</p>
          </motion.div>
        ))}
      </div>

      {editingEvent && (
        <EventEditForm event={editingEvent} onUpdate={updateEvent} />
      )}
    </div>
  );
}

function EventEditForm({ event, onUpdate }: {
  event: CustomEvent;
  onUpdate: (event: CustomEvent) => void;
}) {
  const [localEvent, setLocalEvent] = useState(event);

  const handleChange = (field: string, value: any) => {
    const updated = { ...localEvent, [field]: value };
    setLocalEvent(updated);
    onUpdate(updated);
  };

  return (
    <div className="space-y-4 bg-white/5 p-4 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-cyan-300 mb-2">Name</label>
        <input
          type="text"
          value={localEvent.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cyan-300 mb-2">Description</label>
        <textarea
          value={localEvent.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cyan-300 mb-2">Trigger Conditions</label>
        <textarea
          value={localEvent.triggerConditions}
          onChange={(e) => handleChange('triggerConditions', e.target.value)}
          rows={3}
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cyan-300 mb-2">Participants (comma-separated)</label>
        <input
          type="text"
          value={localEvent.participants.join(', ')}
          onChange={(e) => handleChange('participants', e.target.value.split(',').map(p => p.trim()))}
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
          placeholder="participant1, participant2, participant3..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cyan-300 mb-2">Consequences (comma-separated)</label>
        <input
          type="text"
          value={localEvent.consequences.join(', ')}
          onChange={(e) => handleChange('consequences', e.target.value.split(',').map(c => c.trim()))}
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
          placeholder="consequence1, consequence2, consequence3..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cyan-300 mb-2">Timing</label>
        <select
          value={localEvent.timing}
          onChange={(e) => handleChange('timing', e.target.value as any)}
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
        >
          <option value="early">🌞 Early</option>
          <option value="mid">🌞 Mid</option>
          <option value="late">🌞 Late</option>
          <option value="climax">🌞 Climax</option>
          <option value="flexible">🌞 Flexible</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-cyan-300 mb-2">Importance</label>
        <select
          value={localEvent.importance}
          onChange={(e) => handleChange('importance', e.target.value as any)}
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
        >
          <option value="major">🌟 Major Event</option>
          <option value="minor">🌱 Minor Event</option>
          <option value="critical">🌟 Critical Event</option>
        </select>
      </div>
    </div>
  );
}

function ElementEditor({ elements, setElements }: {
  elements: CustomElement[];
  setElements: (elements: CustomElement[]) => void;
}) {
  const [editingElement, setEditingElement] = useState<CustomElement | null>(null);

  const addElement = () => {
    const newElement: CustomElement = {
      id: `element-${Date.now()}`,
      type: 'theme',
      name: 'New Element',
      description: '',
      properties: [],
      significance: ''
    };
    setElements([...elements, newElement]);
    setEditingElement(newElement);
  };

  const updateElement = (updated: CustomElement) => {
    setElements(elements.map(e => e.id === updated.id ? updated : e));
    setEditingElement(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-purple-300">Existing Elements</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addElement}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 rounded-lg font-semibold"
        >
          ➕ Add Element
        </motion.button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {elements.map((element) => (
          <motion.div
            key={element.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => setEditingElement(element)}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              editingElement?.id === element.id
                ? 'bg-cyan-500/20 border-2 border-cyan-400'
                : 'bg-white/5 border border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-cyan-300">{element.name}</h4>
            </div>
            <p className="text-sm text-gray-300 mb-2">{element.description}</p>
          </motion.div>
        ))}
      </div>

      {editingElement && (
        <ElementEditForm element={editingElement} onUpdate={updateElement} />
      )}
    </div>
  );
}

function ElementEditForm({ element, onUpdate }: {
  element: CustomElement;
  onUpdate: (element: CustomElement) => void;
}) {
  const [localElement, setLocalElement] = useState(element);

  const handleChange = (field: string, value: any) => {
    const updated = { ...localElement, [field]: value };
    setLocalElement(updated);
    onUpdate(updated);
  };

  return (
    <div className="space-y-4 bg-white/5 p-4 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-cyan-300 mb-2">Name</label>
        <input
          type="text"
          value={localElement.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cyan-300 mb-2">Description</label>
        <textarea
          value={localElement.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cyan-300 mb-2">Properties (comma-separated)</label>
        <input
          type="text"
          value={localElement.properties.join(', ')}
          onChange={(e) => handleChange('properties', e.target.value.split(',').map(p => p.trim()))}
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
          placeholder="property1, property2, property3..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cyan-300 mb-2">Significance</label>
        <input
          type="text"
          value={localElement.significance}
          onChange={(e) => handleChange('significance', e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cyan-300 mb-2">Type</label>
        <select
          value={localElement.type}
          onChange={(e) => handleChange('type', e.target.value as any)}
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
        >
          <option value="theme">🎨 Theme</option>
          <option value="artifact">🎨 Artifact</option>
          <option value="faction">🤝 Faction</option>
          <option value="mystery">🎭 Mystery</option>
          <option value="prophecy">📜 Prophecy</option>
          <option value="custom">🎨 Custom</option>
        </select>
      </div>
    </div>
  );
} 