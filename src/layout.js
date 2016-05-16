JSONEditor.LayoutBuilder = {};

JSONEditor.LayoutBuilder.AbstractLayoutBuilder = Class.extend({
    init: function (options, block, parentBlock) {
        this.options = options;
        this.block = block;
        if(this.block)
            this.block.builder = this;
        this.parentBlock = parentBlock;
        this.container = {};        
    },
    buildContainer: function(){
        if (this.block.title && !this.ignoreTitle) {
            var header = document.createElement('span');
            header.textContent = this.block.title;
            var title = this.options.theme.getHeader(header);
            title.setAttribute("class","layout-block-title");
            this.container.root.appendChild(title);
        }
    },
    afterBuildContainer: function(){
        var self = this;
        if (this.block.attributes) {
            $each(this.block.attributes, function (i, attribute) {
                self.container.root.setAttribute(attribute.name, attribute.value);
            });
        }
        if (this.block.cssClass && typeof this.block.cssClass == "string") {
            self.container.root.classList.add(this.block.cssClass);
        }
    },
    buildEditorHolder: function(editor){
        return this.options.theme.getGridColumn();
    },
    attachChildBlock: function(childBlock){
        this.container.root.appendChild(childBlock.container.root);         
    },
    getGroupForEditor: function (editor) {
        if (!this.options.layout_schema) {
            return;
        }
        var foundGroup;
        $each(this.options.layout_schema.groups, function (i, group) {
            var fieldFound = false;
            if (group.Fields){
                $each(group.Fields, function (i, field) {
                    if (field.Path == editor.path) {
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
        this.block.container = this.buildContainer();
        this.afterBuildContainer();
        $each(this.block.childBlocks, function (i, innerBlock) {
            var builder = new JSONEditor.LayoutBuilder.builders[innerBlock.type](self.options, innerBlock, self.block);
            builder._buildBlock();
        });
        if(this.parentBlock && this.parentBlock.builder.attachChildBlock){
            this.parentBlock.builder.attachChildBlock(this.block);
        } else
            self.options.root_container.appendChild(this.block.container.root);
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

JSONEditor.RootLayoutBuilder =JSONEditor.LayoutBuilder.AbstractLayoutBuilder.extend({
    init: function (options) {
        this._super(options);
    },   
    buildLayout: function () {
        var self = this;
        $each(this.options.layout_schema.layout, function (i, block) {
            var builder = new JSONEditor.LayoutBuilder.builders[block.type](self.options, block);
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
    buildContainer: function () {
        this.container.editor_holders = this.options.theme.getIndentedPanel();
        this.container.root = this.container.editor_holders;
        this._super();
        return this.container;
    },
    _buildBlock: function () {
        this._super();
        var group = this._findGroup(this.block.RefId);
        group.container = this.container;
        group.builder = this;
        group.container.root.setAttribute("id",group.Id);
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
    init: function (options, block, parentBlock) {
        this.active_tab = null;
        this.tabs = [];
        this._super(options, block, parentBlock);
    },    
    buildContainer: function () {
        this.container.root = this.options.theme.getIndentedPanel();
        this.tab_holder =  this.options.theme.getTabHolder(); // tab holder
        this.container.root.appendChild(this.tab_holder);
        
        this.container.editor_holders = this.tab_holder;
        this.container.tab_content_holder = this.options.theme.getTabContentHolder(this.tab_holder);
        this._super();  
        return this.container;
    },
    attachChildBlock: function(childBlock){
        this.container.tab_content_holder.appendChild(childBlock.container.root);         
    },
    registerTab: function(tab, tabContent){
        var self = this;
        this.options.theme.addTab(this.tab_holder, tab);
        tab.addEventListener('click', function(e) {
            self.active_tab = tab;
            self.refreshTabs();
            e.preventDefault();
            e.stopPropagation();
        });        
        this.tabs.push({
            tab: tab,
            tabContent:tabContent
        });
        if(!this.active_tab)
            this.active_tab = tab;
        this.refreshTabs();
    },
    refreshTabs: function(){
        var self = this;
        $each(this.tabs, function (i, tab_object) {
            if(tab_object.tab === self.active_tab) {
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
    init: function (options, block, parentBlock) {
        this.ignoreTitle = true; 
        this._super(options, block, parentBlock);
    },
    buildContainer: function () {
        var title = document.createElement("span");
        title.style.cursor = "pointer";
        title.textContent = this.block.title;
        this.tab = this.options.theme.getTab(title);
        this.container.root = this.options.theme.getTabContent();
        this.container.editor_holders = this.container.root;
        this.parentBlock.builder.registerTab(this.tab,this.container.root);
        return this.container;
    }
});