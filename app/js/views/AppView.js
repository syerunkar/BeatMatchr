/** @jsx React.DOM */

define([
	'react'
], function(React) {
	return React.createClass({
		render: function() {
			return (
				React.DOM.div( {id:"app"}, 
					"Hello World"
				)
			);
		}
	});
});