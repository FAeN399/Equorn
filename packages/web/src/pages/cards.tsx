import { useState, useCallback, useRef, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Card types for different mythic elements
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
  position: { x: number; y: number };
  stats?: {
    power?: number;
    magic?: number;
    wisdom?: number;
    mystery?: number;
  };
  metadata: {
    // Core traits that influence character creation
    personality_traits: string[];
    physical_features: string[];
    background_elements: string[];
    magical_aspects: string[];
    behavioral_patterns: string[];
    core_motivations: string[];
    // Contextual influence
    influence_weight: number; // 1-10, how much this card influences the character
    prompt_keywords: string[]; // Direct keywords for AI prompt
    narrative_hooks: string[]; // Story elements this card contributes
  };
}

const cardTypeConfigs = {
  entity: {
    name: 'Entity',
    icon: '👤',
    defaultColor: '#4F46E5',
    stats: ['power', 'wisdom'],
    metadata: {
      personality_traits: ['determined', 'wise'],
      physical_features: ['piercing eyes', 'noble bearing'],
      background_elements: ['ancient lineage', 'experienced traveler'],
      magical_aspects: ['inner strength', 'spiritual connection'],
      behavioral_patterns: ['protects others', 'seeks knowledge'],
      core_motivations: ['fulfill destiny', 'protect the innocent'],
      influence_weight: 7,
      prompt_keywords: ['character', 'hero', 'protagonist'],
      narrative_hooks: ['mysterious past', 'chosen one']
    }
  },
  location: {
    name: 'Location',
    icon: '🏛️',
    defaultColor: '#059669',
    stats: ['mystery', 'magic'],
    metadata: {
      personality_traits: [],
      physical_features: ['weathered stone', 'mystical atmosphere'],
      background_elements: ['ancient origins', 'forgotten history'],
      magical_aspects: ['ley line convergence', 'ambient magic'],
      behavioral_patterns: ['shapes visitors', 'reveals secrets'],
      core_motivations: ['preserve secrets', 'test worthiness'],
      influence_weight: 4,
      prompt_keywords: ['environment', 'setting', 'origin'],
      narrative_hooks: ['birthplace', 'training ground', 'sanctuary']
    }
  },
  artifact: {
    name: 'Artifact',
    icon: '⚔️',
    defaultColor: '#DC2626',
    stats: ['power', 'magic'],
    metadata: {
      personality_traits: ['focused', 'ambitious'],
      physical_features: ['carries ancient weapon', 'marked by power'],
      background_elements: ['artifact wielder', 'chosen by destiny'],
      magical_aspects: ['weapon bond', 'channeled power'],
      behavioral_patterns: ['strategic thinking', 'power usage'],
      core_motivations: ['master the artifact', 'fulfill purpose'],
      influence_weight: 6,
      prompt_keywords: ['equipped', 'wielder', 'channeler'],
      narrative_hooks: ['inherited power', 'artifact guardian']
    }
  },
  quest: {
    name: 'Quest',
    icon: '🗺️',
    defaultColor: '#7C3AED',
    stats: ['wisdom', 'mystery'],
    metadata: {
      personality_traits: ['driven', 'adventurous'],
      physical_features: ['travel-worn', 'alert stance'],
      background_elements: ['quest-bound', 'purpose-driven'],
      magical_aspects: ['fate-touched', 'destiny-guided'],
      behavioral_patterns: ['seeks objectives', 'overcomes obstacles'],
      core_motivations: ['complete the quest', 'prove worthiness'],
      influence_weight: 5,
      prompt_keywords: ['quester', 'seeker', 'traveler'],
      narrative_hooks: ['sacred mission', 'personal journey']
    }
  },
  event: {
    name: 'Event',
    icon: '⚡',
    defaultColor: '#EA580C',
    stats: ['power', 'mystery'],
    metadata: {
      personality_traits: ['marked by fate', 'touched by destiny'],
      physical_features: ['bears the marks', 'changed by experience'],
      background_elements: ['witnessed the event', 'survived the ordeal'],
      magical_aspects: ['event-touched', 'power awakened'],
      behavioral_patterns: ['carries the memory', 'shaped by experience'],
      core_motivations: ['understand the event', 'prevent recurrence'],
      influence_weight: 3,
      prompt_keywords: ['survivor', 'witness', 'changed'],
      narrative_hooks: ['defining moment', 'catalyst experience']
    }
  }
};

const rarityColors = {
  common: '#6b7280',
  uncommon: '#10b981',
  rare: '#3b82f6',
  epic: '#8b5cf6',
  legendary: '#f59e0b'
};

