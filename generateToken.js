// const fs = require('fs');
// const readline = require('readline');
// const { google } = require('googleapis');
// const path = require('path');

// // Đường dẫn đến file
// const CREDENTIALS_PATH = path.join(__dirname, 'config/credentials.json');
// const TOKEN_PATH = path.join(__dirname, 'config/token.json');

// // Scopes
// const SCOPES = ['https://www.googleapis.com/auth/drive'];

// // Đọc thông tin xác thực
// const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
// const { client_secret, client_id, redirect_uris } = credentials.web;
// const oAuth2Client = new google.auth.OAuth2(
//   client_id, client_secret, redirect_uris[0]
// );

// // Tạo URL xác thực
// const authUrl = oAuth2Client.generateAuthUrl({
//   access_type: 'offline',
//   scope: SCOPES,
// });

// console.log('Authorize this app by visiting this URL:', authUrl);

// // Tạo interface để nhập code
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// // Nhận code và lưu token
// rl.question('Enter the code from that page here: ', (code) => {
//   rl.close();
//   oAuth2Client.getToken(code, (err, token) => {
//     if (err) return console.error('Error retrieving access token', err);
    
//     // Lưu token vào file
//     fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
//     console.log('Token stored to', TOKEN_PATH);
//   });
// });