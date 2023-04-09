let { onCommand, loadLanguage, emojiMix } = require('../main/');
let { mix_desc, mix_need, inv_format_mix, inv_char_mix, mix_not_sup } = loadLanguage();

onCommand(
  {
   command: 'mix',
   desc: mix_desc,
   category: ['misc']
  }, async (msg, text, client) => {

   if (!text[1]) return await msg.reply(mix_need);
   if (!text[1].includes('/')) return await msg.reply(inv_format_mix);
   let emo1 = text[1].split('/')[0], emo2 = text[1].split('/')[1];
   let emojiReg = /[\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E6}-\u{1F1FF}]/gu
   if (!emo1.match(emojiReg) || !emo2.match(emojiReg)) return await msg.reply(inv_char_mix);
   let url = await emojiMix(emo1, emo2);
   if (!url) return await msg.reply(mix_not_sup);
   await client.sendReply({ type: 'image', message: { url: url } });
});
