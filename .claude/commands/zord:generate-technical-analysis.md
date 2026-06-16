---
name: zord:generate-technical-analysis
description: Gera análise técnica completa de NSD com foco em prevenção de conflitos e estabilidade do jogo
tools: Task, AskUserQuestion, Read, Write, Edit, Glob, Grep, Bash
model: sonnet
---

# Generate Technical Analysis

Gera análise técnica completa (NSD Technical Analysis) a partir de NSD e análise automatizada de mapas.

## Philosophy

**"Prevention Over Cure"**

The technical analysis is the FOUNDATION of safe NSD implementation. It:
- Identifies ALL potential conflicts before implementation
- Documents existing state to prevent breakage
- Provides a blueprint for safe implementation
- Enables review and approval BEFORE changes are made

## Phase 0: Pre-Flight

### Verify Prerequisites

```bash
# Check NSD exists
ls -la docs/Quests/[QUEST_NAME]/[QUEST].NSD.fluxo-cenas.md

# Check analysis script exists
ls -la scripts/analyze_map.js

# Check required tools
node --version  # >= 18.x
```

**FAIL if prerequisites missing.**

## Phase 1: Information Gathering

### Q1: NSD Document

```
NSD path: [autocomplete from docs/Quests/]
Quest name: [extract from NSD]
Checkpoint to analyze: [number or ALL]
```

### Q2: Analysis Scope

```
Analyze: [ ]
  [ ] All scenes in checkpoint
  [ ] Specific scenes: [scene IDs]
  [ ] Specific maps: [map IDs]
```

### Q3: Output Options

```
Output format: [ ]
  [ ] XML (for further editing)
  [ ] XML + Markdown (for documentation)
  [ ] XML + Implementation Report

Output location: [path, default: docs/Quests/[QUEST]/]
```

## Phase 2: NSD Analysis

### Load and Parse NSD

```javascript
// Read NSD document
const nsdPath = `docs/Quests/${questDir}/${questName}.NSD.fluxo-cenas.md`;
const nsdContent = fs.readFileSync(nsdPath, 'utf8');

// Parse NSD structure
const nsdData = {
  metadata: parseNSDMetadata(nsdContent),
  scenes: parseNSDScenes(nsdContent),
  beats: parseNSDBeats(nsdContent),
  characters: parseNSDCharacters(nsdContent),
  locations: parseNSDLocations(nsdContent),
  mechanics: parseNSDMechanics(nsdContent),
  prerequisites: parseNSDPrerequisites(nsdContent),
  decisions: parseNSDDecisions(nsdContent)
};
```

### Extract Implementation Requirements

```javascript
// Extract all required resources
const requirements = {
  // State needs
  variables: estimateVariableNeeds(nsdData),
  switches: estimateSwitchNeeds(nsdData),
  selfSwitches: estimateSelfSwitchNeeds(nsdData),

  // Event needs
  events: estimateEventNeeds(nsdData),
  commonEvents: estimateCommonEventNeeds(nsdData),

  // Asset needs
  characters: extractCharacterAssets(nsdData),
  pictures: extractPictureAssets(nsdData),
  audio: extractAudioAssets(nsdData),
  animations: extractAnimationAssets(nsdData),

  // Plugin needs
  plugins: extractPluginRequirements(nsdData)
};
```

### Generate Requirements Report

```
📊 NSD REQUIREMENTS ANALYSIS
═══════════════════════════════════════════════

Quest: [QUEST_NAME]
Checkpoint: [CHECKPOINT_ID]
Scenes: X
Beats: Y

STATE REQUIREMENTS:
  Variables needed: ~15
    - Quest progress: 1
    - Scene states: X
    - Beat trackers: Y
    - Temporary storage: ~5
    - Debug/testing: ~3

  Switches needed: ~8
    - Quest active/complete: 2
    - Scene states: X
    - Blocking switches: ~2
    - Debug/testing: ~2

  Self-switches needed: ~20
    - NPC interaction states: ~15
    - Event states: ~5

EVENT REQUIREMENTS:
  Total events needed: ~25
    - Scene controllers: X
    - Beat events: Y
    - State managers: ~5
    - Edge case handlers: ~8 (mandatory)

  Common events: ~2
    - Shared mechanics: 1
    - Quest utilities: 1

ASSET REQUIREMENTS:
  Characters: X unique sprites
  Pictures: Y images
  BGM: Z tracks
  BGS: W tracks
  SE: V effects
  Animations: U custom

MAP REQUIREMENTS:
  Maps to modify: X
  Maps to create: Y
    - Map 005: Coreto (modify)
    - Map 006: Casa Forjaprata (modify)
    - [New maps if needed]

PLUGIN REQUIREMENTS:
  Custom plugins needed: X
    - [Plugin name]: Purpose
```

