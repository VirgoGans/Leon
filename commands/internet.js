let { onCommand, loadLanguage, fetchJson, fetchLyrics, truecaller, bufferFrom } = require('../main/');
let { compliment_desc, joke_desc, quote_desc, lyrics_desc, tti_desc, truecaller_desc, need_song, gpt_desc, chat_gpt, missing_openai, expired_openai, lyrics_nf, need_prompt, need_num, inv_num_true } = loadLanguage();
let fs = require('fs');
let ai = require('../main/ai');
let ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
let ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

onCommand(
  {
   command: 'compliment',
   desc: compliment_desc,
   category: ['misc']
  }, async (msg, text, client) => {

   let json = await fetchJson('https://complimentr.com/api');
   await msg.reply('*' + json.compliment.split('')[0].toUpperCase() + json.compliment.substring(1) + '*');
});

onCommand(
  {
   command: 'joke',
   desc: joke_desc,
   category: ['misc']
  }, async (msg, text, client) => {

   let json = await fetchJson('https://official-joke-api.appspot.com/random_joke');
   await msg.reply('*' + json.setup + ' ' + json.punchline.toUpperCase() + '*');
});

onCommand(
  {
   command: 'quote',
   desc: quote_desc,
   category: ['misc']
  }, async (msg, text, client) => {

   let json = await fetchJson('https://api.quotable.io/random');
   await msg.reply('*' + json.content + '*\n_~ ' + json.author.toUpperCase() + '_');
});

onCommand(
  {
   command: 'lyrics',
   desc: lyrics_desc,
   category: ['misc']
  }, async (msg, text, client) => {

   if (!text[1]) return await msg.reply(need_song);
   let result = await fetchLyrics(text[1]);
   if (!result) return await msg.reply(lyrics_nf);
   return await msg.reply(result);
});

onCommand(
  {
   command: 'gpt',
   desc: gpt_desc,
   category: ['misc']
  }, async (msg, text, client) => {

  if (!text[1]) return await msg.reply(chat_gpt);
  let response = await ai.chatgpt(text[1]);
  if (config.OPENAIKEY == 'false') return await msg.reply(missing_openai);
  if (!response) return await msg.reply(expired_openai);
  return await msg.reply('```'+response+'```');
});

onCommand(
  {
   command: 'tti',
   desc: tti_desc,
   category: ['misc']
  }, async (msg, text, client) => {

  if (!text[1]) return await msg.reply(need_prompt);
  let url = await ai.textToImage(text[1]);
  if (config.OPENAIKEY == 'false') return await msg.reply(missing_openai);
  if (!url) return await msg.reply(expired_openai);
  return await client.sendReply({ type: 'image', message: { url } });
});

onCommand(
  {
   command: 'truecaller',
   desc: truecaller_desc,
   category: ['misc']
  }, async (msg, text, client) => {

  if (!text[1]) return await msg.reply(need_num);
  let result = await truecaller(text[1]);
  if (!result) return await msg.reply(inv_num_true);
  return await msg.reply(result);
});
