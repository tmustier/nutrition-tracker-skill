/**
 * Easter Egg Configuration System
 *
 * Centralized configuration for all easter egg types in the nutrition tracking bot.
 * This file makes it easy to:
 * - Add new easter egg types without code changes
 * - Enable/disable specific easter eggs
 * - Change messages and behavior
 * - Configure cooldowns and thresholds
 * - Maintain consistency across the codebase
 *
 * HOW TO ADD A NEW EASTER EGG:
 * 1. Add a new entry to EASTER_EGG_TYPES below
 * 2. Define messages in EASTER_EGG_MESSAGES
 * 3. Set cooldown in cooldownDuration (milliseconds)
 * 4. Configure detection criteria in detectionCriteria
 * 5. Set enabled: true to activate
 *
 * That's it! No code changes needed in webhook.js or other files.
 */

// ============================================================================
// GLOBAL CONFIGURATION
// ============================================================================

const GLOBAL_CONFIG = {
  // Master switch: Set to false to disable ALL easter eggs
  enabled: process.env.EASTER_EGGS_ENABLED !== 'false', // Default: true (disable with env var)

  // Default cooldown for new easter eggs (7 days)
  defaultCooldownMs: 7 * 24 * 60 * 60 * 1000,

  // Default confidence threshold for triggering easter eggs
  defaultMinConfidence: 'high',

  // Whether to log easter egg triggers (useful for analytics)
  logTriggers: process.env.EASTER_EGG_LOG_TRIGGERS !== 'false', // Default: true

  // Maximum number of users to track cooldowns for (memory management)
  maxCooldownEntries: parseInt(process.env.MAX_COOLDOWN_ENTRIES) || 1000,
};

// ============================================================================
// EASTER EGG TYPE DEFINITIONS
// ============================================================================

/**
 * Master registry of all easter egg types
 *
 * Each easter egg has:
 * - id: Unique identifier (used in cooldown tracking)
 * - displayName: Human-readable name
 * - description: What triggers this easter egg
 * - enabled: Whether this easter egg is active
 * - cooldownDuration: Time in milliseconds before can trigger again
 * - priority: Higher priority easter eggs check first (1-10, higher = first)
 * - blocksNutritionExtraction: If true, don't extract nutrition when triggered
 * - detectionCriteria: Conditions that must be met to trigger
 * - messages: Array of possible messages (randomly selected)
 * - metadata: Additional configuration for special behavior
 */
