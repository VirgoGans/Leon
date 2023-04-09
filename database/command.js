let config = require('../main/config');
let { DataTypes } = require('sequelize');

const CommandsDB = config.DATABASE.define('Command', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

async function installCommand(url, name) {
    let Command = await CommandsDB.findAll({
        where: { url: url }
    });

    if (Command.length >= 1) {
        return false;
    } else {
        return await CommandsDB.create({ url: url, name: name });
    }
}

module.exports = { CommandsDB: CommandsDB, installCommand: installCommand };
