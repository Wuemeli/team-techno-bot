const isTokenGrab = await lib.chillihero['tokengrabber-check']['@release'].check({message: context.params.event.content});
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const event = context.params.event
const { guild_id, channel_id, member} = event;
let emojis = await lib.utils.kv['@0.1.16'].get({key: `emojis`, defaultValue: {moderator: null, user: null, reason: null, channel: null, error: null, timeout: null, clock: null}});
let base = await lib.airtable.query['@1.0.0'].select({table: `Config`, where: [{'Guild__is': guild_id}]});
if (!base?.rows?.length) base = await lib.airtable.query['@1.0.0'].insert({table: `Config`, fieldsets: [{'Guild': guild_id}]});
let cNum = (await lib.airtable.query['@1.0.0'].max({table: `Cases`, where: [{'Guild__is': guild_id}], field: `Case`})).max.max + 1
let guildInfo = await lib.discord.guilds['@0.2.4'].retrieve({guild_id});
if (guildInfo.owner_id == event.author.id) return
if (member.roles.includes(base.rows[0].fields.Moderator)) return
if (guildInfo.roles.filter(role => (role.permissions & (1 << 3)) === 1 << 3 && member.roles.includes(role.id))?.length) return
if (base.rows[0].fields.Scams == `true` && isTokenGrab) {
  await lib.discord.channels['@release'].messages.destroy({message_id: id, channel_id});
  await lib.discord.channels['@release'].messages.create({channel_id, content: `**${event.author.username}**, please don't send token grabbers!`});
  await lib.airtable.query['@1.0.0'].insert({table: `Cases`,
    fieldsets: [{
      User: event.author.id,
      Reason: `Auto Moderation: Token Grabber`,
      Type: `Warning`,
      Moderator: me.id,
      Timestamp: `<t:${Math.floor(new Date().getTime() / 1000)}>`,
      Case: cNum,
      Guild: guild_id,
    }],
  });
  if (base.rows[0].fields.Logging) {
    await lib.discord.channels['@release'].messages.create({
      channel_id: base.rows[0].fields.Logging,
      content: ``,
      embeds: [{
        type: 'rich',
        color: 0xE72020,
        description: `<:channel:${emojis.channel}> | ||${event.content}|| \n<:user:${emojis.user}> | <@${event.author.id}> | ${event.author.username}#${event.author.discriminator}\n`,
        footer: {text: `Case Number: ${cNum}`},
        author: {name: `${cNum} | Auto Mod - Scam Links`},
        timestamp: new Date().toISOString(),
      }],
    });
  }
}