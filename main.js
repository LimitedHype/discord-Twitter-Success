const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json")
var Twit = require('twit')
const Fs = require('fs');
const Path = require('path')
const Axios = require('axios')

var T = new Twit({
    consumer_key: '',
    consumer_secret: '',
    access_token: '',
    access_token_secret: '',
})




const prefix = "!"
client.on("message", message => {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (message.channel.id === "DISCORD SUCCCESS CHANNEL" && message.attachments.size > 0) {


        async function download() {
            const url = message.attachments.array()[0].url
            const path = Path.resolve(__dirname, 'files', 'stuff.png')

            const response = await Axios({
                method: 'GET',
                url: url,
                responseType: 'stream'
            })
            response.data.pipe(Fs.createWriteStream(path))
            return new Promise((resolve, reject) => {
                response.data.on('end', () => {
                    resolve()
                })
                response.data.on('error', err => {
                    reject(err)

                })

            })

        }

        download()

        setTimeout(function () {


            var b64content = Fs.readFileSync('files/stuff.png', { encoding: 'base64' })

            T.post('media/upload', { media_data: b64content }, uploaded); function uploaded(err, data, response) {
                console.log(data)
                var id = data.media_id_string
                var tweet = {
                    status: `Success by ${message.author.username}`,
                    media_ids: [id]
                }
                T.post('statuses/update', tweet, tweeted)
            }
            function tweeted(err, data, response) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("success")
                    var done = true; 
                    message.channel.send({embed: { 
                        color: 0x00d00d,
                        description: "Posted your success!", 
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: 'Made by Charliekicks#0001' // at the foot of the embed
                        }

                    }})
                }
            }
        }, 1000);



    }




})









client.on('error', console.error);



client.login(config.token);
