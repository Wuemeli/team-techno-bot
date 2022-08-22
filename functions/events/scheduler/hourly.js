const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let humanChannelId = `993537061065863340`;
let botChannelId = `CHANNEL_ID_HERE`;

let serverInfo = await lib.discord.guilds['@0.1.1'].retrieve({
  guild_id: `${process.env.guildID}`,
  with_counts: true,
});
let members = await lib.discord.guilds['@0.0.6'].members.list({
  guild_id: `${process.env.guildID}`,
  limit: 1000,
});
const bot = members.filter((x) => x.user.bot);
let humans = Number(serverInfo.approximate_member_count) - bot.length;
try {
  await lib.discord.channels['@0.2.1'].update({
    channel_id: `${humanChannelId}`,
    name: `${humans} Members`,
  });
} catch (e) {
  console.log(`ERROR: updating Human channel failed. Check the id provided is correct. If you only want the Bot counter, then ignore this error.`);
}
try {
  await lib.discord.channels['@0.2.1'].update({
    channel_id: `${botChannelId}`,
    name: `${bot.length} Bots`,
  });
} catch (e) {
  console.log(`ERROR: updating Bot channel failed. Check the id provided is correct. If you only want the Human counter, the ignore this error.`);
}
//MeltedButter#9266