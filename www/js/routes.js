angular.module('app.routes', ['ionicUIRouter']).config(function($stateProvider, $urlRouterProvider) {$stateProvider
  .state('jelajah', {
    url: '/jelajah',
    templateUrl: 'templates/jelajah.html',
    controller: 'jelajahCtrl',
    params: {
      changeCity: null
    }
  })
    
  .state('pencarian', {
    url: '/pencarian',
    templateUrl: 'templates/pencarian.html',
    controller: 'pencarianCtrl',
    params: {
      query: null
    }
  })

  .state('tersimpan', {
    url: '/tersimpan',
    templateUrl: 'templates/tersimpan.html',
    controller: 'tersimpanCtrl'
  })

  .state('restorans', {
    url: '/restorans',
    templateUrl: 'templates/restorans.html',
    controller: 'restoransCtrl',
    params: {
      category: null,
      name: null
    }
  })

  .state('restoran', {
    url: '/restoran/:index',
    templateUrl: 'templates/restoran.html',
    controller: 'restoranCtrl',
    params: {
      index: null
    }
  })

  .state('peta', {
    url: '/peta',
    templateUrl: 'templates/peta.html',
    controller: 'petaCtrl',
    params: {
      index: null
    }
  })

  .state('terdekat', {
    url: '/terdekat',
    templateUrl: 'templates/terdekat.html',
    controller: 'terdekatCtrl'
  })

  .state('ulasanMenu', {
    url: '/ulasanMenu',
    templateUrl: 'templates/menu.html',
    controller: 'ulasanMenuCtrl',
    params: {
      selectedMenu: null
    }
  })

  .state('promo', {
    url: '/promo',
    templateUrl: 'templates/promo.html',
    controller: 'promoCtrl'
  })

  .state('login', {
    url: '/login-page',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('kota', {
    url: '/kota-page',
    templateUrl: 'templates/kota.html',
    controller: 'kotaCtrl'
  })

  .state('wizard', {
    url: '/wizard-page',
    templateUrl: 'templates/wizard.html',
    controller: 'wizardCtrl',
    disableHardwareBackButton : true
  })

  .state('registration', {
    url: '/registration',
    templateUrl: 'templates/registration.html',
    controller: 'registrationCtrl'
  })

  .state('profil', {
    url: '/profil',
    templateUrl: 'templates/profil.html',
    controller: 'profilCtrl'
  })

  .state('rekomendasi',{
    url:'/rekomendasi',
    templateUrl: 'templates/rekomendasi.html',
    controller: 'rekomendasiCtrl'
  })

  .state('daftar',{
    url:'/daftar',
    templateUrl: 'templates/daftar.html',
    controller: 'daftarCtrl'
  })

  .state('klaim', {
    url: '/klaim',
    templateUrl:'templates/klaim.html',
    controller:'klaimCtrl',
    params: {
      index: null,
      name: null
    }
  })
  
  .state('lapor', {
    url: '/lapor',
    templateUrl:'templates/lapor.html',
    controller:'laporCtrl',
    params: {
      index: null,
      name: null
    }
  });
  
  $urlRouterProvider.otherwise('/jelajah');
});