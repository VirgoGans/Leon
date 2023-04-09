let { onCommand, loadLanguage, isURL, generatePDF, getScreenShot } = require('../main/');
let { ss_desc, spdf_desc, ss_need, ss_invalid } = loadLanguage();

onCommand(
  {
   command: 'ss',
   desc: ss_desc,
   category: ['misc']
  }, async (msg, text, client) => {

   if (!text[1]) return await msg.reply(ss_need);
   if (!isURL(text[1])) return await msg.reply(ss_invalid);
   try { await client.sendMessage(msg.chat, { image: (await getScreenShot(text[1])), mimetype: 'image/png', thumbnail: Buffer.alloc(0) }, { quoted: msg }) } catch { return await msg.reply(ss_invalid) };
});

onCommand(
  {
   command: 'spdf',
   desc: spdf_desc,
   category: ['misc']
  }, async (msg, text, client) => {

   if (!text[1]) return await msg.reply(ss_need);
   if (!isURL(text[1])) return await msg.reply(ss_invalid);
   let pdf = await generatePDF(text[1]);
   try { await client.sendMessage(msg.chat, { document: pdf, mimetype: 'application/pdf', fileName: text[1] }, { quoted: msg }) } catch { return await msg.reply(ss_invalid) };
});
