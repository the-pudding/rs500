<script>
	import { onMount, setContext, getContext } from "svelte";
	import Intro from "$components/Intro.svelte"
	import Title from "$components/Title.svelte"
	import HipHop from "$components/HipHop.svelte"
	import Popularity from "$components/Popularity.svelte"

	import Spotify from "$components/Spotify.svelte"
	import Voters from "$components/Voters.svelte"
	import viewport from "$stores/viewport.js";
	import scrollY from "$stores/scrollY.js";
	import { group } from "d3";

	import spriteData from "$data/sprite-data_96.csv"
	import spriteDataBig from "$data/sprite-data_192.csv"
	import spriteDataSpotify from "$data/sprite-data_150.csv"


	let spriteMap;
	let spriteMapBig;
	let spriteMapSpotify;
	let sprites = false;
	const copy = getContext("copy");
	console.log(copy)

	onMount(() => {
		spriteMap = group(spriteData, d => d.id);
		spriteMapBig = group(spriteDataBig, d => d.id);
		spriteMapSpotify = group(spriteDataSpotify, d => d.id);


		sprites = true;
	})

</script>

{#if sprites}
	<Intro vw={$viewport.width} vh={$viewport.height}  scrollY={$scrollY} {spriteMap} {spriteMapBig} {copy}/>

	<Popularity vw={$viewport.width} vh={$viewport.height} {spriteMap} {spriteMapBig} {copy}/>
	<!-- <HipHop vw={$viewport.width} vh={$viewport.height}/> -->
	<Spotify vw={$viewport.width} vh={$viewport.height} {spriteMap} {spriteMapBig} {spriteMapSpotify} {copy}/>

	<!-- <Voters vw={$viewport.width} vh={$viewport.height} scrollY={$scrollY}/> -->

		

{/if}