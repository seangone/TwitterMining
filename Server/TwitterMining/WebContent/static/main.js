function askTrends(number = dataTrendsLimit){
	$.ajax({
        url: "./trends",
        contenType: 'application/json;charset=utf-8',
        crossDomain: true,
        data: {num: number},
    	success: function(res){
    		console.log("Successfully Ajex:", res.time_updated, res.trends.length);
    		updateData(res);
    		timerShow = setTimer(timerShow);
    	}
    });
	
}


var CompTrendItem = {
	props: ['item'],
	template: '<a class="list-group-item list-group-item-action ' 
					+ 'justify-content-between align-items-center" '
					+ 'v-bind:href="item.url" target="_blank">{{item.name}}'
					+ '<span v-if="item.tweet_volume != null" class="badge badge-primary badge-pill float-right">' 
					+ '{{item.tweet_volume}}</span>'
					+'</a>'
};

var CompTime = {
	props: ['timestamp'],
	template: '<p class="card-text float-left">'
				+'<small class="text-muted">{{timestamp}}'
				+'</small></p>'	
};

var CompTrendsGroup = {
	props: ['trends', 'showControl'],
	components: {
		'comp-item': CompTrendItem, 
		'comp-time': CompTime
	}, 
	template: '<div><div class="list-group" >' 
				+ '<comp-item v-for="(it, ix) in trends.items" '
					+ 'v-bind:id=generateID(ix) v-bind:style="{display: isDisplay(ix)}" '
					+ ':item="it" :key="it.crawled_order">'
				+ '</comp-item>'
			+ '</div>'
			+ '<comp-time :timestamp="trends.timestamp"></comp-time></div>',
	methods: {
		generateID: function(index){
			return "a-line" + index;
		},
		isDisplay: function(index){
			var start = (showControl.activeIx - 1) * showControl.ItemsPerPage;
			if (start <= index && index < start + showControl.ItemsPerPage){
				return 'block';
			} else {
				return 'none'
			}
		}
	}
}

var CompPageNav = {
	props: ['numPages', 'activeIx'],
	template: '<div class="float-right"><ul id="trends-nav" class="pagination">'
				+'<li class="page-item" :class="{disabled: isDisabledPrev()}">'
				+'<a class="page-link"" v-bind:href="generateUrl(0)">&laquo;</a>'
				+'</li>'
				+'<li v-for="ix in numPages" class="page-item" v-bind:class="{active: isActive(ix)}">'
				+'<a class="page-link"" v-bind:href="generateUrl(ix)">{{ix}}</a>'
				+'</li>'
				+'<li class="page-item" :class="{disabled: isDisabledNext()}">'
				+'<a class="page-link"" v-bind:href="generateUrl(-1)">&raquo;</a>'
				+'</li>'
				+'</ul></div>',
	methods: {
//		generateID: function(index){
//			return "a-line" + index;
//		},
		generateUrl: function(index){
			if (index == 0){
				return "javascript:setPage(0)";
			}
			if (index == -1){
				return "javascript:setPage(-1)";
			}
			return "javascript:setPage("+index+")";
		},
		isActive: function(index){
			return index == this.activeIx;
		},
		isDisabledPrev: function(){
			return this.activeIx <= 1;
		},
		isDisabledNext: function(){
			return this.activeIx >= this.numPages;
		}
	}
};




var dataTrendsLimit = 50;

var dataTrends = { timestamp : "", items: []}
var showControl = {
		'numPages': 5, 
		'activeIx': 1,
		'ItemsPerPage': 10
};
showControl.numPages = Math.ceil(dataTrends.items.length / showControl.ItemsPerPage);
var timerControl = {
		'interval': 2500
};
var timerShow;

// draw components and bind data
var ts = new Vue({
	el: "#itemsgroup",
	components: {'comp': CompTrendsGroup},
	template: '<comp id="itemsgroup" :trends="trends" :showControl="showControl"></comp>',
	data: {'trends': dataTrends, 'showControl': showControl}
});
var sc = new Vue({
	el: "#showcontrol",
	components: {'pc': CompPageNav},
	template: '<pc id="showcontrol" :numPages="numPages" :activeIx="activeIx"></pc>',
	data: showControl
});

function updateData(res){
	dataTrends.timestamp = res.time_updated;
	dataTrends.items = res.trends;
	showControl.numPages = Math.ceil(dataTrends.items.length / showControl.ItemsPerPage);
}

function refresh(){
	setPage(-1);
}

function setTimer(timer){
	if (timer == null){
		return setInterval(refresh, timerControl.interval);
	} else {
//		console.log("restart Timer");
		timer = stopTimer(timer);
		timer = setInterval(refresh, timerControl.interval)
		return timer;
	}
}

function stopTimer(timer){
	if (timer != null){
		return clearInterval(timer);
	} else {
		return timer;
	}
}

function resetTimer(timer){
	return stopTimer(timer).setTimer(timer);
}



function setPage(ix){
	if (ix == 0){
		showControl.activeIx--;
	} else if (ix == -1){
		showControl.activeIx++;
	} else {
		showControl.activeIx = ix;
	}
	if(showControl.activeIx < 1){
		showControl.activeIx = showControl.numPages;
	} else if (showControl.activeIx > showControl.numPages){
		showControl.activeIx = 1;
	}
//	timerShow = resetTimer(timerShow);
}


askTrends();
timerShow = setTimer(timerShow);

$("#trends").mouseleave(function() {
//	console.log("Detect Mouse Leave");
	timerShow = setTimer(timerShow);
});
$("#trends").mouseenter(function() {
//	console.log("Detect Mouse Enter");
	timerShow = stopTimer(timerShow);
});
$("#trends").mousemove(function() {
//	console.log("Detect Mouse Enter");
	timerShow = stopTimer(timerShow);
});
$("#trends").click(function() {
//	console.log("Detect Mouse Enter");
	timerShow = stopTimer(timerShow);
});


