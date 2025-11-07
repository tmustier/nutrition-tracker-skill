# Easter Egg Safety System - Comprehensive Design

**CRITICAL REQUIREMENT**: Never let an easter egg prevent actual food from being logged.

## Executive Summary

This document outlines a comprehensive safety system for easter eggs in the nutrition tracking Telegram bot. The system uses multi-layered detection, confidence thresholds, and failsafe mechanisms to ensure that legitimate food is NEVER blocked by easter egg logic.

---

## 1. DETECTION SCHEMA

### 1.1 Detection Result Object

```typescript
interface EasterEggDetection {
  // Core detection results
  detections: {
    has_person: boolean;
    has_pet: boolean;
    has_food: boolean;
    has_nutrition_label: boolean;
    has_empty_plate: boolean;
    has_food_packaging: boolean;  // empty wrappers, boxes
    has_non_food_item: boolean;   // soap, candles
    is_screenshot: boolean;        // digital content, memes
    is_shopping_scene: boolean;    // grocery aisles, restaurant menus
    is_celebration: boolean;       // birthday cake with candles
  };

  // Confidence levels for each detection (high/medium/low)
  confidence: {
    has_person: 'high' | 'medium' | 'low';
    has_pet: 'high' | 'medium' | 'low';
    has_food: 'high' | 'medium' | 'low';
    has_nutrition_label: 'high' | 'medium' | 'low';
    has_empty_plate: 'high' | 'medium' | 'low';
    has_food_packaging: 'high' | 'medium' | 'low';
    has_non_food_item: 'high' | 'medium' | 'low';
    is_screenshot: 'high' | 'medium' | 'low';
    is_shopping_scene: 'high' | 'medium' | 'low';
    is_celebration: 'high' | 'medium' | 'low';
  };

  // Overall confidence in the detection process
  overall_confidence: 'high' | 'medium' | 'low';

  // CRITICAL: Should we attempt nutrition extraction?
  should_attempt_nutrition_extraction: boolean;

  // CRITICAL: Should we trigger an easter egg?
  should_trigger_easter_egg: boolean;

  // Which easter egg scenario (if any)
  easter_egg_scenario:
    | 'person_without_food'
    | 'pet'
    | 'empty_plate'
    | 'midnight_munchies'
    | 'celebration'
    | 'non_food_item'
    | 'shopping_scene'
    | 'screenshot_meme'
    | 'empty_packaging'
    | null;

  // Detailed description of what was detected
  scene_description: string;

  // Reasoning for the decision (for debugging/logging)
  decision_reasoning: string;

  // Detection metadata
  metadata: {
    detection_time_ms: number;
    detection_success: boolean;
    detection_error?: string;
  };
}
```

### 1.2 Confidence Level Definitions

```typescript
type ConfidenceLevel = 'high' | 'medium' | 'low';

// Confidence level meanings:
// - high: 95%+ certain, can make strong decisions
// - medium: 70-95% certain, requires additional validation
// - low: <70% certain, fallback to safe default (attempt nutrition)
```

---

## 2. DECISION TREE

### 2.1 Master Decision Flow

```
┌─────────────────────────────┐
│  Image Received             │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Run Easter Egg Detection   │
│  (with timeout: 10 seconds) │
└──────────┬──────────────────┘
           │
           ├─── Detection Failed/Timeout?
           │    └─► should_attempt_nutrition_extraction = TRUE
           │        should_trigger_easter_egg = FALSE
           │        (Safety: Always try nutrition on detection failure)
           │
           ▼
┌─────────────────────────────┐
│  Check Overall Confidence   │
└──────────┬──────────────────┘
           │
           ├─── Overall Confidence = LOW?
           │    └─► should_attempt_nutrition_extraction = TRUE
           │        should_trigger_easter_egg = FALSE
           │        (Safety: When uncertain, extract nutrition)
           │
           ▼
┌─────────────────────────────┐
│  Check Food Indicators      │
└──────────┬──────────────────┘
           │
           ├─── has_food = TRUE?
           │    └─► should_attempt_nutrition_extraction = TRUE
           │        Check if easter egg is compatible...
           │        (e.g., person eating food → extract nutrition from food)
           │
           ├─── has_nutrition_label = TRUE?
           │    └─► should_attempt_nutrition_extraction = TRUE
           │        should_trigger_easter_egg = FALSE
           │        (Safety: Nutrition labels ALWAYS get processed)
           │
           ▼
┌─────────────────────────────┐
│  Check Food Confidence      │
└──────────┬──────────────────┘
           │
           ├─── has_food confidence = MEDIUM?
           │    └─► should_attempt_nutrition_extraction = TRUE
           │        should_trigger_easter_egg = FALSE
           │        (Safety: If unsure about food, try to extract)
           │
           ▼
┌─────────────────────────────┐
│  Check Easter Egg Scenario  │
└──────────┬──────────────────┘
           │
           ├─── Can trigger easter egg?
           │    └─► Apply scenario-specific safety checks
           │
           ▼
┌─────────────────────────────┐
│  Final Decision             │
└─────────────────────────────┘
```

### 2.2 Scenario-Specific Decision Logic

