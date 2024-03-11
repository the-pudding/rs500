<script>
	import { onMount, setContext, getContext } from "svelte";
	import Intro from "$components/Intro.svelte"
	import Title from "$components/Title.svelte"
	import HipHop from "$components/HipHop.svelte"
	import Popularity from "$components/Popularity.svelte"
	import Footer from "$components/Footer.svelte"

	import Spotify from "$components/Spotify.svelte"
	import Voters from "$components/Voters.svelte"
	import viewport from "$stores/viewport.js";
	import scrollY from "$stores/scrollY.js";
	import { group } from "d3";
	import reducedMotion from "$stores/mq.js";
	import data from "$data/albums.csv"

	import spriteData from "$data/sprite-data_96.csv"
	// import spriteDataBig from "$data/sprite-data_192.csv"
	// import spriteDataSpotify from "$data/sprite-data_150.csv"
	import spriteDataVoters from "$data/sprite-data_voters_100.csv"

	
	let spriteMap;
	// let spriteMapBig;
	// let spriteMapSpotify;
	let spriteMapVoters;
	let sprites = false;
	let dataMap;

	let isSafari = false;
	const copy = getContext("copy");

	let viewportHeight;

	$: mobile = $viewport.width < 550 ? true : false;
	// $: reducedMotion = $reducedMotion ? true : false;
	let noMotion = false;


	onMount(() => {
		if($reducedMotion.reducedMotion){
			noMotion = true;
		}


		spriteMap = group(spriteData, d => d.id);
		dataMap = group(data, d => d["Album ID"]);

		// spriteMapBig = group(spriteDataBig, d => d.id);
		// spriteMapSpotify = group(spriteDataSpotify, d => d.id);
		spriteMapVoters = group(spriteDataVoters, d => d.id);

		sprites = true;
		viewportHeight = $viewport.height;
		console.log(viewportHeight)
	})

</script>



{#if sprites}
<div>

	<Intro {data} {dataMap} vw={$viewport.width} vh={mobile ? viewportHeight : $viewport.height}  scrollY={mobile ? 0 : $scrollY} {spriteMap} {copy} {mobile} {noMotion}/>
	<Spotify {data} {dataMap} vw={$viewport.width} vh={mobile ? viewportHeight : $viewport.height} {spriteMap} {copy} {mobile} {noMotion}/>

	<Popularity vw={$viewport.width} vh={mobile ? viewportHeight : $viewport.height} {spriteMap} {copy} {mobile}/>
	

	<Voters vw={$viewport.width} vh={mobile ? viewportHeight : $viewport.height} {spriteMapVoters} spriteMapAlbums={spriteMap} scrollY={$scrollY} {copy} {mobile} {noMotion}/>
	<Footer />
	<div class="noise-overlay" style="background: url(assets/noise-light.png);">

	</div>
</div>
{/if}

<style>
	.noise-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0.3;
		pointer-events: none;
	}
</style>