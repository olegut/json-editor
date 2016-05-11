JSONEditor.LayoutBuilder = Class.extend({
    init: function (options) {
        this.options = options;
        this._rootContainer = this.options.theme.getContainer();
    },
    getLayoutHolderForEditor: function (editor) {
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
            return foundGroup.container;
        }
    },
    buildLayout: function () {
        var self = this;
        $each(this.options.layout_schema.layout, function (i, block) {
            self._buildBlock(block, self._rootContainer);
        });
    },
    _buildBlock: function (block, parentElement) {
        var self = this;
        var currentBlockContainer = this._constructBlockContainer(block);
        $each(block.childBlocks, function (i, innerBlock) {
            self._buildBlock(innerBlock, currentBlockContainer);
        });
        if (block.type == "group") {
            var group = this._findGroup(block.RefId);
            group.container = currentBlockContainer;
            group.container.setAttribute("id",group.Id);
        }
        parentElement.appendChild(currentBlockContainer);
    },
    _constructBlockContainer: function (block) {
        if (JSONEditor.LayoutBuilder.blocks[block.type]) {
            var builder = new JSONEditor.LayoutBuilder.blocks[block.type](this.options);
            var container = builder.createContainer(block);
            if (block.title) {
                var header = document.createElement('span');
                header.textContent = block.title;
                var title = this.options.theme.getHeader(header);
                title.setAttribute("class","layout-block-title");
                container.appendChild(title);
            }
            if (block.attributes) {
                $each(block.attributes, function (i, attribute) {
                    container.setAttribute(attribute.name, attribute.value);
                });
            }
            return container;
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

JSONEditor.LayoutBuilder.blocks = {};

JSONEditor.LayoutBuilder.blocks.separator = Class.extend({
    init: function (options) {
        this.options = options;
    },
    createContainer: function () {
        var separator = document.createElement("div");
        separator.setAttribute("style", "display:block; clear: both;");
        return separator;
    }
});

JSONEditor.LayoutBuilder.blocks.group = Class.extend({
    init: function (options) {
        this.options = options;
    },
    createContainer: function (block) {
        var container;
        if(block.renderAs == "tabs")
            container = this.options.theme.getTabHolder();
        else
            container = this.options.theme.getIndentedPanel();
        return container;
    }
}); 

 
JSONEditor.LayoutBuilder.blocks.container = Class.extend({
    init: function (options) {
        this.options = options;
    },
    createContainer: function () {
        var separator = this.options.theme.getIndentedPanel();
        return separator;
    }
});
