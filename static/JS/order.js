const goTripButton = document.querySelector(".goTripButton")
const headline = document.querySelector(".headline")
const nopay = document.querySelector(".nopay")
const pay = document.querySelector(".pay")
const historyTrip = document.querySelector(".historyTrip")
const nohistoryOrderFrame = document.querySelector(".nohistoryOrderFrame")
const noHistoryOrder = document.querySelector(".noHistoryOrder")
const havehistoryOrderFrame = document.querySelector(".havehistoryOrderFrame")
const haveHistoryOrder = document.querySelector(".haveHistoryOrder")
const footer = document.querySelector(".footer")
const body = document.querySelector("body")

function orderHistoryLoad(allData){
    // historyOrders Frame
    const historyOrders = document.createElement("div");
    historyOrders.setAttribute("class","historyOrders");
    // orderNumberText Frame
    const orderNumberText = document.createElement("div");
    orderNumberText.setAttribute("class","orderNumberText");
    orderNumberText.textContent = "✿ 訂單編號";
    historyOrders.appendChild(orderNumberText);

    const br = document.createElement("br");
    orderNumberText.append(br)

    const orderNumber = document.createElement("span");               
    orderNumber.setAttribute("class","orderNumber");
    orderNumber.textContent = allData[i].number
    orderNumberText.appendChild(orderNumber);
    // historyOrdersPicture Frame
    const historyOrdersPicture = document.createElement("div");
    historyOrdersPicture.setAttribute("class","historyOrdersPicture");
    historyOrders.appendChild(historyOrdersPicture);

    const pic=document.createElement("img");
    pic.setAttribute("src",allData[i].trip.attraction.image);
    historyOrdersPicture.appendChild(pic);     
    // orderInformation Frame
    const orderInformation = document.createElement("div");
    orderInformation.setAttribute("class","orderInformation");
    historyOrders.appendChild(orderInformation);

    const orderInformationText = document.createElement("div");
    orderInformationText.setAttribute("class","orderInformationText");
    orderInformationText.textContent = "✿ 訂單資訊";
    orderInformation.appendChild(orderInformationText);                   
    // orderList
    const orderList = document.createElement("ul");
    orderInformation.appendChild(orderList)
    // list-attraction name
    const listAttractionName = document.createElement("li");
    listAttractionName.textContent = "景點名稱：";
    orderList.appendChild(listAttractionName)
    const attractionName = document.createElement("span");
    attractionName.setAttribute("class"," attractionName");
    attractionName.textContent = allData[i].trip.attraction.name;
    listAttractionName.appendChild(attractionName)
    // list-date
    const listDate = document.createElement("li");
    listDate.textContent = "日期：";
    orderList.appendChild(listDate)
    const date = document.createElement("span");
    date.setAttribute("class"," date");
    date.textContent = allData[i].trip.date;
    listDate.appendChild(date)
    // list-time
    const listTime = document.createElement("li");
    listTime.textContent = "時間：";
    orderList.appendChild(listTime)
    const time = document.createElement("span");
    time .setAttribute("class"," time");
    if (allData[i].trip.time == "上半天"){
        time.textContent = "早上9點到下午4點";          
    }else{
        time.textContent = "下午1點到晚上8點"            
    };
    listTime.appendChild(time)
    // list-price
    const listPrice = document.createElement("li");
    listPrice.textContent = "價錢：";
    orderList.appendChild(listPrice)
    const price = document.createElement("span");
    price.setAttribute("class"," price");
    price.textContent = "新台幣 " + allData[i].price + " 元";
    listPrice.appendChild(price)
    // contactInformation Frame
    const contactInformation = document.createElement("div");
    contactInformation.setAttribute("class","contactInformation");
    historyOrders.appendChild(contactInformation);

    const contactInformationText = document.createElement("div");
    contactInformationText.setAttribute("class","contactInformationText");
    contactInformationText.textContent = "✿ 聯絡人資訊";
    contactInformation.appendChild(contactInformationText);
    // contactList
    const contactList = document.createElement("ul");
    contactInformation.appendChild(contactList)
    // list-contact name
    const listContactName = document.createElement("li");
    listContactName.textContent = "姓名：";
    contactList.appendChild(listContactName)
    const contactName = document.createElement("span");
    contactName.setAttribute("class","contactName");
    contactName.textContent = allData[i].contact.name;
    listContactName.appendChild(contactName)              
    // list-email
    const listContactMail = document.createElement("li");
    listContactMail.textContent = "信箱：";
    contactList.appendChild(listContactMail)
    const contactMail = document.createElement("span");
    contactMail.setAttribute("class","contactMail");
    contactMail.textContent = allData[i].contact.email;
    listContactMail.appendChild(contactMail)
    // list-phone
    const listContactPhone = document.createElement("li");
    listContactPhone.textContent = "手機：";
    contactList.appendChild(listContactPhone)
    const contactPhone = document.createElement("span");
    contactPhone.setAttribute("class","contactPhone");
    contactPhone.textContent = allData[i].contact.phone;
    listContactPhone.appendChild(contactPhone)                  

    haveHistoryOrder.appendChild(historyOrders)
}

