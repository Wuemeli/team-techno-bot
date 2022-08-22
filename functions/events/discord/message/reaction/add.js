// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let validMessage = '994612271030468748'; //Change this to match the message ID you want to track

let validRoles = {
  '✅': '994296381885911100', // These need to be the role IDs from your server
  'customEmojiName': 'ROLE_ID_3'
};

let validRole = validRoles[context.params.event.emoji.name];

if (context.params.event.message_id === validMessage && validRole) {
  await lib.discord.guilds['@0.1.0'].members.roles.update({
    role_id: `${validRole}`,
    user_id: `${context.params.event.user_id}`,
    guild_id: `${context.params.event.guild_id}`
  });
}