const DMP = require("discord-music-player");

module.exports = class Search extends Interaction {
    constructor() {
        super({
            name: "search",
            description: "Pesquisa uma faixa no YouTube",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "nome",
                    description: "O nome da musica",
                    required: true,
                },
            ],
        });
    }

    async exec(int, data) {
        const input = int.options.getString("nome");

        let channel = int.member.voice.channel;

        if (!channel)
            return int.reply({
                content: `${this.client.emotes.get(
                    "nomic"
                )} Você deve estar em um canal de voz para usar este comando!`,
                ephemeral: true,
            });
        if (int.guild.members.me.voice.channel && channel !== int.guild.members.me.voice.channel)
            return int.reply({
                content: `${this.client.emotes.get(
                    "nomic"
                )} Você deve estar no mesmo canal de voz que eu para usar este comando!`,
                ephemeral: true,
            });

        let isAllowed = data.voiceChannels.find((c) => c === channel.id);

        if (data.voiceChannels.length > 0 && !isAllowed) {
            return int.reply({
                content: `${this.client.emotes.get(
                    "nomic"
                )} Você deve estar em um dos canais de voz permitidos para usar este comando!`,
                ephemeral: true,
            });
        }

        int.reply({
            content: `${this.client.emotes.get(
                "search"
            )} Searching \`${input}\` ${this.client.emotes.get("youtube")}`,
        });

        let hasQueue = this.client.player.hasQueue(int.guild.id);
        let queue;
        if (!hasQueue) {
            queue = this.client.player.createQueue(int.guild.id);
            await queue.join(channel);
        } else {
            queue = this.client.player.getQueue(int.guild.id);
        }

        let results = await DMP.Utils.search(
            input,
            {requestedBy: int.user},
            queue,
            10
        ).catch((e) => {
            console.log(e);
        });

        if (!results) {
            if (!hasQueue) {
                await queue.stop();
            }

            return int.editReply({
                content: "Nenhum resultado encontrado!",
            });
        }

        let emb = new EmbedBuilder()
            .setTitle("Resultado da Pesquisa")
            .setColor("#2f3136")
            .setDescription(
                `Envie o numero da track\n\n` +
                results.map((r, i) => `[${i + 1}. ${r.name}](${r.url})`).join("\n")
            );

        await int.editReply({content: " ", embeds: [emb]});

        let filter = (m) => m.author.id === int.user.id;
        let selection = await int.channel
            .awaitMessages({
                filter,
                max: 1,
                time: 30000,
                errors: ["time"],
            })
            .then((m) => {
                let select = m.first().content;

                m.first().delete();
                let song = results.find((r, i) => {
                    if (i + 1 === Number(select.replace(/^\D+/g, ""))) {
                        return r;
                    }
                });

                if (!song) {
                    return int.editReply({
                        content: "Nenhum resultado encontrado!",
                        embeds: [],
                    });
                }

                int.deleteReply();

                return this.client.play(
                    this.client,
                    int,
                    data,
                    song,
                    "youtube",
                    false,
                    true
                );
            })
            .catch(() => {
                return int.editReply({
                    content: "Você demorou muito para responder",
                    embeds: [],
                });
            });

        await selection;
    }
};
