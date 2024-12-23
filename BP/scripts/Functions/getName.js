export function getName(itemStack) {
    let itemName = itemStack.typeId.split(":")[1];
    itemName = itemName.replace(/_/g, " ");
    itemName = itemName
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    return (itemStack.nameTag ? itemStack.nameTag : itemName);
}
