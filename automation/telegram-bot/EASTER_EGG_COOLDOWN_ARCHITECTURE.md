# Easter Egg Cooldown System - Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Telegram Bot (webhook.js)                        │
│                                                                           │
│  User sends photo                                                        │
│       │                                                                   │
│       ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │  Image Analysis (claude-integration.js)                      │       │
│  │  - detectPersonInImage()                                     │       │
│  │  - Returns: has_person, has_food, has_pet, etc.             │       │
│  └────────────────────────────┬────────────────────────────────┘       │
│                                │                                          │
│                                ▼                                          │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │  Easter Egg Detection & Cooldown Check                       │       │
│  │                                                               │       │
│  │  1. Determine easter egg type                                │       │
│  │  2. cooldownManager.checkEasterEggCooldown(userId, type)    │       │
│  │     ├─ On cooldown? → Continue to normal processing         │       │
│  │     └─ Not on cooldown? → Show easter egg message           │       │
│  │  3. cooldownManager.recordEasterEggTrigger(userId, type)    │       │
│  └─────────────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│          EasterEggCooldownManager (easter-egg-cooldown-manager.js)      │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │  Data Structures                                              │      │
│  │                                                                │      │
│  │  easterEggCooldowns: Map<userId, Map<type, timestamp>>       │      │
│  │  ┌────────────────────────────────────────────────┐          │      │
│  │  │ "123456" → Map {                                │          │      │
│  │  │   "person_without_food" → 1699564800000        │          │      │
│  │  │   "pet" → 1699478400000                        │          │      │
│  │  │ }                                               │          │      │
│  │  └────────────────────────────────────────────────┘          │      │
│  │                                                                │      │
│  │  cooldownLastAccess: Map<userId, timestamp>                  │      │
│  │  ┌────────────────────────────────────────────────┐          │      │
│  │  │ "123456" → 1699564800000                       │          │      │
│  │  └────────────────────────────────────────────────┘          │      │
│  │                                                                │      │
│  │  cooldownDurations: Object                                    │      │
│  │  ┌────────────────────────────────────────────────┐          │      │
│  │  │ person_without_food: 7 days                    │          │      │
│  │  │ pet: 3 days                                    │          │      │
│  │  │ empty_plate: 2 days                            │          │      │
│  │  │ midnight_munchies: 12 hours                    │          │      │
│  │  │ celebration: 30 days                           │          │      │
│  │  │ ...                                            │          │      │
│  │  └────────────────────────────────────────────────┘          │      │
│  └──────────────────────────────────────────────────────────────┘      │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │  Core Methods                                                 │      │
│  │                                                                │      │
│  │  ✓ checkEasterEggCooldown(userId, type)                     │      │
│  │    → { onCooldown, remainingMs, lastTriggered, nextAvailable}│      │
│  │                                                                │      │
│  │  ✓ recordEasterEggTrigger(userId, type)                      │      │
│  │    → Records timestamp, updates LRU, handles eviction        │      │
│  │                                                                │      │
│  │  ✓ getCooldownDuration(type)                                 │      │
│  │    → Returns cooldown duration in milliseconds               │      │
│  └──────────────────────────────────────────────────────────────┘      │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │  Background Processes (setInterval)                           │      │
│  │                                                                │      │
│  │  Every 5 minutes:                                             │      │
│  │  ├─ cleanupExpiredCooldowns()                                │      │
│  │  │  └─ Remove expired entries, cleanup empty users           │      │
│  │  │                                                             │      │
│  │  On limit reached:                                            │      │
│  │  └─ evictLRUCooldowns()                                       │      │
│  │     └─ Remove least recently used entry                       │      │
│  └──────────────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────────┘
```

## Data Flow: Easter Egg Trigger Scenario

### Scenario 1: First Time Triggering Easter Egg

```
User sends selfie
      │
      ▼
