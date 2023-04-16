const { Sequelize } = require('sequelize');

DATABASE_URL = process.env.DATABASE_URL === undefined ? './leon.db' : process.env.DATABASE_URL;

module.exports = {
    SESSION: process.env.SESSION !== undefined ? process.env.SESSION : 'false',
    PREFIX: process.env.PREFIX !== undefined ? process.env.PREFIX.charAt(0) : '#',
    LANG: process.env.LANGUAGE !== undefined ? process.env.LANGUAGE : 'eng',
    MODE: process.env.MODE !== undefined ? process.env.MODE : 'private',
    AUTOSV: process.env.AUTO_STATUSVIEW !== undefined ? process.env.AUTO_STATUSVIEW : 'false',
    OPENAIKEY: process.env.OPENAI_KEY !== undefined ? process.env.OPENAI_KEY : 'false',
    IMGBBKEY: process.env.IMGBB_APIKEY !== undefined ? process.env.IMGBB_APIKEY : 'false',
    RBGKEY: process.env.RBG_APIKEY !== undefined ? process.env.RBG_APIKEY : 'false',
    ADMINS: process.env.ADMINS !== undefined ? process.env.ADMINS : 'false',
    DATABASE_URL: DATABASE_URL,
    DATABASE: DATABASE_URL === './leon.db' ? new Sequelize({ dialect: "sqlite", storage: DATABASE_URL, logging: false }) : new Sequelize(DATABASE_URL, { dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }, logging: false })
};
