<script lang="ts">
    import TableList from '$lib/components/omu/TableList.svelte';
    import { setClient } from '$lib/components/omu/client.js';
    import EmojiEdit from './EmojiEdit.svelte';
    import EmojiEntry from './EmojiEntry.svelte';
    import { identifier } from './app.js';
    import { client } from './client.js';
    import { EMOJI_TABLE, Emoji, selectedEmoji } from './emoji.js';

    const emojis = client.omu.tables.get(EMOJI_TABLE);

    let search: string = '';
    let uploading: number = 0;

    setClient(client.omu);

    async function upload(files: Array<{ key: string; buffer: Uint8Array }>) {
        uploading++;
        const assets = await client.omu.assets.upload(
            ...files.map(({ key, buffer }) => ({
                identifier: identifier.join(key.split('.')[0]),
                buffer,
            })),
        );
        assets.forEach((identifier) => {
            const name = identifier.path.at(-1);
            if (!name) return;
            const emoji = new Emoji({
                id: name,
                asset: identifier,
                petterns: [
                    {
                        type: 'text',
                        text: name,
                    },
                ],
            });
            emojis.add(emoji);
        });
        uploading--;
    }

    let fileDrop: HTMLInputElement;
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
    {#if $selectedEmoji}
        <div class="emoji-edit">
            <EmojiEdit emoji={$selectedEmoji} />
        </div>
    {/if}
    <div class="emojis">
        <div class="upload">
            <button on:click={() => fileDrop.click()}>
                ファイルを選択してアップロード
                <i class="ti ti-upload" />
            </button>
            <input
                type="file"
                multiple
                hidden
                bind:files
                bind:this={fileDrop}
                on:change={uploadFiles}
                accept="image/*"
                placeholder="画像を選択"
            />
            {#if uploading > 0}
                <span>
                    <i class="ti ti-upload" />
                    アップロード中…
                </span>
            {/if}
        </div>
        <TableList table={emojis} component={EmojiEntry} />
    </div>
</main>

<style lang="scss">
    main {
        position: absolute;
        inset: 0;
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

    button {
        display: flex;
        flex-direction: row;
        gap: 5px;
        align-items: center;
        width: fit-content;
        padding: 5px;
        font-size: 14px;
        font-weight: bold;
        color: var(--color-1);
        cursor: pointer;
        background: var(--color-bg-2);
        border: none;

        i {
            font-size: 1.2em;
        }
    }
</style>