const iconOptions = [
  '👤', '🧙‍♂️', '🧝‍♀️', '🧞‍♂️', '🐉', '🦅', '🐺', '🦌',
  '🏔️', '🏰', '🌲', '🌊', '🏛️', '🗿', '⛰️', '🏯',
  '⚱️', '💎', '🗡️', '🛡️', '📿', '🔮', '📜', '🏺',
  '⚔️', '🗝️', '🎭', '🎪', '🎨', '🎭', '🎪', '🎨',
  '✨', '⚡', '🔥', '❄️', '🌙', '☀️', '⭐', '🌟'
];

// Random card name generators
const cardNameParts = {
  adjectives: ['Ancient', 'Mystical', 'Forgotten', 'Sacred', 'Cursed', 'Divine', 'Shadow', 'Crystal', 'Golden', 'Silver', 'Iron', 'Stone', 'Fire', 'Ice', 'Storm', 'Wind'],
  entityNames: ['Guardian', 'Sage', 'Warrior', 'Mage', 'Knight', 'Druid', 'Monk', 'Paladin', 'Rogue', 'Bard', 'Sorcerer', 'Wizard'],
  locationNames: ['Temple', 'Tower', 'Castle', 'Cave', 'Forest', 'Mountain', 'Valley', 'Lake', 'River', 'Sanctuary', 'Ruins', 'Citadel'],
  artifactNames: ['Sword', 'Shield', 'Crown', 'Amulet', 'Ring', 'Staff', 'Orb', 'Crystal', 'Tome', 'Scroll', 'Chalice', 'Mirror'],
  questNames: ['Quest', 'Journey', 'Trial', 'Challenge', 'Mission', 'Adventure', 'Expedition', 'Pilgrimage', 'Hunt', 'Search'],
  eventNames: ['Awakening', 'Convergence', 'Eclipse', 'Ritual', 'Summoning', 'Blessing', 'Curse', 'Storm', 'Migration', 'Festival']
};

const generateRandomName = (type: CardType): string => {
  const adj = cardNameParts.adjectives[Math.floor(Math.random() * cardNameParts.adjectives.length)];
  let noun = '';
  
  switch (type) {
    case 'entity':
      noun = cardNameParts.entityNames[Math.floor(Math.random() * cardNameParts.entityNames.length)];
      break;
    case 'location':
      noun = cardNameParts.locationNames[Math.floor(Math.random() * cardNameParts.locationNames.length)];
      break;
    case 'artifact':
      noun = cardNameParts.artifactNames[Math.floor(Math.random() * cardNameParts.artifactNames.length)];
      break;
    case 'quest':
      noun = cardNameParts.questNames[Math.floor(Math.random() * cardNameParts.questNames.length)];
      break;
    case 'event':
      noun = cardNameParts.eventNames[Math.floor(Math.random() * cardNameParts.eventNames.length)];
      break;
  }
  
  return `${adj} ${noun}`;
};

const generateRandomDescription = (type: CardType): string => {
  const descriptions = {
    entity: [
      'A legendary being of immense power and wisdom.',
      'Guardian of ancient secrets and forgotten lore.',
      'Wielder of mystical arts beyond mortal comprehension.',
      'Protector of the realm and its sacred places.'
    ],
    location: [
      'A place where magic flows like water.',
      'Ancient grounds holding powerful secrets.',
      'A sanctuary untouched by time.',
      'Where the veil between worlds grows thin.'
    ],
    artifact: [
      'Forged in the fires of creation itself.',
      'Imbued with the power of forgotten gods.',
      'A relic of a civilization lost to time.',
      'Contains the essence of pure magic.'
    ],
    quest: [
      'A journey that will test courage and wisdom.',
      'A sacred duty passed down through generations.',
      'The path to unlocking ancient mysteries.',
      'A challenge worthy of true heroes.'
    ],
    event: [
      'A moment when fate itself shifts course.',
      'An occurrence that echoes through eternity.',
      'When the impossible becomes reality.',
      'A convergence of mystical forces.'
    ]
  };
  
  const typeDescriptions = descriptions[type];
  return typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
};

