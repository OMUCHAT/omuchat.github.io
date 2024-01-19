<script lang="ts">
	import { App, Client, events } from '@omuchatjs/chat';
	import { onMount } from 'svelte';

	const app = new App({
		group: 'omuchat-hub.cc',
		name: 'notifier',
		version: '1.0.0'
	});
	const client = new Client({
		app
	});

	let messages: string[] = [];
	let audio: HTMLAudioElement;

	client.on(events.MessageCreate, (message) => {
		messages = [...messages, message.text].slice(-10);
		console.log(message);
		if (/^!ping/.test(message.text)) {
			// play sound
			audio.pause();
			audio.currentTime = 0;
			audio.play();
		}
	});

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
