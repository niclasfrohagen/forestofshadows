/**
	@file	: Menu.js
	@author	: Niclas Frohagen	
	@date	: 050129
*/

var MENU_XMLRoot	= null;
var MENU_Selected	= null;

function MENU_Create()
{
	MENU_Init();
	MENU_Show();
}

function MENU_InitGlobalParams()
{
	// Init selected
	{
		// Extract Variables out of address bar
		var str = (window.location.href.indexOf("?") + 1) ?
				  (window.location.href.substr(window.location.href.indexOf("?") + 1)) :
				  "";
				  
		if(str.length)
		{
			var split_str = str.split("=");
			if(split_str[1].length)
			{
				MENU_Selected = split_str[1];
				//alert('MENU_Selected='+MENU_Selected);
			}
		}
	}
	
	// Get xml-root
	{
		if(!MENU_XMLRoot && document.implementation)
			MENU_XMLRoot = document.implementation.documentElement;
	}
}

function MENU_Init()
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
		MENU_XMLRoot = xml_http_request.responseXML.documentElement;
	}
	catch (e)
	{
		alert(e);
	}
}

function MENU_GetSubMenusTo(menu_item)
{
	if(menu_item)
		return menu_item.getElementsByTagName("menu_item");
		
	return null;
}

function MENU_GetSubMenusToSelected()
{	
	return MENU_GetSubMenusTo(MENU_GetSelectedMenuItem());
}

function MENU_GetParentTo(menu_item)
{
	if(menu_item && (menu_item != MENU_XMLRoot))
		return menu_item.parentNode;
	
	return null;
}

function MENU_GetParentToSelected()
{
	return MENU_GetParentTo(MENU_GetSelectedMenuItem());
}

function MENU_GetPath(menu_item)
{
	var path = menu_item.getAttribute("name");
	if(menu_item != MENU_XMLRoot)
	{
		for(iter = menu_item.parentNode; iter != MENU_XMLRoot; iter = iter.parentNode)
			path = iter.getAttribute("name") + '|' + path;
			
		path = MENU_XMLRoot.getAttribute("name") + '|' + path;
	}
		
	return path;
}

function MENU_Show()
{	
	if (MENU_XMLRoot)
	{
		MENU_InitGlobalParams();
		
		var html = '<!doctype html public \"-//W3C//DTD HTML 4.0 Transitional//EN\"><html>';
		html += '<head>';
		html += '<link href=\"css/style.css\" type=\"text/css\" rel=\"StyleSheet\">';
		html += '<script language=\"javascript\" src=\"js/menu.js\"></script>';
		html += '</head>';
		html += '<body class=\"frame_bottom_right\" onload=\"MENU_Create()\">';
		html += '<p class=\"menu\">';
		
		var menu_node = MENU_GetSelectedMenuItem();
		var sub_menus = MENU_GetSubMenusTo(menu_node);
		if(sub_menus.length == 0) // assume leaf selected
		{
			menu_node = menu_node.parentNode;
			sub_menus = MENU_GetSubMenusTo(menu_node);
		}
			
		// If we have a parent create a link to it
		var parent = MENU_GetParentTo(menu_node);
		if(parent)
		{
			var parent_path = MENU_GetPath(parent);
			var parent_link = parent.getAttribute("link");
			
			if(parent_path && parent_link)
			{
				html += '<a class="menu" ';
				html += 'href="' + parent_link + '" ';
				html += 'onclick="MENU_Select(\'' + parent_path + '\')" ';
				html += 'target=\"frame_center_right\">';
				html += '<< back';
				html += '</a>';
				html += ' | ';
			}
		}
		
		// Build menu
		{
			if(sub_menus)
			{
				var first = true;
				for(i = 0; i < sub_menus.length; i++)
				{
					if(sub_menus[i].parentNode == menu_node)
					{
						var link = sub_menus[i].getAttribute("link");
						var path = MENU_GetPath(sub_menus[i]);
						
						if(link && link.length && path)
						{
							html += '<a class="menu" ';
							html += 'href="' + link + '" ';
							html += 'onclick="MENU_Select(\'' + path + '\')" ';
							html += 'target=\"frame_center_right\">';
						}
						
						if(first)
						{
							first = false;
						}
						else
						{
							html +=	' | ';
						}
						
						html += sub_menus[i].getAttribute("name");
						
						if(link && link.length)
						{
							html += '</a>';
						}
					}
				}
			}
		}
		
		html += '</p></body></html>';
		document.write(html);
	}
}

function MENU_Select(path)
{
	//alert('MENU_Select('+path+')');
	window.location.href = "frame_bottom_right.html?menu=" + path;
}

function MENU_GetSelectedMenuItem()
{
	var menu_item = null;
	if(!MENU_Selected)
	{
		menu_item = MENU_XMLRoot;
	}
	else
	{
		if(MENU_Selected.search('|') != -1)
		{
			var menu_names = MENU_Selected.split('|');
			var selected_menu_item_name = menu_names[menu_names.length - 1];
			
			var menu_items = MENU_XMLRoot.getElementsByTagName("menu_item");
			for(i = 0; i < menu_items.length; i++)
			{
				if(menu_items[i].getAttribute("name") == selected_menu_item_name)
				{
					var parent_check = true;
					if(menu_names.length == 3)
					{
						parent_check = false;
						if(menu_items[i].parentNode.getAttribute("name") == menu_names[menu_names.length - 2])
							parent_check = true;
					}
					
					if(parent_check)
					{
						menu_item = menu_items[i];
						break;
					}
				}
			}
			
			if(menu_item == null)
				menu_item = MENU_XMLRoot;
		}
		else // Assume root is selected
		{
			menu_item = MENU_XMLRoot;
		}
	}
	
	return menu_item;
}
