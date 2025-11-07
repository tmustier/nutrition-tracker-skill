# Comprehensive Security Audit: Nutrition Tracker Telegram Bot

## Executive Summary

This audit identified **3 P0 (Critical)** and **3 P1 (High)** security vulnerabilities in the nutrition-tracking Telegram bot codebase. The most critical issues involve unauthenticated access to administrative endpoints and disabled webhook verification.

---

## P0 CRITICAL VULNERABILITIES

### 1. Unauthenticated Webhook Setup Endpoint (GET /setup)

**Severity:** P0 - CRITICAL  
**Exploitability:** TRIVIAL - anyone can trigger this endpoint  
**Files:**
- `/automation/telegram-bot/server.js` (lines 113-177, 318-357)

**Attack Vector:**
An unauthenticated attacker can call `GET /setup` at any time to trigger webhook re-registration. This allows:
- Denial of Service: Re-registering the webhook with an attacker-controlled URL
- Service Disruption: Causing legitimate Telegram updates to fail
- Webhook Hijacking: Modifying where the bot receives updates from Telegram

**Code Snippet (Vulnerable):**
```javascript
// server.js lines 318-357
app.get('/setup', async (req, res) => {
  try {
    const webhookUrl = `${WEBHOOK_URL}/webhook`;
    console.log(`\n🔧 Setting up webhook...`);
    console.log(`   URL: ${webhookUrl}`);
    
    // NO AUTHENTICATION CHECK - ANY USER CAN TRIGGER THIS
    const webhookOptions = {};
    if (config.telegram.webhookSecret) {
      webhookOptions.secret_token = config.telegram.webhookSecret;
    }
    await webhook.bot.telegram.setWebhook(webhookUrl, webhookOptions);
    // ... response sent back with sensitive info
```

**Proof of Concept:**
```bash
# Any attacker can trigger this:
curl https://nutrition-bot.railway.app/setup

# The bot will re-register its webhook, potentially disrupting service
```

**Specific Fix with Code:**

Add authentication middleware to the setup endpoint:

```javascript
// server.js - Add this BEFORE the route handler

// Require a setup token from environment variable
const SETUP_TOKEN = process.env.SETUP_TOKEN;

function authenticateSetup(req, res, next) {
  // Check for setup token in header or query param
  const token = req.headers['x-setup-token'] || req.query.token;
  
  if (!SETUP_TOKEN || !token || token !== SETUP_TOKEN) {
    console.warn('Unauthorized setup attempt - missing or invalid token');
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'Forbidden',
      message: 'Setup token required'
    }));
    return;
  }
  next();
}

// For Express:
app.get('/setup', authenticateSetup, async (req, res) => {
  // ... existing code ...
});

// For http module: wrap the handler
if (req.method === 'GET' && req.url === '/setup') {
  if (!authenticateSetup(req, res)) return;
  await handleSetup(req, res);
}
```

**Environment Variable to Set:**
```bash
# Generate a random token
SETUP_TOKEN=<random-32-char-token>
```

**Alternative: More Restrictive Approach (Recommended for Production)**

Remove the `/setup` endpoint entirely and configure the webhook only during initial deployment:

```javascript
// Remove the GET /setup route entirely
// Configure the webhook ONLY via initialization script during deployment

// Instead, provide setup-webhook.js script:
const config = require('./src/config');
const webhook = require('./src/webhook');

async function setupWebhook() {
  if (!config.telegram.webhookUrl) {
    console.error('WEBHOOK_URL not configured - cannot set up webhook');
    process.exit(1);
  }
  
  try {
    const webhookUrl = `${config.telegram.webhookUrl}/webhook`;
    const webhookOptions = {};
    if (config.telegram.webhookSecret) {
      webhookOptions.secret_token = config.telegram.webhookSecret;
    }
    await webhook.bot.telegram.setWebhook(webhookUrl, webhookOptions);
    console.log('✓ Webhook set up successfully');
    process.exit(0);
  } catch (error) {
    console.error('Failed to set up webhook:', error.message);
    process.exit(1);
  }
}

setupWebhook();
```

Then run this only during deployment:
```bash
# Call this ONLY during initial deployment or manual admin actions
node setup-webhook.js
```

---

### 2. Webhook Secret Verification Disabled by Default

