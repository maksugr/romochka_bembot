'use strict';

const _ = require('lodash');
var urlencode = require('urlencode');

const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const token = process.env.TOKEN || config.token;

const romochka_bemBot = new TelegramBot(token, { polling: true });

/**
 * Check the bemhtml
 *
 * @param {String} Text text from user
 *
 * @returns {Boolean}
 */
const isBemhtml = text => {
	return _.startsWith(text, 'block');
};

/**
 * Check the bemjson
 *
 * @param {String} Text text from user
 *
 * @returns {Boolean}
 */
const isBemjson = text => {
	return _.startsWith(text, '{') || _.startsWith(text, '[');
};

/**
 * Generate bemhtml link
 *
 * @param {String} Bemhtml bemhtml from user
 *
 * @returns {String} Link
 */
const generateBemhtmlLink = bemhtml => {
	return `https://bem.github.io/bem-xjst/?bemhtml=${urlencode(bemhtml)}&bemjson=`;
};

/**
 * Generate bemjson link
 *
 * @param {String} Bemjson bemjson from user
 *
 * @returns {String} Link
 */
const generateBemjsonLink = bemjson => {
	const wrappedBemjson = `(${bemjson});`;
	return `https://bem.github.io/bem-xjst/?bemhtml=&bemjson=${urlencode(wrappedBemjson)}`;
};

/**
 * Generate link
 *
 * @param {String} Text text from user
 *
 * @returns {String} Link
 */
const generateLink = text => {
	const bemhtml = isBemhtml(text);
	const bemjson = isBemjson(text);

	if (!bemhtml && !bemjson) {
		return 'Send bemjson or bemhtml, please';
	}

	return bemhtml ? generateBemhtmlLink(text) : generateBemjsonLink(text);
};

/**
 * Generate message to user
 *
 * @param {String} link Link
 *
 * @returns {String} Message to user
 */
const generateAnswer = link => {
	return `${link}`;
};

romochka_bemBot.on('text', msg => {
	const chatId = msg.chat.id;

	// send welcome message on romochka_bemBot init
	if (msg.text === '/start') {
		romochka_bemBot.sendMessage(chatId, config.welcomeMessage);
		return;
	}

	const link = generateLink(msg.text);
	const answer = generateAnswer(link);

	romochka_bemBot.sendMessage(chatId, answer);
});


