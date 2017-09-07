global.baseUrl = "http://localhost:4200";
beforeEach(function () {
	// Login by adding user obj and token to local storage
	localStorage.setItem('dockstore.ui.userObj', '{\"id\": 3, \"username\": \"user_B\", \"isAdmin\": \"false\", \"name\": \"user_B\"}')
  localStorage.setItem('satellizer_token', 'imamafakedockstoretoken')
});
