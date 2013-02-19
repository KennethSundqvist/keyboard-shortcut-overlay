var KSO = (function() {
	var w = window,
		d = w.document,
		elOverlay,
		templates = {
//			wrap: '<div class="KBO_title">$title</div><div class="KBO_groups">$groups</div>',
			wrap: '<div class="KBO_inner"><div class="KBO_title">$title</div><div class="KBO_groups">$groups</div></div>',
			group: '<div class="KBO_group"><table><thead><td></td><td class="KBO_group_title">$title</td></tr></thead><tbody class="KBO_shortcuts">$shortcuts</tbody></table></div>',
			shortcut: '<tr><th>$keys :&nbsp;</th><td>$description</td></tr>'
		}
	
	function init(config) {
		var overlayHtml,
			groupsHtml = '',
			iGroups,
			iShortcuts
		
		for (iGroups = 0; iGroups < config.groups.length; iGroups++) {
			var shortcuts = config.groups[iGroups].shortcuts
			var shortcutsHtml = ''
			
			for (iShortcuts = 0; iShortcuts < shortcuts.length; iShortcuts++) {
				shortcutsHtml += templates.shortcut
					.replace('$keys', shortcuts[iShortcuts][0])
					.replace('$description', shortcuts[iShortcuts][1])
			}
			
			groupsHtml += templates.group
				.replace('$title', config.groups[iGroups].title)
				.replace('$shortcuts', shortcutsHtml)
		}
		
		overlayHtml = templates.wrap
			.replace('$title', config.title)
			.replace('$groups', groupsHtml)
			
		elOverlay = d.createElement('div')
		elOverlay.className = 'KBO'
		elOverlay.innerHTML = overlayHtml
		
		d.body.appendChild(elOverlay)
	}
	
	return {
		init: init
	}
}())