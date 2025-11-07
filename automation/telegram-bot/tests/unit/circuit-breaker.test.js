const CircuitBreaker = require('../../src/circuit-breaker');

describe('CircuitBreaker', () => {
  let consoleLogSpy;
  let consoleWarnSpy;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    jest.useRealTimers();
  });

  describe('Configuration Validation', () => {
    it('should throw error when failureThreshold < 1', () => {
      expect(() => {
        new CircuitBreaker({ failureThreshold: 0 });
      }).toThrow('CircuitBreaker: failureThreshold must be >= 1');
    });

    it('should throw error when successThreshold < 1', () => {
      expect(() => {
        new CircuitBreaker({ successThreshold: 0 });
      }).toThrow('CircuitBreaker: successThreshold must be >= 1');
    });

    it('should throw error when failureWindowMs < 1000', () => {
      expect(() => {
        new CircuitBreaker({ failureWindowMs: 999 });
      }).toThrow('CircuitBreaker: failureWindowMs must be >= 1000ms');
    });

    it('should throw error when recoveryTimeoutMs < 1000', () => {
      expect(() => {
        new CircuitBreaker({ recoveryTimeoutMs: 500 });
      }).toThrow('CircuitBreaker: recoveryTimeoutMs must be >= 1000ms');
    });

    it('should accept valid configuration', () => {
      const cb = new CircuitBreaker({
        failureThreshold: 3,
        successThreshold: 2,
        failureWindowMs: 5000,
        recoveryTimeoutMs: 10000,
        name: 'TestBreaker',
      });

      expect(cb.config.failureThreshold).toBe(3);
      expect(cb.config.successThreshold).toBe(2);
      expect(cb.config.failureWindowMs).toBe(5000);
      expect(cb.config.recoveryTimeoutMs).toBe(10000);
      expect(cb.config.name).toBe('TestBreaker');
    });

    it('should use default values when not provided', () => {
      const cb = new CircuitBreaker();

      expect(cb.config.failureThreshold).toBe(5);
      expect(cb.config.successThreshold).toBe(2);
      expect(cb.config.failureWindowMs).toBe(60000);
      expect(cb.config.recoveryTimeoutMs).toBe(120000);
      expect(cb.config.name).toBe('CircuitBreaker');
    });

    it('should log initialization with configuration', () => {
      new CircuitBreaker({ name: 'TestBreaker' });

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[TestBreaker] Initialized circuit breaker with config:',
        expect.objectContaining({
          failureThreshold: 5,
          failureWindowMs: '60000ms',
          recoveryTimeoutMs: '120000ms',
          successThreshold: 2,
        })
      );
    });
  });

  describe('State Machine - CLOSED → OPEN', () => {
    it('should transition from CLOSED to OPEN when failure threshold reached', () => {
      const cb = new CircuitBreaker({ failureThreshold: 3 });

      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));
      expect(cb.getState()).toBe('CLOSED');

      cb.recordFailure(new Error('error3'));
      expect(cb.getState()).toBe('OPEN');
    });

    it('should log warning when opening circuit', () => {
      const cb = new CircuitBreaker({ failureThreshold: 2, name: 'TestBreaker' });

      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[TestBreaker] Failure threshold reached, opening circuit'
      );
    });

    it('should stay in CLOSED state with successes', () => {
      const cb = new CircuitBreaker({ failureThreshold: 3 });

      cb.recordSuccess();
      cb.recordSuccess();
      cb.recordSuccess();

      expect(cb.getState()).toBe('CLOSED');
    });

    it('should transition to OPEN at exactly the failure threshold', () => {
      const cb = new CircuitBreaker({ failureThreshold: 5 });

      for (let i = 0; i < 4; i++) {
        cb.recordFailure(new Error(`error${i}`));
      }
      expect(cb.getState()).toBe('CLOSED');

      cb.recordFailure(new Error('error5'));
      expect(cb.getState()).toBe('OPEN');
    });

    it('should set openedAt timestamp when transitioning to OPEN', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2025-01-01T00:00:00Z'));

      const cb = new CircuitBreaker({ failureThreshold: 2 });

      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));

      expect(cb.openedAt).toBe(Date.now());
      jest.useRealTimers();
    });

    it('should open circuit with pattern (4 failures, 1 success, 4 failures)', () => {
      const cb = new CircuitBreaker({
        failureThreshold: 5,
        failureWindowMs: 10000,
      });

      // 4 failures
      for (let i = 0; i < 4; i++) {
        cb.recordFailure(new Error(`error${i}`));
      }
      expect(cb.getState()).toBe('CLOSED');

      // 1 success (should NOT clear failures in CLOSED state)
      cb.recordSuccess();
      expect(cb.getState()).toBe('CLOSED');

      // 1 more failure to reach threshold
      cb.recordFailure(new Error('error5'));
      expect(cb.getState()).toBe('OPEN');
    });
  });

  describe('State Machine - OPEN → HALF_OPEN', () => {
    it('should transition from OPEN to HALF_OPEN after exact recovery timeout', () => {
      jest.useFakeTimers();

      const cb = new CircuitBreaker({
        failureThreshold: 2,
        recoveryTimeoutMs: 5000,
      });

      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));
      expect(cb.getState()).toBe('OPEN');

      jest.advanceTimersByTime(5000);

      const isOpen = cb.isOpen();
      expect(isOpen).toBe(false);
      expect(cb.getState()).toBe('HALF_OPEN');

      jest.useRealTimers();
    });

    it('should transition from OPEN to HALF_OPEN after longer than recovery timeout', () => {
      jest.useFakeTimers();

      const cb = new CircuitBreaker({
        failureThreshold: 2,
        recoveryTimeoutMs: 5000,
      });

      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));
      expect(cb.getState()).toBe('OPEN');

      jest.advanceTimersByTime(10000);

      const isOpen = cb.isOpen();
      expect(isOpen).toBe(false);
      expect(cb.getState()).toBe('HALF_OPEN');

      jest.useRealTimers();
    });

    it('should stay OPEN before timeout', () => {
      jest.useFakeTimers();

      const cb = new CircuitBreaker({
        failureThreshold: 2,
        recoveryTimeoutMs: 5000,
      });

      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));
      expect(cb.getState()).toBe('OPEN');

      jest.advanceTimersByTime(4999);

      const isOpen = cb.isOpen();
      expect(isOpen).toBe(true);
      expect(cb.getState()).toBe('OPEN');

      jest.useRealTimers();
    });

    it('should handle clock going backwards with Math.abs()', () => {
      const cb = new CircuitBreaker({
        failureThreshold: 2,
        recoveryTimeoutMs: 5000,
      });

      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));
      expect(cb.getState()).toBe('OPEN');

      // Simulate clock going backwards
      const originalNow = Date.now;
      const openedTime = cb.openedAt;
      Date.now = jest.fn(() => openedTime - 1000);

      const isOpen = cb.isOpen();
      expect(isOpen).toBe(true);
      expect(cb.getState()).toBe('OPEN');

      Date.now = originalNow;
    });

    it('should log state transition from OPEN to HALF_OPEN', () => {
      jest.useFakeTimers();

      const cb = new CircuitBreaker({
        failureThreshold: 2,
        recoveryTimeoutMs: 5000,
        name: 'TestBreaker',
      });

      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));

      consoleLogSpy.mockClear();
      jest.advanceTimersByTime(5000);
      cb.isOpen();

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[TestBreaker] State transition: OPEN → HALF_OPEN'
      );

      jest.useRealTimers();
    });
  });

  describe('State Machine - HALF_OPEN → CLOSED', () => {
    it('should transition from HALF_OPEN to CLOSED after success threshold met', () => {
      jest.useFakeTimers();

      const cb = new CircuitBreaker({
        failureThreshold: 2,
        recoveryTimeoutMs: 5000,
        successThreshold: 3,
      });

      // Open circuit
      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));
      expect(cb.getState()).toBe('OPEN');

      // Transition to HALF_OPEN
      jest.advanceTimersByTime(5000);
      cb.isOpen();
      expect(cb.getState()).toBe('HALF_OPEN');

      // Record successes
      cb.recordSuccess();
      cb.recordSuccess();
      expect(cb.getState()).toBe('HALF_OPEN');

      cb.recordSuccess();
      expect(cb.getState()).toBe('CLOSED');

      jest.useRealTimers();
    });

    it('should reset consecutiveSuccesses counter when closing', () => {
      jest.useFakeTimers();

      const cb = new CircuitBreaker({
        failureThreshold: 2,
        recoveryTimeoutMs: 5000,
        successThreshold: 2,
      });

      // Open and transition to HALF_OPEN
      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));
      jest.advanceTimersByTime(5000);
      cb.isOpen();

      // Close circuit
      cb.recordSuccess();
      cb.recordSuccess();
      expect(cb.getState()).toBe('CLOSED');
      expect(cb.consecutiveSuccesses).toBe(0);

      jest.useRealTimers();
    });

    it('should clear failure history when closing circuit', () => {
      jest.useFakeTimers();

      const cb = new CircuitBreaker({
        failureThreshold: 2,
        recoveryTimeoutMs: 5000,
        successThreshold: 2,
      });

      // Open circuit
      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));
      expect(cb.failures.length).toBe(2);

      // Transition to HALF_OPEN and close
      jest.advanceTimersByTime(5000);
      cb.isOpen();
      cb.recordSuccess();
      cb.recordSuccess();

      expect(cb.getState()).toBe('CLOSED');
      expect(cb.failures.length).toBe(0);

      jest.useRealTimers();
    });

    it('should log success progress in HALF_OPEN state', () => {
      jest.useFakeTimers();

      const cb = new CircuitBreaker({
        failureThreshold: 2,
        recoveryTimeoutMs: 5000,
        successThreshold: 3,
        name: 'TestBreaker',
      });

      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));
      jest.advanceTimersByTime(5000);
      cb.isOpen();

      consoleLogSpy.mockClear();
      cb.recordSuccess();

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[TestBreaker] Success in HALF_OPEN: 1/3'
      );

      jest.useRealTimers();
    });
  });

  describe('State Machine - HALF_OPEN → OPEN', () => {
    it('should transition from HALF_OPEN to OPEN on any failure', () => {
      jest.useFakeTimers();

      const cb = new CircuitBreaker({
        failureThreshold: 2,
        recoveryTimeoutMs: 5000,
        successThreshold: 3,
      });

      // Open circuit
      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));

      // Transition to HALF_OPEN
      jest.advanceTimersByTime(5000);
      cb.isOpen();
      expect(cb.getState()).toBe('HALF_OPEN');

      // Record some successes
      cb.recordSuccess();
      cb.recordSuccess();

      // Single failure reopens circuit
      cb.recordFailure(new Error('error3'));
      expect(cb.getState()).toBe('OPEN');

      jest.useRealTimers();
    });

    it('should reset consecutiveSuccesses counter when reopening', () => {
      jest.useFakeTimers();

      const cb = new CircuitBreaker({
        failureThreshold: 2,
        recoveryTimeoutMs: 5000,
        successThreshold: 3,
      });

      // Open and transition to HALF_OPEN
      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));
      jest.advanceTimersByTime(5000);
      cb.isOpen();

      // Record successes
      cb.recordSuccess();
      cb.recordSuccess();
      expect(cb.consecutiveSuccesses).toBe(2);

      // Failure reopens and resets counter
      cb.recordFailure(new Error('error3'));
      expect(cb.getState()).toBe('OPEN');
      expect(cb.consecutiveSuccesses).toBe(0);

      jest.useRealTimers();
    });

    it('should log warning when reopening circuit from HALF_OPEN', () => {
      jest.useFakeTimers();

      const cb = new CircuitBreaker({
        failureThreshold: 2,
        recoveryTimeoutMs: 5000,
        name: 'TestBreaker',
      });

      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));
      jest.advanceTimersByTime(5000);
      cb.isOpen();

      consoleWarnSpy.mockClear();
      cb.recordFailure(new Error('error3'));

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[TestBreaker] Failure in HALF_OPEN state, reopening circuit'
      );

      jest.useRealTimers();
    });

    it('should set openedAt timestamp when reopening from HALF_OPEN', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2025-01-01T00:00:00Z'));

      const cb = new CircuitBreaker({
        failureThreshold: 2,
        recoveryTimeoutMs: 5000,
      });

      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));
      const firstOpenedAt = cb.openedAt;

      jest.advanceTimersByTime(5000);
      cb.isOpen();

      jest.advanceTimersByTime(1000);
      cb.recordFailure(new Error('error3'));

      expect(cb.openedAt).not.toBe(firstOpenedAt);
      expect(cb.openedAt).toBe(Date.now());

      jest.useRealTimers();
    });
  });

  describe('Memory Management', () => {
    it('should cap failures array at 1000 entries', () => {
      const cb = new CircuitBreaker({
        failureThreshold: 999999,
        failureWindowMs: 999999999,
      });

      // Record 1500 failures
      for (let i = 0; i < 1500; i++) {
        cb.recordFailure(new Error(`error${i}`));
      }

      expect(cb.failures.length).toBe(1000);
    });

    it('should cap stateTransitions array at 1000 entries', () => {
      const cb = new CircuitBreaker({
        failureThreshold: 1,
        recoveryTimeoutMs: 1000,
        successThreshold: 1,
      });

      jest.useFakeTimers();

      // Force 2000 state transitions
      for (let i = 0; i < 1000; i++) {
        // CLOSED → OPEN
        cb.recordFailure(new Error('error'));

        // OPEN → HALF_OPEN
        jest.advanceTimersByTime(1000);
        cb.isOpen();

        // HALF_OPEN → CLOSED
        cb.recordSuccess();
      }

      expect(cb.metrics.stateTransitions.length).toBe(1000);

      jest.useRealTimers();
    });

    it('should use slice() for memory management (not shift loop)', () => {
      const cb = new CircuitBreaker({
        failureThreshold: 999999,
        failureWindowMs: 999999999,
      });

      // Record 1500 failures
      for (let i = 0; i < 1500; i++) {
        cb.recordFailure(new Error(`error${i}`));
      }

      // Verify last 1000 entries are kept (slice behavior)
      expect(cb.failures.length).toBe(1000);

      // The most recent failure should still be in the array
      const now = Date.now();
      const mostRecentFailure = cb.failures[cb.failures.length - 1];
      expect(Math.abs(mostRecentFailure - now)).toBeLessThan(100);
    });
  });

  describe('Failure Window Sliding', () => {
    it('should remove failures outside the time window', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2025-01-01T00:00:00Z'));

      const cb = new CircuitBreaker({
        failureThreshold: 10,
        failureWindowMs: 5000,
      });

      // Record 3 failures
      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));
      cb.recordFailure(new Error('error3'));
      expect(cb.failures.length).toBe(3);

      // Advance time beyond window
      jest.advanceTimersByTime(6000);

      // Record new failure (should clean old ones)
      cb.recordFailure(new Error('error4'));
      expect(cb.failures.length).toBe(1);

      jest.useRealTimers();
    });

    it('should keep failures within the time window', () => {
      jest.useFakeTimers();

      const cb = new CircuitBreaker({
        failureThreshold: 10,
        failureWindowMs: 10000,
      });

      cb.recordFailure(new Error('error1'));
      jest.advanceTimersByTime(2000);
      cb.recordFailure(new Error('error2'));
      jest.advanceTimersByTime(2000);
      cb.recordFailure(new Error('error3'));

      // All failures still within 10s window
      expect(cb.failures.length).toBe(3);

      jest.useRealTimers();
    });

    it('should handle mixed success/failure patterns correctly', () => {
      jest.useFakeTimers();

      const cb = new CircuitBreaker({
        failureThreshold: 5,
        failureWindowMs: 10000,
      });

      cb.recordFailure(new Error('error1'));
      cb.recordSuccess();
      cb.recordFailure(new Error('error2'));
      cb.recordSuccess();
      cb.recordFailure(new Error('error3'));

      expect(cb.failures.length).toBe(3);
      expect(cb.getState()).toBe('CLOSED');

      jest.useRealTimers();
    });
  });

  describe('Metrics Calculation', () => {
    it('should calculate success rate correctly', () => {
      const cb = new CircuitBreaker({ failureThreshold: 10 });

      cb.recordSuccess();
      cb.recordSuccess();
      cb.recordSuccess();
      cb.recordFailure(new Error('error1'));

      const metrics = cb.getMetrics();
      expect(metrics.successRate).toBe(75.0);
    });

    it('should calculate uptime percentage correctly', () => {
      // Test that uptime calculation produces valid percentages
      const cb = new CircuitBreaker({
        failureThreshold: 2,
      });

      // Circuit starts CLOSED - should have 100% uptime initially
      let metrics = cb.getMetrics();
      expect(metrics.uptimePercentage).toBe(100);

      // Open the circuit
      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));

      // Circuit is now OPEN - uptime should be less than 100% over time
      // (but immediately after opening, might still be close to 100%)
      metrics = cb.getMetrics();
      expect(metrics.uptimePercentage).toBeGreaterThanOrEqual(0);
      expect(metrics.uptimePercentage).toBeLessThanOrEqual(100);
    });

    it('should record state transitions with timestamps and reasons', () => {
      const cb = new CircuitBreaker({
        failureThreshold: 2,
        name: 'TestBreaker',
      });

      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));

      expect(cb.metrics.stateTransitions.length).toBe(1);

      const transition = cb.metrics.stateTransitions[0];
      expect(transition.from).toBe('CLOSED');
      expect(transition.to).toBe('OPEN');
      expect(transition.timestamp).toBeDefined();
      expect(transition.date).toBeDefined();
      expect(transition.reason).toContain('failures in');
    });

    it('should predict next state change for OPEN state', () => {
      jest.useFakeTimers();

      const cb = new CircuitBreaker({
        failureThreshold: 2,
        recoveryTimeoutMs: 10000,
      });

      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));

      jest.advanceTimersByTime(3000);

      const metrics = cb.getMetrics();

      expect(metrics.nextStateChange).toBeDefined();
      expect(metrics.nextStateChange.state).toBe('HALF_OPEN');
      expect(metrics.nextStateChange.inMs).toBeGreaterThan(6000);
      expect(metrics.nextStateChange.inMs).toBeLessThanOrEqual(7000);
      expect(metrics.nextStateChange.inSeconds).toBe(7);

      jest.useRealTimers();
    });

    it('should return recent transitions (last 10)', () => {
      const cb = new CircuitBreaker({
        failureThreshold: 1,
        recoveryTimeoutMs: 1000,
        successThreshold: 1,
      });

      jest.useFakeTimers();

      // Create 15 transitions
      for (let i = 0; i < 5; i++) {
        cb.recordFailure(new Error('error'));
        jest.advanceTimersByTime(1000);
        cb.isOpen();
        cb.recordSuccess();
      }

      const metrics = cb.getMetrics();
      expect(metrics.recentTransitions.length).toBe(10);

      jest.useRealTimers();
    });

    it('should return zero success rate when no requests made', () => {
      const cb = new CircuitBreaker();
      const metrics = cb.getMetrics();
      expect(metrics.successRate).toBe(0);
    });

    it('should return 100% uptime when circuit never opened', () => {
      const cb = new CircuitBreaker();
      cb.recordSuccess();
      cb.recordSuccess();

      const metrics = cb.getMetrics();
      expect(metrics.uptimePercentage).toBe(100.0);
    });

    it('should track all metric counters correctly', () => {
      const cb = new CircuitBreaker({ failureThreshold: 3 });

      cb.recordSuccess();
      cb.recordSuccess();
      cb.recordFailure(new Error('error1'));
      cb.recordRejection();

      const metrics = cb.getMetrics();

      expect(metrics.totalRequests).toBe(3);
      expect(metrics.successCount).toBe(2);
      expect(metrics.failureCount).toBe(1);
      expect(metrics.rejectedCount).toBe(1);
    });

    it('should track circuit opened/closed counts', () => {
      jest.useFakeTimers();

      const cb = new CircuitBreaker({
        failureThreshold: 2,
        recoveryTimeoutMs: 1000,
        successThreshold: 1,
      });

      // Open circuit
      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));

      // Transition to HALF_OPEN and close
      jest.advanceTimersByTime(1000);
      cb.isOpen();
      cb.recordSuccess();

      const metrics = cb.getMetrics();
      expect(metrics.circuitOpenedCount).toBe(1);
      expect(metrics.circuitClosedCount).toBe(1);

      jest.useRealTimers();
    });

    it('should record last failure time and error message', () => {
      const cb = new CircuitBreaker({ failureThreshold: 10 });

      cb.recordFailure(new Error('Test error message'));

      const metrics = cb.getMetrics();
      expect(metrics.lastFailureTime).toBeDefined();
      expect(metrics.lastFailureError).toBe('Test error message');
    });

    it('should record last success time', () => {
      const cb = new CircuitBreaker();

      cb.recordSuccess();

      const metrics = cb.getMetrics();
      expect(metrics.lastSuccessTime).toBeDefined();
    });

    it('should handle error without message', () => {
      const cb = new CircuitBreaker({ failureThreshold: 10 });

      cb.recordFailure(null);

      const metrics = cb.getMetrics();
      expect(metrics.lastFailureError).toBe('Unknown error');
    });
  });

  describe('Race Condition Protection', () => {
    it('should prevent concurrent transitions with isTransitioning flag', () => {
      jest.useFakeTimers();

      const cb = new CircuitBreaker({
        failureThreshold: 2,
        recoveryTimeoutMs: 5000,
      });

      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));

      jest.advanceTimersByTime(5000);

      // First call should transition
      cb.isTransitioning = false;
      cb.isOpen();
      expect(cb.getState()).toBe('HALF_OPEN');

      // Reset to OPEN for test
      cb.state = 'OPEN';

      // Set flag to simulate concurrent transition
      cb.isTransitioning = true;
      cb.isOpen();

      // Should not transition again
      expect(cb.getState()).toBe('OPEN');

      jest.useRealTimers();
    });

    it('should reset isTransitioning flag in finally block', () => {
      jest.useFakeTimers();

      const cb = new CircuitBreaker({
        failureThreshold: 2,
        recoveryTimeoutMs: 5000,
      });

      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));

      jest.advanceTimersByTime(5000);

      cb.isOpen();

      // Flag should be reset after transition
      expect(cb.isTransitioning).toBe(false);

      jest.useRealTimers();
    });

    it('should not deadlock if transitionTo() throws exception', () => {
      jest.useFakeTimers();

      const cb = new CircuitBreaker({
        failureThreshold: 2,
        recoveryTimeoutMs: 5000,
      });

      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));

      jest.advanceTimersByTime(5000);

      // Mock transitionTo to throw
      const originalTransitionTo = cb.transitionTo;
      cb.transitionTo = jest.fn(() => {
        throw new Error('Transition error');
      });

      expect(() => cb.isOpen()).toThrow('Transition error');

      // Flag should still be reset
      expect(cb.isTransitioning).toBe(false);

      cb.transitionTo = originalTransitionTo;
      jest.useRealTimers();
    });

    it('should prevent transition when already in OPEN and isTransitioning is true', () => {
      jest.useFakeTimers();

      const cb = new CircuitBreaker({
        failureThreshold: 2,
        recoveryTimeoutMs: 5000,
      });

      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));
      expect(cb.getState()).toBe('OPEN');

      jest.advanceTimersByTime(5000);

      // Manually set isTransitioning to simulate race condition
      cb.isTransitioning = true;

      const result = cb.isOpen();

      // Should return true (OPEN) and not transition
      expect(result).toBe(true);
      expect(cb.getState()).toBe('OPEN');

      jest.useRealTimers();
    });
  });

  describe('Public Methods', () => {
    it('should return correct state with getState()', () => {
      const cb = new CircuitBreaker();

      expect(cb.getState()).toBe('CLOSED');

      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));
      cb.recordFailure(new Error('error3'));
      cb.recordFailure(new Error('error4'));
      cb.recordFailure(new Error('error5'));

      expect(cb.getState()).toBe('OPEN');
    });

    it('should return true when circuit is OPEN', () => {
      const cb = new CircuitBreaker({ failureThreshold: 2 });

      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));

      expect(cb.isOpen()).toBe(true);
    });

    it('should return false when circuit is CLOSED', () => {
      const cb = new CircuitBreaker();

      expect(cb.isOpen()).toBe(false);
    });

    it('should return false when circuit is HALF_OPEN', () => {
      jest.useFakeTimers();

      const cb = new CircuitBreaker({
        failureThreshold: 2,
        recoveryTimeoutMs: 5000,
      });

      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));

      jest.advanceTimersByTime(5000);
      cb.isOpen();

      expect(cb.getState()).toBe('HALF_OPEN');
      expect(cb.isOpen()).toBe(false);

      jest.useRealTimers();
    });

    it('should increment rejectedCount when recordRejection() called', () => {
      const cb = new CircuitBreaker();

      cb.recordRejection();
      cb.recordRejection();

      expect(cb.metrics.rejectedCount).toBe(2);
    });

    it('should not double-transition when already in target state', () => {
      const cb = new CircuitBreaker();

      const initialTransitionCount = cb.metrics.stateTransitions.length;

      cb.transitionTo('CLOSED');

      expect(cb.metrics.stateTransitions.length).toBe(initialTransitionCount);
    });
  });

  describe('Reset Functionality', () => {
    it('should reset circuit to CLOSED state', () => {
      const cb = new CircuitBreaker({ failureThreshold: 2 });

      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));
      expect(cb.getState()).toBe('OPEN');

      cb.reset();
      expect(cb.getState()).toBe('CLOSED');
    });

    it('should clear all failures on reset', () => {
      const cb = new CircuitBreaker({ failureThreshold: 5 });

      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));
      cb.recordFailure(new Error('error3'));
      expect(cb.failures.length).toBe(3);

      cb.reset();
      expect(cb.failures.length).toBe(0);
    });

    it('should reset consecutiveSuccesses counter', () => {
      jest.useFakeTimers();

      const cb = new CircuitBreaker({
        failureThreshold: 2,
        recoveryTimeoutMs: 5000,
        successThreshold: 3,
      });

      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));
      jest.advanceTimersByTime(5000);
      cb.isOpen();

      cb.recordSuccess();
      cb.recordSuccess();
      expect(cb.consecutiveSuccesses).toBe(2);

      cb.reset();
      expect(cb.consecutiveSuccesses).toBe(0);

      jest.useRealTimers();
    });

    it('should clear openedAt timestamp', () => {
      const cb = new CircuitBreaker({ failureThreshold: 2 });

      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));
      expect(cb.openedAt).not.toBeNull();

      cb.reset();
      expect(cb.openedAt).toBeNull();
    });

    it('should record state transition with "Manual reset" reason', () => {
      const cb = new CircuitBreaker({ failureThreshold: 2 });

      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));

      const beforeResetCount = cb.metrics.stateTransitions.length;
      cb.reset();

      expect(cb.metrics.stateTransitions.length).toBe(beforeResetCount + 1);

      const lastTransition = cb.metrics.stateTransitions[cb.metrics.stateTransitions.length - 1];
      expect(lastTransition.from).toBe('OPEN');
      expect(lastTransition.to).toBe('CLOSED');
      expect(lastTransition.reason).toBe('Manual reset');
    });

    it('should log reset messages', () => {
      const cb = new CircuitBreaker({ failureThreshold: 2, name: 'TestBreaker' });

      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));

      consoleLogSpy.mockClear();
      cb.reset();

      expect(consoleLogSpy).toHaveBeenCalledWith('[TestBreaker] Manual reset requested');
      expect(consoleLogSpy).toHaveBeenCalledWith('[TestBreaker] Reset complete: OPEN → CLOSED');
    });
  });

  describe('Status Summary', () => {
    it('should return formatted status summary for CLOSED state', () => {
      const cb = new CircuitBreaker({ name: 'TestBreaker', failureThreshold: 5 });

      cb.recordSuccess();
      cb.recordSuccess();
      cb.recordFailure(new Error('error1'));

      const summary = cb.getStatusSummary();

      expect(summary).toContain('Circuit Breaker "TestBreaker" Status:');
      expect(summary).toContain('State: CLOSED');
      expect(summary).toContain('Uptime: 100%');
      expect(summary).toContain('Success Rate: 66.67%');
      expect(summary).toContain('Requests: 3 (2 success, 1 failed, 0 rejected)');
      expect(summary).toContain('Failures in window: 1/5');
    });

    it('should include recovery time for OPEN state', () => {
      jest.useFakeTimers();

      const cb = new CircuitBreaker({
        name: 'TestBreaker',
        failureThreshold: 2,
        recoveryTimeoutMs: 10000,
      });

      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));

      jest.advanceTimersByTime(3000);

      const summary = cb.getStatusSummary();

      expect(summary).toContain('State: OPEN');
      expect(summary).toContain('Recovery in: 7s');

      jest.useRealTimers();
    });

    it('should include recovery progress for HALF_OPEN state', () => {
      jest.useFakeTimers();

      const cb = new CircuitBreaker({
        name: 'TestBreaker',
        failureThreshold: 2,
        recoveryTimeoutMs: 5000,
        successThreshold: 3,
      });

      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));

      jest.advanceTimersByTime(5000);
      cb.isOpen();

      cb.recordSuccess();
      cb.recordSuccess();

      const summary = cb.getStatusSummary();

      expect(summary).toContain('State: HALF_OPEN');
      expect(summary).toContain('Recovery progress: 2/3 successes');

      jest.useRealTimers();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero failures correctly', () => {
      const cb = new CircuitBreaker();

      expect(cb.failures.length).toBe(0);
      expect(cb.getState()).toBe('CLOSED');

      const metrics = cb.getMetrics();
      expect(metrics.failureCount).toBe(0);
      expect(metrics.currentFailuresInWindow).toBe(0);
    });

    it('should handle multiple rapid state transitions', () => {
      jest.useFakeTimers();

      const cb = new CircuitBreaker({
        failureThreshold: 1,
        recoveryTimeoutMs: 1000,
        successThreshold: 1,
      });

      for (let i = 0; i < 10; i++) {
        cb.recordFailure(new Error('error'));
        expect(cb.getState()).toBe('OPEN');

        jest.advanceTimersByTime(1000);
        cb.isOpen();
        expect(cb.getState()).toBe('HALF_OPEN');

        cb.recordSuccess();
        expect(cb.getState()).toBe('CLOSED');
      }

      expect(cb.metrics.stateTransitions.length).toBeGreaterThan(20);

      jest.useRealTimers();
    });

    it('should handle request immediately after construction', () => {
      const cb = new CircuitBreaker();

      expect(() => cb.recordSuccess()).not.toThrow();
      expect(() => cb.recordFailure(new Error('error'))).not.toThrow();
      expect(() => cb.isOpen()).not.toThrow();
    });

    it('should log failure count when recording failures', () => {
      const cb = new CircuitBreaker({ failureThreshold: 5, name: 'TestBreaker' });

      consoleLogSpy.mockClear();
      cb.recordFailure(new Error('error1'));

      expect(consoleLogSpy).toHaveBeenCalledWith('[TestBreaker] Failure recorded: 1/5 in window');
    });

    it('should handle transition reason for all state combinations', () => {
      const cb = new CircuitBreaker();

      expect(cb._getTransitionReason('CLOSED', 'OPEN')).toContain('failures in');
      expect(cb._getTransitionReason('OPEN', 'HALF_OPEN')).toContain('Recovery timeout');
      expect(cb._getTransitionReason('HALF_OPEN', 'CLOSED')).toContain('consecutive successes');
      expect(cb._getTransitionReason('HALF_OPEN', 'OPEN')).toBe('Failure during recovery testing');
      expect(cb._getTransitionReason('UNKNOWN', 'UNKNOWN')).toBe('Unknown');
    });

    it('should handle getMetrics when state is currently OPEN', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2025-01-01T00:00:00Z'));

      const cb = new CircuitBreaker({ failureThreshold: 2 });

      jest.advanceTimersByTime(5000);

      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));

      jest.advanceTimersByTime(3000);

      const metrics = cb.getMetrics();

      // Should account for current OPEN duration in uptime calculation
      expect(metrics.state).toBe('OPEN');
      expect(metrics.uptimePercentage).toBeLessThan(100);

      jest.useRealTimers();
    });

    it('should handle null nextStateChange when not in OPEN state', () => {
      const cb = new CircuitBreaker();

      const metrics = cb.getMetrics();
      expect(metrics.nextStateChange).toBeNull();
    });

    it('should return 0 for nextStateChange.inMs when recovery timeout has passed', () => {
      jest.useFakeTimers();

      const cb = new CircuitBreaker({
        failureThreshold: 2,
        recoveryTimeoutMs: 5000,
      });

      cb.recordFailure(new Error('error1'));
      cb.recordFailure(new Error('error2'));

      jest.advanceTimersByTime(10000);

      // Don't trigger transition yet
      const metrics = cb.getMetrics();

      expect(metrics.nextStateChange.inMs).toBe(0);
      expect(metrics.nextStateChange.inSeconds).toBe(0);

      jest.useRealTimers();
    });
  });
});
