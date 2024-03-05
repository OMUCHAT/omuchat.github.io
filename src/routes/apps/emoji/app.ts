import { Identifier } from '@omuchatjs/omu/identifier.js';
import { AppMetadata } from '../app-metadata.js';

export const identifier = new Identifier('cc.omuchat', 'emoji');

export default (origin: string) =>
    new AppMetadata({
        identifier: identifier.key(),
        name: 'Emoji',
        url: origin + '/apps/emoji',
        icon: 'hearts',
    });