```javascript
function decideFinalAction(detection) {
  // SAFETY GATE 1: Detection failure or timeout
  if (!detection.metadata.detection_success) {
    return {
      should_attempt_nutrition_extraction: true,
      should_trigger_easter_egg: false,
      reason: 'Detection failed - attempting nutrition extraction for safety'
    };
  }

  // SAFETY GATE 2: Low overall confidence
  if (detection.overall_confidence === 'low') {
    return {
      should_attempt_nutrition_extraction: true,
      should_trigger_easter_egg: false,
      reason: 'Low detection confidence - attempting nutrition extraction for safety'
    };
  }

  // SAFETY GATE 3: Nutrition label detected (HIGHEST PRIORITY)
  if (detection.detections.has_nutrition_label &&
      detection.confidence.has_nutrition_label !== 'low') {
    return {
      should_attempt_nutrition_extraction: true,
      should_trigger_easter_egg: false,
      reason: 'Nutrition label detected - must extract nutrition data'
    };
  }

  // SAFETY GATE 4: Food detected with medium or high confidence
  if (detection.detections.has_food &&
      detection.confidence.has_food !== 'low') {
    return {
      should_attempt_nutrition_extraction: true,
      should_trigger_easter_egg: false,
      reason: 'Food detected - extracting nutrition data'
    };
  }

  // SAFETY GATE 5: Uncertain about food (medium confidence that there's NO food)
  if (detection.confidence.has_food === 'medium' &&
      !detection.detections.has_food) {
    return {
      should_attempt_nutrition_extraction: true,
      should_trigger_easter_egg: false,
      reason: 'Uncertain about food absence - attempting extraction for safety'
    };
  }

  // SAFE ZONE: High confidence no food, evaluate easter egg scenarios
  return evaluateEasterEggScenario(detection);
}

function evaluateEasterEggScenario(detection) {
  // Scenario 1: Person without food
  if (detection.detections.has_person &&
      !detection.detections.has_food &&
      detection.confidence.has_person === 'high' &&
      detection.confidence.has_food === 'high') {
    return {
      should_attempt_nutrition_extraction: false,
      should_trigger_easter_egg: true,
      easter_egg_scenario: 'person_without_food',
      reason: 'High confidence: person without food'
    };
  }

  // Scenario 2: Pet/animal
  if (detection.detections.has_pet &&
      !detection.detections.has_food &&
      detection.confidence.has_pet === 'high' &&
      detection.confidence.has_food === 'high') {
    return {
      should_attempt_nutrition_extraction: false,
      should_trigger_easter_egg: true,
      easter_egg_scenario: 'pet',
      reason: 'High confidence: pet without food'
    };
  }

  // Scenario 3: Empty plate (but check for food remnants)
  if (detection.detections.has_empty_plate &&
      !detection.detections.has_food &&
      detection.confidence.has_empty_plate === 'high' &&
      detection.confidence.has_food === 'high') {
    return {
      should_attempt_nutrition_extraction: false,
      should_trigger_easter_egg: true,
      easter_egg_scenario: 'empty_plate',
      reason: 'High confidence: empty plate without food'
    };
  }

  // Scenario 4: Non-food item (soap, decorative food)
  if (detection.detections.has_non_food_item &&
      !detection.detections.has_food &&
      !detection.detections.has_nutrition_label &&
      detection.confidence.has_non_food_item === 'high' &&
      detection.confidence.has_food === 'high') {
    return {
      should_attempt_nutrition_extraction: false,
      should_trigger_easter_egg: true,
      easter_egg_scenario: 'non_food_item',
      reason: 'High confidence: non-food item (soap, candle, etc.)'
    };
  }

  // Scenario 5: Shopping scene
  if (detection.detections.is_shopping_scene &&
      !detection.detections.has_nutrition_label &&
      detection.confidence.is_shopping_scene === 'high') {
    return {
      should_attempt_nutrition_extraction: false,
      should_trigger_easter_egg: true,
      easter_egg_scenario: 'shopping_scene',
      reason: 'High confidence: shopping scene (grocery aisle, restaurant menu)'
    };
  }

  // Scenario 6: Screenshot/meme
  if (detection.detections.is_screenshot &&
      !detection.detections.has_nutrition_label &&
      detection.confidence.is_screenshot === 'high') {
    return {
      should_attempt_nutrition_extraction: false,
      should_trigger_easter_egg: true,
      easter_egg_scenario: 'screenshot_meme',
      reason: 'High confidence: screenshot or digital content'
    };
  }

  // Scenario 7: Celebration (birthday cake with candles)
  if (detection.detections.is_celebration &&
      detection.confidence.is_celebration === 'high') {
    // Special case: birthdays can have actual food!
    // Only trigger easter egg, but still allow nutrition extraction
    return {
      should_attempt_nutrition_extraction: true, // SAFETY: cake is food!
      should_trigger_easter_egg: true,
      easter_egg_scenario: 'celebration',
      reason: 'High confidence: celebration with cake (extracting nutrition too)'
    };
  }

  // Scenario 8: Empty food packaging
  if (detection.detections.has_food_packaging &&
      !detection.detections.has_food &&
      detection.confidence.has_food_packaging === 'high' &&
      detection.confidence.has_food === 'high') {
    return {
      should_attempt_nutrition_extraction: false,
      should_trigger_easter_egg: true,
      easter_egg_scenario: 'empty_packaging',
      reason: 'High confidence: empty food packaging'
    };
  }

  // DEFAULT: If no easter egg scenario matched with high confidence,
  // ALWAYS attempt nutrition extraction
  return {
    should_attempt_nutrition_extraction: true,
    should_trigger_easter_egg: false,
    reason: 'No high-confidence easter egg scenario - attempting nutrition extraction for safety'
  };
}
```

