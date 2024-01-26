<script lang="ts">
	import Tooltip from '$lib/components/Tooltip.svelte';
	import type { App } from './app.js';

	export let app: App;

	function launch() {
		window.location.href = app.url;
	}
</script>

<article>
	<div class="header">
		<h2>
			<i class="ti ti-user" />
			{app.name}
		</h2>
		<span>
			<button>
				<i class="ti ti-download" />
				<Tooltip>
					<p>アプリをダッシュボードに保存する</p>
				</Tooltip>
			</button>
			<button on:click={launch}>
				<i class="ti ti-player-play" />
				<Tooltip>
					<p>アプリを起動する</p>
				</Tooltip>
			</button>
		</span>
	</div>
	<div class="body">
		<p>...</p>
	</div>
</article>

<style lang="scss">
	article {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
		height: 100%;
		background: var(--color-bg-1);
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;

		button {
			width: 2rem;
			height: 2rem;
			cursor: pointer;
			background: var(--color-bg-2);
			border: none;
			border-radius: 5px;

			&:hover {
				background: var(--color-bg-3);
			}
		}
	}

	h2 {
		font-weight: 600;
	}

	.body {
		display: flex;
		width: 100%;
		height: 10rem;
		padding: 1rem;
		background: var(--color-bg-2);
	}
</style>
