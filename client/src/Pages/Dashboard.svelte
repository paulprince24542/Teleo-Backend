<script>
    import Navbar from "../components/navbar.svelte"
    import Header from "../components/header.svelte"
    import Sidebar from "../components/sidebar.svelte"
    import Main from "../components/main.svelte"
</script>

<main>
    <div class="container">
        <div class="item header">
           <Header/>
        </div>
        <div class="item navigation">
            <Navbar/>
        </div>
        <div class="item sidebar">
            <Sidebar/>
        </div>
        <div class="item main">
            <Main/>
        </div>
        <div class="item footer">
            Footer
        </div>

        
    </div>
</main>
<style>
    


    /* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {

}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {

}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
    .container{
        display: grid;
        height: 100vh;
        grid-template-rows: auto 1fr auto auto;
        grid-template-columns: repeat(13, 1fr);
       
    }
    
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
    .container{
        display: grid;
        height: 100vh;
        grid-template-rows: auto auto auto 1fr auto auto;
        grid-template-columns: repeat(16, 1fr);
        /* gap: 3px; */
       
    }

    /* .item{
        border: 2px solid red;
    } */
    .header{
        grid-column: 1/3;
        grid-row: 1/3;
        background-color: #041C3F;
    }

    .navigation{
        grid-column: 3/17;
    }
    .sidebar{
        grid-column: 1/3;
        grid-row: 3/5;
        background-color: #041C3F;
    }
    .main{
        grid-column: 3/17;
        grid-row: 2/5;
    }
    .footer{
        grid-row: 5/6;
        grid-column: 1/17;
    }
}
</style>