---

## 3. CONFIDENCE THRESHOLDS

### 3.1 Threshold Definitions

```javascript
const CONFIDENCE_THRESHOLDS = {
  // Easter egg scenarios REQUIRE high confidence on both:
  // 1. What IS present (person, pet, empty plate, etc.)
  // 2. What is NOT present (food, nutrition labels)

  EASTER_EGG_TRIGGER: {
    // Minimum confidence to trigger ANY easter egg
    min_overall_confidence: 'high',

    // Minimum confidence that the scenario IS present
    min_scenario_confidence: 'high',

    // Minimum confidence that food/nutrition IS NOT present
    min_no_food_confidence: 'high'
  },

  NUTRITION_EXTRACTION: {
    // If food detection confidence is medium or higher, ALWAYS extract
    min_food_confidence_to_extract: 'medium',

    // If nutrition label detected with any confidence, ALWAYS extract
    min_label_confidence_to_extract: 'low',

    // If uncertain (medium confidence) that there's NO food, ALWAYS extract
    max_no_food_confidence_to_skip: 'low'
  },

  TIMEOUT: {
    // Maximum time for easter egg detection (milliseconds)
    // If exceeded, skip easter egg and proceed to nutrition extraction
    max_detection_time_ms: 10000, // 10 seconds

    // Timeout for nutrition extraction (longer, as this is critical)
    max_nutrition_extraction_time_ms: 120000 // 120 seconds
  }
};
```

### 3.2 Confidence Mapping

```javascript
// Map Claude's natural language confidence to our levels
function mapConfidenceLevel(claudeConfidence) {
  const normalized = claudeConfidence.toLowerCase();

  if (normalized.includes('very high') ||
      normalized.includes('certain') ||
      normalized.includes('definite') ||
      normalized.includes('clearly') ||
      normalized.includes('obviously')) {
    return 'high';
  }

  if (normalized.includes('probably') ||
      normalized.includes('likely') ||
      normalized.includes('appears to') ||
      normalized.includes('seems to')) {
    return 'medium';
  }

  // Default to low for safety
  return 'low';
}
```

---

## 4. SAFETY CHECKS PER EASTER EGG TYPE

### 4.1 Person Without Food

```javascript
function checkPersonWithoutFood(detection) {
  // SAFETY CHECK 1: High confidence person detected
  if (detection.confidence.has_person !== 'high') {
    return { safe: false, reason: 'Person detection confidence not high enough' };
  }

  // SAFETY CHECK 2: High confidence NO food
  if (detection.confidence.has_food !== 'high') {
    return { safe: false, reason: 'Food absence confidence not high enough' };
  }

  // SAFETY CHECK 3: No nutrition label visible
  if (detection.detections.has_nutrition_label) {
    return { safe: false, reason: 'Nutrition label detected - must extract' };
  }

  // SAFETY CHECK 4: Not a meal scene (no plates, utensils, dining context)
  // This prevents triggering on "person eating food" where we should extract nutrition
  if (detection.scene_description.toLowerCase().includes('eating') ||
      detection.scene_description.toLowerCase().includes('meal') ||
      detection.scene_description.toLowerCase().includes('dining')) {
    return { safe: false, reason: 'Meal context detected - attempting nutrition extraction' };
  }

  return { safe: true, reason: 'All safety checks passed' };
}
```

### 4.2 Pet/Animal

```javascript
function checkPet(detection) {
  // SAFETY CHECK 1: High confidence pet detected
  if (detection.confidence.has_pet !== 'high') {
    return { safe: false, reason: 'Pet detection confidence not high enough' };
  }

  // SAFETY CHECK 2: High confidence NO food
  if (detection.confidence.has_food !== 'high') {
    return { safe: false, reason: 'Food absence confidence not high enough' };
  }

  // SAFETY CHECK 3: No nutrition label
  if (detection.detections.has_nutrition_label) {
    return { safe: false, reason: 'Nutrition label detected - must extract' };
  }

  // SAFETY CHECK 4: Not pet food
  // If there's pet food in the image, that's still food!
  if (detection.scene_description.toLowerCase().includes('pet food') ||
      detection.scene_description.toLowerCase().includes('dog food') ||
      detection.scene_description.toLowerCase().includes('cat food')) {
    return { safe: false, reason: 'Pet food detected - attempting nutrition extraction' };
  }

  return { safe: true, reason: 'All safety checks passed' };
}
```

### 4.3 Empty Plate

```javascript
function checkEmptyPlate(detection) {
  // SAFETY CHECK 1: High confidence empty plate
  if (detection.confidence.has_empty_plate !== 'high') {
    return { safe: false, reason: 'Empty plate confidence not high enough' };
  }

  // SAFETY CHECK 2: High confidence NO food
  if (detection.confidence.has_food !== 'high') {
    return { safe: false, reason: 'Food absence confidence not high enough' };
  }

  // SAFETY CHECK 3: Check for food remnants
  // Even small amounts of food should be attempted for extraction
  if (detection.scene_description.toLowerCase().includes('remnant') ||
      detection.scene_description.toLowerCase().includes('leftover') ||
      detection.scene_description.toLowerCase().includes('crumbs') ||
      detection.scene_description.toLowerCase().includes('sauce')) {
    return { safe: false, reason: 'Food remnants detected - attempting nutrition extraction' };
  }

  return { safe: true, reason: 'All safety checks passed' };
}
```

