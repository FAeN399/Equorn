import { Command } from 'commander';
import chalk from 'chalk';
// Note: This import will be available once the core package is built
// import { generateEmergentMyth } from '@equorn/core/api/emergent-generation';

export const emergentCommand = new Command('emergent')
  .description('Generate emergent narratives using AI agents and storylet systems')
  .argument('<seed>', 'Path to the seed file (YAML or JSON)')
  .option('-t, --target <target>', 'Target platform (godot, unity, web, docs)', 'godot')
  .option('-o, --output <dir>', 'Output directory', './output')
  .option('-d, --depth <depth>', 'Narrative depth (surface, medium, deep)', 'medium')
  .option('-i, --iterations <num>', 'Maximum agent iterations', '3')
  .option('-s, --storylets <num>', 'Number of storylets to generate', '20')
  .option('-c, --creativity <level>', 'Creativity level (0-1)', '0.7')
  .option('--no-emergent', 'Disable emergent mode')
  .option('-v, --verbose', 'Verbose output')
  .action(async (seedPath: string, options: any) => {
    console.log(chalk.magenta('🌟 Equorn Emergent Narrative Engine'));
    console.log(chalk.cyan('═'.repeat(50)));
    
    const startTime = Date.now();
    
    try {
      // Validate inputs
      if (!['surface', 'medium', 'deep'].includes(options.depth)) {
        console.error(chalk.red('❌ Invalid depth. Use: surface, medium, or deep'));
        process.exit(1);
      }
      
      if (!['godot', 'unity', 'web', 'docs'].includes(options.target)) {
        console.error(chalk.red('❌ Invalid target. Use: godot, unity, web, or docs'));
        process.exit(1);
      }
      
      const iterations = parseInt(options.iterations);
      const storyletCount = parseInt(options.storylets);
      const creativityLevel = parseFloat(options.creativity);
      
      if (isNaN(iterations) || iterations < 1 || iterations > 10) {
        console.error(chalk.red('❌ Iterations must be between 1 and 10'));
        process.exit(1);
      }
      
      if (isNaN(storyletCount) || storyletCount < 5 || storyletCount > 100) {
        console.error(chalk.red('❌ Storylet count must be between 5 and 100'));
        process.exit(1);
      }
      
      if (isNaN(creativityLevel) || creativityLevel < 0 || creativityLevel > 1) {
        console.error(chalk.red('❌ Creativity level must be between 0 and 1'));
        process.exit(1);
      }
      
      // Show configuration
      if (options.verbose) {
        console.log(chalk.blue('\n📋 Configuration:'));
        console.log(`  ${chalk.cyan('Seed:')} ${seedPath}`);
        console.log(`  ${chalk.cyan('Target:')} ${options.target}`);
        console.log(`  ${chalk.cyan('Output:')} ${options.output}`);
        console.log(`  ${chalk.cyan('Depth:')} ${options.depth}`);
        console.log(`  ${chalk.cyan('Iterations:')} ${iterations}`);
        console.log(`  ${chalk.cyan('Storylets:')} ${storyletCount}`);
        console.log(`  ${chalk.cyan('Creativity:')} ${(creativityLevel * 100).toFixed(0)}%`);
        console.log(`  ${chalk.cyan('Emergent Mode:')} ${options.emergent ? 'enabled' : 'disabled'}`);
        console.log();
      }
      
      // TODO: Integrate with actual emergent generation once core is built
      console.log(chalk.yellow('⚠️  Emergent generation system is being initialized...'));
      console.log(chalk.blue('🔧 This feature requires the core package to be built first.'));
      
      // Mock result for demonstration
      const mockResult = {
        files: [
          'scenes/Main.tscn',
          'scripts/Character.gd',
          'scripts/Dialogue.gd',
          'scripts/WorldState.gd',
          'data/storylets.json',
          'data/narrative_config.json'
        ],
        generatedStorylets: [
          { id: '1', name: 'Opening', tags: ['intro', 'character'], weight: 100 },
          { id: '2', name: 'Conflict', tags: ['conflict', 'tension'], weight: 80 },
          { id: '3', name: 'Development', tags: ['character', 'growth'], weight: 90 }
        ],
        narrativeAnalysis: {
          complexityScore: 0.75,
          narrativeCoherence: 0.85,
          agentOutputs: [
            { type: 'character-development' },
            { type: 'conflict-generation' },
            { type: 'dialogue' }
          ],
          emergentElements: ['dynamic character relationships', 'adaptive plot branches']
        },
        expansionSuggestions: [
          'Add more character backstory elements',
          'Introduce subplot complications',
          'Develop environmental storytelling'
        ],
        dynamicElements: {
          characterArcs: ['Hero journey', 'Mentor relationship'],
          plotBranches: ['Conflict resolution', 'Alternative outcomes'],
          worldEvents: ['Seasonal changes', 'Political shifts']
        }
      };
      
      // Display results (using mock data)
      const duration = Date.now() - startTime;
      
      console.log(chalk.green('\n✅ Emergent generation complete! (Demo Mode)'));
      console.log(chalk.cyan('═'.repeat(50)));
      
      // Files generated
      console.log(chalk.blue('\n📁 Generated Files:'));
      mockResult.files.forEach((file: string, index: number) => {
        console.log(`  ${chalk.gray(`${index + 1}.`)} ${chalk.white(file)}`);
      });
      
      // Storylet statistics
      console.log(chalk.blue('\n📚 Storylet Analysis:'));
      console.log(`  ${chalk.cyan('Total Storylets:')} ${mockResult.generatedStorylets.length}`);
      
      const storyletsByTag = mockResult.generatedStorylets.reduce((acc: Record<string, number>, storylet: any) => {
        storylet.tags.forEach((tag: string) => {
          acc[tag] = (acc[tag] || 0) + 1;
        });
        return acc;
      }, {});
      
      const topTags = Object.entries(storyletsByTag)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 5);
      
      console.log(`  ${chalk.cyan('Top Tags:')} ${topTags.map(([tag, count]) => `${tag}(${count})`).join(', ')}`);
      
      // Narrative complexity
      console.log(chalk.blue('\n🧠 Narrative Intelligence:'));
      console.log(`  ${chalk.cyan('Complexity Score:')} ${(mockResult.narrativeAnalysis.complexityScore * 100).toFixed(1)}%`);
      console.log(`  ${chalk.cyan('Coherence:')} ${(mockResult.narrativeAnalysis.narrativeCoherence * 100).toFixed(1)}%`);
      console.log(`  ${chalk.cyan('Agent Outputs:')} ${mockResult.narrativeAnalysis.agentOutputs.length}`);
      console.log(`  ${chalk.cyan('Emergent Elements:')} ${mockResult.narrativeAnalysis.emergentElements.length}`);
      
      // Agent analysis
      const agentTypes = mockResult.narrativeAnalysis.agentOutputs.reduce((acc: Record<string, number>, output: any) => {
        acc[output.type] = (acc[output.type] || 0) + 1;
        return acc;
      }, {});
      
      if (Object.keys(agentTypes).length > 0) {
        console.log(chalk.blue('\n🤖 Agent Activity:'));
        Object.entries(agentTypes).forEach(([type, count]) => {
          const icon = type === 'character-development' ? '👤' :
                      type === 'conflict-generation' ? '⚡' :
                      type === 'exposition' ? '📖' :
                      type === 'dialogue' ? '💬' : '🔧';
          console.log(`  ${icon} ${chalk.cyan(type)}: ${count} outputs`);
        });
      }
      
      // Expansion suggestions
      if (mockResult.expansionSuggestions.length > 0) {
        console.log(chalk.blue('\n💡 Expansion Suggestions:'));
        mockResult.expansionSuggestions.slice(0, 3).forEach((suggestion: string, index: number) => {
          console.log(`  ${chalk.gray(`${index + 1}.`)} ${suggestion}`);
        });
      }
      
      // Performance metrics
      console.log(chalk.blue('\n⚡ Performance:'));
      console.log(`  ${chalk.cyan('Generation Time:')} ${duration}ms`);
      console.log(`  ${chalk.cyan('Target Platform:')} ${options.target}`);
      console.log(`  ${chalk.cyan('Storylets/Second:')} ${(mockResult.generatedStorylets.length / (duration / 1000)).toFixed(1)}`);
      
      // Dynamic elements preview
      if (mockResult.dynamicElements.characterArcs.length > 0) {
        console.log(chalk.blue('\n🎭 Dynamic Elements Generated:'));
        console.log(`  ${chalk.cyan('Character Arcs:')} ${mockResult.dynamicElements.characterArcs.length}`);
        console.log(`  ${chalk.cyan('Plot Branches:')} ${mockResult.dynamicElements.plotBranches.length}`);
        console.log(`  ${chalk.cyan('World Events:')} ${mockResult.dynamicElements.worldEvents.length}`);
      }
      
      console.log(chalk.green(`\n🎉 Successfully generated emergent myth in ${duration}ms`));
      console.log(chalk.cyan('═'.repeat(50)));
      
      // Next steps
      console.log(chalk.blue('\n🚀 Next Steps:'));
      console.log(`  ${chalk.gray('1.')} Review generated files in ${chalk.white(options.output)}/`);
      console.log(`  ${chalk.gray('2.')} Import into ${chalk.white(options.target)} engine`);
      console.log(`  ${chalk.gray('3.')} Use ${chalk.white('pnpm dev')} to explore in web interface`);
      console.log(`  ${chalk.gray('4.')} Run ${chalk.white('pnpm equorn emergent --help')} for more options`);
      
      console.log(chalk.magenta('\n🌟 Note: Full emergent generation will be available once core package is built!'));
      console.log();
      
    } catch (error) {
      console.error(chalk.red(`\n❌ Error during emergent generation:`));
      console.error(chalk.red(`   ${error instanceof Error ? error.message : String(error)}`));
      
      if (options.verbose && error instanceof Error && error.stack) {
        console.error(chalk.gray('\nStack trace:'));
        console.error(chalk.gray(error.stack));
      }
      
      console.log(chalk.yellow('\n💡 Troubleshooting:'));
      console.log(chalk.yellow('   • Check that your seed file exists and is valid YAML/JSON'));
      console.log(chalk.yellow('   • Ensure the output directory is writable'));
      console.log(chalk.yellow('   • Try with --verbose for more detailed error information'));
      console.log(chalk.yellow('   • Reduce complexity with --depth surface or fewer --iterations\n'));
      
      process.exit(1);
    }
  });

