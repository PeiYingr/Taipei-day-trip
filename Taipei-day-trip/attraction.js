function forenoonRadio(elem){
    elem.style.background= "#448899";
    let priceCost=document.querySelector(".priceCost");
    priceCost.innerHTML="新台幣 2000元"
}

function afternoonRadio(elem){
    elem.style.background= "#448899";
    let priceCost=document.querySelector(".priceCost");
    priceCost.innerHTML="新台幣 2500元"
}

function whiteColor(elem){
    elem.style.background= "#FFFFFF";
    let priceCost=document.querySelector(".priceCost");
    priceCost.innerHTML=""
}

// Part 3 - 2：串接景點 API，取得並展⽰特定景點資訊
let path = window.location.pathname;
let attraction_img;
fetch("/api"+path).then(function(response){
    return response.json();
}).then(function(data){
    let attraction_data=data.data;
    attraction_img = attraction_data.images;

    let attraction_name=attraction_data.name;
    let name = document.querySelector(".name");
    name.innerText = attraction_name;

    let attraction_cat = attraction_data.category;
    let attraction_mrt = attraction_data.mrt;
    let information = document.querySelector(".information");
    information.innerText = attraction_cat + " at " + attraction_mrt;

    let attraction_description=attraction_data.description;
    let introduction = document.querySelector(".introduction");
    introduction.innerText = attraction_description;
     
    let attraction_address = attraction_data.address;
    let address = document.querySelector(".addressText");
    address.innerText = attraction_address;

    let attraction_transport = attraction_data.transport; 
    transport = document.querySelector(".transportText");
    transport.innerText = attraction_transport;
})

let slideIndex = 1;
setTimeout(function(){
    showSlides(slideIndex);
},50);

// 點擊左右按鈕
function plusSlides(n) {
  showSlides(slideIndex+=n);
}
// 點擊圖片下方圓點
function changeSlide(n) {
    showSlides(slideIndex=n);
  }
//
function showSlides(y) {
    let slides = attraction_img;
    if(y > slides.length){
        slideIndex = 1;
    }else if(y < 1){
        slideIndex = slides.length;        
    }
    else{
        slideIndex = y;
    }
    let picture = document.querySelector(".picture");
    picture.innerHTML="<img src="+ slides[slideIndex-1] +">"
    +"<div class='prev' onclick='plusSlides(-1)'></div>"
    +"<div class='next' onclick='plusSlides(+1)'></div>"
    +"<div class='dots'></div>";
    let dots = document.querySelector(".dots");
    for(let i=1;i<slides.length+1;i++){
        dots.innerHTML+="<div class='dot' onclick='changeSlide("+i+")'></div>"
    }
    let dot = document.getElementsByClassName("dot");
    dot[slideIndex-1].style.backgroundColor ="#000000"
  }