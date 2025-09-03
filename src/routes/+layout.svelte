<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import '../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
	import { getFlash } from 'sveltekit-flash-message';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toast } from 'svelte-sonner';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	import { mode } from 'mode-watcher';

	$: $mode, manageCalendarClasses();
	const flash = getFlash(page);
	// $: console.log('+layout.svelte root flash: ' + JSON.stringify($flash));
	$: if ($flash) {
		switch ($flash.type) {
			case 'success':
				// console.log('flash.message.success: ' + $flash.message);
				toast.success($flash.message);
				break;
			case 'error':
				// console.log('flash.message.error: ' + $flash.message);
				toast.error($flash.message);
				break;
		}
	}

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
<Toaster richColors />

<!-- This element wraps all "pages" below it -->
<Header />
<div class="container min-h-full max-h-screen">
	<slot />
</div>
