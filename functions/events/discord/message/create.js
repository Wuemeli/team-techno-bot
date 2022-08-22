const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
if (context.params.event.content.includes('Technoblade')) {
  let result = await lib.discord.channels['@0.2.0'].messages.reactions.create({
    emoji: '😭',
    message_id: `${context.params.event.id}`,
    channel_id: `${context.params.event.channel_id}`,
  });
}
