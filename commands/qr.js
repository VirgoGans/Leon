let { onCommand, loadLanguage } = require('../main/');
let { qr_desc, qr_need } = loadLanguage();
let qr = require('qrcode');

onCommand(
  {
   command: 'qr',
   desc: qr_desc,
   category: ['misc']
  }, async (msg, text, client) => {

  if (!text[1]) return await msg.reply(qr_need);
  let buffer = await qr.toDataURL(text[1]).then(async (url) => Buffer.from(url.replace('data:image/png;base64,', ''), 'base64'));
  return await client.sendReply({ type: 'image', message: buffer });
});
