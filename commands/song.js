let { onCommand, loadLanguage, findSong } = require('../main/');
let { find_desc, need_audio, need_aud_only, find_failed, find_info, song_desc, need_song, song_not_found, downloading, unknown } = loadLanguage();
let { downloadSong } = require('../main/main');

onCommand(
  {
   command: 'song',
   desc: song_desc,
   category: ['misc']
  }, async (msg, text, client) => {

  if (!text[1]) return await msg.reply(need_song);
  let audio = await downloadSong(text[1]);
  if (!audio) return await msg.reply(song_not_found);
  await msg.reply(downloading);
  return await client.sendReply({ type: 'audio', message: audio });
});

onCommand(
  {
   command: 'find',
   desc: find_desc,
   category: ['misc']
  }, async (msg, text, client) => {

  if (!msg.replied) return await msg.reply(need_audio);
  if (!msg.replied.audio) return await msg.reply(need_audio_only);
  if (msg.replied.audio.seconds > 60) return await msg.reply(audio_length_exceed);
  let audio = await findSong(await msg.load(msg.replied.audio));
  if (!audio) return await msg.reply(find_failed);
  await msg.reply(find_info.format(audio.title, audio.artists?.map((artist) => artist.name).join(' '), (audio.release_date).split('-').reverse().join('-'), (audio.album.name || ''), (audio.genres ? audio.genres.map((genre) => genre).join(' ') : unknown)));
});
