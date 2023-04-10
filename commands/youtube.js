let { onCommand, loadLanguage, youtube } = require('../main/');
let { yta_desc, yts_desc, video_desc, channel_desc, downloading, searching, yes, no, video_info, channel_info, need_query, not_found_query, yt_url_need, yt_url_invalid } = loadLanguage();

onCommand(
  {
   command: 'yta',
   desc: yta_desc,
   category: ['misc']
  }, async (msg, text, client) => {

  if (!text[1]) return await msg.reply(yt_url_need);
  let audio = await youtube('audio', text[1]);
  if (!audio) return await msg.reply(yt_url_invalid);
  await msg.reply(downloading);
  return await client.sendReply({ type: 'audio', message: audio });
});

onCommand(
  {
   command: 'yts',
   desc: yts_desc,
   category: ['misc']
  }, async (msg, text, client) => {

  if (!text[1]) return await msg.reply(need_query);
  let res = await youtube('search', text[1]);
  if (!res) return await msg.reply(not_found_query);
  await msg.reply(searching);
  let info = res.map((video) => `*${video.title}* -\n${video.url}`).join('\n\n');
  await msg.reply(info);
});

onCommand(
  {
   command: 'channel',
   desc: channel_desc,
   category: ['misc']
  }, async (msg, text, client) => {

  if (!text[1]) return await msg.reply(need_query);
  let result = await youtube('info_channel', text[1]);
  if (!result) return await msg.reply(not_found_query);
  let info = channel_info.format(result.name, result.url, (result.subCount > 99999 ? yes : no), result.videoCount, result.videoCountLabel, result.subCount, result.subCountLabel);
  await client.sendReply({ type: 'image', message: { url: result.image }, caption: info });
});

onCommand(
  {
   command: 'video',
   desc: video_desc,
   category: ['misc']
  }, async (msg, text, client) => {

  if (!text[1]) return await msg.reply(yt_url_need);
  let result = await youtube('info_video', text[1]);
  if (!result) return await msg.reply(yt_url_invalid);
  let info = video_info.format(result.title, result.description, result.videoId, result.url, result.timestamp, result.seconds, result.views, result.ago, result.author.name);
  await msg.reply(info);
});
