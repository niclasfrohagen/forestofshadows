/**
	@file	: History.js
	@author	: Niclas Frohagen	
	@date	: 080916	
*/

var HISTORY_XMLRoot = null;

function GetDocTypeScript()
{
	return '<!doctype html public \"-//W3C//DTD HTML 4.0 Transitional//EN\">';
}

function GetHeadScript()
{
	var html = '<head>';
	html += '<link href=\"css/style.css\" type=\"text/css\" rel=\"StyleSheet\">';
	html += '<script language=\"javascript\" src=\"js/history.js\"></script>';
	html += '<script language=\"javascript\" src=\"js/scroll.js\"></script>';
	html += '</head>';
	
	return html;
}

function GetBodyScript()
{
	return '<body onLoad=\"HISTORY_Create()\">';
}

function GetTitleScript()
{
	var html = '<p class=\"Title\">biography</p>';
	html += '<p class=\"SubTitle\">history</p>';
	
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
	html += "<a href=\"bio_history.html\">";
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

function HISTORY_Create()
{
	HISTORY_Init();
	HISTORY_Show();
}

function HISTORY_Init()
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
		xml_http_request.open("GET", "xml/history.xml", false);
		xml_http_request.send(null);
		HISTORY_XMLRoot = xml_http_request.responseXML.documentElement;
	}
	catch (e)
	{
		alert(e);
	}
}

function HISTORY_Show()
{
	if (HISTORY_XMLRoot)
	{
		// Get value from address bar
		var index = window.location.href.indexOf("?");
		if(index != -1)
		{
			var str = window.location.href.substr(index + 1);
					
			var values = str.split("=");
			if((values.length > 1) && values[1].length)
				HISTORY_ShowChapter(parseInt(values[1]));
		}
		else
		{
			HISTORY_ShowList();
		}
	}
}

function HISTORY_ShowList()
{
	var html = GetDocTypeScript();
	html += GetHeadScript();
	html += GetBodyScript();
	html += GetNavigationScript(false);
	html += GetTitleScript();
	html += GetContainerScript();
	
	html += '<p class=\"Main\"><b>the history of forest of shadows as told by niclas frohagen ...</b></p>';
	var chapter_nodes = HISTORY_XMLRoot.getElementsByTagName("chapter");
	for(i = 0; i < chapter_nodes.length; i++)
	{
		html += '<b>chapter ';
		if(i < 10) html += '0';
		html += i + ' | </b>';
		html += '<a href="bio_history.html?id=' + i + '">';
		html += chapter_nodes.item(i).getAttribute("name");
		html += ' (' + chapter_nodes.item(i).getAttribute("year") + ')';
		html += '</a><br>';
	}
	
	html += "</p></div></div></body></html>";
	document.write(html);
}

function HISTORY_ShowChapter(id)
{
	var html = GetDocTypeScript();
	html += GetHeadScript();
	html += GetBodyScript();
	html += GetNavigationScript(true);
	html += GetTitleScript();
	html += GetCloseWindowScript();
	html += GetContainerScript();
	
	var chapter_node = null;
	
	var chapter_nodes = HISTORY_XMLRoot.getElementsByTagName("chapter");
	if(chapter_nodes && (id < chapter_nodes.length))
		chapter_node = chapter_nodes[id];
	
	if(chapter_node)
	{
		html += '<p class=\"Main\">';
		html += '<b>chapter ';
		if(id < 10) html += '0';
		html += id + ' | </b>';
		html += chapter_node.getAttribute("name");
		html += "</p>";
		
		var p_nodes = chapter_node.getElementsByTagName("p");
		for(i = 0; i < p_nodes.length; i++)
		{
			html += "<p class=\"Main\">";
			html += p_nodes[i].firstChild.nodeValue;
			html += "</p>";
		}
		
		// Footer
		if(id != 0)
		{
			html += "<p class=\"menu\">";
			
			var has_previous = false;
			if(id > 1)
			{
				html += "<a href=\"bio_history.html?id=" + (id - 1) + "\">";
				html += "<< previous";
				html += "</a>";
				has_previous = true;
			}
				
			if(id < (chapter_nodes.length - 1))
			{
				if(has_previous)
					html += " | ";
				
				html += "<a href=\"bio_history.html?id=" + (id + 1) + "\">";
				html += "next >>";
				html += "</a>";
			}
				
			html += "</p>";
		}
	}
				
	html += "</div></div></body></html>";
	document.write(html);
}
