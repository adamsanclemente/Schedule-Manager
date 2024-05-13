
<script>
    // @ts-ignore
    import Calendar from '@event-calendar/core';
    // @ts-ignore
    import TimeGrid from '@event-calendar/time-grid';
    // @ts-ignore
    import DayGrid from '@event-calendar/day-grid';
    // @ts-ignore
    import List from '@event-calendar/list';

    let plugins = [TimeGrid, DayGrid, List];
    let options = {
        view: 'timeGridWeek', 
        events: [
            // your list of events
        ]
    };
</script>

<Calendar {plugins} {options} />
<h1 class="text-slate-800">Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