┌──────────────────────────────────────────────────────┐
│ Claude Vision detects: has_person=true, has_food=false│
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│ checkEasterEggCooldown(123456, 'person_without_food')│
│                                                       │
│ Returns: { onCooldown: false, ... }                 │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│ Show easter egg message:                             │
│ "👀 Looks like an absolute snack..."                │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│ recordEasterEggTrigger(123456, 'person_without_food')│
│                                                       │
│ Stores: { 123456 → { person_without_food → NOW } }  │
│ Cooldown active for 7 days                           │
└──────────────────────────────────────────────────────┘
```

### Scenario 2: Triggering Easter Egg While On Cooldown

```
User sends another selfie (1 day later)
      │
      ▼
┌──────────────────────────────────────────────────────┐
│ Claude Vision detects: has_person=true, has_food=false│
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│ checkEasterEggCooldown(123456, 'person_without_food')│
│                                                       │
│ Returns: { onCooldown: true, remainingMs: 518400000 }│
│         (6 days remaining)                            │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│ Skip easter egg, continue with normal processing     │
│ Process image as regular food photo                  │
│ Analyze nutrition, log to GitHub, send response      │
└──────────────────────────────────────────────────────┘
```

### Scenario 3: After Cooldown Expires

```
User sends selfie (8 days later)
      │
      ▼
┌──────────────────────────────────────────────────────┐
│ Claude Vision detects: has_person=true, has_food=false│
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│ checkEasterEggCooldown(123456, 'person_without_food')│
│                                                       │
│ Returns: { onCooldown: false, remainingMs: 0 }      │
│ (Cooldown expired)                                   │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│ Show easter egg message again (surprise renewed!)    │
│ "🙋 I see someone looking great..."                 │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│ recordEasterEggTrigger(123456, 'person_without_food')│
│                                                       │
│ Updates: { 123456 → { person_without_food → NOW } } │
│ New 7-day cooldown starts                            │
└──────────────────────────────────────────────────────┘
```

## Memory Management Flow

### LRU Eviction Process

```
recordEasterEggTrigger(999999, 'person_without_food') called
      │
      ▼
┌──────────────────────────────────────────────────────┐
│ Check: easterEggCooldowns.size >= maxCooldownEntries│
│ (Currently: 1000 >= 1000)                            │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼  YES
┌──────────────────────────────────────────────────────┐
│ evictLRUCooldowns()                                  │
│                                                       │
│ 1. Scan cooldownLastAccess map                       │
│ 2. Find userId with oldest timestamp                 │
│    (User 111111: last access 7 days ago)            │
│ 3. Delete:                                            │
│    - easterEggCooldowns.delete('111111')            │
│    - cooldownLastAccess.delete('111111')            │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│ Now: easterEggCooldowns.size = 999                   │
│ Space available for new user                          │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│ Record new user's cooldown                           │
│ easterEggCooldowns.set('999999', ...)                │
│ cooldownLastAccess.set('999999', NOW)                │
└──────────────────────────────────────────────────────┘
```

### Automatic Cleanup Process

```
Every 5 minutes (setInterval)
      │
      ▼
┌──────────────────────────────────────────────────────┐
│ cleanupExpiredCooldowns()                            │
│                                                       │
│ For each user in easterEggCooldowns:                 │
│   For each (type, timestamp) in user's cooldowns:    │
│     If NOW > timestamp + duration:                    │
│       Delete expired cooldown                         │
│                                                       │
│   If user has no cooldowns left:                      │
│     Delete user from easterEggCooldowns              │
│     Delete user from cooldownLastAccess              │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│ Log: "Cleaned up N expired cooldowns for M users"   │
└──────────────────────────────────────────────────────┘
```

## Easter Egg Types & Cooldown Matrix

```
┌────────────────────┬──────────────┬────────────────────────────────┐
│ Easter Egg Type    │ Cooldown     │ Trigger Condition              │
├────────────────────┼──────────────┼────────────────────────────────┤
│ person_without_food│ 7 days       │ has_person && !has_food        │
│ pet                │ 3 days       │ has_pet && !has_food           │
│ empty_plate        │ 2 days       │ is_empty_plate                 │
│ midnight_munchies  │ 12 hours     │ timestamp 12am-4am + food      │
│ celebration        │ 30 days      │ is_celebration (party, cake)   │
│ non_food_item      │ 7 days       │ is_non_food (car, building)    │
│ shopping_scene     │ 3 days       │ is_shopping (grocery store)    │
│ screenshot         │ 2 days       │ is_screenshot (phone UI)       │
│ empty_packaging    │ 2 days       │ is_empty_packaging (wrapper)   │
└────────────────────┴──────────────┴────────────────────────────────┘

