import { ItemStack, Player, world } from "@minecraft/server";
import { QuickItemDatabase } from "./ItemDatabase";
import { calPage } from "Functions/calPages";
import { ProductModels } from "Models/ProductModel";
import DynamicProperties from "./Database";
import { getCode } from "Functions/getCode";

export enum ProductGetOptions {
    owners,
    typeid,
    all
}

export class Product {
    private itemStack: ItemStack
    private owners: string
    private prices: number
    private db: DynamicProperties<ProductModels>
    private itemDB: QuickItemDatabase
    constructor(itemStack: ItemStack, owners: string, prices: number, page: number, itemDB: QuickItemDatabase) {
        this.itemStack = itemStack
        this.owners = owners
        this.prices = prices
        this.db = new DynamicProperties(`market:${page}`)
        this.itemDB = itemDB
    }

    public addProduct() {
        const key = `${getCode(5, [...this.db.keys])}`
        let dataS: ProductModels = {
            itemStack: key,
            owner: this.owners,
            prices: this.prices,
            releaseDate: Date.now(),
            history: [],
            isHide: false
        }
        this.db.set(key, dataS)
        this.itemDB.set(key, this.itemStack)
        return dataS
    }

    static removeProduct(key: string, page: number, itemDB: QuickItemDatabase, db: DynamicProperties<ProductModels>) {
        itemDB.delete(db.get(key).itemStack)
        db.delete(key)
    }

    static setProduct(key: string, page: number, data: ProductModels) {
        const db = new DynamicProperties<ProductModels>(`market:${page}`)
        db.set(key, data)
    }

    static getProduct(getBy: ProductGetOptions, options?: { owners?: string, typeId?: string, hide?: boolean }) {
        if (getBy == ProductGetOptions.all) {
            let data: ProductModels[] = []
            world.getDynamicPropertyIds().filter(x => x.startsWith("market:")).forEach(id => {
                new DynamicProperties<ProductModels>(id).map(x => x[1]).forEach(d => {
                    if (options?.hide ?? false) {
                        if (!d.isHide) {
                            data.push(d)
                        }
                    }
                })
            })
            // let data: ProductModels[] = []
            // world.getDynamicPropertyIds().filter(x => x.startsWith("market:")).forEach(id => {
            //     new DynamicProperties<ProductModels>(id).map(x => x[1]).forEach(d => {
            //         data.push(d)
            //     })
            // })
            return data
        } else if (getBy == ProductGetOptions.owners) {
            let data: ProductModels[] = []
            world.getDynamicPropertyIds().filter(x => x.startsWith("market:")).forEach(id => {
                new DynamicProperties<ProductModels>(id).map(x => x[1]).forEach(d => {
                    data.push(d)
                })
            })
            return data.filter(x => x.owner == options.owners)
        } else {
            let data: ProductModels[] = []
            let dataReturn = []
            world.getDynamicPropertyIds().filter(x => x.startsWith("market:")).forEach(id => {
                new DynamicProperties<ProductModels>(id).map(x => x[1]).forEach(d => {
                    data.push(d)
                })
            })
            for (let i = 0; i < data.length; i++) {
                if ((new QuickItemDatabase(`it_market`, 1, 1000, true).get(data[i].itemStack) as ItemStack).typeId == options.typeId) {
                    dataReturn.push(data[i])
                }
            }
            return dataReturn
        }
    }
}