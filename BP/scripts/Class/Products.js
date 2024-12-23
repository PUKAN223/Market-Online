import { world } from "@minecraft/server";
import { QuickItemDatabase } from "./ItemDatabase";
import DynamicProperties from "./Database";
import { getCode } from "Functions/getCode";
export var ProductGetOptions;
(function (ProductGetOptions) {
    ProductGetOptions[ProductGetOptions["owners"] = 0] = "owners";
    ProductGetOptions[ProductGetOptions["typeid"] = 1] = "typeid";
    ProductGetOptions[ProductGetOptions["all"] = 2] = "all";
})(ProductGetOptions || (ProductGetOptions = {}));
export class Product {
    constructor(itemStack, owners, prices, page, itemDB) {
        this.itemStack = itemStack;
        this.owners = owners;
        this.prices = prices;
        this.db = new DynamicProperties(`market:${page}`);
        this.itemDB = itemDB;
    }
    addProduct() {
        const key = `${getCode(5, [...this.db.keys])}`;
        let dataS = {
            itemStack: key,
            owner: this.owners,
            prices: this.prices,
            releaseDate: Date.now(),
            history: [],
            isHide: false
        };
        this.db.set(key, dataS);
        this.itemDB.set(key, this.itemStack);
        return dataS;
    }
    static removeProduct(key, page, itemDB, db) {
        itemDB.delete(db.get(key).itemStack);
        db.delete(key);
    }
    static setProduct(key, page, data) {
        const db = new DynamicProperties(`market:${page}`);
        db.set(key, data);
    }
    static getProduct(getBy, options) {
        if (getBy == ProductGetOptions.all) {
            let data = [];
            world.getDynamicPropertyIds().filter(x => x.startsWith("market:")).forEach(id => {
                new DynamicProperties(id).map(x => x[1]).forEach(d => {
                    if (options?.hide ?? false) {
                        if (!d.isHide) {
                            data.push(d);
                        }
                    }
                });
            });
            // let data: ProductModels[] = []
            // world.getDynamicPropertyIds().filter(x => x.startsWith("market:")).forEach(id => {
            //     new DynamicProperties<ProductModels>(id).map(x => x[1]).forEach(d => {
            //         data.push(d)
            //     })
            // })
            return data;
        }
        else if (getBy == ProductGetOptions.owners) {
            let data = [];
            world.getDynamicPropertyIds().filter(x => x.startsWith("market:")).forEach(id => {
                new DynamicProperties(id).map(x => x[1]).forEach(d => {
                    data.push(d);
                });
            });
            return data.filter(x => x.owner == options.owners);
        }
        else {
            let data = [];
            let dataReturn = [];
            world.getDynamicPropertyIds().filter(x => x.startsWith("market:")).forEach(id => {
                new DynamicProperties(id).map(x => x[1]).forEach(d => {
                    data.push(d);
                });
            });
            for (let i = 0; i < data.length; i++) {
                if (new QuickItemDatabase(`it_market`, 1, 1000, true).get(data[i].itemStack).typeId == options.typeId) {
                    dataReturn.push(data[i]);
                }
            }
            return dataReturn;
        }
    }
}
