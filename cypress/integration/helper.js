global.baseUrl = "http://localhost:4200";
beforeEach(function () {
	// Login by adding user obj and token to local storage
	localStorage.setItem('dockstore.ui.userObj', '{\"id\": 1, \"username\": \"user_A\", \"isAdmin\": \"false\", \"name\": \"user_A\"}')
  localStorage.setItem('ng2-ui-auth_token', 'imamafakedockstoretoken')
});

function goToTab(tabName) {
	cy
			.get('.nav-link')
			.contains(tabName)
			.parent()
			.click()
}
