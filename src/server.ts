import { Client } from 'discord.js'
import fastify from 'fastify'

export interface RolemonConfig {
	token: string
	allowed_roles?: string[]
	allowed_guilds?: string[]
}

module RolemonServer {
	const server = fastify({ logger: false })
	export let client: Client
	export let config: RolemonConfig

	server.route({
		method: 'GET',
		url: '/roles',
		schema: {
			querystring: {
				'guild_id': { type: 'string' }
			}
		},
		handler: async (req, res) => {
			const guildId = req.query['guild_id']

			if (config.allowed_guilds && !config.allowed_guilds.includes(guildId)) {
				return res.code(400).send('Invalid guild access')
			}

			const guild = client.guilds.cache.get(guildId)

			// updates member cache TODO: find a better way to do this than per request
			await guild.members.fetch()

			let members = {}
			guild.roles.cache.forEach((role) => {
				if (!config.allowed_roles || config.allowed_roles.includes(role.name)) {
					members[role.name] = role.members.map((m) => {
						return {
							username: m.user.username,
							avatarUrl: m.user.avatarURL(),
							discriminator: m.user.discriminator,
							nickname: m.displayName
						}
					})
				}
			})

			res
				.code(200)
				.header('Content-Type', 'application/json; charset=utf-8')
				.send(members)
		}
	})

	export const start = async (PORT = 3000) => {
		try {
			await server.listen(PORT)
		} catch (err) {
			server.log.error(err)
			throw new Error(`Rolemon server failed to start due to: ${err}`)
		}
	}
}

export default RolemonServer