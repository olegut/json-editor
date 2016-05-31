JSONEditor.LayoutBuilder = {};

// design-time , do not change 
JSONEditor.LayoutBuilder.type = {
    general: 1,
    table: 2
};
JSONEditor.LayoutBuilder.AbstractLayoutBuilder = Class.extend({
    init: function (options) {
        this.options = options;
        if (this.options.block)
            this.options.block.builder = this;
        this.container = {};
        this.type = JSONEditor.LayoutBuilder.type.general;
    },
    onEditorBuild: function(editor){
        debugger;
    },
    buildContainer: function () {
        if (this.options.block.title && !this.ignoreTitle) {
            var header = document.createElement('span');
            header.textContent = this.options.block.title;
            var title = this.options.theme.getHeader(header);
            title.setAttribute("class", "layout-block-title");
            this.container.root.appendChild(title);
        }
    },
    afterBuildContainer: function () {
        var self = this;
        if (this.options.block.attributes) {
            $each(this.options.block.attributes, function (i, attribute) {
                self.container.root.setAttribute(attribute.name, attribute.value);
            });
        }
        if (this.options.block.cssClass && typeof this.options.block.cssClass == "string") {
            self.container.root.classList.add(this.options.block.cssClass);
        }
        if (this.options.block.cssClass && Object.prototype.toString.call(this.options.block.cssClass) === '[object Array]') {
            $each(this.options.block.cssClass, function (i, cssClass) {
                self.container.root.classList.add(cssClass);
            });
        }
    },
    buildEditorHolder: function (editor) {
        return this.options.theme.getGridColumn();
    },
    findEditorByRelativePath: function (editor, relativePath) {
        var self = this;
        if(editor.normalizedPath == this.options.layout_schema.layoutFor + '.' + relativePath){
           return editor;
        }
        var result;
        if(editor.editors){
            $each(editor.editors, function (i, childEditor) {
                result = self.findEditorByRelativePath(childEditor, relativePath);
                if(result){
                    return false;
                }
            });            
        }
        return result;
    },    
    appendEditor: function (editor) {
        var editorHolder = this.buildEditorHolder(editor);
        this.container.editor_holders.appendChild(editorHolder);
        editor.setContainer(editorHolder);
    },
    attachChildBlock: function (childBlock) {
        this.container.root.appendChild(childBlock.container.root);
    },
    attach: function () {
        if (this.options.parentBlock && this.options.parentBlock.builder.attachChildBlock) {
            this.options.parentBlock.builder.attachChildBlock(this.options.block);
        } else if (this.options.root_container)
            this.options.root_container.appendChild(this.options.block.container.root)
    },
    getGroupForEditor: function (editor) {
        if (!this.options.layout_schema) {
            return;
        }
        var self = this;
        var foundGroup;
        // get rid of integer parts for arrays
        $each(this.options.layout_schema.groups, function (i, group) {
            var fieldFound = false;
            if (group.Fields) {
                $each(group.Fields, function (i, field) {
                    if (field.Path == editor.path
                        || (self.options.layout_schema.layoutFor + '.' + field.Path == editor.normalizedPath)
                        ) {
                        fieldFound = true;
                        foundGroup = group;
                        return false;
                    }
                });
                if (fieldFound) {
                    return false;
                }
            }
            if (group.OtherFields && editor.parent && editor.parent.key == "root") {
                foundGroup = group;
            }
        });
        if (foundGroup) {
            editor.group = foundGroup;
            return foundGroup;
        }
    },
    _buildBlock: function () {
        var self = this;
        this.options.block.container = this.buildContainer();
        this.afterBuildContainer();
        $each(this.options.block.childBlocks, function (i, innerBlock) {
            var childOptions = Object.assign({}, self.options)
            childOptions.block = innerBlock;
            childOptions.parentBlock = self.options.block;
            var builder = new JSONEditor.LayoutBuilder.builders[innerBlock.type](childOptions);
            builder._buildBlock();
        });
        this.attach();
    },
    _findGroup: function (refId) {
        var self = this;
        var result = false;
        $each(this.options.layout_schema.groups, function (i, group) {
            if (group.Id == refId) {
                result = group;
                return false;
            }
        });
        if (!result) {
            throw "Invalid layout schema. Unable to find group with id=" + refId;
        }
        return result;
    }
});

