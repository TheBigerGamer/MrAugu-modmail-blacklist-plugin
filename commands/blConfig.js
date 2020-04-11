const Command = require("../../../base/Command.js");
const PluginData = require("../meta.json")
const db = require('quick.db')
const config = db.fetch(`BLPlugin.settings`)

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

sleep(1000)

let aliases = []
if (!config.aliases.Unblock[0]) aliases = ['bl_C']

class blConfig extends Command {
  constructor (client) {
    super(client, {
      name: "blConfig",
      description: "Change the config of the blacklist system.",
      category: "BlackList",
      usage: "add/edit [setting] [subsetting] [value]",
      enabled: true,
      guildOnly: false,
      aliases: aliases,
      permLevel: config.permLevel || "Bot Owner",
      cooldown: 5,
      args: true,
      DMonly: false
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
	let settings = await db.fetch(`BLPlugin.settings`)
	if (!settings) await db.set(`BLPlugin.settings`, {
		default: {
			aliases: {
				Block: [], 
				Check: [], 
				Unblock: []
				},
			response: `This can be any string, however, there are some options:\n >{{user}} - The username of the user.\n >{{reason}} - The reason of the blacklist.\n >{{moderator}} - Who blacklisted.\n {{prefix}} - Prefix of the server.\n Use \`{{prefix}}blConfig\` to change this.`,
			modRoles: [],
			permLevel: "Bot Owner",
			modLogChannel: "694526052789125180"
			}, 
		guilds: {}
	})
	
    if (args[0]) {
		switch (args[0]) {
			case 'add':
				if (args[1]) {
						if (args[2]) {
							if (args[3]) {
								let found = await db.fetch(`BLPlugin.settings`, {target: `.default.${args1}.${args2}`})
								if (!found) {
									await db.set(`BLPlugin.settings`, args[3], {target: `.default.${args1}.${args2}`})
								} else return message.channel.send('Setting already exists.')	
						} else return message.channel.send('Please provide a value for the subsetting.')
					} else return message.channel.send('Please provide at least one subsetting to add.')
				} else return message.channel.send('Please provide a setting to add.')
				break;
			case 'edit':
				if (args[1]) {
						if (args[2]) {
							if (args[3]) {
								let found = await db.fetch(`BLPlugin.settings`, {target: `.default.${args1}.${args2}`})
								if (found) {
									await db.set(`BLPlugin.settings`, args[3], {target: `.default.${args1}.${args2}`})
								} else return message.channel.send('Setting does not exist.')	
						} else return message.channel.send('Please provide a value for the subsetting.')
					} else return message.channel.send('Please provide at least one subsetting to add.')
				} else return message.channel.send('Please provide a setting to add.')
				break;
		}
	} else {
		let field = 'Settings available:\n'
		settings.forEach(set => {
			field += `${set.name}`
		})
		let embed = new Discord.MessageEmbed()
		.setTitle(`BlackList Plugin v${PluginData.version}`)
		.addFields(field, `Methods: add/edit`)
		.setFooter('Made by DarkenLight Mage#2401', 'https://cdn.discordapp.com/avatars/472720369346936842/b7707730fcec6b397c1c48616b6fb79e.png?size=2048')
		
		return message.channel.send(embed)
	}
  }
}

module.exports = blConfig;
