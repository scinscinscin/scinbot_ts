export{};
const { colors } = require('../config/main.json');
const { green } = colors;

function ping(args: string[], authorID: string, author: string, channelID: string, channel: any, creator: any, bot: any, messageObject: any){
    let messageSent: number = messageObject.createdTimestamp;
    let currentTime: number = Math.floor(Date.now());
    let ping: number = currentTime - messageSent;
    
    return({"color": green, "title": `Ping`, "message": `**${ping}ms**`});
}

module.exports = ping;
module.exports.help = "Ping scinbot_ts and get response time";