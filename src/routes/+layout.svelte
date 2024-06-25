<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import '../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
	import { browser } from '$app/environment';

	import { mode } from 'mode-watcher';

	$: $mode, manageCalendarClasses();

	function manageCalendarClasses() {
		if (browser) {
			if ($mode === 'dark') {
				document.body.classList.add('ec-dark');
			} else {
				document.body.classList.remove('ec-dark');
			}
		}
	}
</script>

<!-- Theme Watcher -->
<ModeWatcher />

<!-- This element wraps all "pages" below it -->
<Header />
<div class="container min-h-full max-h-screen">
	<slot />
</div>