### 4.4 Midnight Munchies (Time-based)

```javascript
function checkMidnightMunchies(detection, timestamp) {
  // Time check: 10pm - 4am (22:00 - 04:00)
  const hour = new Date(timestamp).getHours();
  const isMidnightWindow = (hour >= 22 || hour < 4);

  if (!isMidnightWindow) {
    return { applicable: false, reason: 'Not in midnight window (10pm-4am)' };
  }

  // SAFETY CHECK 1: High confidence food IS detected
  // This is a companion easter egg, not a blocker
  if (!detection.detections.has_food ||
      detection.confidence.has_food !== 'high') {
    return { safe: false, reason: 'Midnight munchies requires food to be present' };
  }

  // SAFETY CHECK 2: This easter egg NEVER blocks nutrition extraction
  // It's just a fun message added to the normal nutrition response

  return {
    safe: true,
    reason: 'Midnight munchies easter egg (does NOT block nutrition extraction)',
    should_attempt_nutrition_extraction: true, // ALWAYS extract for this scenario
    should_trigger_easter_egg: true
  };
}
```

### 4.5 Celebration (Birthday Cake)

```javascript
function checkCelebration(detection) {
  // SAFETY CHECK 1: High confidence celebration
  if (detection.confidence.is_celebration !== 'high') {
    return { safe: false, reason: 'Celebration confidence not high enough' };
  }

  // SAFETY CHECK 2: Birthday cakes ARE food!
  // This easter egg should NEVER block nutrition extraction
  // It's a fun message that appears ALONG WITH nutrition data

  if (detection.scene_description.toLowerCase().includes('cake') ||
      detection.scene_description.toLowerCase().includes('birthday')) {
    return {
      safe: true,
      reason: 'Celebration detected (extracting nutrition for cake)',
      should_attempt_nutrition_extraction: true, // ALWAYS extract
      should_trigger_easter_egg: true
    };
  }

  return { safe: false, reason: 'Celebration detected but no cake - uncertain scenario' };
}
```

### 4.6 Non-Food Item (Soap, Decorative Candles)

```javascript
function checkNonFoodItem(detection) {
  // SAFETY CHECK 1: High confidence non-food item
  if (detection.confidence.has_non_food_item !== 'high') {
    return { safe: false, reason: 'Non-food item confidence not high enough' };
  }

  // SAFETY CHECK 2: High confidence NO actual food
  if (detection.confidence.has_food !== 'high') {
    return { safe: false, reason: 'Food absence confidence not high enough' };
  }

  // SAFETY CHECK 3: No nutrition label
  if (detection.detections.has_nutrition_label) {
    return { safe: false, reason: 'Nutrition label detected - must extract' };
  }

  // SAFETY CHECK 4: Verify it's truly non-food
  // Some items look like food but aren't (soap shaped like cake, candles shaped like fruit)
  const nonFoodKeywords = ['soap', 'candle', 'decoration', 'ornament', 'fake'];
  const hasNonFoodKeyword = nonFoodKeywords.some(keyword =>
    detection.scene_description.toLowerCase().includes(keyword)
  );

  if (!hasNonFoodKeyword) {
    return { safe: false, reason: 'Non-food item not clearly identified - attempting extraction' };
  }

  return { safe: true, reason: 'All safety checks passed' };
}
```

### 4.7 Shopping Scene

```javascript
function checkShoppingScene(detection) {
  // SAFETY CHECK 1: High confidence shopping scene
  if (detection.confidence.is_shopping_scene !== 'high') {
    return { safe: false, reason: 'Shopping scene confidence not high enough' };
  }

  // SAFETY CHECK 2: No nutrition label in focus
  // User might be sending a product label from a store
  if (detection.detections.has_nutrition_label &&
      detection.confidence.has_nutrition_label !== 'low') {
    return { safe: false, reason: 'Nutrition label detected - must extract' };
  }

  // SAFETY CHECK 3: Not a prepared meal
  // Restaurant menus vs actual food at restaurant
  if (detection.scene_description.toLowerCase().includes('prepared') ||
      detection.scene_description.toLowerCase().includes('served') ||
      detection.scene_description.toLowerCase().includes('plated')) {
    return { safe: false, reason: 'Prepared meal detected - attempting extraction' };
  }

  return { safe: true, reason: 'All safety checks passed' };
}
```

### 4.8 Screenshot/Meme

```javascript
function checkScreenshot(detection) {
  // SAFETY CHECK 1: High confidence screenshot
  if (detection.confidence.is_screenshot !== 'high') {
    return { safe: false, reason: 'Screenshot confidence not high enough' };
  }

  // SAFETY CHECK 2: No nutrition label in screenshot
  // User might be sending a screenshot of nutrition info from an app
  if (detection.detections.has_nutrition_label) {
    return { safe: false, reason: 'Nutrition label in screenshot - must extract' };
  }

  // SAFETY CHECK 3: Not a food delivery app screenshot
  if (detection.scene_description.toLowerCase().includes('delivery app') ||
      detection.scene_description.toLowerCase().includes('food app') ||
      detection.scene_description.toLowerCase().includes('nutrition app')) {
    return { safe: false, reason: 'Food app screenshot - attempting extraction' };
  }

  return { safe: true, reason: 'All safety checks passed' };
}
```

