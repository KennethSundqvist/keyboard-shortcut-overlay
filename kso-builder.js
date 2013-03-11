;var KSO_builder = (function($) {
    var w = window,
        d = w.document,
        // Form for loading an existing config into the config editor
        $loadForm = $('#js-configLoader'),
        // Error messages in the config loading form will be printed in this element
        $loadErrorMessage = $('.errorMessage', $loadForm),
        // The generated code will be printed in this textarea element
        $output = $('#js-configOutput'),
        // The form for editing a config
        $editorForm = $('#js-configEditor'),
        // Title in the config form
        $editorTitle,
        // Holds all groups in the config editor form
        $editorGroups,
        // HTML templates.
        // The templates can have placeholders, and they are formatted as "$placeholder"
        templates = {
            configTitle: '<div class="ksoBuilder_configTitle"><label>Overlay title <input name="configTitle" type="text"></label></div>',
            groups: '<div class="ksoBuilder_groups"></div>',
            group: '<div class="ksoBuilder_group">' +
                       '<div class="ksoBuilder_group_title">' +
                           '<label>Group title <input name="groupTitle" type="text" value="$title"></label> ' +
                           '<button data-trigger="deleteGroup">Delete group</button>' +
                       '</div><table class="ksoBuilder_group_shortcuts"><thead><tr><th>Shortcuts</th><th>Description</th><td></td></tr></thead><tbody></tbody></table></div>',
            shortcut: '<tr><td><input name="keys" type="text" value="$keys"></td><td><input name="desc" type="text" value="$desc"></td><td><button data-trigger="deleteShortcut">Delete</button></td></tr>',
            addButton: '<div><button data-trigger="$trigger">$text</button></div>',
            submitButton: '<div><input type="submit" value="Generate KSO"></div>'
        },
        // RegExp to extract the configuration when loading a config
        loadRegExp = /\/\*BEGIN_CONFIG\*\/(.+)\/\*END_CONFIG\*\//
        
    
    function init(config) {
        $editorTitle = template('configTitle')
        $editorGroups = template('groups')
        
        $editorForm.append(
            $editorTitle,
            $editorGroups,
            template('addButton', { text: 'Add another group', trigger: 'addGroup' }),
            template('submitButton')
        )
        
        $loadForm.on('submit', function(e) {
            var config
            
            e.preventDefault()
            
            try { config = $('textarea', e.target).val().match(loadRegExp)[1] }
            catch (err) { $loadErrorMessage.html('Load error: Could not find the configuration.'); return }

            try { config = JSON.parse(config) }
            catch (err) { $loadErrorMessage.html('Load error: Configuration is not valid JSON.'); return }
            
            loadConfig(config)
        })
        
        $editorForm.on('click', function(e) {
            var $target = $(e.target),
                trigger = $target.attr('data-trigger')
            
            if (!trigger) return
            e.preventDefault()
            
            switch (trigger) {
                case 'addGroup': addGroup(); break
                case 'deleteGroup': deleteGroup($target.parents('.ksoBuilder_group')); break
                case 'addShortcuts': addShortcuts($('tbody', $target.parents('.ksoBuilder_group')), 5); break
                case 'deleteShortcut': deleteShortcut($target.parents('tr').eq(0)); break
            }
        })
        
        $editorForm.on('submit', outputEditorForm)
        
        if (config) loadConfig(config)
        else addGroup()
    }
    
    // Takes the name of a template and the data to populate
    // it with, and then returns a populated jQuery object of if.
    // The data is an object with its key names corresponding
    // to placeholders in the template.
    // The value of each key should be a string or a number.
    function template(template, data) {
        template = templates[template]
        
        for (var key in data) {
            if (data.hasOwnProperty(key))
                template = template.replace('$' + key, data[key])
        }
        
        return $(template)
    }
    
    function addGroup(config) {
        var $group = template('group', { title: (config && config.title) || '' }),
            $shortcuts = $('tbody', $group),
            $addShortcut = template('addButton', { text: 'Add more shortcuts', trigger: 'addShortcuts' })
        
        if (config && config.shortcuts && config.shortcuts.length) {
            $(config.shortcuts).each(function() {
                $shortcuts.append(template('shortcut', { keys: this[0], desc: this[1] }))
            })
        }
        else {
            $shortcuts.append(template('shortcut', { keys: '', desc: '' }))
        }
        
        $group
            .append($addShortcut)
            .appendTo($editorGroups)
    }
    
    function deleteGroup($group) {
        var groupTitle = $('input[name=groupTitle]', $group).val()
        
        if (confirm('Delete the group "' + groupTitle + '"?')) {
            $group.remove()
            
            if ($('.ksoBuilder_group').length === 0) {
                addGroup()
            }
        }
    }
    
    function addShortcuts($group, numberOfShortcuts) {
        var $shortcut,
            i = 0
        
        for ( ; i < numberOfShortcuts; i++) {
            $shortcut = template('shortcut', { keys: '', desc: '' })
            $group.append($shortcut)
            if (i === 0) $('input:first', $shortcut).focus()
        }
    }
    
    function deleteShortcut($shortcut) {
        var $shortcutsHolder = $shortcut.parent()
        
        $shortcut.remove()
        
        if ($('tr', $shortcutsHolder).length === 0) {
            addShortcuts($shortcutsHolder, 1)
        }
    }
    
    function outputEditorForm(e) {
        var newConfig = { groups: [] },
            group,
            shortcut
        
        e.preventDefault()
        
        $('input[type=text]', $editorForm).each(function() {
            var $input = $(this),
                value = this.value
            
            switch ($input.attr('name')) {
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
        
        $output.val('KSO code before /*BEGIN_CONFIG*/' + JSON.stringify(newConfig) + '/*END_CONFIG*/ KSO code after')
    }
    
    function loadConfig(config) {
        $editorGroups.empty()
        
        $('input', $editorTitle).val(config.title || '')
        
        if (config.groups && config.groups.length) {
            $(config.groups).each(function() {
                addGroup(this)
            })
        }
        else {
            addGroup()
        }
    }
    
    return {
        init: init
    }
}(jQuery));