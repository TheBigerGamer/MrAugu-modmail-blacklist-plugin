const db = require('quick.db')

module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run (message) {
   let userData = await db.fetch(`blocked_${message.author.id}`)
   let response = await db.fetch(`bl_response`)
   if (!response) await db.set(`bl_response`, `This can be any string, however, there are some options:\n >{{user}} - The username of the user.\n >{{reason}} - The reason of the blacklist.\n >{{moderator}} - Who blacklisted.\n {{prefix}} - Prefix of the server.\n Use \`{{prefix}}blConfig\` to change this.`)
   //if (response !== 'bl_response', `This can be any string, and you can add some options:\n >{{user}} - The username of the user.\n >{{reason}} - The reason of the blacklist.\n >{{moderator}} - Who blacklisted.\n Use \`{{prefix}}blConfig\` to change this.`)
   if (userData) response.replace('{{user}}', message.author.username).replace('{{reason}}', userData.reason).replace('{{moderator}}', userData.moderator).replace('{{prefix}}',this.client.config.prefix)
   if (userData) return message.channel.send(response)
  }
}
