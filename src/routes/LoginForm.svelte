<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { loginSchema, type LoginSchema } from '$lib/zod';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<Infer<LoginSchema>>;

	const form = superForm(data, {
		validators: zodClient(loginSchema)
	});

	const { form: formData, enhance } = form;
</script>


<form method="POST" use:enhance>
    <Form.Field {form} name="login">
      <Form.Control let:attrs>
        <Form.Label>Company Login</Form.Label>
        <Input {...attrs} bind:value={$formData.login} placeholder="Enter Company Login Here..."/>
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <Form.Button class="w-full my-2">Submit</Form.Button>
  </form>