## Phase 3: Map Analysis

### Automated Map Analysis

```bash
# For each map in NSD locations
for mapId in $(extractMapIdsFromNSD); do
  node scripts/analyze_map.js --map $mapId > analysis/map${mapId}.xml
done
```

### Collect Existing State

```javascript
// Analyze each map
const mapAnalyses = {};

for (const location of nsdData.locations) {
  const mapId = location.mapId;

  // Run automated analysis
  const analysis = await analyzeMap(mapId);

  // Collect data
  mapAnalyses[mapId] = {
    name: getMapName(mapId),
    existingVariables: analysis.variables,
    existingSwitches: analysis.switches,
    existingEvents: analysis.events,
    selfSwitches: analysis.selfSwitches,
    commonEvents: analysis.commonEvents,
    performance: analysis.performance
  };
}
```

### Generate Impact Analysis

```javascript
// For each map
const impactAnalysis = {};

for (const [mapId, analysis] of Object.entries(mapAnalyses)) {
  impactAnalysis[mapId] = {
    // Check for conflicts
    variableConflicts: detectVariableConflicts(
      requirements.variables,
      analysis.existingVariables
    ),
    switchConflicts: detectSwitchConflicts(
      requirements.switches,
      analysis.existingSwitches
    ),
    eventConflicts: detectEventConflicts(
      requirements.events,
      analysis.existingEvents
    ),

    // Check for risks
    risks: assessRisks(analysis),

    // Check performance impact
    performanceImpact: assessPerformanceImpact(
      analysis.performance,
      requirements.events
    )
  };
}
```

## Phase 4: Resource Allocation

### Find Free Resources

```bash
# Find free variable IDs
node scripts/find_free_ids.js --type variable > output/free_variables.txt

# Find free switch IDs
node scripts/find_free_ids.js --type switch > output/free_switches.txt

# Find free event IDs per map
for mapId in $(extractMapIdsFromNSD); do
  node scripts/find_free_ids.js --type event --map $mapId > output/free_events_map${mapId}.txt
done
```

### Allocate Resources

```javascript
// Allocate variables
const variableAllocation = allocateResources({
  needed: requirements.variables,
  available: freeVariables,
  strategy: 'sequential', // or 'clustered' for related variables
  prefix: 'v_q[QUEST_NAME]'
});

// Allocate switches
const switchAllocation = allocateResources({
  needed: requirements.switches,
  available: freeSwitches,
  strategy: 'sequential',
  prefix: 's_q[QUEST_NAME]'
});

// Allocate event IDs
const eventAllocation = {};
for (const mapId of Object.keys(mapAnalyses)) {
  eventAllocation[mapId] = allocateResources({
    needed: requirements.events.filter(e => e.mapId === mapId),
    available: freeEvents[mapId],
    strategy: 'sequential'
  });
}
```

### Generate Allocation Report

