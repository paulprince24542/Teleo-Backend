<script>
    import jwt_decode from "jwt-decode";
    import { onMount } from "svelte"
    import { navigate } from "svelte-routing"
    let authenticated = false;
    export let Page;

    onMount(async () => {
        if(localStorage.getItem('a_token')){
            const decode = jwt_decode(localStorage.getItem('a_token'))
            console.log(decode)
            if(decode.exp * 1000 < Date.now()){
                localStorage.removeItem('a_token');
                navigate("/", {replace: true})
            }else{
                authenticated = true
               
            }
        }else {
            navigate('/', { replace: true });
        }
    })
</script>

{#if authenticated}
        <svelte:component this={Page} />
    {/if}