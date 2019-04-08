import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import Utils from '../../../service/Utils';

export default class searchPage02 extends Component {

  constructor() {
    super();

    this.state = {
      queryDate: "",
      departure_ID: "0990",
      destination_ID: "1070",
      HSRstationID: [],
      HSR_result_Items: [],
      error: "",
      direction: "s"  // s 或 n 
    };

    this.utils = new Utils;

    this.handleChange = this.handleChange.bind(this);
    this.queryHSRtable = this.queryHSRtable.bind(this);
    this.handleDateSelect = this.handleDateSelect.bind(this);
    this.handleSelect1 = this.handleSelect1.bind(this);
    this.handleSelect2 = this.handleSelect2.bind(this);
    this.queryHSRtable = this.queryHSRtable.bind(this);

    this.getHSRstationID();
  }

  handleChange(event) {
    this.state[event.target.id] = event.target.value;

    this.setState(this.state);
  }

  handleDateSelect(event) {
    this.state.queryDate = event.target.value;
  }

  handleSelect1(event) {
    this.state.departure_ID = event.value;
    // this.setState({ departure_ID: event.value });
  }

  handleSelect2(event) {
    this.state.destination_ID = event.value;
    // this.setState({ destination_ID: event.value });
  }

  getHSRstationID() {

    fetch('https://ptx.transportdata.tw/MOTC/v2/Rail/THSR/Station?$top=30&$format=JSON')
      .then((res) => res.json())
      .then((data) => {

        let tempAry = [];
        let i = 0;
        data.forEach(ele => {
          tempAry[i] = {
            value: ele['StationID'],
            label: ele['StationName']['Zh_tw']
          };

          i++;
        });

        this.setState({ HSRstationID: tempAry });

        console.log(data)
      }).catch((err) => {
        this.state.error = err;
        console.log(err);
        this.setState(this.state);
      })
  }

  queryHSRtable() {

    // 判斷 南下北上 (以stationID 相減之正負判斷)
    this.state.direction = (parseInt(this.state.destination_ID) - parseInt(this.state.departure_ID)) < 0 ? "n" : "s";
    this.state.error = "";
    let now = new Date();
    const nowformat = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();

    //由於 /v2/Rail/THSR/AvailableSeatStatusList/ 之結果，並未提供抵達時間，所以我們要呼叫另一個api 取得今日的A站至B站的table1
    //在針對這個table1，把下面另一個api取得的table2，兩個table以車次為關聯性，將車廂是否還有座位的資訊組合進table1

    this.utils.getDailyTimetable(this.state.departure_ID, this.state.destination_ID, nowformat)
      .then((data1) => {

        let table1 = data1;
        console.log(data1);

        this.utils.getDailySeatAvailableTable(this.state.departure_ID)
          .then((data2) => {

            console.log(data2);
            const table2 = data2[0]['AvailableSeats'];

            //過濾掉 不要的direction / 不含訖站的資料 / 標準與商務皆滿座的車廂
            //高鐵定義 北上的direction 是0

            let table2_ = table2.filter((ele) => {
              // let timeCost = this.utils.timeMinusTime(data_['DestinationStopTime']['ArrivalTime'],
              //                              data_['OriginStopTime']['DepartureTime']);
              let findDate = false;

              if ((this.state.direction === 'n' && ele['Direction'] === 1) ||
                (this.state.direction === 's' && ele['Direction'] === 0)) {


                ele['StopStations'].forEach(ele => {

                  if (ele['StationID'] === this.state.destination_ID &&
                    (ele['BusinessSeatStatus'] === "Available" ||
                      ele['StandardSeatStatus'] === "Available")) {

                    //由於沒有提供 到達時間，所以需要打search01 那頁的api，取得table後
                    //以"車次"為兩個table之間的關聯，來combin資料
                    findDate = true;

                  }
                })

              }
              return !!findDate;
            })
            // 篩選過後的 table2
            console.log(table2_);
            // this.setState(this.state);

            // table1 filtered by TrainNo that doesnt show at table2_
            let table1_ = table1.filter(ele1 => {

              let findTrainNo = false;
              table2_.forEach(ele2 => {
                if (ele2['TrainNo'] === ele1['DailyTrainInfo']['TrainNo']) findTrainNo = true;
              })

              return findTrainNo;
            })

            // 加入座位資訊於table1_
            table1_.forEach(ele1 => {

              const table2_ele = table2_.find(ele2 => {
                return ele2['TrainNo'] === ele1['DailyTrainInfo']['TrainNo'];
              })

              let tempAry = table2_ele['StopStations'].find(data => {
                   return data['StationID'] === this.state.destination_ID;
              })
              // 新增參數
              ele1['DailyTrainInfo'].BusinessSeatStatus = tempAry['BusinessSeatStatus'];
              ele1['DailyTrainInfo'].StandardSeatStatus = tempAry['StandardSeatStatus'];
            })

            // 產出 HTML
            this.state.HSR_result_Items = table1_.map(ele1 => {

              let timeCost = this.utils.timeMinusTime(ele1['DestinationStopTime']['ArrivalTime'],
              ele1['OriginStopTime']['DepartureTime']);
              
              return (
                <tr key={ele1['DailyTrainInfo']['TrainNo']}>
                  <td>{ele1['DailyTrainInfo']['TrainNo']}</td>
                  <td>{ele1['OriginStopTime']['DepartureTime']}</td>
                  <td>{ele1['DestinationStopTime']['ArrivalTime']}</td>
                  <td>{timeCost}</td>
                  <td>{ele1['DailyTrainInfo'].StandardSeatStatus}</td>
                  <td>{ele1['DailyTrainInfo'].BusinessSeatStatus}</td>
                </tr>
              )
            })
            
            this.setState(this.state);

          }).catch((err) => {
            this.state.error = err;
            console.log(err);
            this.setState(this.state)
          })

      })



    console.log("query HSR 囉");
    console.log(this.state);
  }


