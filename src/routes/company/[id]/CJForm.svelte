<script lang="ts">
    import * as Form from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import { createJobSchema, type CreateJobSchema } from "$lib/zod";
	import type { Writable } from "svelte/store";
    import {
      type SuperValidated,
      type Infer,
      superForm,
    } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
   
    export let data: SuperValidated<Infer<CreateJobSchema>>;
    export let CJFormOpen: Writable<boolean>;
   
    const form = superForm(data, {
      validators: zodClient(createJobSchema),
      invalidateAll: true,
    });
   
    const { form: formData, enhance } = form;
  </script>
   
  <form method="POST" use:enhance action="?/createJob" on:submit={() => {CJFormOpen.set(false)}}>
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