import { Enchantment } from "@minecraft/server";

export function getEnchantText(enchantments: Enchantment[]): string {
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');

    return enchantments.map(enchantment => {
        const name = capitalize(enchantment.type.id);
        const level = enchantment.level;
        const romanNumerals = ["I", "II", "III", "IV", "V"];
        return `§7${name} ${romanNumerals[level - 1]}§r`;
    }).join("\n");
}