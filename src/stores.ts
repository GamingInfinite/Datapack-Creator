import { writable, type Writable } from "svelte/store";
import { MCFunction, PackMeta } from "./lib/IDK";

export const MetaData = writable(new PackMeta("default", "Default", 15));
export const files: Writable<MCFunction[]> = writable([]);
