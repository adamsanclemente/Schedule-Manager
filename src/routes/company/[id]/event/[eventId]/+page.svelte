<script lang="ts" generics="T extends Record<string, unknown>">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { editEventSchema, type EditEventSchema } from '$lib/zod';
	import {
		type SuperValidated,
		type Infer,
		superForm,
		dateProxy,
		type FormPathLeaves
	} from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types';
	import * as Select from '$lib/components/ui/select';
	import { colors } from '$lib/zod';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';

	export let data: PageData;

	const form = superForm(data.form, {
		validators: zodClient(editEventSchema)
	});

	const { form: formData, enhance } = form;

	$: selectedColor = $formData.color
		? {
				label: colors[$formData.color],
				value: $formData.color
			}
		: undefined;

	$: startDate = dateProxy(form, 'start', { format: 'datetime-local', empty: 'null' });
	$: endDate = dateProxy(form, 'end', { format: 'datetime-local', empty: 'null' });
</script>

<div class="flex justify-between items-center">
	<h1 class="text-2xl font-bold">Edit Event</h1>
	<Button
		href={`/company/${$page.params.id}/event/${$page.params.eventId}/delete`}
		variant="destructive">Delete Event</Button
	>
</div>
<p class="text-gray-500">Edit event details here.</p>

<form method="POST" use:enhance action="?/editEvent">
	<Form.Field {form} name="title">
		<Form.Control let:attrs>
			<Form.Label>Event Title</Form.Label>
			<Input {...attrs} bind:value={$formData.title} />
		</Form.Control>
		<Form.Description>Name of the event.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="color">
		<Form.Control let:attrs>
			<Form.Label>Event Color</Form.Label>
			<Select.Root
				selected={selectedColor}
				onSelectedChange={(v) => {
					v && ($formData.color = v.value);
				}}
			>
				<Select.Trigger>
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
		<Form.Description>Color of event.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="start">
		<Form.Control let:attrs>
			<Form.Label>Start Date</Form.Label>
			<Input type="datetime-local" {...attrs} bind:value={$startDate} />
		</Form.Control>
		<Form.Description>Start date of the event.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="end">
		<Form.Control let:attrs>
			<Form.Label>End Date</Form.Label>
			<Input type="datetime-local" {...attrs} bind:value={$endDate} />
		</Form.Control>
		<Form.Description>End date of the event.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button>Submit</Form.Button>
</form>
