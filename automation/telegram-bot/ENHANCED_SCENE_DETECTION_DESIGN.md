# Enhanced Scene Detection for Nutrition Tracking Bot

## Overview
This document provides a comprehensive Claude Vision API prompt design for detecting various image scenarios in a nutrition tracking bot, with safeguards against misclassifying actual food.

## Complete Prompt Text

```
Analyze this image comprehensively to determine what type of scene this is and whether nutrition extraction should be attempted.

Your task is to detect:
1. Whether any people are visible (faces, bodies, partial views, reflections, etc.)
2. Whether any REAL, CONSUMABLE food is present that the user likely ate or will eat
3. Whether any pets/animals are visible
4. What type of scene this is (selfie, meal photo, celebration, shopping, etc.)
5. Whether we should attempt to extract nutrition data from this image

## CRITICAL DECISION CRITERIA:

### ALWAYS attempt nutrition extraction when:
- Real food is clearly visible and appears to be consumed/consumable
- Person eating food (has_person=true, has_food=true)
- Celebration with real food like birthday cake (it's actual food they'll eat!)
- Nutrition label is visible (even on empty packaging)
- Menu item photo taken at a restaurant (likely ordering/consumed)
- Food photo with pet nearby (focus is on the food)
- ANY uncertainty about whether food is present

### NEVER attempt nutrition extraction when (HIGH confidence required):
- Pure selfie with NO food visible (confidence: high)
- Pet/animal photo with NO food visible (confidence: high)
- Soap, candles, toys, or decorative items that look like food (confidence: high)
- Shopping scene with multiple products/options not yet selected (confidence: high)
- Screenshot of food on TV/laptop/phone screen (confidence: high)
- Empty plate with no visible food residue (confidence: high)

### UNCERTAIN cases (DEFAULT to attempting extraction):
- Empty plate with visible sauce/crumbs → attempt extraction (describe remains)
- Birthday cake photo → attempt extraction (it's real food!)
- Unclear if item is food or non-food → attempt extraction (err on side of caution)
- Low image quality → attempt extraction (let nutrition extraction handle it)

## Scene Type Definitions:

- **selfie**: Person-focused photo with no food visible
- **meal_photo**: Photo of consumable food (with or without person)
- **nutrition_label**: Nutrition facts label or ingredient list visible
- **menu**: Restaurant menu or menu board
- **celebration**: Birthday, party, or celebration scene (may have real food!)
- **shopping**: Grocery store aisle, multiple products, shopping cart
- **empty_plate**: Plate/bowl with no food (may have residue)
- **pet_photo**: Pet/animal focused photo (may or may not have food)
- **screenshot**: Digital content showing food on screens
- **non_food_item**: Soap, candles, decorative items resembling food
- **unclear**: Cannot confidently determine scene type
- **other**: Does not fit other categories

## Edge Cases to Handle Carefully:

1. **Person eating food**: has_person=true, has_food=true → EXTRACT (real meal)
2. **Birthday cake**: is_celebration=true, has_food=true → EXTRACT (real food!)
3. **Pet near food bowl with food**: has_pet=true, has_food=true → EXTRACT
4. **Empty packaging with nutrition label**: is_empty_packaging=true → EXTRACT (label visible)
5. **Restaurant menu board**: is_shopping_scene=false, scene_type=menu → EXTRACT
6. **Grocery store aisle**: is_shopping_scene=true → DO NOT EXTRACT
7. **Food on TV screen**: is_digital_content=true → DO NOT EXTRACT
8. **Soap shaped like cupcake**: is_fake_food=true → DO NOT EXTRACT

## Response Requirements:

Return ONLY this JSON structure (all fields required):

```json
{
  "has_person": true/false,
  "has_food": true/false,
  "has_pet": true/false,
  "scene_type": "selfie" | "meal_photo" | "nutrition_label" | "menu" | "celebration" | "shopping" | "empty_plate" | "pet_photo" | "screenshot" | "non_food_item" | "unclear" | "other",
  "is_celebration": true/false,
  "is_shopping_scene": true/false,
  "is_digital_content": true/false,
  "is_empty_packaging": true/false,
  "is_fake_food": true/false,
  "should_attempt_nutrition_extraction": true/false,
  "confidence": "high" | "medium" | "low",
  "details": "Brief description of what you see in the image",
  "reasoning": "Brief explanation of why should_attempt_nutrition_extraction is true/false"
}
```

## Important Notes:

- **Be conservative**: When in doubt, set should_attempt_nutrition_extraction=true
- **High confidence threshold for easter eggs**: Only trigger easter eggs (has_person=true, has_food=false) when confidence is "high"
- **Real food trumps all**: If there's ANY real, consumable food visible, prioritize extraction
- **Context matters**: A birthday cake is real food, even if it's a celebration
- **Don't be fooled**: Distinguish between real food and food-shaped objects (soap, candles, toys)
```

## JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": [
    "has_person",
    "has_food",
    "has_pet",
    "scene_type",
    "is_celebration",
    "is_shopping_scene",
    "is_digital_content",
    "is_empty_packaging",
    "is_fake_food",
    "should_attempt_nutrition_extraction",
    "confidence",
    "details",
    "reasoning"
  ],
  "properties": {
    "has_person": {
      "type": "boolean",
      "description": "Whether any human presence is detected (faces, bodies, limbs, reflections)"
    },
    "has_food": {
      "type": "boolean",
      "description": "Whether REAL, CONSUMABLE food is visible in the image"
    },
    "has_pet": {
      "type": "boolean",
      "description": "Whether any pets or animals are visible"
    },
    "scene_type": {
      "type": "string",
      "enum": [
        "selfie",
        "meal_photo",
        "nutrition_label",
        "menu",
        "celebration",
        "shopping",
        "empty_plate",
        "pet_photo",
        "screenshot",
        "non_food_item",
        "unclear",
        "other"
      ],
      "description": "Primary classification of the scene type"
    },
    "is_celebration": {
      "type": "boolean",
      "description": "Whether this is a celebration scene (birthday, party, etc.)"
    },
    "is_shopping_scene": {
      "type": "boolean",
      "description": "Whether this shows shopping (grocery store, multiple products not yet selected)"
    },
    "is_digital_content": {
      "type": "boolean",
      "description": "Whether food is shown on a screen (TV, laptop, phone screenshot)"
    },
    "is_empty_packaging": {
      "type": "boolean",
      "description": "Whether this shows empty food packaging (wrapper, container)"
    },
    "is_fake_food": {
      "type": "boolean",
      "description": "Whether visible items look like food but are not (soap, candles, toys, decorations)"
    },
    "should_attempt_nutrition_extraction": {
      "type": "boolean",
      "description": "CRITICAL: Whether the bot should attempt to extract nutrition data. Conservative: when in doubt, return true."
    },
    "confidence": {
      "type": "string",
      "enum": ["high", "medium", "low"],
      "description": "Confidence level in the detection. Only trigger easter eggs with 'high' confidence."
    },
    "details": {
      "type": "string",
      "description": "Brief description of what is visible in the image"
    },
    "reasoning": {
      "type": "string",
      "description": "Brief explanation of why should_attempt_nutrition_extraction is true or false"
    }
  }
}
```

## Field Usage Guide

### Core Detection Fields

**has_person** (boolean)
- Set to `true` if ANY human presence is detected (faces, bodies, limbs, reflections, shadows)
- Used to trigger person-without-food easter egg
- Consider partial views, people at edge of frame, or in background

**has_food** (boolean)
- Set to `true` ONLY if REAL, CONSUMABLE food is visible
- Must be actual food that could be eaten, not food-shaped objects
- Nutrition labels count as food-related content
- Birthday cakes, restaurant meals, meal prep all count as real food

**has_pet** (boolean)
- Set to `true` if any pets or animals are visible
- Can be used for pet-specific easter eggs in the future
- Pet + food = still extract nutrition (focus on food)

### Scene Classification

**scene_type** (enum)
- Primary categorization of the image
- Used for routing to appropriate response templates
- "unclear" when image quality is poor or scene is ambiguous

**is_celebration** (boolean)
- Birthday cakes, party scenes, celebrations
- IMPORTANT: Celebration food is still real food → extract nutrition!
- Don't let celebration context prevent nutrition extraction

**is_shopping_scene** (boolean)
- Grocery store aisles, shopping carts, multiple product options
- User hasn't selected/consumed anything yet → don't extract
- Restaurant menu boards are NOT shopping scenes

**is_digital_content** (boolean)
- Food shown on TV, laptop, phone screens
- Screenshots of social media food posts
- Not actually consumable → don't extract

**is_empty_packaging** (boolean)
- Empty wrappers, containers, bottles
- If nutrition label is visible → DO extract (valuable data!)
- If no label visible → don't extract

**is_fake_food** (boolean)
- Soap shaped like cupcakes, candles shaped like cake
- Toy food, decorative items, art installations
- Requires HIGH confidence to prevent false positives

### Critical Decision Field

**should_attempt_nutrition_extraction** (boolean)
- **MOST IMPORTANT FIELD**
- Determines whether to proceed with nutrition extraction
- Conservative default: when in doubt, return `true`
- Only return `false` with HIGH confidence

**Decision Logic:**
```
if (has_food && !is_fake_food && !is_shopping_scene && !is_digital_content):
    → true (real food present)

