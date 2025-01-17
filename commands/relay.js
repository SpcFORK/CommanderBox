const fs = require('fs');

require('dotenv').config();

const words = fs.readFileSync("./client/data/words.txt", "utf8").split(/\r?\n/);

module.exports = {
    name: 'relay',
    description: 'Relay command',
    execute(data, client, prefix) {
        if (data.msg.startsWith(`${prefix}relay`)) {
            let URL = process.env.WEBHOOK_URL;

            var connectedParams = {
                username: "CommanderBox",
                embeds: [{
                    title: "System",
                    description: `Relay connected`,
                    color: 65280,
                    footer: {
                        text: `Lobby ID: ${client.lobbyId} - CommanderBox`
                    }
                }]
            }

            send(connectedParams);

            client.on("playerJoin", (userJoin) => {
                var params = {
                    username: "CommanderBox",
                    embeds: [{
                        title: "System",
                        description: `**${userJoin.name}** joined the room!`,
                        color: 65280,
                        footer: {
                            text: `Lobby ID: ${client.lobbyId} - CommanderBox`
                        }
                    }]
                }
                send(params);
            })

            client.on("playerLeave", (userLeave) => {
                if (userLeave.reason === 0) {
                    var params = {
                        username: "CommanderBox",
                        embeds: [{
                            title: "System",
                            description: `**${userLeave.player.name}** left the room!`,
                            color: 16711680,
                            footer: {
                                text: `Lobby ID: ${client.lobbyId} - CommanderBox`
                            }
                        }]
                    }
                    send(params);
                }

                if (userLeave.reason === 1) {
                    var params = {
                        username: "CommanderBox",
                        embeds: [{
                            title: "System",
                            description: `**${userLeave.player.name}** has been kicked.`,
                            color: 16711680,
                            footer: {
                                text: `Lobby ID: ${client.lobbyId} - CommanderBox`
                            }
                        }]
                    }
                    send(params);
                }

                if (userLeave.reason === 2) {
                    var params = {
                        username: "CommanderBox",
                        embeds: [{
                            title: "System",
                            description: `**${userLeave.player.name}** has been banned.`,
                            color: 16711680,
                            footer: {
                                text: `Lobby ID: ${client.lobbyId} - CommanderBox`
                            }
                        }]
                    }
                    send(params);
                }
            })

            client.on("newOwner", (userHost) => {
                var params = {
                    username: "CommanderBox",
                    embeds: [{
                        title: "System",
                        description: `**${userHost.player.name}** is now the new host.`,
                        color: 16754756,
                        footer: {
                            text: `Lobby ID: ${client.lobbyId} - CommanderBox`
                        }
                    }]
                }
                send(params);
            })

            // packet logging for id 11
            client.on("packet", (packetData) => {
                if (packetData.id != 11) return;
              
                if (client.state === 0) {
                    var params = {
                        username: "CommanderBox",
                        embeds: [{
                            title: "System",
                            description: `Waiting For Players`,
                            color: 16754756,
                            footer: {
                                text: `Lobby ID: ${client.lobbyId} - CommanderBox`
                            }
                        }]
                    }
                    send(params);

                    // fix bug where text stays green even when nobody is drawing anymore
                    client.currentDrawer = null;
                }

                if (client.state === 1) {
                    var params = {
                        username: "CommanderBox",
                        embeds: [{
                            title: "System",
                            description: `Game starting in a few seconds`,
                            color: 16754756,
                            footer: {
                                text: `Lobby ID: ${client.lobbyId} - CommanderBox`
                            }
                        }]
                    }
                    send(params);
                }

                if (client.state === 3) {
                    var params = {
                        username: "CommanderBox",
                        embeds: [{
                            title: "System",
                            description: `**${client.currentDrawer?.name || "N/A"}** is choosing a word!`,
                            color: 16754756,
                            footer: {
                                text: `Lobby ID: ${client.lobbyId} - CommanderBox`
                            }
                        }]
                    }
                    send(params);
                }

                if (client.state === 4) {
                    var params = {
                        username: "CommanderBox",
                        embeds: [{
                            title: "System",
                            description: `**${client.currentDrawer?.name || "N/A"}** is drawing now!`,
                            color: 3765710,
                            footer: {
                                text: `Lobby ID: ${client.lobbyId} - CommanderBox`
                            }
                        }]
                    }
                    send(params);
                }

                if (client.state === 5) {
                    client.currentDrawer = null;
                }

                if (client.state === 7) {
                    var params = {
                        username: "CommanderBox",
                        embeds: [{
                            title: "System",
                            description: `Waiting for the game to start`,
                            color: 16754756,
                            footer: {
                                text: `Lobby ID: ${client.lobbyId} - CommanderBox`
                            }
                        }]
                    }
                    send(params);

                    client.currentDrawer = null;
                }

                if (packetData.data.data.reason === 1) {
                    var params = {
                        username: "CommanderBox",
                        embeds: [{
                            title: "System",
                            description: `Time is up!\nThe word was '**${packetData.data.data.word}**'`,
                            color: 65280,
                            footer: {
                                text: `Lobby ID: ${client.lobbyId} - CommanderBox`
                            }
                        }]
                    }
                    send(params);
                }

                if (packetData.data.data.reason === 0) {
                    var params = {
                        username: "CommanderBox",
                        embeds: [{
                            title: "System",
                            description: `The word was '**${packetData.data.data.word}**'\nEveryone guessed the word!`,
                            color: 65280,
                            footer: {
                                text: `Lobby ID: ${client.lobbyId} - CommanderBox`
                            }
                        }]
                    }
                    send(params);
                }

                if (packetData.data.id === 6) {
                    var params = {
                        username: "CommanderBox",
                        embeds: [{
                            title: "System",
                            description: `Round **${client.round}** has ended`,
                            color: 16711680,
                            footer: {
                                text: `Lobby ID: ${client.lobbyId} - CommanderBox`
                            }
                        }]
                    }
                    send(params);
                }
            })

            client.on("startError", (gameStartErr) => {
                if (gameStartErr === 0) {
                    var params = {
                        username: "CommanderBox",
                        embeds: [{
                            title: "System",
                            description: `The host needs atleast **2** players to start the game`,
                            color: 16711680,
                            footer: {
                                text: `Lobby ID: ${client.lobbyId} - CommanderBox`
                            }
                        }]
                    }
                    send(params);
                }

                if (gameStartErr === 100) {
                    var params = {
                        username: "CommanderBox",
                        embeds: [{
                            title: "System",
                            description: `The server will be restarting soon`,
                            color: 16711680,
                            footer: {
                                text: `Lobby ID: ${client.lobbyId} - CommanderBox`
                            }
                        }]
                    }
                    send(params);
                }
            })

            client.on("playerGuessed", (userGuess) => {
                var params = {
                    username: "CommanderBox",
                    embeds: [{
                        title: "System",
                        description: `**${userGuess.player.name}** guessed the word!`,
                        color: 65280,
                        footer: {
                            text: `Lobby ID: ${client.lobbyId} - CommanderBox`
                        }
                    }]
                }
                send(params);
            })

            client.on("hintRevealed", () => {
                var params = {
                    username: "CommanderBox",
                    embeds: [{
                        title: "System",
                        description: `A Hint was Revealed!`,
                        color: 16754756,
                        footer: {
                            text: `Lobby ID: ${client.lobbyId} - CommanderBox`
                        }
                    }]
                }
                send(params);
            })

            client.on("roundStart", () => {
                var params = {
                    username: "CommanderBox",
                    embeds: [{
                        title: "System",
                        description: `Round **${client.round}** has started`,
                        color: 65280,
                        footer: {
                            text: `Lobby ID: ${client.lobbyId} - CommanderBox`
                        }
                    }]
                }
                send(params);
            })


            client.on("vote", (userVote) => {
                if (userVote.vote === 1) {
                    var params = {
                        username: "CommanderBox",
                        embeds: [{
                            title: "System",
                            description: `**${userVote.player.name}** liked the drawing!`,
                            color: 65280,
                            footer: {
                                text: `Lobby ID: ${client.lobbyId} - CommanderBox`
                            }
                        }]
                    }
                    send(params);
                }

                if (userVote.vote === 0) {
                    var params = {
                        username: "CommanderBox",
                        embeds: [{
                            title: "System",
                            description: `**${userVote.player.name}** disliked the drawing!`,
                            color: 16711680,
                            footer: {
                                text: `Lobby ID: ${client.lobbyId} - CommanderBox`
                            }
                        }]
                    }
                    send(params);
                }
            })

            client.on("text", (relay) => {
                if (relay.player.name === client.options.name) return;

                if (relay.msg.includes("@everyone") || relay.msg.includes("@here")) return;

                if (relay.msg.includes('@') || relay.msg.includes("<") || relay.msg.includes(">")) return;

                if (relay.msg.startsWith(prefix)) return;

                // prevent auto-guessers from ruining the webhook 
                /* for (const word of words) {
                   if (relay.msg === word) return;
                 } */

              if (relay.player.guessed === false) {
                if (relay.player.name === client.currentDrawer?.name) {
                  var params = {
                      username: "CommanderBox",
                      embeds: [{
                          title: "Chat",
                          description: `**${relay.player.name}**: ${relay.msg}`,
                          color: 8236351, // Color for drawer
                          footer: {
                              text: `Lobby ID: ${client.lobbyId} - CommanderBox`
                          }
                      }]
                  }
                  send(params);
                } else {
                  var params = {
                      username: "CommanderBox",
                      embeds: [{
                          title: "Chat",
                          description: `**${relay.player.name}**: ${relay.msg}`,
                          color: 16777215, // Default color
                          footer: {
                              text: `Lobby ID: ${client.lobbyId} - CommanderBox`
                          }
                      }]
                  }
                  send(params);
                }
              };

                if (relay.player.guessed === true) {
                    var params = {
                        username: "CommanderBox",
                        embeds: [{
                            title: "Chat",
                            description: `**${relay.player.name}**: ${relay.msg}`,
                            color: 8236351,
                            footer: {
                                text: `Lobby ID: ${client.lobbyId} - CommanderBox`
                            }
                        }]
                    }

                    send(params);
                };
            });

            function send(params) {
                fetch(URL, {
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(params)
                })
            }

            client.sendMessage('Relaying all chat messages to discord, you must set the webhook URL in the env file.');

            setTimeout(() => {
                client.sendMessage("It isn't recommended to do this in public lobbies just yet.");
            }, 1000)
        }
    },
};