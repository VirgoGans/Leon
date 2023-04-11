let { isCommand, serializeMessage, serializeClient, getTextMessage, commands, loadAuthID, formatTime, msToTime, loadLanguage, updateStore, connectionUpdate, bindPort } = require('./main/');
let bot = require('./main/auth');
let got = require('got');
let path = require('path');
let fs = require('fs');
let config = require('./main/config');
let pino = require('pino');
let { DataTypes } = require('sequelize');
let { default: connect, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason, makeInMemoryStore, jidDecode, getContentType } = require('@adiwajshing/baileys');

String.prototype.format = function () { var i = 0, args = arguments; return this.replace(/{}/g, function () { return typeof args[i] != 'undefined' ? args[i++] : '' }) };

async function initialize() {
  await bindPort();
  let { client, store, saveCreds } = await bot.connect();

  console.log('Loading external commands...', 'processing')
  let { CommandsDB } = require('./database/command');
  await CommandsDB.sync();
  var command = await CommandsDB.findAll();
  command.map(async (command) => {
   try {
    if (fs.existsSync('./commands/external/'+ command.dataValues.name + '.js')) return false;
    var response = await got(command.dataValues.url);
    if (response.statusCode !== 200) return false;
    fs.writeFileSync('./commands/external/' + command.dataValues.name + '.js', response.body);
    require('./commands/external/' + command.dataValues.name + '.js');
   } catch (e) {
    console.log(e);
   }
 });

 fs.readdirSync('./database/').forEach(db => {
  if (path.extname(db).toLowerCase() == '.js') {
   require('./database/' + db);
  }
 });

 fs.readdirSync('./commands/').forEach(cmd => {
  if (path.extname(cmd).toLowerCase() == '.js') {
   require('./commands/' + cmd);
  }
 });

 fs.readdirSync('./commands/external/').forEach(plugin => {
  if (path.extname(plugin).toLowerCase() == '.js') {
   require('./commands/external/' + plugin);
  }
 });

 console.log('Loaded external commands!', 'done');

 await serializeClient(store, client);

 client.ev.on('messages.upsert', async (msg) => {
  msg = msg.messages[0]
  if (!msg.message) return;
  if (msg.key && msg.key.remoteJid === 'status@broadcast') {
   if (config.AUTOSV == 'true') return await client.readMessages([msg.key]);
   else return;
  }
  msg = await serializeMessage(client, msg, store);
  if (msg.fromMe) client.user.name = msg.pushName;
  if (msg.fromBot == true) return;

  if (msg.text.startsWith('>') && msg.isDev) {
   var evaluate = false
   try {
    evaluate = await eval(msg.text.replace('> ', '').toString());
    try { evaluate = JSON.stringify(evaluate, null, 2) } catch {}
   } catch (e) {
    evaluate = e.stack.toString()
   }
   await msg.reply(evaluate);
  }

  commands.allCommands.map(
    async (command) =>  {
       if ((await isCommand(command, msg)) == true) {
        let isOkay = true;
        if (command.owner == true && !msg.isOwner) isOkay = false;
        else if (command.dev == true && !msg.isDev) isOkay = false;
        else if (command.groupChat == true && !msg.chat.endsWith('us')) isOkay = false;
        else if (command.privateChat == true && !msg.chat.endsWith('net')) isOkay = false;
        if (isOkay) {
         if (config.MODE == 'private' && (msg.sender !== msg.me && !config.ADMINS.includes(msg.sender.split('@')[0]))) return;
         let text = msg.text.split(command.command)
         text[1] = text[1].startsWith(' ') ? text[1].replace(' ', '') : text[1];

         try {
           await command.function(msg, text, client);
         } catch (error) {
           console.log(error.stack?.toString(), 'failed');
           await msg.reply('*ERROR LOG*\n\n'+error.toString(), client.user.id);
         }
       }
    }});
 });

 client.ev.on('connection.update', async (conn) => await connectionUpdate(conn));
 client.ev.on('creds.update', saveCreds)
 client.ev.on('contacts.update', async (contacts) => await updateStore(client, store, contacts));
 client.ev.on('group-participants.update', async (user) => {
   let greetings = require('../database/greetings');
   let message = async (type) => await greetings.getMessage(user.id, type);
   if (user.action == 'add') {
    if (!(await message('welcome'))) return;
    await client.sendMessage(user.id, { text: (await message('welcome')) });
   } else if (user.action == 'remove') {
    if (!(await message('bye'))) return;
    await client.sendMessage(user.id, { text: (await message('bye')) });
   } else if (user.action == 'promote') {
    if (!(await message('promote'))) return;
    await client.sendMessage(user.id, { text: (await message('promote')) });
   } else if (user.action == 'demote') {
    if (!(await message('demote'))) return;
    await client.sendMessage(user.id, { text: (await message('demote')) });
   }
 });
 console.log('LEON IS NOW ACTIVE IN YOUR ACCOUNT!', 'done');

 return { store, client };
}

let { store, client } = initialize();
module.exports = { store, client, initialize };
