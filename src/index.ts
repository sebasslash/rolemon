import RolemonServer, { RolemonConfig } from "./server"
import fs from 'fs'
import yaml from 'js-yaml'
import dotenv from 'dotenv'

const Discord = require('discord.js'),
	client = new Discord.Client()

dotenv.config()

client.on('ready', () => {
	client.user.setActivity('Monitoring roles')
})

try {
	const config = yaml.load(fs.readFileSync('./rolemon.yml', 'utf-8')) as RolemonConfig

	config.token
		? client.login(config.token)
		: client.login(process.env['ROLEMON_TOKEN'])

	RolemonServer.client = client
	RolemonServer.config = config
	RolemonServer.start()

} catch (err) {
	process.exit(1)
	console.error(err)
}