const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    message.delete();

    let channel = message.channel;
    let server = message.guild;
    let user = message.author;

    let category = server.channels.find("name", "Tickets");
    if (category) {
        if (channel.parent.id === category.id) {
            if (channel.name.startsWith("t-")) {
                channel.delete();
            }
        } else {
            let onlyInTicket = "That command can only be executed inside a ticket channel.";
            channel.send(onlyInTicket).then(onlyInTicket => {
                onlyInTicket.delete(15000).catch(e => { });
            });
        }
    } else {
        let noExistMsg = "An error has occured.\n\nError: Couldn't find category!";
        channel.send(noExistMsg).then(noExistMsg => {
            noExistMsg.delete(15000).catch(e => { });
        });

    }
}

module.exports.help = {
    name: "close"
}
