'use strict';

const DISCORD_URL = 'discord.com'
const DISCORD_ID = process.env.ID || '';
const DISCORD_TOKEN = process.env.TOKEN || '';
const DISCORD_PATH = '/api/webhooks/' + DISCORD_ID + '/' + DISCORD_TOKEN;

const COLOUR_OPEN = 32768;
const COLOUR_CLOSED = 13369344;
const COLOUR_MERGED = 9662683;

let http = require('http');
let https = require('https');

/* format:
{
	node_id: {
		messageID: integer,
		data: {...}
	}
}
*/
let messages = {};

// returns true on good data
function verifyGitHubPayload(data) {
	let json;

	try {
		json = JSON.parse(data);
	} catch (e) {
		return false;
	}

	return !(json['action'] === undefined || json['repository'] === undefined || json['sender'] === undefined);
}

function createDiscordMessage(data) {
	let pullRequestNode = data.pull_request.node_id;

	if (messages[pullRequestNode] !== undefined) return;

	let requestData = {
		'embeds': [
			{
				'author': {
					'name': data.pull_request.user.login,
					'icon_url': data.pull_request.user.avatar_url
				},
				'title': data.pull_request.title,
				'description': data.pull_request.html_url + '\n' + data.pull_request.body,
				'color': COLOUR_OPEN,
				'fields': [
					{
						'name': 'Head Branch',
						'value': data.pull_request.head.ref,
						'inline': true
					},
					{
						'name': 'Base Branch',
						'value': data.pull_request.base.ref,
						'inline': true
					},
					{
						'name': 'Updates',
						'value': '```\n<pull request created>```'
					}
				]
			}
		]
	};

	let request = https.request({
		hostname: DISCORD_URL,
		path: DISCORD_PATH + '?wait=1',
		method: 'POST',
		headers: {'Content-Type': 'application/json'}
	}, (response) => {
		let body = ''

		response.setEncoding('utf8');

		response.on('data', (localData) => {
			body += localData;
		});

		response.on('end', () => {
			body = JSON.parse(body);

			messages[pullRequestNode] = {
				'messageID': body.id,
				'data': requestData
			};
		});
	});
	
	request.end(JSON.stringify(requestData));
}

function editMessageHelper(messageObject, updateString) {	
	let oldUpdate = messageObject.data.embeds[0].fields[2].value.slice(3, -3);
	messageObject.data.embeds[0].fields[2].value = '```\n' + updateString + oldUpdate + '```';

	let request = https.request({
		hostname: DISCORD_URL,
		path: DISCORD_PATH + '/messages/' + messageObject.messageID,
		method: 'PATCH',
		headers: {'Content-Type': 'application/json'}
	}, () => {});
	
	request.end(JSON.stringify(messageObject.data));
}

function editDiscordMessage(data) {
	let pullRequestNode = data.issue.node_id;
	let messageObject = messages[pullRequestNode];

	if (messageObject === undefined) return;

	let updateString = '[' + data.comment.user.login + ']: ' + data.comment.body;
	editMessageHelper(messageObject, updateString);
}

function closeDiscordMessage(data) {
	if (data['pull_request'] === undefined) return;

	let pullRequestNode = data.pull_request.node_id;
	let messageObject = messages[pullRequestNode];

	if (messageObject === undefined) return;

	let updateString;

	if (data.pull_request.merged === true) {
		updateString = '<pull request merged>';
		messageObject.data.embeds[0].color = COLOUR_MERGED;
	} else {
		updateString = '<pull request closed>';
		messageObject.data.embeds[0].color = COLOUR_CLOSED;
	}

	editMessageHelper(messageObject, updateString);

	delete messages[pullRequestNode];
}

let server = http.createServer((request, response) => {
	let data = '';

	if (request.method === 'POST') {
		request.on('data', (chunk) => {
			data += chunk.toString();
		});

		request.on('end', () => {
			if (verifyGitHubPayload(data)) {
				response.writeHead(200);

				data = JSON.parse(data);

				if (data['action'] === 'opened') {
					createDiscordMessage(data);
				} else if (data['action'] === 'closed') {
					closeDiscordMessage(data);
				} else if (data['action'] === 'created') {
					editDiscordMessage(data);
				}
			} else {
				response.writeHead(404);
			}

			response.end('');
		});
	}
});

if (DISCORD_ID === '' || DISCORD_TOKEN === '') {
	console.log('invalid env');
} else {
	server.listen(11111);
	console.log('middleman listening');
}
