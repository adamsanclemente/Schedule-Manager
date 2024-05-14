<script lang="ts">
    import Header from "$lib/components/Header.svelte";
import "../app.pcss"
    import { ModeWatcher } from "mode-watcher";
</script>

<!-- Theme Watcher -->
<ModeWatcher />

<!-- This element wraps all "pages" below it -->
<Header />
<div class="container">
    <slot />
</div>