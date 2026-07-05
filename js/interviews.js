/**
	@file	: Interviews.js
	@author	: Niclas Frohagen	
	@date	: 050127	
*/

var INTERVIEWS_XMLRoot = null;

function GetDocTypeScript()
{
	return '<!doctype html public \"-//W3C//DTD HTML 4.0 Transitional//EN\">';
}

function GetHeadScript()
{
	var html = '<head>';
	html += '<link href=\"css/style.css\" type=\"text/css\" rel=\"StyleSheet\">';
	html += '<script language=\"javascript\" src=\"js/interviews.js\"></script>';
	html += '<script language=\"javascript\" src=\"js/scroll.js\"></script>';
	html += '</head>';
	
	return html;
}

function GetBodyScript()
{
	return '<body onLoad=\"INTERVIEWS_Create()\">';
}

function GetTitleScript()
{
	var html = '<p class=\"Title\">press</p>';
	html += '<p class=\"SubTitle\">interviews</p>';
	
	return html;
}

function GetContainerScript()
{
	var html = '<div id=\"Container\">';
	html += '<div id=\"Content\">';
	
	return html;
}

function GetCloseWindowScript()
{
	var html = "<div class=\"Close\">";
	html += "<a href=\"press_interviews.html\">";
	html += "<img src=\"pictures/icon_close.jpg\" border=\"0\">";
	html += "</a>";
	html += "</div>";
	
	return html;
}

function GetNavigationScript(has_close)
{
	var html = '<div ';
	
	if(has_close)
	{
		html += 'class=\"UpControl2\">';
	}
	else
	{
		html += 'class=\"UpControl\">';
	}
	
	html += '<a onmousedown=\"SCROLL_ScrollElement(\'Container\', \'up\', 8);\" onmouseup=\"SCROLL_ScrollElement(\'Container\',\'up\',2);\" onmouseover=\"SCROLL_ScrollElement(\'Container\',\'up\',2);\" onmouseout=\"SCROLL_Stop();\">';
	html += '<img src=\"pictures/icon_up.jpg\" border=\"0\">';
	html += '</a></div>';
	html += '<div class=\"DownControl\">';
	html += '<a onmousedown=\"SCROLL_ScrollElement(\'Container\', \'down\', 8);\" onmouseup=\"SCROLL_ScrollElement(\'Container\',\'down\',2);\" onmouseover=\"SCROLL_ScrollElement(\'Container\',\'down\',2);\" onmouseout=\"SCROLL_Stop();\">';
	html += '<img src=\"pictures/icon_down.jpg\" border=\"0\">';
	html += '</a></div>';
	
	return html;
}

function INTERVIEWS_Create()
{
	INTERVIEWS_Init();
	INTERVIEWS_Show();
}

function INTERVIEWS_Init()
{
	if (window.XMLHttpRequest) // Firefox, Mozilla, Opera, etc.
	{
		xml_http_request = new window.XMLHttpRequest();
    }
	else // IE
	{
		xml_http_request = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	try
	{
		xml_http_request.open("GET", "xml/interviews.xml", false);
		xml_http_request.send(null);
		INTERVIEWS_XMLRoot = xml_http_request.responseXML.documentElement;
	}
	catch (e)
	{
		alert(e);
	}
}

function INTERVIEWS_Show()
{
	if (INTERVIEWS_XMLRoot)
	{
		// Get value from address bar
		var index = window.location.href.indexOf("?");
		if(index != -1)
		{
			var str = window.location.href.substr(index + 1);
			
			var values = str.split("=");
			if((values.length > 1) && values[1].length)
				INTERVIEWS_ShowItem(values[1]);
		}
		else
		{
			INTERVIEWS_ShowList();
		}
	}
}

function INTERVIEWS_ShowList()
{
	var html = GetDocTypeScript();
	html += GetHeadScript();
	html += GetBodyScript();
	html += GetNavigationScript(false);
	html += GetTitleScript();
	html += GetContainerScript();
	
	var current_year = 0;
	var item_nodes = INTERVIEWS_XMLRoot.getElementsByTagName("item");
	for(i = 0; i < item_nodes.length; i++)
	{
		date = item_nodes.item(i).getAttribute("date");
		
		// Calculate year
		var year = 20 + date.substr(0, 2);
		if(year != current_year)
		{
			if(current_year != 0)
				html += "</p>";
				
			html += "<p class=\"Main\">";
				
			current_year = year;
			html += "<b>" + current_year + "</b><br>";
		}
		
		html += '<a href="press_interviews.html?id=' + i + '">';
		html += date;
		html += " - ";
		html += item_nodes.item(i).getAttribute("zine");
		html += "</a><br>";
	}
	
	html += "</p></div></div></body></html>";
	document.write(html);
}

function INTERVIEWS_ShowItem(id)
{
	var html = GetDocTypeScript();
	html += GetHeadScript();
	html += GetBodyScript();
	html += GetNavigationScript(true);
	html += GetTitleScript();
	html += GetCloseWindowScript();
	html += GetContainerScript();
	
	var item_node = null;
	{
		var item_nodes = INTERVIEWS_XMLRoot.getElementsByTagName("item");
		if(item_nodes && (id < item_nodes.length))
			item_node = item_nodes[id];
	}
	
	if(item_node)
	{
		var author	= item_node.getAttribute("author");
		var zine	= item_node.getAttribute("zine");
				
		html += "<p class=\"Main\"><b>";
		html += "interview by ";
		
		if(author && (author != ""))
			html += author + " for ";
			
		html += zine;
		html += "</b></p>";
			
		var p_nodes = item_node.getElementsByTagName("p");
		for(i = 0; i < p_nodes.length; i++)
		{
			html += "<p class=\"Main\">";
			
			var question = false;
			if(p_nodes[i].getAttribute("type") == "question")
			{
				html += "<i>";
				question = true;
			}
				
			html += p_nodes[i].firstChild.nodeValue + "<br>";
			
			if(question)
				html += "</i>";
				
			html += "</p>";
		}
	}
				
	html += "</div></div></body></html>";
	document.write(html);
}