JSONEditor.RootLayoutBuilder = JSONEditor.LayoutBuilder.AbstractLayoutBuilder.extend({
    init: function (options) {
        this._super(options);
    },
    buildLayout: function () {
        if (!this.options.layout_schema)
            return;
        var self = this;
        $each(this.options.layout_schema.layout, function (i, block) {
            var childOptions = Object.assign({}, self.options)
            childOptions.block = block;
            var builder = new JSONEditor.LayoutBuilder.builders[block.type](childOptions);
            builder._buildBlock();
        });
    }
});

JSONEditor.LayoutBuilder.builders = {};

JSONEditor.LayoutBuilder.builders.separator = JSONEditor.LayoutBuilder.AbstractLayoutBuilder.extend({
    buildContainer: function () {
        var separator = document.createElement("div");
        separator.setAttribute("style", "display:block; clear: both;");
        var container = {};
        container.editor_holders = separator;
        container.root = separator;
        this._super();
        return container;
    }
});

JSONEditor.LayoutBuilder.builders.group = JSONEditor.LayoutBuilder.AbstractLayoutBuilder.extend({
    init: function (options) {
        this.active_tab = null;
        this.tabs = [];
        this._super(options);
        this.group = this._findGroup(this.options.block.RefId);
    },
    buildContainer: function () {
        this.container.editor_holders = this.options.theme.getIndentedPanel();
        this.container.root = this.container.editor_holders;
        this._super();
        return this.container;
    },
    _buildBlock: function () {
        this._super();
        this.group.container = this.container;
        this.group.builder = this;
    }
});

JSONEditor.LayoutBuilder.builders.container = JSONEditor.LayoutBuilder.AbstractLayoutBuilder.extend({
    buildContainer: function () {
        this.container.editor_holders = this.options.theme.getIndentedPanel();
        this.container.root = this.container.editor_holders;
        this._super();
        return this.container;
    }
});

JSONEditor.LayoutBuilder.builders.tab_container = JSONEditor.LayoutBuilder.AbstractLayoutBuilder.extend({
    init: function (options) {
        this.active_tab = null;
        this.tabs = [];
        this._super(options);
    },
    buildContainer: function () {
        this.container.root = this.options.theme.getIndentedPanel();
        this.tab_holder = this.options.theme.getTabHolder(); // tab holder
        this.container.root.appendChild(this.tab_holder);

        this.container.editor_holders = this.tab_holder;
        this.container.tab_content_holder = this.options.theme.getTabContentHolder(this.tab_holder);
        this._super();
        return this.container;
    },
    registerTab: function (tab, tabContent) {
        var self = this;
        this.options.theme.addTab(this.tab_holder, tab);
        tab.addEventListener('click', function (e) {
            self.active_tab = tab;
            self.refreshTabs();
            e.preventDefault();
            e.stopPropagation();
        });
        this.tabs.push({
            tab: tab,
            tabContent: tabContent
        });
        if (!this.active_tab)
            this.active_tab = tab;
        this.refreshTabs();
    },
    refreshTabs: function () {
        var self = this;
        $each(this.tabs, function (i, tab_object) {
            if (tab_object.tab === self.active_tab) {
                self.options.theme.markTabActive(tab_object.tab);
                tab_object.tabContent.style.display = '';
            }
            else {
                self.options.theme.markTabInactive(tab_object.tab);
                tab_object.tabContent.style.display = 'none';
            }
        });
    }
});

JSONEditor.LayoutBuilder.builders.tab = JSONEditor.LayoutBuilder.builders.group.extend({
    init: function (options) {
        this.ignoreTitle = true;
        this._super(options);
    },
    buildContainer: function () {
        var title = document.createElement("span");
        title.style.cursor = "pointer";
        title.textContent = this.options.block.title;
        this.tab = this.options.theme.getTab(title);
        this.container.root = this.options.theme.getTabContent();
        this.container.editor_holders = this.container.root;
        this.options.parentBlock.builder.registerTab(this.tab, this.container.root);
        return this.container;
    },
    attach: function () {
        this.options.parentBlock.container.tab_content_holder.appendChild(this.container.root);
    }
});