### 4.9 Empty Food Packaging

```javascript
function checkEmptyPackaging(detection) {
  // SAFETY CHECK 1: High confidence packaging detected
  if (detection.confidence.has_food_packaging !== 'high') {
    return { safe: false, reason: 'Packaging confidence not high enough' };
  }

  // SAFETY CHECK 2: High confidence NO food inside
  if (detection.confidence.has_food !== 'high') {
    return { safe: false, reason: 'Food absence confidence not high enough' };
  }

  // SAFETY CHECK 3: Check if packaging has visible nutrition label
  // User might want to log the food they already ate from this package
  if (detection.detections.has_nutrition_label &&
      detection.confidence.has_nutrition_label === 'high') {
    return {
      safe: true,
      reason: 'Empty packaging with nutrition label - extracting nutrition',
      should_attempt_nutrition_extraction: true, // Extract from label
      should_trigger_easter_egg: true, // Fun message about empty package
      message_override: 'Looks like someone already enjoyed this! I can still log the nutrition from the label if you\'d like 😊'
    };
  }

  // SAFETY CHECK 4: Packaging appears truly empty
  if (detection.scene_description.toLowerCase().includes('partially') ||
      detection.scene_description.toLowerCase().includes('some') ||
      detection.scene_description.toLowerCase().includes('remaining')) {
    return { safe: false, reason: 'Partially full packaging - attempting extraction' };
  }

  return { safe: true, reason: 'All safety checks passed' };
}
```

---

## 5. FALLBACK BEHAVIOR

### 5.1 Detection Timeout Handling

```javascript
async function detectWithTimeout(imageBuffer, mimeType, timeoutMs = 10000) {
  try {
    const detectionPromise = claudeIntegration.detectEasterEggScenario(
      imageBuffer,
      mimeType
    );

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Detection timeout')), timeoutMs);
    });

    const detection = await Promise.race([detectionPromise, timeoutPromise]);
    return detection;

  } catch (error) {
    console.warn(`Easter egg detection failed or timed out: ${error.message}`);

    // SAFETY FALLBACK: Return a detection result that ALWAYS attempts nutrition
    return {
      detections: { /* all false */ },
      confidence: { /* all low */ },
      overall_confidence: 'low',
      should_attempt_nutrition_extraction: true, // SAFETY FIRST
      should_trigger_easter_egg: false,
      easter_egg_scenario: null,
      scene_description: 'Detection timeout - proceeding to nutrition extraction',
      decision_reasoning: 'Detection timed out - defaulting to nutrition extraction for safety',
      metadata: {
        detection_time_ms: timeoutMs,
        detection_success: false,
        detection_error: error.message
      }
    };
  }
}
```

### 5.2 Detection Failure Handling

```javascript
function handleDetectionFailure(error) {
  console.error('Easter egg detection failed:', error);

  // SAFETY FALLBACK: Always attempt nutrition extraction on failure
  return {
    detections: {},
    confidence: {},
    overall_confidence: 'low',
    should_attempt_nutrition_extraction: true, // SAFETY FIRST
    should_trigger_easter_egg: false,
    easter_egg_scenario: null,
    scene_description: 'Detection failed',
    decision_reasoning: `Detection failed: ${error.message} - defaulting to nutrition extraction for safety`,
    metadata: {
      detection_time_ms: 0,
      detection_success: false,
      detection_error: error.message
    }
  };
}
```

### 5.3 Uncertain Detection Handling

```javascript
function handleUncertainDetection(detection) {
  // If ANY uncertainty exists about food presence, ALWAYS attempt extraction

  const uncertaintyIndicators = [
    detection.overall_confidence === 'low',
    detection.overall_confidence === 'medium',
    detection.confidence.has_food === 'medium',
    detection.confidence.has_nutrition_label === 'medium',
    detection.confidence.has_nutrition_label === 'high',
    detection.detections.has_food === true,
    detection.detections.has_nutrition_label === true
  ];

  if (uncertaintyIndicators.some(indicator => indicator)) {
    return {
      ...detection,
      should_attempt_nutrition_extraction: true,
      should_trigger_easter_egg: false,
      decision_reasoning: 'Uncertainty detected - defaulting to nutrition extraction for safety'
    };
  }

  return detection;
}
```

---

## 6. EDGE CASE HANDLING

### 6.1 Person Eating Food

```
Scenario: Image contains BOTH a person AND food
Detection: has_person=true, has_food=true

Decision:
  should_attempt_nutrition_extraction: TRUE
  should_trigger_easter_egg: FALSE

Reasoning: Food is present, so we MUST extract nutrition.
The fact that a person is also in the frame is irrelevant.
```

### 6.2 Pet Near Food Bowl

```
Scenario: Pet next to food bowl (pet food or human food)
Detection: has_pet=true, has_food=true

Decision:
  should_attempt_nutrition_extraction: TRUE
  should_trigger_easter_egg: FALSE

Reasoning: Food is present. Even if it's pet food, better to
attempt extraction and let Claude handle it than to block it.
```

