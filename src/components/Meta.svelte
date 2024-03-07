<script>
	export let title = "What Makes an Album the Greatest of All Time?";
	export let description = "Description TK";
	export let url = "https://pudding.cool/2024/03/greatest-music/";
	export let keywords = "";
	export let preloadFont = [];
</script>

<svelte:head>
	<title>What Makes an Album the Greatest of All Time?</title>
	<meta name="description" content='Examining 30 years of Rolling Stone’s “Greatest Albums of All Time” Rankings' />
	<meta name="author" content="Matt Daniels, Chris Dalla Riva" />
	<meta name="news_keywords" content="music,rolling stone,data,ranking,greatest of all time" />

	<meta property="og:title" content="What Makes an Album the Greatest of All Time?" />
	<meta property="og:site_name" content="The Pudding" />
	<meta property="og:url" content="https://pudding.cool/2024/03/greatest-music/" />
	<meta property="og:description" content='Examining 30 years of Rolling Stone’s “Greatest Albums of All Time” Rankings' />
	<meta property="og:type" content="article" />
	<meta property="og:locale" content="en_US" />

	<meta property="og:image" content="{url}/assets/social-facebook.jpg" />
	<meta property="og:image:type" content="image/jpeg" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="https://pudding.cool" />
	<meta name="twitter:creator" content="@puddingviz" />
	<meta name="twitter:title" content="What Makes an Album the Greatest of All Time?" />
	<meta name="twitter:description" content='Examining 30 years of Rolling Stone’s “Greatest Albums of All Time” Rankings' />
	<meta name="twitter:image:src" content="{url}/assets/social-twitter.jpg" />

	<meta name="robots" content="max-image-preview:large" />

	<link rel="canonical" href="https://pudding.cool/2024/03/greatest-music/" />

	{#each preloadFont as href}
		<link rel="preload" {href} as="font" type="font/woff2" crossorigin />
	{/each}
</svelte:head>
