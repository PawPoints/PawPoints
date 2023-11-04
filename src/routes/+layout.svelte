<script>
	import '../app.postcss'
</script>

<slot />

<style>
	/* Install A beatuiful aesthetic font from google fonts and apply it */
	@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');
	/* apply this font globally */
	:global(*) {
		margin: 0;
	}
</style>