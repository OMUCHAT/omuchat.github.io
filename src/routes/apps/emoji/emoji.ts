import { models } from "@omuchatjs/chat";
import { TableType } from "@omuchatjs/omu/extension/table/table.js";
import { Identifier } from "@omuchatjs/omu/identifier.js";
import type { Keyable } from "@omuchatjs/omu/interface.js";
import type { Model } from "@omuchatjs/omu/model.js";
import { writable } from "svelte/store";
import { identifier } from "./app.js";
import { client } from "./client.js";


export type TextPettern = {
    type: "text";
    text: string;
};

export type ImagePettern = {
    type: "image";
    id: string;
};

export type RegexPettern = {
    type: "regex";
    regex: string;
};

export type Pettern = TextPettern | ImagePettern | RegexPettern;

export interface EmojiData {
    readonly id: string;
    asset: string;
    petterns: Pettern[];
}

export class Emoji implements Model<EmojiData>, Keyable {
    readonly id: string;
    asset: Identifier;
    petterns: Pettern[];

    constructor(options: {
        id: string;
        asset: Identifier;
        petterns: Pettern[];
    }) {
        this.id = options.id;
        this.asset = options.asset;
        this.petterns = options.petterns;
    }

    key() {
        return this.id;
    }

    static fromJson(data: EmojiData) {
        return new Emoji({
            id: data.id,
            asset: Identifier.fromKey(data.asset),
            petterns: data.petterns
        });
    }

    toJson() {
        return {
            id: this.id,
            asset: this.asset.key(),
            petterns: this.petterns
        };
    }
}

export const EMOJI_TABLE = TableType.model(identifier, {
    name: "string",
    model: Emoji
})

export const emojis = client.omu.tables.get(EMOJI_TABLE);
export const selectedEmoji = writable<Emoji | null>(null);


export function deleteEmoji(emoji: Emoji) {
    emojis.remove(emoji);
    selectedEmoji.update((value) => {
        if (value?.id === emoji.id) {
            return null;
        }
        return value;
    });
}

export function saveEmoji(emoji: Emoji) {
    emojis.set(emoji);
    selectedEmoji.set(null);
}

export function editEmoji(emoji: Emoji) {
    selectedEmoji.set(emoji);
}

export function testEmoji(emoji: Emoji) {
    const room = new models.Room({
        id: 'test',
        providerId: 'test',
        connected: false,
        status: 'offline',
        createdAt: new Date(),
    });
    client.rooms.set(room);
    client.messages.add(
        new models.Message({
            id: Date.now().toString(),
            room_id: room.key(),
            content: new models.content.System([
                models.content.Image.of({
                    url: client.omu.assets.url(emoji.asset),
                    id: emoji.id,
                    name: emoji.id,
                }),
                models.content.Text.of(emoji.id),
            ]),
            created_at: new Date(),
        }),
    );
}
