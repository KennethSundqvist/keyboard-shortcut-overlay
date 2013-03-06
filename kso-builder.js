;var KSO_builder = (function() {
    var w = window,
        d = w.document,
        // Output element
        elOutput = d.getElementById('js-output'),
        // Input element
        elInput = d.getElementById('js-input'),
        // Form element
        elForm = d.getElementById('js-shortcutsConf'),
        // Form groups element
        elGroups,
        // HTML templates to render with. Use $placeholders
        templates = {
            configTitle: {
                type: 'div', className: 'ksoBuilder_configTitle',
                html: '<label>Overlay title <input name="configTitle" type="text"></label>'
            },
            groups: {
                type: 'div', className: 'ksoBuilder_groups'
            },
            group: {
                type: 'div', className: 'ksoBuilder_group',
                html: '<div class="ksoBuilder_group_title"><label>Group title <input name="groupTitle" type="text"></label> <button data-trigger="deleteGroup">Delete group</button></div>' +
                      '<table class="ksoBuilder_group_shortcuts"><thead><tr><th>Shortcuts</th><th>Description</th><td></td></tr></thead><tbody></tbody></table>'
            },
            shortcut: {
                type: 'tr',
                html: '<td><input name="keys" type="text"></td><td><input name="desc" type="text"></td><td><button data-trigger="deleteShortcut">Delete</button></td>'
            },
            addButton: {
                type: 'div',
                html: '<button data-trigger="$trigger">$text</button>'
            },
            submitButton: {
                type: 'div',
                html: '<input type="submit" value="Generate KSO">'
            }
        },
        // RegExp to extract the configuration when loading shortcuts
        loadRegExp = /\/\*BEGIN_SHORTCUTS\*\/(.+)\/\*END_SHORTCUTS\*\//
        
    
    function init() {
        elGroups = renderTemplate(templates.groups)
        
        elForm.appendChild(renderTemplate(templates.configTitle))
        elForm.appendChild(elGroups)
        elForm.appendChild(renderTemplate(templates.addButton, { text: 'Add another group', trigger: 'addGroup' }))
        elForm.appendChild(renderTemplate(templates.submitButton))
        
        d.getElementById('js-inputSubmit').addEventListener('click', loadShortcuts, false)
        
        elForm.addEventListener('click', function(e) {
            var trigger = e.target.getAttribute('data-trigger')
            if (!trigger) return
            e.preventDefault()
            
            switch (trigger) {
                case 'addGroup': addGroup(); break
                case 'deleteGroup': deleteGroup(e.target.parentElement.parentElement); break
                case 'addShortcuts': addShortcuts(e.target.parentElement.parentElement.querySelector('tbody'), 5); break
                case 'deleteShortcut': deleteShortcut(e.target.parentElement.parentElement); break
            }
        }, false)
        
        elForm.addEventListener('submit', parseForm, false)
        
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
    
    function parseForm(e) {
        var newConfig = { groups: [] },
            group,
            shortcut
        
        e.preventDefault()
        
        Array.prototype.forEach.call(elForm.querySelectorAll('input[type=text]'), function(input) {
            var value = input.value
            
            switch (input.getAttribute('name')) {
                case 'configTitle':
                    newConfig.title = value
                    break
                    
                case 'groupTitle':
                    group = {
                        title: value,
                        shortcuts: []
                    }
                    newConfig.groups.push(group)
                    break
                
                case 'keys':
                    shortcut = [value]
                    group.shortcuts.push(shortcut)
                    break
                
                case 'desc':
                    shortcut[1] = value
                    break
            }
        })
        
        elOutput.value = 'KSO code before /*BEGIN_SHORTCUTS*/' +
                         JSON.stringify(newConfig) +
                         '/*END_SHORTCUTS*/ KSO code after'
    }
    
    function loadShortcuts() {
        var config = JSON.parse(elInput.value.match(loadRegExp)[1])
    }
    
    return {
        init: init
    }
}());