```
📊 RESOURCE ALLOCATION PLAN
═══════════════════════════════════════════════

VARIABLES ALLOCATED: 15
  Range: 1234-1248
  Prefix: v_qSemifinal_

  [1234] v_qSemifinal_progress
    Purpose: Track quest progress (0-N)
    States: 0=not started, 1=scene1, 2=scene2...

  [1235] v_qSemifinal_scene_state
    Purpose: Track current scene state
    States: 0=inactive, 1=active, 2=complete, 3=aborted

  [1236] v_qSemifinal_beat_tracker
    Purpose: Track beat progression
    States: 0-N per scene

  [1237] v_qSemifinal_dialog_state
    Purpose: Track dialogue states
    States: 0=first, 1=repeat, 2=exhausted

  [1238] v_qSemifinal_checkpoint
    Purpose: Save checkpoint for resume
    States: Scene number or beat number

  [1239-1241] v_qSemifinal_temp1-3
    Purpose: Temporary storage
    States: Various

  [1242-1244] v_qSemifinal_debug1-3
    Purpose: Debug/testing
    States: Various

  [1245] v_qSemifinal_interrupt_count
    Purpose: Count interrupt attempts
    States: 0-MAX

SWITCHES ALLOCATED: 8
  Range: 456-463
  Prefix: s_qSemifinal_

  [456] s_qSemifinal_active
    Purpose: Scene is active
    Scope: Quest

  [457] s_qSemifinal_complete
    Purpose: Scene completed successfully
    Scope: Quest

  [458] s_qSemifinal_aborted
    Purpose: Scene was aborted
    Scope: Quest

  [459] s_qSemifinal_save_blocked
    Purpose: Block saving during scene
    Scope: System

  [460] s_qSemifinal_control_locked
    Purpose: Player control locked
    Scope: Scene

  [461] s_qSemifinal_debug_mode
    Purpose: Enable debug output
    Scope: Testing

  [462-463] s_qSemifinal_temp1-2
    Purpose: Temporary switches
    Scope: Scene

EVENTS ALLOCATED:
  Map 005 (Coreto): 8 events
    Range: 18-25

  Map 006 (Casa Forjaprata): 12 events
    Range: 15-26

CONFLICT SUMMARY:
  Variables: 0 conflicts
  Switches: 0 conflicts
  Events: 0 conflicts
```

## Phase 5: Implementation Planning

### Design Event Structure

```javascript
// For each scene in NSD
const eventDesign = {};

for (const scene of nsdData.scenes) {
  eventDesign[scene.id] = {
    // Main controller
    controller: designControllerEvent(scene),

    // Beat events
    beats: scene.beats.map(beat => designBeatEvent(beat)),

    // State management
    stateManager: designStateManager(scene),

    // Edge case handlers (mandatory)
    edgeCaseHandlers: [
      designMultipleInteractionHandler(scene),
      designPrematureExitHandler(scene),
      designCutsceneInterruptHandler(scene),
      designSaveBlockHandler(scene),
      designPartyChangeHandler(scene),
      designDeathHandler(scene),
      designStatePersistenceHandler(scene),
      designLoadStateHandler(scene)
    ],

    // Verification
    verificationEvent: designVerificationEvent(scene)
  };
}
```

### Design State Management

```javascript
// State setup
const stateSetup = {
  preConditions: extractPreConditions(scene),
  executionSteps: [
    "Backup player state",
    "Backup party state",
    "Backup environment state",
    "Set scene active",
    "Initialize variables",
    "Initialize switches",
    "Position events",
    "Start parallel processes"
  ]
};

// State teardown
const stateTeardown = {
  triggers: [
    "Scene completion",
    "Scene abort",
    "Player death",
    "Map exit (if allowed)"
  ],
  executionSteps: [
    "Stop parallel processes",
    "Clear temporary variables",
    "Reset self-switches",
    "Restore party state",
    "Restore player state",
    "Restore environment state",
    "Reset scene switches",
    "Reposition events (if needed)",
    "Enable saving (if blocked)",
    "Update quest progress"
  ],

  // Abort handling
  abortHandling: {
    description: "If player leaves scene early",
    steps: [
      "Detect premature exit",
      "Save current progress",
      "Clean up temporary state",
      "Transfer to safe location",
      "Allow resume from checkpoint"
    ]
  }
};
```

### Design Common Events

```javascript
// Common events for shared functionality
const commonEvents = [
  {
    id: findFreeCommonEventId(),
    name: "SceneStateBackup",
    purpose: "Backup and restore scene state",
    parameters: [
      { name: "backup_mode", type: "switch" },
      { name: "restore_mode", type: "switch" }
    ],
    logic: generateStateBackupLogic()
  },
  {
    id: findFreeCommonEventId(),
    name: "PartyStateBackup",
    purpose: "Backup and restore party state",
    parameters: [
      { name: "backup_variable_start", type: "variable" },
      { name: "party_size", type: "variable" }
    ],
    logic: generatePartyBackupLogic()
  }
];
```