### 6.3 Empty Plate with Sauce Remnants

```
Scenario: Plate appears empty but has visible sauce/crumbs
Detection: has_empty_plate=true, has_food=? (uncertain)

Decision:
  should_attempt_nutrition_extraction: TRUE
  should_trigger_easter_egg: FALSE

Reasoning: Even small amounts of food matter for nutrition tracking.
Uncertainty about food presence = attempt extraction.
```

### 6.4 Screenshot of Nutrition App

```
Scenario: Screenshot showing nutrition data from another app
Detection: is_screenshot=true, has_nutrition_label=true

Decision:
  should_attempt_nutrition_extraction: TRUE
  should_trigger_easter_egg: FALSE

Reasoning: Nutrition label takes priority over screenshot detection.
User wants to log this data.
```

### 6.5 Birthday Cake with Candles

```
Scenario: Birthday cake (celebration) with visible candles
Detection: is_celebration=true, has_food=true (cake)

Decision:
  should_attempt_nutrition_extraction: TRUE
  should_trigger_easter_egg: TRUE
  easter_egg_scenario: 'celebration'

Reasoning: Cake is food! Extract nutrition AND show celebration message.
This is a "companion" easter egg that doesn't block extraction.
```

### 6.6 Restaurant Menu (Not Food)

```
Scenario: Photo of restaurant menu board
Detection: is_shopping_scene=true, has_food=false, has_nutrition_label=false

Decision:
  should_attempt_nutrition_extraction: FALSE
  should_trigger_easter_egg: TRUE
  easter_egg_scenario: 'shopping_scene'

Reasoning: High confidence no actual food, just menu.
Safe to trigger easter egg.
```

### 6.7 Nutrition Label on Empty Package

```
Scenario: Empty food wrapper with nutrition label visible
Detection: has_food_packaging=true, has_food=false, has_nutrition_label=true

Decision:
  should_attempt_nutrition_extraction: TRUE
  should_trigger_easter_egg: TRUE (with custom message)
  easter_egg_scenario: 'empty_packaging'

Reasoning: User might want to log what they just ate.
Extract from label AND show fun message about empty package.
```

### 6.8 Soap Shaped Like Food

```
Scenario: Decorative soap that looks like cake/fruit
Detection: has_non_food_item=true, has_food=false, confidence=high

Decision:
  should_attempt_nutrition_extraction: FALSE
  should_trigger_easter_egg: TRUE
  easter_egg_scenario: 'non_food_item'

Reasoning: High confidence it's not food.
Safe to trigger easter egg with humor about "not edible".
```

### 6.9 Medium Confidence on Multiple Indicators

```
Scenario: Claude is moderately confident about multiple things
Detection: all confidence levels are 'medium'

Decision:
  should_attempt_nutrition_extraction: TRUE
  should_trigger_easter_egg: FALSE

Reasoning: SAFETY PRINCIPLE: When in doubt, extract nutrition.
Never block nutrition extraction on medium confidence.
```

---

## 7. CODE PSEUDOCODE

### 7.1 Main Easter Egg Safety System

```javascript
/**
 * Master function for safe easter egg handling
 * CRITICAL: This function ensures food is NEVER missed
 */
async function handleImageWithEasterEggSafety(imageBuffer, mimeType, userId, ctx) {
  const startTime = Date.now();

  try {
    // STEP 1: Run easter egg detection with timeout
    console.log('[Easter Egg] Starting detection...');
    const detection = await detectWithTimeout(
      imageBuffer,
      mimeType,
      CONFIDENCE_THRESHOLDS.TIMEOUT.max_detection_time_ms
    );

    detection.metadata.detection_time_ms = Date.now() - startTime;

    // STEP 2: Apply uncertainty handler (safety layer)
    const safeDetection = handleUncertainDetection(detection);

    // STEP 3: Log detection result for debugging
    console.log('[Easter Egg] Detection result:', {
      scenario: safeDetection.easter_egg_scenario,
      should_extract: safeDetection.should_attempt_nutrition_extraction,
      should_trigger: safeDetection.should_trigger_easter_egg,
      confidence: safeDetection.overall_confidence,
      reasoning: safeDetection.decision_reasoning
    });

    // STEP 4: Decide final action
    const decision = decideFinalAction(safeDetection);

    // STEP 5: Handle based on decision
    if (decision.should_trigger_easter_egg && !decision.should_attempt_nutrition_extraction) {
      // Easter egg ONLY - no nutrition extraction
      return await handleEasterEggOnly(
        ctx,
        safeDetection.easter_egg_scenario,
        safeDetection.scene_description
      );
    }

    if (decision.should_trigger_easter_egg && decision.should_attempt_nutrition_extraction) {
      // BOTH easter egg AND nutrition extraction (companion easter eggs)
      return await handleEasterEggWithNutrition(
        ctx,
        imageBuffer,
        mimeType,
        userId,
        safeDetection.easter_egg_scenario,
        safeDetection.scene_description
      );
    }

    if (decision.should_attempt_nutrition_extraction && !decision.should_trigger_easter_egg) {
      // Nutrition extraction ONLY - no easter egg
      return await handleNutritionExtractionOnly(
        ctx,
        imageBuffer,
        mimeType,
        userId
      );
    }

    // SAFETY FALLBACK: If no decision matched, default to nutrition extraction
    console.warn('[Easter Egg] No decision branch matched - defaulting to nutrition extraction');
    return await handleNutritionExtractionOnly(
      ctx,
      imageBuffer,
      mimeType,
      userId
    );

  } catch (error) {
    // CRITICAL SAFETY: On ANY error, attempt nutrition extraction
    console.error('[Easter Egg] Error in easter egg system:', error);
    console.log('[Easter Egg] Falling back to nutrition extraction for safety');

    return await handleNutritionExtractionOnly(
      ctx,
      imageBuffer,
      mimeType,
      userId
    );
  }
}
```

