const { Sequelize } = require('sequelize');

DATABASE_URL = process.env.DATABASE_URL === undefined ? './leon.db' : process.env.DATABASE_URL;

module.exports = {
    AUTH_ID: process.env.AUTH_ID !== '' ? process.env.AUTH_ID : Boolean(false),
    PREFIX: process.env.PREFIX !== '' ? process.env.PREFIX.charAt(0) : '#',
    LANG: process.env.LANGUAGE !== '' ? process.env.LANGUAGE : 'eng',
    MODE: process.env.MODE !== '' ? process.env.MODE : 'private',
    AUTOSV: process.env.AUTO_STATUSVIEW !== '' ? process.env.AUTO_STATUSVIEW : Boolean(false),
    ADMINS: process.env.ADMINS !== '' ? process.env.ADMINS : Boolean(false),
    DATABASE_URL: DATABASE_URL,
    DATABASE: DATABASE_URL === './leon.db' ? new Sequelize({ dialect: "sqlite", storage: DATABASE_URL, logging: false }) : new Sequelize(DATABASE_URL, { dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }, logging: false })
};
