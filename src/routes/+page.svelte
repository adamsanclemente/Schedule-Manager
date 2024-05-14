<script lang='ts'>
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
    import type { PageData } from "./$types.ts";
	import * as Card from '$lib/components/ui/card';
    import * as Alert from '$lib/components/ui/alert';
    import { AlertCircle } from 'lucide-svelte';
    export let data: PageData;
    import LoginForm from './LoginForm.svelte';
	import { superForm } from 'sveltekit-superforms';
     const { errors } = superForm(data.form);
</script>

<div class="grid place-content-center py-60">
	<Card.Root>
		<Card.Header>
			<Card.Title>View a Schedule</Card.Title>
			<Card.Description>Enter the company login to view the schedule</Card.Description>
		</Card.Header>
		<Card.Content>
            {#if $errors.login}
            <Alert.Root variant="destructive" class="my-2"> 
                <AlertCircle class="h-4 w-4" />
                <Alert.Title>Error</Alert.Title>
                <Alert.Description>
                    {$errors.login}
                </Alert.Description>
            </Alert.Root>
            {/if}
            <LoginForm data={data.form} />
        </Card.Content>
	</Card.Root>
</div>
