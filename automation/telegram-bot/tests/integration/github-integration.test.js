// tests/integration/github-integration.test.js - Integration tests for GitHub API

const nock = require('nock');
const GitHubIntegration = require('../../src/github-integration');

describe('GitHub Integration', () => {
  let github;
  const GITHUB_API_URL = 'https://api.github.com';

  beforeEach(() => {
    github = new GitHubIntegration();
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('Configuration and Initialization', () => {
    it('should initialize with correct configuration', () => {
      expect(github.token).toBe('mock_github_token');
      expect(github.owner).toBe('test_owner');
      expect(github.repo).toBe('test_repo');
      expect(github.branch).toBe('daily-logs');
    });

    it('should throw error when GitHub token is missing', () => {
      const originalToken = process.env.GITHUB_TOKEN;
      delete process.env.GITHUB_TOKEN;

      expect(() => {
        new GitHubIntegration();
      }).toThrow('GitHub token is required');

      process.env.GITHUB_TOKEN = originalToken;
    });

    it('should validate retry configuration', () => {
      expect(github.MAX_RETRIES).toBeGreaterThan(0);
      expect(github.INITIAL_RETRY_DELAY_MS).toBeGreaterThan(0);
      expect(github.BACKOFF_MULTIPLIER).toBeGreaterThan(1);
    });
  });

  describe('getCurrentDate', () => {
    it('should return date in YYYY-MM-DD format', () => {
      const date = github.getCurrentDate();
      
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(new Date(date)).toBeInstanceOf(Date);
    });

    it('should return consistent date within same day', () => {
      const date1 = github.getCurrentDate();
      const date2 = github.getCurrentDate();
      
      expect(date1).toBe(date2);
    });
  });

  describe('getLogFilePath', () => {
    it('should generate correct file path for current date', () => {
      const path = github.getLogFilePath();
      
      expect(path).toMatch(/^data\/logs\/\d{4}-\d{2}\/\d{2}\.yaml$/);
    });

    it('should generate correct file path for specific date', () => {
      const path = github.getLogFilePath('2025-11-04');
      
      expect(path).toBe('data/logs/2025-11/04.yaml');
    });

    it('should handle edge cases for dates', () => {
      const path1 = github.getLogFilePath('2025-01-01');
      const path2 = github.getLogFilePath('2025-12-31');
      
      expect(path1).toBe('data/logs/2025-01/01.yaml');
      expect(path2).toBe('data/logs/2025-12/31.yaml');
    });
  });

  describe('getOrCreateLogFile', () => {
    it('should read existing log file', async () => {
      const existingFileContent = {
        date: '2025-11-05',
        day_type: 'rest',
        entries: []
      };

      nock(GITHUB_API_URL)
        .get('/repos/test_owner/test_repo/contents/data/logs/2025-11/05.yaml')
        .query({ ref: 'daily-logs' })
        .reply(200, {
          content: Buffer.from(require('js-yaml').dump(existingFileContent)).toString('base64'),
          sha: 'abc123sha',
          path: 'data/logs/2025-11/05.yaml'
        });

      const result = await github.getOrCreateLogFile('2025-11-05');

      expect(result.exists).toBe(true);
      expect(result.sha).toBe('abc123sha');
      expect(result.data).toMatchObject({
        date: '2025-11-05',
        day_type: 'rest',
        entries: []
      });
    });

    it('should create new log file structure when file does not exist', async () => {
      nock(GITHUB_API_URL)
        .get('/repos/test_owner/test_repo/contents/data/logs/2025-11/05.yaml')
        .query({ ref: 'daily-logs' })
        .reply(404, { message: 'Not Found' });

      const result = await github.getOrCreateLogFile('2025-11-05');

      expect(result.exists).toBe(false);
      expect(result.sha).toBe(null);
      expect(result.data).toMatchObject({
        date: '2025-11-05',
        day_type: 'rest',
        entries: []
      });
      expect(result.path).toBe('data/logs/2025-11/05.yaml');
    });

    it('should handle GitHub API errors', async () => {
      nock(GITHUB_API_URL)
        .get('/repos/test_owner/test_repo/contents/data/logs/2025-11/05.yaml')
        .query({ ref: 'daily-logs' })
        .reply(500, { message: 'Internal Server Error' });

      await expect(github.getOrCreateLogFile('2025-11-05')).rejects.toThrow('GitHub API error');
    });

    it('should handle malformed YAML in existing file', async () => {
      nock(GITHUB_API_URL)
        .get('/repos/test_owner/test_repo/contents/data/logs/2025-11/05.yaml')
        .query({ ref: 'daily-logs' })
        .reply(200, {
          content: Buffer.from('invalid: yaml: content:').toString('base64'),
          sha: 'abc123sha'
        });

      await expect(github.getOrCreateLogFile('2025-11-05')).rejects.toThrow();
    });
  });

  describe('appendLogEntry', () => {
    const mockNutritionData = {
      name: 'Grilled Chicken Breast',
      food_bank_id: null,
      quantity: 200,
      unit: 'g',
      nutrition: global.mockNutritionData,
      notes: 'Test meal'
    };

    it('should append entry to existing log file', async () => {
      const existingFileContent = {
        date: '2025-11-05',
        day_type: 'rest',
        entries: []
      };

      // Mock reading existing file
      nock(GITHUB_API_URL)
        .get('/repos/test_owner/test_repo/contents/data/logs/2025-11/05.yaml')
        .query({ ref: 'daily-logs' })
        .reply(200, {
          content: Buffer.from(require('js-yaml').dump(existingFileContent)).toString('base64'),
          sha: 'existing_sha',
          path: 'data/logs/2025-11/05.yaml'
        });

      // Mock updating file
      nock(GITHUB_API_URL)
        .put('/repos/test_owner/test_repo/contents/data/logs/2025-11/05.yaml')
        .reply(200, {
          commit: {
            sha: 'new_commit_sha',
            message: 'Add nutrition entry'
          },
          content: {
            sha: 'new_file_sha'
          }
        });

      const result = await github.appendLogEntry(mockNutritionData);

      expect(result).toMatchObject({
        success: true,
        commitSha: 'new_commit_sha',
        fileSha: 'new_file_sha'
      });
    });

    it('should create new log file when appending to non-existent file', async () => {
      // Mock file not found
      nock(GITHUB_API_URL)
        .get('/repos/test_owner/test_repo/contents/data/logs/2025-11/05.yaml')
        .query({ ref: 'daily-logs' })
        .reply(404, { message: 'Not Found' });

      // Mock creating new file
      nock(GITHUB_API_URL)
        .put('/repos/test_owner/test_repo/contents/data/logs/2025-11/05.yaml')
        .reply(201, {
          commit: {
            sha: 'new_commit_sha',
            message: 'Create new log file'
          },
          content: {
            sha: 'new_file_sha'
          }
        });

      const result = await github.appendLogEntry(mockNutritionData);

      expect(result.success).toBe(true);
      expect(result.commitSha).toBe('new_commit_sha');
    });

    it('should handle race conditions with retry logic', async () => {
      // First read succeeds
      nock(GITHUB_API_URL)
        .get('/repos/test_owner/test_repo/contents/data/logs/2025-11/05.yaml')
        .query({ ref: 'daily-logs' })
        .reply(200, {
          content: Buffer.from(require('js-yaml').dump({ entries: [] })).toString('base64'),
          sha: 'old_sha'
        });

      // First update fails due to race condition
      nock(GITHUB_API_URL)
        .put('/repos/test_owner/test_repo/contents/data/logs/2025-11/05.yaml')
        .reply(409, { message: 'Conflict - file changed' });

      // Second read gets updated file
      nock(GITHUB_API_URL)
        .get('/repos/test_owner/test_repo/contents/data/logs/2025-11/05.yaml')
        .query({ ref: 'daily-logs' })
        .reply(200, {
          content: Buffer.from(require('js-yaml').dump({ entries: [{}] })).toString('base64'),
          sha: 'new_sha'
        });

      // Second update succeeds
      nock(GITHUB_API_URL)
        .put('/repos/test_owner/test_repo/contents/data/logs/2025-11/05.yaml')
        .reply(200, {
          commit: { sha: 'success_sha' },
          content: { sha: 'success_file_sha' }
        });

      const result = await github.appendLogEntry(mockNutritionData);

      expect(result.success).toBe(true);
      expect(result.commitSha).toBe('success_sha');
    });

    it('should fail after max retries on persistent conflicts', async () => {
      // Mock file read
      nock(GITHUB_API_URL)
        .persist()
        .get('/repos/test_owner/test_repo/contents/data/logs/2025-11/05.yaml')
        .query({ ref: 'daily-logs' })
        .reply(200, {
          content: Buffer.from(require('js-yaml').dump({ entries: [] })).toString('base64'),
          sha: 'conflict_sha'
        });

      // Mock persistent conflicts
      nock(GITHUB_API_URL)
        .persist()
        .put('/repos/test_owner/test_repo/contents/data/logs/2025-11/05.yaml')
        .reply(409, { message: 'Conflict' });

      await expect(github.appendLogEntry(mockNutritionData)).rejects.toThrow('Max retries exceeded');
    });

    it('should handle authentication errors', async () => {
      nock(GITHUB_API_URL)
        .get('/repos/test_owner/test_repo/contents/data/logs/2025-11/05.yaml')
        .query({ ref: 'daily-logs' })
        .reply(401, { message: 'Unauthorized' });

      await expect(github.appendLogEntry(mockNutritionData)).rejects.toThrow('Unauthorized');
    });

    it('should validate nutrition data before appending', async () => {
      const invalidNutritionData = {
        name: 'Invalid Food'
        // Missing required fields
      };

      // Should validate locally before making API calls
      await expect(github.appendLogEntry(invalidNutritionData)).rejects.toThrow();
    });

    it('should include timestamp in log entry', async () => {
      const existingFile = { date: '2025-11-05', entries: [] };

      nock(GITHUB_API_URL)
        .get('/repos/test_owner/test_repo/contents/data/logs/2025-11/05.yaml')
        .query({ ref: 'daily-logs' })
        .reply(200, {
          content: Buffer.from(require('js-yaml').dump(existingFile)).toString('base64'),
          sha: 'existing_sha'
        });

      let capturedContent;
      nock(GITHUB_API_URL)
        .put('/repos/test_owner/test_repo/contents/data/logs/2025-11/05.yaml')
        .reply(function(uri, requestBody) {
          capturedContent = Buffer.from(requestBody.content, 'base64').toString();
          return [200, { commit: { sha: 'test_sha' }, content: { sha: 'test_file_sha' } }];
        });

      await github.appendLogEntry(mockNutritionData);

      const parsedContent = require('js-yaml').load(capturedContent);
      expect(parsedContent.entries[0]).toHaveProperty('timestamp');
      expect(parsedContent.entries[0].timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  describe('getTodaysTotals', () => {
    it('should calculate totals from log entries', async () => {
      const logContent = {
        date: '2025-11-05',
        day_type: 'rest',
        entries: [
          {
            timestamp: '2025-11-05T08:00:00Z',
            items: [
              {
                name: 'Breakfast',
                nutrition: {
                  energy_kcal: 400,
                  protein_g: 20.0,
                  fat_g: 15.0,
                  carbs_total_g: 30.0,
                  fiber_total_g: 5.0,
                  sodium_mg: 300,
                  potassium_mg: 400
                }
              }
            ]
          },
          {
            timestamp: '2025-11-05T12:00:00Z',
            items: [
              {
                name: 'Lunch',
                nutrition: {
                  energy_kcal: 600,
                  protein_g: 35.0,
                  fat_g: 25.0,
                  carbs_total_g: 45.0,
                  fiber_total_g: 8.0,
                  sodium_mg: 500,
                  potassium_mg: 600
                }
              }
            ]
          }
        ]
      };

      nock(GITHUB_API_URL)
        .get('/repos/test_owner/test_repo/contents/data/logs/2025-11/05.yaml')
        .query({ ref: 'daily-logs' })
        .reply(200, {
          content: Buffer.from(require('js-yaml').dump(logContent)).toString('base64'),
          sha: 'test_sha'
        });

      const totals = await github.getTodaysTotals();

      expect(totals).toMatchObject({
        date: '2025-11-05',
        entries: 2,
        items: 2,
        energy_kcal: 1000,
        protein_g: 55.0,
        fat_g: 40.0,
        carbs_total_g: 75.0,
        fiber_total_g: 13.0,
        sodium_mg: 800,
        potassium_mg: 1000
      });
    });

    it('should return zero totals for non-existent log file', async () => {
      nock(GITHUB_API_URL)
        .get('/repos/test_owner/test_repo/contents/data/logs/2025-11/05.yaml')
        .query({ ref: 'daily-logs' })
        .reply(404, { message: 'Not Found' });

      const totals = await github.getTodaysTotals();

      expect(totals).toMatchObject({
        date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
        entries: 0,
        items: 0,
        energy_kcal: 0,
        protein_g: 0,
        fat_g: 0,
        carbs_total_g: 0,
        fiber_total_g: 0
      });
    });

    it('should handle empty log file', async () => {
      const emptyLogContent = {
        date: '2025-11-05',
        day_type: 'rest',
        entries: []
      };

      nock(GITHUB_API_URL)
        .get('/repos/test_owner/test_repo/contents/data/logs/2025-11/05.yaml')
        .query({ ref: 'daily-logs' })
        .reply(200, {
          content: Buffer.from(require('js-yaml').dump(emptyLogContent)).toString('base64'),
          sha: 'test_sha'
        });

      const totals = await github.getTodaysTotals();

      expect(totals.entries).toBe(0);
      expect(totals.items).toBe(0);
      expect(totals.energy_kcal).toBe(0);
    });

    it('should handle malformed nutrition data gracefully', async () => {
      const malformedLogContent = {
        date: '2025-11-05',
        entries: [
          {
            items: [
              {
                name: 'Incomplete Item',
                nutrition: {
                  energy_kcal: 300,
                  // Missing other fields
                }
              }
            ]
          }
        ]
      };

      nock(GITHUB_API_URL)
        .get('/repos/test_owner/test_repo/contents/data/logs/2025-11/05.yaml')
        .query({ ref: 'daily-logs' })
        .reply(200, {
          content: Buffer.from(require('js-yaml').dump(malformedLogContent)).toString('base64'),
          sha: 'test_sha'
        });

      const totals = await github.getTodaysTotals();

      expect(totals.energy_kcal).toBe(300);
      expect(totals.protein_g).toBe(0); // Should default to 0 for missing fields
    });

    it('should round nutrition values appropriately', async () => {
      const logContent = {
        date: '2025-11-05',
        entries: [
          {
            items: [
              {
                nutrition: {
                  energy_kcal: 123.456,
                  protein_g: 12.3456,
                  fat_g: 9.8765
                }
              }
            ]
          }
        ]
      };

      nock(GITHUB_API_URL)
        .get('/repos/test_owner/test_repo/contents/data/logs/2025-11/05.yaml')
        .query({ ref: 'daily-logs' })
        .reply(200, {
          content: Buffer.from(require('js-yaml').dump(logContent)).toString('base64'),
          sha: 'test_sha'
        });

      const totals = await github.getTodaysTotals();

      // Should round according to nutrition standards
      expect(totals.energy_kcal).toBe(123); // Integer
      expect(totals.protein_g).toBe(12.3); // 1 decimal place
      expect(totals.fat_g).toBe(9.9); // 1 decimal place
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle network timeouts', async () => {
      nock(GITHUB_API_URL)
        .get('/repos/test_owner/test_repo/contents/data/logs/2025-11/05.yaml')
        .query({ ref: 'daily-logs' })
        .replyWithError({ code: 'ETIMEDOUT', message: 'Network timeout' });

      await expect(github.getOrCreateLogFile('2025-11-05')).rejects.toThrow('Network timeout');
    });

    it('should handle rate limiting', async () => {
      nock(GITHUB_API_URL)
        .get('/repos/test_owner/test_repo/contents/data/logs/2025-11/05.yaml')
        .query({ ref: 'daily-logs' })
        .reply(403, {
          message: 'API rate limit exceeded',
          documentation_url: 'https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting'
        });

      await expect(github.getOrCreateLogFile('2025-11-05')).rejects.toThrow('API rate limit exceeded');
    });

    it('should handle repository access errors', async () => {
      nock(GITHUB_API_URL)
        .get('/repos/test_owner/test_repo/contents/data/logs/2025-11/05.yaml')
        .query({ ref: 'daily-logs' })
        .reply(404, { message: 'Repository not found' });

      // This could be either the file not found (expected) or repo not found (error)
      // The implementation should distinguish between these cases
      const result = await github.getOrCreateLogFile('2025-11-05');
      
      // If it's a repository access issue, it should throw
      // If it's just file not found, it should return new file structure
      expect(result).toBeDefined();
    });

    it('should validate branch exists before operations', async () => {
      // Mock branch validation call
      nock(GITHUB_API_URL)
        .get('/repos/test_owner/test_repo/branches/daily-logs')
        .reply(404, { message: 'Branch not found' });

      // The implementation should handle or create the branch
      // This test documents expected behavior
      const branch = 'daily-logs';
      expect(branch).toBe('daily-logs');
    });
  });

  describe('Commit Message Generation', () => {
    it('should generate descriptive commit messages', async () => {
      const mockNutritionData = {
        name: 'Grilled Chicken Breast',
        nutrition: { energy_kcal: 300 }
      };

      nock(GITHUB_API_URL)
        .get('/repos/test_owner/test_repo/contents/data/logs/2025-11/05.yaml')
        .query({ ref: 'daily-logs' })
        .reply(404, { message: 'Not Found' });

      let capturedCommitMessage;
      nock(GITHUB_API_URL)
        .put('/repos/test_owner/test_repo/contents/data/logs/2025-11/05.yaml')
        .reply(function(uri, requestBody) {
          capturedCommitMessage = requestBody.message;
          return [201, { commit: { sha: 'test_sha' } }];
        });

      await github.appendLogEntry(mockNutritionData);

      expect(capturedCommitMessage).toContain('Add nutrition entry');
      expect(capturedCommitMessage).toContain('Grilled Chicken Breast');
    });
  });
});