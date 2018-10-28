import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TopicsEditor from './TopicsEditor';
import * as serviceWorker from './serviceWorker';

const data = [{
    'name': 'trump',
    'keywords': 'aa',
    'userids': '123,123'
}, {
    'name': 'james',
    'keywords': '#nba,lebrown',
    'userids': '123,123'
}]


// // communication with back-end
// function getTopics(){
//     console.log("Ajex GET ./api/topics");
//     $.ajax({
//         url: "./api/topics",
//         contentType: 'application/json;charset=utf-8',
//         crossDomain: true,
//         data: {},
//         success: function(res){
//             console.log("Success - ", res);
//             for (var i = 0; i < res.length; i++) {
//                 res[i].name = res[i]._id;
//                 if (res[i].keywords != null) {
//                     res[i].keywords = res[i].keywords.join(",");
//                 } else {
//                     res[i].keywords = "";
//                 }
//                 if (res[i].ids != null) {
//                     res[i].ids = res[i].ids.join(",");
//                 } else {
//                     res[i].ids = "";
//                 }
//             }
//             topicslist.topics = res;
//         }
//     });
//
// }
//
// function removeTopic(_id){
//     console.log("Ajax DELETE ./api/topics/" + _id)
//     $.ajax({
//         url: "./api/topics/" + _id,
//         contentType: 'application/json;charset=utf-8',
//         type: "DELETE",
//         crossDomain: true,
//         data: {},
//         success: function(res){
//             console.log("Success -", res);
//         }
//     });
// }
//
// function saveTopic(_id, data){
//     putdata = {
//         '_id': data.name,
//         'keywords': data.keywords.split(","),
//         'ids': data.ids.split(",")
//     }
//     console.log("Ajax PUT ./api/topics/" + _id, putdata)
//     $.ajax({
//         url: "./api/topics/" + _id,
//         contentType: 'application/json',
//         type: "PUT",
//         crossDomain: true,
//         data: JSON.stringify(putdata),
//         dataType: "json",
//         success: function(res){
//             console.log("Success -", res);
//             for (var i = 0; i < data.length; i++) {
//                 data[i]._id = data[i].name;
//             }
//         }
//     });
// }


const submitToServer = (data) => {
    console.log("Submit: " + data);
}


// ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render( <TopicsEditor data={data} submitToServer={submitToServer}/> , document.getElementById('container1'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();