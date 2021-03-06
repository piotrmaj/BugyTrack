'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'myApp.bug-list',
  'myApp.create-bug',
  'myApp.bug-details',
  'myApp.projectService',
  'myApp.project-list',
  'myApp.project-details',
  'myApp.create-project',
  'myApp.bugService',
  'myApp.socketService',
  'myApp.accountService',
  'myApp.authService',
  'myApp.authInterceptorService',
  'myApp.languageService',
  'myApp.register',
  'myApp.login',
  'myApp.logout',
  'myApp.layoutCtrl',
  'myApp.version',
  'LocalStorageModule',
  'ui.bootstrap',
  'ui.select',
  'ngAnimate',
  'ui.router',
  'flow',
  'pascalprecht.translate',
  'ngSanitize',
  'infinite-scroll'
])

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/login");

  $stateProvider
    .state('master',{
      abstract:true,
      views:{
          '@':{
              templateUrl: 'layout/layout.html',
              controller: 'layoutCtrl'
          }
      }  
    })
    .state('master.login', {
      url: "/login",
      templateUrl: "account/login.html",
      controller:"LoginCtrl",
      authenticate: false
    })
    .state('master.register', {
      url: "/register",
      templateUrl: "account/register.html",
      controller:"RegisterCtrl",
      authenticate: false
    })
    .state('master.bugs', {
      url: "/bugs",
      templateUrl: "bug/bug-list.html",
      controller:"BugListCtrl",
      authenticate: true
    })
    .state("master.bugs.create",{
      url: "/create",
      authenticate: true,
      onEnter: ['$stateParams', '$state', '$uibModal', '$log', function($stateParams, $state, $uibModal, $log) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'bug/create-bug.html',
          controller: 'CreateBugCtrl',
          backdrop :'static'
          //size: 'lg',
          //resolve: {
          //    $uibModalInstance: function () {
          //        return modalInstance;
          //    }
          //}
        });
        modalInstance.result.then(function (selectedItem) {
          $log.debug(selectedItem);
          //$state.go('bugs');
        })
        .finally( function () {
          $state.go('bugs');
          $log.info('Modal dismissed at: ' + new Date());
        });
      }]
    })
    .state("master.bugDetails",{
      url: "/bugs/:id",
      templateUrl: "bug/bug-details.html",
      controller:"BugDetailsCtrl",
      authenticate: true
    })
    .state('master.projects',{
        url: "/projects",
        templateUrl: "project/project-list.html",
        controller:"ProjectListCtrl",
        authenticate: true
    })
    .state('master.projectDetails',{
        url: "/projects/:id",
        templateUrl: "project/project-details.html",
        controller:"ProjectDetailsCtrl",
        authenticate: true
    })
    .state('master.createProject',{
        url: "/project/create",
        templateUrl: "project/create-project.html",
        controller:"CreateProjectCtrl",
        authenticate: true
    })
    .state('master.logout',{
        url: "/logout",
        controller:"LogoutCtrl",
        authenticate: true
    });
})

.constant('apiRoot','http://localhost:8080/api')

.config(['flowFactoryProvider', 'apiRoot', function (flowFactoryProvider, apiRoot) {
  flowFactoryProvider.defaults = {
    target: apiRoot+'/upload',
    testChunks:false
    //permanentErrors:[404, 500, 501]
  };
}])

.run(['authService', function (authService) {
    authService.fillAuthData();
}])

.run(function($rootScope, $state, authService){
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
        if (toState.authenticate && !authService.authentication.isAuth){
            // User isn’t authenticated
            $state.transitionTo("master.login");
            event.preventDefault(); 
        }
        else if(authService.authentication.isAuth && (toState.name==="master.login" || toState.name==="master.register")){
            $state.transitionTo("master.bugs");
            event.preventDefault(); 
        }
    });  
})

.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
})

.config(function ($translateProvider) {
  $translateProvider.translations('pl', {
    Login: 'Zaloguj',
    Register: 'Rejestracja',
    Name: 'Nazwa',
    MyGreatUrl: 'np. https://nasz.super.projekt.pl',
    Statuses :{
        New: 'Nowy',
        Done: 'Naprawiony',
        InProgress: 'W trakcie prac',
        InTesting: 'W trakcie testowania' 
    }
  });
  $translateProvider.translations('en', {
    Login: 'Login',
    Register: 'Register'
  });
  $translateProvider.useSanitizeValueStrategy('sanitize');
})

.run(function($translate, languageService){
    $translate.use(languageService.lang);
  //$translate.preferredLanguage(languageService.lang);
})

.directive('clientHeight', function(){
  return {
    link:function($scope, $elem, $attrs){
      $elem.css('height', window.innerHeight*$attrs.clientHeight/100+'px');
      $elem.css('overflow-y', 'scroll');
    }
  }
});
