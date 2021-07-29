import { Client } from 'discord.js'
import fastify from 'fastify'

module RolemonServer {
	const server = fastify({ logger: false })
	export let client: Client

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
			const guild = client.guilds.cache.get(guildId)

			// updates member cache TODO: find a better way to do this than per request
			await guild.members.fetch()

			let members = {}
			guild.roles.cache.forEach((role) => {
				members[role.name] = role.members.map((m) => {
					return {
						username: m.user.username,
						avatarUrl: m.user.avatarURL(),
						discriminator: m.user.discriminator,
					}
				})
			})

			res.send(members)
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