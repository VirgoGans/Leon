const config = require('../main/config');
const { DataTypes } = require('sequelize');

const GreetingsDB = config.DATABASE.define('Greetings', {
    chat: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

async function getMessage(id = null, tip = 'welcome') {
    let Get = await GreetingsDB.findAll({
        where: {
            chat: id,
            type: tip
        }
    });

    if (Get.length < 1) {
        return false;
    } else {
        return Get[0].dataValues;
    }
}

async function setMessage(id = null, tip = 'welcome', text = null) {
    let Set = await GreetingsDB.findAll({
        where: {
            chat: id,
            type: tip
        }
    });

    if (Set.length < 1) {
        return await GreetingsDB.create({ chat: id, type: tip, message: text });
    } else {
        return await Set[0].update({ chat: id, type: tip, message: text });
    }
}

async function deleteMessage(id = null, tip = 'welcome') {
    let Del = await GreetingsDB.findAll({
        where: {
            chat: id,
            type: tip
        }
    });

    return await Del[0].destroy();
}

module.exports = {
    GreetingsDB: GreetingsDB,
    getMessage: getMessage,
    setMessage: setMessage,
    deleteMessage: deleteMessage
};
