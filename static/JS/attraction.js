// Part 3 - 3：完成訂購導覽中的時段選擇
const priceCost=document.querySelector(".priceCost");
const forenoonRadioButton=document.querySelector(".forenoonRadioButton");
const afternoonRadioButton=document.querySelector(".afternoonRadioButton");
function forenoonRadio(){
    forenoonRadioButton.style.background= "#448899";
    afternoonRadioButton.style.background= "#FFFFFF";
    priceCost.innerHTML="新台幣 2000元"
}
function afternoonRadio(){
    afternoonRadioButton.style.background= "#448899";
    forenoonRadioButton.style.background= "#FFFFFF";
    priceCost.innerHTML="新台幣 2500元"
}

// Part 3 - 2：串接景點 API，取得並展⽰特定景點資訊
let path = window.location.pathname;
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


// 點擊左右按鈕
function plusSlides(n){
  showSlides(slideIndex+=n);
}
// 點擊圖片下方圓點
function changeSlide(n){
    showSlides(slideIndex=n);
}
// Part 3 - 5：完成景點圖片輪播效果
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