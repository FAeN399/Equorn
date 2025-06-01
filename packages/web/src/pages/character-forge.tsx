import { useState, useCallback, useRef, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// Character Creation Types
type EssenceCategory = 'virtue' | 'vice' | 'element' | 'archetype' | 'motif';

interface EssenceCard {
  id: string;
  name: string;
  category: EssenceCategory;
  description: string;
  icon: string;
  color: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  attributes: {
    STR?: number; // -4 to +4
    AGI?: number;
    CON?: number;
    INT?: number;
    WIS?: number;
    CHA?: number;
  };
  keywords: string[]; // Must appear in generated story
  lore: string; // Flavor text
}

interface BackstoryData {
  title: string;
  premise: string;
  world: string;
  freeText: string;
  genre: 'fantasy' | 'scifi' | 'modern' | 'historical' | 'cyberpunk';
  tone: 'heroic' | 'dark' | 'comedic' | 'mysterious' | 'epic';
}

interface CharacterStats {
  STR: number;
  AGI: number;
  CON: number;
  INT: number;
  WIS: number;
  CHA: number;
}

interface ForgeSlot {
  id: string;
  position: string;
  angle: number;
  x: number;
  y: number;
  card: EssenceCard | null;
}

interface CharacterSheet {
  name: string;
  roleClass: string;
  attributes: CharacterStats;
  backstory: string;
  personality: string;
  abilities: string[];
  plotHooks: string[];
}

// Expanded Essence Cards Library
const ESSENCE_CARDS: EssenceCard[] = [
  // Virtues
  {
    id: 'virtue-courage',
    name: 'Courage',
    category: 'virtue',
    description: 'Unwavering bravery in the face of danger',
    icon: '🦁',
    color: '#f59e0b',
    rarity: 'common',
    attributes: { STR: 2, WIS: 1 },
    keywords: ['brave', 'fearless', 'bold', 'heroic'],
    lore: 'The lion\'s heart beats within those who embrace this essence.'
  },
  {
    id: 'virtue-wisdom',
    name: 'Wisdom',
    category: 'virtue',
    description: 'Deep understanding and sound judgment',
    icon: '🦉',
    color: '#8b5cf6',
    rarity: 'uncommon',
    attributes: { WIS: 3, INT: 1 },
    keywords: ['wise', 'insightful', 'perceptive', 'sage'],
    lore: 'Ancient knowledge flows through those touched by this power.'
  },
  {
    id: 'virtue-compassion',
    name: 'Compassion',
    category: 'virtue',
    description: 'Empathy and kindness towards all beings',
    icon: '❤️',
    color: '#ec4899',
    rarity: 'common',
    attributes: { CHA: 2, WIS: 1 },
    keywords: ['kind', 'empathetic', 'caring', 'gentle'],
    lore: 'The healing touch of understanding soothes all wounds.'
  },
  {
    id: 'virtue-honor',
    name: 'Honor',
    category: 'virtue',
    description: 'Unwavering moral principles and integrity',
    icon: '🛡️',
    color: '#f59e0b',
    rarity: 'uncommon',
    attributes: { CHA: 2, CON: 1 },
    keywords: ['honorable', 'righteous', 'principled', 'noble'],
    lore: 'The shield of virtue protects both body and soul.'
  },
  {
    id: 'virtue-justice',
    name: 'Justice',
    category: 'virtue',
    description: 'The drive to right wrongs and protect the innocent',
    icon: '⚖️',
    color: '#8b5cf6',
    rarity: 'rare',
    attributes: { STR: 1, WIS: 2, CHA: 1 },
    keywords: ['just', 'fair', 'righteous', 'balanced'],
    lore: 'The scales of justice weigh all actions with perfect balance.'
  },
  {
    id: 'virtue-temperance',
    name: 'Temperance',
    category: 'virtue',
    description: 'Self-control and moderation in all things',
    icon: '🧘',
    color: '#10b981',
    rarity: 'common',
    attributes: { WIS: 2, CON: 1 },
    keywords: ['moderate', 'controlled', 'balanced', 'disciplined'],
    lore: 'True strength lies in restraint and measured action.'
  },
  
  // Vices
  {
    id: 'vice-wrath',
    name: 'Wrath',
    category: 'vice',
    description: 'Burning anger and fierce vengeance',
    icon: '⚡',
    color: '#dc2626',
    rarity: 'common',
    attributes: { STR: 3, WIS: -1 },
    keywords: ['angry', 'furious', 'vengeful', 'fierce'],
    lore: 'Lightning courses through the veins of the wrathful.'
  },
  {
    id: 'vice-greed',
    name: 'Greed',
    category: 'vice',
    description: 'Insatiable desire for wealth and power',
    icon: '💰',
    color: '#059669',
    rarity: 'uncommon',
    attributes: { INT: 2, CHA: -2 },
    keywords: ['greedy', 'selfish', 'acquisitive', 'hoarding'],
    lore: 'Gold calls to gold, and power seeks ever more power.'
  },
  {
    id: 'vice-pride',
    name: 'Pride',
    category: 'vice',
    description: 'Overwhelming arrogance and self-importance',
    icon: '👑',
    color: '#dc2626',
    rarity: 'common',
    attributes: { CHA: 2, WIS: -2 },
    keywords: ['arrogant', 'proud', 'haughty', 'superior'],
    lore: 'Pride goeth before the fall, yet some wear it as a crown.'
  },
  {
    id: 'vice-envy',
    name: 'Envy',
    category: 'vice',
    description: 'Bitter resentment of others\' success',
    icon: '👁️',
    color: '#059669',
    rarity: 'uncommon',
    attributes: { AGI: 2, CHA: -1 },
    keywords: ['envious', 'jealous', 'resentful', 'covetous'],
    lore: 'The green eye sees only what others possess.'
  },
  {
    id: 'vice-sloth',
    name: 'Sloth',
    category: 'vice',
    description: 'Spiritual and physical laziness',
    icon: '🦥',
    color: '#6b7280',
    rarity: 'common',
    attributes: { CON: -2, INT: 1 },
    keywords: ['lazy', 'apathetic', 'sluggish', 'idle'],
    lore: 'Sometimes the greatest wisdom comes from knowing when to rest.'
  },
  {
    id: 'vice-gluttony',
    name: 'Gluttony',
    category: 'vice',
    description: 'Excessive indulgence in physical pleasures',
    icon: '🍖',
    color: '#dc2626',
    rarity: 'common',
    attributes: { CON: 2, AGI: -2 },
    keywords: ['gluttonous', 'excessive', 'indulgent', 'hedonistic'],
    lore: 'Appetite, once awakened, knows no bounds.'
  },
  
  // Elements
  {
    id: 'element-fire',
    name: 'Flame',
    category: 'element',
    description: 'The primal force of burning passion',
    icon: '🔥',
    color: '#f97316',
    rarity: 'common',
    attributes: { STR: 2, CON: -1 },
    keywords: ['fiery', 'burning', 'passionate', 'intense'],
    lore: 'Fire dances in the soul, never to be extinguished.'
  },
  {
    id: 'element-water',
    name: 'Flow',
    category: 'element',
    description: 'The adaptive power of flowing water',
    icon: '🌊',
    color: '#0ea5e9',
    rarity: 'common',
    attributes: { WIS: 2, STR: -1 },
    keywords: ['flowing', 'adaptive', 'fluid', 'serene'],
    lore: 'Like water, true strength lies in adaptation.'
  },
  {
    id: 'element-earth',
    name: 'Stone',
    category: 'element',
    description: 'The enduring strength of ancient mountains',
    icon: '🗻',
    color: '#78716c',
    rarity: 'common',
    attributes: { CON: 3, AGI: -1 },
    keywords: ['solid', 'enduring', 'steadfast', 'grounded'],
    lore: 'Mountains stand eternal, weathering all storms.'
  },
  {
    id: 'element-air',
    name: 'Wind',
    category: 'element',
    description: 'The swift freedom of untamed breezes',
    icon: '🌪️',
    color: '#0ea5e9',
    rarity: 'common',
    attributes: { AGI: 3, CON: -1 },
    keywords: ['swift', 'free', 'changeable', 'restless'],
    lore: 'The wind carries messages from distant lands.'
  },
  {
    id: 'element-lightning',
    name: 'Storm',
    category: 'element',
    description: 'The raw power of thunder and lightning',
    icon: '⛈️',
    color: '#8b5cf6',
    rarity: 'rare',
    attributes: { STR: 2, AGI: 2, CON: -1 },
    keywords: ['stormy', 'electric', 'powerful', 'unpredictable'],
    lore: 'In the storm\'s heart lies both destruction and renewal.'
  },
  {
    id: 'element-ice',
    name: 'Frost',
    category: 'element',
    description: 'The crystalline beauty of frozen waters',
    icon: '❄️',
    color: '#06b6d4',
    rarity: 'uncommon',
    attributes: { INT: 2, WIS: 1, STR: -1 },
    keywords: ['cold', 'crystalline', 'precise', 'preserving'],
    lore: 'Ice preserves what fire would consume.'
  },
  
  // Archetypes
  {
    id: 'archetype-warrior',
    name: 'Warrior',
    category: 'archetype',
    description: 'Master of combat and warfare',
    icon: '⚔️',
    color: '#6b7280',
    rarity: 'common',
    attributes: { STR: 3, CON: 1 },
    keywords: ['warrior', 'fighter', 'soldier', 'combatant'],
    lore: 'The way of the blade is written in scars and victories.'
  },
  {
    id: 'archetype-scholar',
    name: 'Scholar',
    category: 'archetype',
    description: 'Seeker of knowledge and truth',
    icon: '📚',
    color: '#1e40af',
    rarity: 'uncommon',
    attributes: { INT: 3, WIS: 1 },
    keywords: ['scholar', 'learned', 'studious', 'intellectual'],
    lore: 'In knowledge lies the power to reshape reality itself.'
  },
  {
    id: 'archetype-rogue',
    name: 'Shadow',
    category: 'archetype',
    description: 'Master of stealth and cunning',
    icon: '🗡️',
    color: '#374151',
    rarity: 'common',
    attributes: { AGI: 3, CHA: 1 },
    keywords: ['stealthy', 'cunning', 'quick', 'elusive'],
    lore: 'In shadow\'s embrace, the impossible becomes inevitable.'
  },
  {
    id: 'archetype-healer',
    name: 'Healer',
    category: 'archetype',
    description: 'Guardian of life and restoration',
    icon: '🌿',
    color: '#10b981',
    rarity: 'uncommon',
    attributes: { WIS: 2, CHA: 2 },
    keywords: ['healing', 'nurturing', 'protective', 'compassionate'],
    lore: 'Life flows through gentle hands that mend what was broken.'
  },
  {
    id: 'archetype-leader',
    name: 'Commander',
    category: 'archetype',
    description: 'Natural born leader and tactician',
    icon: '🎖️',
    color: '#f59e0b',
    rarity: 'rare',
    attributes: { CHA: 3, INT: 1 },
    keywords: ['commanding', 'charismatic', 'tactical', 'inspiring'],
    lore: 'True leaders forge the path others dare not walk.'
  },
  {
    id: 'archetype-artisan',
    name: 'Crafter',
    category: 'archetype',
    description: 'Master of creation and craftsmanship',
    icon: '🔨',
    color: '#78716c',
    rarity: 'common',
    attributes: { INT: 2, CON: 2 },
    keywords: ['creative', 'skilled', 'patient', 'methodical'],
    lore: 'In the maker\'s hands, raw materials become legends.'
  },
  
  // Motifs
  {
    id: 'motif-crown',
    name: 'Broken Crown',
    category: 'motif',
    description: 'Symbol of fallen royalty and lost authority',
    icon: '👑',
    color: '#fbbf24',
    rarity: 'rare',
    attributes: { CHA: 1, WIS: 1 },
    keywords: ['royal', 'fallen', 'noble', 'authority'],
    lore: 'Even broken, a crown remembers the weight of rule.'
  },
  {
    id: 'motif-sword',
    name: 'Ancient Blade',
    category: 'motif',
    description: 'A weapon forged in elder days',
    icon: '🗡️',
    color: '#6b7280',
    rarity: 'uncommon',
    attributes: { STR: 2, CHA: 1 },
    keywords: ['ancient', 'sharp', 'legendary', 'cutting'],
    lore: 'This blade has tasted the blood of legends.'
  },
  {
    id: 'motif-book',
    name: 'Forbidden Tome',
    category: 'motif',
    description: 'Knowledge too dangerous for mortal minds',
    icon: '📖',
    color: '#7c2d12',
    rarity: 'epic',
    attributes: { INT: 3, WIS: -1 },
    keywords: ['forbidden', 'dark', 'knowledgeable', 'dangerous'],
    lore: 'Some knowledge comes at too great a price to ignore.'
  },
  {
    id: 'motif-star',
    name: 'Guiding Star',
    category: 'motif',
    description: 'A celestial beacon in the darkness',
    icon: '⭐',
    color: '#fbbf24',
    rarity: 'rare',
    attributes: { WIS: 2, CHA: 1 },
    keywords: ['guiding', 'celestial', 'bright', 'hopeful'],
    lore: 'Even in deepest night, some lights never fade.'
  },
  {
    id: 'motif-mirror',
    name: 'Truth Mirror',
    category: 'motif',
    description: 'Reflects the hidden nature of all things',
    icon: '🪞',
    color: '#8b5cf6',
    rarity: 'uncommon',
    attributes: { WIS: 2, INT: 1 },
    keywords: ['revealing', 'truthful', 'reflective', 'insightful'],
    lore: 'The mirror shows not what is, but what could be.'
  },
  {
    id: 'motif-chains',
    name: 'Broken Chains',
    category: 'motif',
    description: 'Symbol of freedom from bondage',
    icon: '⛓️‍💥',
    color: '#dc2626',
    rarity: 'uncommon',
    attributes: { STR: 1, AGI: 2 },
    keywords: ['free', 'liberated', 'unbound', 'rebellious'],
    lore: 'No chain can hold what refuses to be bound.'
  }
];

// Forge slot configuration
const FORGE_SLOTS: ForgeSlot[] = [
  { id: 'A', position: 'Apex', angle: 0, x: 200, y: 50, card: null },
  { id: 'B', position: 'Top-Right', angle: 60, x: 300, y: 100, card: null },
  { id: 'C', position: 'Right', angle: 120, x: 300, y: 200, card: null },
  { id: 'D', position: 'Bottom', angle: 180, x: 200, y: 250, card: null },
  { id: 'E', position: 'Bottom-Left', angle: 240, x: 100, y: 200, card: null },
  { id: 'F', position: 'Left', angle: 300, x: 100, y: 100, card: null }
];

const CATEGORY_COLORS = {
  virtue: '#f59e0b',
  vice: '#dc2626',
  element: '#0ea5e9',
  archetype: '#6b7280',
  motif: '#8b5cf6'
};

export default function CharacterForge() {
  const [slots, setSlots] = useState<ForgeSlot[]>(FORGE_SLOTS);
  const [boosterPack, setBoosterPack] = useState<EssenceCard[]>([]);
  const [rerollsLeft, setRerollsLeft] = useState(2);
  const [backstory, setBackstory] = useState<BackstoryData | null>(null);
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [characterSheet, setCharacterSheet] = useState<CharacterSheet | null>(null);
  const [generationProgress, setGenerationProgress] = useState('');

  // Generate random booster pack
  const generateBoosterPack = useCallback(() => {
    const shuffled = [...ESSENCE_CARDS].sort(() => 0.5 - Math.random());
    setBoosterPack(shuffled.slice(0, 10));
  }, []);

  // Add random card to existing booster pack
  const addRandomCard = useCallback(() => {
    const availableCards = ESSENCE_CARDS.filter(card => 
      !boosterPack.some(existing => existing.id === card.id)
    );
    
    if (availableCards.length > 0) {
      const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
      setBoosterPack(prev => [...prev, randomCard]);
    }
  }, [boosterPack]);

  // Add 15 random cards to existing booster pack
  const addRandomBooster = useCallback(() => {
    const availableCards = ESSENCE_CARDS.filter(card => 
      !boosterPack.some(existing => existing.id === card.id)
    );
    
    const shuffled = [...availableCards].sort(() => 0.5 - Math.random());
    const randomCards = shuffled.slice(0, Math.min(15, shuffled.length));
    
    setBoosterPack(prev => [...prev, ...randomCards]);
  }, [boosterPack]);

  // Clear entire booster pack
  const clearBoosterPack = useCallback(() => {
    setBoosterPack([]);
    setRerollsLeft(2); // Reset rerolls when clearing
  }, []);

  // Initialize with first booster pack
  useEffect(() => {
    generateBoosterPack();
  }, [generateBoosterPack]);

  // Reroll booster pack
  const rerollBoosterPack = useCallback(() => {
    if (rerollsLeft > 0) {
      generateBoosterPack();
      setRerollsLeft(prev => prev - 1);
    }
  }, [rerollsLeft, generateBoosterPack]);

  // Calculate current character stats
  const calculateStats = useCallback((): CharacterStats => {
    const baseStats = { STR: 6, AGI: 6, CON: 6, INT: 6, WIS: 6, CHA: 6 };
    
    slots.forEach(slot => {
      if (slot.card) {
        Object.entries(slot.card.attributes).forEach(([stat, modifier]) => {
          if (modifier && stat in baseStats) {
            (baseStats as any)[stat] += modifier;
          }
        });
      }
    });

    // Clamp to 1-10 range
    Object.keys(baseStats).forEach(stat => {
      (baseStats as any)[stat] = Math.max(1, Math.min(10, (baseStats as any)[stat]));
    });

    return baseStats;
  }, [slots]);

  // Handle card drop onto forge slot
  const handleCardDrop = useCallback((slotId: string, cardId: string) => {
    const card = boosterPack.find(c => c.id === cardId);
    if (!card) return;

    setSlots(prev => prev.map(slot => 
      slot.id === slotId ? { ...slot, card } : slot
    ));
  }, [boosterPack]);

  // Clear forge slot
  const clearSlot = useCallback((slotId: string) => {
    setSlots(prev => prev.map(slot => 
      slot.id === slotId ? { ...slot, card: null } : slot
    ));
  }, []);

  // Generate character (stub implementation)
  const generateCharacter = useCallback(async () => {
    if (!backstory) {
      alert('Please upload a backstory first!');
      return;
    }

    const filledSlots = slots.filter(slot => slot.card);
    if (filledSlots.length < 6) {
      alert('Please place all 6 essence cards on the forge!');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress('Channeling essence energies...');

    // Simulate AI generation with streaming
    const steps = [
      'Analyzing backstory elements...',
      'Extracting world keywords...',
      'Fusing essence attributes...',
      'Weaving character narrative...',
      'Crystallizing personality traits...',
      'Manifesting character sheet...'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setGenerationProgress(steps[i]);
    }

    // Create mock character sheet
    const stats = calculateStats();
    const essenceNames = filledSlots.map(slot => slot.card!.name);
    const allKeywords = filledSlots.flatMap(slot => slot.card!.keywords);

    const mockCharacter: CharacterSheet = {
      name: 'Lyra Stormweaver',
      roleClass: 'Elemental Mage',
      attributes: stats,
      backstory: `Born during the Great Storm of ${backstory.world}, this character embodies the essence of ${essenceNames.join(', ')}. Their path is intertwined with ${backstory.premise.toLowerCase()}.`,
      personality: `A ${allKeywords[0]} soul with ${allKeywords[1]} tendencies, shaped by the forces of ${essenceNames[0]} and ${essenceNames[1]}.`,
      abilities: [
        'Essence Manipulation',
        `${essenceNames[0]} Mastery`,
        `${essenceNames[1]} Channeling`
      ],
      plotHooks: [
        `Seeks to understand the ${essenceNames[2]} within`,
        `Haunted by visions of ${backstory.world}`,
        `Drawn to conflicts involving ${allKeywords[2]}`
      ]
    };

    setCharacterSheet(mockCharacter);
    setIsGenerating(false);
    setGenerationProgress('');
  }, [backstory, slots, calculateStats]);

  // Handle backstory file upload
  const handleBackstoryUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        // Basic validation
        if (data.title && data.premise && data.world && data.freeText) {
          setBackstory(data);
        } else {
          alert('Invalid backstory format. Please include title, premise, world, and freeText.');
        }
      } catch (error) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  }, []);

  // Crystal Mandala Character Nexus Component
  const CrystalMandalaCharacterNexus = () => {
    const centerX = 400;
    const centerY = 300;
    const hexSize = 40;
    const rStar = 80;
    const rHexRing = rStar + (1.25 * hexSize);
    const rDiamond = rStar + (0.60 * hexSize);
    const rCap = rDiamond + (0.55 * hexSize);

    const getPosition = (index: number, radius: number) => {
      const angle = (index * 60 - 90) * (Math.PI / 180);
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    };

    return (
      <svg 
        width="800" 
        height="600" 
        className="absolute inset-0 w-full h-full"
        style={{ filter: 'drop-shadow(0 0 20px rgba(155, 125, 206, 0.3))' }}
      >
        <defs>
          <radialGradient id="coreGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#4B286D" />
            <stop offset="40%" stopColor="#9B7DCE" />
            <stop offset="100%" stopColor="#B493E8" />
          </radialGradient>
          
          <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFC84A" />
            <stop offset="100%" stopColor="#F4A534" />
          </linearGradient>
          
          <radialGradient id="diamondGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#FF8157" />
            <stop offset="70%" stopColor="#EF3B24" />
            <stop offset="100%" stopColor="#C41E3A" />
          </radialGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background Lattice */}
        <pattern id="hexGrid" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
          <polygon 
            points="30,0 54,15 54,37 30,52 6,37 6,15"
            fill="none"
            stroke="rgba(255,255,255,0.02)"
            strokeWidth="1"
          />
        </pattern>
        <rect width="100%" height="100%" fill="url(#hexGrid)" />

        {/* Ether Cables */}
        {Array.from({ length: 6 }, (_, i) => {
          const start = getPosition(i, rCap);
          const end = getPosition((i + 1) % 6, rCap);
          const midX = (start.x + end.x) / 2;
          const midY = (start.y + end.y) / 2 - 30;
          
          return (
            <motion.path
              key={`cable-${i}`}
              d={`M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`}
              stroke="#2F3F2E"
              strokeWidth="3"
              fill="none"
              opacity="0.7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: i * 0.2 }}
            />
          );
        })}

        {/* Energy Pulses */}
        {Array.from({ length: 6 }, (_, i) => {
          const start = getPosition(i, rCap);
          const end = getPosition((i + 1) % 6, rCap);
          const hasCards = slots[i]?.card && slots[(i + 1) % 6]?.card;
          
          return hasCards ? (
            <motion.circle
              key={`pulse-${i}`}
              r="4"
              fill="#2dd4bf"
              filter="url(#glow)"
              animate={{
                cx: [start.x, end.x],
                cy: [start.y, end.y],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "linear"
              }}
            />
          ) : null;
        })}

        {/* Blue Hex Ring */}
        {Array.from({ length: 18 }, (_, i) => {
          const angle = (i * 20) * (Math.PI / 180);
          const x = centerX + rHexRing * Math.cos(angle);
          const y = centerY + rHexRing * Math.sin(angle);
          const size = hexSize * 0.7;
          
          return (
            <motion.polygon
              key={`hex-${i}`}
              points={`${x},${y-size} ${x+size*0.866},${y-size*0.5} ${x+size*0.866},${y+size*0.5} ${x},${y+size} ${x-size*0.866},${y+size*0.5} ${x-size*0.866},${y-size*0.5}`}
              fill="#1A6C92"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2, delay: i * 0.1 }}
            />
          );
        })}

        {/* Golden Star Layer */}
        {Array.from({ length: 6 }, (_, i) => {
          const angle = i * 60 * (Math.PI / 180);
          const tipX = centerX + rStar * Math.cos(angle);
          const tipY = centerY + rStar * Math.sin(angle);
          
          const innerRadius = rStar * 0.4;
          const sideRadius = rStar * 0.6;
          const leftAngle = angle - Math.PI / 6;
          const rightAngle = angle + Math.PI / 6;
          
          const innerX = centerX + innerRadius * Math.cos(angle);
          const innerY = centerY + innerRadius * Math.sin(angle);
          const leftX = centerX + sideRadius * Math.cos(leftAngle);
          const leftY = centerY + sideRadius * Math.sin(leftAngle);
          const rightX = centerX + sideRadius * Math.cos(rightAngle);
          const rightY = centerY + sideRadius * Math.sin(rightAngle);
          
          return (
            <motion.polygon
              key={`star-${i}`}
              points={`${tipX},${tipY} ${leftX},${leftY} ${innerX},${innerY} ${rightX},${rightY}`}
              fill="url(#starGradient)"
              stroke="rgba(255,196,74,0.6)"
              strokeWidth="2"
              filter="url(#glow)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, delay: i * 0.2, type: "spring" }}
            />
          );
        })}

        {/* Obsidian Capacitors */}
        {Array.from({ length: 6 }, (_, i) => {
          const pos = getPosition(i, rCap);
          const width = 25;
          const height = 35;
          const points = [
            [pos.x - width/2, pos.y - height/2],
            [pos.x + width/2, pos.y - height/2],
            [pos.x + width/3, pos.y + height/2],
            [pos.x - width/3, pos.y + height/2]
          ];
          
          return (
            <motion.polygon
              key={`capacitor-${i}`}
              points={points.map(p => `${p[0]},${p[1]}`).join(' ')}
              fill="#272321"
              stroke="#3a3a3a"
              strokeWidth="1"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: i * 0.3 }}
            />
          );
        })}

        {/* Essence Card Slots (Ruby Diamonds) */}
        {Array.from({ length: 6 }, (_, i) => {
          const pos = getPosition(i, rDiamond);
          const size = 18;
          const slot = slots[i];
          
          return (
            <motion.g key={`diamond-${i}`}>
              {/* Diamond shape */}
              <motion.polygon
                points={`${pos.x},${pos.y-size} ${pos.x+size*0.6},${pos.y} ${pos.x},${pos.y+size} ${pos.x-size*0.6},${pos.y}`}
                fill="url(#diamondGradient)"
                stroke="#FF8157"
                strokeWidth="2"
                filter="url(#glow)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 2, delay: i * 0.25, type: "spring" }}
              />
              
              {/* Drop Zone */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r="35"
                fill="transparent"
                stroke={slot?.card ? "#10b981" : "rgba(255,255,255,0.1)"}
                strokeWidth="2"
                strokeDasharray="5,5"
                className="cursor-pointer"
                animate={{ 
                  strokeDashoffset: [0, 10],
                  scale: draggedCard ? [1, 1.1, 1] : 1
                }}
                transition={{ 
                  strokeDashoffset: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1, repeat: Infinity }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedCard) {
                    handleCardDrop(slot.id, draggedCard);
                    setDraggedCard(null);
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
              />
              
              {/* Placed Card */}
              {slot?.card && (
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  onClick={() => clearSlot(slot.id)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="30"
                    fill={CATEGORY_COLORS[slot.card.category]}
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="2"
                  />
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="24"
                    fill="white"
                  >
                    {slot.card.icon}
                  </text>
                </motion.g>
              )}
            </motion.g>
          );
        })}

        {/* Purple Core Eye - Character Generation Nexus */}
        <motion.g>
          {/* Outer aura */}
          <motion.circle
            cx={centerX}
            cy={centerY}
            r="100"
            fill="url(#coreGradient)"
            opacity="0.3"
            animate={{ 
              scale: isGenerating ? [1, 1.3, 1] : [1, 1.05, 1],
              opacity: isGenerating ? [0.3, 0.7, 0.3] : [0.3, 0.4, 0.3]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Main iris */}
          <motion.circle
            cx={centerX}
            cy={centerY}
            r="75"
            fill="#9B7DCE"
            stroke="#B493E8"
            strokeWidth="3"
            filter="url(#glow)"
            animate={{ 
              scale: isGenerating ? [1, 1.2, 1] : 1,
              rotate: isGenerating ? 360 : 0
            }}
            transition={{ 
              scale: { duration: 2, repeat: isGenerating ? Infinity : 0 },
              rotate: { duration: 8, repeat: isGenerating ? Infinity : 0, ease: "linear" }
            }}
          />
          
          {/* Deep plum pupil */}
          <motion.circle
            cx={centerX}
            cy={centerY}
            r="35"
            fill="#4B286D"
            animate={{ 
              scale: isGenerating ? [1, 0.7, 1] : 1
            }}
            transition={{ duration: 1.5, repeat: isGenerating ? Infinity : 0 }}
          />
          
          {/* Central icon */}
          <motion.text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="28"
            fill="white"
            fontWeight="bold"
            animate={{ 
              scale: isGenerating ? [1, 1.3, 1] : 1,
              opacity: isGenerating ? [1, 0.6, 1] : 1
            }}
            transition={{ duration: 1.2, repeat: isGenerating ? Infinity : 0 }}
          >
            {isGenerating ? '✨' : '👤'}
          </motion.text>
        </motion.g>

        {/* Slot Labels */}
        {slots.map((slot, i) => {
          const pos = getPosition(i, rDiamond + 70);
          return (
            <text
              key={`label-${i}`}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="11"
              fill="rgba(255,255,255,0.6)"
              fontWeight="bold"
            >
              {slot.id}: {slot.position}
            </text>
          );
        })}
      </svg>
    );
  };

  const currentStats = calculateStats();

  return (
    <>
      <Head>
        <title>Character Creation Forge - Equorn</title>
        <meta name="description" content="Create legendary characters through essence card fusion" />
      </Head>

      <div className="min-h-screen bg-dark-900 flex">
        {/* Left Panel - Backstory & Booster Pack */}
        <div className="w-80 bg-dark-800 border-r border-dark-700 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-serif font-bold mb-6 text-primary-400">
              🔮 Character Forge
            </h1>

            {/* Backstory Upload */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-300 mb-3">📁 Campaign Backstory</h3>
              <label className="w-full btn btn-outline text-sm cursor-pointer text-center">
                {backstory ? '✅ Backstory Loaded' : '📁 Upload JSON'}
                <input
                  type="file"
                  accept=".json"
                  onChange={handleBackstoryUpload}
                  className="hidden"
                />
              </label>
              {backstory && (
                <div className="mt-2 p-2 bg-dark-700 rounded text-xs">
                  <div className="font-bold text-primary-300">{backstory.title}</div>
                  <div className="text-gray-400">{backstory.premise}</div>
                </div>
              )}
            </div>

            {/* Booster Pack */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-300">🃏 Essence Booster Pack</h3>
                <div className="text-xs text-gray-500">
                  {boosterPack.length} cards
                </div>
              </div>
              
              {/* Booster Pack Controls */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={rerollBoosterPack}
                  disabled={rerollsLeft === 0}
                  className="text-xs btn btn-outline disabled:opacity-50"
                >
                  🔄 Reroll ({rerollsLeft})
                </button>
                <button
                  onClick={clearBoosterPack}
                  className="text-xs btn btn-outline"
                >
                  🗑️ Clear
                </button>
                <button
                  onClick={addRandomCard}
                  disabled={boosterPack.length >= ESSENCE_CARDS.length}
                  className="text-xs btn btn-outline disabled:opacity-50"
                >
                  🎲 Random Card
                </button>
                <button
                  onClick={addRandomBooster}
                  disabled={boosterPack.length + 15 > ESSENCE_CARDS.length}
                  className="text-xs btn btn-outline disabled:opacity-50"
                >
                  📦 +15 Cards
                </button>
              </div>
              
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {boosterPack.map((card) => (
                  <motion.div
                    key={card.id}
                    className="p-2 rounded border border-dark-600 hover:border-dark-500 cursor-grab active:cursor-grabbing"
                    style={{ borderColor: CATEGORY_COLORS[card.category] }}
                    draggable
                    onDragStart={() => setDraggedCard(card.id)}
                    onDragEnd={() => setDraggedCard(null)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{card.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-200 truncate">
                          {card.name}
                        </div>
                        <div className="text-xs text-gray-400 capitalize">
                          {card.category}
                        </div>
                      </div>
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: CATEGORY_COLORS[card.category] }}
                      />
                    </div>
                    
                    {/* Attribute preview */}
                    {Object.keys(card.attributes).length > 0 && (
                      <div className="mt-1 text-xs text-gray-500">
                        {Object.entries(card.attributes).map(([stat, mod]) => 
                          mod && `${stat}${mod > 0 ? '+' : ''}${mod}`
                        ).filter(Boolean).join(', ')}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stats Preview */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-300 mb-3">📊 Current Stats</h3>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {Object.entries(currentStats).map(([stat, value]) => (
                  <div key={stat} className="text-center">
                    <div className="font-bold text-gray-300">{stat}</div>
                    <div className={`text-lg ${value > 6 ? 'text-green-400' : value < 6 ? 'text-red-400' : 'text-gray-400'}`}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Center Panel - Crystal Mandala */}
        <div className="flex-1 relative overflow-hidden">
          <div className="w-full h-full relative bg-gradient-to-br from-dark-900 via-purple-900/20 to-dark-950">
            <div className="absolute inset-0 flex items-center justify-center">
              <CrystalMandalaCharacterNexus />
            </div>

            {/* Generate Button */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <motion.button
                onClick={generateCharacter}
                disabled={isGenerating || !backstory || slots.filter(s => s.card).length < 6}
                className={`px-8 py-4 rounded-lg font-bold text-lg transition-all ${
                  isGenerating 
                    ? 'bg-purple-600 text-white cursor-not-allowed shadow-lg shadow-purple-500/50'
                    : backstory && slots.filter(s => s.card).length === 6
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-dark-600 text-gray-400 cursor-not-allowed'
                }`}
                whileHover={!isGenerating && backstory && slots.filter(s => s.card).length === 6 ? { scale: 1.05 } : {}}
                whileTap={!isGenerating && backstory && slots.filter(s => s.card).length === 6 ? { scale: 0.95 } : {}}
              >
                {isGenerating ? '✨ Forging Character...' : '👤 Birth Character'}
              </motion.button>
            </div>

            {/* Progress Display */}
            {isGenerating && (
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-dark-800 px-4 py-2 rounded-lg">
                <div className="text-purple-300 text-sm">{generationProgress}</div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Character Sheet */}
        <div className="w-80 bg-dark-800 border-l border-dark-700 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-bold text-gray-200 mb-4">📜 Character Sheet</h3>

            {characterSheet ? (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="bg-dark-700 p-4 rounded-lg">
                  <h4 className="text-lg font-bold text-primary-300 mb-2">{characterSheet.name}</h4>
                  <p className="text-sm text-gray-400 mb-3">{characterSheet.roleClass}</p>
                  
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {Object.entries(characterSheet.attributes).map(([stat, value]) => (
                      <div key={stat} className="text-center">
                        <div className="text-xs text-gray-400">{stat}</div>
                        <div className="text-lg font-bold text-primary-400">{value}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-sm font-bold text-gray-300">Backstory</h5>
                      <p className="text-xs text-gray-400">{characterSheet.backstory}</p>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-bold text-gray-300">Personality</h5>
                      <p className="text-xs text-gray-400">{characterSheet.personality}</p>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-bold text-gray-300">Abilities</h5>
                      <ul className="text-xs text-gray-400">
                        {characterSheet.abilities.map((ability, i) => (
                          <li key={i}>• {ability}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-bold text-gray-300">Plot Hooks</h5>
                      <ul className="text-xs text-gray-400">
                        {characterSheet.plotHooks.map((hook, i) => (
                          <li key={i}>• {hook}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 btn btn-primary text-xs">
                    📋 Copy
                  </button>
                  <button className="flex-1 btn btn-outline text-xs">
                    📥 Download
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">👤</div>
                <div className="text-sm">Character will appear here</div>
                <div className="text-xs mt-2">Upload backstory & place 6 essences</div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Generation Animation Overlay */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-center"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.5 }}
              >
                <motion.div
                  className="text-8xl mb-4"
                  animate={{ rotate: 360, scale: [1, 1.3, 1] }}
                  transition={{ 
                    rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                  }}
                  style={{ 
                    filter: 'drop-shadow(0 0 20px #9B7DCE)',
                    textShadow: '0 0 30px #B493E8'
                  }}
                >
                  ✨
                </motion.div>
                <motion.div
                  className="text-3xl font-bold text-purple-300 mb-2"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Character Birth Ritual
                </motion.div>
                <motion.div
                  className="text-gray-300"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {generationProgress}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
} 