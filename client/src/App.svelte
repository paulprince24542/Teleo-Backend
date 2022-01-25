<script>
	import { Router, Link, Route } from "svelte-routing";
	import Login from "./Pages/Login.svelte"
	import Dashboard from "./Pages/Dashboard.svelte"
	import Protected from "./Pages/Protected.svelte"
	export let url = "";
</script>
<Router url="{url}">
	<main>
		<Route path="/dashboard" let:params>
			<Protected Page={Dashboard}/>
		</Route>
	 <Route path="/api/admin/login" component={Login} />
		<Route path="/" component={Dashboard} />
	</main>
</Router>

<style>

</style>