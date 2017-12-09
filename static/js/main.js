$(function(){
	$(".menu_count>ul>li").hover(function(){
		var liw=$(this).width()+40;
		$(this).find("ul").css({"display":"block"});
		},
	function(){
		$(this).find("ul").css({"display":"none"});
		})  //二级菜单方法
	$("#qiehuan_menu>ul>li").click(function(){
		var index=$(this).index();
		if(!$(this).css({
			'background':'#fff',
				'border-bottom-color':'#fff',
				'border-left':'1px solid #999999',
				'border-right':'1px solid #999999'
		}))
		{
			$(this).css({
				'background':'#fff',
				'border-bottom-color':'#fff',
				'border-left':'1px solid #999999',
				'border-right':'1px solid #999999'
			})
			.siblings().css(
			{
				'background':'#eee',
				'border-bottom-color':'#999999',
				'border-left':'1px solid #999999',
				'border-right':'1px solid #999999'
			});
			
		}
		else
		{
			$(this).siblings().css({
				'background':'#eee',
				'border-bottom-color':'#999999',
				'border-left':'1px solid #999999',
				'border-right':'1px solid #999999'
			});
		}
		$("#qiehuan div").eq(index).show().siblings().hide();
	});
	$(".eicon-image").click(function() {
		if(!$.contains(document.getElementsByTagName('body')[0],document.getElementsByClassName('modal')[0]))
			$([
				'<div class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="editorToolImageTitle" aria-hidden="true">',
				        '<div class="modal-header">',
				            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>',
				            '<h3 id="editorToolImageTitle">图片</h3>',
				        '</div>',
				        '<div class="modal-body">',
				            '<div class="upload-img">',
								'<div id="uploader" class="wu-example">',
								'<div id="fileList" class="uploader-list"></div>',
								'<div id="filePicker">选择图片</div>',
								'</div><br/>',
								'<button id="ctlBtn" class="btn btn-default button">上传图片</button>',
				                '<span class="tip">按ESC退出</span>',
				                '<div class="alert alert-error hide"></div>',
				            '</div>',
				        '</div>',
				    '</div>',
			].join('')).appendTo($("body"))
		$('.modal').modal('show')
		// $.ajax({
		// 	url: "demo_test.txt",
		// 	success: function(result){
		// 		$("#div1").html(result);
		// 	}
		// });
		// 文件上传
		var BASE_URL = 'localhost:8081'
		var $list = $('#fileList')
		$('#ctlBtn').click(function() {
			uploader.upload()
		})
		var uploader = WebUploader.create({

			// 选完文件后，是否自动上传。
			auto: false,

			// swf文件路径
			swf: BASE_URL + '/js/Uploader.swf',

			// 文件接收服务端。
			server: 'http://localhost:8081/api/file/img/',

			// 选择文件的按钮。可选。
			// 内部根据当前运行是创建，可能是input元素，也可能是flash.
			pick: {
				id: '#filePicker',
				label: '点击选择图片'
			},
			chunked: true,
			chunkSize: 512 * 1024,
			// 只允许选择图片文件。
			accept: {
				title: 'Images',
				extensions: 'gif,jpg,jpeg,bmp,png',
				mimeTypes: 'image/jpg,image/jpeg,image/png, image/gif, image/bmp'
			},
			thumb: {
				type: 'image/jpg,jpeg,png'
			},
			fileNumLimit: 1, //限制上传个数
			fileSingleSizeLimit: 2048000, //限制单个上传图片的大小

			formData: {
				key: 1234,
			},
		});

		// 当有文件添加进来的时候
		uploader.on( 'fileQueued', function( file ) {
			var $li = $(
				'<div id="' + file.id + '" class="file-item thumbnail">' +
				'<img>' +
				'<div class="info">' + file.name + '</div>' +
				'<p class="state">等待上传...</p>' +
				'</div>'
				);

			// $list为容器jQuery实例
			$list.append( $li );

			// 创建缩略图
			// 如果为非图片文件，可以不用调用此方法。
			// thumbnailWidth x thumbnailHeight 为 100 x 100

			var thumbnailWidth = 200
			var thumbnailHeight = 200


			uploader.makeThumb( file, function( error, src ) {
				var $img = $li.find('img')
				if ( error ) {
					$img.replaceWith('<span>不能预览</span>');
					return;
				}

				$img.attr( 'src', src );
			}, thumbnailWidth, thumbnailHeight );
		});

		uploader.on( 'uploadProgress', function( file, percentage ) {
			var $li = $( '#'+file.id ),
				$percent = $li.find('.progress span');
			// 避免重复创建
			if ( !$percent.length ) {
				$percent = $('<p class="progress"><span></span></p>')
				.appendTo( $li )
				.find('span');
			}

			$percent.css( 'width', percentage * 100 + '%' );
		});

// 文件上传成功，给item添加成功class, 用样式标记上传成功。
		uploader.on( 'uploadSuccess', function( file, response ) {
			$( '#'+file.id ).addClass('upload-state-done');

			var clipboard = new Clipboard('.close',{
				text: function () {
					return 'localhost:8081/api/file/img/' + response.data
				}
			});

			clipboard.on('success', function () {
				prompt('success')
			});

			clipboard.on('error', function () {
				prompt('success')
			});

		});

// 文件上传失败，显示上传出错。
		uploader.on( 'uploadError', function( file ) {
			var $li = $( '#'+file.id ),
				$error = $li.find('div.error');

			// 避免重复创建
			if ( !$error.length ) {
				$error = $('<div class="error"></div>').appendTo( $li );
			}

			$error.text('上传失败');
		});

// 完成上传完了，成功或者失败，先删除进度条。
		uploader.on( 'uploadComplete', function( file ) {
			$( '#'+file.id ).find('.progress').remove();
			$( '#'+file.id ).find('.state').html('上传完成！！！');
		});

		uploader.on( 'uploadBeforeSend', function( block, data ) {
			// block为分块数据。

			// file为分块对应的file对象。
			var file = block.file;

			// 修改data可以控制发送哪些携带数据。
			data.uid = file.source.uid;
		});
	})

});