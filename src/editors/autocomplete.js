// Used vanilla js autocomplete framework for this editor
// https://github.com/Pixabay/JavaScript-autoComplete
// you MUST add link on it to the page, otherwise default string editor will be used. 
JSONEditor.defaults.editors.autocomplete = JSONEditor.defaults.editors.string.extend({
  getNumColumns: function() {
    return 2;
  },
  getValue: function() {
    return this.value;
  },
  afterInputReady: function() {
  //  this.input.disabled = true;
    var self = this;
    var demo2 = new autoComplete({
            selector: this.input,
            minChars: 0,
            source: function(term, suggest){
                term = term.toLowerCase();
                var choices = self.schema.options.choises;               
                var suggestions = [];
                for (i=0;i<choices.length;i++)
                    if (~(choices[i]).toLowerCase().indexOf(term)) suggestions.push(choices[i]);
                suggest(suggestions);
            },

            onSelect: function(e, term, item){
                self.value = term; 
                self.onChange(true);                               
            }
        });
    this._super();
  }
});
