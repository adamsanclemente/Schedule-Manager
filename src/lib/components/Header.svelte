<script lang="ts">
    import { CalendarRange } from 'lucide-svelte';
    import Sun from "lucide-svelte/icons/sun";
  import Moon from "lucide-svelte/icons/moon";
 
  import { resetMode, setMode } from "mode-watcher";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<header class="flex justify-between w-full items-center">
    <div class="flex justify-between items-center mx-8 py-6 ">
        <div class="flex gap-3 justify-center items-center">
            <CalendarRange size={28} />
            <a href="/" class="
                text-xl font-bold">  Schedule Calendar</a>
        </div>
    </div>
    <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild let:builder>
          <Button builders={[builder]} variant="outline" size="icon" class="mx-8">
            <Sun
              class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            />
            <Moon
              class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            />
            <span class="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          <DropdownMenu.Item on:click={() => setMode("light")}
            >Light</DropdownMenu.Item
          >
          <DropdownMenu.Item on:click={() => setMode("dark")}>Dark</DropdownMenu.Item>
          <DropdownMenu.Item on:click={() => resetMode()}>System</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
</header>