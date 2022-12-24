// Part 3 - 3：Select time in the bookingform 
const priceCost=document.querySelector(".priceCost");
const forenoonRadioButton=document.querySelector(".forenoonRadioButton");
const afternoonRadioButton=document.querySelector(".afternoonRadioButton");
forenoonRadioButton.addEventListener("click",function(){
    forenoonRadioButton.style.background= "#448899";
    afternoonRadioButton.style.background= "#FFFFFF";
    priceCost.innerHTML="新台幣 2000元"    
})

afternoonRadioButton.addEventListener("click",function(){
    afternoonRadioButton.style.background= "#448899";
    forenoonRadioButton.style.background= "#FFFFFF";
    priceCost.innerHTML="新台幣 2500元"
})

// Part 3 - 2：Fetch attraction API, get data and display specific attraction information
let path = location.pathname;
let attraction_img;
let slideIndex = 1;
fetch("/api"+path).then(function(response){
    return response.json();
}).then(function(data){
    const attraction_data=data.data;
    attraction_img = attraction_data.images;
    const picture = document.querySelector(".picture");
    picture.innerHTML="<img src="+ attraction_img[0] +">"
    +"<div class='prev' onclick='plusSlides(-1)'></div>"
    +"<div class='next' onclick='plusSlides(+1)'></div>"
    +"<div class='dots'></div>";
    const dots = document.querySelector(".dots");
    for(let i=1;i<attraction_img.length+1;i++){
        dots.innerHTML+="<div class='dot' onclick='changeSlide("+i+")'></div>"
    }
    const dot = document.getElementsByClassName("dot");
    dot[0].style.backgroundColor ="#000000"

    const attraction_name=attraction_data.name;
    const name = document.querySelector(".name");
    name.innerText = attraction_name;

    const attraction_cat = attraction_data.category;
    const attraction_mrt = attraction_data.mrt;
    const information = document.querySelector(".information");
    information.innerText = attraction_cat + " at " + attraction_mrt;

    const attraction_description=attraction_data.description;
    const introduction = document.querySelector(".introduction");
    introduction.innerText = attraction_description;
     
    const attraction_address = attraction_data.address;
    const address = document.querySelector(".addressText");
    address.innerText = attraction_address;

    const attraction_transport = attraction_data.transport; 
    transport = document.querySelector(".transportText");
    transport.innerText = attraction_transport;

    showSlides(slideIndex);
})


// Click the left and right buttons of picture
function plusSlides(n){
  showSlides(slideIndex+=n);
}
// Click the dots of picture
function changeSlide(n){
    showSlides(slideIndex=n);
}
// Part 3 - 5：Create a slideshow/carousel of attraction's picture 
function showSlides(y){
    const slides = attraction_img;
    if(y > slides.length){
        slideIndex = 1;
    }else if(y < 1){
        slideIndex = slides.length;        
    }
    else{
        slideIndex = y;
    }
    const picture = document.querySelector(".picture");
    picture.innerHTML="<img src="+ slides[slideIndex-1] +">"
    +"<div class='prev' onclick='plusSlides(-1)'></div>"
    +"<div class='next' onclick='plusSlides(+1)'></div>"
    +"<div class='dots'></div>";
    const dots = document.querySelector(".dots");
    for(let i=1;i<slides.length+1;i++){
        dots.innerHTML+="<div class='dot' onclick='changeSlide("+i+")'></div>"
    }
    const dot = document.getElementsByClassName("dot");
    dot[slideIndex-1].style.backgroundColor ="#000000" 
}

const today = new Date()
const tomorrow = String(today.getFullYear())+String((today.getMonth()+1))+String((today.getDate()+1))
// Part 5 - 4：Create new booking
const startReserveButton = document.querySelector(".startReserveButton");
const noticeMain= document.querySelector(".noticeMain")
startReserveButton.addEventListener("click",function(){
    fetch("/api/user/auth").then(function(response){    //method:"GET"
        return response.json();
    }).then(function(data){
        if(data.data == null){
            signinWindow.style.display="block";
        }
        else{
            attractionPath=location.pathname.split("/")
            const attractionId=attractionPath[2];
            const date = document.querySelector('input[type="date"]').value;
            const time = document.querySelector('input[name="radio"]:checked');
            const price=priceCost.textContent.replace(/[^\d]/g,"");
            if(date == ""||time == null){
                noticeWindow.style.display="block";
                noticeMain.innerText="未選擇日期或時間"; 
            }else{
                const dateChoose = date.split("-")[0]+date.split("-")[1]+date.split("-")[2];            
                if(dateChoose < tomorrow){
                    noticeWindow.style.display="block";
                    noticeMain.innerText="請選擇今日之後的日期";                     
                }else{
                    const booking = { 
                        "attractionId":attractionId,
                        "date":date,
                        "time":time.value,
                        "price":price
                    }; 
                    fetch("/api/booking",{
                        method:"POST",
                        body:JSON.stringify(booking),
                        cache:"no-cache",
                        headers:new Headers({
                            "content-type":"application/json"
                        })
                    }).then(function(response){    
                        return response.json();
                    }).then(function(data){
                        if(data.ok == true){
                            location.href="/booking";
                        }else{
                            noticeWindow.style.display="block";
                            noticeMain.innerText=data.message; 
                        }
                    })                    
                }
            }
        }
    })
})