// Add examples to help
emergentCommand.addHelpText('after', `

Examples:
  ${chalk.cyan('Basic emergent generation:')}
    $ pnpm equorn emergent ./seeds/forest-guardian.yaml

  ${chalk.cyan('Deep narrative with custom settings:')}
    $ pnpm equorn emergent ./seeds/epic-quest.yaml \\
        --depth deep --iterations 5 --storylets 30 \\
        --creativity 0.8 --target godot --verbose

  ${chalk.cyan('Fast prototyping mode:')}
    $ pnpm equorn emergent ./seeds/mystic-tower.yaml \\
        --depth surface --iterations 1 --storylets 10

  ${chalk.cyan('Documentation generation:')}
    $ pnpm equorn emergent ./seeds/ocean-depths.yaml \\
        --target docs --depth medium

  ${chalk.cyan('High creativity exploration:')}
    $ pnpm equorn emergent ./seeds/forest-guardian.yaml \\
        --creativity 0.9 --emergent --depth deep

${chalk.blue('Narrative Depth Levels:')}
  ${chalk.cyan('surface')}  - Fast generation, basic storylets
  ${chalk.cyan('medium')}   - Balanced approach with character development  
  ${chalk.cyan('deep')}     - Rich complexity with multi-layered narratives

${chalk.blue('Target Platforms:')}
  ${chalk.cyan('godot')}    - Godot Engine project files
  ${chalk.cyan('unity')}    - Unity project structure
  ${chalk.cyan('web')}      - Web-based interactive experience
  ${chalk.cyan('docs')}     - Beautiful documentation site
`);

export default emergentCommand; 