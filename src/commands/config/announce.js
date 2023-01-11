module.exports = class Announce extends Interaction {
    constructor() {
        super({
            name: "announce",
            description: "Alterna se deseja enviar a mensagem de reprodução iniciada",
            options: [
                {
                    type: ApplicationCommandOptionType.Boolean,
                    name: "mode",
                    description: "Se deve enviar a mensagem de reprodução iniciada",
                    required: true
                }
            ],
        });
    }

    async exec(int, data) {
        if (!int.member.permissions.has("MANAGE_GUILD"))
            return int.reply({
                content: "Você não tem as permissões necessárias para fazer isso!",
                ephemeral: true,
            });

        const mode = int.options.getBoolean("mode");

        if (mode === true) {
            if (data.announcements) {
                return int.reply({
                    content: "Os anúncios já estão habilitados!",
                    ephemeral: true,
                });
            }

            data.announcements = true;
            await data.save();

            int.reply({
                content: "Os anúncios agora estão ativados!",
                ephemeral: true,
            });
        } else {

            if (!data.announcements) {
                return int.reply({
                    content: "Os anúncios já estão desativados!",
                    ephemeral: true,
                });
            }

            data.announcements = false;
            await data.save();

            int.reply({
                content: "Os anúncios agora estão desativados!",
                ephemeral: true,
            });
        }
    }
};
