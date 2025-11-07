/**
 * EASTER EGG SAFETY SYSTEM - IMPLEMENTATION PSEUDOCODE
 *
 * This file contains ready-to-implement code for the easter egg safety system.
 * CRITICAL REQUIREMENT: Never let an easter egg prevent actual food from being logged.
 *
 * File location: automation/telegram-bot/src/easter-egg-safety.js
 */

// ============================================================================
// CONSTANTS AND CONFIGURATION
// ============================================================================

const CONFIDENCE_THRESHOLDS = {
  EASTER_EGG_TRIGGER: {
    min_overall_confidence: 'high',
    min_scenario_confidence: 'high',
    min_no_food_confidence: 'high'
  },
  NUTRITION_EXTRACTION: {
    min_food_confidence_to_extract: 'medium',
    min_label_confidence_to_extract: 'low',
    max_no_food_confidence_to_skip: 'low'
  },
  TIMEOUT: {
    max_detection_time_ms: 10000, // 10 seconds
    max_nutrition_extraction_time_ms: 120000 // 120 seconds
  }
};

const EASTER_EGG_MESSAGES = {
  person_without_food: [
    "👀 Looks like an absolute snack, but I'm not sure we have nutrition data for that! 😄\n\nMaybe try sending a photo of some actual food? 🍕",
    "🙋 I see someone looking great, but where's the food? 😊\n\nI'm here to track meals, not selfies! Send me something delicious instead! 🥗",
    "👤 Well hello there! You look fantastic, but I need actual food to analyze! 😅\n\nTry sending a meal photo or nutrition label! 🍽️"
  ],
  pet: [
    "🐾 Aww, what a cute companion! But I need actual food to track nutrition! 😊\n\nSend me a meal photo or nutrition label! 🍽️",
    "🐕 Adorable! But I'm a nutrition tracker, not a pet tracker! 🐈\n\nShow me what YOU'RE eating! 🥗",
    "🐾 Such a cutie! Though I'm pretty sure we don't have nutrition data for pets! 😄\n\nSend me a photo of your meal instead! 🍕"
  ],
  empty_plate: [
    "🍽️ Looks like someone enjoyed their meal! All done? 😊\n\nNext time, send the photo BEFORE you finish! 😄",
    "🍴 Clean plate club! But I need to see the food to track it! 😅\n\nRemember to snap a photo before digging in! 📸",
    "🥘 That plate is looking pretty empty! 👀\n\nSend me a photo with actual food on it next time! 🍕"
  ],
  midnight_munchies: [
    "🌙 Midnight munchies detected! Someone's burning the midnight oil! 😴\n\n",
    "🕐 Late night snacking, I see! 🌃\n\n",
    "🌜 Fueling the night owl lifestyle! 🦉\n\n"
  ],
  celebration: [
    "🎉 Happy celebration! 🎂 That cake looks delicious!\n\n",
    "🎊 Birthday vibes! 🎁 Make a wish and blow out those candles!\n\n",
    "🥳 Party time! 🎈 Enjoy the celebration!\n\n"
  ],
  non_food_item: [
    "🧼 Hmm, that looks delicious but I'm pretty sure it's not edible! 😅\n\nSend me actual food to track! 🍕",
    "🕯️ Is that soap? A candle? Either way, probably not nutritious! 😄\n\nShow me real food! 🥗",
    "🎨 That's a work of art, but not the edible kind! 🖼️\n\nSend me something you actually ate! 🍽️"
  ],
  shopping_scene: [
    "🛒 Shopping for groceries? Planning a meal? 🤔\n\nSend me a photo once you've actually prepared and eaten it! 🍳",
    "📋 That's a menu/store shelf! I need to see what you actually ate! 😊\n\nSnap a photo of your meal! 📸",
    "🏪 Browsing options I see! Come back when you've decided what to eat! 😄"
  ],
  screenshot_meme: [
    "📱 That's a screenshot! I need a real photo of your food! 📸\n\nSnap a pic of your actual meal! 🍕",
    "💻 Digital content detected! I need IRL food! 😊\n\nSend me a photo of what you're eating! 🥗",
    "🖼️ Is this a meme? A screenshot? Either way, I need real food photos! 😄"
  ],
  empty_packaging: [
    "📦 Empty wrapper detected! Already ate it? 😋\n\nNext time send the photo BEFORE finishing! 📸",
    "🗑️ Looks like you enjoyed that! But I need to see the food to track it! 😊\n\nRemember to photograph before eating! 📱"
  ]
};

