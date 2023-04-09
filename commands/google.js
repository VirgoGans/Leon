let { onCommand, loadLanguage } = require('../main/');
let config = require('../main/config');
let prefix = config.PREFIX
let { tts_desc, need_text, long_text, invalid_lang, tr_desc, tr_need, need_lang_tr, image_desc, need_query, banned_query, downloading_image } = loadLanguage();
let gtts = require('google-tts-api');
let g_i_s = require('g-i-s');
let translator = require('translate-google-api');

onCommand(
  {
   command: 'tts',
   desc: tts_desc,
   category: ['misc']
  }, async (msg, text, client) => {

  let ttsText = text[1] !== '' ? text[1] : msg.replied && msg.replied.text ? msg.replied.text : false
  if (!ttsText) return await msg.reply(need_text)
  let lang = 'en', ttsMessage = ttsText, isSlow = false
  if (langMatch = ttsMessage.match('\\{([a-zA-Z]{2})\\}')) lang = langMatch[1], ttsMessage = ttsMessage.replace(langMatch[0], '')
  if (ttsMessage.includes('{slow}')) ttsMessage = ttsMessage.replace(/{slow}/g, ''), isSlow = true
  if (ttsMessage.length > 200) return await msg.reply(long_text)
  let audio = false;
  try {
   audio = await gtts.getAudioUrl(ttsMessage, { lang: lang, slow: isSlow, host: 'https://translate.google.com' });
  } catch {
   return await msg.reply(invalid_lang.format(prefix));
  }
  return await client.sendMessage(msg.chat, { audio: { url: audio }, ptt: true, mimetype: 'audio/mpeg', waveform: Array(40).fill().map(() => Math.floor(Math.random() * 99)) }, { quoted: msg })
});

onCommand(
  {
   command: 'tr',
   desc: tr_desc,
   category: ['misc']
  }, async (msg, text, client) => {

  let query = text[1] !== '' ? text[1] : msg.replied.text ? msg.replied.text : false
  if (!query) return await msg.reply(tr_need);
  if (lang = query.match('\\{([a-zA-Z]{2})\\}')) {
   lang = lang[1]
  } else {
   return await msg.reply(need_lang_tr);
  }
  let result = await translator(query.replace(/\{([a-zA-Z]{2})\}/g, ''), { tld: 'com', to: lang });
  await msg.reply(result[0]);
});

onCommand(
  {
   command: 'image',
   desc: image_desc,
   category: ['misc']
  }, async (msg, text, client) => {

  if (!text[1]) return await msg.reply(need_query);
  if (/(porn|xxx|x-rated|adult|sex|nude|erotic|playboy|penthouse|strip|pornographic|liplock|🍑|🍌|🍆|buttock|vagina|dick|penis|pussy)/.test(text[1])) return await msg.reply(banned_query);
  let cl;
  if (cl = text[1].match('\\{([0-9]{1})\\}')) {
   cl = cl[1]
  } else {
   cl = 5
  }
  await msg.reply(downloading_image.format(cl));
  await g_i_s(text[1], async (error, result) => {
    let count = []
    count.length = cl
    for (let c of count) {
     let url = result[Math.floor(Math.random() * result.length)].url
     await client.sendMessage(msg.chat, { image: { url: url }, mimetype: 'image/png' });
    }
  });
});
