/**
	@file	: OpenWindow.js
	@author	: Niclas Frohagen	
	@date	: 041120	
*/

function OpenWindow(url)
{
	var name		= '_blank';
	var features	= 'toolbar = no, location = no, status = no, menubar = no, scrollbars = no, resizable = no, width = 800, height = 500'
				
	window.open(url, name, features);
}

function OpenWindowEx(url, name, features)
{
	window.open(url, name, features);
}
