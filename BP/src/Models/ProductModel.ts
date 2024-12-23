import { ItemStack, Player } from "@minecraft/server";

export interface ProductModels {
    itemStack: string,
    prices: number,
    owner: string,
    releaseDate: number,
    isHide: boolean,
    history: string[]
}