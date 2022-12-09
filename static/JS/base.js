function returnIndex(){
    document.location.href="/"
}

const signinWindow = document.querySelector(".signinWindow");
function signinBlock(){
    signinWindow.style.display="block";
}
function hideSigninWindow(){
    signinWindow.style.display="none";
}

const signinSection=document.querySelector(".signinSection");
const signupSection=document.querySelector(".signupSection");
function changeToSignup(){
    signinSection.style.display="none";
    signupSection.style.display="block";
}
function changeToSignin(){
    signinSection.style.display="block";
    signupSection.style.display="none";
}

// signup API
const signupMain=document.querySelector(".signupMain");
const signupResult=document.createElement("div");
signupResult.setAttribute("class","signupResult");
function signup(){
    const signupName = document.querySelector(".signupName").value
    const signupEmail = document.querySelector(".signupEmail").value
    const signupPassword = document.querySelector(".signupPassword").value
    if(signupName ==""||signupEmail==""||signupPassword==""){
        signupResult.setAttribute("style","color:#8B0000");        
        signupResult.innerHTML="未輸入姓名、Email 或 密碼";    
    }else{
        const addMember = { 
            "name":signupName,
            "email":signupEmail,
            "password":signupPassword
        };  
        fetch("/api/user",{
            method:"POST",
            body:JSON.stringify(addMember),
            cache:"no-cache",
            headers:new Headers({
                "content-type":"application/json"
            })
        })
        .then(function(response){
            return response.json();
        }).then(function(data){ 
            if(data.error == true){
                signupResult.setAttribute("style","color:#8B0000");        
                signupResult.innerHTML=data.message; 
            }  
            if(data.ok==true){
                signupResult.setAttribute("style","color:#008000");           
                signupResult.innerHTML="註冊成功，請登入系統";   
            }                     
        })
    }
    const changeToSignin=document.querySelector(".changeToSignin");
    signupMain.insertBefore(signupResult,changeToSignin);            
}


const signinResult=document.createElement("div");
signinResult.setAttribute("class","signinResult");
const signinMain=document.querySelector(".signinMain");
// signin API
function signin(){
    const signinEmail = document.querySelector(".signinEmail").value
    const signinPassword = document.querySelector(".signinPassword").value
    if(signinEmail ==""|| signinPassword==""){
        signinResult.setAttribute("style","color:#8B0000");        
        signinResult.innerHTML="未輸入Email或密碼"; 
        const signinMain=document.querySelector(".signinMain");
        const changeToSignup=document.querySelector(".changeToSignup");
        signinMain.insertBefore(signinResult,changeToSignup);    
    }else{
        const member = { 
        "email":signinEmail,
        "password":signinPassword
        }; 
        fetch("/api/user/auth",{
            method:"PUT",
            body:JSON.stringify(member),
            cache:"no-cache",
            headers:new Headers({
                "content-type":"application/json"
            })
        })
        .then(function(response){
            return response.json();
        }).then(function(data){   
            if(data.error == true){
                signinResult.setAttribute("style","color:#8B0000");        
                signinResult.innerHTML=data.message; 
                const changeToSignup=document.querySelector(".changeToSignup");
                signinMain.insertBefore(signinResult,changeToSignup);  
            }  
            if(data.ok == true){
                location.reload();
            }
        })
    }
}

// get signin information API
const sign=document.querySelector(".sign");
const signoutText=document.querySelector(".signoutText");
fetch("/api/user/auth",{
        method:"GET"
    })
.then(function(response){
    return response.json();
 }).then(function(data){
    const user_data=data.data;
    if(user_data==null){
        return;
    }
    else{
        sign.style.display="none";
        signoutText.style.display="block"
    }
 });

 // signout API
function signout(){
    fetch("/api/user/auth",{
        method:"DELETE"
    })
    .then(function(response){
        return response.json();
     }).then(function(data){
        sign.style.display="block";
        signoutText.style.display="none"
        location.reload();
     });
}