  render() {

    const state = this.state;
    // dropdown list setting , check https://www.npmjs.com/package/react-dropdown
    let defaultOption1 = { value: '0990', label: '南港' };
    let defaultOption2 = { value: '1070', label: '左營' };
    if (!!state.departure_ID) {
      state.HSRstationID.forEach(ele => {
        if (ele['value'] === state.departure_ID) {
          defaultOption1 = ele;
        }
      })
    }

    if (!!state.destination_ID) {
      state.HSRstationID.forEach(ele => {
        if (ele['value'] === state.destination_ID) {
          defaultOption2 = ele;
        }
      })
    }

    return (
      <div className="searchpage02">

        <div className="right-aside-area">

          <form className="form-login" style={{ maxWidth: '40%' }}>
            <div className="form-group">
              <p>今日對號座狀況確認 </p>
            </div>
            <table>
              <tbody>
                <tr>
                  <td>
                    <div className="form-group">
                      <p>起站</p>
                      {/* <input type="text" placeholder="departure" className="form-control input-sm bounceIn animation-delay4" /> */}
                      <Dropdown
                        id="departure_ID"
                        options={state.HSRstationID}
                        onChange={this.handleSelect1}
                        value={defaultOption1}
                        placeholder="Select an departure" />

                    </div>
                  </td>
                  <td>
                    <div className="form-group">
                      <p>迄站</p>
                      {/* <input type="text" placeholder="destination" className="form-control input-sm bounceIn animation-delay4" /> */}
                      <Dropdown
                        id="destination_ID"
                        options={state.HSRstationID}
                        onChange={this.handleSelect2}
                        value={defaultOption2}
                        placeholder="Select an destination" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="form-group">

              <p className="text-danger middle mb-0 mt-5"><small>{state.error}</small></p>
            </div>
            <div className="text-center mt-20">
              <button className="btn btn-login bounceIn animation-delay5 w-75"
                onClick={this.queryHSRtable}
                type="button">查詢</button>
            </div>
          </form>

          <table className="table table-hover" id="responsivetable">
            <thead>
              <tr>

                <th>車次</th>
                <th>出發時間</th>
                <th>到達時間</th>
                <th>行駛時間</th>
                <th>標準座</th>
                <th>商務艙</th>
              </tr>
            </thead>
            <tbody id="tableBody">
            {state.HSR_result_Items}
              {/* <tr>
                <td>自強</td>
                <td>139</td>
                <td>15:00</td>
                <td>20:30</td>
                <td>5時30分</td>
                <td>690 元</td>
              </tr> */}
            </tbody>
          </table>

        </div>

        {this.props.children}
      </div >
    )
  }
}
