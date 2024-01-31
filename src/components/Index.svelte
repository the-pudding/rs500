<script>
	import { getContext } from "svelte";
	import Demo from "$components/demo/Demo.svelte";
	import WIP from "$components/helpers/WIP.svelte";
	import Intro from "$components/Intro.svelte"
	import Title from "$components/Title.svelte"
	import HipHop from "$components/HipHop.svelte"
	import Popularity from "$components/Popularity.svelte"

	import Spotify from "$components/Spotify.svelte"
	import Voters from "$components/Voters.svelte"
	import viewport from "$stores/viewport.js";
	import scrollY from "$stores/scrollY.js";

</script>

<Intro vw={$viewport.width} vh={$viewport.height} />
<Title />
<HipHop vw={$viewport.width} vh={$viewport.height}/>
<Popularity vw={$viewport.width} vh={$viewport.height}/>

<Spotify vw={$viewport.width} vh={$viewport.height}/>

<Voters vw={$viewport.width} vh={$viewport.height} scrollY={$scrollY}/>