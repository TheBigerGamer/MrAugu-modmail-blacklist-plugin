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
if (!config.aliases.block[0]) aliases = ['bl_B']

class Block extends Command {
  constructor (client) {
    super(client, {
      name: "block",
      description: "Blocks a user from contacting modmail.",
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
		if (args[0]) {
			var user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
			if (!user) return message.reply(':x: You need someone to block.')
	
			var logChannel = this.client.channels.cache.get(config.modLogChannel)
	 
			var member = await this.client.users.fetch(user, false).catch(() => null);
			//console.log(member)
			if (!member) return message.channel.send(`:x: I couldn't find a user with the ID of \`${user}\`!`);
		} else {
			let totalbans = await db.fetch(`BLPlugin.blocks`)  
			if(!totalbans) totalbans = '0'
      
			return message.channel.send(`Total blocked users: ${totalbans}`)
    }
    
    async function writereason(towrite) {
      await db.set(`BLPlugin_tempuser_${message.guild.id}`, user)
      var user1 = await db.fetch(`BLPlugin_tempuser_${message.guild.id}`)
      await db.set(`BLPlugin_temp_${message.guild.id}`, towrite, {target: '.reason'})
      await db.set(`BLPlugin_temp_completed_${message.guild.id}`, 1)
      end()
    }
    
    let userData = await db.fetch(`BLPlugin.blocked_${user}`)
    if (userData) {
      var reason = await userData.reason
    }
    
    async function type() {
    message.channel.send("Please type a reason.").then(async msg => {
      await db.set(`BLPlugin_temp_completed_${message.guild.id}`, 0)
      let reason = msg.channel.createMessageCollector(m => m.author.id === message.author.id, {
        max: 1
      })
      reason.on("collect", m => {
        var towrite1 = m.content
          
        writereason(towrite1)
      })
  });
}
    
    async function end() {
    let iscompleted = await db.fetch(`BLPlugin_temp_completed_${message.guild.id}`)  
    
    if (iscompleted === 1) {
      let gban_TEMP = await db.fetch(`BLPlugin_temp_${message.guild.id}`)
      let reason = gban_TEMP.reason

      const embed = new Discord.RichEmbed()
        .setAuthor("New Blacklist", this.client.user.displayAvatarURL)
        .setDescription("A user was blacklisted!")
        .setColor("#2C2F33")
        .addField("User:",`${member.username}#${member.discriminator} (user ID: ${user})`)
        .addField("Reason:", reason)
        .addField("Moderator:",`${message.author.tag} (user ID: ${message.author.id})`)
        .setTimestamp()
    
      logChannel.send(embed);
      message.channel.send(`:white_check_mark: Successfully blacklisted \`${member.tag}\`!`);
  
      let towrite = {userID: `${member.id}`, reason: `${reason}`, moderator: `${message.author.tag} (User ID: ${message.author.id})`};
      await db.set(`BLPlugin.blocked_${member.id}`, towrite)
  
      let log = await db.fetch(`BLPlugin.blocked_${member.id}`)
      
      db.add(`BLPlugin.blocks`, 1)
    
      await db.set(`BLPlugin_temp_completed_${message.guild.id}`, 0)
      await db.delete(`BLPlugin_temp_${message.guild.id}`)
    } else {
      type()
			}
		}
	} catch (e) {this.client.logger.error(e, 'error')}
  }
}

module.exports = Unblock;
