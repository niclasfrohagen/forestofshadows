/**
	@file	: reviews.js
	@author	: Niclas Frohagen	
	@date	: 050127	
*/

var REVIEWS_XMLRoot = null;

function GetDocTypeScript()
{
	return '<!doctype html public \"-//W3C//DTD HTML 4.0 Transitional//EN\">';
}

function GetHeadScript()
{
	var html = '<head>';
	html += '<link href=\"css/style.css\" type=\"text/css\" rel=\"StyleSheet\">';
	html += '<script language=\"javascript\" src=\"js/reviews.js\"></script>';
	html += '<script language=\"javascript\" src=\"js/scroll.js\"></script>';
	html += '</head>';
	
	return html;
}

function GetBodyScript()
{
	return '<body onload=\"REVIEWS_Create()\">';
}

function GetTitleScript()
{
	var html = '<p class=\"Title\">press</p>';
	html += '<p class=\"SubTitle\">reviews</p>';
	
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
	html += "<a href=\"press_reviews.html\">";
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

function REVIEWS_Create()
{
	REVIEWS_Init();
	REVIEWS_Show();
}

function REVIEWS_Init()
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
		xml_http_request.open("GET", "xml/reviews.xml", false);
		xml_http_request.send(null);
		REVIEWS_XMLRoot = xml_http_request.responseXML.documentElement;
	}
	catch (e)
	{
		alert(e);
	}
}

function REVIEWS_Show()
{
	if (REVIEWS_XMLRoot)
	{
		// Get value from address bar
		var index = window.location.href.indexOf("?");
		if(index != -1)
		{
			var str = window.location.href.substr(index + 1);
			
			var values = str.split("=");
			if((values.length > 1) && values[1].length)
				REVIEWS_ShowItem(values[1]);
		}
		else
		{
			REVIEWS_ShowList();
		}
	}
}

function REVIEWS_ShowList()
{
	var html = GetDocTypeScript();
	html += GetHeadScript();
	html += GetBodyScript();
	html += GetNavigationScript(false);
	html += GetTitleScript();
	html += GetContainerScript();
	
	var album_nodes = REVIEWS_XMLRoot.getElementsByTagName("album");
	for(album_id = 0; album_id < album_nodes.length; album_id++)
	{
		var item_nodes = album_nodes[album_id].getElementsByTagName("item");
		if(item_nodes.length)
		{
			html += "<p class=\"Main\">";
			html += "<b>" + album_nodes[album_id].getAttribute("name") + "</b><br>";
			
			for(i = 0; i < item_nodes.length; i++)
			{
				var review_id = album_id + ":" + i;
								
				html += '<a href="press_reviews.html?id=' + review_id + '">';
				html += item_nodes.item(i).getAttribute("date");
				html += " - ";
				html += item_nodes.item(i).getAttribute("zine");
				
				// RATING
				{
					var rating = item_nodes.item(i).getAttribute("rating");
					if((rating != "") && (rating != null))
						html += " [" + rating + "]";
				}
				
				html += "<br>";
				html += "</a>";
			}
			
			html += "</p>";
		}
	}
	
	html += "<br></div></div></body></html>";
	document.write(html);
}

function REVIEWS_ShowItem(id)
{
	var html = GetDocTypeScript();
	html += GetHeadScript();
	html += GetBodyScript();
	html += GetNavigationScript(true);
	html += GetTitleScript();
	html += GetCloseWindowScript();
	html += GetContainerScript();
	
	var ids = id.split(":");
	if(ids.length == 2)
	{
		var album_node = null;
		{
			var album_nodes = REVIEWS_XMLRoot.getElementsByTagName("album");
			if(album_nodes && (ids[0] < album_nodes.length))
				album_node = album_nodes[ids[0]];
		}
		
		if(album_node)
		{
			var item_node = null;
			{
				var item_nodes = album_node.getElementsByTagName("item");
				if(item_nodes && (ids[1] < item_nodes.length))
					item_node = item_nodes[ids[1]];
			}
			
			if(item_node)
			{
				var author	= item_node.getAttribute("author");
				var zine	= item_node.getAttribute("zine");
				var rating	= item_node.getAttribute("rating");
						
				html += "<p class=\"Main\"><b>";
				html += album_node.getAttribute("name");
				html += "</b> reviewed by <b>";
				
				if((author != "") && (author != null))
					html += author + "</b> for <b>";
				
				html += zine;
				
				html += "</b>";
				
				if((rating != "") && (rating != null))
					html += " [" + rating + "]";
						
				html += "</p>";
				
				var p_nodes = item_node.getElementsByTagName("p");
				if(p_nodes)
				{
					for(i = 0; i < p_nodes.length; i++)
					{
						html += "<p class=\"Main\">";
						html += p_nodes[i].firstChild.nodeValue;
						html += "</p>";
					}
				}
			}
		}
	}
	else
	{
		alert("ERROR: Failed to show item");
	}
	
	html += "<br></div></div></body></html>";
	document.write(html);
}