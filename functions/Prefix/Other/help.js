const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let prefix = `?`
let me = await lib.discord.users['@0.2.0'].me.list();
let user = await lib.discord.users['@0.2.0'].retrieve({user_id: context.params.event.author.id});
await lib.discord.channels['@release'].messages.create({
  channel_id: context.params.event.channel_id,
  content: "",
  components: [
      ],
  embeds: [{
      type: "rich",
      title: "",
      description: `These commands can be run by anyone:\n
**${prefix}help** - View this list of commands
**${prefix}case [case NO]** - View the details about a previous case
**${prefix}actions {@user}** - View moderation actions against a user
**${prefix}mod-actions {@user}** - View the moderation actions made by a user
**${prefix}warns {@user}** - View how many warns a user has
**${prefix}user-info {@user}** - View info about a user
**${prefix}server-info** - View info about this server
**${prefix}ping** - Test the Ping and says to you
**${prefix}ttt** - Mention Somewone to Play Tic-Tac Toe
**${prefix}role-info [@role]** - View info about a role`,
      color: 0x00FFFF,
      author: {name: `Help Menu`, icon_url: me.avatar_url},
      footer: {text: `Requested By: ${user.username}#${user.discriminator}`, icon_url: user.avatar_url},
    }]
});