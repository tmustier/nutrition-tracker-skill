// src/circuit-breaker.js

/**
 * Circuit Breaker Pattern Implementation
 *
 * Protects external services (like USDA API) from cascading failures by automatically
 * disabling requests when sustained failures are detected, allowing the service time
 * to recover before retrying.
 *
 * STATE MACHINE:
 * ┌─────────┐  N failures in window  ┌──────┐  timeout elapsed  ┌────────────┐
 * │ CLOSED  │ ───────────────────────>│ OPEN │ ─────────────────>│ HALF_OPEN  │
 * │(normal) │                          │(fail)│                   │  (testing) │
 * └─────────┘<─────────────────────────└──────┘<──────────────────└────────────┘
 *     ▲      N successes                  ▲          any failure          │
 *     └──────────────────────────────────────────────────────────────────┘
 */
class CircuitBreaker {
  constructor(config = {}) {
    // Validate configuration
    if (config.failureThreshold !== undefined && config.failureThreshold < 1) {
      throw new Error('CircuitBreaker: failureThreshold must be >= 1');
    }
    if (config.successThreshold !== undefined && config.successThreshold < 1) {
      throw new Error('CircuitBreaker: successThreshold must be >= 1');
    }
    if (config.failureWindowMs !== undefined && config.failureWindowMs < 1000) {
      throw new Error('CircuitBreaker: failureWindowMs must be >= 1000ms');
    }
    if (config.recoveryTimeoutMs !== undefined && config.recoveryTimeoutMs < 1000) {
      throw new Error('CircuitBreaker: recoveryTimeoutMs must be >= 1000ms');
    }

    // Configuration with defaults
    this.config = {
      failureThreshold: config.failureThreshold || 5,      // Open circuit after N failures
      failureWindowMs: config.failureWindowMs || 60000,    // Time window for failure tracking (60s)
      recoveryTimeoutMs: config.recoveryTimeoutMs || 120000, // Wait time before HALF_OPEN (2 min)
      successThreshold: config.successThreshold || 2,       // Successes needed to close circuit
      name: config.name || 'CircuitBreaker',                // Name for logging
    };

    // State management
    this.state = 'CLOSED'; // Current state: CLOSED, OPEN, HALF_OPEN
    this.failures = [];    // Array of failure timestamps (sliding window)
    this.consecutiveSuccesses = 0; // Success counter in HALF_OPEN state
    this.openedAt = null;  // Timestamp when circuit was opened
    this.stateChangedAt = Date.now(); // Last state transition timestamp
    this.isTransitioning = false; // Prevents race condition during OPEN → HALF_OPEN transition

    // Comprehensive metrics tracking
    this.metrics = {
      totalRequests: 0,
      successCount: 0,
      failureCount: 0,
      rejectedCount: 0,
      stateTransitions: [],
      circuitOpenedCount: 0,
      circuitClosedCount: 0,
      lastFailureTime: null,
      lastSuccessTime: null,
      lastFailureError: null,
      startTime: Date.now(),
    };

    console.log(`[${this.config.name}] Initialized circuit breaker with config:`, {
      failureThreshold: this.config.failureThreshold,
      failureWindowMs: `${this.config.failureWindowMs}ms`,
      recoveryTimeoutMs: `${this.config.recoveryTimeoutMs}ms`,
      successThreshold: this.config.successThreshold,
    });
  }

  /**
   * Check if circuit is OPEN (requests should be rejected)
   * Automatically transitions OPEN → HALF_OPEN after recovery timeout
   *
   * Note: Uses isTransitioning flag to prevent race condition where multiple
   * concurrent requests could all transition to HALF_OPEN simultaneously.
   * In Node.js single-threaded environment this is less critical, but still
   * good practice for consistency and future-proofing.
   */
  isOpen() {
    // Auto-transition from OPEN to HALF_OPEN after recovery timeout
    if (this.state === 'OPEN' && !this.isTransitioning) {
      const now = Date.now();
      // Use Math.abs() to handle NTP adjustments / clock going backwards
      const timeSinceOpened = Math.abs(now - this.openedAt);

      if (timeSinceOpened >= this.config.recoveryTimeoutMs) {
        // Use try-finally to prevent deadlock if transitionTo() throws
        this.isTransitioning = true;
        try {
          this.transitionTo('HALF_OPEN');
        } finally {
          this.isTransitioning = false;
        }
        return false; // Allow request in HALF_OPEN state
      }

      return true; // Circuit still OPEN, reject request
    }

    return this.state === 'OPEN'; // Return true if OPEN, false otherwise
  }

