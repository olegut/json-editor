JSONEditor.LayoutBuilder = Class.extend({
    init: function (options) {
        this.options = options;
        this._rootContainer = this.options.theme.getContainer();
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
    buildLayout: function () {
        var self = this;
        $each(this.options.layout_schema.layout, function (i, block) {
            self._buildBlock(block, null);
        });
    },
    _buildBlock: function (block, parentBlock) {
        var self = this;
        var currentBlockContainer = this._constructBlockContainer(block);
        $each(block.childBlocks, function (i, innerBlock) {
            innerBlock.parentBlock = block; // ??
            self._buildBlock(innerBlock, block);
        });
        if (block.type == "group") {
            var group = this._findGroup(block.RefId);
            group.container = currentBlockContainer;
            group.block = block;
            group.container.root.setAttribute("id",group.Id);
        }
        
        if(parentBlock && parentBlock.builder.attachChildBlock){
            parentBlock.builder.attachChildBlock(block);
        } else
            self._rootContainer.appendChild(currentBlockContainer.root);
    },
    _constructBlockContainer: function (block) {
        if (JSONEditor.LayoutBuilder.blocks[block.type]) {
            block.builder = new JSONEditor.LayoutBuilder.blocks[block.type](this.options, block);
            block.container = block.builder.buildContainer();            
            return block.container;
        }
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

JSONEditor.LayoutBuilder.AbstractBlock = Class.extend({
    init: function (options, block) {
        this.options = options;
        this.block = block;
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
            // group.container.editor_holders.appendChild(editorHolder);
    // editor.setContainer(editorHolder);
        return this.options.theme.getGridColumn();
    },
    attachChildBlock: function(childBlock){
        this.container.root.appendChild(childBlock.container.root);         
    }
});

JSONEditor.LayoutBuilder.blocks = {};

JSONEditor.LayoutBuilder.blocks.separator = JSONEditor.LayoutBuilder.AbstractBlock.extend({
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

JSONEditor.LayoutBuilder.blocks.group = JSONEditor.LayoutBuilder.AbstractBlock.extend({
    buildContainer: function () {
        this.container.editor_holders = this.options.theme.getIndentedPanel();
        this.container.root = this.container.editor_holders;
        this._super();
        return this.container;
    }
}); 

 
JSONEditor.LayoutBuilder.blocks.container = JSONEditor.LayoutBuilder.AbstractBlock.extend({
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
