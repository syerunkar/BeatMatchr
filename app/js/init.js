define(['react',
	'views/AppView'
], function(React, AppView){
	'use strict';

	return function() {
		React.renderComponent(
			AppView(),
			document.getElementById('content')
		);
	}
});