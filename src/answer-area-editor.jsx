/** @jsx React.DOM */

var Editor = require("./editor.jsx");
var InfoTip = require("./components/info-tip.jsx");
var Widgets = require("./widgets.js");

var AnswerAreaEditor = React.createClass({
    getDefaultProps: function() {
        return {
            type: "input-number",
            options: {},
            calculator: false
        };
    },

    render: function() {
        var cls;
        if (this.props.type === "multiple") {
            cls = Editor;
        } else {
            cls = Widgets.getEditor(this.props.type);
        }

        var editor = cls(_.extend({
            ref: "editor",
            placeholder: "This answer area is being deprecated. " +
            "Please use the widgets in the question area for your answer.",
            onChange: function(newProps, cb) {
                var options = _.extend({}, this.props.options, newProps);
                this.props.onChange({options: options}, cb);
            }.bind(this)
        }, this.props.options));

        return <div className="perseus-answer-editor">
            <div className="perseus-answer-options">
            <div><label>
                {' '}Show calculator:{' '}
                <input type="checkbox" checked={this.props.calculator}
                    onChange={function(e) {
                        this.props.onChange({calculator: e.target.checked});
                    }.bind(this)} />
            </label>
            <InfoTip>
                <p>Use the calculator when completing difficult calculations is
                NOT the intent of the question. DON’T use the calculator when
                testing the student’s ability to complete different types of
                computations.</p>
            </InfoTip>
            </div>
            <div><label>
                {' '}Answer type:{' '}
                <select value={this.props.type}
                        onChange={function(e) {
                            this.props.onChange({
                                type: e.target.value,
                                options: {}
                            }, function() {
                                this.refs.editor.focus();
                            }.bind(this));
                        }.bind(this)}>
                    <option value="radio">Multiple choice</option>
                    <option value="table">Table of values</option>
                    <option value="input-number">Text input (number)</option>
                    <option value="expression">Expression / Equation</option>
                    <option value="multiple">Custom format</option>
                </select>
            </label>
            <InfoTip>
                <p>Use the custom format if the question is in the question
                area, and tell the students how to complete the problem.</p>
            </InfoTip></div>
            </div>
            <div className={cls !== Editor ? "perseus-answer-widget" : ""}>
                {editor}
            </div>
        </div>;
    },

    toJSON: function(skipValidation) {
        // Could be just _.pick(this.props, "type", "options"); but validation!
        return {
            type: this.props.type,
            options: this.refs.editor.toJSON(skipValidation),
            calculator: this.props.calculator
        };
    }
});

module.exports = AnswerAreaEditor;
