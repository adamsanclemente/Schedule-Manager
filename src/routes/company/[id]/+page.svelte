<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	import { UserRoundPlus, PackagePlus } from 'lucide-svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import * as Dialog from '$lib/components/ui/dialog';
	import { writable } from 'svelte/store';

	// @ts-ignore
	import Calendar from '@event-calendar/core';
	// @ts-ignore
	import TimeGrid from '@event-calendar/time-grid';
	// @ts-ignore
	import DayGrid from '@event-calendar/day-grid';
	// @ts-ignore
	import List from '@event-calendar/list';
	import CWForm from './CWForm.svelte';
	import CJForm from './CJForm.svelte';
	import CEForm from './CEForm.svelte';

	let plugins = [TimeGrid, DayGrid, List];
	let options = {
		view: 'timeGridDay',
		events: data.data.events,
		headerToolbar: {
			start: 'title,prev,next',
			center: 'today,timeGridDay,timeGridWeek,dayGridMonth,listWeek',
			end: ''
		},
		height: '600px'
	};

	export const CWFormOpen = writable(false);
	export const CJFormOpen = writable(false);
</script>

<svelte:head>
	<title>{data.company.name} | Schedule</title>
</svelte:head>

<div class="flex justify-between items-center">
	<h1 class="text-2xl font-bold">{data.company.name}</h1>
	<div class="flex gap-3 justify-center items-center">
		<Dialog.Root bind:open={$CWFormOpen}>
			<Dialog.Trigger
				on:click={() => {
					$CWFormOpen = true;
				}}
				class={buttonVariants({ variant: 'outline' })}><UserRoundPlus /></Dialog.Trigger
			>
			<Dialog.Content class="sm:max-w-[425px]">
				<Dialog.Header>
					<Dialog.Title>Create Worker</Dialog.Title>
					<Dialog.Description>Create a new worker here.</Dialog.Description>
				</Dialog.Header>
				<CWForm data={data.createWorkerForm} {CWFormOpen} />
			</Dialog.Content>
		</Dialog.Root>

		<Dialog.Root bind:open={$CJFormOpen}>
			<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}><PackagePlus /></Dialog.Trigger
			>
			<Dialog.Content class="sm:max-w-[425px]">
				<Dialog.Header>
					<Dialog.Title>Create Job</Dialog.Title>
					<Dialog.Description>Create a new job here.</Dialog.Description>
				</Dialog.Header>
				<CJForm data={data.createJobForm} {CJFormOpen} />
			</Dialog.Content>
		</Dialog.Root>
	</div>
</div>

<div class="grid">
	<Calendar {plugins} {options} />
</div>

<div class="py-3">
<h2 class="text-xl font-bold my-1">Assign a Job</h2>
<CEForm data={data.createEventForm} workers={data.data.workers} jobs={data.data.jobs} />
</div>

<div class="w-full flex justify-evenly gap-3">
	<Button variant="outline" class="w-[50%]">Manage Workers</Button>
	<Button variant="outline" class="w-[50%]">Manage Jobs</Button>
</div>
