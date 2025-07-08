<script>
	// Import statements remain the same, but remove TypeScript-specific imports
	import * as Form from '$lib/components/ui/form';
	import { loginSchema } from './schema';

	// Use plain JavaScript variable declaration without type annotations
	let data = $props();
</script>

<Form.Root form={data.form} schema={loginSchema} debug={true}>
	{#snippet children({ config })}
		<Form.Field {config} name="email">
			<Form.Item>
				<Form.Label>Email</Form.Label>
				<Form.Input />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Field {config} name="password">
			<Form.Item>
				<Form.Label>Password</Form.Label>
				<Form.Input type="password" />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Button>Login</Form.Button>
	{/snippet}
</Form.Root>
