<script>
    import { Router, Link, Route, navigate } from "svelte-routing";
    function logout(){
        localStorage.removeItem('a_token');
        navigate("/api/admin/login", {
            replace: true
        })
        
    }
</script>
<main>
    <nav class="navbar">
        <!-- <div class="brand-title">Teleo Dashboard</div> -->
        <div class="navbar-links">
            <ul>
                <li><a href="" on:click={logout}>Logout</a></li>
            </ul>
        </div>
    </nav>
</main>

<style>
.navbar {
    display: flex;
    position: relative;
    justify-content: flex-end;
    align-items: center;
    background-color: #041C3F;
    color: white;
}


.navbar-links {
    height: 100%;
}

.navbar-links ul {
    display: flex;
    margin: 0;
    padding: 0;
}

.navbar-links li {
    list-style: none;
}

.navbar-links li a {
    display: block;
    text-decoration: none;
    color: white;
    padding: 1rem;
    cursor: pointer;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: 400;
}

.navbar-links li:hover {
    background-color: #1F549D;
}
</style>