
export default class Utils {

    getDailyTimetable(departure_ID, destination_ID, queryDate) {

        const url = "https://ptx.transportdata.tw/MOTC" + "/v2/Rail/THSR/DailyTimetable/OD/" +
            departure_ID + "/to/" + destination_ID + "/" + queryDate;

        return fetch(url).then((res) => res.json());
    }

    getDailySeatAvailableTable(departure_ID) {

        const url = "https://ptx.transportdata.tw/MOTC" + 
                "/v2/Rail/THSR/AvailableSeatStatusList/" + departure_ID ;// 輸入的是 起站

        return fetch(url).then((res) => res.json());
    }

    timeMinusTime(date1, date2) {

        let time1 = date1.split(':'); // "10:35"  -> ["10","35"]
        let time2 = date2.split(':');

        let minutes_ = parseInt(time1[1]) - parseInt(time2[1]);
        let hours_ = parseInt(time1[0]) - parseInt(time2[0]);

        if (minutes_ < 0) {
            hours_ = hours_ - 1;
            minutes_ = minutes_ + 60;
        }

        const result = hours_ + "小時 " + minutes_ + "分";

        return result;
    }

    dhm(t) {
        var cd = 24 * 60 * 60 * 1000,
            ch = 60 * 60 * 1000,
            d = Math.floor(t / cd),
            h = Math.floor((t - d * cd) / ch),
            m = Math.round((t - d * cd - h * ch) / 60000),
            pad = function (n) { return n < 10 ? '0' + n : n; };
        if (m === 60) {
            h++;
            m = 0;
        }
        if (h === 24) {
            d++;
            h = 0;
        }
        return [d, pad(h), pad(m)].join(':');
    }

}