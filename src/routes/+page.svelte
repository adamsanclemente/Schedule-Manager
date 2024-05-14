
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
        view: 'timeGridDay', 
        events: [
            // your list of events
        ]
    };
</script>

<div class="flex justify-center  min-h-screen max-h-screen bg-slate-400">
    <h1 class="text-center">Test</h1>
</div>