**Severity:** P0 - CRITICAL  
**Exploitability:** HIGH - any POST request accepted if env var not set  
**Files:**
- `/automation/telegram-bot/server.js` (lines 184-218)
- `/automation/telegram-bot/src/webhook.js` (lines 322-357)

**Attack Vector:**
When `WEBHOOK_SECRET` environment variable is not configured, the webhook verification is completely bypassed (returns `true` immediately). An attacker can craft a malicious Telegram-like JSON payload and POST it to the webhook, causing arbitrary food log entries to be created.

**Code Snippet (Vulnerable):**
```javascript
// server.js lines 184-188
function verifyWebhookSecret(req) {
  // If no webhook secret configured, skip verification (for backward compatibility)
  if (!config.telegram.webhookSecret) {
    return true;  // ⚠️ ACCEPTS ANY REQUEST
  }
  // ...
}
```

**Proof of Concept:**
```bash
# If WEBHOOK_SECRET is not set, this malicious POST is accepted:
curl -X POST https://nutrition-bot.railway.app/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "update_id": 123,
    "message": {
      "message_id": 1,
      "from": {"id": 999999, "first_name": "Attacker"},
      "chat": {"id": 999999},
      "text": "Logged 5000g chicken breast - 500000 kcal"
    }
  }'

# Result: Arbitrary food entries created, corrupting the nutrition log
```

**Specific Fix with Code:**

**Option 1: Require Webhook Secret (Recommended)**

Change the default behavior to REQUIRE webhook secret:

```javascript
// server.js and src/webhook.js

function verifyWebhookSecret(req) {
  // CRITICAL: Webhook secret MUST be configured in production
  const secret = config.telegram.webhookSecret;
  
  if (!secret) {
    console.error('CRITICAL: WEBHOOK_SECRET not configured. Webhook is UNPROTECTED.');
    // In production, fail closed:
    if (process.env.NODE_ENV === 'production') {
      console.error('SECURITY: Rejecting request - webhook secret required in production');
      return false;
    }
    // In development, allow for testing
    console.warn('⚠️ WARNING: Webhook secret not configured. This is only acceptable in development.');
    return true;
  }

  const providedSecret = req.headers['x-telegram-bot-api-secret-token'] || 
                        req.headers['x-webhook-secret'];
  
  if (!providedSecret) {
    console.warn('Webhook verification failed: No secret token provided');
    return false;
  }

  // Use timing-safe comparison to prevent timing attacks
  try {
    const expectedBuffer = Buffer.from(secret, 'utf8');
    const providedBuffer = Buffer.from(providedSecret, 'utf8');
    
    if (expectedBuffer.length !== providedBuffer.length) {
      console.warn('Webhook verification failed: Invalid secret token length');
      return false;
    }
    
    const isValid = crypto.timingSafeEqual(expectedBuffer, providedBuffer);
    if (!isValid) {
      console.warn('Webhook verification failed: Invalid secret token');
    }
    return isValid;
  } catch (error) {
    console.error('Webhook verification error:', error.message);
    return false;
  }
}
```

**Required Configuration:**

Set in production environment:
```bash
# Generate a secure random token (32+ characters)
WEBHOOK_SECRET=$(openssl rand -hex 32)

# Store in Railway/production environment
export WEBHOOK_SECRET=$WEBHOOK_SECRET
```

**Option 2: Require Explicit Opt-In**

If backward compatibility is needed, require explicit configuration:

```javascript
const verifyWebhookSecret = (req) => {
  const secret = config.telegram.webhookSecret;
  
  // Require explicit ALLOW_UNVERIFIED_WEBHOOK in development only
  if (!secret) {
    if (process.env.NODE_ENV !== 'development' || !process.env.ALLOW_UNVERIFIED_WEBHOOK) {
      console.error('CRITICAL: WEBHOOK_SECRET not configured');
      console.error('Set WEBHOOK_SECRET env var or set ALLOW_UNVERIFIED_WEBHOOK=true in development');
      return false;
    }
    console.warn('⚠️ WARNING: Webhook verification disabled (development only)');
    return true;
  }
  // ... rest of verification code ...
};
```

---

### 3. Webhook Secret Not Passed to Telegram During Registration

