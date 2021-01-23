import Hoek from 'hoek'
import Joi from 'joi';
import Helpers from '../../helpers'
import _ from 'lodash';
import Users from '../../models/users';
import Booking from '../../models/booking';

let defaults = {};
/**
Api to update status outOfWork. 
  **/
const handler = async (request, reply) => {
    try {
        const id = _.get(request, 'payload.barberId', '');
        const data = await Users.findOne({
            _id: id
        }, {
            myOpeningHoursArray: 1
        });
        // console.log(data);
        if (data) {
            var OpeningHours = data.myOpeningHoursArray
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            var months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December')
            var curMonth = months[today.getMonth()]
            var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            var lastDate = String(lastDay.getDate()).padStart(2, '0')
            // var lastDate1 = String(lastDay.getDate()+1).padStart(2, '0')

            // console.log(lastDate1);
            var weekday = new Array(7);
            weekday[0] = "Sunday";
            weekday[1] = "Monday";
            weekday[2] = "Tuesday";
            weekday[3] = "Wednesday";
            weekday[4] = "Thursday";
            weekday[5] = "Friday";
            weekday[6] = "Saturday";
            var dateArray = [];
            var count = 0;
            var k = dd;
            for (var i = dd; i <= lastDate; i++) {
                // console.log(typeof(i),"======",i)
                
                   // console.log("ssssssss=>>>>>>>>>>",'"'+i+'"ssss=.>>>>>',typeof(i));
                
                   var checkss = await Helpers.checkData(i)
                   // console.log(checkss,"-------------",i)
                   if(checkss){

                   }else{
                    if(i<10){
                    var i = "0" + i;                         
                    }
                   }                  
                // }
                var newDate = curMonth + " " + i + "," + yyyy;
                var datee = new Date(newDate);
                var day = weekday[datee.getDay()]
                for (var j = 0; j < OpeningHours.length; j++) {
                    var dayName = OpeningHours[j].dayName;
                    var status = OpeningHours[j].status;
                    // console.log("Wednesday",dayName)
                    if (dayName == day) {
                        // console.log('enter')
                        var dayStaus = status;
                        if (dayStaus == 'closed' || dayStaus == "Closed") {
                            var data = {
                                date: newDate,
                                day: day,
                                dayStaus: dayStaus,
                                timesInBetween: []
                            }
                        } else {
                            var startTime = OpeningHours[j].startTime;
                            var endTime = OpeningHours[j].endTime
                            var data = {
                                date: newDate,
                                day: day,
                                dayStaus: dayStaus,
                                startTime: startTime,
                                endTime: endTime,
                                timesInBetween: []
                            }
                        }
                        dateArray.push(data);

                    }
                }
                count++;
                k++;
                if (count == 20) {
                    // console.log('enter')
                    break;
                }
                // console.log(parseInt(lastDate)+1)
                var lll = parseInt(lastDate) + 1
                if (k == lll) {
                    var curMonth = months[today.getMonth() + 1];
                    var ii = "0";
                    var i = String(ii).padStart(2, '0');
                    var lastDay = new Date(today.getFullYear(), today.getMonth() + 2, 0);
                    var lastDate = String(lastDay.getDate()).padStart(2, '0')
                    // if(lastDate==30||lastDate==31){
                    //     i--;
                    // }
                }
            }


            // console.log("length",dateArray.length); 
            var newDataArray = [];
            // console.log("length",dateArray.length)
            for (var i = 0; i < dateArray.length; i++) {
                if (dateArray[i].startTime != "" && dateArray[i].startTime != undefined && dateArray[i].endTime != "" && dateArray[i].endTime != undefined) {
                    var start = dateArray[i].startTime
                    var end = dateArray[i].endTime
                    // console.log( "starttime",dateArray[i].startTime)
                    // returnTimesInBetween(start, end) {
                    var timesInBetween = [];
                    var startH = parseInt(start.split(":")[0]);
                    var startM = parseInt(start.split(":")[1]);
                    var endH = parseInt(end.split(":")[0]);
                    var endM = parseInt(end.split(":")[1]);
                    // console.log('ssf',startH);
                    // console.log(endH)
                    if (startM == 30)                   
                        startH++;
                    for (var j = startH; j < endH; j++) {
                        var a = j < 10 ? "0" + j + ":00" : j + ":00";
                        var b = j < 10 ? "0" + j + ":30" : j + ":30";
                        var f = j < 10 ? "0" + j + ":30" : j + ":30";
                        var g = (j + 1) < 10 ? "0" + (j + 1) + ":00" : (j + 1) + ":00";
                       
                        if (a < "12:00") {
                            var d = "AM"
                        } else {
                            var d = "PM"
                        }
                        if (b < "12:00") {
                            var e = "AM"
                        } else {
                            var e = "PM"
                        }
                        if (f < "12:00") {
                            var l = "AM"
                        } else {
                            var l = "PM"
                        }
                        if (g < "12:00") {
                            var k = "AM"
                        } else {
                            var k = "PM"
                        }
                        var c = a + " " + d + " - " + b + " " + e;
                        var h = f + " " + l + " - " + g + " " + k;

                        //     var cc={
                        //         name:c,
                        //         isCheck:false
                        //     }
                        //     var dd={
                        //         name:h,
                        //         isCheck:false
                        //     }
                        //     timesInBetween.push(cc);
                        //     timesInBetween.push(dd);
                        // }
                         var dateee=new Date();
                            var dadd=String(dateee.getDate()).padStart(2, '0');
                            var monthss=String(dateee.getMonth() + 1).padStart(2, '0');
                            var year=dateee.getFullYear();
                            var timee=dateee.getHours();
                            // console.log(timee);
                            var timee=timee+6;
                            // console.log(timee)
                            if(timee>24){
                                var time="0"+1;
                            }else{
                                var time=timee;
                            }
                            var time1=dateee.getMinutes();
                        var monthss = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December')
                            var curMonth1 = monthss[dateee.getMonth()]
                            var tt=curMonth1+" "+dadd+","+year;
                            // var timee=timee+":"+time1;
                        var BookingData1 = await Booking.findOne({
                            $and: [{
                                barberId: id
                            }, {
                                date: dateArray[i].date
                            }, {
                                time: c
                            }]
                        });
                        if (BookingData1) {
                        } else {
                            if(tt==dateArray[i].date){
                                var startH1 = parseInt(c.split(":")[0]);
                                   // console.log("start",startH1);
                                   // console.log('time',timee)
                                    if((timee+1)>startH1){
                         // var cc = {
                         //        name: c,
                         //        isCheck: false
                         //    }
                         //    timesInBetween.push(cc);
                            
                                }else{
                            var cc = {
                                name: c,
                                isCheck: false
                            }
                            timesInBetween.push(cc);
                            }
                            }else{
                            var cc = {
                                name: c,
                                isCheck: false
                            }
                            timesInBetween.push(cc);
                            }
                        }
                        var BookingData2 = await Booking.findOne({
                            $and: [{
                                barberId: id
                            }, {
                                date: dateArray[i].date
                            }, {
                                time: h
                            }]
                        });
                        if (BookingData2) {
                        } else {
                            if(tt==dateArray[i].date){  
                                var startH1 = parseInt(h.split(":")[0]);
                                     if((timee+1)>startH1){
                         // var cc = {
                         //        name: c,
                         //        isCheck: false
                         //    }
                         //    timesInBetween.push(cc);
                            
                                }else{
                            var dd = {
                                name: h,
                                isCheck: false
                            }
                            timesInBetween.push(dd);                                
                            }
                            }else{
                            var dd = {
                                name: h,
                                isCheck: false
                            }
                            timesInBetween.push(dd);                                
                            }
                        }
                    }
                    // timesInBetween.push(endH + ":00" + e);
                    if (endM == 30) {
                        var ddd = {
                            name: endH + ":30" + e,
                            isCheck: false
                        }
                        timesInBetween.push(ddd)
                    }
                    // var dateData= timesInBetween.map(getGenTime);

                    // console.log("date",dateArray[i].date)
                    // }
                        // console.log(timesInBetween)
                                                        
                    var data1 = {
                        date: dateArray[i].date,
                        day: dateArray[i].day,
                        dayStaus: dateArray[i].dayStaus,
                        startTime: dateArray[i].startTime,
                        endTime: dateArray[i].endTime,
                        timesInBetween: timesInBetween
                    }
                    // dateArray[i].startTime=timesInBetween
                    newDataArray.push(data1);
                } else {
                    var data1 = {
                        date: dateArray[i].date,
                        day: dateArray[i].day,
                        dayStaus: dateArray[i].dayStaus,
                        startTime: "",
                        endTime: "",
                        timesInBetween: []
                    }
                    // dateArray[i].timesInBetween=[]
                    newDataArray.push(data1);
                }
            }
            return reply({
                status: true,
                message: "Get All Time Slot.",
                data: newDataArray
            })
        }
    } catch (error) {
        console.log(error.message);
        return reply({
            status: false,
            message: error.message,
            data: {}
        })
    }
}

const routeConfig = {
    method: 'POST',
    path: '/customerUser/getTimeSlot',
    config: {
        // auth:'jwt',
        tags: ['api', 'users'],
        description: 'Get All timing',
        notes: ['On success'],
        validate: {
            payload: {
                barberId: Joi.string().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}