import { useState, useCallback, useRef, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// Reuse card types from cards.tsx
type CardType = 'entity' | 'location' | 'artifact' | 'quest' | 'event';

interface HexCard {
  id: string;
  type: CardType;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  stats?: {
    power?: number;
    magic?: number;
    wisdom?: number;
    mystery?: number;
  };
  metadata?: {
    personality_traits: string[];
    physical_features: string[];
    background_elements: string[];
    magical_aspects: string[];
    behavioral_patterns: string[];
    core_motivations: string[];
    influence_weight: number;
    prompt_keywords: string[];
    narrative_hooks: string[];
  };
}

interface ForgeSlot {
  id: string;
  position: string;
  domain: string;
  angle: number;
  x: number;
  y: number;
  card: HexCard | null;
  opposes: string;
}

interface ForgeResult {
  card: HexCard;
  baseScore: number;
  synergyBonus: number;
  oppositionDrag: number;
  finalScore: number;
  probability: {
    rare: number;
    epic: number;
    legendary: number;
  };
}

// Forge configuration
const FORGE_SLOTS: ForgeSlot[] = [
  // Top 3 - Physical Aspects
  { id: 'A', position: 'Apex', domain: 'Physical Power', angle: 0, x: 200, y: 50, card: null, opposes: 'D' },
  { id: 'B', position: 'Top-Right', domain: 'Physical Features', angle: 60, x: 300, y: 100, card: null, opposes: 'E' },
  { id: 'C', position: 'Right', domain: 'Physical Abilities', angle: 120, x: 300, y: 200, card: null, opposes: 'F' },
  
  // Bottom 3 - Mental/Psyche/Character Traits
  { id: 'D', position: 'Bottom', domain: 'Core Personality', angle: 180, x: 200, y: 250, card: null, opposes: 'A' },
  { id: 'E', position: 'Bottom-Left', domain: 'Mental Abilities', angle: 240, x: 100, y: 200, card: null, opposes: 'B' },
  { id: 'F', position: 'Left', domain: 'Character Traits', angle: 300, x: 100, y: 100, card: null, opposes: 'C' }
];

const RARITY_VALUES = {
  common: 1,
  uncommon: 2,
  rare: 4,
  epic: 8,
  legendary: 16
};

const RARITY_COLORS = {
  common: '#6b7280',
  uncommon: '#10b981',
  rare: '#3b82f6',
  epic: '#8b5cf6',
  legendary: '#f59e0b'
};

// Sample cards for demo
const SAMPLE_CARDS: HexCard[] = [
  {
    id: '1', type: 'artifact', title: 'Iron Dagger', subtitle: 'Common Weapon',
    description: 'A simple but effective blade', icon: '🗡️', color: '#6b7280', rarity: 'common',
    stats: { power: 3, magic: 1, wisdom: 1, mystery: 1 },
    metadata: {
      personality_traits: ['focused', 'determined'],
      physical_features: ['weapon-bearing', 'sharp-eyed'],
      background_elements: ['warrior training', 'blade mastery'],
      magical_aspects: ['steel-bound spirit'],
      behavioral_patterns: ['direct action', 'swift strikes'],
      core_motivations: ['protect others', 'master combat'],
      influence_weight: 4,
      prompt_keywords: ['warrior', 'blade', 'fighter'],
      narrative_hooks: ['weapon bond', 'combat training']
    }
  },
  {
    id: '2', type: 'entity', title: 'Fire Elemental', subtitle: 'Uncommon Entity',
    description: 'Burns with ancient fury', icon: '🔥', color: '#dc2626', rarity: 'uncommon',
    stats: { power: 4, magic: 6, wisdom: 2, mystery: 3 },
    metadata: {
      personality_traits: ['passionate', 'fierce', 'untamed'],
      physical_features: ['burning eyes', 'flame-wreathed form'],
      background_elements: ['elemental plane origin', 'ancient fire'],
      magical_aspects: ['fire mastery', 'elemental essence'],
      behavioral_patterns: ['quick to anger', 'explosive reactions'],
      core_motivations: ['spread flame', 'burn away weakness'],
      influence_weight: 6,
      prompt_keywords: ['fire', 'elemental', 'passionate'],
      narrative_hooks: ['elemental summoning', 'fire awakening']
    }
  },
  {
    id: '3', type: 'artifact', title: 'Laser Pistol', subtitle: 'Common Tech',
    description: 'Precise energy weapon', icon: '🔫', color: '#374151', rarity: 'common',
    stats: { power: 4, magic: 2, wisdom: 3, mystery: 1 },
    metadata: {
      personality_traits: ['precise', 'analytical'],
      physical_features: ['tech-augmented', 'steady hands'],
      background_elements: ['advanced training', 'tech familiarity'],
      magical_aspects: ['energy channeling'],
      behavioral_patterns: ['calculated moves', 'precision strikes'],
      core_motivations: ['technological mastery', 'efficient solutions'],
      influence_weight: 3,
      prompt_keywords: ['tech', 'precise', 'energy'],
      narrative_hooks: ['tech discovery', 'advanced training']
    }
  },
  {
    id: '4', type: 'entity', title: 'Mind Flayer', subtitle: 'Uncommon Psionic',
    description: 'Feeds on thoughts and dreams', icon: '🧠', color: '#7c3aed', rarity: 'uncommon',
    stats: { power: 2, magic: 5, wisdom: 7, mystery: 6 },
    metadata: {
      personality_traits: ['calculating', 'mysterious', 'ancient'],
      physical_features: ['piercing eyes', 'otherworldly presence'],
      background_elements: ['ancient knowledge', 'psychic mastery'],
      magical_aspects: ['mind reading', 'psychic powers'],
      behavioral_patterns: ['manipulates thoughts', 'seeks knowledge'],
      core_motivations: ['gather intelligence', 'expand consciousness'],
      influence_weight: 7,
      prompt_keywords: ['psychic', 'ancient', 'mind'],
      narrative_hooks: ['psychic awakening', 'forbidden knowledge']
    }
  },
  {
    id: '5', type: 'event', title: 'Terror Wave', subtitle: 'Common Psychological',
    description: 'Instills deep fear in all', icon: '😱', color: '#1f2937', rarity: 'common',
    stats: { power: 1, magic: 3, wisdom: 1, mystery: 5 },
    metadata: {
      personality_traits: ['cautious', 'haunted', 'vigilant'],
      physical_features: ['darting eyes', 'tense posture'],
      background_elements: ['traumatic event', 'survivor'],
      magical_aspects: ['fear resistance', 'darkness touched'],
      behavioral_patterns: ['hyperaware', 'defensive'],
      core_motivations: ['overcome fear', 'protect others'],
      influence_weight: 3,
      prompt_keywords: ['survivor', 'fearful', 'cautious'],
      narrative_hooks: ['traumatic past', 'fear overcome']
    }
  },
  {
    id: '6', type: 'artifact', title: 'Steel Breastplate', subtitle: 'Uncommon Armor',
    description: 'Solid protection for warriors', icon: '🛡️', color: '#4b5563', rarity: 'uncommon',
    stats: { power: 6, magic: 1, wisdom: 2, mystery: 1 },
    metadata: {
      personality_traits: ['stalwart', 'protective', 'reliable'],
      physical_features: ['imposing presence', 'armored form'],
      background_elements: ['guardian training', 'defensive mastery'],
      magical_aspects: ['protection ward', 'resilience'],
      behavioral_patterns: ['shields others', 'stands firm'],
      core_motivations: ['protect allies', 'hold the line'],
      influence_weight: 5,
      prompt_keywords: ['guardian', 'protector', 'defensive'],
      narrative_hooks: ['defender oath', 'guardian duty']
    }
  },
  {
    id: '7', type: 'entity', title: 'Dragon Lord', subtitle: 'Legendary Entity',
    description: 'Ancient master of flame and wisdom', icon: '🐉', color: '#dc2626', rarity: 'legendary',
    stats: { power: 10, magic: 9, wisdom: 8, mystery: 7 },
    metadata: {
      personality_traits: ['wise', 'proud', 'ancient', 'powerful'],
      physical_features: ['draconic features', 'commanding presence', 'ancient eyes'],
      background_elements: ['draconic heritage', 'ancient wisdom', 'legendary deeds'],
      magical_aspects: ['dragon magic', 'ancient power', 'elemental mastery'],
      behavioral_patterns: ['commands respect', 'strategic thinking', 'protective of domain'],
      core_motivations: ['preserve knowledge', 'protect legacy', 'guide others'],
      influence_weight: 10,
      prompt_keywords: ['dragon', 'ancient', 'wise', 'powerful'],
      narrative_hooks: ['draconic bloodline', 'ancient pact', 'legendary destiny']
    }
  },
  {
    id: '8', type: 'artifact', title: 'Quantum Core', subtitle: 'Epic Tech',
    description: 'Harnesses reality itself', icon: '⚛️', color: '#8b5cf6', rarity: 'epic',
    stats: { power: 5, magic: 8, wisdom: 6, mystery: 9 },
    metadata: {
      personality_traits: ['brilliant', 'curious', 'visionary'],
      physical_features: ['energy aura', 'tech-merged', 'glowing eyes'],
      background_elements: ['quantum research', 'reality experiments'],
      magical_aspects: ['reality manipulation', 'quantum magic'],
      behavioral_patterns: ['bends reality', 'thinks in possibilities'],
      core_motivations: ['understand reality', 'transcend limits'],
      influence_weight: 8,
      prompt_keywords: ['quantum', 'reality', 'transcendent'],
      narrative_hooks: ['reality breach', 'quantum awakening']
    }
  }
];

type ForgeMode = 'synthesis' | 'infusion' | 'reforge';

export default function HexForge() {
  const [slots, setSlots] = useState<ForgeSlot[]>(FORGE_SLOTS);
  const [availableCards, setAvailableCards] = useState<HexCard[]>(SAMPLE_CARDS);
  const [arcana, setArcana] = useState(150);
  const [selectedMode, setSelectedMode] = useState<ForgeMode>('synthesis');
  const [isForging, setIsForging] = useState(false);
  const [forgeResult, setForgeResult] = useState<ForgeResult | null>(null);
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [probabilities, setProbabilities] = useState<{rare: number, epic: number, legendary: number} | null>(null);

  // Calculate forge probabilities
  const calculateProbabilities = useCallback(() => {
    const filledSlots = slots.filter(slot => slot.card);
    if (filledSlots.length === 0) return null;

    let baseScore = 0;
    let synergyBonus = 0;
    let oppositionDrag = 0;

    // Base fusion score
    filledSlots.forEach(slot => {
      const rarityValue = RARITY_VALUES[slot.card!.rarity];
      baseScore += rarityValue;
    });

    // Synergy calculations
    filledSlots.forEach(slot => {
      // Domain match bonus
      const cardMatchesDomain = checkDomainMatch(slot.card!, slot.domain);
      if (cardMatchesDomain) {
        synergyBonus += 0.1; // +10%
      }
    });

    // Adjacent element matching
    for (let i = 0; i < filledSlots.length; i++) {
      const current = filledSlots[i];
      const next = filledSlots[(i + 1) % filledSlots.length];
      if (current && next && checkElementMatch(current.card!, next.card!)) {
        synergyBonus += 0.05; // +5%
      }
    }

    // Opposition drag
    filledSlots.forEach(slot => {
      const opposingSlot = slots.find(s => s.id === slot.opposes);
      if (opposingSlot?.card && checkOpposition(slot.card!, opposingSlot.card)) {
        oppositionDrag += 0.15; // -15%
      }
    });

    const finalScore = baseScore * (1 + synergyBonus - oppositionDrag);

    // Probability calculation
    let rare = 100, epic = 0, legendary = 0;
    
    if (finalScore >= 25) {
      rare = 90;
      epic = 10;
    }
    if (finalScore >= 40) {
      rare = 0;
      epic = 60;
      legendary = 40;
    }

    return { rare, epic, legendary };
  }, [slots]);

  // Helper functions for synergy calculations
  const checkDomainMatch = (card: HexCard, domain: string): boolean => {
    // Any card can go anywhere, but certain combinations create synergy
    const domainMap: Record<string, string[]> = {
      // Top 3 - Physical Aspects
      'Physical Power': ['artifact', 'entity'], // Weapons, strong entities
      'Physical Features': ['entity', 'location'], // Characters, distinctive places
      'Physical Abilities': ['artifact', 'quest'], // Equipment, physical challenges
      
      // Bottom 3 - Mental/Psyche/Character Traits  
      'Core Personality': ['entity', 'event'], // Characters, life-changing events
      'Mental Abilities': ['entity', 'artifact'], // Psychic entities, mind-affecting items
      'Character Traits': ['event', 'quest'] // Formative experiences, character journeys
    };
    
    return domainMap[domain]?.includes(card.type) || false;
  };

  const checkElementMatch = (card1: HexCard, card2: HexCard): boolean => {
    // Simple color-based element matching
    return card1.color === card2.color;
  };

  const checkOpposition = (card1: HexCard, card2: HexCard): boolean => {
    // Check for conflicting traits (simplified)
    const conflicts = [
      ['fire', 'ice'], ['light', 'dark'], ['order', 'chaos'],
      ['physical', 'mental'], ['tech', 'magic']
    ];
    
    const card1Lower = card1.title.toLowerCase();
    const card2Lower = card2.title.toLowerCase();
    
    return conflicts.some(([a, b]) => 
      (card1Lower.includes(a) && card2Lower.includes(b)) ||
      (card1Lower.includes(b) && card2Lower.includes(a))
    );
  };

  // Update probabilities when slots change
  useEffect(() => {
    setProbabilities(calculateProbabilities());
  }, [slots, calculateProbabilities]);

  const handleCardDrop = useCallback((slotId: string, cardId: string) => {
    const card = availableCards.find(c => c.id === cardId);
    if (!card) return;

    setSlots(prev => prev.map(slot => 
      slot.id === slotId ? { ...slot, card } : slot
    ));
  }, [availableCards]);

  const clearSlot = useCallback((slotId: string) => {
    setSlots(prev => prev.map(slot => 
      slot.id === slotId ? { ...slot, card: null } : slot
    ));
  }, []);

  const performForge = useCallback(async () => {
    if (isForging) return;
    
    const filledSlots = slots.filter(slot => slot.card);
    if (filledSlots.length < 6) {
      alert('All 6 slots must be filled to forge!');
      return;
    }

    const cost = selectedMode === 'synthesis' ? 50 : selectedMode === 'infusion' ? 30 : 25;
    if (arcana < cost) {
      alert(`Insufficient Arcana! Need ${cost}, have ${arcana}`);
      return;
    }

    setIsForging(true);
    setArcana(prev => prev - cost);

    // Simulate forge time
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate result
    const probs = calculateProbabilities();
    const roll = Math.random() * 100;
    let resultRarity: 'rare' | 'epic' | 'legendary' = 'rare';

    if (probs) {
      if (roll < probs.legendary) {
        resultRarity = 'legendary';
      } else if (roll < probs.legendary + probs.epic) {
        resultRarity = 'epic';
      }
    }

    // Get cards from filled slots
    const forgeCards = filledSlots.map(slot => slot.card!);
    
    if (forgeCards.length === 0) {
      alert('Place cards in the forge first!');
      return;
    }

    // Create new character based on card metadata
    const characterName = generateCharacterName(forgeCards);
    const characterDescription = generateCharacterDescription(forgeCards, filledSlots.map(slot => ({ slot, card: slot.card! })));
    const characterIcon = getCharacterIcon(forgeCards);
    const dominantType = getMostCommonType(forgeCards);

    // Create new card
    const newCard: HexCard = {
      id: generateId(),
      type: dominantType,
      title: characterName,
      subtitle: `${resultRarity.charAt(0).toUpperCase() + resultRarity.slice(1)} Character`,
      description: characterDescription,
      icon: characterIcon,
      color: RARITY_COLORS[resultRarity],
      rarity: resultRarity,
      stats: {
        power: Math.floor(Math.random() * 8) + 3,
        magic: Math.floor(Math.random() * 8) + 3,
        wisdom: Math.floor(Math.random() * 8) + 3,
        mystery: Math.floor(Math.random() * 8) + 3
      },
      metadata: {
        personality_traits: forgeCards.flatMap(card => card.metadata?.personality_traits || []).slice(0, 5),
        physical_features: forgeCards.flatMap(card => card.metadata?.physical_features || []).slice(0, 3),
        background_elements: forgeCards.flatMap(card => card.metadata?.background_elements || []).slice(0, 3),
        magical_aspects: forgeCards.flatMap(card => card.metadata?.magical_aspects || []).slice(0, 2),
        behavioral_patterns: forgeCards.flatMap(card => card.metadata?.behavioral_patterns || []).slice(0, 3),
        core_motivations: forgeCards.flatMap(card => card.metadata?.core_motivations || []).slice(0, 2),
        influence_weight: Math.max(...forgeCards.map(card => card.metadata?.influence_weight || 5)),
        prompt_keywords: [
          ...forgeCards.map(card => card.title), // Include card names
          ...forgeCards.flatMap(card => card.metadata?.prompt_keywords || [])
        ].slice(0, 8),
        narrative_hooks: [
          `Forged from: ${forgeCards.map(card => card.title).join(', ')}`,
          ...forgeCards.flatMap(card => card.metadata?.narrative_hooks || [])
        ].slice(0, 4)
      }
    };

    setForgeResult({
      card: newCard,
      baseScore: 0,
      synergyBonus: 0,
      oppositionDrag: 0,
      finalScore: 0,
      probability: probs || { rare: 100, epic: 0, legendary: 0 }
    });

    setIsForging(false);
  }, [slots, selectedMode, arcana, isForging, calculateProbabilities]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Character generation functions
  const generateCharacterName = (cards: HexCard[]): string => {
    const traits = cards.flatMap(card => card.metadata?.personality_traits || []);
    const keywords = cards.flatMap(card => card.metadata?.prompt_keywords || []);
    const backgrounds = cards.flatMap(card => card.metadata?.background_elements || []);
    
    // Name components based on card metadata
    const prefixes = ['Ancient', 'Shadow', 'Iron', 'Crystal', 'Storm', 'Fire', 'Void', 'Mystic'];
    const suffixes = ['born', 'weaver', 'keeper', 'bane', 'heart', 'blade', 'walker', 'song'];
    const titles = ['the Wise', 'the Bold', 'the Mysterious', 'the Ancient', 'the Fierce', 'the Noble'];
    
    // Intelligent naming based on dominant card types and traits
    let baseName = '';
    const dominantType = getMostCommonType(cards);
    
    if (traits.length > 0) {
      // Use personality traits to influence naming
      if (traits.includes('wise') || traits.includes('ancient')) {
        baseName = `${prefixes[Math.floor(Math.random() * 3)]}${suffixes[Math.floor(Math.random() * 3)]}`;
      } else if (traits.includes('fierce') || traits.includes('determined')) {
        baseName = `${prefixes[3 + Math.floor(Math.random() * 3)]}${suffixes[3 + Math.floor(Math.random() * 3)]}`;
      } else {
        baseName = `${prefixes[Math.floor(Math.random() * prefixes.length)]}${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
      }
    } else {
      baseName = `${prefixes[Math.floor(Math.random() * prefixes.length)]}${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
    }
    
    // Add title based on dominant characteristics
    if (Math.random() > 0.5) {
      baseName += ` ${titles[Math.floor(Math.random() * titles.length)]}`;
    }
    
    return baseName;
  };

  const generateCharacterDescription = (cards: HexCard[], slotCards: { slot: ForgeSlot, card: HexCard }[]): string => {
    // Separate physical and mental aspects based on slot position
    const physicalCards = slotCards.filter(sc => ['A', 'B', 'C'].includes(sc.slot.id)).map(sc => sc.card);
    const mentalCards = slotCards.filter(sc => ['D', 'E', 'F'].includes(sc.slot.id)).map(sc => sc.card);
    
    const allTraits = cards.flatMap(card => card.metadata?.personality_traits || []);
    const allFeatures = cards.flatMap(card => card.metadata?.physical_features || []);
    const allBackgrounds = cards.flatMap(card => card.metadata?.background_elements || []);
    const allMagical = cards.flatMap(card => card.metadata?.magical_aspects || []);
    
    let description = "A character forged from ";
    
    // Describe physical aspects from top slots
    if (physicalCards.length > 0) {
      const physicalNames = physicalCards.map(card => card.title);
      description += `the physical essence of ${physicalNames.join(', ')}, `;
    }
    
    // Describe mental/character aspects from bottom slots  
    if (mentalCards.length > 0) {
      const mentalNames = mentalCards.map(card => card.title);
      description += `shaped by the character of ${mentalNames.join(', ')}. `;
    }
    
    // Add trait details
    if (allTraits.length > 0) {
      description += `Embodies ${allTraits.slice(0, 3).join(', ')}, `;
    }
    
    if (allFeatures.length > 0) {
      description += `with ${allFeatures[0]}, `;
    }
    
    if (allBackgrounds.length > 0) {
      description += `carrying ${allBackgrounds[0]}. `;
    }
    
    if (allMagical.length > 0) {
      description += `Touched by ${allMagical[0]}.`;
    } else {
      description += "Shaped by the mystical forces of the HexForge.";
    }
    
    return description;
  };

  const getMostCommonType = (cards: HexCard[]): CardType => {
    const typeCounts = cards.reduce((acc, card) => {
      acc[card.type] = (acc[card.type] || 0) + 1;
      return acc;
    }, {} as Record<CardType, number>);
    
    return Object.entries(typeCounts).reduce((a, b) => 
      typeCounts[a[0] as CardType] > typeCounts[b[0] as CardType] ? a : b
    )[0] as CardType;
  };

  const getCharacterIcon = (cards: HexCard[]): string => {
    const dominantType = getMostCommonType(cards);
    const typeIcons = {
      entity: '🧙‍♂️',
      artifact: '⚔️',
      location: '🏰',
      quest: '🗺️',
      event: '✨'
    };
    return typeIcons[dominantType] || '🧙‍♂️';
  };

  // Crystal Mandala Forge Component
  const CrystalMandalaForge = () => {
    const centerX = 400;
    const centerY = 300;
    const slotRadius = 180; // Distance from center to slot centers
    const hexSize = 45; // Size of hexagonal slots

    const getPosition = (index: number, radius: number) => {
      const angle = (index * 60 - 90) * (Math.PI / 180);
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    };

    // Create hexagon path for a given center point and size
    const createHexagonPath = (cx: number, cy: number, size: number) => {
      const points = [];
      for (let i = 0; i < 6; i++) {
        const angle = (i * 60) * (Math.PI / 180);
        const x = cx + size * Math.cos(angle);
        const y = cy + size * Math.sin(angle);
        points.push(`${x},${y}`);
      }
      return points.join(' ');
    };

    return (
      <svg 
        width="800" 
        height="600" 
        className="absolute inset-0 w-full h-full"
        style={{ filter: 'drop-shadow(0 0 20px rgba(155, 125, 206, 0.3))' }}
      >
        <defs>
          {/* Gradients */}
          <radialGradient id="coreGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#FFA500" />
            <stop offset="40%" stopColor="#FF8C00" />
            <stop offset="100%" stopColor="#FF6347" />
          </radialGradient>
          
          <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#FFA500" />
            <stop offset="100%" stopColor="#FF8C00" />
          </linearGradient>
          
          <radialGradient id="blueHexGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#4682B4" />
            <stop offset="70%" stopColor="#2F4F4F" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </radialGradient>

          <radialGradient id="crystalGradient" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#FF6B6B" />
            <stop offset="40%" stopColor="#E74C3C" />
            <stop offset="100%" stopColor="#C0392B" />
          </radialGradient>

          <linearGradient id="frameGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B7355" />
            <stop offset="50%" stopColor="#5D4E37" />
            <stop offset="100%" stopColor="#3C2F2F" />
          </linearGradient>

          {/* Filters */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="innerShadow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3"/>
            <feOffset dx="2" dy="2" result="offset"/>
            <feFlood floodColor="#000000" floodOpacity="0.4"/>
            <feComposite in2="offset" operator="in"/>
            <feMerge> 
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Outer Frame Ring */}
        <motion.circle
          cx={centerX}
          cy={centerY}
          r="280"
          fill="none"
          stroke="url(#frameGradient)"
          strokeWidth="20"
          opacity="0.8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, type: "spring" }}
        />

        {/* Frame Corner Elements */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i * 45) * (Math.PI / 180);
          const x = centerX + 300 * Math.cos(angle);
          const y = centerY + 300 * Math.sin(angle);
          
          return (
            <motion.rect
              key={`frame-${i}`}
              x={x - 15}
              y={y - 15}
              width="30"
              height="30"
              rx="5"
              fill="url(#frameGradient)"
              stroke="#3C2F2F"
              strokeWidth="2"
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 45 }}
              transition={{ duration: 1.5, delay: i * 0.1 }}
            />
          );
        })}

        {/* Blue Hexagonal Background Pattern */}
        {Array.from({ length: 19 }, (_, i) => {
          const ringIndex = Math.floor(i / 6);
          const positionInRing = i % 6;
          const radius = 80 + (ringIndex * 40);
          
          if (radius > 200) return null;
          
          const angle = (positionInRing * 60 + (ringIndex * 30)) * (Math.PI / 180);
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          
          return (
            <motion.polygon
              key={`bg-hex-${i}`}
              points={createHexagonPath(x, y, 25)}
              fill="url(#blueHexGradient)"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.7 }}
              transition={{ duration: 1.5, delay: i * 0.05 }}
            />
          );
        })}

        {/* Central Hexagonal Star */}
        <motion.g>
          {/* Outer star points */}
          {Array.from({ length: 6 }, (_, i) => {
            const angle = (i * 60) * (Math.PI / 180);
            const tipX = centerX + 70 * Math.cos(angle);
            const tipY = centerY + 70 * Math.sin(angle);
            
            const innerRadius = 35;
            const sideRadius = 50;
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
                key={`star-point-${i}`}
                points={`${tipX},${tipY} ${leftX},${leftY} ${innerX},${innerY} ${rightX},${rightY}`}
                fill="url(#starGradient)"
                stroke="#FFD700"
                strokeWidth="2"
                filter="url(#glow)"
                initial={{ scale: 0, rotate: -60 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 2, delay: i * 0.1, type: "spring" }}
              />
            );
          })}
          
          {/* Central hexagon */}
          <motion.polygon
            points={createHexagonPath(centerX, centerY, 35)}
            fill="url(#coreGradient)"
            stroke="#FFD700"
            strokeWidth="3"
            filter="url(#glow)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, type: "spring" }}
          />
          
          {/* Central forge icon */}
          <motion.text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="24"
            fill="white"
            fontWeight="bold"
            animate={{ 
              scale: isForging ? [1, 1.2, 1] : 1,
              opacity: isForging ? [1, 0.7, 1] : 1
            }}
            transition={{ duration: 1.5, repeat: isForging ? Infinity : 0 }}
          >
            {isForging ? '🔥' : '⚛️'}
          </motion.text>
        </motion.g>

        {/* 6 Hexagonal Crystal Slots */}
        {Array.from({ length: 6 }, (_, i) => {
          const pos = getPosition(i, slotRadius);
          const slot = slots[i];
          const isPhysical = ['A', 'B', 'C'].includes(slot.id);
          
          return (
            <motion.g key={`slot-${i}`}>
              {/* Crystal/Gem Shape */}
              <motion.g
                initial={{ scale: 0, rotate: 30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1.5, delay: i * 0.2, type: "spring" }}
              >
                {/* Main crystal facet */}
                <polygon
                  points={`${pos.x},${pos.y-40} ${pos.x+30},${pos.y-15} ${pos.x+25},${pos.y+25} ${pos.x},${pos.y+40} ${pos.x-25},${pos.y+25} ${pos.x-30},${pos.y-15}`}
                  fill="url(#crystalGradient)"
                  stroke="#E74C3C"
                  strokeWidth="2"
                  filter="url(#innerShadow)"
                />
                
                {/* Crystal highlight */}
                <polygon
                  points={`${pos.x-10},${pos.y-30} ${pos.x+10},${pos.y-30} ${pos.x+5},${pos.y-10} ${pos.x-5},${pos.y-10}`}
                  fill="rgba(255,255,255,0.4)"
                />
              </motion.g>

              {/* Hexagonal Slot Frame */}
              <motion.polygon
                points={createHexagonPath(pos.x, pos.y, hexSize)}
                fill="transparent"
                stroke={slot?.card ? "#10b981" : "rgba(255,255,255,0.3)"}
                strokeWidth="3"
                strokeDasharray={slot?.card ? "none" : "8,4"}
                className="cursor-pointer"
                animate={{ 
                  strokeDashoffset: slot?.card ? 0 : [0, 12],
                  scale: draggedCard ? [1, 1.05, 1] : 1,
                  stroke: slot?.card ? "#10b981" : isPhysical ? "#10b981" : "#8b5cf6"
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

              {/* Slot Inner Hexagon (for drop zone) */}
              <motion.polygon
                points={createHexagonPath(pos.x, pos.y, hexSize - 8)}
                fill={slot?.card ? "rgba(16, 185, 129, 0.1)" : "rgba(255,255,255,0.05)"}
                className="cursor-pointer"
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
                  <polygon
                    points={createHexagonPath(pos.x, pos.y, hexSize - 10)}
                    fill={slot.card.color}
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth="2"
                    filter="url(#glow)"
                  />
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="24"
                    fill="white"
                    fontWeight="bold"
                  >
                    {slot.card.icon}
                  </text>
                </motion.g>
              )}

              {/* Slot Label */}
              <text
                x={pos.x}
                y={pos.y + hexSize + 20}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="11"
                fill={isPhysical ? "#10b981" : "#8b5cf6"}
                fontWeight="bold"
              >
                {slot.id}: {slot.domain}
              </text>
              <text
                x={pos.x}
                y={pos.y + hexSize + 35}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="9"
                fill="rgba(255,255,255,0.5)"
              >
                {isPhysical ? "⚡ Physical" : "🧠 Mental"}
              </text>
            </motion.g>
          );
        })}

        {/* Connecting Energy Lines between slots */}
        {Array.from({ length: 6 }, (_, i) => {
          const start = getPosition(i, slotRadius);
          const end = getPosition((i + 1) % 6, slotRadius);
          
          return (
            <motion.line
              key={`connection-${i}`}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke="rgba(255, 215, 0, 0.3)"
              strokeWidth="2"
              strokeDasharray="5,10"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: slots.filter(s => s.card).length > 1 ? 0.6 : 0.3,
                strokeDashoffset: [0, 15]
              }}
              transition={{ 
                pathLength: { duration: 2, delay: i * 0.2 },
                strokeDashoffset: { duration: 3, repeat: Infinity, ease: "linear" }
              }}
            />
          );
        })}
      </svg>
    );
  };

  // Load cards from localStorage on component mount
  useEffect(() => {
    const savedCards = localStorage.getItem('equorn-forge-cards');
    if (savedCards) {
      try {
        const parsedCards = JSON.parse(savedCards) as HexCard[];
        if (parsedCards.length > 0) {
          setAvailableCards(parsedCards);
        }
      } catch (error) {
        console.warn('Failed to load saved cards from localStorage');
      }
    }
  }, []);

  // Save cards to localStorage whenever availableCards changes
  useEffect(() => {
    localStorage.setItem('equorn-forge-cards', JSON.stringify(availableCards));
  }, [availableCards]);

  // Import cards from Card Station localStorage
  const importFromCardStation = useCallback(() => {
    const cardStationCards = localStorage.getItem('equorn-cards');
    if (cardStationCards) {
      try {
        const parsedData = JSON.parse(cardStationCards);
        console.log('Card Station data:', parsedData); // Debug log
        
        // Handle different possible data structures
        let cards: HexCard[] = [];
        
        if (Array.isArray(parsedData)) {
          cards = parsedData;
        } else if (parsedData && typeof parsedData === 'object') {
          // Try to extract cards from object structure
          if (parsedData.cards && Array.isArray(parsedData.cards)) {
            cards = parsedData.cards;
          } else {
            // If it's a single card object, wrap it in array
            cards = [parsedData];
          }
        }
        
        console.log('Extracted cards:', cards); // Debug log
        
        if (cards.length > 0) {
          // More flexible validation - only require essential fields
          const validCards = cards.filter(card => 
            card && 
            typeof card === 'object' &&
            card.id && 
            card.title && 
            card.icon && 
            card.rarity
          ).map(card => ({
            ...card,
            // Ensure all required fields have defaults
            type: card.type || 'entity',
            subtitle: card.subtitle || '',
            description: card.description || '',
            color: card.color || '#6b7280',
            stats: card.stats || { power: 1, magic: 1, wisdom: 1, mystery: 1 },
            metadata: card.metadata || {
              personality_traits: [],
              physical_features: [],
              background_elements: [],
              magical_aspects: [],
              behavioral_patterns: [],
              core_motivations: [],
              influence_weight: 5,
              prompt_keywords: [],
              narrative_hooks: []
            }
          }));
          
          if (validCards.length > 0) {
            // Add to available cards, avoiding duplicates
            setAvailableCards(prev => {
              const existingIds = new Set(prev.map(card => card.id));
              const newCards = validCards.filter(card => !existingIds.has(card.id));
              if (newCards.length > 0) {
                alert(`Imported ${newCards.length} cards from Card Station!`);
                return [...prev, ...newCards];
              } else {
                alert('No new cards found - all cards already exist in forge.');
                return prev;
              }
            });
          } else {
            alert('No valid cards found in Card Station data.');
          }
        } else {
          alert('No cards found in Card Station. Create some cards first!');
        }
      } catch (error) {
        console.error('Card Station import error:', error);
        alert(`Error reading Card Station data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else {
      alert('No Card Station data found. Visit the Card Station to create cards first!');
    }
  }, []);

  // Import cards from JSON file
  const importCards = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData = JSON.parse(content);
        console.log('Imported file data:', parsedData); // Debug log
        
        // Handle different possible data structures
        let cards: any[] = [];
        
        if (Array.isArray(parsedData)) {
          cards = parsedData;
        } else if (parsedData && typeof parsedData === 'object') {
          // Try to extract cards from object structure
          if (parsedData.cards && Array.isArray(parsedData.cards)) {
            cards = parsedData.cards;
          } else {
            // If it's a single card object, wrap it in array
            cards = [parsedData];
          }
        }
        
        // More flexible validation - only require essential fields
        const validCards = cards.filter(card => 
          card && 
          typeof card === 'object' &&
          card.id && 
          card.title && 
          card.icon && 
          card.rarity
        ).map(card => ({
          ...card,
          // Ensure all required fields have defaults
          type: card.type || 'entity',
          subtitle: card.subtitle || '',
          description: card.description || '',
          color: card.color || '#6b7280',
          stats: card.stats || { power: 1, magic: 1, wisdom: 1, mystery: 1 },
          metadata: card.metadata || {
            personality_traits: [],
            physical_features: [],
            background_elements: [],
            magical_aspects: [],
            behavioral_patterns: [],
            core_motivations: [],
            influence_weight: 5,
            prompt_keywords: [],
            narrative_hooks: []
          }
        }));
        
        if (validCards.length > 0) {
          // Add to available cards, avoiding duplicates
          setAvailableCards(prev => {
            const existingIds = new Set(prev.map(card => card.id));
            const newCards = validCards.filter(card => !existingIds.has(card.id));
            if (newCards.length > 0) {
              alert(`Imported ${newCards.length} cards successfully!`);
              return [...prev, ...newCards];
            } else {
              alert('No new cards found - all cards already exist.');
              return prev;
            }
          });
        } else {
          alert(`No valid cards found in the file. Please ensure cards have at least: id, title, icon, and rarity fields.`);
        }
      } catch (error) {
        console.error('File import error:', error);
        alert(`Error reading file: ${error instanceof Error ? error.message : 'Invalid JSON format'}`);
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  }, []);

  // Clear all imported cards and reset to defaults
  const resetToDefaultCards = useCallback(() => {
    setAvailableCards(SAMPLE_CARDS);
    setSlots(FORGE_SLOTS.map(slot => ({ ...slot, card: null })));
    alert('Reset to default cards');
  }, []);

  // Remove a specific card from available cards
  const removeCard = useCallback((cardId: string) => {
    setAvailableCards(prev => prev.filter(card => card.id !== cardId));
    // Also remove from any slots
    setSlots(prev => prev.map(slot => 
      slot.card?.id === cardId ? { ...slot, card: null } : slot
    ));
  }, []);

  // Export current card collection
  const exportCards = useCallback(() => {
    const dataStr = JSON.stringify(availableCards, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `forge-cards-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [availableCards]);

  // Compact Card Component
  const CompactCard = ({ card, onDragStart, onDragEnd, onRemove, isRemovable }: {
    card: HexCard;
    onDragStart: () => void;
    onDragEnd: () => void;
    onRemove: () => void;
    isRemovable: boolean;
  }) => (
    <motion.div
      className="relative p-2 rounded-lg border border-dark-600 hover:border-dark-500 cursor-grab active:cursor-grabbing bg-dark-700"
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="text-center">
        <div className="text-xl mb-1">{card.icon}</div>
        <div className="text-xs font-medium text-gray-200 truncate">
          {card.title}
        </div>
        <div className="text-xs text-gray-400 capitalize">
          {card.rarity}
        </div>
        <div 
          className="w-full h-1 mt-1 rounded"
          style={{ backgroundColor: card.color }}
        />
      </div>
      {isRemovable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center hover:bg-red-400"
        >
          ×
        </button>
      )}
    </motion.div>
  );

  // Control Panel Component
  const ControlPanel = ({ selectedMode, setSelectedMode, importCards, exportCards, resetToDefaultCards, importFromCardStation, availableCards }: {
    selectedMode: ForgeMode;
    setSelectedMode: (mode: ForgeMode) => void;
    importCards: (event: React.ChangeEvent<HTMLInputElement>) => void;
    exportCards: () => void;
    resetToDefaultCards: () => void;
    importFromCardStation: () => void;
    availableCards: HexCard[];
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
      <div className="space-y-3">
        {/* Forge Mode Selector */}
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">Forge Mode</label>
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value as ForgeMode)}
            className="w-full input text-sm"
          >
            <option value="synthesis">🔄 Synthesis</option>
            <option value="infusion">✨ Infusion</option>
            <option value="reforge">♻️ Reforge</option>
          </select>
        </div>

        {/* Advanced Controls Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-xs text-gray-400 hover:text-gray-300 flex items-center justify-between"
        >
          <span>Advanced Controls</span>
          <span>{isExpanded ? '▼' : '▶'}</span>
        </button>

        {/* Collapsible Advanced Controls */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2 overflow-hidden"
            >
              <label className="w-full btn btn-secondary text-xs cursor-pointer">
                📥 Import File
                <input
                  type="file"
                  accept=".json"
                  onChange={importCards}
                  className="hidden"
                />
              </label>
              
              <a 
                href="/cards"
                className="w-full btn btn-outline text-xs text-center block"
                target="_blank"
                rel="noopener noreferrer"
              >
                ⚡ Create Cards
              </a>
              
              <button
                onClick={exportCards}
                disabled={availableCards.length === 0}
                className="w-full btn btn-outline text-xs disabled:opacity-50"
              >
                📤 Export
              </button>
              
              <button
                onClick={resetToDefaultCards}
                className="w-full btn btn-outline text-xs text-red-400"
              >
                🔄 Reset
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Forge Result Panel Component
  const ForgeResultPanel = ({ result }: { result: ForgeResult }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex items-center space-x-4"
    >
      <div className="flex-shrink-0">
        <div className="w-24 h-24 bg-dark-700 rounded-lg flex items-center justify-center text-3xl">
          {result.card.icon}
        </div>
      </div>
      
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-2">
          <h3 className="text-xl font-bold text-gray-200">{result.card.title}</h3>
          <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: result.card.color }}>
            {result.card.rarity}
          </span>
        </div>
        
        <p className="text-sm text-gray-300 mb-3">{result.card.description}</p>
        
        {result.card.stats && (
          <div className="grid grid-cols-4 gap-3 text-sm">
            {Object.entries(result.card.stats).map(([stat, value]) => (
              <div key={stat} className="text-center">
                <div className="text-xs text-gray-400 capitalize">{stat}</div>
                <div className="text-lg font-bold text-primary-400">{value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex-shrink-0 space-y-2">
        <button
          onClick={() => {
            // Add to available cards
            setAvailableCards(prev => [...prev, result.card]);
            setForgeResult(null);
          }}
          className="btn btn-primary text-sm"
        >
          ✨ Keep Character
        </button>
        <button
          onClick={() => setForgeResult(null)}
          className="btn btn-outline text-sm"
        >
          🗑️ Discard
        </button>
      </div>
    </motion.div>
  );

  return (
    <>
      <Head>
        <title>HexForge - Equorn</title>
        <meta name="description" content="Forge legendary characters from hexagon cards" />
      </Head>

      <div className="min-h-screen bg-dark-900 flex flex-col">
        {/* Top Header Bar */}
        <div className="bg-dark-800 border-b border-dark-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-serif font-bold text-primary-400">
                ⚒️ The HexForge
              </h1>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-400">Arcana:</span>
                <span className="text-xl font-bold text-primary-400">{arcana}</span>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={importFromCardStation}
                className="btn btn-primary text-sm"
              >
                🎴 Import Cards
              </button>
              <button
                onClick={performForge}
                disabled={slots.filter(s => s.card).length === 0 || isForging}
                className="btn btn-accent text-sm disabled:opacity-50"
              >
                {isForging ? '⚡ Forging...' : '⚒️ Forge Character'}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Left Panel - Card Library */}
          <div className="w-80 bg-dark-800 border-r border-dark-700 flex flex-col">
            {/* Collapsible Controls */}
            <div className="p-4 border-b border-dark-700">
              <ControlPanel 
                selectedMode={selectedMode}
                setSelectedMode={setSelectedMode}
                importCards={importCards}
                exportCards={exportCards}
                resetToDefaultCards={resetToDefaultCards}
                importFromCardStation={importFromCardStation}
                availableCards={availableCards}
              />
            </div>

            {/* Card Grid */}
            <div className="flex-1 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-300">Available Cards</h3>
                <span className="text-xs text-gray-500">{availableCards.length} cards</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 max-h-full overflow-y-auto">
                {availableCards.map((card) => (
                  <CompactCard 
                    key={card.id}
                    card={card}
                    onDragStart={() => setDraggedCard(card.id)}
                    onDragEnd={() => setDraggedCard(null)}
                    onRemove={() => removeCard(card.id)}
                    isRemovable={!SAMPLE_CARDS.find(sc => sc.id === card.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Center Panel - Forge */}
          <div className="flex-1 flex flex-col">
            {/* Forge Area */}
            <div className="flex-1 relative bg-gradient-to-br from-dark-900 to-dark-950 overflow-hidden">
              <CrystalMandalaForge />
              
              {/* Forge Info Overlay */}
              <div className="absolute top-4 left-4 bg-dark-800/90 rounded-lg p-3 backdrop-blur-sm">
                <div className="text-xs text-gray-400 mb-1">Slots Filled</div>
                <div className="text-lg font-bold text-primary-400">
                  {slots.filter(s => s.card).length}/6
                </div>
                {probabilities && (
                  <div className="text-xs text-gray-300 mt-2">
                    <div>Rare: {probabilities.rare}%</div>
                    <div>Epic: {probabilities.epic}%</div>
                    <div>Legendary: {probabilities.legendary}%</div>
                  </div>
                )}
              </div>

              {/* Slot Guide */}
              <div className="absolute top-4 right-4 bg-dark-800/90 rounded-lg p-3 backdrop-blur-sm max-w-xs">
                <div className="text-xs font-bold text-gray-300 mb-2">Slot Organization</div>
                <div className="text-xs text-gray-400 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">⚡</span>
                    <span>Top 3: Physical aspects</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-purple-400">🧠</span>
                    <span>Bottom 3: Mental traits</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Results Panel */}
            {forgeResult && (
              <div className="h-48 bg-dark-800 border-t border-dark-700 p-4">
                <ForgeResultPanel result={forgeResult} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 