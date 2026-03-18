const https = require('https');
const fs = require('fs');

const options = {
  hostname: 'www.svgrepo.com',
  path: '/show/275990/india.svg',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }
};

https.get(options, (res) => {
  if (res.statusCode === 200) {
    res.pipe(fs.createWriteStream('public/india-map.svg'));
    console.log('SVG Map downloaded successfully.');
  } else if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
     https.get(res.headers.location, (res2) => {
         res2.pipe(fs.createWriteStream('public/india-map.svg'));
         console.log('SVG Map downloaded successfully after redirect.');
     });
  } else {
    console.error('Failed to download: ', res.statusCode);
  }
}).on('error', (err) => {
  console.error('Error: ', err.message);
});