**Severity:** P0 - CRITICAL (Related to #2)  
**Exploitability:** MEDIUM - requires webhook secret to be set, but may not be used  
**Files:**
- `/automation/telegram-bot/src/webhook.js` (lines 967-979)

**Attack Vector:**
Even when `WEBHOOK_SECRET` is configured in the environment, the code attempts to pass it to Telegram's `setWebhook` API, but the response handling doesn't validate that Telegram accepted it.

**Code Snippet (Vulnerable):**
```javascript
// src/webhook.js lines 967-979
const webhookOptions = {
  url: webhookUrl,
};

if (config.telegram.webhookSecret) {
  webhookOptions.secret_token = config.telegram.webhookSecret;
  console.log('Webhook secret token configured for enhanced security');
}

await bot.telegram.setWebhook(webhookOptions.url, {
  secret_token: webhookOptions.secret_token
});
```

**Specific Fix with Code:**

```javascript
// src/webhook.js - Enhanced webhook setup with validation

async function setupWebhookWithValidation() {
  const webhookUrl = `${config.telegram.webhookUrl}/webhook`;
  const secret = config.telegram.webhookSecret;
  
  if (!secret) {
    throw new Error('WEBHOOK_SECRET is required for secure webhook setup');
  }

  try {
    // Set webhook with secret token
    await bot.telegram.setWebhook(webhookUrl, {
      secret_token: secret
    });
    
    // Verify webhook was set correctly
    const webhookInfo = await bot.telegram.getWebhookInfo();
    
    // Validate webhook was set correctly
    if (webhookInfo.url !== webhookUrl) {
      throw new Error(`Webhook URL mismatch: expected ${webhookUrl}, got ${webhookInfo.url}`);
    }
    
    if (!webhookInfo.secret_token_set) {
      throw new Error('CRITICAL: Webhook secret token was NOT set by Telegram. Webhook is unprotected!');
    }
    
    console.log('✓ Webhook configured successfully with secret token');
    return {
      success: true,
      webhook_url: webhookUrl,
      has_secret: true
    };
  } catch (error) {
    console.error('Failed to set up secure webhook:', error.message);
    throw error;
  }
}
```

---

## P1 HIGH VULNERABILITIES

### 1. Error Message Exposure in Response Bodies

**Severity:** P1 - HIGH  
**Exploitability:** MEDIUM - reveals internal details  
**Files:**
- `/automation/telegram-bot/server.js` (lines 261, 353, 381)
- `/automation/telegram-bot/src/webhook.js` (lines 259-262, 350-355, 379-382)

**Attack Vector:**
Error messages containing sensitive information (API keys, file paths, internal error details) are being returned in HTTP responses. An attacker can use this information for further attacks.

**Code Snippet (Vulnerable):**
```javascript
// server.js line 381
res.json({ ok: true, error: error.message });  // ⚠️ Leaks error.message

// server.js line 353
message: error.message,  // ⚠️ Exposes full error details

// server.js line 261
error: error.message     // ⚠️ Exposes error details
```

**Example Leakage:**
```
// Attacker sees:
{
  "error": "Failed to read log file: GitHub authentication failed: Bad credentials"
}

// Or:
{
  "message": "ENOENT: no such file or directory, open '/home/user/nutrition-tracking/data/logs/2025-11/06.yaml'"
}
```

**Specific Fix with Code:**

Implement a centralized error sanitization function:

```javascript
// src/error-handler.js (NEW FILE)

const SAFE_ERROR_MESSAGES = {
  'GitHub authentication failed': 'Failed to access data storage. Please contact support.',
  'rate limit': 'Service is busy. Please try again in a few moments.',
  'timeout': 'Request took too long. Please try again.',
  'ENOENT': 'Data storage temporarily unavailable.',
  'EACCES': 'Access denied. Please contact support.',
  'network': 'Network connection error. Please check your internet.',
  'Invalid JSON': 'Invalid request format.',
  'Failed to read log file': 'Failed to access records. Please try again.',
  'Failed to commit': 'Failed to save data. Please try again.',
};

function sanitizeErrorForResponse(error, isDevelopment = false) {
  // In development, return full error for debugging
  if (isDevelopment) {
    return {
      error: error.message,
      details: error.stack
    };
  }

  // In production, return safe generic message
  const message = String(error.message || error);
  
  for (const [keyword, safeMessage] of Object.entries(SAFE_ERROR_MESSAGES)) {
    if (message.includes(keyword)) {
      return {
        error: safeMessage
      };
    }
  }

  // Default generic error
  return {
    error: 'An error occurred. Please try again or contact support if the issue persists.'
  };
}

module.exports = { sanitizeErrorForResponse };
```

**Updated Code:**

```javascript
// server.js - lines 348-356

const { sanitizeErrorForResponse } = require('./src/error-handler');

app.get('/setup', async (req, res) => {
  try {
    // ... existing code ...
  } catch (error) {
    console.error('Webhook setup failed:', error); // Log full error internally
    
    const safeError = sanitizeErrorForResponse(
      error,
      process.env.NODE_ENV === 'development'
    );
    
    res.status(500).json({
      success: false,
      ...safeError
    });
  }
});

// server.js - lines 378-382 (POST /webhook handler)

app.post('/webhook', async (req, res) => {
  try {
    // ... existing code ...
  } catch (error) {
    console.error('Webhook handler error:', error);
    
    const safeError = sanitizeErrorForResponse(
      error,
      process.env.NODE_ENV === 'development'
    );
    
    // Still send 200 to avoid Telegram retries
    res.json({ 
      ok: true,
      ...safeError 
    });
  }
});
```

---

### 2. Information Disclosure: Telegram API Error Messages in Responses

**Severity:** P1 - HIGH  
**Exploitability:** MEDIUM - reveals Telegram API details  
**Files:**
- `/automation/telegram-bot/server.js` (lines 163, 345)

**Attack Vector:**
The `/setup` endpoint returns raw Telegram API error messages which could reveal information about the Telegram bot configuration or API internals.

**Code Snippet (Vulnerable):**
```javascript
// server.js lines 158-165
res.end(JSON.stringify({
  success: true,
  message: 'Webhook configured successfully',
  webhook_url: webhookUrl,
  webhook_info: {
    url: webhookInfo.url,
    has_custom_certificate: webhookInfo.has_custom_certificate,
    pending_update_count: webhookInfo.pending_update_count,
    last_error_date: webhookInfo.last_error_date,
    last_error_message: webhookInfo.last_error_message  // ⚠️ LEAKS ERROR
  }
}, null, 2));
```

**Specific Fix with Code:**

```javascript
// server.js - Remove sensitive Telegram error messages

app.get('/setup', async (req, res) => {
  try {
    const webhookUrl = `${WEBHOOK_URL}/webhook`;
    const webhookOptions = {};
    if (config.telegram.webhookSecret) {
      webhookOptions.secret_token = config.telegram.webhookSecret;
    }
    await webhook.bot.telegram.setWebhook(webhookUrl, webhookOptions);
    const webhookInfo = await webhook.bot.telegram.getWebhookInfo();

    // Log full info internally for debugging
    console.log('Webhook setup complete:', {
      url: webhookInfo.url,
      has_custom_certificate: webhookInfo.has_custom_certificate,
      pending_update_count: webhookInfo.pending_update_count,
      last_error_date: webhookInfo.last_error_date,
      last_error_message: webhookInfo.last_error_message
    });

    // Return only safe information to caller
    res.json({
      success: true,
      message: 'Webhook configured successfully',
      webhook_url: webhookUrl,
      // Only return non-sensitive data
      pending_updates: webhookInfo.pending_update_count || 0
      // DO NOT return: last_error_date, last_error_message, custom_certificate status
    });
  } catch (error) {
    console.error('Webhook setup failed:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to configure webhook'
      // DO NOT return error.message - use sanitizeErrorForResponse()
    });
  }
});
```

---

### 3. Missing YAML Injection Prevention

**Severity:** P1 - HIGH  
**Exploitability:** LOW-MEDIUM (requires GitHub compromise or MITM)  
**Files:**
- `/automation/telegram-bot/src/github-integration.js` (line 137)

**Attack Vector:**
The code uses `yaml.load()` without safe mode. While the data comes from GitHub (trusted source), this creates a vulnerability if GitHub is compromised or if YAML content is modified in transit (though TLS should prevent this).

A malicious YAML file could execute arbitrary code through YAML deserialization gadgets.

**Code Snippet (Vulnerable):**
```javascript
// src/github-integration.js line 137
const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
const logData = yaml.load(content);  // ⚠️ No safe mode
```

**Specific Fix with Code:**

```javascript
// src/github-integration.js line 137

// Use safe YAML loading to prevent code execution
const logData = yaml.load(content, {
  // Only allow safe YAML types, prevent arbitrary object instantiation
  onWarning: (warning) => {
    console.warn('YAML warning:', warning.message);
  }
});

// Or use safer alternative with limited schema:
const SafeSchema = yaml.DEFAULT_SCHEMA;

const logData = yaml.load(content, {
  schema: SafeSchema,
  onWarning: (warning) => {
    if (warning.name === 'YAMLWarning') {
      console.warn('Unsafe YAML detected:', warning.message);
      throw new Error('Unsafe YAML content in log file');
    }
  }
});

// Even better: validate the YAML structure after loading
function validateLogStructure(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid log file structure: not an object');
  }
  
  if (!Array.isArray(data.entries)) {
    throw new Error('Invalid log file structure: entries is not an array');
  }
  
  // Verify each entry is a plain object with expected properties
  for (const entry of data.entries) {
    if (typeof entry !== 'object' || entry === null) {
      throw new Error('Invalid entry: not a plain object');
    }
    
    if (!Array.isArray(entry.items)) {
      throw new Error('Invalid entry structure: items is not an array');
    }
  }
  
  return data;
}

// Usage:
const logData = yaml.load(content);
const validatedData = validateLogStructure(logData);
```

**Recommended Implementation:**

```javascript
// src/github-integration.js - Updated getOrCreateLogFile method

async getOrCreateLogFile(date = null) {
  const path = this.getLogFilePath(date);
  const url = `${this.apiUrl}/repos/${this.owner}/${this.repo}/contents/${path}`;

  try {
    this.checkRateLimit();
    
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/vnd.github.v3+json',
      },
      params: {
        ref: this.branch,
      },
      timeout: 30000
    });

    // Safely decode and parse YAML
    const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
    
    // Use safe YAML loading
    const logData = yaml.load(content, {
      onWarning: (warning) => {
        console.warn(`YAML parsing warning in ${path}:`, warning.message);
      }
    });

    // Validate structure to prevent injection attacks
    if (!this._validateLogStructure(logData)) {
      throw new Error('Invalid log file structure - possible YAML injection attempt');
    }

    return {
      exists: true,
      sha: response.data.sha,
      data: logData,
      path: path,
    };
  } catch (error) {
    // ... existing error handling ...
  }
}

_validateLogStructure(data) {
  // Verify it's a plain object
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return false;
  }
  
  // Verify required fields are present and correct type
  if (!Array.isArray(data.entries)) {
    return false;
  }
  
  // Verify each entry
  for (const entry of data.entries) {
    if (typeof entry !== 'object' || Array.isArray(entry) || entry === null) {
      return false;
    }
    if (!Array.isArray(entry.items)) {
      return false;
    }
  }
  
  return true;
}
```

---

## Summary Table

| Vulnerability | Severity | File | Line(s) | Status |
|---------------|----------|------|---------|--------|
| Unauthenticated /setup endpoint | P0 | server.js | 318-357 | CRITICAL |
| Webhook secret verification disabled by default | P0 | server.js, webhook.js | 185-187, 323-325 | CRITICAL |
| Error message exposure in responses | P1 | server.js | 261, 353, 381 | HIGH |
| Telegram API error disclosure | P1 | server.js | 163, 345 | HIGH |
| Missing YAML injection prevention | P1 | github-integration.js | 137 | HIGH |

---

## Remediation Priority

1. **IMMEDIATE (Today):**
   - Fix P0: Add authentication to /setup endpoint
   - Fix P0: Require WEBHOOK_SECRET in production

2. **URGENT (This week):**
   - Fix P1: Sanitize error messages in responses
   - Fix P1: Remove Telegram API errors from responses
   - Fix P1: Add YAML validation

3. **RECOMMENDED (This sprint):**
   - Add security test coverage
   - Implement request signing for setup endpoint
   - Add audit logging for all administrative actions

---

## Testing Recommendations

```bash
# Test 1: Verify /setup requires authentication
curl -X GET http://localhost:3000/setup
# Should return 401/403 Unauthorized

# Test 2: Verify webhook secret is required
curl -X POST http://localhost:3000/webhook -d '{}' 
# Should return 401 Unauthorized (if secret configured)

# Test 3: Verify error messages are sanitized
curl -X POST http://localhost:3000/webhook \
  -H "x-telegram-bot-api-secret-token: invalid" \
  -d '{}'
# Should not expose sensitive file paths or API details

# Test 4: Verify YAML loading is safe
# Create a malicious YAML file in test data
# Verify it doesn't execute arbitrary code
```

