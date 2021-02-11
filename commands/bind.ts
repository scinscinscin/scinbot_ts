export {};
const fs = require('fs');

const { colors, prefix } = require('../config/main.json');
const { red, green } = colors;

function bind(args: string[], authorID: string, author: string, channelID: string, channel: any, creator: any, bot: any){
    const binds: Object = JSON.parse(fs.readFileSync(`./config/binds.json`, `utf8`));         // Object containing all detections
    let keys: string[] = Object.keys(binds);                                                  // List of keys
    let bind: string = args.join("").toLowerCase();                                           // Combine the passed in arguments and force it to lowercase
    let message: string = "";
    
    if(bind === "list"){
        message = keys.join("\n");
        return({"color": green, "title": `List of Binds`, "message": `${message}`})
    }else if(!keys.includes(bind)){
        return({"color": red, "title": `Bind not found`, "message": `The bind "${args}" was not found`})
    }

    message = binds[bind];
    return({"color": green, "title": `${bind}`, "message": `${message}`});
}

module.exports = bind;
module.exports.help = "Get a bind. List binds using ``" + prefix + "bind list``";