### 7.2 Easter Egg Detection with Multi-Scenario Support

```javascript
/**
 * Detect all easter egg scenarios in a single API call
 * Returns comprehensive detection result with confidence levels
 */
async function detectEasterEggScenario(imageBuffer, mimeType) {
  const prompt = `Analyze this image for a nutrition tracking bot and detect ALL applicable scenarios.

CRITICAL INSTRUCTIONS:
1. Be VERY CONSERVATIVE when saying there is NO food
   - If you see ANY food, meals, ingredients, or nutrition labels: has_food = true
   - Only set has_food = false if you are ABSOLUTELY CERTAIN there is no food

2. Use "high" confidence ONLY when you are 95%+ certain
   - Use "medium" for 70-95% certainty (most cases should be medium)
   - Use "low" for <70% certainty or any uncertainty

3. Scene description should be detailed and objective

DETECTION CATEGORIES:
- has_person: Is there a person visible? (face, body, limbs, reflection)
- has_pet: Is there a pet/animal visible?
- has_food: Is there ANY food, meal, ingredients, or edible items?
- has_nutrition_label: Is there a nutrition facts label visible?
- has_empty_plate: Is there an empty plate/bowl (truly empty, not just finished)?
- has_food_packaging: Is there empty food packaging/wrappers?
- has_non_food_item: Are there non-food items that look like food (soap, candles)?
- is_screenshot: Is this a screenshot of digital content/memes?
- is_shopping_scene: Is this a grocery store aisle or restaurant menu (not prepared food)?
- is_celebration: Is there a birthday cake with candles or celebration scene?

Return ONLY this JSON:
\`\`\`json
{
  "detections": {
    "has_person": true/false,
    "has_pet": true/false,
    "has_food": true/false,
    "has_nutrition_label": true/false,
    "has_empty_plate": true/false,
    "has_food_packaging": true/false,
    "has_non_food_item": true/false,
    "is_screenshot": true/false,
    "is_shopping_scene": true/false,
    "is_celebration": true/false
  },
  "confidence": {
    "has_person": "high" | "medium" | "low",
    "has_pet": "high" | "medium" | "low",
    "has_food": "high" | "medium" | "low",
    "has_nutrition_label": "high" | "medium" | "low",
    "has_empty_plate": "high" | "medium" | "low",
    "has_food_packaging": "high" | "medium" | "low",
    "has_non_food_item": "high" | "medium" | "low",
    "is_screenshot": "high" | "medium" | "low",
    "is_shopping_scene": "high" | "medium" | "low",
    "is_celebration": "high" | "medium" | "low"
  },
  "overall_confidence": "high" | "medium" | "low",
  "scene_description": "Detailed objective description of what you see in the image"
}
\`\`\``;

  // Make Claude Vision API call
  const response = await claudeIntegration.callVisionAPI(imageBuffer, mimeType, prompt);

  // Parse and validate response
  const detection = parseDetectionResponse(response);

  // Apply decision logic to set should_attempt_nutrition_extraction and should_trigger_easter_egg
  const finalDetection = decideFinalAction(detection);

  return finalDetection;
}
```

### 7.3 Safety Validation Before Easter Egg Trigger

```javascript
/**
 * Final safety validation before triggering any easter egg
 * Returns true only if ALL safety checks pass
 */
function validateEasterEggSafety(detection, scenario) {
  console.log(`[Safety Check] Validating scenario: ${scenario}`);

  // Get scenario-specific safety checks
  const safetyCheck = getSafetyCheckForScenario(scenario, detection);

  if (!safetyCheck.safe) {
    console.log(`[Safety Check] FAILED: ${safetyCheck.reason}`);
    return false;
  }

  // Universal safety checks that apply to ALL easter eggs
  const universalChecks = [
    {
      condition: detection.overall_confidence === 'high',
      reason: 'Overall confidence must be high'
    },
    {
      condition: !detection.detections.has_nutrition_label ||
                detection.confidence.has_nutrition_label === 'low',
      reason: 'Must not have high-confidence nutrition label'
    },
    {
      condition: detection.metadata.detection_success === true,
      reason: 'Detection must have succeeded'
    }
  ];

  for (const check of universalChecks) {
    if (!check.condition) {
      console.log(`[Safety Check] FAILED universal check: ${check.reason}`);
      return false;
    }
  }

  console.log(`[Safety Check] PASSED: All safety checks for ${scenario}`);
  return true;
}

