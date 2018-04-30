const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    message.delete();

    let server = message.guild;
    let user = message.author;

    let category = server.channels.find("name", "Tickets");
    if (category) {
        server.createChannel(`#t-${user.username}-${user.discriminator}`).then(channel => {
            channel.setParent(category);

            let staffRole = server.roles.find("name", "Staff Team");

            channel.overwritePermissions(server.id, { READ_MESSAGES: false });
            channel.overwritePermissions(staffRole, { READ_MESSAGES: true });
            channel.overwritePermissions(user, { READ_MESSAGES: true });

            let msgChannel = message.channel;

            let embedMsg = new Discord.RichEmbed()
                .setAuthor(`Support Ticket Created`)
                .setDescription(`Channel: #t-${user.username}-${user.discriminator}`)
                .setFooter(`MC-Merchant • ${message.createdAt.toDateString()}`);

                msgChannel.send(embedMsg).then(embedMsg => {
                embedMsg.delete(3000).catch(e => { });
            });
        });
    } else {
        let noExistMsg = "An error has occured.\n\nError: Couldn't find category!";
        channel.send(noExistMsg).then(noExistMsg => {
            noExistMsg.delete(15000).catch(e => { });
        });

    }
}

module.exports.help = {
    name: "help"
}
