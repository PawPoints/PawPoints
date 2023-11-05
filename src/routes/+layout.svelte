<script lang="ts">
	import '../app.postcss'
	import NavBar from '$lib/views/NavBar.svelte';
	import { user, loadPawUser } from '$lib/firebase';
	import type { User } from 'firebase/auth'
	import { onMount } from 'svelte';


	onMount(() => {
		if (localStorage.getItem('user')) {
			user.set(JSON.parse(localStorage.getItem('user')!) as User)
			if ($user) loadPawUser($user.uid);
		}
	});
</script>

<slot />
<div class="absolute top-0 left-0 right-0">
	<NavBar/>
</div>

<svelte:head>
	<link rel="stylesheet" href="/global.css">
</svelte:head>

<style>
	/* Install A beatuiful aesthetic font from google fonts and apply it */
	@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');
	/* apply this font globally */
	:global(*) {
		margin: 0;
	}
</style>