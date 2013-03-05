;var KSO_builder = (function() {
	var w = window,
		d = w.document,
		// Form element
		elForm,
		// Form groups element
		elGroups,
		// HTML templates to render with. Use $placeholders
		templates = {
			groups: {
			   type: 'div', className: 'ksoBuilder_groups'
			},
			group: {
			   type: 'div', className: 'ksoBuilder_group',
			   html: '<div class="ksoBuilder_group_title"><label>Group title <input name="groupTitle"></label> <button data-trigger="deleteGroup">Delete group</button></div>' +
			         '<table class="ksoBuilder_group_shortcuts"><thead><tr><th>Shortcuts</th><th>Description</th><td></td></tr></thead><tbody></tbody></table>'
			},
			shortcut: {
				type: 'tr',
				html:'<td><input name="keys"></td><td><input name="desc"></td><td><button data-trigger="deleteShortcut">Delete</button></td>'
			},
			addButton: {
				type: 'div', className: 'ksoBuilder_addButton',
				html: '<button data-trigger="$trigger">$text</button>'
			}
		}
	
	function init(config) {
		elForm = d.getElementById(config.formId)
		elGroups = renderTemplate(templates.groups)
		
		elForm.appendChild(renderTemplate(templates.addButton, { text: 'Add another group', trigger: 'addGroup' }))
		elForm.appendChild(elGroups)
		elForm.appendChild(renderTemplate(templates.addButton, { text: 'Add another group', trigger: 'addGroup' }))
		
		elForm.addEventListener('click', function(e) {
			var trigger = e.target.getAttribute('data-trigger')
			if (!trigger) return
			e.preventDefault();
			
			switch (trigger) {
				case 'addGroup': addGroup(); break
				case 'deleteGroup': deleteGroup(e.target.parentElement.parentElement); break
				case 'addShortcuts': addShortcuts(e.target.parentElement.parentElement.querySelector('tbody'), 5); break
				case 'deleteShortcut': deleteShortcut(e.target.parentElement.parentElement); break
			}
		}, false)
		
		addGroup()
	}
	
	function renderTemplate(template, content) {
		var el = d.createElement(template.type),
			html = template.html,
			key
		
		if (template.className) el.className = template.className
		
		if (html) {
            for (key in content) {
                if (content.hasOwnProperty(key))
                    html = html.replace('$' + key, content[key])
            }
            
            el.innerHTML = html
		}
		
		return el
	}
	
	function addGroup() {
		var group = renderTemplate(templates.group),
			shortcuts = group.querySelector('tbody'),
			shortcut = renderTemplate(templates.shortcut, {}),
			addShortcut = renderTemplate(templates.addButton, { text: 'Add more shortcuts', trigger: 'addShortcuts' })
		
		shortcuts.appendChild(shortcut)
		group.appendChild(addShortcut)
		elGroups.appendChild(group)
	}
	
	function deleteGroup(elGroup) {
		var groupTitle = elGroup.querySelector('input[name=groupTitle]').value
		
		if (confirm('Delete the group "' + groupTitle + '"?')) {
			elGroup.remove()
			
			if (d.querySelectorAll('.ksoBuilder_group').length === 0) {
				addGroup()
			}
		}
	}
	
	function addShortcuts(group, numberOfShortcuts) {
		var shortcut,
			i = 0
		
		for ( ; i < numberOfShortcuts; i++) {
			shortcut = renderTemplate(templates.shortcut)
			group.appendChild(shortcut)
			if (i === 0) shortcut.querySelector('input').focus()
		}
	}
	
	function deleteShortcut(elShortcut) {
		var elGroup = elShortcut.parentElement
		
		elShortcut.remove()
		
		if (elGroup.children.length === 0) {
			addShortcuts(elGroup, 1)
		}
	}
	
	return {
		init: init
	}
}());