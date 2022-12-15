function attractionsLoad(attractions_img, attractions_name, attractions_mrt, attractions_cat, attractions_id){
    // 新增照片+景點資訊+連結的大div區塊
    // Part 3 - 4：在⾸⾴中加入連結
    const a=document.createElement("a");
    a.setAttribute("href", "/attraction/" + attractions_id); 

    const picSquare=document.createElement("div");
    picSquare.setAttribute("class","pic");
    a.appendChild(picSquare);

    // 1-1.新增照片區塊
    const newpic=document.createElement("img");
    newpic.setAttribute("src",attractions_img);
    picSquare.appendChild(newpic);

    // 1-2.新增name_frame區塊
    const name_frame=document.createElement("div");
    name_frame.setAttribute("class","name_frame");
    picSquare.appendChild(name_frame)
    // 1-2-1.新增name區塊
    const name_box=document.createElement("div");
    name_box.setAttribute("class","name");
    name_frame.appendChild(name_box);
    // 1-2-1-1.新增景點名(放入資料中的景點名稱)
    const name=document.createTextNode(attractions_name);
    name_box.appendChild(name);

    // 1-3.新增information_frame區塊
    const information_frame=document.createElement("div");
    information_frame.setAttribute("class","information_frame");
    picSquare.appendChild(information_frame);
    // 1-3-1.新增information區塊
    const information=document.createElement("div");
    information.setAttribute("class","information");
    information_frame.appendChild(information);
    // 1-3-1-1.新增MRT區塊
    const mrt_box=document.createElement("div");
    mrt_box.setAttribute("class","mrt");
    information.appendChild(mrt_box);
    // 1-3-1-1-1.新增MRT資訊
    const mrt=document.createTextNode(attractions_mrt);
    mrt_box.appendChild(mrt);                    
    // 1-3-1-2.新增CAT分類區塊
    const category_box=document.createElement("div");
    category_box.setAttribute("class","category");
    information.appendChild(category_box);
    // 1-3-1-2-1.新增CAT分類資訊
    const category=document.createTextNode(attractions_cat);
    category_box.appendChild(category);

    const attractions=document.querySelector(".attractions");
    attractions.appendChild(a); 
};
// 全域變數(Part 2-3會需要使用到)
let page=0;
let attractionSearch="";
let isLoading=false;    // 追蹤、記錄目前頁面是否正在載入 API(true 代表正在載入其他 API)

//Part 2-2：串接景點 API，取得並展⽰第⼀⾴的景點資訊
fetch("/api/attractions").then(function(response){
    return response.json();
}).then(function(data){
    const attractions_data=data.data;
    for(let i=0;i<attractions_data.length;i++){
        const attractions_img=attractions_data[i].images[0];
        const attractions_name=attractions_data[i].name;
        const attractions_mrt=attractions_data[i].mrt;
        const attractions_cat=attractions_data[i].category;
        const attractions_id=attractions_data[i].id;
        attractionsLoad(attractions_img, attractions_name, attractions_mrt, attractions_cat, attractions_id);
    }
    const nextPage=data.nextPage;
    if(nextPage!==null){
        page=nextPage;
    }else{
        page=null;
    }
})

// Part 2-4：完成關鍵字搜尋功能
const button=document.querySelector(".button");
button.addEventListener("click",function(){
    attractionSearch = document.getElementById("keyword").value;
    page=0;
    fetch("api/attractions?page="+page+"&keyword="+attractionSearch).then(function(response){
        return response.json();
    }).then(function(data){
        const attractions_data=data.data;
        const attractions=document.querySelector(".attractions");
        attractions.innerHTML="";
        for(let i=0;i<attractions_data.length;i++){
            const attractions_img=attractions_data[i].images[0];
            const attractions_name=attractions_data[i].name;
            const attractions_mrt=attractions_data[i].mrt;
            const attractions_cat=attractions_data[i].category;
            const attractions_id=attractions_data[i].id;
            attractionsLoad(attractions_img, attractions_name, attractions_mrt, attractions_cat, attractions_id);
        }
        // 取得下一頁資料
        const nextPage=data.nextPage;
        if(nextPage!==null){
            page=nextPage;
        }else{
            page=null;
        }
    });    
})

//Part 2-5：完成景點分類關鍵字填入功能
fetch("/api/categories").then(function(response){
    return response.json();
}).then(function(data){
    const attractions_categories=data.data;
    const categorylist=document.querySelector(".categorylist");

    for(let i=0;i<attractions_categories.length;i++){
        const attractions_category=attractions_categories[i];

        const categories=document.createElement("div");
        categories.setAttribute("class","categories");
        const category=document.createTextNode(attractions_category);
        categories.appendChild(category);
        categorylist.appendChild(categories);
    }

})
const categorylist=document.querySelector(".categorylist");
const category = document.getElementsByClassName("categories");
const input = document.querySelector("#keyword");
input.addEventListener("click",function(){
    categorylist.style.display="grid";    
    // 點選景點分類，將景點分類名稱填入搜尋框，隱藏跳出式分類區塊。
    for(let i=0;i<category.length;i++){
        // 點選景點分類，將景點分類名稱填入搜尋框
        category[i].addEventListener("click",function(){
            input.value = this.innerText;
            categorylist.style.display="none"
        })
    }   
})

// *onblur 和 onclick 事件衝突 : 利用 setTimeout 解決(Part 2-5(4))
input.addEventListener("blur",function(){
    setTimeout(function(){
        categorylist.style.display="none";
    },150)
})

// Part 2-3：完成⾃動載入後續⾴⾯的功能(利⽤ IntersectionObserver 物件)
setTimeout(function(){
    const footer = document.querySelector(".footer");
    const options = {
        // root為鏡頭，預設是null，就是整個視窗
        root:null,
        rootMargin: "0px 0px 0px 0px",
        // 指目標本身出現了多少部份在你的鏡頭裡，而出現的部份到了指定的百分比後，都會執行 callback。
        threshold:0.5,
    };

    // 建立觀察器（observer）
    const observer= new IntersectionObserver(callback, options);
    observer.observe(footer);  // 開始觀察目標
    // callback 就是當目標（entry）進入到觀察器的鏡頭（root）內時，要做什麼事的 function
    function callback(entry){
        if(entry[0].isIntersecting){
            // 如果沒有下一頁的話，就不會再去連線取資料
            if (page!==null & isLoading==false){    // 偵測頁面滑到底部，檢查 isLoading，如果是 true 代表正在載入其他 API，先不要動作。若是 false 才動作。
                isLoading=true; // 表示現在開始要呼叫 API 
                fetch("/api/attractions?page="+page+"&keyword="+attractionSearch).then(function(response){
                    return response.json(); 
                }).then(function(data){
                    const attractions_data=data.data;                 
                    for(let i=0;i<attractions_data.length;i++){
                        const attractions_img=attractions_data[i].images[0];
                        const attractions_name=attractions_data[i].name;
                        const attractions_mrt=attractions_data[i].mrt;
                        const attractions_cat=attractions_data[i].category;
                        const attractions_id=attractions_data[i].id;
                        attractionsLoad(attractions_img, attractions_name, attractions_mrt, attractions_cat, attractions_id);
                    }
                    const nextPage=data.nextPage;
                    if(nextPage!==null){
                        page=nextPage;
                    }else{
                        page=null;
                    } 
                    isLoading=false; // fetch() 載入完畢，取得後端回應後，將 isLoading 設定為 false，表示現在沒有在載入 API 
                })
            }
        }
    }
},1000)   