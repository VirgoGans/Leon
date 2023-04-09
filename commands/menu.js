let Config = require('../main/config');
let { onCommand, commands } = require('../main/');

onCommand(
 {
  command: 'menu',
  hide: true
 }, 
 async (msg, text, client) => {

  let menu = '';
  let cmds = commands.allCommands // text[1] == 'all' ? commands.allCommands : text[1] == 'misc' ? commands.miscCommands : text[1] == 'group' ? commands.groupCommands : text[1] == 'admin' ? commands.adminCommands : text[1] == 'owner' ? commands.ownerCommands : false
  let prefix = Config.PREFIX
  if (cmds !== false) {
   cmds.map(async (command) => {
    if (command.hide || command.command === undefined) return;
    menu += '*' + (prefix + command.command) + '* -\n' + '_' + command.desc + '_\n\n';
   });
   await msg.reply(menu);
  } // else {
   // return await client.sendMessage(msg.chat, { text: '*Please select:*', footer: '© Leon', title: `Hey, ${await client.userName(msg.sender)}`, buttonText: 'SELECT', sections: [{ title: 'CATEGORIES:', rows: [{ title: 'ALL COMMANDS', rowId: prefix+'menu all' }, { title: 'MISC COMMANDS', rowId: prefix+'menu misc' }, { title: 'GROUP COMMANDS', rowId: prefix+'menu group' }, { title: 'ADMIN COMMANDS', rowId: prefix+'menu admin' }, { title: 'OWNER COMMANDS', rowId: prefix+'menu owner' }] }] });
  // }
});
