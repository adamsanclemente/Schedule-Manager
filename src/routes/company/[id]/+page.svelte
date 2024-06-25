<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	import { UserRoundPlus, PackagePlus, EllipsisVertical } from 'lucide-svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Table from '$lib/components/ui/table';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
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
	import { goto } from '$app/navigation';

	let plugins = [TimeGrid, DayGrid, List];
	let options = {
		view: 'timeGridDay',
		events: data.data.events,
		headerToolbar: {
			start: 'title,prev,next',
			center: 'today,timeGridDay,timeGridWeek,dayGridMonth,listWeek',
			end: ''
		},
		height: '600px',
		eventClick: function(info: { event: any }) {
			goto(`/company/${data.company.id}/event/${info.event.id}`);
		}
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
<CEForm data={data.createEventForm} workers={data.data.workers} jobs={data.data.filteredJobs} />
</div>

<div class="w-full flex justify-evenly gap-3 py-6">
	<Dialog.Root>
		<Dialog.Trigger class={buttonVariants({ variant: 'outline' }) + ' w-[50%]'} >Manage Workers</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Manage Workers</Dialog.Title>
				<Dialog.Description>Manage workers here.</Dialog.Description>
			</Dialog.Header>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>First Name</Table.Head>
						<Table.Head>Last Name</Table.Head>
						<Table.Head>Maximum Daily Hours</Table.Head>
						<Table.Head>Actions</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.data.workers as worker}
						<Table.Row>
							<Table.Cell>{worker.firstName}</Table.Cell>
							<Table.Cell>{worker.lastName}</Table.Cell>
							<Table.Cell>{worker.maxHours}</Table.Cell>
							<Table.Cell>
								<DropdownMenu.Root>
									<DropdownMenu.Trigger class={buttonVariants({ variant: 'outline' }) + ' w-[100%]'}>
										Actions
									</DropdownMenu.Trigger>
									<DropdownMenu.Content>
										<a href={`/company/${data.company.id}/worker/${worker.id}`}><DropdownMenu.Item>Edit</DropdownMenu.Item></a>
										<a href={`/company/${data.company.id}/worker/${worker.id}/delete`}><DropdownMenu.Item>Delete</DropdownMenu.Item></a>
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</Dialog.Content>
	</Dialog.Root>
	
	<Dialog.Root>
		<Dialog.Trigger class={buttonVariants({ variant: 'outline' }) + ' w-[50%]'} >Manage Jobs</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Manage Jobs</Dialog.Title>
				<Dialog.Description>Manage jobs here.</Dialog.Description>
			</Dialog.Header>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Title</Table.Head>
						<Table.Head>Hours</Table.Head>
						<Table.Head>Actions</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.data.jobs as job}
						<Table.Row>
							<Table.Cell>{job.title}</Table.Cell>
							<Table.Cell>{job.hours}</Table.Cell>
							<Table.Cell>
								<DropdownMenu.Root>
									<DropdownMenu.Trigger class={buttonVariants({ variant: 'outline' }) + ' w-[100%]'}>
										Actions
									</DropdownMenu.Trigger>
									<DropdownMenu.Content>
										<a href={`/company/${data.company.id}/job/${job.id}`}><DropdownMenu.Item>Edit</DropdownMenu.Item></a>
										<a href={`/company/${data.company.id}/job/${job.id}/delete`}><DropdownMenu.Item>Delete</DropdownMenu.Item></a>
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</Dialog.Content>
	</Dialog.Root>
</div>
