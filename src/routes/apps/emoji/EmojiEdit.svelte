<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import type { Emoji } from './emoji.js';

    export let emoji: Emoji;

    const dispatch = createEventDispatcher();

    function saveEmoji() {
        dispatch('save', emoji);
    }
</script>

<div class="emoji-edit">
    <img src={emoji.image_url} alt={emoji.name} />
    <div class="inputs"></div>
    <div class="info">
        <span>
            name:
            <input class="name" type="text" bind:value={emoji.name} placeholder="Name" />
        </span>
        <span>
            regex:
            <input class="regex" type="text" bind:value={emoji.regex} placeholder="Regex" />
        </span>
    </div>
    <div class="buttons">
        <button on:click={saveEmoji}>
            <div class="button">
                Save
                <i class="ti ti-upload" />
            </div>
        </button>
        <button on:click={() => dispatch('delete', emoji)}>
            <i class="ti ti-trash" />
        </button>
    </div>
</div>

<style lang="scss">
    .emoji-edit {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        padding: 10px;
        background: var(--color-bg-2);
        outline: 2px solid var(--color-1);

        img {
            height: 64px;
            margin-right: 10px;
            object-fit: contain;
        }

        .info {
            display: flex;
            flex: 1;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            margin-right: 10px;
            margin-left: 5px;

            span {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                width: 400px;
            }

            .name {
                font-size: 1.2em;
                font-weight: bold;
            }

            .regex {
                font-size: 0.8em;
                color: var(--color-text-2);
            }
        }

        .buttons {
            display: flex;
            flex-direction: row;
            gap: 5px;

            .button {
                display: flex;
                flex-direction: row;
                gap: 5px;
                align-items: center;

                i {
                    font-size: 1.2em;
                }
            }
        }
    }
</style>