## Phase 6: Risk Assessment

### Identify Risks

```javascript
const risks = [];

// Check for variable conflicts
for (const conflict of impactAnalysis.variableConflicts) {
  risks.push({
    id: generateRiskId(),
    severity: conflict.critical ? 'critical' : 'high',
    category: 'variable_conflict',
    description: `Variable ${conflict.id} already in use by ${conflict.usedBy}`,
    impact: 'May break existing quest/feature',
    mitigation: `Reallocate to ${conflict.suggestedAlternative}`,
    prevention: 'Use allocated variables from analysis'
  });
}

// Check for performance issues
for (const [mapId, analysis] of Object.entries(mapAnalyses)) {
  if (analysis.performance.parallelProcessCount > 5) {
    risks.push({
      id: generateRiskId(),
      severity: 'medium',
      category: 'performance',
      description: `Map ${mapId} has ${analysis.performance.parallelProcessCount} parallel processes`,
      impact: 'May cause frame rate drops',
      mitigation: 'Optimize parallel processes, combine where possible',
      prevention: 'Test on low-end devices'
    });
  }
}

// Check for edge case risks
risks.push(
  {
    id: generateRiskId(),
    severity: 'high',
    category: 'edge_case',
    description: 'Player may exit map during critical scene',
    impact: 'Scene state corrupted, quest broken',
    mitigation: 'Implement exit blocking with fallback',
    prevention: 'Test premature exit scenarios'
  },
  {
    id: generateRiskId(),
    severity: 'medium',
    category: 'edge_case',
    description: 'Player may save during unstable state',
    impact: 'Save cannot be properly loaded',
    mitigation: 'Block saving during critical moments',
    prevention: 'Test save/load at every beat'
  }
  // ... more edge case risks
);
```

### Generate Risk Matrix

```
⚠️  RISK ASSESSMENT
═══════════════════════════════════════════════

CRITICAL (3): Must resolve before implementation
  [R001] Variable conflict: v_qNoite_progress (ID: 26)
    Impact: May break "Noite da História" quest
    Mitigation: Use allocated ID 1234 instead
    Prevention: Always use allocated IDs

  [R002] Switch conflict: s_qSemifinal_active (ID: 45)
    Impact: May cause scene trigger conflicts
    Mitigation: Use allocated ID 456 instead
    Prevention: Always use allocated IDs

  [R003] Event ID collision: Map 005 Event 18
    Impact: Will overwrite existing "Rheed" event
    Mitigation: Use ID 26 instead
    Prevention: Always verify free IDs

HIGH (5): Should resolve before implementation
  [R004] Performance risk: Map 006 parallel process count (6)
    Impact: Frame rate may drop on low-end devices
    Mitigation: Combine parallel processes where possible
    Prevention: Performance test on minimum spec

  [R005] Edge case: Premature map exit
    Impact: Scene state corruption
    Mitigation: Implement exit blocking
    Prevention: Test exit attempts at every beat

  [R006] Edge case: Save during scene
    Impact: Corrupted save file
    Mitigation: Block saving during critical moments
    Prevention: Test save/load at every beat

  [R007] Edge case: Party changes
    Impact: Scene assumes specific party composition
    Mitigation: Implement party backup/restore
    Prevention: Test with different party configurations

  [R008] Edge case: Player death
    Impact: Scene state not cleaned up
    Mitigation: Implement death handler
    Prevention: Test death at every beat

MEDIUM (2): Consider during implementation
  [R009] Memory: Large number of events (25)
    Impact: Slightly increased memory usage
    Mitigation: Clean up unused events
    Prevention: Memory profiling

  [R010] Complexity: Multiple interdependent systems
    Impact: Harder to debug, more edge cases
    Mitigation: Modular design, clear documentation
    Prevention: Code review, thorough testing

LOW (0): Note for future
  None

TOTAL RISKS: 10
MUST RESOLVE: 3 (critical + high)
SHOULD RESOLVE: 5
CONSIDER: 2
```

