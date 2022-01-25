
<main>
    <div class="main-container">
        <div class="main-nav">
            <p class="nav-header">DASHBOARD</p>
        </div>
            <div class="fbox1">HI</div>
            <div class="fbox2">HI</div>
            <div class="fbox3">HI</div>
            <div class="fbox4">HI</div>
            <div class="fbox5">HI</div>
        
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
    .main-container{
        display: grid;
        grid-template-columns: repeat(28, 1fr);
        grid-template-rows: auto auto 1fr;
    }
   .main-nav{
       background-color: rebeccapurple;
       grid-column: 1/29;
       padding: 5px;
       display: flex;
       justify-content: space-between;
   }
   .nav-header{
       margin-left: 12px;
       font-weight: bold;
   }

   .fbox1{
       margin-top: 3rem;
       height: 8rem;
       grid-column: 2/6;
       background-color: royalblue;
       border-radius: 14px;
   }
   .fbox2{
        margin-top: 3rem;
        height: 8rem;
        grid-column: 8/12;
        background-color: red;
        border-radius: 14px;
   }
   .fbox3{
        margin-top: 3rem;
        height: 8rem;
        grid-column: 14/18;
        background-color: purple;
        border-radius: 14px;
   }
   .fbox4{
       margin-top: 6rem;
       grid-column: 2/9;
       background-color: saddlebrown;
       height: 30rem;
   }
   .fbox5{
       margin-top: 6rem;
       grid-column: 10/18;
       background-color: saddlebrown;
   }
}
    
</style>