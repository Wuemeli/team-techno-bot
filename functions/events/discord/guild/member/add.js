// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const jimp = require('jimp');

const avatarBorderColor = 0xFFDB00FF;
const channelID = `${process.env.CHANNEL_ID}`;
const bannerURL = 'https://cdn.discordapp.com/attachments/858871014598770698/859573746863308800/Black_Wallpaper.png';
const avatarURL = `https://cdn.discordapp.com/avatars/${context.params.event.user.id}/${context.params.event.user.avatar}.png?size=128`;
let img = await jimp.read(bannerURL);
let avatar = await jimp.read('https://polybit-apps.s3.amazonaws.com/stdlib/users/discord/profile/image.png?1621007833204');

if (context.params.event.user.avatar) {
  try {
    avatar = await jimp.read(avatarURL);
  } catch (e) {
    console.log(`Could not read the URL passed to JIMP. Make sure you're not using test data!`);
  }
}

let avatarRing = await new jimp(256 + 32,256 + 32, avatarBorderColor);

avatarRing.circle();
img.resize(1024, 576);
avatar.circle();
avatar.resize(256, 256);

img.composite(avatarRing, 512 - 128 - 16, 128 - 16);
img.composite(avatar, 512 - 128, 128);

await jimp.loadFont(jimp.FONT_SANS_64_WHITE).then(font => {
  img.print(
    font,
    0,
    440,
    {
      text: `Welcome ${context.params.event.nick || context.params.event.user.username}#${context.params.event.user.discriminator}!`,
      alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: jimp.VERTICAL_ALIGN_MIDDLE
    },
    1024,
    40
  )
});

let buffer = await img.getBufferAsync(jimp.MIME_PNG);

return lib.discord.channels['@0.1.1'].messages.create({
  channel_id: `${channelID}`,
  content: `Everyone welcome **${context.params.event.nick || context.params.event.user.username}** to the server!`,
  filename: 'welcome.png',
  file: buffer,
});