## Phase 7: Save/Load Considerations

### Analyze Save/Load Impact

```javascript
const saveLoadAnalysis = {
  // Can player save during scene?
  saveAllowed: analyzeSavePoints(nsdData),

  // What happens on load?
  loadBehavior: analyzeLoadBehavior(nsdData),

  // Checkpoint strategy
  checkpoints: generateCheckpointStrategy(nsdData),

  // State persistence
  statePersistence: analyzeStatePersistence(nsdData)
};
```

### Generate Save/Load Strategy

```
💾 SAVE/LOAD STRATEGY
═══════════════════════════════════════════════

SAVE POINTS:
  Before scene: YES (quest start)
  During scene:
    Scene 1: NO (cutscene only)
    Scene 2: YES (after beat 5-D)
    Scene 3: NO (critical moment)
    Scene 4: YES (after beat 7-C)
  After scene: YES (quest complete)

CHECKPOINTS:
  CP1: Before Scene 1 (quest start)
    State: progress=0, all switches OFF
    Load behavior: Start quest

  CP2: After Scene 2, Beat 5-D
    State: progress=5, sceneComplete=ON
    Load behavior: Resume at Scene 3 start

  CP3: After Scene 4, Beat 7-C
    State: progress=7, dialogueComplete=ON
    Load behavior: Resume at Scene 5 start

SAVE BLOCKING:
  Scene 1: BLOCKED (cutscene)
  Scene 2: ALLOWED (after beat 5-D)
  Scene 3: BLOCKED (critical)
  Scene 4: ALLOWED (after beat 7-C)

LOAD HANDLING:
  On load:
    1. Check quest progress variable
    2. Determine scene from progress
    3. Restore scene state if mid-scene
    4. Transfer to correct location
    5. Restore party composition
    6. Restore environment state

STATE PERSISTENCE:
  Variables: All quest variables persist
  Switches: All quest switches persist
  Self-switches: Reset on scene complete
  Event positions: Reset on scene complete

RISK LEVEL: LOW
  - Clear save points defined
  - Checkpoints at stable moments
  - Load behavior well-defined
  - No unstable save states possible
```

## Phase 7: Verification Planning

### Design Test Cases

```javascript
const testCases = [
  // Happy path
  {
    name: "Normal quest flow",
    type: "happy_path",
    description: "Play through quest normally",
    steps: [
      "Start quest",
      "Complete all beats in order",
      "Finish quest"
    ],
    expectedResults: [
      "All events trigger correctly",
      "State updates properly",
      "Quest completes",
      "State cleaned up"
    ]
  },

  // Edge cases
  {
    name: "Multiple NPC interactions",
    type: "edge_case",
    description: "Interact with same NPC multiple times",
    steps: [
      "Talk to NPC",
      "Talk to NPC again",
      "Talk to NPC third time"
    ],
    expectedResults: [
      "First interaction: initial dialogue",
      "Second interaction: different dialogue or exhausted",
      "No loops or repeats"
    ]
  },

  // Conflict scenarios
  {
    name: "Premature exit attempt",
    type: "conflict",
    description: "Try to leave map during scene",
    steps: [
      "Start critical scene",
      "Try to exit map",
      "Complete scene",
      "Try to exit map again"
    ],
    expectedResults: [
      "First attempt: blocked with message",
      "Second attempt: allowed"
    ]
  }

  // ... more test cases
];
```

### Generate Verification Checklist

```javascript
const verificationChecklist = {
  preImplementation: [
    "Technical analysis approved",
    "All conflicts resolved",
    "Resources allocated",
    "Event structure designed",
    "Edge cases planned"
  ],

  duringImplementation: [
    "Events created with correct IDs",
    "Variables use allocated IDs",
    "Switches use allocated IDs",
    "Event positions match NSD",
    "Event graphics correct",
    "State setup implemented",
    "State teardown implemented"
  ],

  postImplementation: [
    "All scenes implemented",
    "All beats implemented",
    "Edge case handlers present",
    "Verification passes",
    "Manual testing complete",
    "Save/load tested",
    "Performance tested",
    "Documentation updated"
  ]
};
```

