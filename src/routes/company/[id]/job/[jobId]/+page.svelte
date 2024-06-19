<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { createJobSchema, type CreateJobSchema } from '$lib/zod';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types';

	export let data: PageData;

	const form = superForm(data.form, {
		validators: zodClient(createJobSchema)
	});

	const { form: formData, enhance } = form;
</script>

<h1 class="text-2xl font-bold">Edit Job</h1>
<p class="text-gray-500">Edit job details here.</p>

<form method="POST" use:enhance action="?/editJob">
	<Form.Field {form} name="title">
		<Form.Control let:attrs>
			<Form.Label>Job Title</Form.Label>
			<Input {...attrs} bind:value={$formData.title} />
		</Form.Control>
		<Form.Description>Name of the job.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="hours">
		<Form.Control let:attrs>
			<Form.Label>Job Hours</Form.Label>
			<Input {...attrs} bind:value={$formData.hours} />
		</Form.Control>
		<Form.Description>Number of hours allocated to the job.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button>Submit</Form.Button>
</form>