const EASTER_EGG_TYPES = {
  // ============================================================================
  // BLOCKING EASTER EGGS (Prevent nutrition extraction)
  // These trigger when there's definitely NO food to extract
  // ============================================================================

  person_without_food: {
    id: 'person_without_food',
    displayName: 'Person Photo (No Food)',
    description: 'User sent a photo of themselves without any food',

    // Configuration
    enabled: true, // Set to false to disable this easter egg
    cooldownDuration: parseInt(process.env.COOLDOWN_PERSON_WITHOUT_FOOD) || 7 * 24 * 60 * 60 * 1000, // 7 days
    priority: 8, // High priority - common scenario
    blocksNutritionExtraction: true, // Don't try to extract nutrition

    // Detection criteria
    detectionCriteria: {
      scene_type: 'selfie', // Match scene_type from Claude Vision
      has_person: true,
      has_food: false,
      min_confidence: 'high', // Overall scene confidence
    },

    // Messages (randomly selected)
    messages: [
      "👀 Looks like an absolute snack, but I'm not sure we have nutrition data for that! 😄\n\nMaybe try sending a photo of some actual food? 🍕",
      "🙋 I see someone looking great, but where's the food? 😊\n\nI'm here to track meals, not selfies! Send me something delicious instead! 🥗",
      "👤 Well hello there! You look fantastic, but I need actual food to analyze! 😅\n\nTry sending a meal photo or nutrition label! 🍽️",
      "😄 That's definitely a person and not a pizza! While you're clearly a snack, I need actual food to track nutrition! 🍔",
      "🤳 Nice photo! But I'm a nutrition bot, not a photographer! 📸\n\nSend me a meal or nutrition label and I'll help you track it! 🥙"
    ],

    // Additional metadata
    metadata: {
      category: 'wrong_content',
      tags: ['person', 'selfie', 'no_food'],
    }
  },

  pet: {
    id: 'pet',
    displayName: 'Pet Photo',
    description: 'User sent a photo of their pet',

    enabled: true,
    cooldownDuration: parseInt(process.env.COOLDOWN_PET) || 3 * 24 * 60 * 60 * 1000, // 3 days
    priority: 7,
    blocksNutritionExtraction: true,

    detectionCriteria: {
      scene_type: 'pet_photo', // Match scene_type from Claude Vision
      has_pet: true,
      has_food: false,
      min_confidence: 'high', // Overall scene confidence
    },

    messages: [
      "🐾 Aww, what a cute companion! But I need actual food to track nutrition! 😊\n\nSend me a meal photo or nutrition label! 🍽️",
      "🐕 Adorable! But I'm a nutrition tracker, not a pet tracker! 🐈\n\nShow me what YOU'RE eating! 🥗",
      "🐾 Such a cutie! Though I'm pretty sure we don't have nutrition data for pets! 😄\n\nSend me a photo of your meal instead! 🍕"
    ],

    metadata: {
      category: 'wrong_content',
      tags: ['pet', 'animal', 'no_food'],
    }
  },

  empty_plate: {
    id: 'empty_plate',
    displayName: 'Empty Plate',
    description: 'User sent photo of empty plate/bowl',

    enabled: true,
    cooldownDuration: parseInt(process.env.COOLDOWN_EMPTY_PLATE) || 2 * 24 * 60 * 60 * 1000, // 2 days
    priority: 6,
    blocksNutritionExtraction: true,

    detectionCriteria: {
      scene_type: 'empty_plate', // Match scene_type from Claude Vision
      has_food: false,
      min_confidence: 'high', // Overall scene confidence
    },

    messages: [
      "🍽️ Looks like someone enjoyed their meal! All done? 😊\n\nNext time, send the photo BEFORE you finish! 😄",
      "🍴 Clean plate club! But I need to see the food to track it! 😅\n\nRemember to snap a photo before digging in! 📸",
      "🥘 That plate is looking pretty empty! 👀\n\nSend me a photo with actual food on it next time! 🍕"
    ],

    metadata: {
      category: 'timing',
      tags: ['empty_plate', 'too_late', 'no_food'],
    }
  },

  non_food_item: {
    id: 'non_food_item',
    displayName: 'Non-Food Item',
    description: 'User sent photo of non-food item (soap, candle, etc.)',

    enabled: true,
    cooldownDuration: parseInt(process.env.COOLDOWN_NON_FOOD_ITEM) || 7 * 24 * 60 * 60 * 1000, // 7 days
    priority: 5,
    blocksNutritionExtraction: true,

    detectionCriteria: {
      scene_type: 'fake_food', // Match scene_type from Claude Vision
      is_fake_food: true,
      has_food: false,
      min_confidence: 'high', // Overall scene confidence
    },

    messages: [
      "🧼 Hmm, that looks delicious but I'm pretty sure it's not edible! 😅\n\nSend me actual food to track! 🍕",
      "🕯️ Is that soap? A candle? Either way, probably not nutritious! 😄\n\nShow me real food! 🥗",
      "🎨 That's a work of art, but not the edible kind! 🖼️\n\nSend me something you actually ate! 🍽️"
    ],

    metadata: {
      category: 'wrong_content',
      tags: ['non_food', 'soap', 'candle', 'fake_food'],
    }
  },

  shopping_scene: {
    id: 'shopping_scene',
    displayName: 'Shopping Scene',
    description: 'User sent photo of grocery store or restaurant menu',

    enabled: true,
    cooldownDuration: parseInt(process.env.COOLDOWN_SHOPPING_SCENE) || 3 * 24 * 60 * 60 * 1000, // 3 days
    priority: 4,
    blocksNutritionExtraction: true,

    detectionCriteria: {
      scene_type: 'shopping', // Match scene_type from Claude Vision
      is_shopping_scene: true,
      min_confidence: 'high', // Overall scene confidence
    },

    messages: [
      "🛒 Shopping for groceries? Planning a meal? 🤔\n\nSend me a photo once you've actually prepared and eaten it! 🍳",
      "📋 That's a menu/store shelf! I need to see what you actually ate! 😊\n\nSnap a photo of your meal! 📸",
      "🏪 Browsing options I see! Come back when you've decided what to eat! 😄"
    ],

    metadata: {
      category: 'timing',
      tags: ['shopping', 'menu', 'not_prepared'],
    }
  },

  screenshot_meme: {
    id: 'screenshot_meme',
    displayName: 'Screenshot/Meme',
    description: 'User sent a screenshot or meme instead of real photo',

    enabled: true,
    cooldownDuration: parseInt(process.env.COOLDOWN_SCREENSHOT) || 2 * 24 * 60 * 60 * 1000, // 2 days
    priority: 3,
    blocksNutritionExtraction: true,

    detectionCriteria: {
      scene_type: 'screenshot', // Match scene_type from Claude Vision
      is_digital_content: true,
      min_confidence: 'high', // Overall scene confidence
    },

    messages: [
      "📱 That's a screenshot! I need a real photo of your food! 📸\n\nSnap a pic of your actual meal! 🍕",
      "💻 Digital content detected! I need IRL food! 😊\n\nSend me a photo of what you're eating! 🥗",
      "🖼️ Is this a meme? A screenshot? Either way, I need real food photos! 😄"
    ],

    metadata: {
      category: 'wrong_format',
      tags: ['screenshot', 'meme', 'digital'],
    }
  },

  empty_packaging: {
    id: 'empty_packaging',
    displayName: 'Empty Packaging',
    description: 'User sent photo of empty food wrapper/package',

    enabled: true,
    cooldownDuration: parseInt(process.env.COOLDOWN_EMPTY_PACKAGING) || 2 * 24 * 60 * 60 * 1000, // 2 days
    priority: 2,
    blocksNutritionExtraction: false, // Allow extraction when nutrition label visible

    detectionCriteria: {
      scene_type: 'empty_packaging', // Match scene_type from Claude Vision
      is_empty_packaging: true,
      has_food: false,
      min_confidence: 'high', // Overall scene confidence
    },

    messages: [
      "📦 Empty wrapper detected! Already ate it? 😋\n\nNext time send the photo BEFORE finishing! 📸",
      "🗑️ Looks like you enjoyed that! But I need to see the food to track it! 😊\n\nRemember to photograph before eating! 📱"
    ],

    metadata: {
      category: 'timing',
      tags: ['empty_packaging', 'wrapper', 'too_late'],
    }
  },

  // ============================================================================
  // COMPANION EASTER EGGS (Don't block nutrition extraction)
  // These add fun messages but still extract nutrition data
  // ============================================================================

  midnight_munchies: {
    id: 'midnight_munchies',
    displayName: 'Midnight Munchies',
    description: 'User logged food between 10pm-4am',

    enabled: true,
    cooldownDuration: parseInt(process.env.COOLDOWN_MIDNIGHT_MUNCHIES) || 12 * 60 * 60 * 1000, // 12 hours
    priority: 9, // Check early, but doesn't block extraction
    blocksNutritionExtraction: false, // COMPANION: Still extract nutrition

    detectionCriteria: {
      has_food: true,
      time_window: { start: 22, end: 4 }, // 10pm - 4am
    },

    messages: [
      "🌙 Midnight munchies detected! Someone's burning the midnight oil! 😴\n\n",
      "🕐 Late night snacking, I see! 🌃\n\n",
      "🌜 Fueling the night owl lifestyle! 🦉\n\n"
    ],

    metadata: {
      category: 'fun',
      tags: ['time_based', 'midnight', 'late_night'],
      isPrefixMessage: true, // Prepends to nutrition info
    }
  },

  celebration: {
    id: 'celebration',
    displayName: 'Celebration',
    description: 'User sent photo of birthday cake or celebration',

    enabled: true,
    cooldownDuration: parseInt(process.env.COOLDOWN_CELEBRATION) || 30 * 24 * 60 * 60 * 1000, // 30 days
    priority: 10, // Highest priority for special occasions
    blocksNutritionExtraction: false, // COMPANION: Cake is food!

    detectionCriteria: {
      scene_type: 'celebration', // Match scene_type from Claude Vision
      is_celebration: true,
      has_food: true, // Celebration food is still food!
      min_confidence: 'high', // Overall scene confidence
    },

    messages: [
      "🎉 Happy celebration! 🎂 That cake looks delicious!\n\n",
      "🎊 Birthday vibes! 🎁 Make a wish and blow out those candles!\n\n",
      "🥳 Party time! 🎈 Enjoy the celebration!\n\n"
    ],

    metadata: {
      category: 'fun',
      tags: ['celebration', 'birthday', 'special_occasion'],
      isPrefixMessage: true, // Prepends to nutrition info
    }
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all enabled easter egg types sorted by priority
 * @returns {Array} Sorted array of easter egg configurations
 */
function getEnabledEasterEggs() {
  if (!GLOBAL_CONFIG.enabled) {
    return [];
  }

  return Object.values(EASTER_EGG_TYPES)
    .filter(egg => egg.enabled)
    .sort((a, b) => b.priority - a.priority); // Higher priority first
}

/**
 * Get easter egg configuration by ID
 * @param {string} easterEggId - Easter egg identifier
 * @returns {Object|null} Easter egg configuration or null if not found
 */
function getEasterEggById(easterEggId) {
  return EASTER_EGG_TYPES[easterEggId] || null;
}

/**
 * Get random message for an easter egg type
 * @param {string} easterEggId - Easter egg identifier
 * @returns {string} Random message from the easter egg's message array
 */
function getRandomMessage(easterEggId) {
  const easterEgg = getEasterEggById(easterEggId);
  if (!easterEgg || !easterEgg.messages || easterEgg.messages.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * easterEgg.messages.length);
  return easterEgg.messages[randomIndex];
}

/**
 * Check if easter egg blocks nutrition extraction
 * @param {string} easterEggId - Easter egg identifier
 * @returns {boolean} True if this easter egg prevents nutrition extraction
 */
function blocksNutritionExtraction(easterEggId) {
  const easterEgg = getEasterEggById(easterEggId);
  return easterEgg ? easterEgg.blocksNutritionExtraction : false;
}

/**
 * Get cooldown duration for an easter egg type
 * @param {string} easterEggId - Easter egg identifier
 * @returns {number} Cooldown duration in milliseconds
 */
function getCooldownDuration(easterEggId) {
  const easterEgg = getEasterEggById(easterEggId);
  return easterEgg ? easterEgg.cooldownDuration : GLOBAL_CONFIG.defaultCooldownMs;
}

/**
 * Get all cooldown durations (for cooldown manager integration)
 * @returns {Object} Map of easter egg IDs to cooldown durations
 */
function getAllCooldownDurations() {
  const durations = {};
  for (const [id, config] of Object.entries(EASTER_EGG_TYPES)) {
    durations[id] = config.cooldownDuration;
  }
  return durations;
}

/**
 * Check if global easter eggs are enabled
 * @returns {boolean} True if easter eggs are globally enabled
 */
function isGloballyEnabled() {
  return GLOBAL_CONFIG.enabled;
}

/**
 * Get easter egg statistics (for monitoring/admin)
 * @returns {Object} Statistics about configured easter eggs
 */
function getStats() {
  const allEggs = Object.values(EASTER_EGG_TYPES);
  const enabled = allEggs.filter(egg => egg.enabled);
  const blocking = enabled.filter(egg => egg.blocksNutritionExtraction);
  const companion = enabled.filter(egg => !egg.blocksNutritionExtraction);

  return {
    total: allEggs.length,
    enabled: enabled.length,
    disabled: allEggs.length - enabled.length,
    blocking: blocking.length,
    companion: companion.length,
    globalEnabled: GLOBAL_CONFIG.enabled,
    categories: {
      wrong_content: allEggs.filter(egg => egg.metadata.category === 'wrong_content').length,
      timing: allEggs.filter(egg => egg.metadata.category === 'timing').length,
      wrong_format: allEggs.filter(egg => egg.metadata.category === 'wrong_format').length,
      fun: allEggs.filter(egg => egg.metadata.category === 'fun').length,
    }
  };
}

/**
 * Get all scene types that should trigger easter eggs
 * Extracts scene types from enabled easter eggs with blocking behavior
 *
 * @returns {Array<string>} Array of scene type strings
 */
function getBlockingSceneTypes() {
  if (!GLOBAL_CONFIG.enabled) {
    return [];
  }

  const sceneTypes = [];

  Object.values(EASTER_EGG_TYPES)
    .filter(egg => egg.enabled && egg.blocksNutritionExtraction)
    .forEach(egg => {
      const sceneType = egg.detectionCriteria?.scene_type;
      if (sceneType) {
        // Handle both string and array scene types
        if (Array.isArray(sceneType)) {
          sceneTypes.push(...sceneType);
        } else if (typeof sceneType === 'string') {
          sceneTypes.push(sceneType);
        }
      }
    });

  // Return unique scene types
  return [...new Set(sceneTypes)];
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Configuration objects
  GLOBAL_CONFIG,
  EASTER_EGG_TYPES,

  // Helper functions
  getEnabledEasterEggs,
  getEasterEggById,
  getRandomMessage,
  blocksNutritionExtraction,
  getCooldownDuration,
  getAllCooldownDurations,
  isGloballyEnabled,
  getStats,
  getBlockingSceneTypes,
};
