# 🔮 **Character Creation Forge** - Implementation Specification

> **Project**: Equorn Character Creation Forge  
> **Based on**: Crystal Mandala Forge + Card System  
> **Goal**: AI-powered character creation through essence card fusion  

---

## 📋 **Core Concept**

The Character Creation Forge transforms our existing Crystal Mandala Forge into an AI-powered character generation system. Players upload campaign backstories, draw essence card booster packs, arrange 6 cards on the sacred mandala, and witness AI-generated characters born from the fusion of story and essence.

---

## 🎯 **How It Works - Step by Step**

### **1. Load the World's Spark**
- Upload **Backstory JSON** (campaign seed file)
- Forge parses: `title`, `premise`, `world`, `freeText`
- **TF-IDF extraction** finds 5 strongest keywords from freeText
- These "world-shards" anchor all generation

### **2. Crack Open a Booster Pack**
- Tap **"Open Booster"** → server deals 10 random **Essence Cards**
- Cards from 120-card library: `elements`, `virtues`, `vices`, `archetypes`, `motifs`
- **2 rerolls maximum** if spread doesn't inspire
- Duplicates allowed

### **3. Forge Alignment - Six-Card Inlay**
- Drag exactly **6 cards** onto Crystal Mandala's **ruby diamond points**
- No positional rules - each card contributes:
  - **Name** (e.g., "Penance")
  - **Category** (virtue, vice, element, archetype, motif)
  - **Attribute modifiers** (±1-4 on STR, AGI, CON, INT, WIS, CHA)
  - **Keywords** that must echo in the character story

### **4. Stat Fusion**
- Base stats: all attributes start at **6**
- Forge **stacks all card modifiers**
- **Clamps results to 1-10**
- Writes final stat line

### **5. Prompt Composition**
- Template braids three strands:
  - **Backstory summary** (title + premise)
  - **World-shards** (top 5 TF-IDF keywords)
  - **Essence list** (6 card names + categories)
- Formats into **strict prompt for GPT-4o**
- Requests **fixed YAML block response**:

```yaml
Name: [Character Name]
Role/Class: [Character Role]
Attributes (1-10): STR | AGI | CON | INT | WIS | CHA
Backstory: [Character background story]
Personality: [Character personality traits]
Signature Abilities: [Unique character abilities]
Plot Hooks: [Story connection points]
```

### **6. Invocation & Streaming**
- Prompt streams through **Edge Function** (hides API key)
- Client shows **glowing progress ring** over Purple Core Eye
- Text arrives **token-by-token** with visual feedback

### **7. Birth of a Persona**
- When stream ends → **character sheet appears** in right pane
- **Markdown rendering** with beautiful formatting
- Auto-actions:
  - **Copy to clipboard**
  - **Save to IndexedDB** (history)
  - **Download buttons** (Markdown/JSON)

### **8. Safety Nets & Fail-safes**
- **Invalid backstory** → modal error + sample file link
- **API failure/timeout** → toast with Retry button
- **Token overflow (>8k)** → auto-summarize backstory + re-invoke
- **Missing essence words** → warning but still deliver sheet
- **Regex validation** ensures all chosen essences appear in story

---

## 🛠 **Technical Implementation Using Existing Equorn Tools**

### **A. Crystal Mandala Forge → Character Creation Nexus**

**Reuse 100% of existing visual components**:
- ✅ **Purple Core Eye** → Character Generation Nexus
- ✅ **Ruby Diamond Points** → 6 Essence Card slots  
- ✅ **Golden Star Layer** → Character potential energy
- ✅ **Blue Hex Ring** → Mystical containment field
- ✅ **Obsidian Capacitors** → Essence power accumulators
- ✅ **Ether Cables** → Energy flow between essences
- ✅ **All animations** → Perfect for character birth ritual

### **B. Card System → Essence Card Library**

