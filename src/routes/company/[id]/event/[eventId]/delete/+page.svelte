<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { confirmSchema, type ConfirmSchema } from '$lib/zod';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types';

	export let data: PageData;

	const form = superForm(data.form, {
		validators: zodClient(confirmSchema)
	});

	const { form: formData, enhance } = form;
</script>

<h1 class="text-2xl font-bold">Delete Event</h1>
<p class="text-gray-500">Enter required fields to delete this event.</p>

<form method="POST" use:enhance action="?/deleteEvent">
	<Form.Field {form} name="confirm">
		<Form.Control let:attrs>
			<Form.Label>Are you sure you want to delete this event?</Form.Label>
			<Input {...attrs} bind:value={$formData.confirm} placeholder="Confirm" />
		</Form.Control>
		<Form.Description>Enter "Confirm" to confirm deletion</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button>Submit</Form.Button>
</form>
