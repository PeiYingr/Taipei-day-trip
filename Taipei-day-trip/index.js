function attractionsLoad(attractions_img, attractions_name, attractions_mrt, attractions_cat){
            // 新增照片+景點資訊的大div區塊
            let picSquare=document.createElement("div");
            picSquare.setAttribute("class","pic");
            // 1-1.新增照片區塊
            let newpic=document.createElement("img");
            newpic.setAttribute("src",attractions_img);
            picSquare.appendChild(newpic);
    
            // 1-2.新增name_frame區塊
            let name_frame=document.createElement("div");
            name_frame.setAttribute("class","name_frame");
            picSquare.appendChild(name_frame)
            // 1-2-1.新增name區塊
            let name_box=document.createElement("div");
            name_box.setAttribute("class","name");
            name_frame.appendChild(name_box);
            // 1-2-1-1.新增景點名(放入資料中的景點名稱)
            let name=document.createTextNode(attractions_name);
            name_box.appendChild(name);
    
            // 1-3.新增information_frame區塊
            let information_frame=document.createElement("div");
            information_frame.setAttribute("class","information_frame");
            picSquare.appendChild(information_frame);
            // 1-3-1.新增information區塊
            let information=document.createElement("div");
            information.setAttribute("class","information");
            information_frame.appendChild(information);
            // 1-3-1-1.新增MRT區塊
            let mrt_box=document.createElement("div");
            mrt_box.setAttribute("class","mrt");
            information.appendChild(mrt_box);
            // 1-3-1-1-1.新增MRT資訊
            let mrt=document.createTextNode(attractions_mrt);
            mrt_box.appendChild(mrt);                    
            // 1-3-1-2.新增CAT分類區塊
            let category_box=document.createElement("div");
            category_box.setAttribute("class","category");
            information.appendChild(category_box);
            // 1-3-1-2-1.新增CAT分類資訊
            let category=document.createTextNode(attractions_cat);
            category_box.appendChild(category);
    
            let attractions=document.querySelector(".attractions");
            attractions.appendChild(picSquare); 
};
// 全域變數(Part 2-3會需要使用到)
let page=0;
let attractionSearch="";
let isLoading=false;    // 追蹤、記錄目前頁面是否正在載入 API(true 代表正在載入其他 API)

//Part 2-2：串接景點 API，取得並展⽰第⼀⾴的景點資訊
fetch("/api/attractions").then(function(response){
    return response.json();
}).then(function(data){
    let attractions_data=data.data;
    for(let i=0;i<attractions_data.length;i++){
        let attractions_img=attractions_data[i].images[0];
        let attractions_name=attractions_data[i].name;
        let attractions_mrt=attractions_data[i].mrt;
        let attractions_cat=attractions_data[i].category;
        attractionsLoad(attractions_img, attractions_name, attractions_mrt, attractions_cat);
    }

    let nextPage=data.nextPage;
    if(nextPage!==null){
        page=nextPage;
    }else{
        page=null;
    }
})

// Part 2-4：完成關鍵字搜尋功能
function getData(){
    attractionSearch = document.getElementById("keyword").value;
    page=0;
    fetch("api/attractions?page="+page+"&keyword="+attractionSearch).then(function(response){
        return response.json();
    }).then(function(data){
        let attractions_data=data.data;
        let attractions=document.querySelector(".attractions");
        attractions.innerHTML="";
        for(let i=0;i<attractions_data.length;i++){
            let attractions_img=attractions_data[i].images[0];
            let attractions_name=attractions_data[i].name;
            let attractions_mrt=attractions_data[i].mrt;
            let attractions_cat=attractions_data[i].category;
            attractionsLoad(attractions_img, attractions_name, attractions_mrt, attractions_cat);
        }
        // 取得下一頁資料
        let nextPage=data.nextPage;
        if(nextPage!==null){
            page=nextPage;
        }else{
            page=null;
        }
    });
}

//Part 2-5：完成景點分類關鍵字填入功能
fetch("/api/categories").then(function(response){
    return response.json();
}).then(function(data){
    let attractions_categories=data.data;
    let categorylist=document.querySelector(".categorylist");

    for(let i=0;i<attractions_categories.length;i++){
        let attractions_category=attractions_categories[i];

        let categories=document.createElement("div");
        categories.setAttribute("class","categories");
        let category=document.createTextNode(attractions_category);
        categories.appendChild(category);
        categorylist.appendChild(categories);
    }

})

function showCategory(){
    let categorylist=document.querySelector(".categorylist");
    categorylist.style.display="grid";
    
    // 點選景點分類，將景點分類名稱填入搜尋框，隱藏跳出式分類區塊。
    let category = document.getElementsByClassName("categories");
    let input = document.querySelector("#keyword");
    for(let i=0;i<category.length;i++){
        // 點選景點分類，將景點分類名稱填入搜尋框
        category[i].onclick=function(){
            input.value = this.innerText;
            categorylist.style.display="none"
        }
    }
}

// *onblur 和 onclick 事件衝突 : 利用 setTimeout 解決(Part 2-5(4))
function hideCategory(){
    setTimeout(function(){
        let categorylist=document.querySelector(".categorylist");
        categorylist.style.display="none";
    },150)
}

// Part 2-3：完成⾃動載入後續⾴⾯的功能
setTimeout(function(){
    let footer = document.querySelector(".footer");
    let options = {
        // root為鏡頭，預設是null，就是整個視窗
        root:null,
        rootMargin: "0px 0px 0px 0px",
        // 指目標本身出現了多少部份在你的鏡頭裡，而出現的部份到了指定的百分比後，都會執行 callback。
        threshold:0.5,
    };

    // 建立觀察器（observer）
    let observer= new IntersectionObserver(callback, options);
    // callback 就是當目標（entry）進入到觀察器的鏡頭（root）內時，要做什麼事的 function
    function callback(entry){
        if(entry[0].isIntersecting){
            // 如果沒有下一頁的話，就不會再去連線取資料
            if (page!==null & isLoading==false){    // 偵測頁面滑到底部，檢查 isLoading，如果是 true 代表正在載入其他 API，先不要動作。若是 false 才動作。
                isLoading=true; // 表示現在開始要呼叫 API 
                fetch("/api/attractions?page="+page+"&keyword="+attractionSearch).then(function(response){
                    return response.json(); 
                }).then(function(data){
                    let attractions_data=data.data;                 
                    for(let i=0;i<attractions_data.length;i++){
                        let attractions_img=attractions_data[i].images[0];
                        let attractions_name=attractions_data[i].name;
                        let attractions_mrt=attractions_data[i].mrt;
                        let attractions_cat=attractions_data[i].category;
                        attractionsLoad(attractions_img, attractions_name, attractions_mrt, attractions_cat);
                    }
                    let nextPage=data.nextPage;
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
    observer.observe(footer);  // 開始觀察目標
},1000)   
