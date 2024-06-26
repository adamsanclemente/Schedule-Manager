<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';

	import { createEventSchema, type CreateEventSchema } from '$lib/zod';
	import { Plus } from 'lucide-svelte';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { colors } from '$lib/zod';
	import { invalidateAll } from '$app/navigation';
	import type { Writable } from 'svelte/store';
	export let CalendarRefresh: Writable<boolean>;
	export let data: SuperValidated<Infer<CreateEventSchema>>;
	export let workers: {
		id: string;
		firstName: string;
		lastName: string;
		maxHours: number;
		companyId: string;
		jobIds: string[];
	}[];
	export let jobs: {
		id: string;
		title: string;
		companyId: string;
		employeeIds: string[];
		hours: number;
	}[];

	const form = superForm(data, {
		validators: zodClient(createEventSchema),
		invalidateAll: true,
		resetForm: false
	});

	const { form: formData, enhance } = form;

	$: selectedColor = $formData.color
		? {
				label: colors[$formData.color],
				value: $formData.color
			}
		: undefined;

	$: selectedWorker = $formData.worker
		? {
				label:
					(workers?.find((w) => w.id === $formData.worker)?.firstName ?? '') +
					' ' +
					(workers?.find((w) => w.id === $formData.worker)?.lastName ?? ''),
				value: $formData.worker
			}
		: undefined;

	$: selectedJob = $formData.job
		? {
				label: jobs?.find((j) => j.id === $formData.job)?.title ?? '',
				value: $formData.job
			}
		: undefined;
</script>

<form
	method="POST"
	use:enhance
	action="?/createEvent"
	class="flex sm:flex-row flex-col justify-evenly gap-3 items-center"
>
	<div class="flex gap-3 sm:flex-row flex-col w-[100%]">
		<Form.Field {form} name="worker" class="w-full sm:w-1/4">
			<Form.Control let:attrs>
				<Form.Label>Worker</Form.Label>
				<Select.Root
					selected={selectedWorker}
					onSelectedChange={(v) => {
						v && ($formData.worker = v.value);
					}}
				>
					<Select.Trigger class="w-[100%]">
						<Select.Value placeholder=" Choose a Worker" />
					</Select.Trigger>
					<Select.Content>
						{#if workers.length === 0}
							<Select.Item value="no-workers">No Workers</Select.Item>
						{/if}

						{#each workers as worker}
							<Select.Item value={worker.id} label={worker.firstName + ' ' + worker.lastName}
								>{worker.firstName} {worker.lastName}</Select.Item
							>
						{/each}
					</Select.Content>
				</Select.Root>
				<input hidden bind:value={$formData.worker} name={attrs.name} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="job" class="w-full sm:w-1/4">
			<Form.Control let:attrs>
				<Form.Label>Job</Form.Label>
				<Select.Root
					selected={selectedJob}
					onSelectedChange={(v) => {
						v && ($formData.job = v.value);
					}}
				>
					<Select.Trigger class="w-[100%]">
						<Select.Value placeholder="Choose a Job" />
					</Select.Trigger>
					<Select.Content>
						{#if jobs.length === 0}
							<Select.Item value="no-jobs">No Jobs</Select.Item>
						{/if}

						{#each jobs as job}
							<Select.Item value={job.id} label={job.title}>{job.title}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
				<input hidden bind:value={$formData.job} name={attrs.name} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="startDate" class="w-full md:w-1/4">
			<Form.Control let:attrs>
				<Form.Label>Start Date</Form.Label>
				<Input type="date" {...attrs} bind:value={$formData.startDate} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="color" class="w-full sm:w-1/4">
			<Form.Control let:attrs>
				<Form.Label>Color</Form.Label>
				<Select.Root
					selected={selectedColor}
					onSelectedChange={(v) => {
						v && ($formData.color = v.value);
					}}
				>
					<Select.Trigger class="w-[100%]">
						<Select.Value placeholder="Choose a Color" />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="#b72205" label="Red" style="color: #b72205" />
						<Select.Item value="#cf8074" label="Orange" style="color: #cf8074" />
						<Select.Item value="#e8c039" label="Yellow" style="color: #e8c039" />
						<Select.Item value="#6eb47c" label="Light Green" style="color: #6eb47c" />
						<Select.Item value="#477e47" label="Dark Green" style="color: #477e47" />
						<Select.Item value="#589ae2" label="Light Blue" style="color: #589ae2" />
						<Select.Item value="#4652b2" label="Dark Blue" style="color: #4652b2" />
						<Select.Item value="#7286c9" label="Light Purple" style="color: #7286c9" />
						<Select.Item value="#7c2ca7" label="Dark Purple" style="color: #7c2ca7" />
						<Select.Item value="#616161" label="Gray" style="color: #616161" />
					</Select.Content>
				</Select.Root>
				<input hidden bind:value={$formData.color} name={attrs.name} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Button name="submit" on:click={() => $CalendarRefresh = !$CalendarRefresh} class="mt-1 sm:mt-8 w-full sm:w-[12%]" size="icon" variant="outline"
			><Plus /></Form.Button
		>
	</div>
</form>
