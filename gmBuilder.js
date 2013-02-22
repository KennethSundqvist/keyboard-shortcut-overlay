;var KSO_gmBuilder = (function() {
	var w = window,
		d = w.document,
		// Form element
		elForm,
		// HTML templates to render with. Use $placeholders
		templates = {
			group: {
			   type: 'div', className: 'gmBuilder_group',
			   html: '<div class="gmBuilder_group_title"><label>Group title <input name="groupTitle"></label></div>' +
			         '<table class="gmBuilder_group_shortcuts"><thead><tr><th>Shortcuts</th><th>Description</th><td></td></tr></thead><tbody></tbody></table>'
			},
			shortcut: {
				type: 'tr',
				html:'<td><input name="keys"></td><td><input name="desc"></td><td><button>Delete</button></td>'
			},
			addButton: {
				type: 'div', className: 'gmBuilder_addButton',
				html: '<button>$text</button>'
			}
		}
	
	function init(config) {
		var addGroupButton = renderTemplate(templates.addButton, { text: 'Add another group' })
		
		elForm = d.getElementById(config.formId)
		elForm.appendChild(addGroupButton)
		addGroupButton.addEventListener('click', function(e) {
			e.preventDefault();
			addNewGroup()
		}, false)
		
		addNewGroup()
	}
	
	function renderTemplate(template, content) {
		var el = d.createElement(template.type),
			html = template.html,
			key
		
		if (template.className) el.className = template.className
		
		for (key in content) {
			if (content.hasOwnProperty(key))
				html = html.replace('$' + key, content[key])
		}
		
		el.innerHTML = html
		
		return el
	}
	
	function addNewGroup() {
		var group = renderTemplate(templates.group, {}),
			shortcuts = group.querySelector('tbody'),
			shortcut = renderTemplate(templates.shortcut, {}),
			addShortcut = renderTemplate(templates.addButton, { text: 'Add more shortcuts' })
		
		addShortcut.addEventListener('click', function(e) {
			e.preventDefault();
			addMoreShortcuts(shortcuts, 3)
		}, false)
		
		shortcuts.appendChild(shortcut)
		group.appendChild(addShortcut)
		elForm.appendChild(group)
	}
	
	function addMoreShortcuts(group, numberOfShortcuts) {
		var shortcut,
			first = true
		
		while (numberOfShortcuts > 0) {
			shortcut = renderTemplate(templates.shortcut, {})
			group.appendChild(shortcut)
			if (first) shortcut.querySelector('input').focus()
			first = false
			numberOfShortcuts--
		}
	}
	
	return {
		init: init
	}
}());