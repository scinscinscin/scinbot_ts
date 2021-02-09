export {};
const { colors } = require('../config/main.json');
const green: string = colors.green;

function about(args: string[], authorID: string, author: string, channelID: string, channel: any, creator: any, bot: any){
    let message: string;
    message =  "**";
    message += "Info: \n";
    message += `Discord bot in TypeScript \n\n`
    message += `Creator: ${creator.username}#${creator.discriminator} \n`;
    message += `Creator ID: ${creator.id} \n`;
    message += `Bot: ${bot.username}#${bot.discriminator} \n`;
    message += `Bot ID: ${bot.id} \n`;
    message += "**";
    
    return({"color": green, "title": `About ${bot.username}`, "message": `${message}`});
}

module.exports = about;