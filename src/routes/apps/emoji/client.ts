import { App } from '@omuchatjs/omu';
import { identifier } from './app.js';
import { Client } from '@omuchatjs/chat';
import { browser } from '$app/environment';

const app = App.fromIdentifier(identifier, {
    version: '0.1.0',
});
export const client = new Client({
    app,
});

if (browser) {
    client.run();
}
