<script lang="ts">
    import { models } from '@omuchatjs/chat';

    import EmojiEdit from './EmojiEdit.svelte';
    import EmojiEntry from './EmojiEntry.svelte';
    import { client } from './client.js';
    import { type EmojiData } from './emoji.js';

    let emojis: Map<string, EmojiData> = new Map();
    const REGISTRY = client.omu.registry.get<Record<string, EmojiData>>(
        {
            name: 'emojis',
            app: 'omu.chat.plugins/emoji',
        },
        {},
    );
    REGISTRY.listen((data) => {
        emojis = new Map(Object.entries(data || {}));
    });

    let selectedEmoji: EmojiData | undefined;
    let search: string = '';
    let fileDrop: boolean = false;
    let uploading: number = 0;

    async function upload(files: Array<{ key: string; buffer: Uint8Array }>) {
        uploading++;
        files = files.map(({ key, buffer }) => ({ key: `emoji/${key}`, buffer }));
        await client.omu.assets.upload(...files);
        files.forEach(({ key }) => {
            const name = key.split('/')[1].split('.')[0];
            const emoji = {
                id: key,
                name: name,
                regex: `${name}`,
                image_url: client.omu.asset(key),
            };
            emojis.set(emoji.id, emoji);
        });
        REGISTRY.update((data) => ({ ...data, ...Object.fromEntries(emojis) }));
        uploading--;
    }

    function deleteEmoji(event: CustomEvent<EmojiData>) {
        const emoji = event.detail;
        emojis.delete(emoji.id);
        REGISTRY.update((registry) => {
            if (!registry) return registry;
            delete registry[emoji.id];
            return registry;
        });
        if (selectedEmoji?.id === emoji.id) {
            selectedEmoji = undefined;
        }
    }

    function saveEmoji(event: CustomEvent<EmojiData>) {
        const emoji = event.detail;
        emojis.set(emoji.id, emoji);
        REGISTRY.update((registry) => {
            if (!registry) return registry;
            registry[emoji.id] = emoji;
            return registry;
        });
        selectedEmoji = undefined;
    }

    function editEmoji(event: CustomEvent<EmojiData>) {
        selectedEmoji = event.detail;
    }

    function testEmoji(event: CustomEvent<EmojiData>) {
        const emoji = event.detail;
        const room = new models.Room({
            id: 'test',
            provider_id: 'test',
            connected: false,
            status: 'offline',
            created_at: new Date(),
        });
        client.rooms.set(room);
        client.messages.add(
            new models.Message({
                id: Date.now().toString(),
                room_id: room.key(),
                content: new models.content.Root([
                    models.content.Text.of(`${emoji.id} (${emoji.regex})`),
                    models.content.Image.of({
                        url: emoji.image_url,
                        id: emoji.id,
                        name: emoji.id,
                    }),
                ]),
                created_at: new Date(),
            }),
        );
    }

    let files: FileList | undefined;

    async function uploadFiles() {
        if (!files) return;
        const selected = await Promise.all(
            Array.from(files).map(async (file) => {
                const name = file.name;
                const buffer = await file.arrayBuffer();
                return { key: name, buffer: new Uint8Array(buffer) };
            }),
        );
        upload(selected);
    }
</script>

<main>
    <div class="header">
        <div class="title">
            <i class="ti ti-icons" />
            絵文字
        </div>
        <div class="search">
            <input placeholder="検索" bind:value={search} />
        </div>
    </div>
    {#if selectedEmoji}
        <div class="emoji-edit">
            <EmojiEdit emoji={selectedEmoji} on:save={saveEmoji} on:delete={deleteEmoji} />
        </div>
    {/if}
    <div class="emojis">
        <div class="upload">
            <small>
                <i class="ti ti-upload" />
                画像をドラッグ&ドロップして追加できます。
            </small>
            <input
                type="file"
                multiple
                hidden
                bind:files
                on:change={uploadFiles}
                accept="image/*"
            />
            {#if uploading > 0}
                <span>
                    <i class="ti ti-upload" />
                    アップロード中…
                </span>
            {/if}
        </div>
        {#each Array.from(emojis.values()).filter((emoji) => emoji.id.includes(search)) as emoji}
            <EmojiEntry {emoji} on:delete={deleteEmoji} on:edit={editEmoji} on:test={testEmoji} />
        {/each}
    </div>
    <div class="drop" class:active={fileDrop}>
        <div class="tips">
            <i class="ti ti-upload" />
            ドロップして追加
        </div>
        <div class="preview"></div>
    </div>
</main>

<style lang="scss">
    main {
        display: flex;
        flex-direction: column;
        height: 100%;
        margin: 0;
        background: var(--color-bg-2);
    }

    .header {
        display: flex;
        flex-direction: row;
        gap: 40px;
        align-items: center;
        width: 100%;
        min-height: 80px;
        padding: 20px;
        background: var(--color-bg-2);
        border-bottom: 1px solid var(--color-1);

        .title {
            display: flex;
            flex-direction: row;
            gap: 10px;
            align-items: baseline;
            padding-left: 20px;
            font-size: 18px;
            font-weight: 600;
            color: var(--color-1);
        }
    }

    .emoji-edit {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        padding: 20px;
    }

    .emojis {
        display: flex;
        flex-flow: column;
        gap: 10px;
        width: 100%;
        height: 100%;
        padding: 20px;
        overflow: auto;
        background: var(--color-bg-1);
    }

    .upload {
        display: flex;
        flex-direction: row;
        gap: 10px;
        align-items: center;
        width: 100%;
        height: 40px;

        span {
            display: flex;
            flex-direction: row;
            gap: 10px;
            align-items: center;
            padding: 0 10px;
            font-size: 12px;
            font-weight: bold;
            color: var(--color-1);
        }
    }

    .drop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        opacity: 0;

        .tips {
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 1;
            display: flex;
            flex-direction: row;
            gap: 10px;
            align-items: center;
            padding: 10px;
            font-weight: bold;
            color: var(--color-1);
            pointer-events: none;
            background: var(--color-bg-2);
        }

        .preview {
            position: fixed;
            display: table;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }

        &.active {
            pointer-events: all;
            background: color-mix(in srgb, var(--color-bg-1) 90%, transparent 0%);
            opacity: 1;
            transition: all 0.05s ease-in-out;
        }
    }

    small {
        display: flex;
        flex-direction: row;
        gap: 5px;
        align-items: center;
        width: fit-content;
        padding: 5px;
        font-size: 14px;
        font-weight: bold;
        color: var(--color-1);
        background: var(--color-bg-2);

        i {
            font-size: 1.2em;
        }
    }
</style>
