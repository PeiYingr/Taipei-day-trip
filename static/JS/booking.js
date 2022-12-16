const noReservation = document.querySelector(".noReservation")
const afterfooter = document.querySelector(".afterfooter")
const showReservation = document.querySelector(".showReservation")
const usernameText = document.querySelector(".usernameText")
const picture = document.querySelector(".picture")
const attractionName = document.querySelector(".attractionName")
const date = document.querySelector(".date")
const time = document.querySelector(".time")
const price = document.querySelector(".price")
const address = document.querySelector(".address")
const nameInput = document.querySelector(".name")
const emailInput = document.querySelector(".email")
const totalPrice = document.querySelector(".totalPrice")
const deleteIcon = document.querySelector(".deleteIcon")
let username;
let useremail;

// Part 5 - 5：get booking information API
fetch("/api/user/auth").then(function(response){    //method:"GET"
    return response.json(); 
}).then(function(data){
    if(data.data == null){
        location.href="/";
    }
    else{
        username = data.data.name;
        useremail = data.data.email;
        usernameText.innerHTML = username;
    }
})

fetch("/api/booking").then(function(response){  //method:"GET"
    return response.json();  
}).then(function(data){
    if(data.data == null){
        return;
    }
    else{
        showReservation.style.display="block";
        noReservation.style.display="none";
        afterfooter.style.display="none";
        const img = document.createElement("img");        
        img.setAttribute("src",data.data.attraction.image);
        picture.appendChild(img);
        attractionName.innerHTML = data.data.attraction.name;
        date.innerHTML = data.data.date;
        if (data.data.time=="上半天"){
            time.innerHTML = "早上9點到下午4點";
        }else{
            time.innerHTML = "下午1點到晚上8點";
        }
        price.innerHTML = "新台幣"+data.data.price+"元";
        address.innerHTML = data.data.attraction.address;
        nameInput.setAttribute("value", username);
        emailInput.setAttribute("value", useremail);
        totalPrice.innerHTML = "新台幣"+data.data.price+"元";                  
    }           
})

// Part 5 - 5：delete booking API
deleteIcon.addEventListener("click", function(){
    fetch("/api/booking",{
        method:"DELETE",
    }).then(function(response){
        return response.json();  
    }).then(function(data){
        if(data.ok == true){
            location.reload();
        }else{
            noticeWindow.style.display="block";
            noticeMain.innerText=data.message; 
        }        
    }) 
})