import { App, Client } from "@omuchatjs/chat";

const app = new App({
    group: 'omuchat.cc',
    name: 'quiz',
    version: '1.0.0'
});
export const client = new Client({ app });