**Extend existing HexCard interface**:
```typescript
interface EssenceCard extends HexCard {
  category: 'virtue' | 'vice' | 'element' | 'archetype' | 'motif';
  attributes: {
    STR?: number; // -4 to +4
    AGI?: number;
    CON?: number;
    INT?: number;
    WIS?: number;
    CHA?: number;
  };
  keywords: string[]; // Must appear in generated story
  lore: string; // Flavor text for the essence
}
```

**120 Essence Cards Library**:
- **24 Virtues**: Courage (+2 STR), Wisdom (+3 WIS), Compassion (+2 CHA)
- **24 Vices**: Wrath (+3 STR, -1 WIS), Greed (+2 INT, -2 CHA), Pride (+1 CHA, -1 WIS)
- **24 Elements**: Fire (+2 STR, -1 CON), Water (+2 WIS, -1 STR), Earth (+3 CON)
- **24 Archetypes**: Warrior (+3 STR, +1 CON), Scholar (+3 INT, +1 WIS), Trickster (+3 AGI, +1 CHA)
- **24 Motifs**: Ancient Rune (+2 INT), Broken Crown (+1 CHA, +1 WIS), Crimson Blade (+2 STR)

### **C. tRPC API Extensions**

**New character router endpoints**:
```typescript
export const characterRouter = router({
  // Get random booster pack
  getBoosterPack: publicProcedure
    .query(() => {
      return sampleSize(ESSENCE_CARDS, 10);
    }),

  // Validate backstory JSON
  validateBackstory: publicProcedure
    .input(backstorySchema)
    .mutation(({ input }) => {
      const keywords = extractTFIDFKeywords(input.freeText, 5);
      return { valid: true, keywords };
    }),

  // Generate character with streaming
  generateCharacter: publicProcedure
    .input(z.object({
      backstory: backstorySchema,
      essenceCards: z.array(essenceCardSchema).length(6)
    }))
    .mutation(async ({ input }) => {
      const stats = calculateStats(input.essenceCards);
      const prompt = buildCharacterPrompt(input.backstory, input.essenceCards);
      return streamCharacterGeneration(prompt);
    })
});
```

### **D. File Upload & Validation**

**Extend existing seed validation system**:
```typescript
const backstorySchema = z.object({
  title: z.string().min(1).max(100),
  premise: z.string().min(10).max(500),
  world: z.string().min(10).max(300),
  freeText: z.string().min(50).max(2000),
  genre: z.enum(['fantasy', 'scifi', 'modern', 'historical', 'cyberpunk']),
  tone: z.enum(['heroic', 'dark', 'comedic', 'mysterious', 'epic'])
});
```

### **E. AI Integration Pipeline**

**Character generation flow**:
1. **TF-IDF Extraction** → Extract 5 keywords from backstory freeText
2. **Stat Calculation** → Sum all essence card modifiers (base 6, clamp 1-10)
3. **Prompt Template** → Inject backstory + keywords + essences
4. **OpenAI Streaming** → GPT-4o with structured output format
5. **Validation** → Ensure all essence keywords appear in result
6. **Post-processing** → Format as Markdown, save to IndexedDB

---

## 🎨 **UI/UX Layout (3-Panel Design)**

```
┌─────────────────┬─────────────────┬─────────────────┐
│   LEFT PANEL    │   CENTER PANEL  │   RIGHT PANEL   │
│                 │                 │                 │
│ 📁 Backstory    │ 🔮 Crystal      │ 📜 Character    │
│    Upload       │    Mandala      │    Sheet        │
│                 │    Nexus        │                 │
│ 🃏 Booster Pack │ ⬢⬢⬢⬢⬢⬢         │ 📋 Generated    │
│   (10 cards)    │  Ruby Slots     │    Output       │
│                 │                 │                 │
│ 🔄 Reroll (2x)  │ 🟣 Purple Core  │ 📥 Download     │
│                 │    Eye          │    Buttons      │
│                 │                 │                 │
│ 📊 Stats        │ ⚡ Generate     │ 📋 Copy to      │
│    Preview      │    Button       │    Clipboard    │
└─────────────────┴─────────────────┴─────────────────┘
```