// ============================================================================
// DETECTION SCHEMA INTERFACES (TypeScript-style documentation)
// ============================================================================

/**
 * @typedef {Object} EasterEggDetection
 * @property {Object} detections - Boolean flags for what was detected
 * @property {boolean} detections.has_person
 * @property {boolean} detections.has_pet
 * @property {boolean} detections.has_food
 * @property {boolean} detections.has_nutrition_label
 * @property {boolean} detections.has_empty_plate
 * @property {boolean} detections.has_food_packaging
 * @property {boolean} detections.has_non_food_item
 * @property {boolean} detections.is_screenshot
 * @property {boolean} detections.is_shopping_scene
 * @property {boolean} detections.is_celebration
 *
 * @property {Object} confidence - Confidence levels for each detection
 * @property {'high'|'medium'|'low'} confidence.has_person
 * @property {'high'|'medium'|'low'} confidence.has_pet
 * @property {'high'|'medium'|'low'} confidence.has_food
 * @property {'high'|'medium'|'low'} confidence.has_nutrition_label
 * @property {'high'|'medium'|'low'} confidence.has_empty_plate
 * @property {'high'|'medium'|'low'} confidence.has_food_packaging
 * @property {'high'|'medium'|'low'} confidence.has_non_food_item
 * @property {'high'|'medium'|'low'} confidence.is_screenshot
 * @property {'high'|'medium'|'low'} confidence.is_shopping_scene
 * @property {'high'|'medium'|'low'} confidence.is_celebration
 *
 * @property {'high'|'medium'|'low'} overall_confidence
 * @property {boolean} should_attempt_nutrition_extraction
 * @property {boolean} should_trigger_easter_egg
 * @property {string|null} easter_egg_scenario
 * @property {string} scene_description
 * @property {string} decision_reasoning
 *
 * @property {Object} metadata
 * @property {number} metadata.detection_time_ms
 * @property {boolean} metadata.detection_success
 * @property {string} [metadata.detection_error]
 */

// ============================================================================
// CORE DETECTION FUNCTION
// ============================================================================

/**
 * Detect easter egg scenarios with comprehensive safety checks
 * @param {Buffer} imageBuffer - Image data
 * @param {string} mimeType - Image MIME type
 * @returns {Promise<EasterEggDetection>}
 */