elif (is_empty_packaging && has_nutrition_label):
    → true (can extract from label)

elif (has_person && !has_food && confidence == "high"):
    → false (pure selfie easter egg)

elif (has_pet && !has_food && confidence == "high"):
    → false (pet photo easter egg)

elif (is_fake_food && confidence == "high"):
    → false (not real food)

else:
    → true (default conservative: attempt extraction)
```

### Metadata Fields

**confidence** (enum: "high" | "medium" | "low")
- Easter eggs should ONLY trigger with "high" confidence
- Use "medium" when scene is identifiable but has some uncertainty
- Use "low" when image quality is poor or scene is ambiguous

**details** (string)
- Human-readable description of what's in the image
- Used for logging and debugging
- Examples: "Person smiling in selfie, no food visible", "Grilled chicken with vegetables on plate"

**reasoning** (string)
- Explains the logic behind should_attempt_nutrition_extraction decision
- Helps with debugging and improving the prompt
- Examples: "Real food visible on plate, likely consumed meal", "Pure selfie with no food items detected"

## Expected Response Examples

### Example 1: Pure Selfie (Easter Egg)
```json
{
  "has_person": true,
  "has_food": false,
  "has_pet": false,
  "scene_type": "selfie",
  "is_celebration": false,
  "is_shopping_scene": false,
  "is_digital_content": false,
  "is_empty_packaging": false,
  "is_fake_food": false,
  "should_attempt_nutrition_extraction": false,
  "confidence": "high",
  "details": "Close-up selfie of a person smiling, no food or nutrition-related items visible",
  "reasoning": "Pure selfie with high confidence, no food present - trigger easter egg"
}
```

### Example 2: Person Eating Food (Extract)
```json
{
  "has_person": true,
  "has_food": true,
  "has_pet": false,
  "scene_type": "meal_photo",
  "is_celebration": false,
  "is_shopping_scene": false,
  "is_digital_content": false,
  "is_empty_packaging": false,
  "is_fake_food": false,
  "should_attempt_nutrition_extraction": true,
  "confidence": "high",
  "details": "Person sitting at table with grilled chicken breast, roasted vegetables, and rice on plate",
  "reasoning": "Real food visible that person is consuming - extract nutrition"
}
```

### Example 3: Birthday Cake (Extract!)
```json
{
  "has_person": true,
  "has_food": true,
  "has_pet": false,
  "scene_type": "celebration",
  "is_celebration": true,
  "is_shopping_scene": false,
  "is_digital_content": false,
  "is_empty_packaging": false,
  "is_fake_food": false,
  "should_attempt_nutrition_extraction": true,
  "confidence": "high",
  "details": "Birthday cake with lit candles on table, people in background",
  "reasoning": "Celebration scene but cake is real food that will be consumed - extract nutrition"
}
```

### Example 4: Pet Photo (Easter Egg)
```json
{
  "has_person": false,
  "has_food": false,
  "has_pet": true,
  "scene_type": "pet_photo",
  "is_celebration": false,
  "is_shopping_scene": false,
  "is_digital_content": false,
  "is_empty_packaging": false,
  "is_fake_food": false,
  "should_attempt_nutrition_extraction": false,
  "confidence": "high",
  "details": "Close-up photo of a dog looking at camera, no food visible",
  "reasoning": "Pet photo with no food present - potential pet easter egg"
}
```

### Example 5: Pet Near Food Bowl (Extract)
```json
{
  "has_person": false,
  "has_food": true,
  "has_pet": true,
  "scene_type": "meal_photo",
  "is_celebration": false,
  "is_shopping_scene": false,
  "is_digital_content": false,
  "is_empty_packaging": false,
  "is_fake_food": false,
  "should_attempt_nutrition_extraction": true,
  "confidence": "high",
  "details": "Dog next to food bowl containing what appears to be chicken and rice",
  "reasoning": "Real food visible in bowl, user likely tracking pet's meal - extract nutrition"
}
```

### Example 6: Empty Plate with Sauce Residue (Extract - Uncertain)
```json
{
  "has_person": false,
  "has_food": true,
  "has_pet": false,
  "scene_type": "empty_plate",
  "is_celebration": false,
  "is_shopping_scene": false,
  "is_digital_content": false,
  "is_empty_packaging": false,
  "is_fake_food": false,
  "should_attempt_nutrition_extraction": true,
  "confidence": "medium",
  "details": "Empty plate with visible sauce residue and a few crumbs",
  "reasoning": "Uncertain case with food remains - conservatively attempt extraction to describe what was eaten"
}
```

### Example 7: Grocery Store Aisle (Don't Extract)
```json
{
  "has_person": false,
  "has_food": true,
  "has_pet": false,
  "scene_type": "shopping",
  "is_celebration": false,
  "is_shopping_scene": true,
  "is_digital_content": false,
  "is_empty_packaging": false,
  "is_fake_food": false,
  "should_attempt_nutrition_extraction": false,
  "confidence": "high",
  "details": "Grocery store aisle with multiple cereal boxes on shelves",
  "reasoning": "Shopping scene with multiple options, nothing selected or consumed yet - don't extract"
}
```

### Example 8: Restaurant Menu Board (Extract)
```json
{
  "has_person": false,
  "has_food": true,
  "has_pet": false,
  "scene_type": "menu",
  "is_celebration": false,
  "is_shopping_scene": false,
  "is_digital_content": false,
  "is_empty_packaging": false,
  "is_fake_food": false,
  "should_attempt_nutrition_extraction": true,
  "confidence": "high",
  "details": "Restaurant menu board showing burger with fries and nutrition information",
  "reasoning": "Menu item with nutrition info - user likely ordering/ordered this item, extract nutrition"
}
```

### Example 9: Food on TV Screen (Don't Extract)
```json
{
  "has_person": false,
  "has_food": true,
  "has_pet": false,
  "scene_type": "screenshot",
  "is_celebration": false,
  "is_shopping_scene": false,
  "is_digital_content": true,
  "is_empty_packaging": false,
  "is_fake_food": false,
  "should_attempt_nutrition_extraction": false,
  "confidence": "high",
  "details": "TV screen showing cooking show with pasta dish",
  "reasoning": "Digital content on screen, not consumable food - don't extract"
}
```

### Example 10: Soap Shaped Like Cupcakes (Don't Extract)
```json
{
  "has_person": false,
  "has_food": false,
  "has_pet": false,
  "scene_type": "non_food_item",
  "is_celebration": false,
  "is_shopping_scene": false,
  "is_digital_content": false,
  "is_empty_packaging": false,
  "is_fake_food": true,
  "should_attempt_nutrition_extraction": false,
  "confidence": "high",
  "details": "Decorative soaps shaped and colored like cupcakes with frosting",
  "reasoning": "Non-food items resembling food (soap) - don't extract nutrition"
}
```

### Example 11: Empty Wrapper with Nutrition Label (Extract)
```json
{
  "has_person": false,
  "has_food": true,
  "has_pet": false,
  "scene_type": "nutrition_label",
  "is_celebration": false,
  "is_shopping_scene": false,
  "is_digital_content": false,
  "is_empty_packaging": true,
  "is_fake_food": false,
  "should_attempt_nutrition_extraction": true,
  "confidence": "high",
  "details": "Empty protein bar wrapper with nutrition facts label clearly visible",
  "reasoning": "Empty packaging but nutrition label is visible and legible - extract nutrition data from label"
}
```

### Example 12: Unclear/Low Quality Image (Extract - Conservative)
```json
{
  "has_person": false,
  "has_food": true,
  "has_pet": false,
  "scene_type": "unclear",
  "is_celebration": false,
  "is_shopping_scene": false,
  "is_digital_content": false,
  "is_empty_packaging": false,
  "is_fake_food": false,
  "should_attempt_nutrition_extraction": true,
  "confidence": "low",
  "details": "Blurry image, appears to show food items but details are unclear",
  "reasoning": "Uncertain due to image quality - conservatively attempt extraction, let nutrition extraction handle quality issues"
}
```

## Implementation Notes

### Integration with Current Code

The enhanced detection should be used in `/automation/telegram-bot/src/claude-integration.js` by replacing the current `detectPersonInImage` function (lines 631-754) with a new `detectSceneComprehensive` function that uses the enhanced prompt above.

### Easter Egg Logic Update

Update the webhook handler (`/automation/telegram-bot/src/webhook.js` around line 834) to:

```javascript
// Step 3: Comprehensive scene detection
const detectionResult = await claudeIntegration.detectSceneComprehensive(imageBuffer, mimeType);

