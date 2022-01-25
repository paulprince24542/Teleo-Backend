<script>
import { Link } from "svelte-routing";
import Dashboard from "../Pages/Dashboard.svelte";


</script>
<main>
   <div class="sidebar-content">
    <div>
        <p class="nav-header">Main Navigation</p>
    </div>
    <h2 class="sidebar-options"><Link style="text-decoration: none; color:white" to="/dashboard">Dashboard</Link></h2>
    <h2 class="sidebar-options">Vendors</h2>
    <h2 class="sidebar-options">Users</h2>
    <h2 class="sidebar-options">Logs</h2>
    <h2 class="sidebar-options">Statistics</h2>
   </div>
</main>
<style>
    /* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {

}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {

}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {

}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
    .sidebar-content{
       display: flex;
       flex-direction: column;
       justify-content: flex-start;
   }

   .nav-header{
       padding: 13px;
       color: white;
       text-align: center;
   }

   .sidebar-options{
       display: flex;
       flex-direction: column;
   }

   .sidebar-options{
    cursor: pointer;
    color: white;
    font-weight: 100;
    font-size: 1.1rem;
    padding: 8px 16px;
    font-family: Arial, Helvetica, sans-serif
   }

   .sidebar-options:hover{
    background-color: #0A2A55;
    height: 100%;
   }

}
   
</style>