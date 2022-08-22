const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const event = context.params.event
const { guild_id, token, channel_id, member, author} = event;
const error = require('../../../helpers/error.js')
try {
let emojis = await lib.utils.kv['@0.1.16'].get({key: `emojis`, defaultValue: {moderator: null, user: null, reason: null, channel: null, error: null, timeout: null, clock: null}});
let base = await lib.airtable.query['@1.0.0'].select({table: `Config`, where: [{'Guild__is': guild_id}]});
if (!base?.rows?.length) base = await lib.airtable.query['@1.0.0'].insert({table: `Config`, fieldsets: [{'Guild': guild_id}]});
let cNum = (await lib.airtable.query['@1.0.0'].max({table: `Cases`, where: [{'Guild__is': guild_id}], field: `Case`})).max.max + 1
let isAdmin = false, reason = event.content.split(' ').slice(1).join(' ') || `No reason provided`
let guildInfo = await lib.discord.guilds['@0.2.4'].retrieve({guild_id});
if (guildInfo.owner_id == author.id) isAdmin = true
if (member.roles.includes(base.rows[0].fields.Moderator)) isAdmin = true
if (guildInfo.roles.filter(role => (role.permissions & (1 << 3)) === 1 << 3 && member.roles.includes(role.id))?.length) isAdmin = true
if (!isAdmin)
  return lib.discord.channels['@release'].messages.create({channel_id, content: `<:error:${emojis.error}> | You don't have permission to use this command`});

let channel = await lib.discord.channels['@release'].retrieve({channel_id});
await lib.discord.channels['@release'].destroy({channel_id});
let newch = await lib.discord.guilds['@release'].channels.create({
  guild_id: channel.guild_id,
  name: channel.name,
  type: channel.type,
  topic: channel.topic,
  bitrate: channel.bitrate,
  user_limit: channel.user_limit,
  rate_limit_per_user: channel.rate_limit_per_user,
  position: channel.position,
  permission_overwrites: channel.permission_overwrites,
  parent_id: channel.parent_id,
  nsfw: channel.nsfw
});
await lib.discord.channels['@release'].messages.create({channel_id: newch.id, content: `This channel has been nuked for ${reason}`});
if (base.rows[0].fields.Logging) {
  await lib.discord.channels['@release'].messages.create({
    channel_id: base.rows[0].fields.Logging,
    content: ``,
    embeds: [{
      type: 'rich',
      color: 0xE72020,
      description: `
<:channel:${emojis.channel}> | <#${newch.id}>
<:moderator:${emojis.moderator}> | <@${author.id}> | ${author.username}#${author.discriminator}
<:reason:${emojis.reason}> | ${reason}`,
      footer: {text: `Case Number: ${cNum}`},
      author: {name: `${cNum} | Nuke`},
      timestamp: new Date().toISOString(),
    }],
  });
}
await lib.airtable.query['@1.0.0'].insert({table: `Cases`,
  fieldsets: [{
    Channel: newch.id,
    Reason: reason,
    Type: `Nuke`,
    Moderator: author.id,
    Timestamp: `<t:${Math.floor(new Date().getTime() / 1000)}>`,
    Case: cNum,
    Guild: guild_id,
  }],
});
} catch (e) {
  await error.prefix(channel_id, e.message)
}