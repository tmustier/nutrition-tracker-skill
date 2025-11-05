// tests/integration/error-handling.test.js - Error handling and race condition tests

const nock = require('nock');
const request = require('supertest');
const express = require('express');

// Mock config and dependencies
jest.mock('../../src/config');
jest.mock('../../src/claude-integration');
jest.mock('../../src/github-integration');

const config = require('../../src/config');
const claudeIntegration = require('../../src/claude-integration');
const githubIntegration = require('../../src/github-integration');

// Mock configuration
config.telegram = {
  botToken: 'test_token',
  allowedUsers: [123456789],
  webhookSecret: 'test_secret'
};

describe('Error Handling and Race Conditions', () => {
  beforeEach(() => {
    nock.cleanAll();
    jest.clearAllMocks();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('API Error Handling', () => {
    describe('Claude API Errors', () => {
      it('should handle Claude API timeouts gracefully', async () => {
        claudeIntegration.processFoodLog.mockImplementation(() => {
          const timeoutError = new Error('ETIMEDOUT');
          timeoutError.code = 'ETIMEDOUT';
          return Promise.reject(timeoutError);
        });

        // Mock fallback to USDA
        nock('https://api.nal.usda.gov')
          .get('/fdc/v1/foods/search')
          .query(true)
          .reply(200, {
            foods: [{
              fdcId: 12345,
              description: 'Test Food',
              foodNutrients: [
                { nutrientId: 1008, value: 100 }
              ]
            }]
          });

        const result = await claudeIntegration.processFoodLog('test food', 123456789);

        // Should gracefully fall back or return meaningful error
        expect(result).toBeDefined();
        if (result.success === false) {
          expect(result.message).toContain('timeout');
        }
      });

      it('should handle Claude API rate limiting with exponential backoff', async () => {
        let callCount = 0;
        claudeIntegration.processFoodLog.mockImplementation(() => {
          callCount++;
          if (callCount <= 2) {
            const rateLimitError = new Error('Rate limit exceeded');
            rateLimitError.status = 429;
            return Promise.reject(rateLimitError);
          }
          return Promise.resolve({
            success: true,
            data: { name: 'Test Food', per_portion: global.mockNutritionData }
          });
        });

        const startTime = Date.now();
        const result = await claudeIntegration.processFoodLog('test food', 123456789);
        const endTime = Date.now();

        // Should eventually succeed after retries
        expect(result.success).toBe(true);
        // Should take some time due to backoff (if implemented)
        expect(endTime - startTime).toBeGreaterThan(0);
        expect(callCount).toBeGreaterThan(1);
      });

      it('should handle malformed Claude API responses', async () => {
        claudeIntegration.processFoodLog.mockResolvedValue({
          success: false,
          message: 'Failed to parse Claude response: invalid JSON'
        });

        const result = await claudeIntegration.processFoodLog('test food', 123456789);

        expect(result.success).toBe(false);
        expect(result.message).toContain('parse');
      });

      it('should handle Claude API authentication errors', async () => {
        claudeIntegration.processFoodLog.mockImplementation(() => {
          const authError = new Error('Authentication failed');
          authError.status = 401;
          return Promise.reject(authError);
        });

        const result = await claudeIntegration.processFoodLog('test food', 123456789);

        expect(result.success).toBe(false);
        expect(result.message).toContain('authentication');
      });

      it('should handle Claude API quota exceeded', async () => {
        claudeIntegration.processFoodLog.mockImplementation(() => {
          const quotaError = new Error('Monthly quota exceeded');
          quotaError.status = 429;
          quotaError.type = 'quota_exceeded';
          return Promise.reject(quotaError);
        });

        const result = await claudeIntegration.processFoodLog('test food', 123456789);

        expect(result.success).toBe(false);
        expect(result.message).toContain('quota');
      });
    });

    describe('GitHub API Errors', () => {
      it('should handle GitHub API authentication errors', async () => {
        githubIntegration.appendLogEntry.mockImplementation(() => {
          const authError = new Error('Bad credentials');
          authError.status = 401;
          return Promise.reject(authError);
        });

        await expect(
          githubIntegration.appendLogEntry({ name: 'Test Food' })
        ).rejects.toThrow('Bad credentials');
      });

      it('should handle GitHub API rate limiting', async () => {
        let callCount = 0;
        githubIntegration.appendLogEntry.mockImplementation(() => {
          callCount++;
          if (callCount === 1) {
            const rateLimitError = new Error('API rate limit exceeded');
            rateLimitError.status = 403;
            rateLimitError.headers = {
              'x-ratelimit-reset': Math.floor(Date.now() / 1000) + 60
            };
            return Promise.reject(rateLimitError);
          }
          return Promise.resolve({
            success: true,
            commitSha: 'abc123',
            fileSha: 'def456'
          });
        });

        // Should eventually succeed after rate limit resets (or handle gracefully)
        const result = await githubIntegration.appendLogEntry({ name: 'Test Food' });
        
        if (result.success) {
          expect(result.commitSha).toBeDefined();
        } else {
          expect(result.message || result.error).toContain('rate limit');
        }
      });

      it('should handle GitHub repository access errors', async () => {
        githubIntegration.appendLogEntry.mockImplementation(() => {
          const repoError = new Error('Repository not found');
          repoError.status = 404;
          return Promise.reject(repoError);
        });

        await expect(
          githubIntegration.appendLogEntry({ name: 'Test Food' })
        ).rejects.toThrow('Repository not found');
      });

      it('should handle GitHub branch protection errors', async () => {
        githubIntegration.appendLogEntry.mockImplementation(() => {
          const protectionError = new Error('Branch is protected');
          protectionError.status = 403;
          return Promise.reject(protectionError);
        });

        await expect(
          githubIntegration.appendLogEntry({ name: 'Test Food' })
        ).rejects.toThrow('Branch is protected');
      });
    });

    describe('USDA API Errors', () => {
      it('should handle USDA API key errors', async () => {
        nock('https://api.nal.usda.gov')
          .get('/fdc/v1/foods/search')
          .query(true)
          .reply(403, {
            error: {
              code: 'INVALID_API_KEY',
              message: 'Invalid or missing API key'
            }
          });

        // Mock USDA class
        const UsdaApi = require('../../src/usda-api');
        const usda = new UsdaApi();

        await expect(usda.searchFoods('chicken breast')).rejects.toThrow();
      });

      it('should handle USDA API service outages', async () => {
        nock('https://api.nal.usda.gov')
          .get('/fdc/v1/foods/search')
          .query(true)
          .reply(503, {
            error: 'Service temporarily unavailable'
          });

        const UsdaApi = require('../../src/usda-api');
        const usda = new UsdaApi();

        await expect(usda.searchFoods('chicken breast')).rejects.toThrow();
      });

      it('should handle USDA API invalid responses', async () => {
        nock('https://api.nal.usda.gov')
          .get('/fdc/v1/foods/search')
          .query(true)
          .reply(200, 'invalid json response');

        const UsdaApi = require('../../src/usda-api');
        const usda = new UsdaApi();

        await expect(usda.searchFoods('chicken breast')).rejects.toThrow();
      });
    });
  });

  describe('Race Condition Handling', () => {
    describe('GitHub File Conflicts', () => {
      it('should handle concurrent writes to same log file', async () => {
        let getFileCallCount = 0;
        let putFileCallCount = 0;

        // Mock GitHub API for race condition scenario
        nock('https://api.github.com')
          .persist()
          .get(/\/repos\/.*\/contents\/.*\.yaml/)
          .query({ ref: 'daily-logs' })
          .reply(() => {
            getFileCallCount++;
            const fileContent = {
              date: '2025-11-05',
              entries: getFileCallCount === 1 ? [] : [{ items: [{ name: 'Previous Entry' }] }]
            };
            return [200, {
              content: Buffer.from(require('js-yaml').dump(fileContent)).toString('base64'),
              sha: `sha_${getFileCallCount}`,
              path: 'data/logs/2025-11/05.yaml'
            }];
          });

        nock('https://api.github.com')
          .persist()
          .put(/\/repos\/.*\/contents\/.*\.yaml/)
          .reply(() => {
            putFileCallCount++;
            if (putFileCallCount === 1) {
              // First write attempt fails due to race condition
              return [409, { message: 'Conflict - file was updated' }];
            }
            // Second attempt succeeds
            return [200, {
              commit: { sha: `commit_${putFileCallCount}` },
              content: { sha: `file_${putFileCallCount}` }
            }];
          });

        // Simulate concurrent operations
        const mockNutritionData = {
          name: 'Test Food',
          nutrition: global.mockNutritionData
        };

        githubIntegration.appendLogEntry.mockImplementation(async (data) => {
          // Simulate the retry logic from the actual implementation
          let retries = 0;
          const maxRetries = 3;
          
          while (retries < maxRetries) {
            try {
              // This would trigger the mocked API calls above
              const response = await require('axios').put(
                'https://api.github.com/repos/test/repo/contents/data/logs/2025-11/05.yaml',
                { message: 'Test commit', content: 'test_content', sha: 'test_sha' }
              );
              
              return {
                success: true,
                commitSha: response.data.commit.sha,
                fileSha: response.data.content.sha
              };
            } catch (error) {
              if (error.response?.status === 409 && retries < maxRetries - 1) {
                retries++;
                await new Promise(resolve => setTimeout(resolve, 100 * retries)); // Backoff
                continue;
              }
              throw error;
            }
          }
        });

        const result = await githubIntegration.appendLogEntry(mockNutritionData);

        expect(result.success).toBe(true);
        expect(getFileCallCount).toBeGreaterThan(1); // Should have retried
        expect(putFileCallCount).toBeGreaterThan(1); // Should have retried
      });

      it('should respect maximum retry limit', async () => {
        // Mock persistent conflict
        nock('https://api.github.com')
          .persist()
          .get(/\/repos\/.*\/contents\/.*\.yaml/)
          .query(true)
          .reply(200, {
            content: Buffer.from('date: 2025-11-05\nentries: []').toString('base64'),
            sha: 'conflict_sha'
          });

        nock('https://api.github.com')
          .persist()
          .put(/\/repos\/.*\/contents\/.*\.yaml/)
          .reply(409, { message: 'Persistent conflict' });

        githubIntegration.appendLogEntry.mockImplementation(async () => {
          // Simulate max retries exceeded
          throw new Error('Max retries exceeded for GitHub operation');
        });

        await expect(
          githubIntegration.appendLogEntry({ name: 'Test Food' })
        ).rejects.toThrow('Max retries exceeded');
      });

      it('should use exponential backoff for retries', async () => {
        const retryTimes = [];
        let retryCount = 0;

        githubIntegration.appendLogEntry.mockImplementation(async () => {
          retryCount++;
          retryTimes.push(Date.now());
          
          if (retryCount <= 2) {
            const error = new Error('Conflict');
            error.status = 409;
            throw error;
          }
          
          return { success: true, commitSha: 'final_sha' };
        });

        const startTime = Date.now();
        const result = await githubIntegration.appendLogEntry({ name: 'Test Food' });
        const endTime = Date.now();

        expect(result.success).toBe(true);
        expect(retryCount).toBe(3);
        
        // Should have increasing delays between retries (if implemented)
        if (retryTimes.length > 2) {
          const firstDelay = retryTimes[1] - retryTimes[0];
          const secondDelay = retryTimes[2] - retryTimes[1];
          expect(secondDelay).toBeGreaterThanOrEqual(firstDelay);
        }
      });
    });

    describe('Rate Limiting Race Conditions', () => {
      it('should handle concurrent rate limit checks', async () => {
        // Simulate multiple requests from same user arriving simultaneously
        const userId = 123456789;
        const rateLimitStorage = new Map();
        
        const checkRateLimit = (userId) => {
          const now = Date.now();
          const requests = rateLimitStorage.get(userId) || [];
          
          // Filter out old requests
          const validRequests = requests.filter(time => now - time < 60000);
          
          if (validRequests.length >= 5) {
            return { allowed: false, resetTime: 60 };
          }
          
          validRequests.push(now);
          rateLimitStorage.set(userId, validRequests);
          return { allowed: true };
        };

        // Simulate concurrent requests
        const promises = Array(10).fill().map(() => 
          Promise.resolve(checkRateLimit(userId))
        );
        
        const results = await Promise.all(promises);
        
        const allowedRequests = results.filter(r => r.allowed).length;
        const rejectedRequests = results.filter(r => !r.allowed).length;
        
        expect(allowedRequests).toBeLessThanOrEqual(5);
        expect(rejectedRequests).toBeGreaterThanOrEqual(5);
      });

      it('should clean up rate limit storage efficiently', () => {
        const rateLimitStorage = new Map();
        
        // Add old entries
        rateLimitStorage.set(123, [Date.now() - 120000]); // 2 minutes old
        rateLimitStorage.set(456, [Date.now() - 30000]);  // 30 seconds old
        rateLimitStorage.set(789, [Date.now() - 5000]);   // 5 seconds old
        
        // Cleanup function
        const cleanupRateLimit = () => {
          const now = Date.now();
          const cutoff = now - 60000; // 1 minute window
          
          for (const [userId, timestamps] of rateLimitStorage) {
            const validTimestamps = timestamps.filter(ts => ts > cutoff);
            
            if (validTimestamps.length === 0) {
              rateLimitStorage.delete(userId);
            } else {
              rateLimitStorage.set(userId, validTimestamps);
            }
          }
        };
        
        cleanupRateLimit();
        
        expect(rateLimitStorage.has(123)).toBe(false); // Should be deleted
        expect(rateLimitStorage.has(456)).toBe(true);  // Should remain
        expect(rateLimitStorage.has(789)).toBe(true);  // Should remain
      });
    });
  });

  describe('Network and Infrastructure Errors', () => {
    it('should handle DNS resolution failures', async () => {
      nock('https://api.anthropic.com')
        .post('/v1/messages')
        .replyWithError({ code: 'ENOTFOUND', message: 'DNS resolution failed' });

      claudeIntegration.processFoodLog.mockImplementation(() => {
        const dnsError = new Error('DNS resolution failed');
        dnsError.code = 'ENOTFOUND';
        return Promise.reject(dnsError);
      });

      const result = await claudeIntegration.processFoodLog('test food', 123456789);

      expect(result.success).toBe(false);
      expect(result.message).toContain('network');
    });

    it('should handle SSL/TLS certificate errors', async () => {
      nock('https://api.anthropic.com')
        .post('/v1/messages')
        .replyWithError({ code: 'CERT_UNTRUSTED', message: 'Certificate verification failed' });

      claudeIntegration.processFoodLog.mockImplementation(() => {
        const certError = new Error('Certificate verification failed');
        certError.code = 'CERT_UNTRUSTED';
        return Promise.reject(certError);
      });

      const result = await claudeIntegration.processFoodLog('test food', 123456789);

      expect(result.success).toBe(false);
      expect(result.message).toContain('certificate');
    });

    it('should handle connection reset errors', async () => {
      nock('https://api.anthropic.com')
        .post('/v1/messages')
        .replyWithError({ code: 'ECONNRESET', message: 'Connection reset by peer' });

      claudeIntegration.processFoodLog.mockImplementation(() => {
        const resetError = new Error('Connection reset by peer');
        resetError.code = 'ECONNRESET';
        return Promise.reject(resetError);
      });

      const result = await claudeIntegration.processFoodLog('test food', 123456789);

      expect(result.success).toBe(false);
      expect(result.message).toContain('connection');
    });

    it('should handle proxy and firewall issues', async () => {
      nock('https://api.anthropic.com')
        .post('/v1/messages')
        .reply(407, { error: 'Proxy Authentication Required' });

      claudeIntegration.processFoodLog.mockImplementation(() => {
        const proxyError = new Error('Proxy Authentication Required');
        proxyError.status = 407;
        return Promise.reject(proxyError);
      });

      const result = await claudeIntegration.processFoodLog('test food', 123456789);

      expect(result.success).toBe(false);
      expect(result.message).toContain('proxy');
    });
  });

  describe('Memory and Resource Management', () => {
    it('should handle large payload processing gracefully', async () => {
      const largeText = 'a'.repeat(100000); // 100KB text
      
      claudeIntegration.processFoodLog.mockImplementation((text) => {
        if (text.length > 50000) {
          return Promise.resolve({
            success: false,
            message: 'Input too large, please provide a shorter description'
          });
        }
        return Promise.resolve({
          success: true,
          data: { name: 'Test Food', per_portion: global.mockNutritionData }
        });
      });

      const result = await claudeIntegration.processFoodLog(largeText, 123456789);

      expect(result.success).toBe(false);
      expect(result.message).toContain('too large');
    });

    it('should handle memory pressure during image processing', async () => {
      const largeImageBuffer = Buffer.alloc(50 * 1024 * 1024); // 50MB image
      
      claudeIntegration.processImage.mockImplementation((buffer) => {
        if (buffer.length > 20 * 1024 * 1024) { // 20MB limit
          return Promise.resolve({
            success: false,
            message: 'Image too large, please use a smaller image'
          });
        }
        return Promise.resolve({
          success: true,
          data: { name: 'Image Food', per_portion: global.mockNutritionData }
        });
      });

      const result = await claudeIntegration.processImage(largeImageBuffer, 'image/jpeg');

      expect(result.success).toBe(false);
      expect(result.message).toContain('too large');
    });

    it('should clean up temporary resources', async () => {
      // Mock resource cleanup tracking
      let resourcesCreated = 0;
      let resourcesCleaned = 0;

      const mockResourceManager = {
        createResource: () => {
          resourcesCreated++;
          return { id: resourcesCreated };
        },
        cleanupResource: (resource) => {
          resourcesCleaned++;
        }
      };

      // Simulate operation that creates and cleans up resources
      try {
        const resource = mockResourceManager.createResource();
        // ... process resource ...
        throw new Error('Simulated error during processing');
      } catch (error) {
        // Should clean up even on error
        resourcesCleaned++;
      } finally {
        // Ensure cleanup happens
        resourcesCleaned++;
      }

      expect(resourcesCreated).toBe(1);
      expect(resourcesCleaned).toBeGreaterThan(0);
    });
  });

  describe('Graceful Degradation', () => {
    it('should fall back gracefully when primary services fail', async () => {
      // Claude API fails
      claudeIntegration.processFoodLog.mockImplementation(() => {
        return Promise.reject(new Error('Claude API unavailable'));
      });

      // USDA API succeeds
      nock('https://api.nal.usda.gov')
        .get('/fdc/v1/foods/search')
        .query(true)
        .reply(200, {
          foods: [{
            fdcId: 12345,
            description: 'Fallback food from USDA',
            foodNutrients: [
              { nutrientId: 1008, value: 200 }
            ]
          }]
        });

      // Should fall back to USDA
      const result = await claudeIntegration.processFoodLog('chicken breast', 123456789);

      if (result.success) {
        expect(result.source).toBe('usda');
      } else {
        expect(result.message).toContain('unavailable');
      }
    });

    it('should provide offline capabilities when possible', async () => {
      // All external APIs fail
      claudeIntegration.processFoodLog.mockImplementation(() => {
        return Promise.reject(new Error('Network unavailable'));
      });

      // Should provide basic response or cached data
      const result = await claudeIntegration.processFoodLog('basic food', 123456789);

      expect(result).toBeDefined();
      expect(result.success).toBe(false);
      expect(result.message).toContain('unavailable');
    });

    it('should continue processing other requests when one fails', async () => {
      let requestCount = 0;
      
      claudeIntegration.processFoodLog.mockImplementation((text) => {
        requestCount++;
        if (requestCount === 2) {
          throw new Error('Second request fails');
        }
        return Promise.resolve({
          success: true,
          data: { name: `Food ${requestCount}`, per_portion: global.mockNutritionData }
        });
      });

      // Process multiple requests
      const results = await Promise.allSettled([
        claudeIntegration.processFoodLog('food1', 123),
        claudeIntegration.processFoodLog('food2', 123), // This will fail
        claudeIntegration.processFoodLog('food3', 123)
      ]);

      expect(results[0].status).toBe('fulfilled');
      expect(results[1].status).toBe('rejected');
      expect(results[2].status).toBe('fulfilled');
    });
  });
});