if (detectionResult.success && !detectionResult.should_attempt_nutrition_extraction) {
  // Check if this warrants an easter egg response
  if (detectionResult.confidence === 'high') {
    let easterEggMessages = [];

    if (detectionResult.has_person && !detectionResult.has_food) {
      // Person without food easter egg
      easterEggMessages = [
        "👀 Looks like an absolute snack, but I'm not sure we have nutrition data for that! 😄\n\nMaybe try sending a photo of some actual food? 🍕",
        "🙋 I see someone looking great, but where's the food? 😊\n\nI'm here to track meals, not selfies! Send me something delicious instead! 🥗",
        // ... existing messages
      ];
    } else if (detectionResult.has_pet && !detectionResult.has_food) {
      // Pet without food easter egg
      easterEggMessages = [
        "🐶 Aww, what a cutie! But I need food to track nutrition! 🐾\n\nSend me a photo of what YOU ate! 🍽️",
        "🐱 Adorable! But I'm a nutrition tracker, not a pet photographer! 😸\n\nShow me some actual food and I'll help you track it! 🥘",
      ];
    } else if (detectionResult.is_fake_food) {
      // Fake food easter egg
      easterEggMessages = [
        "🧼 That looks delicious, but I'm pretty sure it's not food! 😅\n\nSend me something actually edible! 🍔",
      ];
    } else if (detectionResult.is_shopping_scene) {
      // Shopping scene easter egg
      easterEggMessages = [
        "🛒 I see you're shopping! But I need to know what you actually ATE! 🤔\n\nBuy something tasty and send me a photo after you eat it! 🍕",
      ];
    } else if (detectionResult.is_digital_content) {
      // Screen content easter egg
      easterEggMessages = [
        "📺 I see food on a screen! But I need REAL food that you actually ate! 😊\n\nSend me your actual meal! 🍽️",
      ];
    }

    if (easterEggMessages.length > 0) {
      const randomMessage = easterEggMessages[Math.floor(Math.random() * easterEggMessages.length)];

      await ctx.telegram.editMessageText(
        ctx.chat.id,
        processingMsg.message_id,
        null,
        randomMessage
      );

      console.log(`Easter egg triggered for user ${userId}: ${detectionResult.scene_type}`);
      return; // Don't process for nutrition
    }
  }
}

