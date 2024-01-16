<script lang="ts">
	import { GridData } from '../utils';
	import Grid from './Grid.svelte';
	import { writable } from 'svelte/store';
	import { house } from '../images';

	const size = 11;
	let digits = writable(new GridData(size));

	const emptyStr = new GridData(size).toString();

	let digitStr = '';

	function parse(evt: { currentTarget: HTMLInputElement }) {
		let str = evt.currentTarget.value;
		str = (str + emptyStr).substring(0, emptyStr.length);
		digits.set(GridData.fromString(str));
	}
</script>

<svelte:head>
	<title>Opdracht 1</title>
</svelte:head>

<section class="text-column">
	<h1>Afbeelding</h1>
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
		<button on:click={() => digits.set(new GridData(size))}>Opnieuw</button>
		<button on:click={() => digits.set(house())}>Huisje</button>
	</div>
</section>

<style>
</style>
