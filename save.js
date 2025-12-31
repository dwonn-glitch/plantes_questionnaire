// Netlify Function – runs on Node.js (v18)

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const data = JSON.parse(event.body);

 // Write to a simple JSON file in the repo
  
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(__dirname, '..', 'responses.json');

  let existing = [];
  if (fs.existsSync(filePath)) {
    existing = JSON.parse(fs.readFileSync(filePath));
  }
  existing.push(data);
  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));

  return { statusCode: 200, body: 'OK' };
};
