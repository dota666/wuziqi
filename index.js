$(function(){
	var canvasSize = 600;
	var row = 15;
	var blockS = canvasSize/row;
	var starRaduis = 4;

	var ctx = $('#canvas').get(0).getContext('2d');
	$('#canvas').get(0).width = canvasSize;
	$('#canvas').get(0).height = canvasSize;

	var draw = function(){
		var jiange = blockS/2 + 0.5;
		var lineWidth = canvasSize - blockS;
		ctx.save();
		ctx.beginPath();
		for(var i=0;i<row;i++){
			if(i===0){
				ctx.translate(jiange,jiange);
			}else{
				ctx.translate(0,blockS);
			}	
			ctx.moveTo(0,0);
			ctx.lineTo(lineWidth,0);
		}
		ctx.stroke();
		ctx.closePath();
		ctx.restore();


		ctx.save();
		ctx.beginPath();
		for(var i=0;i<row;i++){
			if(i===0){
				ctx.translate(jiange,jiange);
			}else{
				ctx.translate(blockS,0);
			}	
			ctx.moveTo(0,0);
			ctx.lineTo(0,lineWidth);
		}
		ctx.stroke();
		ctx.closePath();
		ctx.restore();

		var points = [3.5*blockS + 0.5 , 11.5*blockS + 0.5];
		for(var i=0;i<2;i++){
			for(var j=0;j<2;j++){
				var x = points[i];
				var y = points[j];
				ctx.save();
				ctx.beginPath();
				ctx.translate(x,y);
				ctx.arc(0,0,starRaduis,0,(Math.PI/180)*360);
				ctx.fill();
				ctx.closePath();
				ctx.restore();
			}
		}
		
		ctx.save();
		ctx.beginPath();
		ctx.translate(7.5*blockS + 0.5,7.5*blockS + 0.5);
		ctx.arc(0,0,starRaduis,0,(Math.PI/180)*360);
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}
	draw();

  	// {x:1,y:1,color:1}
	drop = function(qizi){
		ctx.save();
		ctx.translate((qizi.x+0.5)*blockS,(qizi.y+0.5)*blockS)
		ctx.beginPath();
		ctx.arc(0,0,15,0,(Math.PI/180)*360);
		if(qizi.color === 1){
			// var rd = ctx.createRadialGradient(0,0,2,0,0,15);
			// rd.addColorStop(0.1,'#999');
			// rd.addColorStop(0.4,'black');
			// rd.addColorStop(1,'black');
			// ctx.fillStyle = 'black';
			$('#black_play').get(0).play();
		}else{
			ctx.fillStyle = 'white';
			$('#white_play').get(0).play();
		}
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}

	panduan = function(qizi){
		var shuju = {};
		$.each(All,function(k,v){
			if( v.color === qizi.color){
				shuju[k] = v;
			}
		})
		var shu = 1,hang = 1,zuoxie = 1,youxie = 1;
		var tx,ty;

		// 竖排
		tx = qizi.x; ty = qizi.y;
		while(shuju[tx + '-' +(ty + 1)]){
			shu ++; ty ++;
		}
		tx = qizi.x; ty = qizi.y;
		while(shuju[tx + '-' +(ty - 1)]){
			shu ++; ty --;
		}

		//横排
		tx = qizi.x; ty = qizi.y;
		while(shuju[(tx+1) + '-' + ty]){
			hang ++; tx ++;
		}
		tx = qizi.x; ty = qizi.y;
		while(shuju[(tx-1) + '-' + ty]){
			hang ++; tx --;
		}

		tx = qizi.x; ty = qizi.y;
		while(shuju[(tx-1) + '-' + (ty-1)]){
			zuoxie ++;tx --; ty --;
		}
		tx = qizi.x; ty = qizi.y;
		while(shuju[(tx+1) + '-' + (ty+1)]){
			zuoxie ++; tx ++;ty ++;
		}

		tx = qizi.x; ty = qizi.y;
		while(shuju[(tx+1) + '-' + (ty-1)]){
			youxie ++;tx ++; ty --;
		}
		tx = qizi.x; ty = qizi.y;
		while(shuju[(tx-1) + '-' + (ty+1)]){
			youxie ++; tx --;ty ++;
		}

		if(shu>=5 || hang>=5 || zuoxie>=5 || youxie>=5){
			return true;
		}
	}

	var kaiguan = true;
	var All = {};
	var step = 0;
	$('#canvas').on('click',function(e){
		var x = Math.floor(e.offsetX/blockS);
		var y = Math.floor(e.offsetY/blockS);
		if(All[x+'-'+y]){
			return;
		}
		if(kaiguan){
			var qizi={x:x,y:y,color:1,step:step};
			drop(qizi);
			if(panduan(qizi)){
				$('.cartel').show().find('#tishi').text('黑棋获胜');
			}
		}else{
			var qizi = {x:x,y:y,color:0,step:step};
			drop(qizi);
			if(panduan(qizi)){
				$('.cartel').show().find('#tishi').text('白棋获胜');
			}
		}
		step += 1;
		kaiguan = !kaiguan;
		All[x + '-' + y] = qizi;
	})

	$('#restart').on('click',function(){
		$('.cartel').hide();
		ctx.clearRect(0,0,600,600);
		draw();
		kaiguan=true;
		All={};
		step=1;
	})
	$('#qipu').on('click',function(){
		$('.cartel').hide();
		$('#save').show();
		ctx.save();
		ctx.font = "20px consolas";
		for(var i in All){
			if(All[i].color === 1){
				ctx.fillStyle = '#fff';
			}else{
				ctx.fillStyle = 'black';
			}
			ctx.textAlign = 'center';
      		ctx.textBaseline = 'middle';
			ctx.fillText(All[i].step,(All[i].x+0.5)*blockS,(All[i].y+0.5)*blockS);
		}
		ctx.restore();
		var image = $('#canvas').get(0).toDataURL('image/png',1);
		$('#save').attr('href',image);
		$('#save').attr('download','qipu.png');
		$('#canvas').off();
	})

	$('.tips').on('click',false)
	$('#close').on('click',function(){
		$('.cartel').hide();
	})
	$('.cartel').on('click',function(){
		$(this).hide();
	})
	
})