import { ModelTableType } from "@omuchatjs/omu/extension/table/table.js";
import { Identifier } from "@omuchatjs/omu/identifier.js";
import { client } from "../client.js";
import { AppMetadata } from "./app-metadata.js";
import quiz from "./quiz/app.js";
import notifier from "./notifier/app.js";

export const apps = [] as AppMetadata[];

export function loadApps(origin: string) {
    if (apps.length) return;
    apps.push(...[
        quiz(origin),
        notifier(origin),
    ]);
}

const DASHBOARD = Identifier.fromKey('cc.omuchat:dashboard');
const appsTable = client.omu.tables.get(ModelTableType.of(DASHBOARD, {
    name: "apps",
    model: AppMetadata,
}))

export function saveApp(app: AppMetadata) {
    appsTable.add(app);
}
