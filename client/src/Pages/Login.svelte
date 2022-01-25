<script>
    import { navigate } from "svelte-routing";
    
    
        let username = '';
        let password = '';
        let url;
    
        async function handleSubmit(){
            let response = await fetch("/api/auth/admin/login", {
                method: "POST",
                body: JSON.stringify({username, password}),
                headers: {
                    "Content-type": "application/json",
                }
            })
            let data = await response.json();
            if(data.login == true){
                localStorage.setItem("a_token", data.a_token)
                navigate("/dashboard")
            }
        }
    </script>
    
    <main>
        
    </main>
        <form on:submit|preventDefault={handleSubmit}>
            <div class="login-container">
                <div class="form">
                    <h2>Sign In</h2>
                    <input
                        type="text"
                        class="box"
                        placeholder="Enter Username"
                        required
                        bind:value={username}
                     
                    />
                    <input
                        type="password"
                        class="box"
                        placeholder="Enter Password"
                        required
                        bind:value={password}          
                    />
                    <input type="submit" class="button" value="Sign In" />
                </div>
            </div>
        </form>
    <style>
    
    
    .login-container{
        display: flex;
        margin: auto;
            margin-top: 150px;
            border-radius: 12px;
        height: 500px;
        width:500px;
        background-image: linear-gradient(
                to right top,
                #1f4c8e,
                #3e5495,
                #555b9d,
                #6964a3,
                #7c6caa
            );
    }
    
    .form{
        display: flex;
            flex-direction: column;
            width: 100%;
            align-items: center;
            margin-top: 40px;
    }
    
    
    .form h2 {
            font-size: 3rem;
            margin: 40px;
            font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
        }
    
        .box {
            padding: 12px;
            width: 65%;
            margin: 15px;
            outline: none;
            border-radius: 8px;
            text-decoration: none;
            border: none;
        }
    
        .button {
            padding: 12px 14px;
            width: 20%;
            margin-top: 25px;
            border-radius: 5px;
            color: white;
            border: none;
            outline: none;
            background-color: #131f2e;
            transition: 0.3s;
        }
    
        .button:hover {
            background-color: #2d3a4a;
        }
         
    </style>