import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import Utils from '../../../service/Utils';

export default class searchPage01 extends Component {

  constructor() {
    super();

    this.state = {
      queryDate: "",
      departure_ID: "0990",
      destination_ID: "1070",
      HSRstationID: [],
      HSR_result_Items: [],
      error: ""
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

  //取得 高鐵車站列表
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

    if(!this.state.queryDate || this.state.queryDate.length === 0){
      this.state.error = "請輸入日期";
      this.setState(this.state);
      return;
    }

    const url = "https://ptx.transportdata.tw/MOTC" + "/v2/Rail/THSR/DailyTimetable/OD/" +
      this.state.departure_ID + "/to/" + this.state.destination_ID + "/" + this.state.queryDate ;

    this.state.error = "";

    fetch(url).then((res) => res.json())
      .then((data) => {

        console.log(data);

        this.state.HSR_result_Items = data.map((data_) => {
            let timeCost = this.utils.timeMinusTime(data_['DestinationStopTime']['ArrivalTime'],
                                         data_['OriginStopTime']['DepartureTime']);

            return (
            <tr key={ data_['DailyTrainInfo']['TrainNo']}>
              <td>{ data_['DailyTrainInfo']['TrainNo']}</td>
              <td>{ data_['OriginStopTime']['DepartureTime']}</td>
              <td>{ data_['DestinationStopTime']['ArrivalTime']}</td>
              <td>{ timeCost }</td>
              <td><a target="_blank" href="https://www.thsrc.com.tw/tw/Article/ArticleContent/743c51ac-124d-4b1a-a57b-1fd820848032">請參考標準價格</a></td>
            </tr>
            )
        })

        this.setState(this.state);

        // console.log(data)
      }).catch((err) => {
      this.state.error = err;
      console.log(err);
      // this.setState(this.state);
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
      <div className="searchpage01">

        <div className="right-aside-area">

          <form className="form-login" style={{ maxWidth: '40%' }}>

            <div className="form-group">
              <p>請選擇 乘車日期 : </p>
              <input type="date"
                id="queryDate"
                min=""
                max=""
                value={state.queryDate}
                onChange={this.handleChange}
                placeholder="searchDate"
                className="form-control input-sm bounceIn animation-delay2" />
            </div>

            <table>
              <tbody>
                <tr>
                  <td>
                    <div className="form-group">
                      <p>起站</p>
                      {/* <input type="text"
                        id="departure_ID"
                        value={state.departure_ID}
                        onChange={this.handleChange}
                        placeholder="departure"
                        className="form-control input-sm bounceIn animation-delay4" /> */}
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
                      {/* <input type="text"
                        id="destination_ID"
                        value={state.destination_ID}
                        onChange={this.handleChange}
                        placeholder="destination"
                        className="form-control input-sm bounceIn animation-delay4" /> */}
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
              {/* <!-- <label class="label-checkbox inline">
                    <input type="checkbox" class="regular-checkbox chk-delete" />
                    <span class="custom-checkbox info bounceIn animation-delay4"></span>
                </label> -->
                <!-- <span class="middle">記住我</span> --> */}
              <p className="text-danger middle mb-0 mt-5"><small>{state.error}</small></p>
            </div>
            <div className="text-center mt-20">
              <button className="btn btn-login bounceIn animation-delay5 w-75" type="button"
                onClick={this.queryHSRtable}>查詢</button>
            </div>
          </form>

          <table className="table table-hover" id="responsivetable">
            <thead>
              <tr>
                <th>車次</th>
                <th>出發時間</th>
                <th>到達時間</th>
                <th>行駛時間</th>
                <th>票價</th>
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
