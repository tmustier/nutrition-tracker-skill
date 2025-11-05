// Test webhook URL configuration
function testWebhookUrl(webhookUrl, railwayDomain) {
  const result = webhookUrl || 
    (railwayDomain 
      ? `https://${railwayDomain}`
      : 'http://localhost:3000');
  return result;
}

console.log('Testing webhook URL configuration:');
console.log('1. No env vars:', testWebhookUrl(undefined, undefined));
console.log('2. Railway only:', testWebhookUrl(undefined, 'myapp.railway.app'));
console.log('3. WEBHOOK_URL only:', testWebhookUrl('https://example.com', undefined));
console.log('4. Both set (should use WEBHOOK_URL):', testWebhookUrl('https://example.com', 'myapp.railway.app'));
console.log('5. Empty WEBHOOK_URL with Railway:', testWebhookUrl('', 'myapp.railway.app'));