function getSafetyCheckForScenario(scenario, detection) {
  switch (scenario) {
    case 'person_without_food':
      return checkPersonWithoutFood(detection);
    case 'pet':
      return checkPet(detection);
    case 'empty_plate':
      return checkEmptyPlate(detection);
    case 'non_food_item':
      return checkNonFoodItem(detection);
    case 'shopping_scene':
      return checkShoppingScene(detection);
    case 'screenshot_meme':
      return checkScreenshot(detection);
    case 'celebration':
      return checkCelebration(detection);
    case 'empty_packaging':
      return checkEmptyPackaging(detection);
    case 'midnight_munchies':
      return checkMidnightMunchies(detection, Date.now());
    default:
      return {
        safe: false,
        reason: `Unknown scenario: ${scenario}`
      };
  }
}
```

---

## 8. TESTING STRATEGY

### 8.1 Test Cases for Safety Validation

```javascript
const TEST_CASES = [
  // CRITICAL: These MUST extract nutrition
  {
    name: 'Person eating burger',
    detections: { has_person: true, has_food: true },
    expected: { should_attempt_nutrition_extraction: true, should_trigger_easter_egg: false }
  },
  {
    name: 'Nutrition label visible',
    detections: { has_nutrition_label: true },
    confidence: { has_nutrition_label: 'high' },
    expected: { should_attempt_nutrition_extraction: true, should_trigger_easter_egg: false }
  },
  {
    name: 'Medium confidence no food',
    detections: { has_food: false },
    confidence: { has_food: 'medium' },
    expected: { should_attempt_nutrition_extraction: true, should_trigger_easter_egg: false }
  },
  {
    name: 'Low overall confidence',
    overall_confidence: 'low',
    expected: { should_attempt_nutrition_extraction: true, should_trigger_easter_egg: false }
  },
  {
    name: 'Detection timeout',
    metadata: { detection_success: false },
    expected: { should_attempt_nutrition_extraction: true, should_trigger_easter_egg: false }
  },

  // SAFE: These can trigger easter eggs
  {
    name: 'Person selfie no food',
    detections: { has_person: true, has_food: false },
    confidence: { has_person: 'high', has_food: 'high' },
    overall_confidence: 'high',
    expected: { should_attempt_nutrition_extraction: false, should_trigger_easter_egg: true }
  },
  {
    name: 'Pet photo no food',
    detections: { has_pet: true, has_food: false },
    confidence: { has_pet: 'high', has_food: 'high' },
    overall_confidence: 'high',
    expected: { should_attempt_nutrition_extraction: false, should_trigger_easter_egg: true }
  },

  // COMPANION: Extract nutrition AND show easter egg
  {
    name: 'Birthday cake with candles',
    detections: { is_celebration: true, has_food: true },
    confidence: { is_celebration: 'high', has_food: 'high' },
    overall_confidence: 'high',
    expected: { should_attempt_nutrition_extraction: true, should_trigger_easter_egg: true }
  }
];
```

### 8.2 Monitoring and Logging

```javascript
/**
 * Comprehensive logging for debugging and monitoring
 */
function logEasterEggDecision(detection, decision, outcome) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    detection: {
      scenario: detection.easter_egg_scenario,
      detections: detection.detections,
      confidence: detection.confidence,
      overall_confidence: detection.overall_confidence,
      detection_time_ms: detection.metadata.detection_time_ms
    },
    decision: {
      should_attempt_nutrition_extraction: decision.should_attempt_nutrition_extraction,
      should_trigger_easter_egg: decision.should_trigger_easter_egg,
      reasoning: decision.reason
    },
    outcome: {
      action_taken: outcome.action,
      nutrition_extracted: outcome.nutrition_extracted,
      easter_egg_shown: outcome.easter_egg_shown,
      user_id: outcome.user_id
    }
  };

  console.log('[Easter Egg Decision]', JSON.stringify(logEntry, null, 2));

  // Optional: Send to monitoring service for analysis
  // monitoringService.logEasterEggDecision(logEntry);
}
```

---

## 9. IMPLEMENTATION CHECKLIST

- [ ] Update `detectPersonInImage` → `detectEasterEggScenario` with multi-scenario support
- [ ] Implement comprehensive detection schema with all 10 scenarios
- [ ] Add confidence levels for each detection
- [ ] Implement `decideFinalAction` with safety gates
- [ ] Implement scenario-specific safety checks (functions in section 4)
- [ ] Add timeout handling with fallback
- [ ] Add detection failure handling
- [ ] Add uncertainty handling
- [ ] Implement "companion" easter eggs (celebration, midnight munchies)
- [ ] Update webhook.js photo handler to use new safety system
- [ ] Add comprehensive logging
- [ ] Write unit tests for all safety checks
- [ ] Write integration tests for edge cases
- [ ] Add monitoring/metrics for detection success rates
- [ ] Document easter egg messages for each scenario
- [ ] Test with real user images (100+ test cases)

---

## 10. CONCLUSION

This safety system ensures that **food is NEVER missed** due to easter egg logic through:

1. **Multi-layered safety gates** that default to nutrition extraction when uncertain
2. **Confidence thresholds** requiring HIGH confidence to trigger blocking easter eggs
3. **Timeout handling** that falls back to nutrition extraction
4. **Edge case handling** for complex scenarios (person eating food, empty package with label, etc.)
5. **Companion easter eggs** that enhance the experience WITHOUT blocking nutrition
6. **Comprehensive logging** for debugging and monitoring
7. **Fail-safe defaults** that prioritize nutrition tracking over humor

**Guiding Principle**: When in doubt, extract nutrition. Easter eggs are fun, but nutrition tracking is the core mission.
