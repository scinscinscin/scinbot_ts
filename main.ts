interface response {
    color: string,
    title: string,
    message: string
}

const require_dir = require('require-dir');
const commands = require_dir('./commands');
const commandList: string[] = Object.keys(commands);                                                // Array containing the list of commands
const helper = require_dir('./commands/helper');

const Discord = require('discord.js');
const client = new Discord.Client();

const { token } = require('./config/token.json');
const { prefix, color } = require('./config/main.json');
const { red, green } = color;

function sendMsg(response:response, author:string, channel:any){
    let { color, title, message } = response;                                                       // Get the color, title, and message from the response object

    channel.send(new Discord.MessageEmbed()
        .setColor(color)
        .addField(title, message)
        .setTimestamp()
        .setFooter(`Requested by: ${author}`)
    );
}

client.once('ready', () => {
	console.log('Logged in successfully');
    client.user.setActivity(`you. My prefix is ${prefix}`, {
        type: "WATCHING",
        url: "https://scinorandex.xyz/"
    });
});

client.on('message', async (message) => {
    if(!message.content.startsWith(prefix) || message.author.bot){
        return;                                                                                     // Disregard if it doesn't start with prefix / author is a bot
    }

    let args: string[] = message.content.substring(prefix.length).split(" ");                       // Remove the prefix and split the message
    let command: string  = args.shift();                                                            // Remove the command from the words array and store it in command
    
    if(!commandList.includes(command)){
        return;                                                                                     // Break out of function if the command is not in the list
    }
    
    let channel = await client.channels.cache.get(message.channel.id);                              // Channel that the message was sent in
    let authorID = message.author.id;                                                               // User ID of the author
    let author =  message.author.username;                                                          // Username of the author
    
    let response: response = await commands[command](args, authorID, author);                       // The response of the command

    if (response === undefined){
        response = { "color": red, "title": "Unknown error", "message": `**An internal error has occured**`};                   // Response if the command didn't return
    }
    
    sendMsg(response, author, channel)
})

client.login(token);