  /**
   * Get current circuit state
   */
  getState() {
    return this.state;
  }

  /**
   * Record a successful request
   */
  recordSuccess() {
    const now = Date.now();
    this.metrics.totalRequests++;
    this.metrics.successCount++;
    this.metrics.lastSuccessTime = now;

    if (this.state === 'HALF_OPEN') {
      this.consecutiveSuccesses++;
      console.log(`[${this.config.name}] Success in HALF_OPEN: ${this.consecutiveSuccesses}/${this.config.successThreshold}`);

      // Transition to CLOSED after enough consecutive successes
      if (this.consecutiveSuccesses >= this.config.successThreshold) {
        this.transitionTo('CLOSED');
        this.consecutiveSuccesses = 0;
        this.failures = []; // Clear failure history when circuit closes
      }
    }
    // Note: We do NOT clear failures on success in CLOSED state
    // The sliding window filter in recordFailure() is sufficient
    // This prevents a pattern of (4 failures, 1 success, 4 failures) from never opening the circuit
  }

  /**
   * Record a failed request
   */
  recordFailure(error) {
    const now = Date.now();
    this.metrics.totalRequests++;
    this.metrics.failureCount++;
    this.metrics.lastFailureTime = now;
    this.metrics.lastFailureError = error ? error.message : 'Unknown error';

    // Add failure to sliding window
    this.failures.push(now);

    // Remove failures outside the time window
    const cutoff = now - this.config.failureWindowMs;
    this.failures = this.failures.filter(timestamp => timestamp > cutoff);

    // Prevent unbounded growth under extreme load (1000+ concurrent failures)
    // Use slice() instead of shift() for O(n) performance instead of O(n²)
    if (this.failures.length > 1000) {
      this.failures = this.failures.slice(-1000);
    }

    console.log(`[${this.config.name}] Failure recorded: ${this.failures.length}/${this.config.failureThreshold} in window`);

    // State-specific handling
    if (this.state === 'CLOSED') {
      // Check if we should open the circuit
      if (this.failures.length >= this.config.failureThreshold) {
        console.warn(`[${this.config.name}] Failure threshold reached, opening circuit`);
        this.transitionTo('OPEN');
        this.openedAt = now;
      }
    } else if (this.state === 'HALF_OPEN') {
      // Any failure in HALF_OPEN immediately reopens the circuit
      console.warn(`[${this.config.name}] Failure in HALF_OPEN state, reopening circuit`);
      this.transitionTo('OPEN');
      this.openedAt = now;
      this.consecutiveSuccesses = 0;
    }
  }

  /**
   * Record a rejected request (circuit was OPEN)
   */
  recordRejection() {
    this.metrics.rejectedCount++;
  }

  /**
   * Transition to a new state
   */
  transitionTo(newState) {
    if (this.state === newState) return;

    const now = Date.now();
    const oldState = this.state;

    console.log(`[${this.config.name}] State transition: ${oldState} → ${newState}`);

    this.state = newState;
    this.stateChangedAt = now;

    // Record state transition in metrics
    const transition = {
      from: oldState,
      to: newState,
      timestamp: now,
      date: new Date(now).toISOString(),
      reason: this._getTransitionReason(oldState, newState),
    };

    this.metrics.stateTransitions.push(transition);

    // Prevent memory leak: limit state transition history to last 1000 entries
    // Use slice() for O(n) performance instead of shift() loop which is O(n²)
    if (this.metrics.stateTransitions.length > 1000) {
      this.metrics.stateTransitions = this.metrics.stateTransitions.slice(-1000);
    }

    // Update state-specific counters
    if (newState === 'OPEN') {
      this.metrics.circuitOpenedCount++;
    } else if (newState === 'CLOSED') {
      this.metrics.circuitClosedCount++;
    }
  }

  /**
   * Get human-readable reason for state transition
   */
  _getTransitionReason(from, to) {
    if (from === 'CLOSED' && to === 'OPEN') {
      return `${this.failures.length} failures in ${this.config.failureWindowMs}ms window`;
    } else if (from === 'OPEN' && to === 'HALF_OPEN') {
      return `Recovery timeout (${this.config.recoveryTimeoutMs}ms) elapsed`;
    } else if (from === 'HALF_OPEN' && to === 'CLOSED') {
      return `${this.config.successThreshold} consecutive successes`;
    } else if (from === 'HALF_OPEN' && to === 'OPEN') {
      return 'Failure during recovery testing';
    }
    return 'Unknown';
  }

