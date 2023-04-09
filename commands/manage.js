let { onCommand, loadLanguage, isURL, fetchJson } = require('../main/');
let allCommands = require('../main/').commands.allCommands;
let { alive_desc, alive_message, menu, alive_footer, shutdown_desc, restart_desc, ping_desc, restarting, measuring, shutting_down, shutdown_warn } = loadLanguage();
let fs = require('fs');

onCommand(
  {
   command: 'alive',
   desc: alive_desc,
   category: ['misc']
  }, async (msg, text, client) => {

  return await client.sendReply(
   {
    messageType: 'buttonText',
    text: alive_message.format(await client.userName(msg.sender)),
    footer: alive_footer.format(await client.userName(msg.sender), msg.sender, '+'+msg.sender.split('@')[0], allCommands.length),
    buttons: [
     { id: `${require('../main/config').PREFIX}menu`, name: menu }
    ]
   }
  );
});

onCommand(
  {
   command: 'ping',
   desc: ping_desc,
   category: ['misc']
  }, async (msg, text, client) => {

  let before = new Date().getTime();
  let message = await msg.reply(measuring);
  let key = { remoteJid: msg.chat, fromMe: true, id: message.key.id, participant: msg.me };
  await client.sendMessage(msg.chat, { delete: key });

  await msg
   .reply(
    '*Ping:*\n*' +
    Math.abs(before - new Date().getTime()) + 'ms*'
  );
});

onCommand(
  {
   command: 'restart',
   desc: restart_desc,
   category: ['owner']
  }, async (msg, text, client) => {

  await msg.reply(restarting);
  return await client.restart();
});

onCommand(
  {
   command: 'shutdown',
   desc: shutdown_desc,
   category: ['owner']
  }, async (msg, text, client) => {

  await msg.reply(shutdown_warn);
  await require('@adiwajshing/baileys').delay(10000);
  await msg.reply(shutting_down)
  return process.exit(0);
});
