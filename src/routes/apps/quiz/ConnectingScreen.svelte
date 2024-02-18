<script lang="ts">
	import { onMount } from 'svelte';
	import { client } from './client.js';

	onMount(() => {
		client.run();
	});
</script>

<h1>
	Connecting...
	<i class="ti ti-settings" />
</h1>
