<script lang="ts">
	export let name: string;
</script>

<article>
	<div class="header">
		<h2>
			<i class="ti ti-user" />
			{name}
		</h2>
		<button>
			<i class="ti ti-download" />
		</button>
	</div>
	<div class="description">
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

	.description {
		display: flex;
		width: 100%;
		height: 10rem;
		padding: 1rem;
		background: var(--color-bg-2);
	}
</style>
