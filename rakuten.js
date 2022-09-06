var today=new Date();
var year=today.getFullYear();
var month=String(today.getMonth()+1).length==2?today.getMonth()+1:'0'+`${today.getMonth()+1}`;
var day=String(today.getDate()).length==2?today.getDate():'0'+today.getDate();
var hour=String(today.getHours()).length==2?today.getHours():'0'+today.getHours();
var min=String(today.getMinutes()).length==2?today.getMinutes():'0'+today.getMinutes();
var second=String(today.getSeconds()).length==2?today.getSeconds():'0'+today.getSeconds();
var formatted=year+'-'+month+'-'+day;


var hotelList={"イーホテル東新宿":72086,
                "相鉄フレッサイン東新宿駅前":72001,
                "アパホテル〈東新宿駅前〉":138038,
                "アパホテル〈東新宿　歌舞伎町〉":147545,
                "アパホテル〈東新宿　歌舞伎町東〉":160689,
                "アパホテル〈東新宿　歌舞伎町タワー〉（２０２０年１１月開業）":149094,
                "ヴィアイン新宿（ＪＲ西日本グループ）":130006,
                "ホテル　サンライト新宿":1026,
};

var time=hour+":"+min+":"+second;
var searchdate=document.getElementById("searchdate");
searchdate.value=formatted;
searchdate.setAttribute("min",formatted);
document.getElementById("searchtime").innerText=formatted+" "+time;


const mainBlock=document.querySelector('.result');

var applicationId=''; //add your applicationId
function searchHotel(hotelId,CI,CO){
    var url='https://app.rakuten.co.jp/services/api/Travel/VacantHotelSearch/20170426?applicationId='+`${applicationId}`+'&format=json&&formatVersion=2&hotelNo='
    +`${hotelId}`+'&checkinDate='+`${CI}`+'&checkoutDate='+`${CO}`+'&adultNum=1&roomNum=1&allReturnFlag&sort=+roomCharge';

    fetch(url)
    .then((response) => {
        return response.json()　//ここでBodyからJSONを返す
    })
    .then((res) => {
        Result(res);  //取得したJSONデータを関数に渡す 
    })
    .catch((e) => {
        create_result_block("No Result","N/A");  
    })

    //get the plan and price  
    function Result(res){
        let data=res.hotels[0];

        for (i=1;i<data.length;i++){
            var plan=data[i].roomInfo[0].roomBasicInfo.planName;
            var price=data[i].roomInfo[1].dailyCharge.rakutenCharge;
            
            create_result_block(plan,price)
        };
        return true;
        }
    };

// Calculate tomorrow's date
function tmrCalculate(ciDate){
    let target=new Date(ciDate);
    var year=target.getFullYear();
    var month=String(target.getMonth()+1).length==2?target.getMonth()+1:'0'+`${target.getMonth()+1}`;
    var day=String(target.getDate()).length==2?target.getDate():'0'+target.getDate();

    // tmr date
    var tmr=String(target.getDate()).length==2?target.getDate()+1:'0'+`${target.getDate()+1}`;

    // next month
    eomonth=new Date(year, month, 0).getDate();
    if (day==eomonth){
        tmr='01';
        month=String(target.getMonth()+2).length==2?target.getMonth()+2:'0'+`${target.getMonth()+2}`;
        if(month>12){
            month='01';
            year++;
        };
    }
    return formatted_tmr=year+'-'+month+'-'+tmr;
};

// Manually Search
function manualSearch(){
    mainBlock.innerHTML=""
    let ciDate=searchdate.value;
    loop(ciDate,tmrCalculate(ciDate));
}

// Create result block
function create_result_block(plan,price){
    var container= document.createElement('div');
    container.classList.add("bg-gray-50");
    container.classList.add("px-4");
    container.classList.add("py-5");
    container.classList.add("sm:grid");
    container.classList.add("sm:grid-cols-3");
    container.classList.add("sm:gap-4");
    container.classList.add("sm:px-6");

    var planName=document.createElement('div');
    planName.innerHTML=plan;
    planName.classList.add("text-sm");
    planName.classList.add("font-medium");
    planName.classList.add("text-gray-500");

    var planPrice=document.createElement('p');
    planPrice.innerHTML=price;
    planPrice.classList.add("mt-1");
    planPrice.classList.add("text-sm");
    planPrice.classList.add("text-gray-900");
    planPrice.classList.add("sm:col-span-2");
    planPrice.classList.add("sm:mt-0");

    container.appendChild(planName);
    container.appendChild(planPrice);

    mainBlock.appendChild(container);
}

// loop for different hotel to get result
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const loop = async (CI,CO) => {
    for (let key in hotelList){
        // hotel name
        var result=document.createElement("h3");
        result.classList.add("hotelname");
        result.classList.add("border-t");
        result.classList.add("border-gray-200");
        result.id=hotelList[key];
        result.innerText=key;
        mainBlock.appendChild(result);

        searchHotel(hotelList[key],CI,CO);
        await wait(1000);
  }
}
loop(formatted,tmrCalculate(formatted))