Usage Pattern Analysis:
├─ Most Common: person_without_food (selfies) → Longest cooldown (7d)
├─ Common: empty_plate, screenshot → Moderate cooldown (2d)
├─ Occasional: pet, shopping_scene → Moderate cooldown (3d)
├─ Time-specific: midnight_munchies → Short cooldown (12h)
└─ Rare: celebration → Longest cooldown (30d)
```

## Performance Characteristics

### Time Complexity

```
┌──────────────────────────────┬──────────────┬─────────────────┐
│ Operation                     │ Complexity   │ Typical Time    │
├──────────────────────────────┼──────────────┼─────────────────┤
│ checkEasterEggCooldown()     │ O(1)         │ ~0.1ms          │
│ recordEasterEggTrigger()     │ O(1)*        │ ~0.1ms          │
│ getCooldownDuration()        │ O(1)         │ <0.01ms         │
│ clearUserCooldowns()         │ O(C)         │ ~0.05ms         │
│ getUserCooldowns()           │ O(C)         │ ~0.1ms          │
│ cleanupExpiredCooldowns()    │ O(U × C)     │ ~20ms           │
│ evictLRUCooldowns()          │ O(U)         │ ~2ms            │
└──────────────────────────────┴──────────────┴─────────────────┘

* Amortized O(1); occasional O(U) when eviction triggers
U = total users (~1000), C = cooldowns per user (~3)
```

### Memory Footprint

```
Per-User Memory Breakdown:
┌─────────────────────────────┬──────────┐
│ Component                    │ Size     │
├─────────────────────────────┼──────────┤
│ User ID (string)            │ ~20 B    │
│ LRU timestamp (number)      │ 8 B      │
│ Inner Map overhead          │ ~50 B    │
│ Per easter egg entry:       │          │
│   - Type string             │ ~30 B    │
│   - Timestamp (number)      │ 8 B      │
│   - Total per entry         │ 38 B     │
│                             │          │
│ Total (3 easter eggs)       │ 192 B    │
└─────────────────────────────┴──────────┘

System-Wide Memory (1000 users):
1000 users × 192 B = 192 KB
```

## Configuration Options

### Environment Variables

```bash
# Memory Management
MAX_COOLDOWN_ENTRIES=1000              # Max users to track
COOLDOWN_CLEANUP_INTERVAL_MS=300000    # Cleanup every 5 minutes

# Individual Cooldown Durations (milliseconds)
COOLDOWN_PERSON_WITHOUT_FOOD=604800000   # 7 days (default)
COOLDOWN_PET=259200000                   # 3 days
COOLDOWN_EMPTY_PLATE=172800000           # 2 days
COOLDOWN_MIDNIGHT_MUNCHIES=43200000      # 12 hours
COOLDOWN_CELEBRATION=2592000000          # 30 days
COOLDOWN_NON_FOOD_ITEM=604800000         # 7 days
COOLDOWN_SHOPPING_SCENE=259200000        # 3 days
COOLDOWN_SCREENSHOT=172800000            # 2 days
COOLDOWN_EMPTY_PACKAGING=172800000       # 2 days
```

### Configuration Scenarios

```
┌────────────────┬─────────────┬──────────────┬──────────────────┐
│ Scenario       │ Max Entries │ Cleanup Int. │ Memory / Cleanup │
├────────────────┼─────────────┼──────────────┼──────────────────┤
│ Development    │ 100         │ 1 min        │ 20 KB / 2ms      │
│ Small Scale    │ 500         │ 5 min        │ 100 KB / 10ms    │
│ Production     │ 1000        │ 5 min        │ 200 KB / 20ms    │
│ High Scale     │ 5000        │ 10 min       │ 1 MB / 100ms     │
│ Enterprise*    │ 50000       │ 30 min       │ 10 MB / 1s       │
└────────────────┴─────────────┴──────────────┴──────────────────┘

