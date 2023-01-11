const sf = require("seconds-formater");
const {progressBar} = require("../../player/functions/progress-bar");
const {msToSeconds} = require("../../utils/Utils");

module.exports = class NowPlaying extends Interaction {
    constructor() {
        super({
            name: "nowplaying",
            description: "Exibe a faixa de reprodução atual",
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

        let hasQueue = this.client.player.hasQueue(int.guild.id);
        if (!hasQueue) {
            return int.reply({
                content: "Não há música tocando nesta guilda!",
                ephemeral: true,
            });
        }

        let queue = this.client.player.getQueue(int.guild.id);

        let song = queue.nowPlaying;
        if (!song) {
            return int.reply({
                content: "Não há música tocando nesta guilda!",
                ephemeral: true,
            });
        }

        let total = song.milliseconds;
        let stream = queue.connection.player._state.resource.playbackDuration;

        let seconds = msToSeconds(stream);
        let time;
        if (seconds === 86400) {
            time = sf.convert(seconds).format("D day");
        } else if (seconds >= 3600) {
            time = sf.convert(seconds).format("H:MM:SS");
        } else {
            time = sf.convert(seconds).format("M:SS");
        }

        let emb = new EmbedBuilder()
            .setTitle(song.name)
            .setURL(song.url)
            .setColor("#2f3136")
            .setThumbnail(song.thumbnail)
            .setDescription(
                `${progressBar(
                    total,
                    stream,
                    18,
                    "▬",
                    this.client.emotes.get("line"),
                    this.client.emotes.get("slider")
                )} ${time}/${song.duration}`
            );

        return int.reply({embeds: [emb]});
    }
};
