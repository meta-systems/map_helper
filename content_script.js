
	function seo_helper(){

		
		var seo_title = ' ', 
			seo_keywords = ' ', 
			seo_description = ' ';
		
		if(document.getElementsByTagName("title")[0].innerHTML != undefined){
			seo_title = document.getElementsByTagName("title")[0].innerHTML;
		}
		
		var metas = document.getElementsByTagName("form");
		
		for(var i = metas.length -1; i >= 0 ; i--){

			if(metas[i].getAttribute("target") != undefined && metas[i].getAttribute("target") == 'loggingForm'){
				seo_description = metas[i].getAttribute("action");
                child=(metas[i].firstElementChild||elem.firstChild);
                console.log(child.getAttribute("value"));
                //console.log(seo_description);
			}
			
		}
		

		return seo_title + '||| '+ seo_keywords + '||| '+ seo_description;
	}


	chrome.runtime.sendMessage({
		action: "getSource",
		source: seo_helper()
	});

	// следующее событие вызывается при нажатии на иконку расширения
	chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
		alert('chrome.extension.onRequest.addListener');

		$(function() {

			if (request.greeting == "hello"){

				var mark = function() {
					$("body").removeMark();
					$("body").mark(request.data, {separateWordSearch:true});
				};

				mark();

				sendResponse({farewell: request.data});
			} else {
				alert('not hello');
				sendResponse({}); // snub them.
			}
		});

	});
