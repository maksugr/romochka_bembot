'use strict';

const urlencode = require('urlencode');
const depsParser = require('bem-deps-parser');
const TelegramBot = require('node-telegram-bot-api');
const trimEnd = require('lodash.trimend');

const config = require('./config');
const token = process.env.TOKEN || config.token;

const romochka_bemBot = new TelegramBot(token, { polling: true });

console.log('Romochka starts talking with world...');

/**
 * Check the bemhtml
 *
 * @param {String} Text text from user
 *
 * @returns {Boolean}
 */
const isBemhtml = text => {
	return text.startsWith('block');
};

/**
 * Check the bemjson
 *
 * @param {String} Text text from user
 *
 * @returns {Boolean}
 */
const isBemjson = text => {
	return text.startsWith('{') || text.startsWith('[');
};

/**
 * Generate bemhtml link
 *
 * @param {String} Bemhtml bemhtml from user
 *
 * @returns {String} Link
 */
const generateBemhtmlLink = bemhtml => {
	const deps = depsParser.parse(bemhtml);
	const resultDeps = deps.resultDeps !== '[]' ? ` and deps: <pre>${deps.result}</pre>` : `!`;

	return `It's done! Your <a href="https://bem.github.io/bem-xjst/?bemhtml=${urlencode(bemhtml)}&bemjson=%20">link</a>${resultDeps}`;
};

/**
 * Generate bemjson link
 *
 * @param {String} Bemjson bemjson from user
 *
 * @returns {String} Link
 */
const generateBemjsonLink = bemjson => {
	const trimedBemjson = trimEnd(bemjson, '; ');
	const wrappedBemjson = `(${trimedBemjson});`;
	return `It's done! Your <a href="https://bem.github.io/bem-xjst/?bemhtml=%20&bemjson=${urlencode(wrappedBemjson)}">link</a>!`;
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

	romochka_bemBot.sendMessage(chatId, answer, { parse_mode: 'HTML' });
});


