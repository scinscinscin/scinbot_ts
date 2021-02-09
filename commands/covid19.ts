export {};
const coronaAPI = 'https://coronavirus-tracker-api.herokuapp.com';

const require_dir = require('require-dir');
const helper = require_dir('./helper');
const { color } = require('../config/main.json');
const { red, green } = color;

async function covid19(args: string[], author: string, authorID: string){
    // Determine which API endpoint to use
    let endpoint: string;
    if (args.length === 0){
        endpoint = "/v2/latest";
    }

    let result: any = await helper.download(`${coronaAPI}${endpoint}`);                         // Object containing statistics
    let message: string = "";

    if(result === "error" || result === undefined){
        return({ "color": red, "title": "Unable to reach API", "message": `**${coronaAPI} could not be reached**`});
    }

    if(args.length === 0){                                                                      // If the user doesn't specify a country
        let { confirmed, deaths, recovered } = result.latest;                                   // Get the individual statistics
        message += `**`
        message += `:red_square: Confirmed: ${confirmed}\n`;
        message += `:black_large_square: Deaths: ${deaths}\n`;
        message += `:green_square: Recovered: ${recovered}\n`;
        message += `**`;
        
        return({ "color": green, "title": "Worldwide COVID-19 statistics", "message": `${message}`});
    }
}

module.exports = covid19;