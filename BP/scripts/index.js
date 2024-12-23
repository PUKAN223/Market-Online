import { system, world } from "@minecraft/server";
import { QuickItemDatabase } from "./Class/ItemDatabase";
import { MarketUi } from "Class/MarketUi";
import DynamicProperties from "Class/Database";
const itemDB = new QuickItemDatabase(`it_market`, 1, 1000, true);
world.afterEvents.itemUse.subscribe(ev => {
    const { source, itemStack } = ev;
    if (itemStack.typeId == "minecraft:clock") {
        const ui = new MarketUi();
        ui.showMainUi(source, itemDB);
    }
});
world.beforeEvents.chatSend.subscribe(ev => {
    if (ev.message == "!reset") {
        system.run(() => {
            world.getDynamicPropertyIds().filter(x => x.startsWith("market:")).forEach(id => {
                const dynamicProperty = new DynamicProperties(id);
                [...dynamicProperty.keys].forEach(key => {
                    try {
                        itemDB.set(key, null);
                        itemDB.delete(key);
                    }
                    catch (e) { }
                });
                new DynamicProperties(id).clear();
            });
        });
        ev.cancel = true;
    }
});
