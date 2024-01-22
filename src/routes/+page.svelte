<script>
	import { base } from '$app/paths';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="text-column">
	<div>
		<a href="{base}/opdracht-1">Opdracht 1</a>
	</div>
	<div>
		<a href="{base}/opdracht-2">Opdracht 2</a>
	</div>
	<div>
		<a href="{base}/opdracht-3">Opdracht 3</a>
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>
