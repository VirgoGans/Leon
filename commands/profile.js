let { onCommand, loadLanguage, fetchJson } = require('../main/');
let { pp_desc, jid_desc, name_desc, about_desc, block_desc, unblock_desc, blocklist_desc, create_desc, join_desc, info_desc, need_image, need_image_only, need_rt, er_text, suc_name, suc_about, block_already, unblock_already, blocked, unblocked, need_rm, block_list, blocklist_null, need_gc_subject, long_gc_subject, suc_created_gc, info_format, need_join_gc, invalid_gclink, unable_join, unable_join_inv } = loadLanguage();

onCommand(
  {
   command: 'pp',
   owner: true,
   desc: pp_desc,
   category: ['owner']
  }, async (msg, text, client) => {

  if (!msg.replied) return await msg.reply(need_image);
  if (!msg.replied.image) return await msg.reply(need_image_only);
  let image = await msg.load(msg.replied.image);
  await client.updateProfilePicture(msg.me, image);
  return await msg.reply(pp_suc);
});

onCommand(
  {
   command: 'id',
   desc: jid_desc,
   category: ['misc']
  }, async (msg, text, client) => {

   if (msg.mentions?.length > 0) {
     for (let user of msg.mentions) {
      await msg.reply(user);
     }
   } else if (msg.replied?.sender) {
     return await msg.reply(msg.replied.sender);
   } else {
     return await msg.reply(msg.chat);
   }
});

onCommand(
  {
   command: 'name',
   desc: name_desc,
   owner: true,
   category: ['owner']
  }, async (msg, text, client) => {

  if (!text[1] && !msg.replied) return await msg.reply(need_rt);
  if (text[1]) {
   await client.updateProfileName(msg.me, text[1]);
   return await msg.reply(suc_name.format(text[1]));
  } else if (msg.replied.text) {
   await client.updateProfileName(msg.me, msg.replied.text);
   return await msg.reply(suc_name.format(msg.replied.text));
  } else {
   return await msg.reply(er_text);
  }
});

onCommand(
  {
   command: 'about',
   desc: about_desc,
   owner: true,
   category: ['owner']
  }, async (msg, text, client) => {

  if (!text[1] && !msg.replied.text) return await msg.reply(need_rt);
  await client.updateProfileStatus(msg.replied ? msg.replied.text : text[1]);
  return await msg.reply(suc_about.format(msg.replied ? msg.replied.text : text[1]));
});

onCommand(
  {
   command: 'block',
   desc: block_desc,
   owner: true,
   category: ['owner']
  }, async (msg, text, client) => {

  if (!msg.replied && msg.mentions.length < 1 && !msg.isPrivateChat) return msg.reply(need_rm);
  let blocklist = await client.fetchBlocklist();
  if (msg.isPrivateChat) {
   if (blocklist.includes(msg.chat)) return await msg.reply(block_already.format('@' + msg.chat.split('@')[0]));
   await client.updateBlockStatus(msg.chat, 'block');
  } else if (msg.replied) {
   if (blocklist.includes(msg.replied.sender)) return await msg.reply(block_already.format('@' + msg.chat.split('@')[0]));
   await client.updateBlockStatus(msg.replied.sender, 'block');
   if (msg.isGroupChat) return await msg.reply(blocked.format('@'+msg.replied.sender.split('@')[0]));
  } else if (msg.mentions.length > 0) {
   msg.mentions.map(async (user) => {
    if (blocklist.includes(user)) return await msg.reply(block_already.format('@' + msg.chat.split('@')[0]));
    await client.updateBlockStatus(user, 'block');
   });
   return await msg.reply(blocked.format(msg.mentions.map((user) => '@'+user.split('@')[0]).join('\n')));
  }
});

