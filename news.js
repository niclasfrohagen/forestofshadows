/**
	@file	: News.js
	@author	: Niclas Frohagen	
	@date	: 050127	
*/

var NEWS_XMLRoot	= null;

function NEWS_Create(type_str)
{
	NEWS_Init();

	if      (type_str == 'latest')  NEWS_ShowLatest();
	else if (type_str == 'main')    NEWS_ShowMain();
	else if (type_str == 'site')    NEWS_ShowSite();
	else if (type_str == 'related') NEWS_ShowRelated();
}

function NEWS_Init()
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
		xml_http_request.open("GET", "xml/news.xml", false);
		xml_http_request.send(null);
		NEWS_XMLRoot = xml_http_request.responseXML.documentElement;
	}
	catch (e)
	{
		alert(e);
	}
}

function GetDocTypeScript()
{
	return '<!doctype html public \"-//W3C//DTD HTML 4.0 Transitional//EN\">';
}

function GetHeadScript()
{
	var html = '<head>';
	html += '<link href=\"css/style.css\" type=\"text/css\" rel=\"StyleSheet\">';
	html += '<script language=\"javascript\" src=\"js/news.js\"></script>';
	html += '<script language=\"javascript\" src=\"js/scroll.js\"></script>';
	html += '</head>';
	
	return html;
}

function GetBodyScript(type_str)
{
	return '<body onLoad=\"NEWS_Create(\'' + type_str + '\')\" border=\"0\">';
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

function GetTitleScript(sub_title)
{
	var html = '<p class=\"Title\">news</p>';
	html += '<p class=\"SubTitle\">'+sub_title+'</p>';
	
	return html;
}

function GetContainerScript()
{
	var html = '<div id=\"Container\">';
	html += '<div id=\"Content\">';
	
	return html;
}

function GetArchiveItems(archive_name)
{
	var archives = NEWS_XMLRoot.getElementsByTagName("archive");
	for(archive_id = 0; archive_id < archives.length; archive_id++)
	{
		if(archives[archive_id].getAttribute("name") == archive_name)
			return archives[archive_id].getElementsByTagName("item");
	}
	
	return null;		
}

function NEWS_ShowLatest()
{
	if (NEWS_XMLRoot)
	{
		var html = GetDocTypeScript();
		html += '<html>';
		html += GetHeadScript();
		html += '<body class=\"frame_center_right\" onLoad=\"NEWS_Create(\'latest\')\">';
		html += '<p class=\"Title\">forestofshadows.com</p>';
		html += '<p class=\"frame\">';
		html += '<b>latest news...</b>';
		html += '<br>&nbsp;<br>';
		
		// Main
		{
			html += "<b>main | </b>";
			var archive_items = GetArchiveItems('main');
			if(archive_items)
			{
				html += "<b>";
				html += archive_items.item(0).getAttribute("date");
				html += " - ";
				html += archive_items.item(0).getAttribute("title");
				html += "</b><br>";
				html += archive_items.item(0).firstChild.nodeValue;
			}
		}
		
		html += "<br>&nbsp;<br>";
		
		// Site
		{
			html += "<b>site | </b>";
			var archive_items = GetArchiveItems('site');
			if(archive_items)
			{
				html += "<b>";
				html += archive_items.item(0).getAttribute("date");
				html += " - ";
				html += archive_items.item(0).getAttribute("title");
				html += "</b><br>";
				html += archive_items.item(0).firstChild.nodeValue;
			}
		}
		
		html += "<br>&nbsp;<br>";
			
		html += '</p></body></html>';
		document.write(html);
	}
}

function NEWS_ShowMain()
{
	if (NEWS_XMLRoot)
	{
		var html = GetDocTypeScript();
		html += '<html>';
		html += GetHeadScript();
		html += GetBodyScript('main');
		html += GetNavigationScript();
		html += GetTitleScript('band');
		html += GetContainerScript();
		
		var archive_items = GetArchiveItems('main');
		if(archive_items)
		{
			for(i = 0; i < archive_items.length; i++)
			{
				html += '<p class=\"Main\">';
				html += '<b>' + archive_items.item(i).getAttribute("date") + ' - ' + archive_items.item(i).getAttribute("title") + '</b><br>';
				html += archive_items.item(i).firstChild.nodeValue;
				html += '</p>';
			}
		}
		
		html += '<br></div></div></body></html>';
		
		document.write(html);
	}
}

function NEWS_ShowSite()
{
	if (NEWS_XMLRoot)
	{
		var html = GetDocTypeScript();
		html += '<html>';
		html += GetHeadScript();
		html += GetBodyScript('site');
		html += GetNavigationScript();
		html += GetTitleScript('site');
		html += GetContainerScript();
		
		var archive_items = GetArchiveItems('site');
		if(archive_items)
		{
			for(i = 0; i < archive_items.length; i++)
			{
				html += '<p class="Main">';
				html += '<b>' + archive_items.item(i).getAttribute("date") + ' - ' + archive_items.item(i).getAttribute("title") + '</b><br>';
				html += archive_items.item(i).firstChild.nodeValue;
				html += '</p>';
			}
		}
					
		html += '</div></div></body></html>';
		
		document.write(html);
	}
}

function NEWS_ShowRelated()
{
	if (NEWS_XMLRoot)
	{
		var html = GetDocTypeScript();
		html += '<html>';
		html += GetHeadScript();
		html += GetBodyScript('related');
		html += GetNavigationScript();
		html += GetTitleScript('related');
		html += GetContainerScript();
		
		var archive_items = GetArchiveItems('related');
		if(archive_items)
		{
			for(i = 0; i < archive_items.length; i++)
			{
				html += '<p class="Main">';
				html += '<b>' + archive_items.item(i).getAttribute("date") + ' - ' + archive_items.item(i).getAttribute("title") + '</b><br>';
				html += archive_items.item(i).firstChild.nodeValue;
				html += '</p>';
			}
		}
		
		html += '</div></div></body></html>';
		
		document.write(html);
	}
}