  /**
   * Get comprehensive circuit breaker metrics
   */
  getMetrics() {
    const now = Date.now();
    const totalTime = now - this.metrics.startTime;

    // Calculate uptime percentage
    let openTime = 0;
    for (let i = 0; i < this.metrics.stateTransitions.length; i++) {
      const transition = this.metrics.stateTransitions[i];
      if (transition.to === 'OPEN') {
        const nextTransition = this.metrics.stateTransitions[i + 1];
        const endTime = nextTransition ? nextTransition.timestamp : now;
        openTime += endTime - transition.timestamp;
      }
    }

    if (this.state === 'OPEN') {
      openTime += now - this.stateChangedAt;
    }

    const uptimePercentage = totalTime > 0 ? ((totalTime - openTime) / totalTime) * 100 : 100;
    const successRate = this.metrics.totalRequests > 0
      ? (this.metrics.successCount / this.metrics.totalRequests) * 100
      : 0;

    // Calculate time until next state change
    let nextStateChange = null;
    if (this.state === 'OPEN') {
      const timeRemaining = this.config.recoveryTimeoutMs - (now - this.openedAt);
      nextStateChange = {
        state: 'HALF_OPEN',
        inMs: Math.max(0, timeRemaining),
        inSeconds: Math.max(0, Math.ceil(timeRemaining / 1000)),
      };
    }

    return {
      state: this.state,
      stateChangedAt: new Date(this.stateChangedAt).toISOString(),
      totalRequests: this.metrics.totalRequests,
      successCount: this.metrics.successCount,
      failureCount: this.metrics.failureCount,
      rejectedCount: this.metrics.rejectedCount,
      successRate: parseFloat(successRate.toFixed(2)),
      uptimePercentage: parseFloat(uptimePercentage.toFixed(2)),
      circuitOpenedCount: this.metrics.circuitOpenedCount,
      circuitClosedCount: this.metrics.circuitClosedCount,
      currentFailuresInWindow: this.failures.length,
      failureThreshold: this.config.failureThreshold,
      failureWindowMs: this.config.failureWindowMs,
      consecutiveSuccesses: this.consecutiveSuccesses,
      successThreshold: this.config.successThreshold,
      lastFailureTime: this.metrics.lastFailureTime
        ? new Date(this.metrics.lastFailureTime).toISOString()
        : null,
      lastFailureError: this.metrics.lastFailureError,
      lastSuccessTime: this.metrics.lastSuccessTime
        ? new Date(this.metrics.lastSuccessTime).toISOString()
        : null,
      nextStateChange,
      recentTransitions: this.metrics.stateTransitions.slice(-10),
    };
  }

  /**
   * Reset circuit breaker to initial state
   */
  reset() {
    console.log(`[${this.config.name}] Manual reset requested`);

    const oldState = this.state;
    this.state = 'CLOSED';
    this.failures = [];
    this.consecutiveSuccesses = 0;
    this.openedAt = null;
    this.stateChangedAt = Date.now();

    this.metrics.stateTransitions.push({
      from: oldState,
      to: 'CLOSED',
      timestamp: Date.now(),
      date: new Date().toISOString(),
      reason: 'Manual reset',
    });

    console.log(`[${this.config.name}] Reset complete: ${oldState} → CLOSED`);
  }

  /**
   * Get a summary string of current circuit status
   */
  getStatusSummary() {
    const metrics = this.getMetrics();
    let summary = `Circuit Breaker "${this.config.name}" Status:\n`;
    summary += `  State: ${metrics.state}\n`;
    summary += `  Uptime: ${metrics.uptimePercentage}%\n`;
    summary += `  Success Rate: ${metrics.successRate}%\n`;
    summary += `  Requests: ${metrics.totalRequests} (${metrics.successCount} success, ${metrics.failureCount} failed, ${metrics.rejectedCount} rejected)\n`;
    summary += `  Failures in window: ${metrics.currentFailuresInWindow}/${metrics.failureThreshold}\n`;

    if (metrics.state === 'OPEN' && metrics.nextStateChange) {
      summary += `  Recovery in: ${metrics.nextStateChange.inSeconds}s\n`;
    } else if (metrics.state === 'HALF_OPEN') {
      summary += `  Recovery progress: ${metrics.consecutiveSuccesses}/${metrics.successThreshold} successes\n`;
    }

    return summary;
  }
}

module.exports = CircuitBreaker;
