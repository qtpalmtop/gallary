require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
//获取图片相关数据
let imageDatas = require('../data/imageDatas.json');

//利用自执行函数，将图片名信息转成图片URL信息
imageDatas = (function genImageURL(imageDatasArr){
	for(var i = 0,j = imageDatasArr.length;i<j;i++){
		var singleImageData = imageDatasArr[i];

		singleImageData.imageURL = require('../images/' + singleImageData.fileName);

		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);		

//imageDatas =genImageURL(imageDatas);

let yeomanImage = require('../images/yeoman.png');

var ImgFigure = React.createClass({
	render:function(){
		return (
			<figure className="img-figure">
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
					//这里的this.props相当于ImgFigure对象
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcaption>
			</figure>

		);
	}
});


class AppComponent extends React.Component {
	Constant:{
		centerPos:{
			left:0,
			right:0
		},
		hPosRange:{
			leftSecX:[0,0],
			rightSecx:[0,0],
			y:[0,0]
		},
		vPosRange:{
			topY:[0,0],
			x:[0,0]
		}
	}	
	/*
	 *重新布局所有图片
     *@param centerIndex 指定居中排布哪个图片
     *
	 */
	rearrange:function(centerIndex){

	}

	getInitialStage:function(){
		return{
			imgsArrangeArr:[

			]
		}
	}

	//组件加载以后，为每张图片计算其位置的范围	
  	ComponentDidMount:function(){

  		//拿到舞台大小
  		var stageDOM = React.findDOMNode(this.refs.stage),
  			stageW = stageDom.scrollWidth,
  			stageH = stageDom.scrollHeight,
  			halfStageW = Math.ceil(stageW / 2),
  			halfStageH = Math.ceil(stageH / 2);
  		
  		//拿到一个imageFigure的大小
  		var ImgFigureDOM = React.findDOMNode(this.refs.ImgFigur0),
  			imgW = imgFigureDOM.scrollWidth,
  			imgH = imgFigureDOM.scrollHeight,
  			halfImgW = Math.ceil(imgW / 2),
  			halfImgH = Math.ceil(imgH / 2);
  	}

  	this.Constant.centerPos = {
  		left:halfStageW - halfImgW,
  		top:halfStageH - halfImgH
  	}
  	//计算左右侧图片排布位置的取值范围
  	this.Constant.hPosRange.leftSecX[0] = -halfImgW;
  	this.Constant.hPosRange.leftSecX[1] = halfStageW -halfImgW*3;
  	this.Constant.hPosRange.rightSecX[0] = halfStageW = halfImgW;
  	this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
  	this.Constant.hPosRange.y[0] = -halfImgH;
  	this.Constant.hPosRange.y[1] = stageH - halfImgH;
	//计算上侧图片排布位置的取值范围
  	this.Constant.vPosRange.topY[0] = -halfImgH;
  	this.Constant.vPosRange.topY[1] = halfStageH -halfImgH * 3;
  	this.Constant.vPosRange.x[0] = halfImgW - imgW;
  	this.Constant.vPosRange.x[1] = halfImgW;
  	this.rearrange(0);

  	render() {
		var controllerUnits = [],
		imgFigures = [];
		//遍历imageDatas里的值给data方便ImgFigure里的标签调用
		imageDatas.forEach(function(value,index){
			
			if(!this.state.imgsArrangeArr[index]){
				this.stage.imgsArrangeArr[index] = {
					pos:{
						left:0,
						top:0
					}
				}
			}

			imgFigures.push(<ImgFigure ref={'imgFigure' + index} data={value}/>);
		}.bind(this));

	    return (
			<section className="stage" ref="stage">
				<section className="img-sec">
					{imgFigures}
				</section>
				<nav className="controller-nav">
					{controllerUnits}
				</nav>
			</section>
	    );
	  }
	}

AppComponent.defaultProps = {
};

export default AppComponent;
