/**
 * khayr.js: библиотека разных функции
 *
 * @author KhayR (http://khayrulla.com)
 * @version 0.1.1
 */


/* Cookie: http://learn.javascript.ru/cookie */

// возвращает cookie с именем name, если есть, если нет, то undefined
function getCookie(name)
{
	var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

// устанавливает cookie c именем name и значением value, options - объект со свойствами cookie (expires, path, domain, secure)
function setCookie(name, value, options)
{
	options = options || {};
	var expires = options.expires;
	if (typeof expires == "number" && expires)
	{
		var d = new Date();
		d.setTime(d.getTime() + expires*1000);
		expires = options.expires = d;
	}
	if (expires && expires.toUTCString)
	{
		options.expires = expires.toUTCString();
	}
	value = encodeURIComponent(value);
	var updatedCookie = name + "=" + value;
	for (var propName in options)
	{
		updatedCookie += "; " + propName;
		var propValue = options[propName];
		if (propValue !== true)
		{
			updatedCookie += "=" + propValue;
		}
	}
	document.cookie = updatedCookie;
}

// удаляет cookie с именем name
function deleteCookie(name)
{
	setCookie(name, "", { expires: -1 });
}


/* window.location */

// проверяет, внешняя ли ссылка
function isExternal(url)
{
    var match = url.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
    if (typeof match[1] === "string" && match[1].length > 0 && match[1].toLowerCase() !== location.protocol) return true;
    if (typeof match[2] === "string" && match[2].length > 0 && match[2].replace(new RegExp(":("+{"http:":80,"https:":443}[location.protocol]+")?$"), "") !== location.host) return true;
    return false;
}

// вернет переменные GET запроса из URL
function getUrlVars(url)
{
	if (url == '') // !url ?
		url = window.location.href;
	var hashes = url.slice(url.indexOf('?') + 1).split('&');
	var str = "{";
	for (var i = 0; i < hashes.length; i++)
	{
		var hash = hashes[i].split('=');
		if (str != "{")
			str = str+",";
		str = str+"\""+hash[0]+"\":\""+hash[1]+"\"";
	}
	str = str+"}";
	return JSON.parse(str);
}

// вернет папки запроса из URL в виде массива
function getUrlFolders(url)
{
	if (url == '')
		url = window.location.pathname;
	folders = [];
	url.split("/").forEach(function(elem) {
		if (elem != "") folders.push(elem);
	});
	return folders;
}


/* Окна, вкладки, размеры */

// прокрутка на начало
function smoothJumpUp()
{
	if ((document.body.scrollTop > 0) || (document.documentElement.scrollTop > 0))
	{
		window.scrollBy(0, -50);
		setTimeout(smoothJumpUp, 100);
	}
}

// размер документа по вертикали
function getDocumentHeight()
{
	return (document.body.scrollHeight > document.body.offsetHeight) ? document.body.scrollHeight : document.body.offsetHeight;
}

// размер документа по горизонтали
function getDocumentWidth()
{
	return (document.body.scrollWidth > document.body.offsetWidth) ? document.body.scrollWidth : document.body.offsetWidth;
}

// 
function getClientHeight()
{
	return document.compatMode == 'CSS1Compat' && !window.opera ? document.documentElement.clientHeight : document.body.clientHeight;
}

// 
function getClientWidth()
{
	var isiPad = navigator.userAgent.match(/iPad/i) != null;
	var isiPhone = navigator.userAgent.match(/iPhone/i) != null;
	var isiPod = navigator.userAgent.match(/iPod/i) != null;
	if (isiPad || isiPhone || isiPod)
	{
		return 1230;	
	}
	else
	{
		return document.compatMode == 'CSS1Compat' && !window.opera ? document.documentElement.clientWidth : document.body.clientWidth;
	}
}

// позиция, высота и ширина элемента
function getElementPosition(elemId)
{
	var elem = document.getElementById(elemId);
	var w = elem.offsetWidth;
	var h = elem.offsetHeight;
	var l = 0;
	var t = 0;
	while (elem)
	{
		l += elem.offsetLeft;
		t += elem.offsetTop;
		elem = elem.offsetParent;
	}
	return { "left":l, "top":t, "width": w, "height":h };
}


/* Аналог jQuery ready (вызывать onReady!): http://javascript.ru/tutorial/events/ondomcontentloaded */

readyList = [];
function bindReady(handler)
{
	var called = false
	function ready() { // (1)
		if (called) return
		called = true
		handler()
	}
	if ( document.addEventListener ) { // (2)
		document.addEventListener( "DOMContentLoaded", function(){
			ready()
		}, false )
	} else if ( document.attachEvent ) {  // (3)
		// (3.1)
		if ( document.documentElement.doScroll && window == window.top ) {
			function tryScroll(){
				if (called) return
				if (!document.body) return
				try {
					document.documentElement.doScroll("left")
					ready()
				} catch(e) {
					setTimeout(tryScroll, 0)
				}
			}
			tryScroll()
		}
		// (3.2)
		document.attachEvent("onreadystatechange", function(){
			if ( document.readyState === "complete" ) {
				ready()
			}
		})
	}
	// (4)
    if (window.addEventListener)
        window.addEventListener('load', ready, false)
    else if (window.attachEvent)
        window.attachEvent('onload', ready)
    /*  else  // (4.1)
        window.onload=ready
	*/
}
function onReady(handler)
{
	if (!readyList.length)
	{
		bindReady(function() {
			for (var i = 0; i < readyList.length; i++)
			{
				readyList[i]()
			}
		})
	}
	readyList.push(handler)
}


/* Валидация */

// проверка формата e-mail
function CheckEmail(val)
{
	var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	return emailReg.test(val)
}


/* jQuery и дополнения */

// если jQuery подключена
if (window.jQuery)
{

// полный html-код элемента
jQuery.fn.outer = function() {
	return $($('<div></div>').html(this.clone())).html();
}

}


/* Random */

// random от min до max
function getRandomArbitary(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


/* Дата и время */

// прибавление к дате n дней
function addDays(date, n)
{
	var d = new Date();	
	d.setTime(date.getTime() + n * 24 * 60 * 60 * 1000);
	return d;
}


/* Массивы */

// перемешивание массива
function shuffle(arr)
{
	var arrlen = arr.length-1;
	while (arrlen > 1)
	{
		r_i = random(0, arrlen-1);
		v = arr[r_i];
		arr[r_i] = arr[arrlen];
		arr[arrlen] = v;
		arrlen--;
	}
	return arr;
}