const Command = require("../base/Command");
const Discord = require("discord.js");
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
if (!config.aliases.check[0]) aliases = ['bl_C']

class Check extends Command {
  constructor (client) {
    super(client, {
      name: "check",
      description: "checks if an user is blocked.")
      category: "Blacklist",
      usage: "[user]",
      enabled: true,
      guildOnly: true,
      aliases: aliases,
      permLevel: config.permLevel || "Bot Owner",
      cooldown: 5,
      args: false,
      DMonly: false
    });
  }
  
  async run (message, args, level, reply) {
	try {
		var user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		if (!user) return message.reply(':x: You need someone to block.')
		var logChannel = this.client.channels.cache.get(config.modLogChannel)
		var member = await this.client.users.fetch(user, false).catch(() => null);
		if (!member) return message.channel.send(`:x: I couldn't find a user with the ID of \`${user}\`!`);
		
		let block = await db.fetch(`BLPlugin.blocked_${member.id}`)
		
		if (block) {
			let embed = new Discord.MessageEmbed()
			.setTitle('User is blocked.')
			.setDescription(`User: ${member.user.tag} (${member.id})\nReason: ${block.reason}\n Moderator: ${block.moderator}`)
			.setColor(0x000000)
			
			return message.channel.send(embed)
		} else return message.channel.send(`${member.user.tag} is not blocked.`)
	} catch (e) {console.log(e)}
  }
}

module.exports = Check;
