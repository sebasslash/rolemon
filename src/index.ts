import RolemonServer, { RolemonConfig } from "./server"
import fs from 'fs'
import yaml from 'js-yaml'
import dotenv from 'dotenv'

const Discord = require('discord.js'),
	client = new Discord.Client()

dotenv.config()
const TOKEN = process.env['ROLEMON_TOKEN']

client.on('ready', () => {
	client.user.setActivity('Monitoring roles')
})


try {
	const config = yaml.load(fs.readFileSync('./rolemon.yml', 'utf-8')) as RolemonConfig
	client.login(config.token)
	RolemonServer.client = client
	RolemonServer.config = config
	try {
		RolemonServer.start()
	} catch (err) {
		console.error(err)
		process.exit(1)
	}
} catch (err) {
	console.error(err)
}