JSONEditor.LayoutBuilder.builders.table_container = JSONEditor.LayoutBuilder.AbstractLayoutBuilder.extend({
    init: function (options) {
        this._super(options);
        this.type = JSONEditor.LayoutBuilder.type.table;
        this.headerGroup = this._findGroup(this.options.block.headerGroup.RefId);
         this.name = "table_container";
    },
    buildContainer: function () {
        this.container.root = this.options.root_container;
        this.container.editor_holders = this.options.root_container;
        return this.container;
    },
    buildTableHeaders: function (editorTemplate, header_row) {
        var self = this;
        $each(this.headerGroup.Fields, function(i, field){
            var editorForField = self.findEditorByRelativePath(editorTemplate, field.Path);
            if (editorForField) {
                var th = self.options.theme.getTableHeaderCell(editorForField.getTitle());
                if (editorForField.options.hidden) th.style.display = 'none';
                header_row.appendChild(th);
            }
        });
    },
    attach: function () {
        // no need to do this         
    }
});

JSONEditor.LayoutBuilder.builders.main_row_container = JSONEditor.LayoutBuilder.builders.group.extend({
    init: function (options) {
        this._super(options);
        this.headerGroup = this._findGroup(this.options.parentBlock.headerGroup.RefId);
        this.name = "main_row_container";
    },
    buildContainer: function () {
        var self = this;
        this.container.root = this.options.root_container;
        this.container.editor_holders = this.options.root_container;
        $each(this.headerGroup.Fields, function(i, field){
            var holder = self.buildEditorHolder();
            holder.setAttribute('order', i);
            self.container.editor_holders.appendChild(holder);
        });
        return this.container;
    },
    buildEditorHolder: function () {
        return this.options.theme.getTableCell();
    },
    appendEditor: function (editor) {
        var self = this;

        $each(this.headerGroup.Fields, function(i, field){
            var editorForField = self.findEditorByRelativePath(editor, field.Path);
            if (editorForField) {
                var editorHolder = self.container.editor_holders.children[i];
                editor.setContainer(editorHolder);
                return false;
            }
        });       
    },   
    onEditorBuild: function(editor){
        var self = this;
        var popup_row = editor.getButton('','edit', 'Show details');
        popup_row.addEventListener('click',function(e) {
            self.popup_row_container.show();
        });
        editor.table_controls.appendChild(popup_row);
    },    
    // show: function () {
    //     this.container.editor_holders.style.left = this.container.editor_holders.offsetLeft + "px";
    //     this.container.editor_holders.style.top = this.container.editor_holders.offsetTop + this.container.editor_holders.offsetHeight + "px";
    //     this.container.editor_holders.style.display = '';
    // },
    // hide: function () {
    //     this.container.editor_holders.style.display = 'none';
    // },    
    attach: function () {
        // no need to do this         
    }
});

JSONEditor.LayoutBuilder.builders.popup_row_container = JSONEditor.LayoutBuilder.builders.group.extend({
    init: function (options) {
        this._super(options);
        this.name = "popup_row_container";
        this.options.parentBlock.builder.popup_row_container = this;
    },
    buildContainer: function () {
        this.container.root = document.createElement('div');
        this.container.editor_holders = this.container.root;//  this.theme.getModal();
        this.container.editor_holders.style.padding = '5px 0';
        this.container.editor_holders.style.overflowY = 'auto';
        this.container.editor_holders.style.overflowX = 'hidden';
        this.container.editor_holders.style.paddingLeft = '5px';
        this.container.editor_holders.setAttribute('class', 'popup-row-container');
        // var headerGroup =  this._findGroup(this.options.parentBlock.headerGroup.RefId);
        // this.container.editor_holders.setAttribute('colspan',headerGroup.Fields.length);
        // this.container.root.appendChild(this.container.editor_holders);
        this.options.root_container.appendChild(this.container.editor_holders);
        return this.container;
    },
    attach: function () {
        this._super();
        //insertAfter(this.container.root, this.options.parentBlock.builder.container.root);
    }
});
// 
