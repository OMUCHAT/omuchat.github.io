<script lang="ts">
    import Tooltip from '$lib/components/Tooltip.svelte';
    import { client } from './client.js';
    import { EMOJI_TABLE, deleteEmoji, editEmoji, testEmoji, type Emoji } from './emoji.js';

    const emojis = client.omu.tables.get(EMOJI_TABLE);

    export let entry: Emoji;
    export let selected: boolean = false;

    function copyName() {
        navigator.clipboard.writeText(entry.id);
    }

    function copyRegex() {
        navigator.clipboard.writeText(JSON.stringify(entry.petterns));
    }
</script>

<div class="emoji-entry" class:selected>
    <span>
        <Tooltip>
            <img src={client.omu.assets.url(entry.asset)} alt={entry.asset.key()} class="preview" />
        </Tooltip>
        <img src={client.omu.assets.url(entry.asset)} alt={entry.asset.key()} />
    </span>
    <div class="info">
        <button class="name" on:click={copyName}>
            <Tooltip>クリックでコピー</Tooltip>
            {entry.id}
        </button>
        <button class="regex" on:click={copyRegex}>
            <Tooltip>クリックでコピー</Tooltip>
            {JSON.stringify(entry.petterns)}
        </button>
    </div>
    {#if selected}
        <button on:click={() => testEmoji(entry)}>
            <Tooltip>テスト</Tooltip>
            <i class="ti ti-send" />
        </button>
        <button on:click={() => editEmoji(entry)}>
            <Tooltip>編集</Tooltip>
            <i class="ti ti-pencil" />
        </button>
        <button on:click={() => deleteEmoji(entry)}>
            <Tooltip>削除</Tooltip>
            <i class="ti ti-trash" />
        </button>
    {/if}
</div>

<style lang="scss">
    .emoji-entry {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        padding: 10px;
        background: var(--color-bg-2);
        border-bottom: 1px solid var(--color-bg-1);

        .preview {
            height: auto;
            max-height: 128px;
        }

        img {
            width: 50px;
            height: 50px;
            margin-right: 10px;
            object-fit: contain;
        }
    }

    .selected {
        outline: 2px solid var(--color-1);
        outline-offset: -5px;
    }

    .info {
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        margin-right: 10px;
        margin-left: 5px;

        .name {
            font-size: 1em;
            font-weight: bold;
        }

        .regex {
            font-size: 0.7em;
            color: color-mix(in srgb, var(--color-text) 80%, transparent 0%);
        }
    }

    button {
        display: flex;
        flex-direction: row;
        gap: 5px;
        align-items: center;
        color: var(--color-text);
        cursor: pointer;
        background: none;
        border: none;

        &:hover {
            color: var(--color-1);
        }
    }
</style>
