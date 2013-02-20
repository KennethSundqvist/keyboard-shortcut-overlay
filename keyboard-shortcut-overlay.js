var KSO = (function() {
	var w = window,
		d = w.document,
		// Index of all the shortcut descriptions
		// and element references used for fuzzy matching
		shortcutsIndex = [],
		// The overlay element
		elOverlay,
		// The filter input element
		elFilter,
		// Current filter value
		currentFilter,
		// Boolean, if the overlay is visible
		visible,
		// Timers for showing/hiding overlay animation
		showTimer,
		hideTimer,
		// HTML templates to render with. Use $placeholders
		templates = {
			wrap: '<div class="KSO_inner"><div class="KSO_title">$title</div>$filter<div class="KSO_groups">$groups</div></div>',
			group: '<div class="KSO_group"><table><thead><td></td><td class="KSO_group_title">$title</td></tr></thead><tbody class="KSO_shortcuts">$shortcuts</tbody></table></div>',
			shortcut: '<tr><th>$keys :&nbsp;</th><td>$description</td></tr>',
			filter: '<label class="KSO_filter">Filter: <input/></label>'
		}
	
	function init(config) {
		// Show or hide the overlay when the ? key is pressed
		d.addEventListener('keydown', function(e) {
			// FIXME does this work on any keyboard layout, or just mine?
			if (e.keyCode === 191 && e.shiftKey === true) {
				e.preventDefault()
				// Toggle visibility if overlay exists
				if (elOverlay) {
					toggleOverlayVisibility()
				}
				// Only create the overlay if it's called for
				else {
					setupGui()
					visible = true
				}
			}
		}, false)
	}
	
	function setupGui() {
			// Rendered HTML
		var overlayHtml,
			groupsHtml = '',
			shortcutsHtml,
			// The shortcuts of each group to parse
			shortcuts,
			// All the shortcuts element references
			shortcutsElements,
			// Counters
			i,
			x
		
		
		// Render GUI
		
		// For all groups
		for (i = 0; i < config.groups.length; i++) {
			shortcuts = config.groups[i].shortcuts
			shortcutsHtml = ''
			
			// For all shortcuts in each group
			for (x = 0; x < shortcuts.length; x++) {
				// Render shortcut HTML
				shortcutsHtml += templates.shortcut
					.replace('$keys', shortcuts[x][0])
					.replace('$description', shortcuts[x][1])
			}
			
			// Render group HTML
			groupsHtml += templates.group
				.replace('$title', config.groups[i].title)
				.replace('$shortcuts', shortcutsHtml)
		}
		
		// Render overlay HTML
		overlayHtml = templates.wrap
			.replace('$title', config.title)
			.replace('$filter', templates.filter)
			.replace('$groups', groupsHtml)
			
		elOverlay = d.createElement('div')
		elOverlay.className = 'KSO KSO_hidden'
		elOverlay.innerHTML = overlayHtml
		elFilter = elOverlay.getElementsByTagName('input')[0]
		
		
		// Events
		
		// Filter shortcuts when the filter input value changes
		elFilter.addEventListener('keydown', filterShortcuts, false)
		elFilter.addEventListener('change', filterShortcuts, false)
		
		// Hide the overlay when the Escape key is pressed
		d.addEventListener('keydown', function(e) {
			if (visible && e.keyCode === 27) {
				toggleOverlayVisibility()
			}
		}, false)
		
		
		// Get shortcuts
		
		shortcutsElements = elOverlay.querySelectorAll('.KSO_shortcuts td')
		for (i = 0; i < shortcutsElements.length; i++) {
			shortcutsIndex.push({
				el: shortcutsElements[i].parentElement,
				desc: shortcutsElements[i].innerText.toLowerCase()
			})
		}
		
		// Add it to page
		
		d.body.appendChild(elOverlay)
		toggleOverlayVisibility()
	}
	
	function toggleOverlayVisibility() {
		clearTimeout(showTimer)
		clearTimeout(hideTimer)
		
		// Hide overlay
		if (visible) {
			elFilter.blur()
			elOverlay.className += ' KSO_hidden'
			hideTimer = setTimeout(function() {
					elOverlay.style.display = 'none'
			}, 1000)
		// Show overlay
		} else {
			elOverlay.style.display = 'block'
			// Use a timeout to make sure the element is displayed
			showTimer = setTimeout(function() {
				elFilter.focus()
				elOverlay.className = elOverlay.className.replace(/ KSO_hidden/g, '')
			}, 1)
		}
		
		visible = visible ? false : true
	}
	
	function filterShortcuts() {
		var input = elFilter.value.toLowerCase(),
			match,
			i,
			x
		
		if (input === currentFilter) {
			return
		}
		currentFilter = input
		
		// No filtering
		if (input.match(/^\s*$/)) {
			elOverlay.className = elOverlay.className.replace(/\sKSO_filtered/g, '')
		} else {
			// Filter based on whitespace separated strings
			input = input.split(/\s+/)
			
			// Match each shortcut
			for (i = 0; i < shortcutsIndex.length; i++) {
				match = null;
				// Match against each string
				for (x = 0; x < input.length; x++) {
					if (match !== false && input[x]) {
						if (shortcutsIndex[i].desc.indexOf(input[x]) > -1) {
							match = true
						}
						else {
							match = false
						}
					}
				}
				
				if (match) {
					shortcutsIndex[i].el.className = 'KSO_matched'
				} else {
					shortcutsIndex[i].el.className = ''
				}
			}
			
			elOverlay.className += ' KSO_filtered'
		}
	}
	
	return {
		init: init
	}
}())