// If should_attempt_nutrition_extraction=true OR no easter egg triggered, continue to nutrition extraction
```

### Conservative Extraction Philosophy

The design follows a **conservative extraction philosophy**:
- When in doubt → attempt extraction
- Only skip extraction with high confidence
- Better to attempt and get clarification than to miss real food
- Nutrition extraction can handle edge cases (it will ask for clarification if needed)

### Testing Checklist

Test the enhanced detection with these scenarios:
- ✓ Pure selfie (no food)
- ✓ Person eating food
- ✓ Birthday cake with candles
- ✓ Pet photo (no food)
- ✓ Pet near food bowl with food
- ✓ Empty plate (clean)
- ✓ Empty plate with sauce residue
- ✓ Grocery store aisle
- ✓ Restaurant menu board
- ✓ Food on TV screen
- ✓ Social media screenshot of food
- ✓ Soap shaped like food
- ✓ Candles shaped like cupcakes
- ✓ Empty wrapper with nutrition label
- ✓ Empty wrapper without label
- ✓ Blurry/unclear food photo

## Summary

This enhanced scene detection prompt provides:

1. **Comprehensive detection** of 12+ scenario types
2. **Conservative extraction philosophy** (when in doubt, attempt)
3. **High confidence threshold** for easter eggs (prevents false positives)
4. **Clear distinction** between real food and food-lookalikes
5. **Edge case handling** for celebrations, empty plates, packaging, etc.
6. **Detailed reasoning** for debugging and improvement
7. **Extensible design** for future easter egg types (pets, shopping, digital content, fake food)

The key innovation is the `should_attempt_nutrition_extraction` field, which separates the "is there food?" question from the "should we try to extract nutrition?" decision, allowing for nuanced handling of edge cases while maintaining a conservative default.
