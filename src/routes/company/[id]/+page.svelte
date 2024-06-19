<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	import { UserRoundPlus, PackagePlus, Plus } from 'lucide-svelte';
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

	let plugins = [TimeGrid, DayGrid, List];
	let options = {
		view: 'timeGridDay',
		events: data.data.events,
		headerToolbar: {
			start: 'title,prev,next',
			center: 'today,timeGridDay,timeGridWeek,dayGridMonth,listWeek',
			end: ''
		},
		height: '400px'
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
	<form class="flex flex-row justify-evenly gap-3">
		<div class="flex flex-row gap-3 w-[88%]">
			<Select.Root>
				<Select.Trigger class="w-[50%]">
					<Select.Value placeholder=" Choose a Worker" />
				</Select.Trigger>
				<Select.Content>
					{#if data.data.workers.length === 0}
						<Select.Item value="no-workers">No Workers</Select.Item>
					{/if}

					{#each data.data.workers as worker}
						<Select.Item value={worker.id}>{worker.firstName} {worker.lastName}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>

			<Select.Root>
				<Select.Trigger class="w-[50%]">
					<Select.Value placeholder=" Choose a Job" />
				</Select.Trigger>
				<Select.Content>
					{#if data.data.jobs.length === 0}
						<Select.Item value="no-jobs">No Jobs</Select.Item>
					{/if}

					{#each data.data.jobs as job}
						<Select.Item value={job.id}>{job.title}</Select.Item>
					{/each}
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
