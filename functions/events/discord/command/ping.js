const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let event = context.params.event;
  let latency = new Date() - new Date(context.params.event.received_at);
   await lib.discord.channels['@0.1.1'].messages.create({
  channel_id: `${context.params.event.channel_id}`,
  content: ``,
  embed: {
    description: `Current latency is ${latency}ms.`,
    color: 0x00AA00
}
  });


