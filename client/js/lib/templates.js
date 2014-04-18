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
    + "\">\n  <a href=\"#/badge/";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.id); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" style=\"background-image: url(";
  if (stack1 = helpers.imageUrl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.imageUrl); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + ");\"></a>\n</div>\n";
  return buffer;
  });;
this["App"] = this["App"] || {};
this["App"]["Templates"] = this["App"]["Templates"] || {};
this["App"]["Templates"]["badge_detail"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <div class=\"evidence\">\n      ";
  stack1 = (typeof depth0 === functionType ? depth0.apply(depth0) : depth0);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n  ";
  return buffer;
  }

  buffer += "<div class=\"badge-info\">\n  <div class=\"badge-image\">\n    <img src=\"";
  if (stack1 = helpers.imageUrl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.imageUrl); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" />\n  </div>\n\n  <div class=\"badge-details\">\n    <h2 class=\"badge-name\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.name); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h2>\n    <p class=\"columns\">\n      <strong>Issued by: </strong>\n      <span><a href=\"";
  if (stack1 = helpers.issuerUrl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.issuerUrl); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" target=\"_blank\">";
  if (stack1 = helpers.issuerUrl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.issuerUrl); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a></span>\n    </p>\n    <p class=\"columns\">\n      <strong>Issued to: </strong>\n      <span>"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.user)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\n    </p>\n    <p class=\"columns\">\n      <strong>Date Issued: </strong>\n      <span>";
  if (stack2 = helpers.issuedOn) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.issuedOn); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</span>\n    </p>\n    <div class=\"columns\">\n      <strong>Description</strong>\n      <p>";
  if (stack2 = helpers.description) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.description); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</p>\n    </div>\n    <p class=\"columns\">\n      <strong>Criteria: </strong>\n      <span><a href=\"";
  if (stack2 = helpers.evidenceUrl) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.evidenceUrl); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" target=\"_blank\">";
  if (stack2 = helpers.evidenceUrl) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.evidenceUrl); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</a></span>\n    </p>\n  </div>\n</div>\n\n<div class=\"badge-evidence\">\n  <p><strong>Evidence</strong></p>\n  ";
  stack2 = helpers.each.call(depth0, ((stack1 = (depth0 && depth0.evidence)),stack1 == null || stack1 === false ? stack1 : stack1.media), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n  <p>\n    "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.evidence)),stack1 == null || stack1 === false ? stack1 : stack1.text)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n  </p>\n</div>\n";
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
this["App"]["Templates"]["badge_sorter"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<select name=\"badge-sorter\">\n  <option>Sort Badges</option>\n  <option value=\"name-desc\">Name (A-Z)</option>\n  <option value=\"name-asc\">Name (Z-A)</option>\n  <option value=\"issuedOn-asc\">Date (newest first)</option>\n  <option value=\"issuedOn-desc\">Date (oldest first)</option>\n</select>\n";
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