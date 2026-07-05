/**
	@file	: sitemap.js
	@author	: Niclas Frohagen	
	@date	: 050129
*/

var SITEMAP_XMLRoot = null;

function GetDocTypeScript()
{
	return '<!doctype html public \"-//W3C//DTD HTML 4.0 Transitional//EN\">';
}

function GetHeadScript()
{
	var html = '<head>';
	html += '<link href=\"css/style.css\" type=\"text/css\" rel=\"StyleSheet\">';
	html += '<script language=\"javascript\" src=\"js/sitemap.js\"></script>';
	html += '<script language=\"javascript\" src=\"js/scroll.js\"></script>';
	html += '</head>';
	
	return html;
}

function GetBodyScript()
{
	return '<body onload=\"SITEMAP_Create()\">';
}

function GetTitleScript()
{
	return '<p class=\"Title\">sitemap</p>';
}

function GetContainerScript()
{
	var html = '<div id=\"Container\">';
	html += '<div id=\"Content\">';
	
	return html;
}

function GetNavigationScript()
{
	var html = '<div class=\"UpControl\">';
	html += '<a onmousedown=\"SCROLL_ScrollElement(\'Container\', \'up\', 8);\" onmouseup=\"SCROLL_ScrollElement(\'Container\',\'up\',2);\" onmouseover=\"SCROLL_ScrollElement(\'Container\',\'up\',2);\" onmouseout=\"SCROLL_Stop();\">';
	html += '<img src=\"pictures/icon_up.jpg\" border=\"0\">';
	html += '</a></div>';
	html += '<div class=\"DownControl\">';
	html += '<a onmousedown=\"SCROLL_ScrollElement(\'Container\', \'down\', 8);\" onmouseup=\"SCROLL_ScrollElement(\'Container\',\'down\',2);\" onmouseover=\"SCROLL_ScrollElement(\'Container\',\'down\',2);\" onmouseout=\"SCROLL_Stop();\">';
	html += '<img src=\"pictures/icon_down.jpg\" border=\"0\">';
	html += '</a></div>';
	
	return html;
}

function SITEMAP_Create()
{
	SITEMAP_Init();
	SITEMAP_Show();
}

function SITEMAP_Init()
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
		xml_http_request.open("GET", "xml/menu.xml", false);
		xml_http_request.send(null);
		SITEMAP_XMLRoot = xml_http_request.responseXML.documentElement;
	}
	catch (e)
	{
		alert(e);
	}
}

function SITEMAP_Show()
{
	if (SITEMAP_XMLRoot)
	{
		var tab_str = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
		
		var html = GetDocTypeScript();
		html += GetHeadScript();
		html += GetBodyScript();
		html += GetNavigationScript();
		html += GetTitleScript();
		html += GetContainerScript();
		html += '<p class="Main">';
		
		// Build sitemap
		var menu_item_nodes = SITEMAP_XMLRoot.getElementsByTagName("menu_item")
		for(menu_item_id = 0; menu_item_id < menu_item_nodes.length; menu_item_id++)
		{
			var menu_path = SITEMAP_XMLRoot.getAttribute("name");
			
			if(menu_item_nodes[menu_item_id].parentNode == SITEMAP_XMLRoot)
			{
				menu_path += "|" + menu_item_nodes[menu_item_id].getAttribute("name");
			}
			else
			{
				menu_path += "|" + menu_item_nodes[menu_item_id].parentNode.getAttribute("name");
				menu_path += "|" + menu_item_nodes[menu_item_id].getAttribute("name");
				
				html += tab_str;
			}
				
			// Add menu_item	
			{
				var link = menu_item_nodes[menu_item_id].getAttribute("link");
				if(link)
				{
					html += "<a href=\"";
					html += "frame_bottom_right.html?menu=" + menu_path;
					html += "\" target=\"frame_bottom_right\"";
					html += " onclick=\"window.location.href=\'";
					html += menu_item_nodes[menu_item_id].getAttribute("link");
					html += "\';\">";
				}
					
				html += menu_item_nodes[menu_item_id].getAttribute("name");
				
				if(link)
					html += "</a>";
					
				html += "<br>";
			}
			
			// Check for window nodes
			if(menu_item_nodes[menu_item_id].parentNode != SITEMAP_XMLRoot)
			{
				var window_nodes = menu_item_nodes[menu_item_id].getElementsByTagName("window")
				for(window_id = 0; window_id < window_nodes.length; window_id++)
				{
					html += tab_str + tab_str;
					
					// Add window
					{
						var link = window_nodes[window_id].getAttribute("link");
						if(link)
						{
							html += "<a href=\"";
							html += "frame_bottom_right.html?menu=" + menu_path;
							html += "\" target=\"frame_bottom_right\"";
							html += " onclick=\"window.location.href=\'";
							html += window_nodes[window_id].getAttribute("link");
							html += "\';\">";
						}
							
						html += window_nodes[window_id].getAttribute("name");
						
						if(link)
							html += "</a>";
							
						html += "<br>";
					}
				}
			}
		}
		
		html += '</p></div></div></body></html>';
		document.write(html);
	}
}