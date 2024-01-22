<script lang="ts">
	import type { Candidate } from './utils';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let kandidaat: Candidate;
	export let selected: boolean;
	export let red = false;
</script>

<button class="candidate" class:selected on:click={() => dispatch('click')} class:red>
	<img src={kandidaat.img} alt={kandidaat.naam} class="candidate-image" />
	<span>{kandidaat.naam}</span>
</button>

<style>
	.candidate {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0.5em;

		background: none;
		background-color: transparent;
		color: inherit;
		border: none;
		font: inherit;
		cursor: pointer;
		outline: inherit;

		&.selected {
			color: white;
			background-color: #007045;

			&.red {
				background-color: #bf352b;
			}
		}

		& .candidate-image {
			width: 4em;
			height: 4em;
			object-fit: cover;
			object-position: top;
		}
	}
</style>
