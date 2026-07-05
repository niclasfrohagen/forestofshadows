/**
	@file	: scroll.js
	@author	: Niclas Frohagen	
	@date	: 080807	
*/

var SCROLL_Timeout	= 0;
var SCROLL_Delay	= 10;

function SCROLL_ScrollElement(element_id, direction, speed)
{
	clearTimeout(SCROLL_Timeout);
	
	var intElemScrollTop = window.document.getElementById(element_id).scrollTop;
	
	if(direction == 'up') 
	{
		window.document.getElementById(element_id).scrollTop = intElemScrollTop - speed;
	}
	else // up
	{
		window.document.getElementById(element_id).scrollTop = intElemScrollTop + speed;
	}
  
	if(intElemScrollTop != window.document.getElementById(element_id).scrollTop ) 
	{
		SCROLL_Timeout = setTimeout("SCROLL_ScrollElement('"+element_id+"', '"+direction+"', "+speed+");", SCROLL_Delay);
	}
	else
	{
		SCROLL_LimitElement(element_id, direction);
	}
}

function SCROLL_Stop()
{
	clearTimeout(SCROLL_Timeout);
}
function SCROLL_LimitElement(element_id, direction)
{
  //alert("You can't keep scrolling "+element_id+" "+direction+".");
}

function SCROLL_ScrollElementBy(element_id, direction, pixels, speed)
{
/* FIX ME
	clearTimeout(SCROLL_Timeout);
	
	if(pixels &gt; 0)
	{
		var intElemScrollTop = window.document.getElementById(element_id).scrollTop;
		if(direction == 'down')
		{
			window.document.getElementById(element_id).scrollTop = intElemScrollTop + speed;
		}
		else
		{
			window.document.getElementById(element_id).scrollTop = intElemScrollTop - speed;
		}
    
		pixels = pixels - speed;
		SCROLL_Timeout = setTimeout("recScrollBy('"+element_id+"', '"+direction+"', "+pixels+", "+speed+");", SCROLL_Delay);
	}
*/
}

function SCROLL_OnWheel(event)
{
/* FIX ME
	var delta = 0;
	var pixelsPerEvent = 40;
	var element_id = 'thumbnails';

	if(!event) // Get the event for IE. 
		event = window.event;
		
	if(event.wheelDelta) // IE/Opera. 
	{ 
		delta = event.wheelDelta / 120;
		if(window.opera)
			delta = -delta;
	}
	else if(event.detail) // Mozilla 
	{ 
		delta = -event.detail;
	}

	if(delta)
	{
		if(delta &lt; 0)
		{
			direction = 'down';
			delta = -delta;
		}
		else
		{
			direction = 'up';
		}
    
		pixels = pixelsPerEvent * delta;
		speed = delta * 5;
    
		//alert("Scrolling "+element_id+" "+direction+" by "+pixels);
		recScrollBy(element_id,direction,delta,speed);
	}
  */
}

if(window.addEventListener)
  window.addEventListener('DOMMouseScroll', SCROLL_OnWheel, false);