## Phase 8: Generate Output

### Generate XML Output

```xml
<?xml version="1.0" encoding="UTF-8"?>
<nsd:technicalAnalysis xmlns:nsd="https://coreto.projectX/nsd/technical/v1">

  <!-- Metadata -->
  <nsd:metadata>
    <nsd:documentInfo>
      <nsd:templateVersion>1.0</nsd:templateVersion>
      <nsd:creationDate>{{ISO_DATE}}</nsd:creationDate>
      <nsd:lastUpdated>{{ISO_DATE}}</nsd:lastUpdated>
      <nsd:status>draft</nsd:status>
    </nsd:documentInfo>

    <nsd:nsdReference>
      <nsd:filePath>{{NSD_PATH}}</nsd:filePath>
      <nsd:questName>{{QUEST_NAME}}</nsd:questName>
      <nsd:checkpointId>{{CHECKPOINT_ID}}</nsd:checkpointId>
    </nsd:nsdReference>

    <nsd:team>
      <nsd:author>{{AUTHOR}}</nsd:author>
      <nsd:implementer>{{IMPLEMENTER}}</nsd:implementer>
      <nsd:reviewer>{{REVIEWER}}</nsd:reviewer>
    </nsd:team>
  </nsd:metadata>

  <!-- Impact Analysis -->
  <nsd:impactAnalysis>
    <!-- Generated from automated analysis -->
    {{IMPACT_ANALYSIS_XML}}
  </nsd:impactAnalysis>

  <!-- Implementation Plan -->
  <nsd:implementationPlan>
    <!-- State Management -->
    <nsd:stateManagement>
      <nsd:newVariables>
        {{VARIABLE_ALLOCATION_XML}}
      </nsd:newVariables>

      <nsd:newSwitches>
        {{SWITCH_ALLOCATION_XML}}
      </nsd:newSwitches>

      <nsd:stateSetup>
        {{STATE_SETUP_XML}}
      </nsd:stateSetup>

      <nsd:stateTeardown>
        {{STATE_TEARDOWN_XML}}
      </nsd:stateTeardown>
    </nsd:stateManagement>

    <!-- Event Specification -->
    <nsd:eventSpecification>
      {{EVENT_SPECIFICATION_XML}}
    </nsd:eventSpecification>
  </nsd:implementationPlan>

  <!-- Save/Load Considerations -->
  <nsd:saveLoadConsiderations>
    {{SAVE_LOAD_XML}}
  </nsd:saveLoadConsiderations>

  <!-- Verification -->
  <nsd:verification>
    <nsd:implementationChecklist>
      {{CHECKLIST_XML}}
    </nsd:implementationChecklist>

    <nsd:testingScenarios>
      {{TEST_SCENARIOS_XML}}
    </nsd:testingScenarios>

    <nsd:regressionTests>
      {{REGRESSION_TESTS_XML}}
    </nsd:regressionTests>
  </nsd:verification>

  <!-- Outputs and Side Effects -->
  <nsd:outputs>
    {{OUTPUTS_XML}}
  </nsd:outputs>

  <nsd:sideEffects>
    {{SIDE_EFFECTS_XML}}
  </nsd:sideEffects>

</nsd:technicalAnalysis>
```

### Generate Markdown Report

```markdown
# NSD Technical Analysis Report

## Quest Information
- **Name**: {{QUEST_NAME}}
- **Checkpoint**: {{CHECKPOINT_ID}}
- **Date**: {{ISO_DATE}}
- **Status**: Draft

## Executive Summary

### Overview
{{BRIEF_SUMMARY}}

### Resource Requirements
- Variables: {{COUNT}}
- Switches: {{COUNT}}
- Events: {{COUNT}}
- Common Events: {{COUNT}}

### Risk Assessment
- Critical Risks: {{COUNT}}
- High Risks: {{COUNT}}
- Medium Risks: {{COUNT}}
- Low Risks: {{COUNT}}

## Detailed Analysis

{{DETAILED_SECTIONS}}

## Recommendations

{{RECOMMENDATIONS}}

## Next Steps

1. Review and approve technical analysis
2. Resolve any critical risks
3. Proceed to implementation
4. Execute verification tests
5. Update documentation
```