### **Visual Adaptations**:
- **Essence cards** → Smaller hexagons with category color coding
- **Ruby diamonds** → Pulsing drop zones for cards
- **Core eye** → Intensifies during generation with character silhouette
- **Ether cables** → Energy flows when cards placed
- **Character birth** → Expanding light burst from nexus on completion

---

## 🚀 **Development Phases**

### **Phase 1: Core Adaptation (Week 1)**
- [ ] Fork HexForge → CharacterForge component
- [ ] Create EssenceCard interface & 120-card library
- [ ] Adapt Crystal Mandala for character creation context
- [ ] Add backstory JSON upload & validation

### **Phase 2: AI Integration (Week 2)**  
- [ ] Build TF-IDF keyword extraction utility
- [ ] Create character prompt template system
- [ ] Integrate OpenAI API with streaming
- [ ] Add character sheet Markdown renderer

### **Phase 3: UX Polish (Week 3)**
- [ ] Booster pack UI with reroll logic
- [ ] Character generation animations
- [ ] IndexedDB history storage
- [ ] Download/clipboard functionality

### **Phase 4: PWA Features (Week 4)**
- [ ] Service worker for offline essence library
- [ ] Installation prompt & manifest
- [ ] Error handling & retry logic
- [ ] Final testing & deployment

---

## 💾 **Data Structures**

### **Backstory JSON Format**:
```json
{
  "title": "The Shattered Crown Campaign",
  "premise": "Ancient magic returns to a world that forgot its power",
  "world": "The Kingdom of Aethros, where technology and magic clash",
  "freeText": "Long ago, the Crown of Stars bound the realms together...",
  "genre": "fantasy",
  "tone": "heroic"
}
```

### **Character Output Format**:
```yaml
Name: Lyra Stormweaver
Role/Class: Elemental Mage
Attributes (1-10): STR 4 | AGI 7 | CON 5 | INT 9 | WIS 8 | CHA 6
Backstory: Born during the Great Storm, Lyra discovered her ability to weave lightning and wind into devastating spells. She carries the weight of ancient prophecies that speak of her role in reuniting the Shattered Crown.
Personality: Passionate and impulsive, yet deeply wise. Struggles with the burden of destiny while maintaining hope for the future.
Signature Abilities: Storm Calling, Lightning Weave, Wind Walking
Plot Hooks: Seeks the lost Crown Shards, hunted by the Shadow Order, prophesied to either save or destroy the realm
```

---

## 🔮 **Unique Features**

1. **Essence Fusion Mechanics** → Cards genuinely influence character stats & story
2. **Streaming Character Birth** → Watch character emerge in real-time
3. **Sacred Geometry** → Beautiful Crystal Mandala makes creation feel mystical
4. **Campaign Integration** → Characters tied to specific backstory contexts
5. **PWA Offline Mode** → Create characters anywhere, sync later
6. **Character Gallery** → IndexedDB history with search/filter
7. **Export Flexibility** → JSON, Markdown, or formatted character sheets

---

## ⚡ **Technical Requirements**

- **Frontend**: React + TypeScript + Tailwind + Framer Motion
- **Backend**: tRPC + Prisma + SQLite (for essence cards)
- **AI**: OpenAI GPT-4o with streaming
- **Storage**: IndexedDB (character history) + localStorage (app state)
- **Deployment**: Vercel (Edge Functions for API)
- **PWA**: Service Worker + Web App Manifest

---

## 🎯 **Success Metrics**

- ✅ **Upload → Generate → Download** in under 60 seconds
- ✅ **95%+ essence keyword integration** in generated characters
- ✅ **Smooth streaming** with visual feedback
- ✅ **Offline booster pack** functionality
- ✅ **Beautiful animations** that enhance the mystical experience
- ✅ **Mobile responsive** for tablet D&D sessions

---

*This document serves as the complete specification for transforming our Equorn Crystal Mandala Forge into a Character Creation Forge using existing tools and infrastructure.* 