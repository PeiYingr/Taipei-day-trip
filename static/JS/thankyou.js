const headline = document.querySelector(".headline")
const noOrder = document.querySelector(".noOrder")
const order = document.querySelector(".order")
const attractionPicture = document.querySelector(".attractionPicture")
const number = document.querySelector(".number")
const attractionName = document.querySelector(".attractionName")
const attractionAddress = document.querySelector(".attractionAddress")
const dateTime = document.querySelector(".dateTime")
const price = document.querySelector(".price")
const payStatus = document.querySelector(".payStatus")
const contactName = document.querySelector(".contactName")
const contactMail = document.querySelector(".contactMail")
const contactPhone = document.querySelector(".contactPhone")

const url = location.href
const orderNumber = url.split("?")[1].split("=")[1]

fetch("/api/user/auth").then(function(response){    //method:"GET"
    return response.json(); 
}).then(function(data){
    if(data.data == null){
        location.href="/";
    }
    else{
        const username = data.data.name;
        headline.innerHTML = username +"，成功預定的行程訂單如下："
    }
})

fetch("/api/order/" + orderNumber).then(function(response){
    return response.json();
}).then(function(data){
    if (data.data == null){
        return;
    }else{
        noOrder.style.display="none";
        order.style.display="block";
        number.textContent = orderNumber;
        attractionName.textContent = data.data.trip.attraction.name;
        attractionAddress.textContent = data.data.trip.attraction.address;
        price.textContent  = "新台幣" +  data.data.price + "元";
        contactName.textContent  = data.data.contact.name;
        contactMail.textContent  = data.data.contact.email;
        contactPhone.textContent = data.data.contact.phone;
        const img = document.createElement("img");        
        img.setAttribute("src",data.data.trip.attraction.image);
        attractionPicture.appendChild(img);
        if (data.data.trip.time == "上半天"){
            dateTime.textContent = data.data.trip.date + " " + "早上9點到下午4點";          
        }else{
            dateTime.textContent = data.data.trip.date + " " + "下午1點到晚上8點"            
        };
        if (data.data.status == 0){
            payStatus.textContent = "已付款"
            payStatus.style.color="#008000"
        }else{
            payStatus.textContent = "未付款成功"
            payStatus.style.color="#FF0000"
        }
    }
})