onCommand(
  {
   command: 'unblock',
   desc: unblock_desc,
   owner: true,
   category: ['owner']
  }, async (msg, text, client) => {

  if (msg.text.split(msg.text.charAt(0))[1].startsWith('blocklist')) return;
  if (!msg.replied && msg.mentions.length < 1 && !msg.isPrivateChat) return msg.reply(need_rm);
  let blocklist = await client.fetchBlocklist();
  if (msg.isPrivateChat) {
   if (!blocklist.includes(msg.chat)) return await msg.reply(unblocked_already.format(msg.chat.split('@')[0]));
   await client.updateBlockStatus(msg.chat, 'unblock');
  } else if (msg.replied) {
   if (!blocklist.includes(msg.replied.sender)) return await msg.sender(unblocked_already.format('@' + msg.replied.sender.split('@')[0]));
   await client.updateBlockStatus(msg.replied.sender, 'unblock');
   if (msg.isGroupChat) return await msg.reply(unblocked.format('@'+msg.replied.sender.split('@')[0]));
  } else if (msg.mentions.length > 0) {
   msg.mentions.map(async (user) => {
    if (!blocklist.includes(user)) return await msg.sender(unblocked_already.format('@'+user.split('@')[0]));
    await client.updateBlockStatus(user, 'unblock');
   });
   return await msg.reply(unblocked.format(msg.mentions.map((user) => '@'+user.split('@')[0]).join('\n')));
  }
});

onCommand(
  {
   command: 'blocklist',
   desc: blocklist_desc,
   owner: true,
   category: ['owner']
  }, async (msg, text, client) => {

  let blocklist = await client.fetchBlocklist();
  if (blocklist.length < 1) return await msg.reply(blocklist_null);
  return await msg.reply(block_list + blocklist.map((user) => '@'+user.split('@')[0]).join('\n'));
});

onCommand(
  {
   command: 'create',
   desc: create_desc,
   owner: true,
   category: ['owner']
  }, async (msg, text, client) => {

  if (!text[1] || !text[1]?.split('@')[0]) return await msg.reply(need_gc_subject);
  let members = [msg.sender]
  if (msg.mentions.length > 0) msg.mentions.map(async (user) => members.push(user));
  let txt = text[1].split('@')[0].trim();
  if (txt.length > 25) return await msg.reply(long_gc_subject);
  await msg.reply(suc_created_gc)
  return await client.groupCreate(txt, members);
});

onCommand(
  {
   command: 'info',
   desc: info_desc,
   category: ['misc']
  }, async (msg, text, client) => {

  let user = msg.mentions.length > 0 ? msg.mentions : msg.replied ? msg.replied.sender : msg.sender
  if (msg.mentions.length > 0) {
   msg.mentions.map(async (user) => {
    let { name, about, number, profile } = await client.profileInfo(user);
    let info = info_format.format(name, about.text.split('\n').join('*\n*'), about.setOn, about.setAt, number);
    await client.sendMessage(msg.chat, { image: { url: profile }, thumbnail: Buffer.alloc(0), caption: info }, { quoted: msg });
   });
  } else if (msg.replied && msg.replied.sender) {
    let { name, about, number, profile } = await client.profileInfo(msg.replied.sender);
    let info = info_format.format(name, about.text.split('\n').join('*\n*'), about.setOn, about.setAt, number);
    await client.sendMessage(msg.chat, { image: { url: profile }, thumbnail: Buffer.alloc(0), caption: info }, { quoted: msg });
  } else {
    let { name, about, number, profile } = await client.profileInfo(msg.sender);
    let info = info_format.format(name, about.text.split('\n').join('*\n*'), about.setOn, about.setAt, number);
    await client.sendMessage(msg.chat, { image: { url: profile }, thumbnail: Buffer.alloc(0), caption: info }, { quoted: msg });
  }
});

onCommand(
  {
   command: 'join',
   desc: join_desc,
   category: ['misc']
  }, async (msg, text, client) => {
  
  if (!text[1] && !msg.replied) return await msg.reply(need_join_gc);
  if (text[1] !== '') {
   if (!text[1].match(/chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i)) return await msg.reply(invalid_gclink);
   try {
    await client.joinGroup('url', text[1]);
   } catch {
    await msg.reply(unable_join);
   }
  } else if (msg.replied) {
    if (msg.replied.text) {
     if (!msg.replied.text.match(/chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i)) return await msg.reply(invalid_gclink);
     let join = await client.joinGroup('url', msg.replied.text);
     try {
      await client.joinGroup('url', msg.replied.text);
     } catch {
      await msg.reply(unable_join);
     }
    } else if (msg.replied.groupInviteMessage) {
     try {
      await client.joinGroup('invite', msg.replied.groupInviteMessage, msg);
     } catch (e) {
      await msg.reply(unable_join_inv);
     }
    }
   }
});
