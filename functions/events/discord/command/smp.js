// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

  let latency = new Date() - new Date(context.params.event.timestamp);
  await lib.discord.channels['@0.1.1'].messages.create({
    channel_id: `${context.params.event.channel_id}`,
    content: ``,
    embed: {
      description: `The Discord Invite to the Minecaft Server is: https://discord.gg/tN6PYZMzyH`,
      color: 0x00AA00
    }
  });
