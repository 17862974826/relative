window.onload=function(){
	new Waterfall().init()
}
function Waterfall(){
	this.count=0;
	this.top=7;
	this.min=0;
	this.index=null;
	this.time=null;
	this.arr=[];
	this.wrap=$("#wrap");
}
Waterfall.prototype={
	//函数入口
	init:function(){
		this.calCount();
		this.getAajax();
		this.load();
		this.change();
	},
	//计算每一列图片数量及父元素宽度
	calCount:function(){
		this.count=Math.floor(document.documentElement.clientWidth/$(".content").eq(0).outerWidth());
		//让父元素保持居中
		$("#wrap").css("width",this.count*$(".content").eq(0).outerWidth())
	},
	//通过ajax获取数据
	getAajax:function(){
		var str="";
		var that=this;
		$.ajax({
			type:"get",
			url:"data.json",
			success:function(res){
				var data=res;
				for (var i in data) {
					str+=`<div class="content">
							<div class="inner">
								<img src="images/${data[i]}" />
							</div>
						</div>`
				}
				$("#wrap").append(str);
				//保证图片全部加载完成
				setTimeout(function(){
					that.fall();
				},100)
			},
		});
	},
	//实现瀑布流效果
	fall:function(){
		this.arr.length=0;
		for (var i=0;i<this.wrap.children().length;i++) {
			if(i<this.count){
				this.wrap.children().eq(i).css({"top":this.top,"left":$(".content").eq(i).index()*($(".content").eq(0).outerWidth())})
				this.arr.push(this.wrap.children().eq(i).outerHeight())
			}else{
				var cur=this.wrap.children().eq(i);
				//巧用apply找出最小高度
				this.min=Math.min.apply(null,this.arr);
				//找出最小高度下标
				this.index=this.arr.indexOf(this.min);
				cur.css({"top":this.arr[this.index]+this.top,"left":this.index*($(".content").eq(i).outerWidth())});
				//高度累加
				this.arr[this.index]+=cur.outerHeight()
			}
		}
	},
	//实现无限加载
	load:function(){
		$(window).scroll(function(){
			//确认最小高度
			this.min=Math.min.apply(null,this.arr)
			if($("html,body").scrollTop()>this.min-$(".content").last().outerHeight()*6){
				this.getAajax();
			}
		}.bind(this))
	},
	//改变屏幕大小
	change:function(){
		$(window).resize(function(){
			//函数节流,解决大部分浏览器1px改动频繁响应问题
			clearTimeout(this.time)
			this.time=setTimeout(function(){
				this.calCount();
				this.fall();
			}.bind(this),200)
		}.bind(this))
	}
}
