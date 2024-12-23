var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _QuickItemDatabase_instances, _QuickItemDatabase_saveRate, _QuickItemDatabase_validNamespace, _QuickItemDatabase_queuedKeys, _QuickItemDatabase_settings, _QuickItemDatabase_structure, _QuickItemDatabase_quickAccess, _QuickItemDatabase_queuedValues, _QuickItemDatabase_dimension, _QuickItemDatabase_sL, _QuickItemDatabase_load, _QuickItemDatabase_save, _QuickItemDatabase_timeWarn, _QuickItemDatabase_queueSaving, _QuickItemDatabase_romSave;
import { world, system, StructureSaveMode } from '@minecraft/server';
/**
 * @Class Quick Item Database V3.5.1 by Carchi77
 * @Contributors Drag0nD - Coptaine
 * @ Made to fix script api's missing method to save items as object.
 * @ Optimized for low end devices while keeping fast loading times.
 * @ Does NOT impact ingame performance.
 * @ Uses entities inventory and structures.
 * @ Zero data loss: items are saved as a perfect clone.
 * @Example how to setup a database:
 * ```
 * // Initializing a database with a namespace and logs active
 * const itemDatabase = new QuickItemDatabase("namespace", 1, true);
 *
 *
 * ```
**/
export class QuickItemDatabase {
    /**
     * @param {string} namespace The unique namespace for the database keys.
     * @param {number} saveRate The rate of background saves per Tick (50ms), 1 is the recomended value for normal usage, you can use an higher rate if you need to save more than 1 key per tick (performance will be affected).
     * @param {boolean} logs If set to true, the database will log script latency in ms.
     * @param {number} QAMsize Quick Access Memory Size, the max amount of keys to keep quickly accessible. A small size can couse lag on frequent iterated usage, a large number can cause high hardware RAM usage.

     */
    constructor(namespace = "", saveRate = 2, QAMsize = 100, logs = false) {
        _QuickItemDatabase_instances.add(this);
        _QuickItemDatabase_saveRate.set(this, void 0);
        _QuickItemDatabase_validNamespace.set(this, void 0);
        _QuickItemDatabase_queuedKeys.set(this, void 0);
        _QuickItemDatabase_settings.set(this, void 0);
        _QuickItemDatabase_structure.set(this, void 0);
        _QuickItemDatabase_quickAccess.set(this, void 0);
        _QuickItemDatabase_queuedValues.set(this, void 0);
        _QuickItemDatabase_dimension.set(this, void 0);
        _QuickItemDatabase_sL.set(this, void 0);
        __classPrivateFieldSet(this, _QuickItemDatabase_saveRate, saveRate, "f");
        __classPrivateFieldSet(this, _QuickItemDatabase_settings, {
            logs: logs || false,
            namespace: namespace
        }, "f");
        __classPrivateFieldSet(this, _QuickItemDatabase_queuedKeys, [], "f");
        __classPrivateFieldSet(this, _QuickItemDatabase_queuedValues, [], "f");
        __classPrivateFieldSet(this, _QuickItemDatabase_quickAccess, new Map(), "f");
        __classPrivateFieldSet(this, _QuickItemDatabase_validNamespace, /^[a-z0-9_]*$/.test(__classPrivateFieldGet(this, _QuickItemDatabase_settings, "f").namespace), "f");
        __classPrivateFieldSet(this, _QuickItemDatabase_structure, world.structureManager, "f");
        __classPrivateFieldSet(this, _QuickItemDatabase_dimension, world.getDimension("overworld"), "f");
        __classPrivateFieldSet(this, _QuickItemDatabase_sL, world.getDynamicProperty("storagelocation"), "f");
        world.afterEvents.playerSpawn.subscribe(e => {
            if (!__classPrivateFieldGet(this, _QuickItemDatabase_validNamespace, "f"))
                throw new Error(`§c[Item Database] ${namespace} isn't a valid namespace. accepted char: a-z 0-9 _`);
            else if (!world.getDynamicProperty("init")) {
                const { player } = e;
                const plc = player.location;
                if (!__classPrivateFieldGet(this, _QuickItemDatabase_sL, "f")) {
                    __classPrivateFieldSet(this, _QuickItemDatabase_sL, { x: plc.x, y: 318, z: plc.z }, "f");
                    world.setDynamicProperty("storagelocation", __classPrivateFieldGet(this, _QuickItemDatabase_sL, "f"));
                    __classPrivateFieldGet(this, _QuickItemDatabase_dimension, "f").runCommand(`/tickingarea add ${__classPrivateFieldGet(this, _QuickItemDatabase_sL, "f").x} 319 ${__classPrivateFieldGet(this, _QuickItemDatabase_sL, "f").z} ${__classPrivateFieldGet(this, _QuickItemDatabase_sL, "f").x} 318 ${__classPrivateFieldGet(this, _QuickItemDatabase_sL, "f").z} storagearea`);
                }
                __classPrivateFieldSet(this, _QuickItemDatabase_sL, world.getDynamicProperty("storagelocation"), "f");
                world.setDynamicProperty("init", true);
                console.log(`§q[Item Database] is initialized successfully. namespace: ${__classPrivateFieldGet(this, _QuickItemDatabase_settings, "f").namespace}`);
            }
        });
        system.runInterval(() => {
            const diff = __classPrivateFieldGet(this, _QuickItemDatabase_quickAccess, "f").size - QAMsize;
            if (diff > 0) {
                for (let i = 0; i < diff; i++) {
                    __classPrivateFieldGet(this, _QuickItemDatabase_quickAccess, "f").delete(__classPrivateFieldGet(this, _QuickItemDatabase_quickAccess, "f").keys().next().value);
                }
            }
            if (__classPrivateFieldGet(this, _QuickItemDatabase_queuedKeys, "f").length) {
                const start = Date.now();
                const k = Math.min(__classPrivateFieldGet(this, _QuickItemDatabase_saveRate, "f"), __classPrivateFieldGet(this, _QuickItemDatabase_queuedKeys, "f").length);
                console.log(k);
                for (let i = 0; i < k; i++) {
                    __classPrivateFieldGet(this, _QuickItemDatabase_instances, "m", _QuickItemDatabase_romSave).call(this, __classPrivateFieldGet(this, _QuickItemDatabase_queuedKeys, "f")[0], __classPrivateFieldGet(this, _QuickItemDatabase_queuedValues, "f")[0]);
                    if (logs)
                        __classPrivateFieldGet(this, _QuickItemDatabase_instances, "m", _QuickItemDatabase_timeWarn).call(this, start, __classPrivateFieldGet(this, _QuickItemDatabase_queuedKeys, "f")[0], "saved");
                    __classPrivateFieldGet(this, _QuickItemDatabase_queuedKeys, "f").shift();
                    __classPrivateFieldGet(this, _QuickItemDatabase_queuedValues, "f").shift();
                }
            }
            else {
            }
        });
    }
    QAMusage() {
        return __classPrivateFieldGet(this, _QuickItemDatabase_quickAccess, "f").size;
    }
    /**
     * Sets a value as a key in the item database.
     * @param {string} key The unique identifier of the value.
     * @param {ItemStack[] | ItemStack} value The `ItemStack[]` or `itemStack` value to set.
     * @throws Throws if `value` is an array that has more than 255 items.
     * @Example Example:
     * ```
     * // Setting an individual item as a key
     * itemDatabase.set("item_0", itemStack); //set the itemstack as a key
     * // The key can be lower-case letters (a-z), numbers (0-9), undescore (_)
     *
     * // Setting an array of items as a key
     * itemDatabase.set("items_array_0", itemStacks); // max 255 items per array
     *
     * ```
     */
    set(key, value) {
        if (!__classPrivateFieldGet(this, _QuickItemDatabase_validNamespace, "f"))
            throw new Error(`§c[Item Database] Invalid name: <${__classPrivateFieldGet(this, _QuickItemDatabase_settings, "f").namespace}>. accepted char: a-z 0-9 _`);
        if (!/^[a-z0-9_]*$/.test(key))
            throw new Error(`§c[Item Database] Invalid name: <${key}>. accepted char: a-z 0-9 _`);
        const time = Date.now();
        key = __classPrivateFieldGet(this, _QuickItemDatabase_settings, "f").namespace + ":" + key;
        if (Array.isArray(value)) {
            if (value.length > 255)
                throw new Error(`§c[Item Database] Out of range: <${key}> has more than 255 ItemStacks`);
            world.setDynamicProperty(key, true);
        }
        else {
            world.setDynamicProperty(key, false);
        }
        __classPrivateFieldGet(this, _QuickItemDatabase_quickAccess, "f").set(key, value);
        if (__classPrivateFieldGet(this, _QuickItemDatabase_queuedKeys, "f").includes(key)) {
            const i = __classPrivateFieldGet(this, _QuickItemDatabase_queuedKeys, "f").indexOf(key);
            __classPrivateFieldGet(this, _QuickItemDatabase_queuedValues, "f").splice(i, 1);
            __classPrivateFieldGet(this, _QuickItemDatabase_queuedKeys, "f").splice(i, 1);
        }
        __classPrivateFieldGet(this, _QuickItemDatabase_instances, "m", _QuickItemDatabase_queueSaving).call(this, key, value);
        if (__classPrivateFieldGet(this, _QuickItemDatabase_settings, "f").logs)
            __classPrivateFieldGet(this, _QuickItemDatabase_instances, "m", _QuickItemDatabase_timeWarn).call(this, time, key, "set");
    }
    /**
     * Gets the value of a key from the item database.
     * @param {string} key The identifier of the value.
     * @returns {ItemStack | ItemStack[]} The `ItemStack` | `ItemStack[]` saved as `key`
     * @throws Throws if the key doesn't exist.
     * @Example Example:
     * ```
     * // Getting an ItemStack
     * const itemStack = itemDatabase.get("item0");
     *
     * // Getting an array of items
     * const itemStacks = itemDatabase.get("items_array_0");
     *
     *
     * ```
     */
    get(key) {
        if (!__classPrivateFieldGet(this, _QuickItemDatabase_validNamespace, "f"))
            throw new Error(`§c[Item Database] Invalid name: <${__classPrivateFieldGet(this, _QuickItemDatabase_settings, "f").namespace}>. accepted char: a-z 0-9 _`);
        if (!/^[a-z0-9_]*$/.test(key))
            throw new Error(`§c[Item Database] Invalid name: <${key}>. accepted char: a-z 0-9 _`);
        const time = Date.now();
        key = __classPrivateFieldGet(this, _QuickItemDatabase_settings, "f").namespace + ":" + key;
        if (__classPrivateFieldGet(this, _QuickItemDatabase_quickAccess, "f").has(key)) {
            if (__classPrivateFieldGet(this, _QuickItemDatabase_settings, "f").logs)
                __classPrivateFieldGet(this, _QuickItemDatabase_instances, "m", _QuickItemDatabase_timeWarn).call(this, time, key, "got");
            return __classPrivateFieldGet(this, _QuickItemDatabase_quickAccess, "f").get(key);
        }
        if (!__classPrivateFieldGet(this, _QuickItemDatabase_structure, "f").get(key))
            throw new Error(`§c[Item Database] The key <${key}> doesn't exist.`);
        const { canStr, inv } = __classPrivateFieldGet(this, _QuickItemDatabase_instances, "m", _QuickItemDatabase_load).call(this, key);
        const items = [];
        for (let i = 0; i < 256; i++)
            items.push(inv.getItem(i));
        for (let i = 255; i >= 0; i--)
            if (!items[i])
                items.pop();
            else
                break;
        __classPrivateFieldGet(this, _QuickItemDatabase_instances, "m", _QuickItemDatabase_save).call(this, key, canStr);
        if (__classPrivateFieldGet(this, _QuickItemDatabase_settings, "f").logs)
            __classPrivateFieldGet(this, _QuickItemDatabase_instances, "m", _QuickItemDatabase_timeWarn).call(this, time, key, "got");
        if (world.getDynamicProperty(key)) {
            __classPrivateFieldGet(this, _QuickItemDatabase_quickAccess, "f").set(key, items);
            return items;
        }
        else {
            __classPrivateFieldGet(this, _QuickItemDatabase_quickAccess, "f").set(key, items[0]);
            return items[0];
        }
    }
    /**
     * Checks if a key exists in the item database.
     * @param {string} key The identifier of the value.
     * @returns {boolean}`true` if the key exists, `false` if the key doesn't exist.
     * @Example Example:
     * ```
     * // Checking if a key exists in the database
     * const boolean = itemDatabase.has("item_0");
     * ```
     */
    has(key) {
        if (!__classPrivateFieldGet(this, _QuickItemDatabase_validNamespace, "f"))
            throw new Error(`§c[Item Database] Invalid name: <${__classPrivateFieldGet(this, _QuickItemDatabase_settings, "f").namespace}>. accepted char: a-z 0-9 _`);
        if (!/^[a-z0-9_]*$/.test(key))
            throw new Error(`§c[Item Database] Invalid name: <${key}>. accepted char: a-z 0-9 _`);
        const time = Date.now();
        key = __classPrivateFieldGet(this, _QuickItemDatabase_settings, "f").namespace + ":" + key;
        const exist = __classPrivateFieldGet(this, _QuickItemDatabase_quickAccess, "f").has(key) || __classPrivateFieldGet(this, _QuickItemDatabase_structure, "f").get(key);
        if (__classPrivateFieldGet(this, _QuickItemDatabase_settings, "f").logs)
            __classPrivateFieldGet(this, _QuickItemDatabase_instances, "m", _QuickItemDatabase_timeWarn).call(this, time, key, `has ${!!exist}`);
        if (exist)
            return true;
        else
            return false;
    }
    /**
     * Deletes a key from the item database.
     * @param {string} key The identifier of the value.
     * @throws Throws if the key doesn't exist.
     * @Example Example:
     * ```
     * // Deleting a key and its value from the database
     * itemDatabase.delete("items_array_0");
     *
     *
     * ```
     */
    delete(key) {
        if (!__classPrivateFieldGet(this, _QuickItemDatabase_validNamespace, "f"))
            throw new Error(`§c[Item Database] Invalid name: <${__classPrivateFieldGet(this, _QuickItemDatabase_settings, "f").namespace}>. accepted char: a-z 0-9 _`);
        if (!/^[a-z0-9_]*$/.test(key))
            throw new Error(`§c[Item Database] Invalid name: <${key}>. accepted char: a-z 0-9 _`);
        const time = Date.now();
        key = __classPrivateFieldGet(this, _QuickItemDatabase_settings, "f").namespace + ":" + key;
        if (__classPrivateFieldGet(this, _QuickItemDatabase_quickAccess, "f").has(key))
            __classPrivateFieldGet(this, _QuickItemDatabase_quickAccess, "f").delete(key);
        if (__classPrivateFieldGet(this, _QuickItemDatabase_structure, "f").get(key))
            __classPrivateFieldGet(this, _QuickItemDatabase_structure, "f").delete(key), world.setDynamicProperty(key, null);
        else
            throw new Error(`§c[Item Database] The key <${key}> doesn't exist.`);
        if (__classPrivateFieldGet(this, _QuickItemDatabase_settings, "f").logs)
            __classPrivateFieldGet(this, _QuickItemDatabase_instances, "m", _QuickItemDatabase_timeWarn).call(this, time, key, "removed");
    }
    /**
     * Gets all the keys of your namespace from item database.
     * @return {string[]} All the keys as an array of strings.
     * @Example Example:
     * ```
     * const string[] = itemDatabase.keys()
     *
     *
     * ```
     */
    keys() {
        if (!__classPrivateFieldGet(this, _QuickItemDatabase_validNamespace, "f"))
            throw new Error(`§c[Item Database] Invalid name: <${__classPrivateFieldGet(this, _QuickItemDatabase_settings, "f").namespace}>. accepted char: a-z 0-9 _`);
        const allIds = world.getDynamicPropertyIds();
        const ids = [];
        allIds.filter(id => id.startsWith(__classPrivateFieldGet(this, _QuickItemDatabase_settings, "f").namespace + ":")).forEach(id => ids.push(id.replace(__classPrivateFieldGet(this, _QuickItemDatabase_settings, "f").namespace + ":", "")));
        return ids;
    }
    /**
     * Gets all the keys of your namespace from item database (takes some time if values aren't alredy loaded in quickAccess).
     * @return {ItemStack[][]} All the values as an array of ItemStack or ItemStack[].
     * @Example Example:
     * ```
     * const ItemStack[][] = itemDatabase.values()
     *
     *
     * ```
     */
    values() {
        if (!__classPrivateFieldGet(this, _QuickItemDatabase_validNamespace, "f"))
            throw new Error(`§c[Item Database] Invalid name: <${__classPrivateFieldGet(this, _QuickItemDatabase_settings, "f").namespace}>. accepted char: a-z 0-9 _`);
        const time = Date.now();
        const allIds = world.getDynamicPropertyIds();
        const values = [];
        const filtered = allIds.filter(id => id.startsWith(__classPrivateFieldGet(this, _QuickItemDatabase_settings, "f").namespace + ":")).map(id => id.replace(__classPrivateFieldGet(this, _QuickItemDatabase_settings, "f").namespace + ":", ""));
        for (const key of filtered) {
            values.push(this.get(key));
        }
        if (__classPrivateFieldGet(this, _QuickItemDatabase_settings, "f").logs)
            __classPrivateFieldGet(this, _QuickItemDatabase_instances, "m", _QuickItemDatabase_timeWarn).call(this, time, `${JSON.stringify(values)}`, "values");
        return values;
    }
    /**
     * Clears all, CAN NOT REWIND.
     * @Example Example:
     * ```
     * itemDatabase.clear()
     *
     *
     * ```
     */
    clear() {
        if (!__classPrivateFieldGet(this, _QuickItemDatabase_validNamespace, "f"))
            throw new Error(`§c[Item Database] Invalid name: <${__classPrivateFieldGet(this, _QuickItemDatabase_settings, "f").namespace}>. accepted char: a-z 0-9 _`);
        const time = Date.now();
        const allIds = world.getDynamicPropertyIds();
        const filtered = allIds.filter(id => id.startsWith(__classPrivateFieldGet(this, _QuickItemDatabase_settings, "f").namespace + ":")).map(id => id.replace(__classPrivateFieldGet(this, _QuickItemDatabase_settings, "f").namespace + ":", ""));
        for (const key of filtered) {
            this.delete(key);
        }
        if (__classPrivateFieldGet(this, _QuickItemDatabase_settings, "f").logs)
            __classPrivateFieldGet(this, _QuickItemDatabase_instances, "m", _QuickItemDatabase_timeWarn).call(this, time, ``, "clear");
    }
}
_QuickItemDatabase_saveRate = new WeakMap(), _QuickItemDatabase_validNamespace = new WeakMap(), _QuickItemDatabase_queuedKeys = new WeakMap(), _QuickItemDatabase_settings = new WeakMap(), _QuickItemDatabase_structure = new WeakMap(), _QuickItemDatabase_quickAccess = new WeakMap(), _QuickItemDatabase_queuedValues = new WeakMap(), _QuickItemDatabase_dimension = new WeakMap(), _QuickItemDatabase_sL = new WeakMap(), _QuickItemDatabase_instances = new WeakSet(), _QuickItemDatabase_load = function _QuickItemDatabase_load(key) {
    if (key.length > 30)
        throw new Error(`§c[Item Database] Out of range: <${key}> has more than 30 characters`);
    let canStr = false;
    try {
        __classPrivateFieldGet(this, _QuickItemDatabase_structure, "f").place(key, __classPrivateFieldGet(this, _QuickItemDatabase_dimension, "f"), __classPrivateFieldGet(this, _QuickItemDatabase_sL, "f"), { includeEntities: true });
        canStr = true;
    }
    catch {
        __classPrivateFieldGet(this, _QuickItemDatabase_dimension, "f").spawnEntity("qidb:storage", __classPrivateFieldGet(this, _QuickItemDatabase_sL, "f"));
    }
    const entities = __classPrivateFieldGet(this, _QuickItemDatabase_dimension, "f").getEntities({ location: __classPrivateFieldGet(this, _QuickItemDatabase_sL, "f"), type: "qidb:storage" });
    if (entities.length > 1)
        entities.forEach((e, index) => entities[index + 1]?.remove());
    const entity = entities[0];
    const inv = entity.getComponent("inventory").container;
    return { canStr, inv };
}, _QuickItemDatabase_save = async function _QuickItemDatabase_save(key, canStr) {
    if (canStr)
        __classPrivateFieldGet(this, _QuickItemDatabase_structure, "f").delete(key);
    __classPrivateFieldGet(this, _QuickItemDatabase_structure, "f").createFromWorld(key, __classPrivateFieldGet(this, _QuickItemDatabase_dimension, "f"), __classPrivateFieldGet(this, _QuickItemDatabase_sL, "f"), __classPrivateFieldGet(this, _QuickItemDatabase_sL, "f"), { saveMode: StructureSaveMode.World, includeEntities: true });
    const entities = __classPrivateFieldGet(this, _QuickItemDatabase_dimension, "f").getEntities({ location: __classPrivateFieldGet(this, _QuickItemDatabase_sL, "f"), type: "qidb:storage" });
    entities.forEach(e => e.remove());
}, _QuickItemDatabase_timeWarn = function _QuickItemDatabase_timeWarn(time, key, action) {
    console.warn(`[Item Database] ${Date.now() - time}ms => ${action} ${key} `);
}, _QuickItemDatabase_queueSaving = async function _QuickItemDatabase_queueSaving(key, value) {
    __classPrivateFieldGet(this, _QuickItemDatabase_queuedKeys, "f").push(key);
    __classPrivateFieldGet(this, _QuickItemDatabase_queuedValues, "f").push(value);
}, _QuickItemDatabase_romSave = async function _QuickItemDatabase_romSave(key, value) {
    const { canStr, inv } = __classPrivateFieldGet(this, _QuickItemDatabase_instances, "m", _QuickItemDatabase_load).call(this, key);
    if (!value)
        for (let i = 0; i < 256; i++)
            inv.setItem(i, undefined), world.setDynamicProperty(key, null);
    if (Array.isArray(value)) {
        try {
            for (let i = 0; i < 256; i++)
                inv.setItem(i, value[i] || undefined);
        }
        catch {
            throw new Error(`§c[Item Database] Invalid value type. supported: ItemStack | ItemStack[] | undefined`);
        }
        world.setDynamicProperty(key, true);
    }
    else {
        try {
            inv.setItem(0, value), world.setDynamicProperty(key, false);
        }
        catch {
            throw new Error(`§c[Item Database] Invalid value type. supported: ItemStack | ItemStack[] | undefined`);
        }
    }
    __classPrivateFieldGet(this, _QuickItemDatabase_instances, "m", _QuickItemDatabase_save).call(this, key, canStr);
};
