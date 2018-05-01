const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const Enmap = require("enmap");
const bot = new Discord.Client({
    disableEveryone: true
});

const fs = require("fs");

bot.commands = new Discord.Collection();
const cooldowns = new Enmap();

fs.readdir("./commands/", (err, files) => {

    if (err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0) {
        console.log("Could not find commands.");
        return;
    }

    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`Loaded command from ${f}.`);
        bot.commands.set(props.help.name, props);
    });

});

bot.on("ready", async () => {
    console.log("MC-Merchant is now online!")
    bot.user.setActivity(`${botconfig.activity}`);
});

bot.on("message", async message => {
    if (message.channel.type === "dm") return;
    if (message.author.bot) return;

    let msgArray = message.content.split(" ");
    let cmd = msgArray[0];
    let args = msgArray.slice(1);

    let prefix = botconfig.prefix;

    let clearCmd = prefix + "clear";
    let closeCmd = prefix + "close";
    let helpCmd = prefix + "help";

    if (cmd === closeCmd | cmd === helpCmd | cmd === clearCmd) {
        let cmdFile = bot.commands.get(cmd.slice(prefix.length));
        cmdFile.run(bot, message, args);
    }

    let channel = message.channel;
    let id = message.author.id;
    if (channel.name === "advertise") {
        if (bot.commands.has(id)) {
            message.delete();
            let msg = "You can't send a message!";
            channel.send(msg).then(msg => {
                msg.delete(15000);
            });
        } else {
            let server = message.guild;
            let user = message.member;
            let amount = cooldowns.get(id);

            let merchantRole = server.roles.find("name", "Merchant");
            let exporterRole = server.roles.find("name", "Exporter");

            channel.send("Amount: " + amount);

            if (user.roles.has(merchantRole.id)) {
                if (amount < 3) {

                } else {
                    message.delete().then(() => {
                        let maxReached = "You have already reached you maximum amount of messages per day.";
                        channel.send(maxReached).then(maxReached => {
                            maxReached.delete(15000).then(() => {
                                cooldowns.set(id, "3");
                            });
                        });
                    });
                }
            } else if (user.roles.has(exporterRole.id)) {
                if (amount < 2) {

                } else {
                    message.delete().then(() => {
                        let maxReached = "You have already reached you maximum amount of messages per day.";
                        channel.send(maxReached).then(maxReached => {
                            maxReached.delete(15000).then(() => {
                                cooldowns.set(id, "2");
                            });
                        });
                    });
                }
            } else {
                if (amount < 1) {

                } else {
                    message.delete().then(() => {
                        let maxReached = "You have already reached you maximum amount of messages per day.";
                        channel.send(maxReached).then(maxReached => {
                            maxReached.delete(15000).then(() => {
                                cooldowns.set(id, "1");
                            });
                        });
                    });
                }
            }

            // Clear Data Everyday On 00:00.
        }
    }

});

bot.on("guildMemberAdd", (member) => {
    let alertsRole = member.guild.roles.find("name", "alerts");
    member.addRole(alertsRole);
});

bot.login(process.env.TOKEN);
