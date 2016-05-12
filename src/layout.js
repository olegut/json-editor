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
        var self = this;
        if (this.block.title) {
            var header = document.createElement('span');
            header.textContent = this.block.title;
            var title = this.options.theme.getHeader(header);
            title.setAttribute("class","layout-block-title");
            this.container.root.appendChild(title);
        }
        if (this.block.attributes) {
            $each(this.block.attributes, function (i, attribute) {
                self.container.root.setAttribute(attribute.name, attribute.value);
            });
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
        this.block.container = this.buildContainer()
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
    // _buildBlock: function(){
    //     
    // },
    buildContainer: function () {
        if(this.block.renderAs == "tabs") {
            this.container.root = this.options.theme.getTabHolder();
            this.container.editor_holders = this.options.theme.getTabContentHolder(this.container.root);
            var tab = this.options.theme.getTab(document.createElement('span'));
        }
        else {
            this.container.editor_holders = this.options.theme.getIndentedPanel();
            this.container.root = this.container.editor_holders;
        }
        this._super();  
        return this.container;
    },
    buildEditorHolder: function(editor){
        return this._super();            
    },
    attachChildBlock: function(childBlock){
        this.container.root.appendChild(childBlock.container.root);         
    }
});
