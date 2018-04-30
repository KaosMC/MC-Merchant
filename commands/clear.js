const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    message.delete();

    let channel = message.channel;
    let user = message.member;

    if (user.hasPermission("MANAGE_MESSAGES")) {
        if (args[0]) {
            if (isInt(args[0])) {
                if (Number(args[0]) >= 1) {
                    let remaining = Number(args[0] + 1);
                    while (remaining > 0) {
                        await channel.bulkDelete(Math.min(remaining, 100)).catch(e => { });
                        remaining -= 100;
                    }

                    let clearSuccess = "Cleared " + args[0] + " messages.";
                    channel.send(clearSuccess).then(clearSuccess => {
                        clearSuccess.delete(3000).catch(e => { });
                    });
                } else {
                    let wrongArg = "Incorrect argument.\nArgument must be greater than or equal to 1."
                    channel.send(wrongArg).then(wrongArg => {
                        wrongArg.delete(15000).catch(e => { });
                    });
                }
            } else {
                let wrongArg = "Incorrect argument.\nArgument must be an integer."
                channel.send(wrongArg).then(wrongArg => {
                    wrongArg.delete(15000).catch(e => { });
                });
            }
        } else {
            let noArgs = "Insufficient arguments.\nUsage: -clear <number>";
            channel.send(noArgs).then(noArgs => {
                noArgs.delete(15000).catch(e => { });
            });
        }
    } else {
        let noPerms = "Insufficient permission.";
        channel.send(noPerms).then(noPerms => {
            noPerms.delete(15000).catch(e => { });
        });
    }
};

module.exports.help = {
    name: "clear"
}

function isInt(a) {
    return !isNaN(a) && parseInt(a) == parseFloat(a) && (typeof a != 'string' || (a.indexOf('.') == -1 && a.indexOf(',') == -1));
}