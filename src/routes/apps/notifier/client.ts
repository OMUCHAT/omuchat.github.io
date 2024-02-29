import { Client, events } from "@omuchatjs/chat";
import { App } from "@omuchatjs/omu";
import { ModelTableType } from "@omuchatjs/omu/extension/table/table.js";
import { NotifyEntry } from "./model.js";
import { identifier } from "./app.js";

const app = App.fromIdentifier(identifier, {
    version: '1.0.0'
});
export const client = new Client({
    app
});

export const NotifyTable = client.omu.tables.register(ModelTableType.of(app, {
    name: 'notify',
    model: NotifyEntry,
}))


client.on(events.MessageCreate, (message) => {
    console.log(message);
    if (/^!ping/.test(message.text)) {
        // play sound
    }
});
