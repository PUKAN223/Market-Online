export function getEnchantText(enchantments) {
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
    return enchantments.map(enchantment => {
        const name = capitalize(enchantment.type.id);
        const level = enchantment.level;
        const romanNumerals = ["I", "II", "III", "IV", "V"];
        return `§7${name} ${romanNumerals[level - 1]}§r`;
    }).join("\n");
}