* For enterprise scale (>10K users), consider Redis/database backend
```

## Integration Checklist

### Implementation Steps

```
☐ 1. Install and test cooldown manager
   ├─ Files created: easter-egg-cooldown-manager.js
   ├─ Tests passing: npm test
   └─ No dependencies required (uses built-in Map)

☐ 2. Import into webhook.js
   └─ Add: const cooldownManager = require('./easter-egg-cooldown-manager');

☐ 3. Wrap easter egg triggers with cooldown checks
   ├─ Before trigger: checkEasterEggCooldown(userId, type)
   ├─ If on cooldown: continue with normal processing
   └─ After trigger: recordEasterEggTrigger(userId, type)

☐ 4. Optional: Add admin commands
   ├─ /cooldowns - View active cooldowns
   ├─ /clearcooldowns - Clear own cooldowns
   └─ /cooldownstats - System statistics (admin only)

☐ 5. Configure via environment variables
   └─ Set cooldown durations as needed

☐ 6. Deploy and monitor
   ├─ Check logs for [EasterEggCooldownManager] messages
   ├─ Monitor getCooldownStats() in health endpoint
   └─ Verify cooldowns working as expected
```

## Monitoring & Debugging

### Log Messages

```
[EasterEggCooldownManager] Initialized with config: {...}
[EasterEggCooldownManager] Started periodic cleanup (interval: 300000ms)
[EasterEggCooldownManager] No cooldowns tracked for user 123456, type person_without_food
[EasterEggCooldownManager] Easter egg person_without_food on cooldown for user 123456: 518400s remaining
[EasterEggCooldownManager] Recorded trigger for user 123456, type person_without_food (cooldown: 168h)
[EasterEggCooldownManager] Cleanup: removed 5 expired cooldowns for 2 users
[EasterEggCooldownManager] Max cooldown entries reached (1000), evicting LRU entry
[EasterEggCooldownManager] Evicted LRU cooldowns for user 111111 (last access: 2024-10-30T12:00:00Z)
```

### Health Check Endpoint

```javascript
app.get('/health', (req, res) => {
  const stats = cooldownManager.getCooldownStats();

  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    cooldowns: {
      totalUsers: stats.totalUsers,
      activeCooldowns: stats.activeCooldowns,
      memoryUsage: `${Math.round(stats.totalUsers * 192 / 1024)}KB`,
      byType: stats.cooldownsByType
    }
  });
});
```

## Troubleshooting Guide

```
┌─────────────────────────┬────────────────────────────────────────┐
│ Symptom                 │ Solution                                │
├─────────────────────────┼────────────────────────────────────────┤
│ Easter egg not triggering│ Check cooldown status with             │
│                          │ checkEasterEggCooldown()               │
│                          │                                        │
│ Easter egg too frequent  │ Increase COOLDOWN_* env vars          │
│                          │                                        │
│ Memory growing unbounded │ Check MAX_COOLDOWN_ENTRIES setting    │
│                          │ Verify cleanup is running              │
│                          │                                        │
│ Cleanup not running      │ Check setInterval is active            │
│                          │ Look for cleanup logs                  │
│                          │                                        │
│ Inconsistent behavior    │ Multi-instance? Each has own memory   │
│                          │ Consider Redis for persistence         │
└─────────────────────────┴────────────────────────────────────────┘
```

## Future Enhancements

```
Phase 1: Current Implementation ✓
├─ In-memory Map-based storage
├─ LRU eviction
├─ Automatic cleanup
└─ Configurable durations

Phase 2: Persistence (Optional)
├─ Redis backend for multi-instance
├─ Database storage for long-term tracking
└─ Migration utilities

Phase 3: Analytics (Future)
├─ Track trigger rates per type
├─ User engagement metrics
├─ A/B testing different durations
└─ Dashboard for monitoring

Phase 4: Advanced Features (Future)
├─ User preferences (opt-out specific types)
├─ Dynamic cooldown adjustment
├─ Seasonal easter eggs
└─ Context-aware triggering
```

---

**Architecture Version:** 1.0
**Last Updated:** 2024-11-07
**Status:** Production Ready ✓
