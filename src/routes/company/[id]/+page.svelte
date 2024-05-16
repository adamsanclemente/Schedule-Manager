<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	import { UserRoundPlus, PackagePlus, Plus } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';

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
		],
		headerToolbar: {
			start: 'title,prev,next',
			center: 'today,timeGridDay,timeGridWeek,dayGridMonth,listWeek',
			end: ''
		},
		height: '400px'
	};
</script>

<div class="flex justify-between items-center">
	<h1 class="text-2xl font-bold">{data.company.name}</h1>
	<div class="flex gap-3 justify-center items-center">
		<Button size="icon" variant="outline"><UserRoundPlus /></Button>
		<Button size="icon" variant="outline"><PackagePlus /></Button>
	</div>
</div>

<div class="grid">
	<Calendar {plugins} {options} />
</div>

<div class="py-3">
	<form class="flex flex-row justify-evenly gap-3">
		<div class="flex flex-row gap-3 w-[88%]">
			<Select.Root>
				<Select.Trigger class="w-[50%]">
					<Select.Value placeholder=" Choose a Worker" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="w1">Worker 1</Select.Item>
					<Select.Item value="w2">Worker 2</Select.Item>
					<Select.Item value="w3">Worker 3</Select.Item>
				</Select.Content>
			</Select.Root>

			<Select.Root>
				<Select.Trigger class="w-[50%]">
					<Select.Value placeholder=" Choose a Job" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="j1">Job 1</Select.Item>
					<Select.Item value="j2">Job 2</Select.Item>
					<Select.Item value="j3">Job 3</Select.Item>
				</Select.Content>
			</Select.Root>
		</div>
		<Button class="w-[12%]" size="icon" variant="outline"><Plus /></Button>
	</form>
</div>

<div class="w-full flex justify-evenly gap-3">
    <Button variant="outline" class="w-[50%]">Manage Workers</Button>
    <Button variant="outline" class="w-[50%]">Manage Jobs</Button>
</div>