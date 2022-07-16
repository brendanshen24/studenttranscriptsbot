const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const fs = require('fs');
const pdf = require('pdf-parse');
const { DownloaderHelper } = require('node-downloader-helper');

const filenamefinder = (link) =>{
    const linklist = link.split('/')
    return linklist[linklist.length -1]
}

const pdfgetparse = (messagemethod,link) =>{
    const filename = filenamefinder(link)
    const download = new DownloaderHelper(link, __dirname);
    download.on('end', () =>
        pdf(fs.readFileSync('./' + filename)).then(function(data) {
            const spacesplit = data.text.split(' ')
            const newlist = []
            for (let i = 0; i < spacesplit.length; i++) {
                if (spacesplit[i][spacesplit[i].length - 7] === '/' || spacesplit[i][spacesplit[i].length - 8] === '/'){
                    newlist.push(spacesplit[i])
                }
            }
            const finalscores = []
            for (let i = 0; i < newlist.length; i++) {
                let percent = ''
                percent += newlist[i].split('/')[1][2]
                percent += newlist[i].split('/')[1][3]
                //console.log(Number(percent))
                if (Number(percent) != NaN){
                    if (Number(percent) === 10){
                        if (newlist[i].split('/')[1][3] === '0'){
                            percent += newlist[i].split('/')[1][4]
                        }
                    }
                    if (Number(percent) <= 100){
                        finalscores.push(Number(percent))
                    }
                }
            }
            let total = 0
            for (let i = 0; i < finalscores.length; i++) {
                total += finalscores[i]
            }
            let final = total / finalscores.length
            let rounded = Math.round(final * 100) / 100
            messagemethod.reply('Your grade average is ' + rounded.toString()+'%.')
            try {
                fs.unlinkSync('./' + filename)
                //file removed
            } catch(err) {
                console.error(err)
            }
        })
    )
    download.start();
}

const commandHandle = (message,link) =>{
    let messagelist = message.content.split(' ');
    if (messagelist[0] === '!average'){
        //console.log(link)
        pdfgetparse(message,link)
    }
}

client.on('messageCreate', (message) =>{
    if (message.content[0] == '!'){
        if (Array.from(message.attachments)[0] != undefined){
            commandHandle(message, Array.from(message.attachments)[0][1].attachment)
        }
    }
})

client.login('INSERT_DISCORD_BOT_TOKEN_HERE');