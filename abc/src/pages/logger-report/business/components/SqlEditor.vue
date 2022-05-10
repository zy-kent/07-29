<template>
    <div class="sql-section">
        <div class="sql-container">
            <textarea ref="editor" class="txt"></textarea>
        </div>
        <el-button type="primary" :loading="loading" @click="handleGetSql">查询</el-button>
    </div>
</template>

<script>
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/neo.css';
import 'codemirror/theme/panda-syntax.css';
import 'codemirror/mode/sql/sql.js';
import 'codemirror/addon/hint/sql-hint.js';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/show-hint.css';

import { columnData } from '@/api/logger';

export default {
    name: 'SqlEditor',
    props: {
        defaultSql: String,
        loading: Boolean
    },
    data() {
        return {
            editor: null,
            //autocompletion: the dictionary of all possible keywords
            //[list complete of reserved keyword for MSSQL](https://docs.microsoft.com/en-us/sql/t-sql/language-elements/reserved-keywords-transact-sql?view=sql-server-2017)
            sqlKeywords: [
                { className: 'sql', text: 'AND' },
                { className: 'sql', text: 'OR' },
                { className: 'sql', text: 'LIKE' },
                { className: 'sql', text: 'IS' },
                { className: 'sql', text: 'IN' },
                { className: 'sql', text: 'NOT' },
                { className: 'sql', text: 'NULL' }
            ]
        };
    },
    computed: {
        otherKeywords() {
            return columnData.all.map(item => {
                return {
                    className: 'column',
                    text: item
                }
            })
        },
        dico() {
            return [...this.sqlKeywords, ...this.otherKeywords]
        }
    },
    methods: {
        /*
        Return a list of suggestion base on the searchString (the current word that user is typing).
        Each suggestion is an object {text, displayText, className}. See https://codemirror.net/doc/manual.html#addon_show-hint
        - keywords start with the searchString appears first in the suggestion list
        */
        suggest(searchString) {
            /*
            we will score which suggesion should appears first, the higer the score, the higer is the appearance order
            */
            let token = searchString;
            if (searchString.startsWith('.')) token = searchString.substring(1);
            else token = searchString.toLowerCase();
            let resu = [];
            let N = this.dico.length;

            //init scoring: only retains and score suggestions which contain the searchString
            for (let i = 0; i < N; i++) {
                let keyword = this.dico[i].text.toLowerCase();
                let suggestion = null;
                //the base score of all the suggestion is N-i (it means we respect the order in the dico)
                if (keyword.startsWith(token)) {
                    //add N to the score of keywords which begin with the token to make them raise up in the suggestion list
                    suggestion = Object.assign({ score: N + (N - i) }, this.dico[i]);
                } else if (keyword.includes(token)) {
                    suggestion = Object.assign({ score: N - i }, this.dico[i]);
                }
                if (suggestion) resu.push(suggestion);
            }

            //case suggestion for "."
            if (searchString.startsWith('.')) {
                //raise score of columns, decrease the score of sql keyword
                resu.forEach(s => {
                    if (s.className === 'column') s.score += N;
                    else if (s.className === 'sql') s.score -= N;
                    return s;
                });
            }

            //console.log(searchString);
            return resu.sort((a, b) => b.score - a.score);
        },
        /*
        [hint implementation for codemirror](https://codemirror.net/doc/manual.html#addon_show-hint):
        take an editor instance and options object, and return a {list, from, to} object, where list is an array of strings or objects (the completions), and from and to give the start and end of the token that is being completed as {line, ch} objects.
        */
        hint(editor) {
            let cur = editor.getCursor();
            let token = editor.getTokenAt(cur);
            let searchString = token.string;
            return {
                list: this.suggest(searchString),
                from: CodeMirror.Pos(cur.line, token.start),
                to: CodeMirror.Pos(cur.line, token.end)
            };
        },
        handleGetSql() {
            const value = this.editor.getValue()
            this.$emit('search', value)
        }
    },
    mounted() {
        this.editor = CodeMirror.fromTextArea(this.$refs.editor, {
            tabSize: 4,
            mode: 'text/x-mysql',
            theme: 'panda-syntax',
            lineNumbers: true,
            line: true,
            lineWrapping: true,
            // autofocus: true,
            hintOptions: {
                completeSingle: false,
                hint: this.hint
            },
            extraKeys: {
                'Ctrl-Space': editor => {
                    editor.showHint();
                }
            }
        });
        this.editor.setValue(this.defaultSql)
        // this.editor.showHint();
        this.editor.on('keypress', editor => {
            editor.showHint();
        });
        this.editor.on('focus', editor => {
            editor.showHint();
        })
    }
};
</script>

<style lang="less">
.sql-section {
    .sql-container {
        display: inline-block;
        width: 800px;
        vertical-align: top;
        margin-right: 20px;
        .txt {
            width: 100%;
            height: 100%;
        }
        .CodeMirror {
            height: 40px;
        }
    }
}
.CodeMirror-hints {
    font-family: "sans-serif";
    font-size: 12px;
    &::-webkit-scrollbar {
        width: 4px;
        height: 16px;
        background-color: #F5F5F5;
    }
    /*定义滚动条轨道 内阴影+圆角*/
    &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px rgba(146, 146, 146, 0.212);
        border-radius: 2px;
        background-color: #F5F5F5;
    }
    /*定义滑块 内阴影+圆角*/
    &::-webkit-scrollbar-thumb {
        border-radius: 2px;
        box-shadow: inset 0 0 6px rgba(129, 129, 129, 0.3);
        background-color: #bbb;
    }
    .CodeMirror-hint.CodeMirror-hint-active {
        color: #fff;
        &:after {
            color: #fff;
        }
    }
    .sql {
        color: blue;
        &:after {
            content: "sql";
            padding-left: 20px;
            float: right;
            color: gray;
        }
    }
    .table {
        color: blueviolet;
        &:after {
            content: "table";
            padding-left: 20px;
            float: right;
            color: gray;
        }
    }
    .column {
        color: brown;
        &:after {
            content: "column";
            padding-left: 20px;
            float: right;
            color: gray;
        }
    }
    .pf {
        color: cadetblue;
        &:after {
            content: "procfunc";
            padding-left: 20px;
            float: right;
            color: gray;
        }
    }
}
</style>
