const noReservation = document.querySelector(".noReservation")
const afterfooter = document.querySelector(".afterfooter")
const showReservation = document.querySelector(".showReservation")
const headline = document.querySelector(".headline")
const picture = document.querySelector(".picture")
const attractionName = document.querySelector(".attractionName")
const date = document.querySelector(".date")
const time = document.querySelector(".time")
const price = document.querySelector(".price")
const address = document.querySelector(".address")
const nameInput = document.querySelector(".name")
const emailInput = document.querySelector(".email")
const phoneInput = document.querySelector(".phone")
const totalPrice = document.querySelector(".totalPrice")
const deleteIcon = document.querySelector(".deleteIcon")
const noticeMain= document.querySelector(".noticeMain")
const cardResult = document.querySelector(".cardResult")
const expiryResult = document.querySelector(".expiryResult")
const cvvResult = document.querySelector(".cvvResult")
let username;
let useremail;
let orderInformation;

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
        headline.innerHTML = "您好，"+ username +"，待預定的行程如下："
        fetch("/api/booking").then(function(response){  //method:"GET"
            return response.json();  
        }).then(function(data){
            if(data.data == null){
                return;
            }else{
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
                orderInformation = data.data;                  
            }           
        })
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

// # TPDirect.setupSDK(appID, appKey, serverType)
TPDirect.setupSDK(126942, 'app_Kfg1tZnSONbdOklCt72PK5QVLlQjnDSmyVPYmbn8wPVtDRa9QitsHKmpz1sO', 'sandbox')

// Display ccv field
let fields = {
    number: {
        // css selector
        element: '#card-number',
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        // DOM object
        element: document.getElementById('card-expiration-date'),
        placeholder: 'MM / YY'
    },
    ccv: {
        element: '#card-ccv',
        placeholder: 'ccv'
    }
}
// # TPDirect.card.setup(config)
TPDirect.card.setup({
    fields: fields,
    styles: {
        // Style all elements
        'input': {
            'color': 'gray'
        },
        // Styling ccv field
        'input.ccv': {
            // 'font-size': '16px'
        },
        // Styling expiration-date field
        'input.expiration-date': {
            // 'font-size': '16px'
        },
        // Styling card-number field
        'input.card-number': {
            // 'font-size': '16px'
        },
        // style focus state
        ':focus': {
            // 'color': 'black'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    },
    // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
        beginIndex: 6,
        endIndex: 11
    }
})
// # TPDirect.card.onUpdate(callback)
TPDirect.card.onUpdate(function (update) {
    // update.canGetPrime === true
    // --> you can call TPDirect.card.getPrime()
    if (update.canGetPrime) {
        // Enable submit Button to get prime.
        // submitButton.removeAttribute('disabled')
    } else {
        // Disable submit Button to get prime.
        // submitButton.setAttribute('disabled', true)
    }
                                            
    // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unknown']
    if (update.cardType === 'visa') {
        // Handle card type visa.
    }

    if (update.status.number === 2) {
        // setNumberFormGroupToError()
        cardResult.textContent="✘"
        cardResult.style.color="#FF0000"
    } else if (update.status.number === 0) {
        // setNumberFormGroupToSuccess()
        cardResult.textContent="✔"
        cardResult.style.color="#008000"
    }    
    if (update.status.expiry === 2) {
        // setNumberFormGroupToError()
        expiryResult.textContent="✘"
        expiryResult.style.color="#FF0000"
    } else if (update.status.expiry === 0) {
        // setNumberFormGroupToSuccess()
        expiryResult.textContent="✔"
        expiryResult.style.color="#008000"
    }   
    if (update.status.ccv === 2) {
        // setNumberFormGroupToError()
        cvvResult.textContent="✘"
        cvvResult.style.color="#FF0000"
    } else if (update.status.ccv === 0) {
        // setNumberFormGroupToSuccess()
        cvvResult.textContent="✔"
        cvvResult.style.color="#008000"
    }
})
// # Get Prime : TPDirect.card.getPrime(callback)
// call TPDirect.card.getPrime when user submit form to get tappay prime
// $('form').on('submit', onSubmit)
const bookingButton = document.querySelector(".bookingButton")
bookingButton.addEventListener("click",function(event) {
    event.preventDefault()
    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()

    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
        // alert('can not get prime')
        return
    }
    // Get prime
    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
            noticeWindow.style.display="block";
            noticeMain.innerText="信用卡資訊填寫錯誤"; 
            // alert('get prime error ' + result.msg)
            // return
        }
        // alert('get prime 成功，prime: ' + result.card.prime)
        // send prime to your server, to pay with Pay by Prime API .
        if(nameInput.value == "" || emailInput.value == ""|| phoneInput.value == ""){
            noticeWindow.style.display="block";
            noticeMain.innerText="聯絡資訊填寫不完全"; 
        }else{
            const newOrder ={
                "prime": result.card.prime,
                "order": {
                    "price": orderInformation.price,
                    "trip": {
                    "attraction": {
                    "id": orderInformation.attraction.id,
                    "name": orderInformation.attraction.name,
                    "address":  orderInformation.attraction.address,
                    "image": orderInformation.attraction.image
                    },
                    "date": orderInformation.date,
                    "time": orderInformation.time
                },
                    "contact": {
                    "name": nameInput.value,
                    "email": emailInput.value,
                    "phone": phoneInput.value
                    }
                }
            }
            fetch("/api/order",{
                method:"POST",
                body:JSON.stringify(newOrder),
                cache:"no-cache",
                headers:new Headers({
                    "content-type":"application/json"
                })
            }).then(function(response){
                return response.json();  
            }).then(function(data){
                if(data.error == true){
                    noticeWindow.style.display="block";
                    noticeMain.innerText=data.message; 
                }else{
                    orderNumber = data.data.number;
                    location.href="/thankyou?number=" + orderNumber;
                }        
            })
        }
    })
})