## Phase 9: Review and Approval

### Self-Check

```javascript
const selfCheck = {
  completeness: [
    "All NSD scenes analyzed",
    "All NSD beats analyzed",
    "All maps analyzed",
    "All conflicts identified",
    "All risks assessed",
    "All resources allocated",
    "All edge cases planned",
    "All verification tests designed"
  ],

  correctness: [
    "Variable IDs don't conflict",
    "Switch IDs don't conflict",
    "Event IDs don't conflict",
    "Allocations are within valid ranges",
    "Event structure matches NSD",
    "State management is complete",
    "Teardown is complete"
  ],

  quality: [
    "Documentation is clear",
    "Comments are helpful",
    "Rationale is explained",
    "Alternatives are considered",
    "Verification is thorough"
  ]
};

// Run self-check
const selfCheckResults = runSelfCheck(selfCheck);
```

### Generate Review Questions

```
❓ REVIEW QUESTIONS
═══════════════════════════════════════════════

REQUIREMENTS:
  ✓ Are all NSD scenes covered?
  ✓ Are all NSD beats covered?
  ✓ Are all locations identified?
  ✓ Are all characters identified?

TECHNICAL:
  ✓ Are variable allocations valid?
  ✓ Are switch allocations valid?
  ✓ Are event allocations valid?
  ✓ Are all conflicts resolved?
  ✓ Is performance acceptable?

EDGE CASES:
  ✓ Is premature exit handled?
  ✓ Are multiple interactions handled?
  ✓ Is save/load handled?
  ✓ Are party changes handled?
  ✓ Is player death handled?
  ✓ Is state corruption prevented?

VERIFICATION:
  ✓ Are test cases comprehensive?
  ✓ Is verification complete?
  ✓ Are regression tests included?
  ✓ Is manual testing planned?

DOCUMENTATION:
  ✓ Is analysis clear?
  ✓ Is rationale explained?
  ✓ Are decisions justified?
  ✓ Is next steps clear?
```

## Output Files

Generate these files:

```
docs/Quests/[QUEST_NAME]/
├── [QUEST].technical-analysis.xml       # Full technical analysis
├── [QUEST].technical-analysis.md        # Human-readable report
├── [QUEST].resource-allocation.xml      # Resource allocations
├── [QUEST].risk-assessment.xml          # Risk details
└── [QUEST].verification-plan.xml        # Test plans

output/
├── map-analysis/
│   ├── map005.xml                       # Per-map analysis
│   ├── map006.xml
│   └── ...
├── free_resources/
│   ├── variables.txt                    # Free variable IDs
│   ├── switches.txt                     # Free switch IDs
│   └── events/
│       ├── map005.txt
│       ├── map006.txt
│       └── ...
└── requirements/
    ├── variables.xml                    # Variable requirements
    ├── switches.xml                     # Switch requirements
    └── events.xml                       # Event requirements
```

## Usage Example

```bash
# Generate technical analysis for "A Semifinal" quest
skill: zord:generate-technical-analysis

# Answer prompts:
# NSD path: docs/Quests/2-semifinal/semifinal.NSD.fluxo-cenas.md
# Quest name: A Semifinal
# Checkpoint: 2
# Scope: All scenes
# Output: XML + Markdown

# Output files created:
# - docs/Quests/2-semifinal/semifinal.technical-analysis.xml
# - docs/Quests/2-semifinal/semifinal.technical-analysis.md
# - output/map-analysis/map005.xml
# - output/map-analysis/map006.xml
# - output/free_resources/variables.txt
# - output/requirements/variables.xml

# Review the generated analysis
# Make any necessary adjustments
# Get approval before implementation
# Proceed to: skill: zord:implement-nsd-scene
```

## References

- NSD Template: `.claude/templates/nsd-template.xml`
- Technical Analysis Template: `.claude/templates/nsd-technical-analysis-template.xml`
- Analysis Script: `scripts/analyze_map.js`
- Find Free IDs Script: `scripts/find_free_ids.js`
- Implementation Command: `.claude/commands/zord:implement-nsd-scene.md`
