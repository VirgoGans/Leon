let { onCommand, loadLanguage, toSticker, textToFont, getExif, addExif } = require('../main/');
let { sticker_desc, take_desc, getexif_desc, url_desc, mp4_desc, mp3_desc, png_desc, audio_desc, ptt_desc, document_desc, font_desc, need_reply_iv, need_iv_only, need_sticker, need_sticker_only, need_pack_auth, format_error_take, sticker_exif, need_nanim_sticker, need_video, need_video_only, need_audio, need_aud_only, need_ptt, need_ptt_only, reply_media, unsupported_media } = loadLanguage();
let fs = require('fs');
let config = require('../main/config');
let ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(require('@ffmpeg-installer/ffmpeg').path);

onCommand(
  {
   command: 'sticker',
   desc: sticker_desc,
   category: ['misc']
  }, async (msg, text, client) => {

  if (!msg.replied) return await msg.reply(need_reply_iv);
  if (!msg.replied.image && !msg.replied.video) return await msg.reply(need_iv_only);
  let media = await msg.load(msg.replied.image ? msg.replied.image : msg.replied.video);
  let webp = await toSticker((msg.replied.image ? 'image' : 'video'), media, { packname: 'Leon', author: 'Created 2B UniQ' });
  return await client.sendMessage(msg.chat, { sticker: webp, mimetype: 'image/webp' });
});

onCommand(
  {
   command: 'take',
   desc: take_desc,
   category: ['misc']
  }, async (msg, text, client) => {

  if (!msg.replied) return await msg.reply(need_sticker);
  if (!msg.replied.sticker) return await msg.reply(need_sticker_only);
  if (!text[1]) return await msg.reply(need_pack_auth);
  if (!text[1].includes('/')) return await msg.reply(format_error_take);
  let [packname, author] = text[1].split('/');
  let sticker = await msg.load(msg.replied.sticker);
  sticker = await addExif(sticker, { packname: packname, author: author });
  return await client.sendMessage(msg.chat, { sticker, mimetype: msg.replied.sticker.mimetype });
});

onCommand(
  {
   command: 'getexif',
   desc: getexif_desc,
   category: ['misc']
  }, async (msg, text, client) => {

  if (!msg.replied) return await msg.reply(need_sticker);
  if (!msg.replied.sticker) return await msg.reply(need_sticker_only);
  let exif = await getExif(await msg.load(msg.replied.sticker));
  await msg.reply(sticker_exif.format(exif.packname, exif.author));
});

onCommand(
  {
   command: 'png',
   desc: png_desc,
   category: ['misc']
  }, async (msg, text, client) => {

  if (!msg.replied) return await msg.reply(need_sticker);
  if (!msg.replied.sticker) return await msg.reply(need_sticker_only);
  if (msg.replied.sticker.isAnimated) return await msg.reply(need_nanim_sticker);
  let media = await msg.load(msg.replied.sticker);
  fs.writeFileSync('image.webp', media);
  ffmpeg('image.webp').fromFormat('webp_pipe').save('image.png').on('end', async () => {
   await client.sendMessage(msg.chat, { image: fs.readFileSync('image.png'), mimetype: 'image/png' }, { quoted: msg });
   fs.unlinkSync('image.webp');
  });
});

onCommand(
  {
   command: 'mp3',
   desc: mp3_desc,
   category: ['misc']
  }, async (msg, text, client) => {

  if (!msg.replied) return await msg.reply(need_video);
  if (!msg.replied.video) return await msg.reply(need_video_only);
  let media = await msg.load(msg.replied.video);
  fs.writeFileSync('video.mp4', media);
  ffmpeg('video.mp4').save('audio.mp3').on('end', async () => {
   await client.sendMessage(msg.chat, { audio: fs.readFileSync('audio.mp3'), mimetype: 'audio/mpeg' }, { quoted: msg });
   fs.unlinkSync('video.mp4');
  });
});

onCommand(
  {
   command: 'ptt',
   desc: ptt_desc,
   category: ['misc']
  }, async (msg, text, client) => {

  if (!msg.replied) return await msg.reply(need_audio);
  if (!msg.replied.audio || msg.replied.audio.ptt) return await msg.reply(need_aud_only);
  await client.sendMessage(msg.chat, { audio: (await msg.load(msg.replied.audio)), ptt: true, mimetype: 'audio/ogg; codecs=opus', waveform: Array(40).fill().map(() => Math.floor(Math.random() * 99)) }, { quoted: msg });
});

onCommand(
  {
   command: 'audio',
   desc: audio_desc,
   category: ['misc']
  }, async (msg, text, client) => {

  if (!msg.replied) return await msg.reply(need_ptt);
  if (!msg.replied.audio || !msg.replied.audio.ptt) return await msg.reply(need_ptt_only);
  await client.sendMessage(msg.chat, { audio: (await msg.load(msg.replied.audio)), ptt: false, mimetype: 'audio/mpeg' }, { quoted: msg });
});

onCommand(
  {
   command: 'font',
   desc: font_desc,
   category: ['misc']
  }, async (msg, text, client) => {

   if (!msg.replied) return msg.reply(need_reply_text);
   if (!msg.replied.text) return await msg.reply(reply_text_only);
   let result = false
   if (text[1] !== '' && !isNaN(text[1])) result = await textToFont(msg.replied.text, text[1]);
   else result = await textToFont(msg.replied.text, 'list');
   return await msg.reply(result);
});

onCommand(
  {
   command: 'document',
   desc: document_desc,
   category: ['misc']
  }, async (msg, text, client) => {

  if (!msg.replied) return msg.reply(reply_media);
  let file = await msg.load(msg.replied);
  if (msg.replied.image == true) {
   await client.sendMessage(msg.chat, { document: { url: file }, mimetype: 'image/png', fileName: (text[1] !== '' ? text[1] : 'file.png') }, { quoted: msg })
  } else if (msg.replied.video == true) {
   await client.sendMessage(msg.chat, { document: { url: file }, mimetype: 'video/mpeg', fileName: (text[1] !== '' ? text[1] : 'file.mp4') }, { quoted: msg })
  } else if (msg.replied.audio == true) {
   await client.sendMessage(msg.chat, { document: { url: file }, mimetype: 'audio/ogg', fileName: (text[1] !== '' ? text[1] : 'file.mp3') }, { quoted: msg })
  } else if (msg.replied.sticker == true) {
   await client.sendMessage(msg.chat, { document: { url: file }, mimetype: 'image/webp', fileName: (text[1] !== '' ? text[1] : 'file.webp') }, { quoted: msg })
  } else if (msg.replied.text == true) {
   await client.sendMessage(msg.chat, { document: { url: file }, mimetype: 'text/plain', fileName: (text[1] !== '' ? text[1] : 'file.txt') }, { quoted: msg })
  } else {
   return await msg.reply(unsupported_media);
  }
});
