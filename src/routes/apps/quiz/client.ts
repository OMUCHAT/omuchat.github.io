import { App, Client } from '@omuchatjs/chat';
import { identifier } from './app.js';

const app = App.fromIdentifier(identifier, {
    version: '1.0.0',
});
export const client = new Client({ app });