async function detectEasterEggScenario(imageBuffer, mimeType) {
  try {
    console.log('[Easter Egg] Starting comprehensive detection...');

    const base64Image = imageBuffer.toString('base64');

    const prompt = `Analyze this image for a nutrition tracking bot and detect ALL applicable scenarios.

CRITICAL INSTRUCTIONS:
1. Be VERY CONSERVATIVE when saying there is NO food
   - If you see ANY food, meals, ingredients, or nutrition labels: has_food = true
   - Only set has_food = false if you are ABSOLUTELY CERTAIN there is no food
   - Consider: plated meals, raw ingredients, packaged food, nutrition labels, food remnants

2. Use "high" confidence ONLY when you are 95%+ certain
   - Use "medium" for 70-95% certainty (most cases should be medium)
   - Use "low" for <70% certainty or any uncertainty
   - When uncertain about food absence, use "medium" or "low"

3. Scene description should be detailed and objective

DETECTION CATEGORIES:
- has_person: Is there a person visible? (face, body, limbs, reflection)
- has_pet: Is there a pet/animal visible?
- has_food: Is there ANY food, meal, ingredients, or edible items?
- has_nutrition_label: Is there a nutrition facts label visible?
- has_empty_plate: Is there an empty plate/bowl (truly empty, not just finished)?
- has_food_packaging: Is there empty food packaging/wrappers?
- has_non_food_item: Are there non-food items that look like food (soap, candles, fake food)?
- is_screenshot: Is this a screenshot of digital content/memes?
- is_shopping_scene: Is this a grocery store aisle or restaurant menu (not prepared food)?
- is_celebration: Is there a birthday cake with candles or celebration scene?

EXAMPLES:
- Person holding burger → has_person=true, has_food=true
- Pet near food bowl → has_pet=true, has_food=true
- Selfie in kitchen → has_person=true, has_food=false (unless food visible)
- Nutrition label screenshot → is_screenshot=true, has_nutrition_label=true
- Birthday cake with candles → is_celebration=true, has_food=true (cake is food!)

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

    const startTime = Date.now();

    // Call Claude Vision API
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: config.claude.model,
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mimeType,
                  data: base64Image
                }
              },
              {
                type: 'text',
                text: prompt
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.claude.apiKey,
          'anthropic-version': '2023-06-01'
        },
        timeout: CONFIDENCE_THRESHOLDS.TIMEOUT.max_detection_time_ms
      }
    );

    const detectionTime = Date.now() - startTime;

    // Extract JSON from response
    const textBlock = response.data.content.find(block => block.type === 'text');
    if (!textBlock || !textBlock.text) {
      throw new Error('No text content in Claude Vision response');
    }

    const claudeText = textBlock.text;
    const jsonMatch = claudeText.match(/```json\n([\s\S]*?)\n```/);

    if (!jsonMatch) {
      throw new Error('No JSON block in detection response');
    }

    const detectionData = JSON.parse(jsonMatch[1]);

    // Build full detection result
    const detection = {
      detections: detectionData.detections,
      confidence: detectionData.confidence,
      overall_confidence: detectionData.overall_confidence,
      scene_description: detectionData.scene_description,
      metadata: {
        detection_time_ms: detectionTime,
        detection_success: true
      }
    };

    // Apply decision logic
    return decideFinalAction(detection);

  } catch (error) {
    console.error('[Easter Egg] Detection failed:', error.message);
    return handleDetectionFailure(error);
  }
}

// ============================================================================
// DECISION LOGIC
// ============================================================================

/**
 * Decide final action based on detection results
 * Applies all safety gates to ensure food is never missed
 * @param {EasterEggDetection} detection
 * @returns {EasterEggDetection} Enhanced with decision flags
 */
function decideFinalAction(detection) {
  // SAFETY GATE 1: Detection failure
  if (!detection.metadata.detection_success) {
    return {
      ...detection,
      should_attempt_nutrition_extraction: true,
      should_trigger_easter_egg: false,
      easter_egg_scenario: null,
      decision_reasoning: 'Detection failed - attempting nutrition extraction for safety'
    };
  }

  // SAFETY GATE 2: Low overall confidence
  if (detection.overall_confidence === 'low') {
    return {
      ...detection,
      should_attempt_nutrition_extraction: true,
      should_trigger_easter_egg: false,
      easter_egg_scenario: null,
      decision_reasoning: 'Low overall confidence - attempting nutrition extraction for safety'
    };
  }

  // SAFETY GATE 3: Nutrition label detected (HIGHEST PRIORITY)
  if (detection.detections.has_nutrition_label &&
      detection.confidence.has_nutrition_label !== 'low') {
    return {
      ...detection,
      should_attempt_nutrition_extraction: true,
      should_trigger_easter_egg: false,
      easter_egg_scenario: null,
      decision_reasoning: 'Nutrition label detected - must extract nutrition data'
    };
  }

  // SAFETY GATE 4: Food detected with medium or high confidence
  if (detection.detections.has_food &&
      detection.confidence.has_food !== 'low') {
    return {
      ...detection,
      should_attempt_nutrition_extraction: true,
      should_trigger_easter_egg: false,
      easter_egg_scenario: null,
      decision_reasoning: 'Food detected - extracting nutrition data'
    };
  }

  // SAFETY GATE 5: Uncertain about food (medium confidence that there's NO food)
  if (detection.confidence.has_food === 'medium' &&
      !detection.detections.has_food) {
    return {
      ...detection,
      should_attempt_nutrition_extraction: true,
      should_trigger_easter_egg: false,
      easter_egg_scenario: null,
      decision_reasoning: 'Uncertain about food absence - attempting extraction for safety'
    };
  }

  // SAFE ZONE: High confidence no food, evaluate easter egg scenarios
  return evaluateEasterEggScenario(detection);
}

/**
 * Evaluate which easter egg scenario applies (if any)
 * Only called after all safety gates pass
 * @param {EasterEggDetection} detection
 * @returns {EasterEggDetection}
 */
function evaluateEasterEggScenario(detection) {
  // Scenario 1: Person without food
  if (detection.detections.has_person &&
      !detection.detections.has_food &&
      detection.confidence.has_person === 'high' &&
      detection.confidence.has_food === 'high') {

    // Additional safety check: no meal context
    if (detection.scene_description.toLowerCase().includes('eating') ||
        detection.scene_description.toLowerCase().includes('meal') ||
        detection.scene_description.toLowerCase().includes('dining')) {
      return {
        ...detection,
        should_attempt_nutrition_extraction: true,
        should_trigger_easter_egg: false,
        easter_egg_scenario: null,
        decision_reasoning: 'Meal context detected despite no visible food - attempting extraction'
      };
    }

    return {
      ...detection,
      should_attempt_nutrition_extraction: false,
      should_trigger_easter_egg: true,
      easter_egg_scenario: 'person_without_food',
      decision_reasoning: 'High confidence: person without food, no meal context'
    };
  }

  // Scenario 2: Pet/animal
  if (detection.detections.has_pet &&
      !detection.detections.has_food &&
      detection.confidence.has_pet === 'high' &&
      detection.confidence.has_food === 'high') {
    return {
      ...detection,
      should_attempt_nutrition_extraction: false,
      should_trigger_easter_egg: true,
      easter_egg_scenario: 'pet',
      decision_reasoning: 'High confidence: pet without food'
    };
  }

  // Scenario 3: Empty plate
  if (detection.detections.has_empty_plate &&
      !detection.detections.has_food &&
      detection.confidence.has_empty_plate === 'high' &&
      detection.confidence.has_food === 'high') {
    return {
      ...detection,
      should_attempt_nutrition_extraction: false,
      should_trigger_easter_egg: true,
      easter_egg_scenario: 'empty_plate',
      decision_reasoning: 'High confidence: empty plate without food'
    };
  }

  // Scenario 4: Non-food item
  if (detection.detections.has_non_food_item &&
      !detection.detections.has_food &&
      detection.confidence.has_non_food_item === 'high' &&
      detection.confidence.has_food === 'high') {
    return {
      ...detection,
      should_attempt_nutrition_extraction: false,
      should_trigger_easter_egg: true,
      easter_egg_scenario: 'non_food_item',
      decision_reasoning: 'High confidence: non-food item (soap, candle, etc.)'
    };
  }

  // Scenario 5: Shopping scene
  if (detection.detections.is_shopping_scene &&
      detection.confidence.is_shopping_scene === 'high') {
    return {
      ...detection,
      should_attempt_nutrition_extraction: false,
      should_trigger_easter_egg: true,
      easter_egg_scenario: 'shopping_scene',
      decision_reasoning: 'High confidence: shopping scene (grocery aisle, restaurant menu)'
    };
  }

  // Scenario 6: Screenshot/meme
  if (detection.detections.is_screenshot &&
      detection.confidence.is_screenshot === 'high') {
    return {
      ...detection,
      should_attempt_nutrition_extraction: false,
      should_trigger_easter_egg: true,
      easter_egg_scenario: 'screenshot_meme',
      decision_reasoning: 'High confidence: screenshot or digital content'
    };
  }

  // Scenario 7: Celebration (COMPANION easter egg - doesn't block extraction)
  if (detection.detections.is_celebration &&
      detection.confidence.is_celebration === 'high') {
    return {
      ...detection,
      should_attempt_nutrition_extraction: true, // SAFETY: cake is food!
      should_trigger_easter_egg: true,
      easter_egg_scenario: 'celebration',
      decision_reasoning: 'High confidence: celebration with cake (extracting nutrition too)'
    };
  }

  // Scenario 8: Empty food packaging
  if (detection.detections.has_food_packaging &&
      !detection.detections.has_food &&
      detection.confidence.has_food_packaging === 'high' &&
      detection.confidence.has_food === 'high') {
    return {
      ...detection,
      should_attempt_nutrition_extraction: false,
      should_trigger_easter_egg: true,
      easter_egg_scenario: 'empty_packaging',
      decision_reasoning: 'High confidence: empty food packaging'
    };
  }

  // Scenario 9: Midnight munchies (COMPANION easter egg - time-based)
  const hour = new Date().getHours();
  const isMidnightWindow = (hour >= 22 || hour < 4);
  if (isMidnightWindow && detection.detections.has_food) {
    return {
      ...detection,
      should_attempt_nutrition_extraction: true, // ALWAYS extract
      should_trigger_easter_egg: true,
      easter_egg_scenario: 'midnight_munchies',
      decision_reasoning: 'Midnight window (10pm-4am) with food - companion easter egg'
    };
  }

  // DEFAULT: No high-confidence easter egg scenario matched
  // ALWAYS attempt nutrition extraction for safety
  return {
    ...detection,
    should_attempt_nutrition_extraction: true,
    should_trigger_easter_egg: false,
    easter_egg_scenario: null,
    decision_reasoning: 'No high-confidence easter egg scenario - attempting nutrition extraction for safety'
  };
}

// ============================================================================
// TIMEOUT HANDLING
// ============================================================================

/**
 * Run detection with timeout fallback
 * @param {Buffer} imageBuffer
 * @param {string} mimeType
 * @param {number} timeoutMs
 * @returns {Promise<EasterEggDetection>}
 */
async function detectWithTimeout(imageBuffer, mimeType, timeoutMs) {
  try {
    const detectionPromise = detectEasterEggScenario(imageBuffer, mimeType);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Detection timeout')), timeoutMs);
    });

    return await Promise.race([detectionPromise, timeoutPromise]);

  } catch (error) {
    console.warn(`[Easter Egg] Detection failed or timed out: ${error.message}`);
    return handleDetectionFailure(error);
  }
}

/**
 * Handle detection failure with safe fallback
 * @param {Error} error
 * @returns {EasterEggDetection}
 */
function handleDetectionFailure(error) {
  return {
    detections: {
      has_person: false,
      has_pet: false,
      has_food: false,
      has_nutrition_label: false,
      has_empty_plate: false,
      has_food_packaging: false,
      has_non_food_item: false,
      is_screenshot: false,
      is_shopping_scene: false,
      is_celebration: false
    },
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

// ============================================================================
// MAIN HANDLER FUNCTION
// ============================================================================

/**
 * Main entry point for handling images with easter egg safety
 * This replaces the current photo handler logic in webhook.js
 *
 * @param {Buffer} imageBuffer
 * @param {string} mimeType
 * @param {number} userId
 * @param {Object} ctx - Telegraf context
 * @returns {Promise<void>}
 */
async function handleImageWithEasterEggSafety(imageBuffer, mimeType, userId, ctx) {
  const startTime = Date.now();
  let processingMsg = null;

  try {
    // STEP 1: Send processing message
    processingMsg = await ctx.reply('📸 Processing screenshot...');

    // STEP 2: Run easter egg detection with timeout
    console.log('[Easter Egg] Starting detection...');
    const detection = await detectWithTimeout(
      imageBuffer,
      mimeType,
      CONFIDENCE_THRESHOLDS.TIMEOUT.max_detection_time_ms
    );

    detection.metadata.detection_time_ms = Date.now() - startTime;

    // STEP 3: Log detection result for debugging
    logEasterEggDecision(detection, userId);

    // STEP 4: Handle based on decision
    if (detection.should_trigger_easter_egg && !detection.should_attempt_nutrition_extraction) {
      // Easter egg ONLY - no nutrition extraction
      return await handleEasterEggOnly(ctx, processingMsg, detection);
    }

    if (detection.should_trigger_easter_egg && detection.should_attempt_nutrition_extraction) {
      // BOTH easter egg AND nutrition extraction (companion easter eggs)
      return await handleEasterEggWithNutrition(
        ctx,
        processingMsg,
        imageBuffer,
        mimeType,
        userId,
        detection
      );
    }

    // Nutrition extraction ONLY (default safe path)
    return await handleNutritionExtractionOnly(
      ctx,
      processingMsg,
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
      processingMsg || await ctx.reply('📸 Processing...'),
      imageBuffer,
      mimeType,
      userId
    );
  }
}

/**
 * Handle easter egg only (no nutrition extraction)
 */
async function handleEasterEggOnly(ctx, processingMsg, detection) {
  const messages = EASTER_EGG_MESSAGES[detection.easter_egg_scenario];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  await ctx.telegram.editMessageText(
    ctx.chat.id,
    processingMsg.message_id,
    null,
    randomMessage
  );

  console.log(`[Easter Egg] Triggered: ${detection.easter_egg_scenario}`);
}

/**
 * Handle easter egg WITH nutrition extraction (companion easter eggs)
 */
async function handleEasterEggWithNutrition(ctx, processingMsg, imageBuffer, mimeType, userId, detection) {
  // First extract nutrition
  await ctx.telegram.editMessageText(
    ctx.chat.id,
    processingMsg.message_id,
    null,
    '🤖 Analyzing image with AI...'
  );

  const result = await claudeIntegration.processImage(imageBuffer, mimeType);

  if (!result.success) {
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      processingMsg.message_id,
      null,
      `❌ Could not extract nutrition data from image.\n\n${result.message || 'Please try with a clearer photo.'}`
    );
    return;
  }

  // Prepare nutrition data
  const nutritionData = prepareNutritionData(result, 'Extracted from screenshot');

  // Log to GitHub
  await ctx.telegram.editMessageText(
    ctx.chat.id,
    processingMsg.message_id,
    null,
    '💾 Logging to database...'
  );

  const userName = [ctx.from.first_name, ctx.from.last_name]
    .filter(Boolean)
    .join(' ') || ctx.from.username || `User ${userId}`;

  await githubIntegration.appendLogEntry(nutritionData, null, userId, userName);

  // Get totals and format success message
  const currentTotals = await githubIntegration.getTodaysTotals(null, userId);
  const nutrition = nutritionData.nutrition;
  const targets = claudeIntegration.getTargets('rest');

  // Add easter egg prefix to success message
  const easterEggPrefix = EASTER_EGG_MESSAGES[detection.easter_egg_scenario][
    Math.floor(Math.random() * EASTER_EGG_MESSAGES[detection.easter_egg_scenario].length)
  ];

  const successMessage = `${easterEggPrefix}✅ **Logged: ${nutritionData.name}**

📊 **This meal:**
• ${nutrition.energy_kcal} kcal
• ${nutrition.protein_g}g protein
• ${nutrition.fat_g}g fat
• ${nutrition.carbs_total_g}g carbs

📈 **Today's totals:**
• ${currentTotals.energy_kcal}/${targets.energy_kcal} kcal
• ${currentTotals.protein_g}/${targets.protein_g}g protein

🤖 Extracted using Claude Vision AI`;

  await ctx.telegram.editMessageText(
    ctx.chat.id,
    processingMsg.message_id,
    null,
    successMessage
  );

  console.log(`[Easter Egg] Triggered companion: ${detection.easter_egg_scenario} + nutrition extraction`);
}

/**
 * Handle nutrition extraction only (no easter egg)
 * This is the safe default path - same as current implementation
 */
async function handleNutritionExtractionOnly(ctx, processingMsg, imageBuffer, mimeType, userId) {
  // This is the existing nutrition extraction flow from webhook.js
  // (lines 858-952 in the current code)

  await ctx.telegram.editMessageText(
    ctx.chat.id,
    processingMsg.message_id,
    null,
    '🤖 Analyzing image with AI...'
  );

  const result = await claudeIntegration.processImage(imageBuffer, mimeType);

  if (!result.success) {
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      processingMsg.message_id,
      null,
      `❌ Could not extract nutrition data from image.\n\n${result.message || 'Please try with a clearer photo.'}`
    );
    return;
  }

  const nutritionData = prepareNutritionData(result, 'Extracted from screenshot');

  await ctx.telegram.editMessageText(
    ctx.chat.id,
    processingMsg.message_id,
    null,
    '💾 Logging to database...'
  );

  const userName = [ctx.from.first_name, ctx.from.last_name]
    .filter(Boolean)
    .join(' ') || ctx.from.username || `User ${userId}`;

  const currentTotals = await githubIntegration.getTodaysTotals(null, userId);
  await githubIntegration.appendLogEntry(nutritionData, null, userId, userName);

  const nutrition = nutritionData.nutrition;
  const targets = claudeIntegration.getTargets('rest');

  const successMessage = `✅ **Logged from screenshot: ${nutritionData.name}**

📊 **This meal:**
• ${nutrition.energy_kcal} kcal
• ${nutrition.protein_g}g protein
• ${nutrition.fat_g}g fat
• ${nutrition.carbs_total_g}g carbs

📈 **Today's totals:**
• ${currentTotals.energy_kcal}/${targets.energy_kcal} kcal
• ${currentTotals.protein_g}/${targets.protein_g}g protein

🤖 Extracted using Claude Vision AI`;

  await ctx.telegram.editMessageText(
    ctx.chat.id,
    processingMsg.message_id,
    null,
    successMessage
  );

  console.log('[Easter Egg] Nutrition extraction only (no easter egg)');
}

// ============================================================================
// LOGGING AND MONITORING
// ============================================================================

/**
 * Log easter egg decision for debugging and monitoring
 */
function logEasterEggDecision(detection, userId) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    user_id: userId,
    detection: {
      scenario: detection.easter_egg_scenario,
      detections: detection.detections,
      confidence: detection.confidence,
      overall_confidence: detection.overall_confidence,
      detection_time_ms: detection.metadata.detection_time_ms,
      detection_success: detection.metadata.detection_success
    },
    decision: {
      should_attempt_nutrition_extraction: detection.should_attempt_nutrition_extraction,
      should_trigger_easter_egg: detection.should_trigger_easter_egg,
      reasoning: detection.decision_reasoning
    }
  };

  console.log('[Easter Egg Decision]', JSON.stringify(logEntry, null, 2));
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  handleImageWithEasterEggSafety,
  detectEasterEggScenario,
  detectWithTimeout,
  CONFIDENCE_THRESHOLDS,
  EASTER_EGG_MESSAGES
};
