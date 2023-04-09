let { onCommand, loadLanguage, cut } = require('../main/');
let { need_aud_vid, need_audvid_only, need_timeline, greater_timeline } = loadLanguage();
let config = require('../main/config');
let { exec } = require('child_process');
let fs = require('fs');
let ffmpeg = require('fluent-ffmpeg');

onCommand(
  {
   command: 'cut',
   desc: 'cut',
   category: ['misc']
  }, async (msg, text, client) => {

  if (!msg.replied) return await msg.reply(need_aud_vid);
  if (!text[1]) return await msg.reply(need_timeline.format(config.PREFIX));
  if (!msg.replied.audio && !msg.replied.video) return await msg.reply(need_audvid_only);

  let startTime = '00:00', endTime = '00:00';
  if (text[1].includes(' ')) {
   [startTime, endTime] = text[1].split(' ');
  } else {
   endTime = text[1];
  }

  let media = await msg.load(msg.replied.audio ? msg.replied.audio : msg.replied.video);
  let ext = msg.replied.audio ? '.mp3' : '.mp4';
  fs.writeFileSync('media'+ext, media);
  let res = await cut('media'+ext, startTime, endTime, msg.replied);
  exec(res.command, async (err, stderr, stdout) => {
   if (err) return await msg.reply(greater_timeline);
   if (res.audio !== false) {
    await client.sendReply({ type: 'audio', message: fs.readFileSync('output'+ext) });
   }
   else {
    await client.sendReply({ type: 'video', message: fs.readFileSync('output'+ext) });
   }
   fs.unlinkSync('output'+ext);
   fs.unlinkSync('media'+ext);
  });
});
