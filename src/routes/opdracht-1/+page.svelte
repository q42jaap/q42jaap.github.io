<script lang="ts">
	import { GridData } from './utils';
	import Grid from './Grid.svelte';
	import { writable } from 'svelte/store';
	import { diy, empty, hart, house, konijn, zon } from './images';

	const size = 11;
	let digits = writable(new GridData(size));
</script>

<svelte:head>
	<title>Opdracht 1</title>
</svelte:head>

<section class="text-column">
	<h1>Opdracht 1: Maak een afbeelding</h1>
	<h2>De computer ziet dit</h2>
	<!--	<input class="digits-lint" value={digitStr} on:input={parse} />-->
	{$digits.toString()}
	<h2>Jij ziet dit</h2>
	<div>
		<Grid
			digits={$digits}
			on:click={(evt) => {
				digits.update((d) => d.toggle(evt.detail));
			}}
		/>
	</div>
	<h2>&nbsp;</h2>
	<div>
		<button on:click={() => digits.set(empty())}>Opnieuw</button>
		<button on:click={() => digits.set(house())}>Huisje</button>
		<button on:click={() => digits.set(konijn())}>Konijn</button>
		<button on:click={() => digits.set(zon())}>Zon</button>
		<button on:click={() => digits.set(hart())}>Hartje</button>
		<button on:click={() => digits.set(diy())}>110101101</button>
	</div>
</section>

<style>
</style>
