<script>
    import Navbar from "../components/navbar.svelte"
    import Sidebar from "../components/sidebar.svelte"
    import Main from "../components/main.svelte"
</script>

<main>
    <div class="container">
        <!-- <div class="header">
            <Header/>
        </div> -->
        <div class="item navigation">
           <Navbar/>
        </div>
        <div class="item main">
            <Main/>
        </div>
        <div class="item sidebar">
            <Sidebar/>
        </div>
        <div class="item footer">
            footer
        </div>
        
    </div>
</main>
<style>
    .container {
        display: grid;
        height: 100vh;
        grid-template-rows: auto 1fr auto auto;
    }


    .sidebar{
        grid-column: 1 / span 2;
        grid-row: 5;
   }

    .footer{
        height: 13rem;
        width: auto;
        background-color: #071B37;
    }

    /* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {

}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {

}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
   .container{
       grid-template-columns: repeat(13, 1fr);
   }

   .navigation{
       grid-column: 3 / span 13 ;
   }

   .sidebar{
        grid-column: 1 / 3;
        grid-row:  1/3;
        background-color:#041C3F;
   }

   .main{
        grid-column:3 / span 12;
   }  

   

   .footer{
    grid-column: 1 / span 13;
   }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
    /* .sidebar{
        grid-column: 1 / 3;
        grid-row: 2;
        background-color: #4789E9;
   } */
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
    .container{
       grid-template-columns: repeat(13, 1fr);
   }

   /* .header{
    grid-column: 1/3;
   } */

   .navigation{
       grid-column: 3 / span 13 ;
   }

   .sidebar{
        grid-column: 1 / 3;
        grid-row:  1/3;
        background-color:#051E42;
   }

   .main{
        grid-column:3 / span 13;
        padding: 7px;
        background: #101215;
   }  

   

   .footer{
    grid-column: 1 / span 13;
   }

}
</style>