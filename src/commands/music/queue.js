const paginationEmbed = require("../../utils/Pagination");

module.exports = class Queue extends Interaction {
    constructor() {
        super({
            name: "queue",
            description: "Exibe a fila de músicas",
        });
    }

    async exec(int, data) {
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

        let queue = this.client.player.getQueue(int.guild.id);
        if (!queue || !queue.songs.length)
            return int.reply({
                content: "Não há nada na fila!",
                ephemeral: true,
            });

        let btn1 = new ButtonBuilder()
            .setCustomId("previousbtn")
            .setLabel("Previous")
            .setStyle(ButtonStyle.Secondary);

        const btn2 = new ButtonBuilder()
            .setCustomId("nextbtn")
            .setLabel("Next")
            .setStyle(ButtonStyle.Primary);

        let currentEmbedItems = [];
        let embedItemArray = [];
        let pages = [];

        let buttonList = [btn1, btn2];

        if (queue.songs.length > 11) {
            queue.songs.forEach((s, i) => {
                s.index = i;
                if (s.name !== queue.nowPlaying.name) {
                    if (currentEmbedItems.length < 10) currentEmbedItems.push(s);
                    else {
                        embedItemArray.push(currentEmbedItems);
                        currentEmbedItems = [s];
                    }
                }
            });
            embedItemArray.push(currentEmbedItems);

            embedItemArray.forEach((x) => {
                let songs = x
                    .map((s) => `[${s.index}. ${s.name}](${s.url})`)
                    .join("\n");
                let emb = new EmbedBuilder()
                    .setTitle("Lista de músicas")
                    .setColor("#2f3136")
                    .setThumbnail(int.guild.iconURL())
                    .setDescription(
                        `**Agora tocando**\n[**${queue.nowPlaying.name}**](${queue.nowPlaying.url})\n\n${songs}`
                    );
                pages.push(emb);
            });

            await paginationEmbed(int, pages, buttonList);
        } else {
            let songs = queue.songs
                .map((s, i) => {
                    if (s.name !== queue.nowPlaying.name) {
                        return `[${i}. ${s.name}](${s.url})`;
                    }
                })
                .join("\n");

            let emb = new EmbedBuilder()
                .setTitle("Lista de músicas")
                .setColor("#2f3136")
                .setThumbnail(int.guild.iconURL())
                .setDescription(
                    `**Agora tocando**\n[**${queue.nowPlaying.name}**](${queue.nowPlaying.url})\n\n${songs}`
                )
                .setFooter({text: "Page 1 / 1"});
            return int.reply({embeds: [emb]});
        }
    }
};
