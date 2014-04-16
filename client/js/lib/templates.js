this["App"] = this["App"] || {};
this["App"]["Templates"] = this["App"]["Templates"] || {};
this["App"]["Templates"]["badge"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"inner ";
  if (stack1 = helpers.statusClass) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.statusClass); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n  <span class=\"ribbon\">";
  if (stack1 = helpers.ribbonText) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.ribbonText); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n  <img src=\"";
  if (stack1 = helpers.imageUrl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.imageUrl); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" />\n  <p class=\"description\">\n    ";
  if (stack1 = helpers.description) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.description); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n    ";
  if (stack1 = helpers.issuedOn) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.issuedOn); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n  </p>\n  <div class=\"actions\">\n    <i class=\"fa fa-trash-o\"></i>\n    <button>Details</button>\n  </div>\n</div>\n";
  return buffer;
  });;
this["App"] = this["App"] || {};
this["App"]["Templates"] = this["App"]["Templates"] || {};
this["App"]["Templates"]["badge_filter"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "";
  buffer += "\n        <option>"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</option>\n      ";
  return buffer;
  }

  buffer += "<ul>\n  <li>\n    <i class=\"fa fa-list\"></i>\n    <select name=\"filter-badge-category\" id=\"filter-badge-category-select\">\n      <option value=\"\">Category</option>\n    </select>\n  </li>\n  <li>\n    <i class=\"fa fa-circle-o\"></i>\n    <select name=\"filter-badge-status\" id=\"filter-badge-status-select\">\n      <option value=\"\">Badge Status</option>\n      ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.statuses), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </select>\n  </li>\n  <li>\n    <i class=\"fa fa-th-large\"></i>\n    <select name=\"filter-badge-type\" id=\"filter-badge-type-select\">\n      <option value=\"\">Type</option>\n      ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.types), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </select>\n  </li>\n  <li>\n    <i class=\"fa fa-calendar\"></i>\n    <input name=\"date\" id=\"filter-badge-date-field\" />\n  </li>\n  <li>\n    <button class=\"search\">Search <i class=\"fa fa-search\"></i></button>\n  </li>\n</ul>\n";
  return buffer;
  });;
this["App"] = this["App"] || {};
this["App"]["Templates"] = this["App"]["Templates"] || {};
this["App"]["Templates"]["paginator"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "\n    <li><a class=\"previous\">&laquo;</a></li>\n  ";
  }

function program3(depth0,data) {
  
  
  return "\n    <li><a class=\"spacer\">&laquo;</a></li>\n  ";
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <li><a class=\"";
  if (stack1 = helpers.className) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.className); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-page-number=\"";
  if (stack1 = helpers.number) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.number); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.number) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.number); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a></li>\n  ";
  return buffer;
  }

function program7(depth0,data) {
  
  
  return "\n    <li><a class=\"next\">&raquo;</a></li>\n  ";
  }

function program9(depth0,data) {
  
  
  return "\n    <li><a class=\"spacer\">&raquo;</a></li>\n  ";
  }

  buffer += "<ul>\n  ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isNotFirstPage), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.pages), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isNotLastPage), {hash:{},inverse:self.program(9, program9, data),fn:self.program(7, program7, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>\n";
  return buffer;
  });;