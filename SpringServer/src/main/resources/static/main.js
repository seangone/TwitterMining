// data declaraction
topic1 = {
    'name': 'trump',
    'keywords': ['#trump', 'aa'],
    'userids': [123,123]
}
p1 = {
    'label': 'Topic Name',
    'text': '[\'#trump\']',
    'inboxtext': '[\'#trump\']'
}

// define components
var CompTopicEdit = {
    props: ['topic'],
    template: 
      '<div class="row mb-3">'
    + '<div class="input-group">'
    + '  <div class="input-group-prepend">'
    + '    <label class="input-group-text">Name</label>'
    + '  </div>'
    + '  <input type="text" class="form-control" placeholder="Name" v-model="topic.name">'
    + '  <div class="input-group-append">'
    + '    <button class="btn btn-outline-danger" type="button" v-on:click="$emit(\'remove\')">Remove</button>'
    + '  </div>'
    + '  <div class="input-group-append">'
    + '    <button class="btn btn-outline-secondary" type="button" v-on:click="$emit(\'save\')">Save</button>'
    + '  </div>'
    + '</div>'
    + '<div class="input-group">'
    + '  <div class="input-group-prepend">'
    + '    <label class="input-group-text">Keywords</label>'
    + '  </div>'
    + '  <input type="text" class="form-control" placeholder="Keywords" aria-label="Keywords" v-model="topic.keywords">'
    + '</div>'
    + '<div class="input-group">'
    + '  <div class="input-group-prepend">'
    + '    <label class="input-group-text">UserIds</label>'
    + '  </div>'
    + '  <input type="text" class="form-control" placeholder="UserIds" aria-label="UserIds" v-model="topic.ids">'
    + '</div>'
    + '</div>'
}

var CompTopics = {
    props: ['topics'],
    components: {'comp': CompTopicEdit},
    template: 
      '<div>'
    + '<comp v-for="(t, index) in topics" '
    + 'v-bind:key="t._id" v-bind:topic="t" '
    + 'v-on:remove="remove(index)" v-on:save="save(index)">'
    + '</comp>'
    + '</div>',
    methods: {
        remove: function(index) {
            var r = window.confirm('Are you sure to remove ' + this.topics[index]._id + '?');
            if (r == true) {
                removeTopic(this.topics[index]._id)
                this.topics.splice(index, 1);
            }
        },
        save: function(index) {
            saveTopic(this.topics[index]._id, this.topics[index])
        }
    }
}

// instanialate new components
var topicslist = new Vue({
    el: "#topicmanager",
    components: {'comp': CompTopics},
    template: '<comp id="topicmanager" :topics="topics"></comp>',
    data: {'topics': []}
});

// communication with back-end
function getTopics(){
    console.log("Ajex GET ./api/topics");
    $.ajax({
        url: "./api/topics",
        contentType: 'application/json;charset=utf-8',
        crossDomain: true,
        data: {},
        success: function(res){
            console.log("Success - ", res);
            for (var i = 0; i < res.length; i++) {
                res[i].name = res[i]._id;
                if (res[i].keywords != null) {
                    res[i].keywords = res[i].keywords.join(",");
                } else {
                    res[i].keywords = "";
                }
                if (res[i].ids != null) {
                    res[i].ids = res[i].ids.join(",");
                } else {
                    res[i].ids = "";
                }
            }
            topicslist.topics = res;
        }
    });
    
}

function removeTopic(_id){
    console.log("Ajax DELETE ./api/topics/" + _id)
    $.ajax({
        url: "./api/topics/" + _id,
        contentType: 'application/json;charset=utf-8',
        type: "DELETE",
        crossDomain: true,
        data: {},
        success: function(res){
            console.log("Success -", res);
        }
    });
}

function saveTopic(_id, data){
    putdata = {
        '_id': data.name, 
        'keywords': data.keywords.split(","), 
        'ids': data.ids.split(",")
    }
    console.log("Ajax PUT ./api/topics/" + _id, putdata)
    $.ajax({
        url: "./api/topics/" + _id,
        contentType: 'application/json',
        type: "PUT",
        crossDomain: true,
        data: JSON.stringify(putdata),
        dataType: "json",
        success: function(res){
            console.log("Success -", res);
            for (var i = 0; i < data.length; i++) {
                data[i]._id = data[i].name;
            }
        }
    });
}

getTopics();



