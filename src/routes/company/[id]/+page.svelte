<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	import { UserRoundPlus, PackagePlus, Plus } from 'lucide-svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import * as Form from '$lib/components/ui/form';
	import * as Dialog from '$lib/components/ui/dialog';
	import SuperDebug from 'sveltekit-superforms';

	// @ts-ignore
	import Calendar from '@event-calendar/core';
	// @ts-ignore
	import TimeGrid from '@event-calendar/time-grid';
	// @ts-ignore
	import DayGrid from '@event-calendar/day-grid';
	// @ts-ignore
	import List from '@event-calendar/list';
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { createJobSchema, createWorkerSchema } from '$lib/zod';

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

	const {
		form: cwForm,
		enhance: enhanceCW,
		constraints: cwConstraints
	} = superForm(data.createWorkerForm, {
		validators: zod(createWorkerSchema)
	});

	const {
		form: cjForm,
		enhance: enhanceCJ,
		constraints: cjConstraints
	} = superForm(data.createJobForm, {
		validators: zod(createJobSchema)
	});
</script>

<svelte:head>
	<title>{data.company.name} | Schedule</title>
</svelte:head>

<div class="flex justify-between items-center">
	<h1 class="text-2xl font-bold">{data.company.name}</h1>
	<div class="flex gap-3 justify-center items-center">
		<Dialog.Root>
			<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}
				><UserRoundPlus /></Dialog.Trigger
			>
			<Dialog.Content class="sm:max-w-[425px]">
				<Dialog.Header>
					<Dialog.Title>Create Worker</Dialog.Title>
					<Dialog.Description>Create a new worker here.</Dialog.Description>
				</Dialog.Header>
				<form use:enhanceCW action="?/createWorker" method="POST">
					<div class="grid gap-4 py-4">
						<div class="grid grid-cols-4 items-center gap-4">
							<Label for="firstName" class="text-right">First Name</Label>
							<Input
								id="firstName"
								name="firstName"
								bind:value={$cwForm.firstName}
								class="col-span-3"
								{...$cwConstraints.firstName}
							/>
						</div>
						<div class="grid grid-cols-4 items-center gap-4">
							<Label for="lastName" class="text-right">Last Name</Label>
							<Input
								id="lastName"
								name="lastName"
								bind:value={$cwForm.lastName}
								class="col-span-3"
								{...$cwConstraints.lastName}
							/>
						</div>
						<div class="grid grid-cols-4 items-center gap-4">
							<Label for="dailyHours" class="text-right">Max Daily Hours</Label>
							<Input
								type="number"
								id="dailyHours"
								name="dailyHours"
								bind:value={$cwForm.dailyHours}
								class="col-span-3"
								{...$cwConstraints.dailyHours}
							/>
						</div>
					</div>
					<Dialog.Footer>
						<Form.Button>Create</Form.Button>
					</Dialog.Footer>
				</form>
			</Dialog.Content>
		</Dialog.Root>

		<Dialog.Root>
			<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}><PackagePlus /></Dialog.Trigger
			>
			<Dialog.Content class="sm:max-w-[425px]">
				<Dialog.Header>
					<Dialog.Title>Create Job</Dialog.Title>
					<Dialog.Description>Create a new job here.</Dialog.Description>
				</Dialog.Header>
				<form use:enhanceCJ action="?/createJob" method="POST">
					<div class="grid gap-4 py-4">
						<div class="grid grid-cols-4 items-center gap-4">
							<Label for="title" class="text-right">Title</Label>
							<Input
								id="title"
								class="col-span-3"
								name="title"
								{...$cjConstraints.title}
								bind:value={$cjForm.title}
							/>
						</div>
						<div class="grid grid-cols-4 items-center gap-4">
							<Label for="hours" class="text-right">Hours</Label>
							<Input
								type="number"
								id="hours"
								name="hours"
								class="col-span-3"
								{...$cjConstraints.hours}
								bind:value={$cjForm.hours}
							/>
						</div>
					</div>
					<Dialog.Footer>
						c
					</Dialog.Footer>
				</form>
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
