import RolemonServer from "./server"
import dotenv from 'dotenv'

const Discord = require('discord.js'),
	client = new Discord.Client()

dotenv.config()
const TOKEN = process.env['ROLEMON_TOKEN']

client.on('ready', () => {
	client.user.setActivity('Monitoring roles')

	// initialize server only after bot is ready
	RolemonServer.client = client
	try {
		RolemonServer.start()
	} catch (err) {
		console.error(err)
		process.exit(1)
	}
})


try {
	client.login(TOKEN)
} catch (err) {
	console.error(err)
}