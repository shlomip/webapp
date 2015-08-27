/*angular
.module('app',[
	'ui.router'
	])
.config(['$urlRouterProvider', '$stateProvider'], function($urlRouterProvider, $stateProvider){
	$urlRouterProvider.otherwise('/');
	$stateProvider
		.state('about', {
			url:'/',
			templateUrl: 'templates/home.html'
		})
})
*/


pressed = 0;
document.querySelector(".menu-caption").addEventListener("click",function(){
	
	if(pressed)
	{
		document.querySelector(".action-list").style.display= "none";
		pressed = 0;
	}
	else
	{
		document.querySelector(".action-list").style.display = "inline-block";
		pressed= 1;
	}
});

