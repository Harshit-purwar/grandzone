const https = require('https');

function makeRequest(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('Status:', res.statusCode);
        try { resolve(JSON.parse(data)); } catch { resolve(data); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body, 'binary');
    req.end();
  });
}

async function main() {
  // Step 1: Login
  console.log('--- Logging in ---');
  const loginBody = JSON.stringify({ email: 'admin@grandzone.com', password: 'admin123' });
  const loginRes = await makeRequest({
    hostname: 'grandzone-backen.onrender.com',
    path: '/api/admin/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginBody) }
  }, loginBody);
  
  console.log('Login response:', JSON.stringify(loginRes));
  
  if (!loginRes.token) {
    console.log('Login failed!');
    return;
  }

  // Step 2: Upload image
  console.log('\n--- Uploading image ---');
  const fs = require('fs');
  const path = require('path');
  const fileData = fs.readFileSync(path.join(__dirname, 'test.png'));
  const boundary = '----FormBoundary' + Math.random().toString(36).substring(2);

  const bodyParts = [
    `--${boundary}\r\n`,
    `Content-Disposition: form-data; name="image"; filename="test.png"\r\n`,
    `Content-Type: image/png\r\n`,
    `\r\n`,
  ];
  const header = bodyParts.join('');
  const footer = `\r\n--${boundary}--\r\n`;
  
  const fullBody = Buffer.concat([
    Buffer.from(header, 'utf8'),
    fileData,
    Buffer.from(footer, 'utf8')
  ]);

  const uploadRes = await makeRequest({
    hostname: 'grandzone-backen.onrender.com',
    path: '/api/upload/single',
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': fullBody.length,
      'Authorization': `Bearer ${loginRes.token}`
    }
  }, fullBody.toString('binary'));

  console.log('Upload response:', JSON.stringify(uploadRes));
}

main().catch(console.error);
