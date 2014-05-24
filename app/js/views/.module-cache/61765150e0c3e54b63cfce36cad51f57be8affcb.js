/** @jsx React.DOM */

define([
	'react',
	'reactbackbone'
], function(React) {
	return React.createBackboneClass({
		render: function() {
			return (
				React.DOM.div(null, 
					"Hello World"
				)
			);
		}
	})
});