fetch("/api/user/auth").then(function(response){    //method:"GET"
    return response.json(); 
}).then(function(data){
    if(data.data == null){
        location.href="/";
    }
    else{
        username = data.data.name;
        useremail = data.data.email;
        headline.innerHTML = "您好，"+ username +"，歷史訂單如下："
        fetch("/api/order").then(function(response){  //method:"GET"
            return response.json();  
        }).then(function(data){
            if(data.data == null){
                nohistoryOrderFrame.style.display="flex";
                havehistoryOrderFrame.style.display="none";
            }else{
                // default = display haven't pay orders
                const allData = data.data;
                nohistoryOrderFrame.style.display="none";
                havehistoryOrderFrame.style.display="flex";
                haveHistoryOrder.innerHTML="";
                for(i=0; i<allData.length; i++){
                    orderHistoryLoad(allData)
                }
                const fixScroll = document.createElement("div");
                fixScroll.setAttribute("class","fixScroll");
                body.insertBefore(fixScroll, footer);
            }           
        })
    }
})

nopay.addEventListener("click", function(){
    nopay.style.color = "#666666";
    nopay.style.borderBottom = "2px solid #448899";
    pay.style.color="#d2d6d6";
    pay.style.borderBottom = "none";
    historyTrip.style.color="#d2d6d6";
    historyTrip.style.borderBottom = "none";
    fetch("/api/order?status=nopay").then(function(response){  //method:"GET"
        return response.json();  
    }).then(function(data){
        if(data.data == null){
            nohistoryOrderFrame.style.display="flex";
            havehistoryOrderFrame.style.display="none";
        }else{
            const allData = data.data;
            nohistoryOrderFrame.style.display="none";
            havehistoryOrderFrame.style.display="flex";
            haveHistoryOrder.innerHTML="";
            for(i=0; i<allData.length; i++){
                orderHistoryLoad(allData);
            }
        }           
    })
})

pay.addEventListener("click", function(){
    nopay.style.color = "#d2d6d6";
    nopay.style.borderBottom = "none";
    pay.style.color="#666666";
    pay.style.borderBottom = "2px solid #448899";
    historyTrip.style.color="#d2d6d6";
    historyTrip.style.borderBottom = "none";
    fetch("/api/order?status=pay").then(function(response){  //method:"GET"
        return response.json();  
    }).then(function(data){
        if(data.data == null){
            nohistoryOrderFrame.style.display="flex";
            havehistoryOrderFrame.style.display="none";
        }else{
            const allData = data.data;
            nohistoryOrderFrame.style.display="none";
            havehistoryOrderFrame.style.display="flex";
            haveHistoryOrder.innerHTML="";
            for(i=0; i<allData.length; i++){
                orderHistoryLoad(allData);
            }
        }           
    })
})

historyTrip.addEventListener("click", function(){
    nopay.style.color = "#d2d6d6";
    nopay.style.borderBottom = "none";
    pay.style.color="#d2d6d6";
    pay.style.borderBottom = "none";
    historyTrip.style.color="#666666";
    historyTrip.style.borderBottom = "2px solid #448899";
    fetch("/api/order?status=historyTrip").then(function(response){  //method:"GET"
        return response.json();  
    }).then(function(data){
        if(data.data == null){
            nohistoryOrderFrame.style.display="flex";
            havehistoryOrderFrame.style.display="none";
        }else{
            const allData = data.data;
            nohistoryOrderFrame.style.display="none";
            havehistoryOrderFrame.style.display="flex";
            haveHistoryOrder.innerHTML="";
            for(i=0; i<allData.length; i++){
                orderHistoryLoad(allData);
            }
        }           
    })
})

goTripButton.addEventListener("click", function(){
    location.href="/";  
})