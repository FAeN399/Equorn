import { useState, useCallback } from 'react';
import { trpc } from '../utils/trpc';
import Head from 'next/head';
import { motion } from 'framer-motion';

interface GenerationOptions {
  seedId?: string;
  seedContent?: string;
  target: 'godot' | 'unity' | 'web' | 'docs';
  projectName: string;
}

interface GenerationResult {
  success: boolean;
  outputPath: string;
  files: string[];
  metadata: {
    target: string;
    seedFile: string;
    generatedAt: Date;
    duration: number;
    projectName: string;
  };
}

export default function GeneratePage() {
  const [selectedSeed, setSelectedSeed] = useState<string>('');
  const [customSeed, setCustomSeed] = useState<string>('');
  const [target, setTarget] = useState<'godot' | 'unity' | 'web' | 'docs'>('web');
  const [projectName, setProjectName] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [useCustomSeed, setUseCustomSeed] = useState<boolean>(false);
  
  // Fetch available seeds/templates
  const { data: templates, isLoading: templatesLoading } = trpc.getTemplates.useQuery();
  
  // Fetch seed content when selected
  const { data: seedData, isLoading: seedLoading } = trpc.getSeed.useQuery(
    { seedId: selectedSeed },
    { enabled: !!selectedSeed && !useCustomSeed }
  );

  // Validation mutation
  const validateSeed = trpc.validateSeed.useMutation();
  
  // Generation mutation
  const generateProject = trpc.generateProject.useMutation();

  // Generation history
  const { data: history, refetch: refetchHistory } = trpc.getGenerationHistory.useQuery();

  const handleGenerate = useCallback(async () => {
    if (!projectName.trim()) {
      alert('Please enter a project name');
      return;
    }

    if (!useCustomSeed && !selectedSeed) {
      alert('Please select a seed template');
      return;
    }

    if (useCustomSeed && !customSeed.trim()) {
      alert('Please enter custom seed content');
      return;
    }

    setIsGenerating(true);
    setResult(null);

    try {
      // Validate custom seed first if using custom content
      if (useCustomSeed) {
        const validation = await validateSeed.mutateAsync({
          seedContent: customSeed,
          format: 'yaml'
        });

        if (!validation.valid) {
          alert(`Seed validation failed:\n${validation.errors.join('\n')}`);
          setIsGenerating(false);
          return;
        }
      }

      const options: GenerationOptions = {
        target,
        projectName: projectName.trim(),
      };

      if (useCustomSeed) {
        options.seedContent = customSeed;
      } else {
        options.seedId = selectedSeed;
      }

      const generationResult = await generateProject.mutateAsync(options);
      setResult(generationResult);
      refetchHistory();
    } catch (error) {
      console.error('Generation failed:', error);
      alert(`Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  }, [selectedSeed, customSeed, target, projectName, useCustomSeed, validateSeed, generateProject, refetchHistory]);

  const getTargetIcon = (target: string) => {
    switch (target) {
      case 'godot': return '🎮';
      case 'unity': return '🕹️';
      case 'web': return '🌐';
      case 'docs': return '📚';
      default: return '⚡';
    }
  };

  const getTargetDescription = (target: string) => {
    switch (target) {
      case 'godot': return 'Ready-to-open Godot project with scenes and scripts';
      case 'unity': return 'Unity project with C# scripts and prefabs';
      case 'web': return 'Interactive web experience with cosmic themes';
      case 'docs': return 'Comprehensive documentation with markdown and HTML';
      default: return 'Unknown target';
    }
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <>
      <Head>
        <title>Generate Project - Equorn</title>
        <meta name="description" content="Generate playable prototypes from mythic seeds" />
      </Head>

      <div className="min-h-screen bg-dark-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-serif font-bold mb-4">
                <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                  Generate Mythic World
                </span>
              </h1>
              <p className="text-xl text-gray-300">
                Transform your narrative seed into a playable prototype
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Configuration Panel */}
              <motion.div 
                className="lg:col-span-2 space-y-6"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                
                {/* Seed Selection */}
                <motion.div 
                  className="card"
                  {...fadeInUp}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <h2 className="text-xl font-bold mb-4 text-gray-100">📖 Choose Your Seed</h2>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={!useCustomSeed}
                        onChange={() => setUseCustomSeed(false)}
                        className="mr-2"
                      />
                      <span className="text-gray-300">Use Template</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={useCustomSeed}
                        onChange={() => setUseCustomSeed(true)}
                        className="mr-2"
                      />
                      <span className="text-gray-300">Custom Seed</span>
                    </label>
                  </div>

                  {!useCustomSeed ? (
                    <div>
                      {templatesLoading ? (
                        <div className="text-gray-400">Loading templates...</div>
                      ) : (
                        <div className="grid grid-cols-1 gap-3">
                          {templates?.map((template) => (
                            <motion.label
                              key={template.id}
                              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                selectedSeed === template.id
                                  ? 'border-primary-500 bg-primary-900/20'
                                  : 'border-dark-700 hover:border-gray-600'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <input
                                type="radio"
                                value={template.id}
                                checked={selectedSeed === template.id}
                                onChange={(e) => setSelectedSeed(e.target.value)}
                                className="sr-only"
                              />
                              <div className="flex items-start space-x-3">
                                <div className="text-2xl">🌟</div>
                                <div>
                                  <h3 className="font-bold text-gray-100">{template.name}</h3>
                                  <p className="text-sm text-gray-400">{template.description}</p>
                                  <span className="inline-block px-2 py-1 text-xs bg-gray-700 rounded mt-2">
                                    {template.theme}
                                  </span>
                                </div>
                              </div>
                            </motion.label>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <textarea
                        value={customSeed}
                        onChange={(e) => setCustomSeed(e.target.value)}
                        placeholder="# Enter your custom seed YAML here
world:
  name: 'My Custom World'
  description: 'A unique mythic realm'
  
entities:
  - type: guardian
    name: 'My Guardian'
    description: 'A protector of this realm'"
                        className="w-full h-64 px-3 py-2 bg-dark-800 border border-dark-700 rounded-md text-gray-100 font-mono text-sm resize-none focus:outline-none focus:border-primary-500"
                      />
                      <div className="mt-2 text-sm text-gray-400">
                        💡 Write your seed in YAML format. See the templates for examples.
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Target Selection */}
                <motion.div 
                  className="card"
                  {...fadeInUp}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h2 className="text-xl font-bold mb-4 text-gray-100">🎯 Choose Target Platform</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['godot', 'unity', 'web', 'docs'].map((targetOption) => (
                      <motion.label
                        key={targetOption}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          target === targetOption
                            ? 'border-primary-500 bg-primary-900/20'
                            : 'border-dark-700 hover:border-gray-600'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <input
                          type="radio"
                          value={targetOption}
                          checked={target === targetOption}
                          onChange={(e) => setTarget(e.target.value as any)}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <div className="text-3xl mb-2">{getTargetIcon(targetOption)}</div>
                          <h3 className="font-bold text-gray-100 capitalize">{targetOption}</h3>
                          <p className="text-sm text-gray-400 mt-1">
                            {getTargetDescription(targetOption)}
                          </p>
                        </div>
                      </motion.label>
                    ))}
                  </div>
                </motion.div>

                {/* Project Configuration */}
                <motion.div 
                  className="card"
                  {...fadeInUp}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <h2 className="text-xl font-bold mb-4 text-gray-100">⚙️ Project Settings</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="my-mythic-world"
                      className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-md text-gray-100 focus:outline-none focus:border-primary-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Used for the output directory and project files
                    </p>
                  </div>
                </motion.div>

                {/* Generate Button */}
                <motion.div 
                  className="card"
                  {...fadeInUp}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <motion.button
                    onClick={handleGenerate}
                    disabled={isGenerating || (!selectedSeed && !useCustomSeed) || !projectName.trim()}
                    className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all ${
                      isGenerating || (!selectedSeed && !useCustomSeed) || !projectName.trim()
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-500 hover:to-secondary-500'
                    }`}
                    whileHover={!isGenerating && (selectedSeed || useCustomSeed) && projectName.trim() ? { scale: 1.02 } : {}}
                    whileTap={!isGenerating && (selectedSeed || useCustomSeed) && projectName.trim() ? { scale: 0.98 } : {}}
                  >
                    {isGenerating ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Generating Magic...
                      </div>
                    ) : (
                      '✨ Generate Mythic World'
                    )}
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Sidebar */}
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                
                {/* Generation Result */}
                {result && (
                  <motion.div 
                    className="card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-lg font-bold mb-3 text-green-400">🎉 Generation Complete!</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Project:</span>
                        <span className="text-gray-100 ml-2">{result.metadata.projectName}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Target:</span>
                        <span className="text-gray-100 ml-2 capitalize">{result.metadata.target}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Files:</span>
                        <span className="text-gray-100 ml-2">{result.files.length}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Duration:</span>
                        <span className="text-gray-100 ml-2">{result.metadata.duration}ms</span>
                      </div>
                      <div className="pt-2">
                        <span className="text-xs text-gray-400">{result.outputPath}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Recent Generations */}
                <div className="card">
                  <h3 className="text-lg font-bold mb-3 text-gray-100">📜 Recent Generations</h3>
                  {history && history.length > 0 ? (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {history.slice(0, 10).map((item, index) => (
                        <motion.div 
                          key={item.id} 
                          className="p-3 bg-dark-800 rounded border border-dark-700"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-100">{item.projectName}</span>
                            <span className="text-sm text-gray-400">{getTargetIcon(item.target)}</span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No recent generations</p>
                  )}
                </div>

                {/* Seed Preview */}
                {selectedSeed && seedData && !useCustomSeed && (
                  <motion.div 
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-lg font-bold mb-3 text-gray-100">👁️ Seed Preview</h3>
                    <pre className="text-xs text-gray-300 bg-dark-800 p-3 rounded border border-dark-700 overflow-auto max-h-40">
                      {seedData.content.split('\n').slice(0, 20).join('\n')}
                      {seedData.content.split('\n').length > 20 && '\n...'}
                    </pre>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 