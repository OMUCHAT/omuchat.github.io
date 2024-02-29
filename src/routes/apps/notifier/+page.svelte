<script lang="ts">
	import { onMount } from 'svelte';
	import { client } from './client.js';

	let messages: string[] = [];
	let audio: HTMLAudioElement;

	onMount(() => {
		client.run();
		audio = new Audio('https://www.myinstants.com/media/sounds/roblox-death-sound_1.mp3');
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	{#each messages as message}
		<p>{message}</p>
	{/each}
</section>

<style>
	section {
		display: flex;
		flex: 0.6;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
