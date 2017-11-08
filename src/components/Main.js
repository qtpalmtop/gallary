require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
var ReactDOM = require('react-dom');
//获取图片相关数据
let imageDatas = require('../data/imageDatas.json');

//利用自执行函数，将图片名信息转成图片URL信息
imageDatas = (function genImageURL(imageDatasArr) {
	for (var i = 0, j = imageDatasArr.length; i < j; i++) {
		var singleImageData = imageDatasArr[i];
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);

//imageDatas =genImageURL(imageDatas);

/*
 *获取区间一个随机值
 */
function getRangeRandom(low, high) {
	return Math.ceil(Math.random() * (high - low) + low);
}

function get30DegRandom() {
	//55开
	return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}


class ControllerUnit extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		// e.target.className += this.props.arrange.isCenter ? ' is-center' : '';
		// e.target.className += this.props.arrange.isInverse ? ' is-inverse' : '';
		if (this.props.arrange.isCenter) {
			this.props.inverse();

		} else {

			this.props.center();
		}
	}

	render() {
		var controllerUnitClassName = 'controller-unit';
		if (this.props.arrange.isCenter) {
			controllerUnitClassName += ' is-center';
		} else {
			controllerUnitClassName.replace('is-center', '');
		}

		controllerUnitClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

		return (
			<span className={controllerUnitClassName} onClick={this.handleClick}></span>
		);
	}
}

class ImgFigure extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}
	}

	render() {

		var styleObj = {};

		//如果props属性中指定了这张图片的位置，则使用
		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		}

		if (this.props.arrange.rotate) {
			(['Moz', 'Ms', 'Webkit', '']).forEach(function(value) {
				styleObj[value + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';

			}.bind(this)); //不加bind的话this就是(['Moz', 'Ms', 'Webkit', ''])

		}

		if (this.props.arrange.isCenter) {
			styleObj.zIndex = 11;
		}

		var imgFigureClassName = 'img-figure';
		imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

		var imageURL = this.props.arrange.isInverse ? '' : this.props.data.imageURL;
		var title = this.props.arrange.isInverse ? '' : this.props.data.title;
		var desc = this.props.arrange.isInverse ? this.props.data.desc.split('').reverse().join('') : '';
		return (
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={imageURL} alt={title}/>
				<figcaption>
					//这里的this.props相当于
					<h2 className="img-title">{title}</h2>
					<div className="img-back" onClick={this.handleClick}>
						<p>
							{desc}
						</p>
					</div>
				</figcaption>
			</figure>

		);
	}
}


class AppComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			imgsArrangeArr: [{
				pos: {
					left: '0',
					top: '0'
				},
				rotate: 0, //旋转角度
				isInverse: false, //图片是否翻面
				isCenter: false //图片是否居中
			}],
			Constant: {
				centerPos: {
					left: '0',
					right: '0'
				},
				hPosRange: {
					leftSecX: [0, 0],
					rightSecx: [0, 0],
					y: [0, 0]
				},
				vPosRange: {
					topY: [0, 0],
					x: [0, 0]
				}
			}
			/*重新布局所有图片
			 *@param centerIndex 指定居中排布哪个图片
			 */
		};
	}

	/*
	 *翻转图片
	 *@param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
	 *@return {FUnction} 这是一个闭包函数 其内return一个真正待被执行的函数
	 */
	inverse(index) {
		return function() {
			var imgsArrangeArr = this.state.imgsArrangeArr;

			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

			this.setState({
				imgsArrangeArr: imgsArrangeArr
			});
		}.bind(this);
	}


	// getInitialStage(){
	// 	return{
	// 		imgsArrangeArr:[
	// 			{

	// 				pos:{
	// 					left:'0',
	// 					top:'0'
	// 				}
	// 			}
	// 		]
	// 	};
	// }

	rearrange(centerIndex) {

		var imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.state.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecx,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,


			imgsArrangeTopArr = [],
			topImgNum = Math.ceil(Math.random() * 2), //取一个或者不取
			topImgSpliceIndex = 0,

			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);


		//首先居中centerIndex的图片,居中的centerIndex 的图片不需要旋转
		imgsArrangeCenterArr[0] = {
			pos: centerPos,
			rotate: 0,
			isCenter: true
		}

		imgsArrangeCenterArr[0].rotate = 0;
		//取出要布局上侧的图片的状态信息
		topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));

		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

		//布局位于上侧的图片
		imgsArrangeTopArr.forEach(function(value, index) {
			imgsArrangeTopArr[index] = {
				pos: {
					top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
					left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
				},
				rotate: get30DegRandom(),
				isCenter: false
			}
		});
		//布局左右两侧图片
		for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
			var hPosRangeLORX = null;

			if (i < k) {
				hPosRangeLORX = hPosRangeLeftSecX;
			} else {
				hPosRangeLORX = hPosRangeRightSecX;
			}

			imgsArrangeArr[i] = {
				pos: {
					top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
					left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
				},
				rotate: get30DegRandom(),
				isCenter: false
			}

			//console.log(hPosRangeY[0]+ "" +hPosRangeY[1]);
		}

		if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
			imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
		}

		imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

		this.setState({
			imgsArrangeArr: imgsArrangeArr
		});
	}

	/*
	 *利用rearrange 函数，居中对应Index的图片
	 *@param index 需要被居中的图片对应的图片信息数组的index值
	 *@return {FUnction} 这是一个闭包函数 其内return一个真正待被执行的函数
	 */
	center(index) {
		return function() {

			this.rearrange(index);
		}.bind(this);
	}

	//组件加载以后，为每张图片计算其位置的范围	
	componentDidMount() {
		this.timerID = setTimeout(
			() => this.tick(),
			0
		);

		var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2);

		//拿到一个imageFigure的大小
		var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgH = imgFigureDOM.scrollHeight,
			imgW = imgFigureDOM.scrollWidth,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);


		this.setState({
			Constant: {
				centerPos: {
					left: halfStageW - halfImgW,
					top: halfStageH - halfImgH
				},
				hPosRange: {
					leftSecX: [-halfImgW, halfStageW - halfImgW * 3],
					rightSecx: [halfStageW + halfImgW, stageW - halfImgW],
					y: [-halfImgH, stageH - halfImgH]
				},
				vPosRange: {
					topY: [-halfImgH, halfStageH - halfImgH * 3],
					x: [halfStageW - imgW, halfStageW]
				}
			}

		});
		console.log(this.state.Constant.centerPos.left);
		
		// this.state.Constant.centerPos = {
		// 	left:halfStageW - halfImgW,
		// 	top:halfStageH - halfImgH
		// }	

		//计算左右侧图片排布位置的取值范围
		// this.state.Constant.hPosRange.leftSecX[0] = -halfImgW;
		// this.state.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW*3;
		// this.state.Constant.hPosRange.rightSecX[0] = halfStageW +  halfImgW;
		// this.state.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;

		// this.state.Constant.hPosRange.y[0] = -halfImgH;
		// this.state.Constant.hPosRange.y[1] = stageH - halfImgH;

		//计算上侧图片排布位置的取值范围
		// this.state.Constant.vPosRange.topY[0] = -halfImgH;
		// this.state.Constant.vPosRange.topY[1] = halfStageH -halfImgH * 3;
		// this.state.Constant.vPosRange.x[0] = halfStageW - imgW;
		// this.state.Constant.vPosRange.x[1] = halfStageW;

	}

	componentWillUnmount() {
		clearTime(timerID)
	}

	tick() {

		//改变每张图片的样式
		this.rearrange(0);

	}


	render() {

		var controllerUnits = [],
			imgFigures = [];
		//遍历imageDatas里的值给data方便ImgFigure里的标签调用
		imageDatas.forEach(function(value, index) {

			if (!this.state.imgsArrangeArr[index]) {
				this.state.imgsArrangeArr[index] = {
					pos: {
						left: '0',
						top: '0'
					},
					rotate: 0,
					isInverse: false,
					isCenter: false
				}
			}
			controllerUnits.push(<ControllerUnit key={index} order={index + 1} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
			imgFigures.push(<ImgFigure key={index} ref={'imgFigure' + index} data={value} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
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

AppComponent.defaultProps = {};

export default AppComponent;