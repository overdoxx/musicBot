module.exports = class Roles extends Interaction {
    constructor() {
        super({
            name: "roles",
            description: "Gerenciar cargos de DJ",
            options: [
                {
                    type: ApplicationCommandOptionType.Subcommand,
                    name: "add",
                    description: "Adicione um cargo à lista de cargos de DJ",
                    options: [
                        {
                            type: ApplicationCommandOptionType.Role,
                            name: "role",
                            description: "O cargo a adicionar",
                            required: true,
                        },
                    ]
                },
                {
                    type: ApplicationCommandOptionType.Subcommand,
                    name: "remove",
                    description: "Remover um cargo da lista de cargos de DJ",
                    options: [
                        {
                            type: ApplicationCommandOptionType.Role,
                            name: "role",
                            description: "O cargo a remover",
                            required: true,
                        },
                    ]
                },
                {
                    type: ApplicationCommandOptionType.Subcommand,
                    name: "list",
                    description: "Lista todos os cargos de DJ",
                },
            ],
        });
    }

    async exec(int, data) {
        if (!int.member.permissions.has("MANAGE_GUILD"))
            return int.reply({
                content: "Você não tem as permissões necessárias para fazer isso!",
                ephemeral: true,
            });

        const cmd = int.options.getSubcommand()

        if (cmd === "add") {

            let role = int.options._hoistedOptions[0].role

            if (role.id === int.guild.id) {
                return int.reply({
                    content: "O cargo *everyone* não é gerenciável!",
                    ephemeral: true,
                });
            }
            let old = data.djRoles.find((r) => r === role.id);

            if (old) {
                return int.reply({
                    content: `O cargo ${role.name} ja esta na lista!`,
                    ephemeral: true,
                });
            }

            data.djRoles.push(role.id);
            await data.save();

            return int.reply({
                content: `Adicionei o cargo ${role.name} a lista de cargos de DJ!`,
                ephemeral: true,
            });
        }
        if (cmd === "remove") {
            let role = int.options._hoistedOptions[0].role;

            if (role.id === int.guild.id) {
                return int.reply({
                    content: "O cargo *everyone* não é gerenciavel!",
                    ephemeral: true,
                });
            }

            let old = data.djRoles.find((r) => r === role.id);

            if (!old)
                return int.reply({
                    content: `O cargo ${role.name} não esta na lista!`,
                    ephemeral: true,
                });

            let index = data.djRoles.indexOf(role.id);
            data.djRoles.splice(index, 1);
            await data.save();

            return int.reply({
                content: `Removi o cargo ${role.name} da lista de cargos de DJ!`,
                ephemeral: true,
            });
        }
        if (cmd === "list") {
            let djs = data.djRoles;

            if (!djs.length)
                return int.reply({
                    content: "Não há cargos de DJ definidos!",
                    ephemeral: true,
                });

            let emb = new EmbedBuilder()
                .setTitle("Lista de cargos de DJ")
                .setThumbnail(int.guild.iconURL({size: 2048}))
                .setColor("#2f3136")
                .setDescription(`${djs.map((m) => `<@&${m}>`).join(" ")}`)
                .setTimestamp();

            return int.reply({embeds: [emb]});
        }
    }
};
