import { App } from '@omuchatjs/omu';
import { identifier } from './app.js';
import { Client } from '@omuchatjs/chat';

const app = App.fromIdentifier(identifier, {
    version: '0.1.0',
});
export const client = new Client({
    app,
});
