<script lang="ts">
    import * as Form from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import { createWorkerSchema, type CreateWorkerSchema } from "$lib/zod";
	import type { Writable } from "svelte/store";
    import {
      type SuperValidated,
      type Infer,
      superForm,
    } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
   
    export let data: SuperValidated<Infer<CreateWorkerSchema>>;
    export let CWFormOpen: Writable<boolean>;
   
    const form = superForm(data, {
      validators: zodClient(createWorkerSchema),
      invalidateAll: true,
    });
   
    const { form: formData, enhance } = form;
  </script>
   
  <form method="POST" use:enhance action="?/createWorker" on:submit={() => {CWFormOpen.set(false)}}>
    <Form.Field {form} name="firstName">
      <Form.Control let:attrs>
        <Form.Label>First Name</Form.Label>
        <Input {...attrs} bind:value={$formData.firstName} />
      </Form.Control>
      <Form.Description>Worker's first name.</Form.Description>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="lastName">
      <Form.Control let:attrs>
        <Form.Label>Last Name</Form.Label>
        <Input {...attrs} bind:value={$formData.lastName} />
      </Form.Control>
      <Form.Description>Worker's last name.</Form.Description>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="dailyHours">
      <Form.Control let:attrs>
        <Form.Label>Max Daily Hours</Form.Label>
        <Input type="number" {...attrs} bind:value={$formData.dailyHours} />
      </Form.Control>
      <Form.Description>Worker's max daily hours.</Form.Description>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Button>Submit</Form.Button>
  </form>