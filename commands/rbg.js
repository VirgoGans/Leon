let { onCommand, loadLanguage, removeBackground } = require('../main/');
let { rbg_desc, need_image, need_image_only, missing_rbgkey } = loadLanguage();
let { exec } = require('child_process');
let fs = require('fs');
let config = require('../main/config');
let ffmpeg = require('fluent-ffmpeg');

onCommand(
  {
   command: 'rbg',
   desc: rbg_desc,
   category: ['misc']
  }, async (msg, text, client) => {

  if (!msg.replied) return await msg.reply(need_image);
  if (!msg.replied.image) return await msg.reply(need_image_only);

  let media = await msg.load(msg.replied.image);
  fs.writeFileSync('../src/image.png', media);
  let rbg = await removeBackground('../src/image.png', config.RBGKEY);
  if (!rbg) return await msg.reply(missing_rbgkey);

  await client.sendReply({ type: 'image', message: fs.readFileSync(rbg) });
  fs.unlinkSync('../src/image.png');
  fs.unlinkSync(rbg);
});
