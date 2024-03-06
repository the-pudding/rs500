<script>
	import { setContext } from "svelte";
	import { browser } from "$app/environment";
	import Meta from "$components/Meta.svelte";
	import Index from "$components/Index.svelte";
	import copy from "$data/copy.json";
	import version from "$utils/version.js";

	export let data;

	version();

	const preloadFont = [

		"https://pudding.cool/assets/fonts/inter/Inter-Regular.woff2",
		"https://pudding.cool/assets/fonts/inter/Inter-Bold.woff2",
		"https://pudding.cool/assets/fonts/inter/Inter-Light.woff2",
		"https://pudding.cool/assets/fonts/inter/Inter-Black.woff2"
	];

	const { title, description, url, keywords } = copy;
	setContext("copy", copy);
	setContext("data", data.data);
</script>

<Meta {title} {description} {url} {preloadFont} {keywords} />
<Index />
