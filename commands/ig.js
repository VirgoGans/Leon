let { onCommand, loadLanguage } = require('../main/');
let { ig_desc, need_ig_url, invalid_ig_url, downloading } = loadLanguage();
let downloadPost = require('instagram-url-direct');
let fs = require('fs');
let ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(require('@ffmpeg-installer/ffmpeg').path);

onCommand(
  {
   command: 'ig',
   desc: ig_desc,
   category: ['misc']
  }, async (msg, text, client) => {

  if (!text[1]) return await msg.reply(need_ig_url);
  if (!text[1].match(/https?:\/\/(?:www\.)?instagram\.com(?:\/[^\/]+)?\/(?:p|reel)\/([^\/?#&]+)/)) return await msg.reply(invalid_ig_url);
  let results = await downloadPost(text[1]);
  await msg.reply(downloading);
  if (text[1].includes('/reel/')) {
   await client.sendMessage(msg.chat, { video: { url: results.url_list[0] }, mimetype: 'video/mpeg', thumbnail: Buffer.alloc(0) });
  } else {
   await client.sendMessage(msg.chat, { image: { url: results.url_list[0] }, mimetype: 'image/png', thumbnail: Buffer.alloc(0) });
  }
});