export default function HexCardStation() {
  const [cards, setCards] = useState<HexCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<HexCard | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
  const [selectedRarity, setSelectedRarity] = useState<'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'>('common');
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Form state for card creation
  const [formData, setFormData] = useState({
    type: 'entity' as CardType,
    title: '',
    subtitle: '',
    description: '',
    icon: cardTypeConfigs.entity.icon,
    color: cardTypeConfigs.entity.defaultColor,
    rarity: 'common' as const
  });

  // Initialize metadata based on card type
  const getMetadataTemplate = (type: CardType) => {
    const template = cardTypeConfigs[type].metadata;
    return {
      personality_traits: [...template.personality_traits],
      physical_features: [...template.physical_features],
      background_elements: [...template.background_elements],
      magical_aspects: [...template.magical_aspects],
      behavioral_patterns: [...template.behavioral_patterns],
      core_motivations: [...template.core_motivations],
      influence_weight: template.influence_weight,
      prompt_keywords: [...template.prompt_keywords],
      narrative_hooks: [...template.narrative_hooks]
    };
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const createCard = useCallback(() => {
    const newCard: HexCard = {
      id: generateId(),
      ...formData,
      position: { x: 300, y: 200 },
      metadata: getMetadataTemplate(formData.type)
    };
    
    setCards(prev => [...prev, newCard]);
    setIsCreating(false);
    setFormData({
      type: 'entity',
      title: '',
      subtitle: '',
      description: '',
      icon: cardTypeConfigs.entity.icon,
      color: cardTypeConfigs.entity.defaultColor,
      rarity: 'common'
    });
  }, [formData]);

  const updateCard = useCallback((id: string, updates: Partial<HexCard>) => {
    setCards(prev => prev.map(card => 
      card.id === id ? { ...card, ...updates } : card
    ));
  }, []);

  const deleteCard = useCallback((id: string) => {
    setCards(prev => prev.filter(card => card.id !== id));
    setVisibleCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    setSelectedCard(null);
  }, []);

  // Toggle card visibility on canvas
  const toggleCardVisibility = useCallback((id: string) => {
    setVisibleCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
        // If hiding the selected card, deselect it
        if (selectedCard?.id === id) {
          setSelectedCard(null);
        }
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, [selectedCard]);

  // Show only this card (hide all others)
  const showOnlyCard = useCallback((id: string) => {
    setVisibleCards(new Set([id]));
    const card = cards.find(c => c.id === id);
    if (card) {
      setSelectedCard(card);
    }
  }, [cards]);

  // Show all cards
  const showAllCards = useCallback(() => {
    setVisibleCards(new Set(cards.map(card => card.id)));
  }, [cards]);

  // Hide all cards
  const hideAllCards = useCallback(() => {
    setVisibleCards(new Set());
    setSelectedCard(null);
  }, []);

  const handleCardDrag = useCallback((id: string, position: { x: number; y: number }) => {
    updateCard(id, { position });
  }, [updateCard]);

  const exportCards = useCallback(() => {
    const exportData = {
      cards,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hexagon-cards.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [cards]);

  const exportToSeed = useCallback(() => {
    const seedData = {
      world: {
        name: "Hexagon Card World",
        description: "A world generated from hexagon card station",
        theme: "cards"
      },
      entities: cards.filter(card => card.type === 'entity').map(card => ({
        type: card.type,
        name: card.title,
        description: card.description || card.subtitle,
        location: "main_area",
        abilities: Object.entries(card.stats || {}).map(([stat, value]) => 
          `${stat}_${value}`
        )
      })),
      locations: cards.filter(card => card.type === 'location').map(card => ({
        name: card.title.toLowerCase().replace(/\s+/g, '_'),
        description: card.description || card.subtitle,
        connections: ["main_area"]
      })),
      interactions: cards.filter(card => card.type === 'quest' || card.type === 'event').map(card => ({
        trigger: `interact_with_${card.title.toLowerCase().replace(/\s+/g, '_')}`,
        type: card.type === 'quest' ? 'quest' : 'event',
        responses: [card.description || card.subtitle || "A mysterious occurrence."]
      }))
    };

    // Add default main area if no locations exist
    if (seedData.locations.length === 0) {
      seedData.locations.push({
        name: "main_area",
        description: "The central area where all cards converge",
        connections: []
      });
    }

    const yamlContent = `# Generated from Hexagon Card Station
# ${new Date().toISOString()}

world:
  name: "${seedData.world.name}"
  description: "${seedData.world.description}"
  theme: "${seedData.world.theme}"

${seedData.entities.length > 0 ? `entities:
${seedData.entities.map(entity => `  - type: ${entity.type}
    name: "${entity.name}"
    description: "${entity.description}"
    location: "${entity.location}"${entity.abilities.length > 0 ? `
    abilities:
${entity.abilities.map(ability => `      - "${ability}"`).join('\n')}` : ''}`).join('\n')}` : ''}

${seedData.locations.length > 0 ? `locations:
${seedData.locations.map(location => `  - name: "${location.name}"
    description: "${location.description}"${location.connections.length > 0 ? `
    connections:
${location.connections.map(conn => `      - "${conn}"`).join('\n')}` : ''}`).join('\n')}` : ''}

${seedData.interactions.length > 0 ? `interactions:
${seedData.interactions.map(interaction => `  - trigger: "${interaction.trigger}"
    type: "${interaction.type}"
    responses:
${interaction.responses.map(response => `      - "${response}"`).join('\n')}`).join('\n')}` : ''}`;

    const blob = new Blob([yamlContent], {
      type: 'text/yaml'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hexagon-cards-seed.yaml';
    a.click();
    URL.revokeObjectURL(url);
  }, [cards]);

  const importCards = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.cards && Array.isArray(data.cards)) {
          setCards(data.cards);
        }
      } catch (error) {
        alert('Invalid file format');
      }
    };
    reader.readAsText(file);
  }, []);

  // Random card generator
  const generateRandomCard = useCallback(() => {
    const types: CardType[] = ['entity', 'location', 'artifact', 'quest', 'event'];
    
    const randomType = types[Math.floor(Math.random() * types.length)];
    const config = cardTypeConfigs[randomType];
    
    // Generate random stats based on type
    const stats: any = {};
    if (config.stats) {
      config.stats.forEach(stat => {
        stats[stat] = Math.floor(Math.random() * 10) + 1;
      });
    }
    
    // Generate random color variation
    const baseColor = config.defaultColor;
    const colorVariations = [
      baseColor,
      '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
    ];
    
    const newCard: HexCard = {
      id: generateId(),
      type: randomType,
      title: generateRandomName(randomType),
      subtitle: `Random ${config.name}`,
      description: generateRandomDescription(randomType),
      icon: iconOptions[Math.floor(Math.random() * iconOptions.length)],
      color: colorVariations[Math.floor(Math.random() * colorVariations.length)],
      rarity: selectedRarity,
      position: { 
        x: 200 + Math.random() * 400, 
        y: 100 + Math.random() * 300 
      },
      stats,
      metadata: getMetadataTemplate(randomType)
    };
    
    setCards(prev => [...prev, newCard]);
  }, [selectedRarity]);

  // Random booster generator (uses existing cards)
  const generateRandomBooster = useCallback(() => {
    if (cards.length < 14) {
      alert('Need at least 14 cards to generate a booster pack!');
      return;
    }

    const commonCards = cards.filter(card => card.rarity === 'common');
    const uncommonCards = cards.filter(card => card.rarity === 'uncommon');
    const rareCards = cards.filter(card => card.rarity === 'rare');
    
    if (commonCards.length < 10) {
      alert('Need at least 10 common cards for booster generation!');
      return;
    }
    
    if (uncommonCards.length < 3) {
      alert('Need at least 3 uncommon cards for booster generation!');
      return;
    }
    
    if (rareCards.length < 1) {
      alert('Need at least 1 rare card for booster generation!');
      return;
    }

    // Create booster pack
    const boosterCards: HexCard[] = [];
    
    // Add 10 random commons
    const shuffledCommons = [...commonCards].sort(() => 0.5 - Math.random());
    boosterCards.push(...shuffledCommons.slice(0, 10));
    
    // Add 3 random uncommons
    const shuffledUncommons = [...uncommonCards].sort(() => 0.5 - Math.random());
    boosterCards.push(...shuffledUncommons.slice(0, 3));
    
    // Add 1 random rare
    const shuffledRares = [...rareCards].sort(() => 0.5 - Math.random());
    boosterCards.push(shuffledRares[0]);

    // Position cards in a grid pattern
    const startX = 100;
    const startY = 100;
    const spacing = 180;
    
    boosterCards.forEach((card, index) => {
      const row = Math.floor(index / 5);
      const col = index % 5;
      
      const newCard: HexCard = {
        ...card,
        id: generateId(), // New unique ID
        position: {
          x: startX + (col * spacing),
          y: startY + (row * spacing)
        },
        metadata: getMetadataTemplate(card.type)
      };
      
      setCards(prev => [...prev, newCard]);
    });
  }, [cards]);

  // Hexagon SVG component
  const HexagonCard = ({ card, isSelected }: { card: HexCard; isSelected: boolean }) => {
    const rarityGlow = rarityColors[card.rarity];
    
    return (
      <motion.div
        className={`absolute cursor-pointer select-none ${isSelected ? 'z-20' : 'z-10'}`}
        style={{
          left: card.position.x,
          top: card.position.y,
          transform: 'translate(-50%, -50%)'
        }}
        drag
        dragMomentum={false}
        onDragStart={() => setDraggedCard(card.id)}
        onDragEnd={(_, info) => {
          setDraggedCard(null);
          const rect = canvasRef.current?.getBoundingClientRect();
          if (rect) {
            handleCardDrag(card.id, {
              x: card.position.x + info.offset.x,
              y: card.position.y + info.offset.y
            });
          }
        }}
        onClick={() => setSelectedCard(card)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
      >
        <svg
          width="160"
          height="140"
          viewBox="0 0 160 140"
          className={`drop-shadow-lg ${isSelected ? 'ring-4 ring-primary-400' : ''}`}
        >
          {/* Hexagon background */}
          <path
            d="M80 10 L130 35 L130 85 L80 110 L30 85 L30 35 Z"
            fill={card.color}
            stroke={rarityGlow}
            strokeWidth="3"
            filter={`drop-shadow(0 0 8px ${rarityGlow})`}
          />
          
          {/* Inner content area */}
          <path
            d="M80 20 L120 40 L120 80 L80 100 L40 80 L40 40 Z"
            fill="rgba(255, 255, 255, 0.1)"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="1"
          />
          
          {/* Icon circle */}
          <circle
            cx="80"
            cy="45"
            r="15"
            fill="rgba(255, 255, 255, 0.2)"
            stroke="rgba(255, 255, 255, 0.5)"
            strokeWidth="1"
          />
          
          {/* Rarity indicator */}
          <rect
            x="65"
            y="85"
            width="30"
            height="8"
            rx="4"
            fill={rarityGlow}
          />
        </svg>
        
        {/* Text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center pointer-events-none">
          <div className="text-2xl mb-1 mt-2">{card.icon}</div>
          <div className="text-xs font-bold px-2 leading-tight">{card.title}</div>
          <div className="text-xs opacity-75 px-2">{card.subtitle}</div>
          <div className="text-xs mt-2 opacity-60 capitalize">{card.rarity}</div>
        </div>
        
        {/* Stats overlay */}
        {card.stats && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-1 text-xs">
            {Object.entries(card.stats).map(([stat, value]) => (
              <div key={stat} className="bg-dark-800 px-1 py-0.5 rounded text-gray-300">
                {stat.charAt(0).toUpperCase()}: {value}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    );
  };

  // Generate character prompt from card metadata
  const generateCharacterPrompt = useCallback((selectedCards: HexCard[]) => {
    if (selectedCards.length === 0) return '';

    // Sort cards by influence weight (highest first)
    const sortedCards = [...selectedCards].sort((a, b) => b.metadata.influence_weight - a.metadata.influence_weight);
    
    // Collect all metadata
    const allTraits = sortedCards.flatMap(card => 
      card.metadata.personality_traits.map(trait => ({ trait, weight: card.metadata.influence_weight }))
    );
    const allFeatures = sortedCards.flatMap(card => 
      card.metadata.physical_features.map(feature => ({ feature, weight: card.metadata.influence_weight }))
    );
    const allKeywords = sortedCards.flatMap(card => 
      card.metadata.prompt_keywords.map(keyword => ({ keyword, weight: card.metadata.influence_weight }))
    );
    const allBackgrounds = sortedCards.flatMap(card => 
      card.metadata.background_elements.map(bg => ({ bg, weight: card.metadata.influence_weight }))
    );

    // Build weighted prompt sections
    const primaryTraits = allTraits
      .filter(item => item.weight >= 6)
      .map(item => item.trait)
      .slice(0, 5);
    
    const secondaryTraits = allTraits
      .filter(item => item.weight < 6)
      .map(item => item.trait)
      .slice(0, 3);

    const keyFeatures = allFeatures
      .filter(item => item.weight >= 5)
      .map(item => item.feature)
      .slice(0, 4);

    const coreKeywords = allKeywords
      .map(item => item.keyword)
      .slice(0, 6);

    const backgroundElements = allBackgrounds
      .slice(0, 3)
      .map(item => item.bg);

    // Generate the prompt
    let prompt = `Create a fantasy character with the following characteristics:\n\n`;
    
    if (primaryTraits.length > 0) {
      prompt += `CORE PERSONALITY: ${primaryTraits.join(', ')}\n`;
    }
    
    if (secondaryTraits.length > 0) {
      prompt += `ADDITIONAL TRAITS: ${secondaryTraits.join(', ')}\n`;
    }
    
    if (keyFeatures.length > 0) {
      prompt += `PHYSICAL APPEARANCE: ${keyFeatures.join(', ')}\n`;
    }
    
    if (backgroundElements.length > 0) {
      prompt += `BACKGROUND: ${backgroundElements.join(', ')}\n`;
    }
    
    if (coreKeywords.length > 0) {
      prompt += `KEY ELEMENTS: ${coreKeywords.join(', ')}\n`;
    }

    // Add card context
    prompt += `\nINFLUENCE SOURCES:\n`;
    sortedCards.forEach(card => {
      prompt += `- ${card.title} (${card.type}, weight: ${card.metadata.influence_weight}): ${card.description}\n`;
    });

    prompt += `\nGenerate a detailed character description, including personality, appearance, background, and motivations based on these elements.`;
    
    return prompt;
  }, []);

  // Export character prompt
  const exportCharacterPrompt = useCallback(() => {
    const currentVisibleCards = cards.filter(card => visibleCards.has(card.id));
    if (currentVisibleCards.length === 0) {
      alert('No cards are visible on the canvas. Show some cards first.');
      return;
    }

    const prompt = generateCharacterPrompt(currentVisibleCards);
    const blob = new Blob([prompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `character-prompt-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [cards, visibleCards, generateCharacterPrompt]);

  // Save cards to localStorage whenever cards change
  useEffect(() => {
    localStorage.setItem('equorn-cards', JSON.stringify(cards));
  }, [cards]);

  // Load cards from localStorage on component mount
  useEffect(() => {
    const savedCards = localStorage.getItem('equorn-cards');
    if (savedCards) {
      try {
        const parsedCards = JSON.parse(savedCards) as HexCard[];
        if (parsedCards.length > 0) {
          setCards(parsedCards);
        }
      } catch (error) {
        console.warn('Failed to load saved cards from localStorage');
      }
    }
  }, []);

  return (
    <>
      <Head>
        <title>Hexagon Card Station - Equorn</title>
        <meta name="description" content="Create and design hexagonal cards for your mythic worlds" />
      </Head>

      <div className="min-h-screen bg-dark-900 flex">
        {/* Sidebar */}
        <div className="w-80 bg-dark-800 border-r border-dark-700 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-serif font-bold mb-6 text-primary-400">
              ⬢ Card Station
            </h1>

            {/* Quick Actions */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => setIsCreating(true)}
                className="w-full btn btn-primary"
              >
                ✨ Create New Card
              </button>
              
              {/* Random Card Generation */}
              <div className="bg-dark-700 p-3 rounded-lg space-y-2">
                <div className="text-xs font-bold text-gray-300">Random Generation</div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Rarity for Random Cards
                  </label>
                  <select
                    value={selectedRarity}
                    onChange={(e) => setSelectedRarity(e.target.value as any)}
                    className="w-full input text-xs"
                  >
                    <option value="common">Common</option>
                    <option value="uncommon">Uncommon</option>
                    <option value="rare">Rare</option>
                    <option value="epic">Epic</option>
                    <option value="legendary">Legendary</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={generateRandomCard}
                    className="btn btn-secondary text-sm"
                  >
                    🎲 Random Card
                  </button>
                  <button
                    onClick={generateRandomBooster}
                    disabled={cards.length < 14}
                    className="btn btn-secondary text-sm disabled:opacity-50"
                  >
                    📦 Random Booster
                  </button>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={exportCards}
                  disabled={cards.length === 0}
                  className="flex-1 btn btn-outline text-sm disabled:opacity-50"
                >
                  📤 Export JSON
                </button>
                <label className="flex-1 btn btn-outline text-sm cursor-pointer text-center">
                  📥 Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={importCards}
                    className="hidden"
                  />
                </label>
              </div>
              
              <button
                onClick={exportToSeed}
                disabled={cards.length === 0}
                className="w-full btn btn-secondary text-sm disabled:opacity-50"
              >
                🌱 Export as Seed YAML
              </button>
              
              <button
                onClick={exportCharacterPrompt}
                disabled={visibleCards.size === 0}
                className="w-full btn btn-accent text-sm disabled:opacity-50"
              >
                🧙‍♂️ Character Prompt
              </button>
            </div>

            {/* Card Types */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-300 mb-3">Card Types</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(cardTypeConfigs).map(([type, config]) => (
                  <button
                    key={type}
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      type: type as CardType,
                      color: config.defaultColor,
                      icon: config.icon
                    }))}
                    className={`p-3 rounded-lg border transition-all text-sm ${
                      formData.type === type
                        ? 'border-primary-500 bg-primary-900/20 text-primary-300'
                        : 'border-dark-600 hover:border-dark-500 text-gray-400'
                    }`}
                  >
                    <div className="text-lg mb-1">{config.icon}</div>
                    <div>{config.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cards List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-300">
                  Cards ({cards.length})
                </h3>
                <div className="flex space-x-1">
                  <button
                    onClick={showAllCards}
                    disabled={cards.length === 0}
                    className="text-xs btn btn-outline px-2 py-1 disabled:opacity-50"
                    title="Show all cards"
                  >
                    👁️
                  </button>
                  <button
                    onClick={hideAllCards}
                    disabled={visibleCards.size === 0}
                    className="text-xs btn btn-outline px-2 py-1 disabled:opacity-50"
                    title="Hide all cards"
                  >
                    👁️‍🗨️
                  </button>
                </div>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {cards.map((card) => {
                  const isVisible = visibleCards.has(card.id);
                  return (
                    <motion.div
                      key={card.id}
                      className={`p-2 rounded border transition-all ${
                        selectedCard?.id === card.id
                          ? 'border-primary-500 bg-primary-900/20'
                          : 'border-dark-600 hover:border-dark-500'
                      } ${isVisible ? 'ring-1 ring-green-500/30' : ''}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{card.icon}</span>
                        <div 
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => setSelectedCard(card)}
                        >
                          <div className="text-sm font-medium text-gray-200 truncate">
                            {card.title || 'Untitled'}
                          </div>
                          <div className="text-xs text-gray-400 capitalize">
                            {card.type} • {card.rarity}
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              showOnlyCard(card.id);
                            }}
                            className="text-xs text-blue-400 hover:text-blue-300 px-1"
                            title="Show only this card"
                          >
                            🎯
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCardVisibility(card.id);
                            }}
                            className={`text-xs px-1 ${
                              isVisible 
                                ? 'text-green-400 hover:text-green-300' 
                                : 'text-gray-500 hover:text-gray-400'
                            }`}
                            title={isVisible ? 'Hide from canvas' : 'Show on canvas'}
                          >
                            {isVisible ? '👁️' : '👁️‍🗨️'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                {cards.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-3xl mb-2">⬢</div>
                    <div className="text-sm">No cards created yet</div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <div
            ref={canvasRef}
            className="w-full h-full relative bg-gradient-to-br from-dark-900 to-dark-950"
            style={{
              backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)'
            }}
          >
            {/* Grid pattern */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '30px 30px'
              }}
            />

            {/* Cards */}
            <AnimatePresence>
              {cards
                .filter(card => visibleCards.has(card.id))
                .map((card) => (
                  <HexagonCard
                    key={card.id}
                    card={card}
                    isSelected={selectedCard?.id === card.id}
                  />
                ))}
            </AnimatePresence>

            {/* Empty state */}
            {visibleCards.size === 0 && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-center text-gray-500">
                  <div className="text-6xl mb-4">⬢</div>
                  {cards.length === 0 ? (
                    <>
                      <h2 className="text-xl font-serif mb-2">Create Your First Card</h2>
                      <p className="text-sm mb-4">Design hexagonal cards for your mythic worlds</p>
                      <button
                        onClick={() => setIsCreating(true)}
                        className="btn btn-primary"
                      >
                        ✨ Get Started
                      </button>
                    </>
                  ) : (
                    <>
                      <h2 className="text-xl font-serif mb-2">Canvas is Clear</h2>
                      <p className="text-sm mb-4">Select cards from the list to display them here</p>
                      <button
                        onClick={showAllCards}
                        className="btn btn-primary"
                      >
                        👁️ Show All Cards
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Card Properties Panel */}
        {selectedCard && (
          <motion.div
            className="w-80 bg-dark-800 border-l border-dark-700 p-4 overflow-y-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-200">Card Properties</h3>
              <button
                onClick={() => deleteCard(selectedCard.id)}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                🗑️ Delete
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={selectedCard.title}
                  onChange={(e) => updateCard(selectedCard.id, { title: e.target.value })}
                  className="w-full input text-sm"
                  placeholder="Card title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={selectedCard.subtitle}
                  onChange={(e) => updateCard(selectedCard.id, { subtitle: e.target.value })}
                  className="w-full input text-sm"
                  placeholder="Card subtitle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Icon
                </label>
                <div className="grid grid-cols-6 gap-1">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => updateCard(selectedCard.id, { icon })}
                      className={`p-2 rounded text-lg hover:bg-dark-600 transition-colors ${
                        selectedCard.icon === icon ? 'bg-primary-600' : 'bg-dark-700'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Color
                </label>
                <input
                  type="color"
                  value={selectedCard.color}
                  onChange={(e) => updateCard(selectedCard.id, { color: e.target.value })}
                  className="w-full h-10 rounded border border-dark-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Rarity
                </label>
                <select
                  value={selectedCard.rarity}
                  onChange={(e) => updateCard(selectedCard.id, { rarity: e.target.value as any })}
                  className="w-full input text-sm"
                >
                  <option value="common">Common</option>
                  <option value="uncommon">Uncommon</option>
                  <option value="rare">Rare</option>
                  <option value="epic">Epic</option>
                  <option value="legendary">Legendary</option>
                </select>
              </div>

              {/* Stats */}
              {selectedCard.stats && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stats
                  </label>
                  <div className="space-y-2">
                    {Object.entries(selectedCard.stats).map(([stat, value]) => (
                      <div key={stat} className="flex items-center space-x-2">
                        <span className="text-sm text-gray-400 w-16 capitalize">{stat}:</span>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={value}
                          onChange={(e) => updateCard(selectedCard.id, {
                            stats: {
                              ...selectedCard.stats,
                              [stat]: parseInt(e.target.value)
                            }
                          })}
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-300 w-6">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata Editor */}
              <div className="border-t border-dark-600 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-gray-300">Character Metadata</h4>
                  <div className="text-xs text-gray-500">For Character Generation</div>
                </div>
                
                {/* Influence Weight */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Influence Weight ({selectedCard.metadata.influence_weight}/10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={selectedCard.metadata.influence_weight}
                    onChange={(e) => updateCard(selectedCard.id, {
                      metadata: {
                        ...selectedCard.metadata,
                        influence_weight: parseInt(e.target.value)
                      }
                    })}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    How much this card influences character generation
                  </div>
                </div>

                {/* Personality Traits */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Personality Traits
                  </label>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {selectedCard.metadata.personality_traits.map((trait, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-900/30 text-blue-300 rounded text-xs"
                      >
                        {trait}
                        <button
                          onClick={() => {
                            const newTraits = selectedCard.metadata.personality_traits.filter((_, i) => i !== index);
                            updateCard(selectedCard.id, {
                              metadata: { ...selectedCard.metadata, personality_traits: newTraits }
                            });
                          }}
                          className="text-blue-400 hover:text-red-400"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add personality trait..."
                    className="w-full input text-xs"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        const newTraits = [...selectedCard.metadata.personality_traits, e.currentTarget.value.trim()];
                        updateCard(selectedCard.id, {
                          metadata: { ...selectedCard.metadata, personality_traits: newTraits }
                        });
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>

                {/* Physical Features */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Physical Features
                  </label>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {selectedCard.metadata.physical_features.map((feature, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-green-900/30 text-green-300 rounded text-xs"
                      >
                        {feature}
                        <button
                          onClick={() => {
                            const newFeatures = selectedCard.metadata.physical_features.filter((_, i) => i !== index);
                            updateCard(selectedCard.id, {
                              metadata: { ...selectedCard.metadata, physical_features: newFeatures }
                            });
                          }}
                          className="text-green-400 hover:text-red-400"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add physical feature..."
                    className="w-full input text-xs"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        const newFeatures = [...selectedCard.metadata.physical_features, e.currentTarget.value.trim()];
                        updateCard(selectedCard.id, {
                          metadata: { ...selectedCard.metadata, physical_features: newFeatures }
                        });
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>

                {/* Prompt Keywords */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Prompt Keywords
                  </label>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {selectedCard.metadata.prompt_keywords.map((keyword, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-purple-900/30 text-purple-300 rounded text-xs"
                      >
                        {keyword}
                        <button
                          onClick={() => {
                            const newKeywords = selectedCard.metadata.prompt_keywords.filter((_, i) => i !== index);
                            updateCard(selectedCard.id, {
                              metadata: { ...selectedCard.metadata, prompt_keywords: newKeywords }
                            });
                          }}
                          className="text-purple-400 hover:text-red-400"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add prompt keyword..."
                    className="w-full input text-xs"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        const newKeywords = [...selectedCard.metadata.prompt_keywords, e.currentTarget.value.trim()];
                        updateCard(selectedCard.id, {
                          metadata: { ...selectedCard.metadata, prompt_keywords: newKeywords }
                        });
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={selectedCard.description}
                  onChange={(e) => updateCard(selectedCard.id, { description: e.target.value })}
                  className="w-full input text-sm h-20 resize-none"
                  placeholder="Card description..."
                />
              </div>

              <div className="text-xs text-gray-300">{selectedCard.description}</div>
              
              <div className="mt-4 flex space-x-2">
                <button 
                  onClick={exportCharacterPrompt}
                  disabled={visibleCards.size === 0}
                  className="flex-1 btn btn-accent text-xs disabled:opacity-50"
                >
                  🧙‍♂️ Character Prompt
                </button>
                <Link href="/forge" className="flex-1 btn btn-secondary text-xs">
                  🔮 Open Forge
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Create Card Modal */}
        <AnimatePresence>
          {isCreating && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-dark-800 rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <h2 className="text-xl font-bold mb-4 text-gray-200">Create New Card</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => {
                        const type = e.target.value as CardType;
                        const config = cardTypeConfigs[type];
                        setFormData(prev => ({
                          ...prev,
                          type,
                          color: config.defaultColor,
                          icon: config.icon
                        }));
                      }}
                      className="w-full input text-sm"
                    >
                      {Object.entries(cardTypeConfigs).map(([key, config]) => (
                        <option key={key} value={key}>{config.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full input text-sm"
                      placeholder="Enter card title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                      className="w-full input text-sm"
                      placeholder="Enter subtitle"
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setIsCreating(false)}
                      className="flex-1 btn btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={createCard}
                      disabled={!formData.title.trim()}
                      className="flex-1 btn btn-primary disabled:opacity-50"
                    >
                      Create Card
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
} 