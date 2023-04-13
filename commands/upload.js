let { onCommand, loadLanguage, bufferFrom, isURL, upload } = require('../main/');
let { upload_desc, need_image, need_image_only, download_desc, upload_url, upload_url_inv, inv_key_imgbb, missing_key_imgbb, unable_down, unable_download } = loadLanguage();
let axios = require('axios');

onCommand(
  {
   command: 'upload',
   desc: upload_desc,
   category: ['misc']
  }, async (msg, text, client) => {

  if (!msg.replied) return await msg.reply(need_image);
  if (!msg.replied.image) return await msg.reply(need_image_only);
  let media = await msg.load(msg.replied.image);
  let res = await upload(media);
  if (res == 'missing_key') return await msg.reply(missing_key_imgbb);
  if (!res) return await msg.reply(inv_key_imgbb);
  await msg.reply(res);
});

onCommand(
  {
   command: 'download',
   desc: download_desc,
   category: ['misc']
  }, async (msg, text, client) => {

  if (!text[1]) return await msg.reply(upload_url);
  if (!isURL(text[1])) return await msg.reply(upload_url_inv);
  return await axios.head(text[1]).then(async (response) => {
   let mime;
   if (mime = response.headers['content-type']) {
     await client.sendReply({ type: (mime.split('/')[0] == 'application' ? 'document' : mime.split('/')[0]), message: { url: text[1] }, mimetype: mime })
      .then(() => '')
      .catch(async (_) => await msg.reply(unable_down));
   } else {
     await msg.reply(unable_download);
    }
  })
   .catch(async () => {
    await msg.reply(unable_download);
  });
});
