const title = document.querySelector(".title");
title.addEventListener("click",function(){
    location.href="/";
})

// Part 4 - 2：Create a pop-up signin(login)/signup(registration) window
const sign=document.querySelector(".sign");
const closeIcon = document.querySelectorAll(".closeIcon");
const signinWindow = document.querySelector(".signinWindow");
const noticeWindow = document.querySelector(".noticeWindow");
sign.addEventListener("click",function(){
    signinWindow.style.display="block";
})
closeIcon.forEach(function(i){
    i.addEventListener("click",function(){
        signinWindow.style.display="none";
        noticeWindow.style.display="none";
    })
})

const changeToSignup=document.querySelector(".changeToSignup");
const changeToSignin=document.querySelector(".changeToSignin");
const signinSection=document.querySelector(".signinSection");
const signupSection=document.querySelector(".signupSection");
changeToSignup.addEventListener("click",function(){
    signinSection.style.display="none";
    signupSection.style.display="block";
    if(signupResult){
        signupResult.remove();
    } 
})
changeToSignin.addEventListener("click",function(){
    signinSection.style.display="block";
    signupSection.style.display="none";
    if(signinResult){
        signinResult.remove();
    }    
})

// Part 4 - 4：signup API
const signupButton=document.querySelector(".signupButton");
const signupMain=document.querySelector(".signupMain");
const signupResult=document.createElement("div");
signupResult.setAttribute("class","signupResult");
signupButton.addEventListener("click",function(){
    const signupName = document.querySelector(".signupName").value;
    const signupEmail = document.querySelector(".signupEmail").value;
    const signupPassword = document.querySelector(".signupPassword").value;
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
        }).then(function(response){
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
})

// Part 4 - 5：signin API
const signinButton=document.querySelector(".signinButton");
const signinMain=document.querySelector(".signinMain")
const signinResult=document.createElement("div");
signinResult.setAttribute("class","signinResult");
signinButton.addEventListener("click",function(){
    const signinEmail = document.querySelector(".signinEmail").value;
    const signinPassword = document.querySelector(".signinPassword").value;
    if(signinEmail ==""|| signinPassword==""){
        signinResult.setAttribute("style","color:#8B0000");        
        signinResult.innerHTML="未輸入Email或密碼"; 
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
        }).then(function(response){
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
})

// Part 4 - 3：get signin status/information API
const signoutText=document.querySelector(".signoutText");
fetch("/api/user/auth",{
        method:"GET"
}).then(function(response){
    return response.json();
}).then(function(data){
    const user_data=data.data;
    if(user_data==null){
        return;
    }
    else{
        sign.style.display="none";
        signoutText.style.display="block";
    }
});

 // Part 4 - 6：signout API
 signoutText.addEventListener("click",function(){
    fetch("/api/user/auth",{
        method:"DELETE"
    }).then(function(response){
        return response.json();
    }).then(function(data){
        sign.style.display="block";
        signoutText.style.display="none";
        location.reload();
    });
 })

 // Part 5 - 3：redirect booking page
const reserve=document.querySelector(".reserve");
reserve.addEventListener("click",function(){
    fetch("/api/user/auth").then(function(response){    //method:"GET"
    return response.json();
    }).then(function(data){
        if(data.data == null){
            signinWindow.style.display="block";
        }
        else{
            location.href="/booking";
        }
    })
})