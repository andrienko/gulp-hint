/*global module,require,console*/
module.exports = (function () {
  'use strict';
  var fs = require('fs'),
    Table = require('cli-table'),
    extend = require('extend'),

    lib = {
      defaultOptions: {
        gulpname: 'gulp',
        filename: './gulpfile.js',
        output: function (comments, lib) {
          console.log('\n Tasks available: ' + Object.keys(comments).join(', '));
          console.log(lib.getTable(comments));
        }
      },
      parseCode: function (code, options) {
        options = extend(this.defaultOptions, options);
        code = code.replace(/[\r\n]+/g, '\n');
        var re = new RegExp('((?:\\/{2}[^\\n]*\\n)+)' + options.gulpname + '\\s*\\.\\s*task\\s*\\(\\s*["\'](.*?)["\']', 'g'),
          m,
          results = [];
        while ((m = re.exec(code)) !== null) {
          results.push(m);
        }
        return results;
      },
      parseCommentBlock: function (comment) {
        comment = comment.replace(/^[\/\s]+([\s\S]*?)\s*$/gm, '$1');
        return comment.split('\n');
      },
      getComments: function (code, options) {
        var comments = {},
          index,
          parsed = this.parseCode(code, options);
        for (index in parsed) {
          if (parsed.hasOwnProperty(index)) {
            comments[parsed[index][2]] = this.parseCommentBlock(parsed[index][1]);
          }
        }
        return comments;
      },
      getFileContents: function (options) {
        options = extend(this.defaultOptions, options);
        var file = fs.readFileSync(options.filename, 'utf8');
        return file;
      },
      getCommentsFromGulpFile: function (options) {
        var file = this.getFileContents(options);
        return this.getComments(file, options);
      },
      generateTable: function (comments_data) {
        var table = new Table({
            chars: {
              'top': '',
              'top-mid': '',
              'top-left': '',
              'top-right': '',
              'bottom': '',
              'bottom-mid': '',
              'bottom-left': '',
              'bottom-right': '',
              'left': '',
              'left-mid': '',
              'mid': '',
              'mid-mid': '',
              'right': '',
              'right-mid': '',
              'middle': ' '
            }
          }),
          command,
          descr,
          index;
        for (command in comments_data) {
          if (comments_data.hasOwnProperty(command)) {
            descr = comments_data[command];
            for (index in descr) {
              if (descr.hasOwnProperty(index)) {
                table.push([index < 1 ? command : '', descr[index]]);
              }
            }
          }
        }
        return table;
      },
      getTable: function (comments) {
        return lib.generateTable(comments).toString();
      },
      getHelp: function (options) {

        options = extend(lib.defaultOptions, options);
        var comments = lib.getCommentsFromGulpFile(options);

        options.output(comments, lib);
      }
    };

  return lib;

}());