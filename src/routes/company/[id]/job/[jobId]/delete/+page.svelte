<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { confirmSchema, type ConfirmSchema } from '$lib/zod';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';

	export let data: PageData;

	const form = superForm(data.form, {
		validators: zodClient(confirmSchema),
		invalidateAll: true
	});

	const { form: formData, enhance } = form;
</script>

<h1 class="text-2xl font-bold">Delete Job</h1>
<p class="text-gray-500">Enter required fields to delete this job.</p>

<form method="POST" use:enhance action="?/deleteJob">
	<Form.Field {form} name="confirm">
		<Form.Control let:attrs>
			<Form.Label>Are you sure you want to delete this job?</Form.Label>
			<Input {...attrs} bind:value={$formData.confirm} placeholder="Confirm" class="hidden mb-3" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<div class="flex flex-row gap-3">
		<Form.Button type="submit" variant="destructive">Delete</Form.Button>
		<Button
			variant="outline"
			on:click={() => {
				window.history.back();
			}}>Cancel</Button
		>
	</div>
</form>
