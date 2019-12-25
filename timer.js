function main() {
    let start_btn = document.getElementById("startButton");
    let stop_btn = document.getElementById("stopButton");
    let reset_btn = document.getElementById("resetButton");
    let lap_btn = document.getElementById("lapButton");

    let sec = 0;
    let min = 0;
    let hour = 0;
    let flag = 0;
    let timer_act = false;

    function to_sec(hour, min, sec){
        return sec + min*60 + hour*60*60;
    }

    function from_sec(sec){
        let hour_min_sec = new Array(3);
        let buf = 0
        if (sec >= 3600) {
            hour_min_sec[0] = Math.floor(sec/3600)
            buf = sec%3600
            if (buf >= 60) {
                hour_min_sec[1] = Math.floor(buf/60)
                hour_min_sec[2] = buf%60
            }
            else {
                hour_min_sec[1] = 0
                hour_min_sec[2] = buf
            }
        }
        else{
            hour_min_sec[0] = 0
            hour_min_sec[1] = Math.floor(sec/60)
            hour_min_sec[2] = sec%60
        }
        return hour_min_sec
    }

    function perSecProcess() {
        sec++;
        if (sec >= 59){
            min++;
            sec = 0;
        }
        if (min >= 59){
            hour++;
            min = 0;
        }
        updateDiv(`${( '00' + hour ).slice( -2 )}:${( '00' + min ).slice( -2 )}:${( '00' + sec ).slice( -2 )}`);
    }

    function updateDiv(string) {
        let div = document.getElementById("up_num");
        div.innerText = string;
    }

    function start_timer(){
        if(flag == 0){
            test_timer = setInterval(perSecProcess, 1000);
            timer_act = true
        } 
    }

    let lap_time = document.getElementById("lap_time")
    let buf = []
    let buf_sec = []
    let cnt = 0
    let hour_min_sec = new Array(3)
    
   

    function input_lap(){
        buf_sec[cnt] = to_sec(hour, min, sec)
        var now = new window.Date();
        var Year = String(now.getFullYear());
        var Month = `${('00' + (now.getMonth()+1)).slice(-2)}`;
        var Date = `${('00' + now.getDate()).slice(-2)}`;
        var Hour = `${('00' + now.getHours()).slice(-2)}`;
        var Min = `${('00' + now.getMinutes()).slice(-2)}`;
        var Sec = `${('00' + now.getSeconds()).slice(-2)}`;

        var now_ = Year + '/' + Month + '/' + Date + '-' + Hour + ':' + Min + ':' + Sec



        if(cnt>0) buf.push(`${( '00' + hour ).slice( -2 )}:${( '00' + min ).slice( -2 )}:${( '00' + sec ).slice( -2 )}` + '-----' + `${( '00' + from_sec(buf_sec[cnt]-buf_sec[cnt-1])[0] ).slice( -2 )}:${( '00' + from_sec(buf_sec[cnt]-buf_sec[cnt-1])[1] ).slice( -2 )}:${( '00' + from_sec(buf_sec[cnt]-buf_sec[cnt-1])[2] ).slice( -2 )}` + '-----' + now_)


        else buf.push(`${( '00' + hour ).slice( -2 )}:${( '00' + min ).slice( -2 )}:${( '00' + sec ).slice( -2 )}`+ '-----' + `${( '00' + hour ).slice( -2 )}:${( '00' + min ).slice( -2 )}:${( '00' + sec ).slice( -2 )}` + '-----' + now_)
        var stockList = '';


        for (var i=0; i<buf.length;i++){
            stockList += '<ol>'+ buf[i] + '</ol>';　// = ではなく += を使う
        }
        lap_time.innerHTML = stockList
        cnt += 1
    }

    start_btn.addEventListener("click", function () {
        start_timer()
        flag = 1
    });

    stop_btn.addEventListener("click", function(){
        if(timer_act) clearInterval(test_timer)
        flag = 0
    });

    reset_btn.addEventListener("click", function(){
        if(timer_act) clearInterval(test_timer)
        flag = 0
        sec = 0;
        min = 0;
        buf.length = 0
        cnt = 0
        lap_time.innerHTML = ''
        updateDiv("00:00:00")
    })

    lap_btn.addEventListener("click", function(){
        input_lap()
    })


    let down_start_btn = document.getElementById("down_startButton");
    let down_stop_btn = document.getElementById("down_stopButton");
    let down_reset_btn = document.getElementById("down_resetButton");
    let down_config_btn = document.getElementById("down_configButton");
    
    $("#down-config-popup-ok").on("click", function () {
        let h = $("#output1").text();
        let m = $("#output2").text();
        let s = $("#output3").text();

        down_sec = s;
        down_min = m;
        down_hour = h;

        updateDown(`${( '00' + down_hour ).slice( -2 )}:${( '00' + down_min ).slice( -2 )}:${( '00' + down_sec ).slice( -2 )}`)
        // do something
        togglePopupVisibility();
    });

    let down_sec = 0;
    let down_min = 0;
    let down_hour = 0;
    let down_flag = 0;

    function down_perSecProcess() {
        if (down_hour==0 && down_min==0 && down_sec==0){
            clearInterval(down_test_timer)
            down_flag = 0
            return
        }
        down_sec--;
        if (down_sec < 0){
            down_min--;
            down_sec = 59;
        }
        if (down_min < 0){
            down_hour--;
            down_min = 59;
        }
        
        updateDown(`${( '00' + down_hour ).slice( -2 )}:${( '00' + down_min ).slice( -2 )}:${( '00' + down_sec ).slice( -2 )}`);
    }

    function updateDown(string) {
        let down_div = document.getElementById("down_num");
        down_div.innerText = string;
    }

    function down_start_timer(){
        if(down_flag == 0) down_test_timer = setInterval(down_perSecProcess, 1000);
    }

    down_start_btn.addEventListener("click", function () {
        down_start_timer()
        down_flag = 1
    });

    down_stop_btn.addEventListener("click", function(){
        clearInterval(down_test_timer)
        down_flag = 0
    });

    down_reset_btn.addEventListener("click", function(){
        clearInterval(down_test_timer)
        down_flag = 0
        down_sec = 0;
        down_min = 0;
        updateDown("00:00:00")
    })

    down_config_btn.addEventListener("click", function () {
        togglePopupVisibility();
    });
   
}

function togglePopupVisibility() {
    $("#down-config-popup").toggleClass("hidden");
}

window.addEventListener('load', main)