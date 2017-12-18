angular.module('app.controllers', [])

// documented
.controller('restoransCtrl', function($scope, $stateParams, Services, $ionicLoading, $cordovaToast, $ionicTabsDelegate, $cordovaSocialSharing, $timeout, Analytics, $state, $localStorage, $ionicSlideBoxDelegate) {
	var loadFlag = false;
	$scope.nodata = false;
	$scope.notersimpan = false;
	$ionicLoading.show({
      template: '<ion-spinner icon="dots" class="spinner-positive"></ion-spinner>'
    });

    $timeout(function() {
    	$ionicLoading.hide();
    	if(!loadFlag) {
    		$scope.nodata = true;
    		makeToast('Koneksi tidak stabil');
    		console.log('timeout');
    	}
    }, 10000);

	$scope.category = $stateParams.name;

	var category = $stateParams.category;
	var flag = new Date().getTime();
	var flag2 = flag;
	var failCounter = 0;

	$scope.$on('$ionicView.enter', function() {
		// Analytics.logView('Kategori'+ $scope.category);
		// console.log('trackView, Kategori, '+$scope.category);

		// trackView
		Analytics.logViewArr(['Kategori', $scope.category]);

		// trackEvent
		Analytics.logEvent('Kategori', $scope.category, 'Seen');
		Analytics.logEvent('Jelajah', 'Kategori', $scope.category);

		// trackUser view
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackView',
					'Kategori',
					$scope.category
				]);
		// trackUser event
		Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Kategori",
				$scope.category,
				"Seen"
			]);
		Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Jelajah",
				"Kategori",
				$scope.category,
			]);

		failCounter = 0;
	});

	$scope.getRestorans = function() {
		loadFlag = false;
		$scope.nodata = false;
		$scope.notersimpan = false;

	    $timeout(function() {
	    	$scope.$broadcast('scroll.refreshComplete');
	    	if(!loadFlag) {
	    		$scope.nodata = true;
	    		makeToast('Koneksi tidak stabil');
	    		console.log('timeout - reload');
	    	}
	    }, 10000);
		flag = new Date().getTime();
		flag2 = flag;
		failCounter = 0;
		loadResto();
	}

	loadResto();

	$scope.saveRestoran = function(index) {
		if(Services.checkSavedRestoran(index)) {
			Services.deleteRestoran(index).then(function() {
				// analytics.trackEvent('Simpan Kuliner', 'Hapus Simpan', index, 5);
				// trackEvent
				Analytics.logEvent('Simpan Kuliner', 'Hapus Simpan');
				Analytics.logEvent('Kategori', $scope.category, 'Unsave');
				Analytics.logMerchant(index, 'Unsave');

				// trackUser Event
				Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					"trackEvent",
					"Kategori",
					$scope.category,
					"Unsave"
				]);
				Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					"trackEvent",
					"Simpan Kuliner",
					"Hapus Simpan"
				]);
				// trackUser Merchant
				Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					"trackMerchant",
					index,
					"Unsave"
				]);

				makeToast('Dihapus dari Wishlist', 1500, 'bottom');
			});
		} else {
			Services.saveRestoran(index).then(function(result) {
				if(result) {
					// trackEvent
					Analytics.logEvent('Simpan Kuliner', 'Simpan');
					Analytics.logEvent('Kategori', $scope.category, 'Save');
					// trackMerchant
					Analytics.logMerchant(index, 'Save');

					// trackUser Event
					Analytics.logUserArr([
						$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
						"trackEvent",
						"Kategori",
						$scope.category,
						"Save"
					]);
					Analytics.logUserArr([
						$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
						"trackEvent",
						"Simpan Kuliner",
						"Simpan"
					]);
					// trackUser Merchant
					Analytics.logUserArr([
						$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
						"trackMerchant",
						index,
						"Save"
					]);
					makeToast('Wishlist berhasil ditambahkan', 1500, 'bottom');
				} else {
					makeToast('Terjadi kesalahan', 1500, 'bottom');
					console.log('this should not ever happen.');
				}
			}, function(reason) {
				// trackEvent
				Analytics.logEvent('Simpan Kuliner', 'Simpan Penuh');
				// trackUser Event
				Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					"trackEvent",
					"Simpan Kuliner",
					"Simpan Penuh"
				]);
				console.log('trackEvent, Simpan Penuh');
				makeToast('Wishlist penuh (30)', 1500, 'bottom');
			});
		}
	}

	$scope.shareRestoran = function(index) {
		/////////////////////////////////////////////////////////////////////
		//
		// get data resto
		//
		//////////////////////////////////////////////////////////////////////
		var resto = null;
		for(var id in $scope.restorans) {
			if($scope.restorans[id].index == index) {
				resto = $scope.restorans[id];
				break;
			}
		}

		var link = "Buka di aplikasi MANGAN untuk info selengkapnya, https://mobilepangan.com/kuliner/"+index;
		var gambar = null;
		var textshared = resto.namaResto+" - "+resto.keteranganResto;

		$cordovaSocialSharing.share(textshared, resto.namaResto, gambar, link)
		.then(function(result) {
			// trackMerchant
			Analytics.logMerchant(index, 'Share');
			// trackEvent
			Analytics.logEvent('Kategori', $scope.category, 'Share');
			Analytics.logEvent('Share', 'Kuliner', 'Success');

			// trackUser Event
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Kategori",
				$scope.category,
				"Share"
			]);
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Share",
				"Kuliner",
				"Success"
			]);
			// trackUser Merchant
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackMerchant",
				index,
				"Share"
			]);
			makeToast('Berhasil membagikan', 1500, 'bottom');
			console.log('trackEvent, Share, '+index);
		}, function(err) {
			// trackEvent
			Analytics.logEvent('Share', 'Kuliner', 'Error');
			// trackUser Event
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Share",
				"Kuliner",
				"Error"
			]);
			makeToast('Gagal membagikan', 1500, 'bottom');
			console.log('error');
		});
	}

	$scope.checkSavedRestoran = function(index) {
		return Services.checkSavedRestoran(index);
	}

	$scope.loadMoreResto = function() {
		loadResto();
	}

	$scope.canLoadResto = function() {
		return (failCounter < 3);
	}

	function loadResto() {
		switch(category) {
			case 'terbaru': {
				Services.getNewRestorans(flag).then(function(restorans) {
					if(restorans) {
						loadFlag = true;
						$scope.nodata = false;

						$scope.restorans = restorans;
						$ionicLoading.hide();
						$scope.$broadcast('scroll.refreshComplete');
					}
				}, function(reason) {
					console.log('error fetch data');
					makeToast('Koneksi tidak stabil', 1500, 'bottom');
					$ionicLoading.hide();
					$scope.$broadcast('scroll.refreshComplete');
				}).finally(function() {
					$scope.$broadcast('scroll.refreshComplete');
				});
				failCounter = 3;
			} break;
			case 'delivery' : {
				Services.getAllRestorans(flag).then(function(restorans) {
					if(!$scope.restorans) {
						$scope.restorans = {};
					}
					if(restorans) {
						loadFlag = true;
						$scope.nodata = false;
						var n = 0;
						for(var id in restorans) {
							if(restorans[id].delivery) {
								n++;
							} else {
								console.log(restorans[id].namaResto);
								delete restorans[id];
							}
						}

						var i=0;
						for(var id in restorans) {
							if(!(id in $scope.restorans)) {
								$scope.restorans[id] = restorans[id];
							}

							if(restorans[id].tglInput < flag) {
								flag = restorans[id].tglInput;
							}
						}
					} else if ($scope.restorans.length <= 0) {
						$scope.nodata = true;
					}
					
					$ionicLoading.hide();
					$scope.$broadcast('scroll.infiniteScrollComplete');
					$scope.$broadcast('scroll.refreshComplete');

					if(flag >= flag2) {
						flag--;
						failCounter++;
					} else {
						failCounter = 0;
					}
					flag2 = flag;
				}, function(reason) {
					$scope.nodata = true;

					console.log('error fetch data');
					makeToast('Koneksi tidak stabil');
					$ionicLoading.hide();
					$scope.$broadcast('scroll.infiniteScrollComplete');
					$scope.$broadcast('scroll.refreshComplete');
				}).finally(function() {
					$scope.$broadcast('scroll.infiniteScrollComplete');
					$scope.$broadcast('scroll.refreshComplete');
				});
			} break;
			case 'all' : {
				Services.getAllRestorans(flag).then(function(restorans) {
					if(!$scope.restorans) {
						$scope.restorans = {};
					}

					if(restorans) {
						console.log("adaresto");
						loadFlag = true;
						$scope.nodata = false;

						var n = 0;
						for(var id in restorans) {
							n++;
							// console.log(id);
						}

						var i=0;
						for(var id in restorans) {
							if(!(id in $scope.restorans)) {
								$scope.restorans[id] = restorans[id];
							}
							// console.log(restorans[id].tglInput);
              
							if(restorans[id].tglInput < flag) {
								flag = restorans[id].tglInput;
							}
						}
					} else if ($scope.restorans.length <= 0) {
						console.log("gaada resto");
						$scope.nodata = true;
					}
					
					$ionicLoading.hide();
					$scope.$broadcast('scroll.infiniteScrollComplete');
					$scope.$broadcast('scroll.refreshComplete');

					if(flag >= flag2) {
						flag--;
						failCounter++;
					} else {
						failCounter = 0;
					}
					flag2 = flag;
				}, function(reason) {
					$scope.nodata = true;

					console.log('error fetch data');
					makeToast('Koneksi tidak stabil');
					$ionicLoading.hide();
					$scope.$broadcast('scroll.infiniteScrollComplete');
					$scope.$broadcast('scroll.refreshComplete');
				}).finally(function() {
					$scope.$broadcast('scroll.infiniteScrollComplete');
					$scope.$broadcast('scroll.refreshComplete');
				});
			} break;
			default: {
				Services.getRestoranCategory(category).then(function(restorans) {
					if(restorans) {
						loadFlag = true;

						$scope.restorans = {};

						for(var r in restorans) {
							Services.getRestoranDetails(r).then(function(restoran) {
								// $scope.restorans.push(restoran);
								$scope.restorans[restoran.index] = restoran;

								$ionicLoading.hide();
								$scope.$broadcast('scroll.refreshComplete');
							}, function(reason) {
								console.log('error fetch data');
								makeToast('Koneksi tidak stabil', 1500, 'bottom');
								$scope.$broadcast('scroll.refreshComplete');
							});
						}

					}
				}, function(reason) {
					console.log('error fetch data');
					makeToast('Koneksi tidak stabil', 1500, 'bottom');
					$ionicLoading.hide();
					$scope.$broadcast('scroll.refreshComplete');
				}).finally(function() {
					$scope.$broadcast('scroll.refreshComplete');
				});

				failCounter = 3;
			} break;
		}
	}

	$scope.openRestoran = function(index, image) {
		if (image) {
			// trackEvent
			Analytics.logEventArr(['Buka Restoran', 'Click Gambar']);
			Analytics.logEventArr(['Kategori', $scope.category, 'Buka Restoran', 'Click Gambar']);
			// trackUser Event
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Buka Restoran",
				"Click Gambar"
			]);
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Kategori",
				$scope.category,
				"Buka Restoran",
				'Click Gambar'
			]);
		} else {
			// trackEvent
			Analytics.logEventArr(['Buka Restoran', 'Click Icon More']);
			Analytics.logEventArr(['Kategori', $scope.category, 'Buka Restoran', 'Click Icon More']);
			// trackUser Event
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Buka Restoran",
				"Click Icon More"
			]);
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Kategori",
				$scope.category,
				"Buka Restoran",
				'Click Icon More'
			]);
		}
		$state.go('restoran', {index: index});
	}

	function makeToast(_message) {
		window.plugins.toast.showWithOptions({
			message: _message,
			duration: 1500,
			position: 'bottom',
			addPixelsY: -40
		});
	}

	$scope.next = function() {
    $ionicSlideBoxDelegate.next();
  	};
  	$scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  	};

  	// Called each time the slide changes
  	$scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  }
})

// documented
.controller('restoranCtrl', function($scope, $stateParams, Services, $cordovaGeolocation, $ionicLoading, $cordovaToast, $ionicModal, $state, $ionicPopup, $timeout, Analytics, $cordovaSocialSharing, $ionicHistory, $ionicPopup, $cordovaAppVersion, $localStorage, $ionicSlideBoxDelegate, $http) {
	var loadFlag = false;
	$scope.loadFlag = loadFlag;
	var loadingIndicator = $ionicLoading.show({
      template: '<ion-spinner icon="dots" class="spinner-positive"></ion-spinner>'
	});

	$scope.getPosition = function(){
		$scope.coords = {
			// latitude: -7.5633375,
			// longitude: 110.8107685
		};
	
		var options = {
			timeout: 30000, 
			enableHighAccuracy: true
		}
	
		$cordovaGeolocation.getCurrentPosition(options).then(function(position) {
			$scope.coords = position.coords;
			console.log("coords :"+JSON.stringify(position));
		}, function(error) {
			console.log("could not get location :"+JSON.stringify($scope.coords));
		});
	}

	$scope.getPosition();

    $timeout(function() {
    	$ionicLoading.hide();
    	if(!loadFlag) {
    		makeToast('Koneksi tidak stabil');
    	}
    }, 10000);

	$scope.$on('$ionicView.enter', function() {
		$scope.getPosition();	
		// trackView
		Analytics.logView('Kuliner');

		// trackMerchant
		Analytics.logMerchant($stateParams.index, 'Seen');

		// trackUser View
		Analytics.logUser(
			$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
			'trackView',
			'Kuliner'
		);
		// trackUser Merchant
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackMerchant',
					$stateParams.index,
					'Seen'
				])
	});

	$scope.restoran = null;
	$scope.restoranImg = null;
	$scope.menus = null;
	$scope.reviews = null;
	$scope.user = {
		rating: 5
	};

	$scope.recomendationCarouselOption = {
		carouselId    : 'recomendation-carousel',
		align         : 'left',
		selectFirst   : false,
		centerOnSelect: false,
		template      : 'templates/carousel-templates/recomendation.html',
		// pullRefresh   : {
		// 	active  : true,
		// 	callBack: pullRefresh
		// }
	};

	// get Restoran
	$scope.getRestoran = function() {
		Services.getRestoranDetails($stateParams.index).then(function(restoran) {
			if(restoran) {
				$scope.getRecomendation($stateParams.index);
				$scope.restoran = restoran;
				$scope.restoranImg = restoran.gambar;
				loadFlag = true;
				$scope.loadFlag = loadFlag;

				$ionicSlideBoxDelegate.update();

				Services.getRestoranMenus($stateParams.index).then(function(menus) {
					if(menus) {
						$scope.menus = menus;
						$scope.menuReviews = [];
						for(var m in menus){
							if(menus[m].review && menus[m].review != null){
								$scope.menuReviews.push(menus[m]);
							}
						}
						refreshRatingReview();
					} else {
						makeToast('Error, tidak ada menu', 1500, 'bottom');
					}
					
					$ionicLoading.hide();
				}, function(reason) {
					makeToast('Koneksi tidak stabil', 1500, 'bottom');
					$ionicLoading.hide();
				});
			} else {
				$ionicLoading.hide();
			}
		}, function(reason) {
			makeToast('Koneksi tidak stabil', 1500, 'bottom');
			$ionicLoading.hide();
		}).finally(function() {
			$scope.$broadcast('scroll.refreshComplete');
		});
	}

	$scope.getRestoran();

	$scope.getRecomendation = function(indexResto){
		$scope.showLoading = true;	
		$http.get("https://us-central1-project-1449647215698534337.cloudfunctions.net/getKeyword?index=" + indexResto).then(function(data) {
			var restoKeyword = {
				index: indexResto,
				keyword: data.data
			}
	
			$http.get("https://us-central1-project-1449647215698534337.cloudfunctions.net/getAllKeyword").then(function (response) {
				Object.size = function(obj) {
					var size = 0, key;
					for (key in obj) {
						if (obj.hasOwnProperty(key)) size++;
					}
					return size;
				};

				var allKeyword = response.data;

				var size = Object.size(allKeyword);
	
				recomendations = [];
				var g = 1;
				console.log("allKeyword length: "+size)
				for(var m in allKeyword){
					if(g == size && recomendations.length > 0){
						$scope.fetchRecomendation(recomendations);			
					}else if(recomendations.length == 0){
						$scope.showLoading = false;						
					}
					// get similar value
					var n = restoKeyword.keyword.filter(function(val) {
						return allKeyword[m].keyword.indexOf(val) != -1;
					});
		
					var cosine = n.length / Math.sqrt(restoKeyword.keyword.length * allKeyword[m].keyword.length);
					allKeyword[m].similarity = cosine
					
					if(cosine >= 0.4 && restoKeyword.index!=allKeyword[m].index){
						recomendations.push({
							index: allKeyword[m].index
						})
						// $http.get("https://us-central1-manganbak.cloudfunctions.net/getDataResto?index="+allKeyword[m].index).then(function(dataResto){
						// 	// dataResto.data.distance = Services.getDistance(position.latitude, position.longitude, dataResto.data.map.lat, dataResto.data.map.long)
						// 	console.log('dataResto: '+JSON.stringify(dataResto.data))
						// 	$scope.recomendation.push(dataResto.data);
						// }, function(err){
						// 	console.log('error get dataResto:'+err)
						// })
					}
					g++
				}
				// $scope.fetchRecomendation(recomendations)
			},function(err){
				console.log("error get all keyword : " + JSON.stringify(err));			
			});
	
		}, function (err) {
			console.log("error get keyword : " + JSON.stringify(err));
		});
	}

	$scope.fetchRecomendation = function(recomendations) {
		$ionicSlideBoxDelegate.update();
		$scope.slideRestorans = [];
		$scope.showRecomendation = false;
		$scope.showLoading = false;

		if (recomendations) {
			var slideCount = 0;
			var i = 0;
			var j = 0;
			for (r in recomendations) {
				console.log('r: '+ JSON.stringify(recomendations[r]));
				Services.getRestoranDetails(recomendations[r].index).then(function(restoran) {
					console.log('slide: '+ slideCount +' | i: '+ i +' | '+ restoran.index);
					if (!$scope.slideRestorans[slideCount]) {
						var slideRestoran = {};
						$scope.slideRestorans[slideCount] = slideRestoran;
					}
					restoran.distance = Services.getDistance($scope.coords.latitude, $scope.coords.longitude, restoran.map.lat, restoran.map.long);						
					$scope.slideRestorans[slideCount][restoran.index] = restoran;

					i++;
					if (i==3) {
						i = 0;
						slideCount++;
						$ionicSlideBoxDelegate.update();
					}
					$scope.showRecomendation = true
				}, function(reason) {
					console.log('error fetch data');
				});

				// if(j == recomendations.length){
				// 	$scope.showLoading = false;
				// 	$scope.showRecomendation = true;		
				// 	$ionicSlideBoxDelegate.update();
				// }

				// j++
			}
			$ionicSlideBoxDelegate.update();
		}
	}

	///////////////////////////////////////////////////////////
	//
	// RATING SECTION
	//
	///////////////////////////////////////////////////////////
	$scope.jmlSad = 0;
	$scope.jmlHappy = 0;
	$scope.jmlFavorite = 0;
	$scope.jmlReview = 0;
	$scope.sadSelected = false;
	$scope.happySelected = true;
	$scope.favoriteSelected = false;
	$scope.reviews = null;
	$scope.user = {
		rating: 5
	};

	$scope.sadFeedbackCallback = function() {
		console.log('sad');
		$scope.sadSelected = true;
		$scope.happySelected = false;
		$scope.favoriteSelected = false;
		$scope.user = {
			rating: 1
		};
		$scope.user.emoji = 'sad';
	};

	$scope.happyFeedbackCallback = function() {
		console.log('happy');
		$scope.sadSelected = false;
		$scope.happySelected = true;
		$scope.favoriteSelected = false;
		$scope.user = {
			rating: 3
		};
		$scope.user.emoji = 'happy';
	};

	$scope.favoriteFeedbackCallback = function() {
		console.log('favorite');
		$scope.sadSelected = false;
		$scope.happySelected = false;
		$scope.favoriteSelected = true;
		$scope.user = {
			rating: 5
		};
		$scope.user.emoji = 'favorite';
	};

	$scope.saveRatingReview = function() {
		// trackEvent
		Analytics.logEvent('Ulasan Pengguna', 'Tombol Simpan Ulasan');
		// trackUser Event
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackEvent',
					'Ulasan Pengguna',
					'Tombol Simpan Ulasan'
				]);
		if ($scope.user.emoji == null 
			&& $scope.user.titleReview == null
			&& $scope.user.review == null) {
			$ionicPopup.alert({
				title: 'Ups',
				template: '<center><p>Kamu harus mengisi rating atau review</p></center>',
				okText: 'OK',
				okType: 'button-oren'
			});
		} else {
			var user = firebase.auth().currentUser;
			if (user) {
				user.providerData.forEach(function(profile) {
					Services.getProfileByUid(profile.uid).then(function(dataUser) {
						if (dataUser) {
							$scope.dataUser = dataUser;
							var dataReview = {
								'resto': $scope.restoran.index,
								'indexUser': $scope.dataUser.index,
								'rating': $scope.user.rating,
								'titleReview': $scope.user.titleReview || null,
								'review' : $scope.user.review || null,
								'username': $scope.dataUser.name,
								'userPhotoUrl': $scope.dataUser.photoUrl,
								'emoji': $scope.user.emoji || 'happy'
							}
							Services.updateRatingReview(dataReview).then(function(result) {
								if($scope.sadSelected) {
									Services.updateJmlSad($scope.restoran.index).then(function(result) {
										$scope.getRestoran();
									});
								} else if($scope.happySelected) {
									Services.updateJmlHappy($scope.restoran.index).then(function(result) {
										$scope.getRestoran();										
									});
								} else if($scope.favoriteSelected) {
									Services.updateJmlFavorite($scope.restoran.index).then(function(result) {
										$scope.getRestoran();										
									});
								}

								refreshRatingReview();
								$scope.user = null;
								// trackMerchant
								Analytics.logMerchant($stateParams.indexResto, 'Diulas Pengguna');
								// trackUser Merchant
								Analytics.logUserArr([
											$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
											'trackMerchant',
											$stateParams.indexResto,
											'Diulas Pengguna'
										]);
							}, function(reason) {
								console.log('gagal review');
								makeToast('Gagal menambahkan ulasan');
							});
						} else {
							console.log('profil no dataUser found with uid:'+uid);
						}
					});
				});
			} else {
				$ionicPopup.alert({
					title: 'Belum login',
					template: '<center>Kamu harus login dulu</center>',
					okText: 'OK',
					okType: 'button-oren'
				});
				$state.go('login');
			};
		}
		$scope.modalRating.hide();
	};

	function refreshRatingReview() {
		$scope.jmlReview = 0;
		Services.getRestoranReviews($stateParams.index).then(function(reviews) {
			if(reviews) {
				for(var r in reviews) {
					if(reviews[r].review == undefined || reviews[r].review == null) {
						delete reviews[r];
					} else {
						$scope.jmlReview++;
					}
				}
				$scope.reviews = reviews;
			}
			$ionicLoading.hide();
		}, function(reason) {
			console.log(JSON.stringify(reason));
			$ionicLoading.hide();
		});
		$scope.$broadcast('scroll.refreshComplete');
	}

	$scope.openMenu = function(index, indexmenu) {
		// trackView
		Analytics.logView('Ulasan Menu');
		// trackEvent
		Analytics.logEvent('Kuliner', 'Ulasan Menu');

		// trackUser View
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackView',
					'Ulasan Menu'
				]);
		// trackUser Event
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackEvent',
					'Kuliner',
					'Ulasan Menu'
				]);

		$scope.selectedMenu = $scope.menus[index]? $scope.menus[index] : $scope.menus[indexmenu];

		// trackMerchant
		// Analytics.logMerchant($stateParams.index, 'Ulasan Menu', $scope.selectedMenu.indexmenu);
		Analytics.logMerchant($stateParams.index, 'Ulasan Menu', indexmenu);

		// trackUser Merchant
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackMerchant',
					$stateParams.index,
					'Ulasan Menu',
					// $scope.selectedMenu.indexmenu
					indexmenu
				]);
		if (!$scope.selectedMenu.review) {
			// $scope.modalMenuGambar.show();
		}else{
			// $scope.modalMenu.show();
			$state.go('ulasanMenu', {'selectedMenu': $scope.selectedMenu});
		}
	};

	$scope.shareRestoran = function(index) {
		var resto = $scope.restoran;
		var link = "Buka di aplikasi MANGAN untuk info selengkapnya, https://mobilepangan.com/kuliner/"+index;
		var gambar = null;
		var textshared = resto.namaResto+" - "+resto.keteranganResto+" Buka di aplikasi MANGAN untuk info selengkapnya.";

		$cordovaSocialSharing.share(textshared, resto.namaResto, gambar, link)
		.then(function(result) {
			// trackEvent
			Analytics.logEvent('Share', 'Kuliner', 'Success');
			Analytics.logEvent('Kuliner', 'Share');
			// trackMerchant
			Analytics.logMerchant($stateParams.index, 'Share');

			// trackUser Event
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Kuliner",
				"Share"
			]);
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Share",
				"Kuliner",
				"Success"
			]);
			// trackUser Merchant
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackMerchant",
				$stateParams.index,
				"Share"
			]);
			makeToast('Berhasil membagikan', 1500, 'bottom');
		}, function(err) {
			// trackEvent
			Analytics.logEvent('Share', 'Kuliner', 'Error');
			// trackUser Event
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Share",
				"Kuliner",
				"Error"
			]);
			makeToast('Gagal membagikan', 1500, 'bottom');
		});
	}

	$scope.saveRestoran = function(index) {
		if(Services.checkSavedRestoran(index)) {
			Services.deleteRestoran(index).then(function() {
				// trackEvent
				Analytics.logEvent('Simpan Kuliner', 'Hapus Simpan');
				Analytics.logEvent('Kuliner', 'Unsave');
				// trackMerchant
				Analytics.logMerchant($stateParams.index, 'Unsave');
				// trackuser Event
				Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					"trackEvent",
					"Simpan Kuliner",
					"Hapus Simpan"
				]);
				Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					"trackEvent",
					"Kuliner",
					"Unsave"
				]);
				// trackUser Merchant
				Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					"trackMerchant",
					$stateParams.index,
					"Unsave"
				]);
				makeToast('Dihapus dari Wishlist', 1500, 'bottom');
			});
		} else {
			Services.saveRestoran(index).then(function(result) {
				if(result) {
					// trackEvent
					Analytics.logEvent('Simpan Kuliner', 'Simpan');
					Analytics.logEvent('Kuliner', 'Simpan');
					// trackMerchant
					Analytics.logMerchant($stateParams.index, 'Save');
					// trackuser Event
					Analytics.logUserArr([
						$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
						"trackEvent",
						"Simpan Kuliner",
						"Simpan"
					]);
					Analytics.logUserArr([
						$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
						"trackEvent",
						"Kuliner",
						"Save"
					]);
					// trackUser Merchant
					Analytics.logUserArr([
						$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
						"trackMerchant",
						$stateParams.index,
						"Save"
					]);
					makeToast('Wishlist berhasil ditambahkan', 1500, 'bottom');
				} else {
					makeToast('Terjadi kesalahan', 1500, 'bottom');
					console.log('this should not ever happen.');
				}
			}, function(reason) {
				// trackEvent
				Analytics.logEvent('Simpan Kuliner', 'Simpan Penuh');
				// trackUser Event
				Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					"trackEvent",
					"Simpan Kuliner",
					"Simpan Penuh"
				]);
				makeToast('Penyimpanan restoran penuh (max. 30)', 1500, 'bottom');
			});
		}
	}

	$scope.checkSavedRestoran = function(index) {
		return Services.checkSavedRestoran(index);
	}

	$scope.call = function(tel) {
		if (tel) {
			// trackMerchant
			Analytics.logMerchant($stateParams.index, 'Call');
			// trackEvet
			Analytics.logEvent('Kuliner', 'Call');
			// trackuser Event
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Kuliner",
				"Call"
			]);
			// trackUser Merchant
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackMerchant",
				$stateParams.index,
				"Call"
			]);
			window.open('tel:'+tel, '_system', 'location=yes');			
		} else {
			// trackMerchant
			Analytics.logMerchant($stateParams.index, 'Tombol Call');
			// trackEvent
			Analytics.logEvent('Kuliner', 'Tombol Call Tidak Tersedia');
			// trackuser Event
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Kuliner",
				"Tombol Call Tidak Tersedia"
			]);
			// trackUser Merchant
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackMerchant",
				$stateParams.index,
				"Tombol Call"
			]);
			$ionicPopup.alert({
				title: 'Perhatian',
				template: '<center>Nomor telepon tidak tersedia</center>',
				okText: 'OK',
				okType: 'button-oren'
			});
		}
	}

	$scope.navigate = function(index) {
		if ($scope.restoran.map) {
			// trackEvent
			Analytics.logEvent('Kuliner', 'Tombol Lokasi');
			// trackMerchant
			Analytics.logMerchant($stateParams.index, 'Tombol Lokasi');
			// trackuser Event
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Kuliner",
				"Tombol Lokasi"
			]);
			// trackUser Merchant
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackMerchant",
				$stateParams.index,
				"Tombol Lokasi"
			]);
			$state.go('peta', { 'index': index } )			
		} else {
			// trackEvent
			Analytics.logEvent('Kuliner', 'Tombol Lokasi Tidak Tersedia');
			// trackMerchant
			Analytics.logMerchant($stateParams.index, 'Tombol Lokasi');
			// trackuser Event
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Kuliner",
				"Tombol Lokasi Tidak Tersedia"
			]);
			// trackUser Merchant
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackMerchant",
				$stateParams.index,
				"Tombol Lokasi"
			]);
			$ionicPopup.alert({
				title: 'Perhatian',
				template: '<center>Lokasi tidak tersedia</center>',
				okText: 'OK',
				okType: 'button-oren'
			});
		}
	}

	///////////////////////////////////////////////////////////
	//
	// MODAL SECTION
	//
	///////////////////////////////////////////////////////////

	$ionicModal.fromTemplateUrl('templates/rating.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) { $scope.modalRating = modal; });

	$scope.openRating = function() {
		var user = firebase.auth().currentUser;
		if (user) {
			// trackView
			Analytics.logView('Tulis Ulasan');
			// trackEvent
			Analytics.logEvent('Ulasan Pengguna', 'Tulis Ulasan');
			// trackUser View
			Analytics.logUserArr([
						$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
						'trackView',
						'Tulis Ulasan'
					]);
			// trackUser Event
			Analytics.logUserArr([
						$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
						'trackEvent',
						'Ulasan Pengguna',
						'Tulis Ulasan'
					]);
			$scope.modalRating.show();
		} else {
			$state.go('login');
		}
	}

	$scope.klaim = function() {
		// trackEvent
		Analytics.logEvent('Kuliner', 'Klaim Restoran');

		// trackUser Event
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackEvent',
					'Kuliner',
					'Klaim Restoran'
				]);

		// trackMerchant
		Analytics.logMerchant($stateParams.index, 'Klaim Restoran');

		// trackUser Merchant
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackMerchant',
					$stateParams.index,
					'Klaim Restoran',
				]);
		$state.go("klaim", {index: $scope.restoran.index, name: $scope.restoran.namaResto}); 
	}

	$scope.lapor = function() {
		// trackEvent
		Analytics.logEvent('Kuliner', 'Laporkan Restoran');

		// trackUser Event
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackEvent',
					'Kuliner',
					'Laporkan Restoran'
				]);

		// trackMerchant
		// Analytics.logMerchant($stateParams.index, 'Ulasan Menu', $scope.selectedMenu.indexmenu);
		Analytics.logMerchant($stateParams.index, 'Laporkan Restoran');

		// trackUser Merchant
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackMerchant',
					$stateParams.index,
					'Laporkan Restoran',
				]);
		$state.go("lapor", {index: $scope.restoran.index, name: $scope.restoran.namaResto}); 
	}

	$scope.openRestoran = function(index) {
		// trackEvent
		Analytics.logEventArr(['Buka Restoran', 'Rekomendasi Mirip']);
		Analytics.logEventArr(['Restoran', index, 'Buka Restoran', 'Rekomendasi Mirip']);
		// trackUser Event
		Analytics.logUserArr([
			$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
			"trackEvent",
			"Buka Restoran",
			"Rekomendasi Mirip"
		]);
		Analytics.logUserArr([
			$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
			"trackEvent",
			"Jelajah",
			index,
			"Buka Restoran",
			'Rekomendasi Mirip'
		]);
		$state.go('restoran', {index: index});
	}

	function makeToast(_message) {
		window.plugins.toast.showWithOptions({
			message: _message,
			duration: 1500,
			position: 'bottom',
			addPixelsY: -40
		});
	}
})

// documented
.controller('menusCtrl', function($scope, $stateParams, Services, $ionicModal, $ionicLoading, $cordovaToast, $ionicPopup, $state, $timeout, Analytics, $cordovaAppVersion, $localStorage) {
	var loadFlag = false;
	$scope.loadFlag = false;
	var loadingIndicator = $ionicLoading.show({
      template: '<ion-spinner icon="dots" class="spinner-positive"></ion-spinner>',
    });

    $timeout(function() {
    	$ionicLoading.hide();
    	if(!loadFlag) {
    		makeToast('Koneksi tidak stabil');
    	}
    }, 2500);

    $scope.$on('$ionicView.enter', function() {
    	$scope.getMenus();
    	// trackView
    	Analytics.logView('Buku Menu');

    	// trackUser View
    	Analytics.logUserArr([
    				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
    	    		'trackView',
    	    		'Buku Menu'
    	    	]);
    });

    $scope.getMenus = function() {
		Services.getRestoranMenus($stateParams.index).then(function(menus) {
			if(menus) {
				loadFlag = true;
				$scope.loadFlag = true;
				$scope.menus = menus;
			} else {
				makeToast('Error, tidak ada menu', 1500, 'bottom');
				console.log('Error menu tidak ada');
			}
		}, function(err) {
			makeToast('Koneksi tidak stabil', 1500, 'bottom');
			console.log('Error fetch data');
		}).finally(function() {
			$scope.$broadcast('scroll.refreshComplete');
		});
    }

	// $scope.pesan = function() {
	// 	// trackMerchant
	// 	Analytics.logMerchant($stateParams.index, 'Tombol Pesan');
	// 	// trackEvent
	// 	Analytics.logEvent('Buku Menu', 'Tombol Pesan');
	// 	// trackuser Event
	// 	Analytics.logUserArr([
	// 		$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
	// 		"trackEvent",
	// 		"Buku Menu",
	// 		"Tombol Pesan"
	// 	]);
	// 	// trackUser Merchant
	// 	Analytics.logUserArr([
	// 		$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
	// 		"trackMerchant",
	// 		$stateParams.index,
	// 		"Tombol Pesan"
	// 	]);
	//     Services.getVersion().then(function(version) {
	//     	if (version) {
	//     		// if (config.version < version) {
	//     		$cordovaAppVersion.getVersionCode().then(function(currentVersion) {
	// 				$ionicLoading.hide();

	//     			if (parseInt(currentVersion) < version) {
	// 			    	$ionicPopup.alert({
	// 						title: 'Update Aplikasi',
	// 						template: '<center>Update Aplikasi untuk melanjutkan</center>',
	// 						okText: 'Update',
	// 						okType: 'button-oren',
	// 					}).then(function(res) {
	// 						if(res) {
	// 							// trackEvent
	// 							Analytics.logEvent('Update', 'Tombol Update', 'Pesan Antar');
	// 							// trackuser Event
	// 							Analytics.logUserArr([
	// 								$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
	// 								"trackEvent",
	// 								"Update",
	// 								"Tombol Update",
	// 								"Pesan Antar"
	// 							]);
	// 							window.open('https://play.google.com/store/apps/details?id=com.manganindonesia.mangan', '_system', 'location=yes');
	// 						}
	// 					});
	// 	    		} else {
	// 					Services.getSettingsDelivery().then(function(settings) {
	// 						if (settings) {
	// 							if (settings.status) {
	// 								// trackEvent
	// 								Analytics.logEvent('Pesan Antar', 'Tombol Pesan');
	// 								// trackUser Event
	// 								Analytics.logUserArr([
	// 									$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
	// 									"trackEvent",
	// 									"Pesan Antar",
	// 									"Tombol Pesan"
	// 								]);

	// 								///////////////////
	// 								// fitur pesan
	// 								if ($stateParams.delivery) {
	// 									var user = firebase.auth().currentUser;
	// 									if (user) {
	// 										$state.go('tabsController.pesan', {'index': $stateParams.index});
	// 									} else {
	// 										$state.go('login');
	// 									}
	// 								} else {
	// 									//////////////////
	// 									// tidak mendukung pesan antar
	// 									$ionicPopup.alert({
	// 										title: 'Oops',
	// 										template: '<center>Maaf kuliner ini belum mendukung pesan antar</center>',
	// 										okText: 'OK',
	// 										okType: 'button-oren'
	// 									});
	// 								}
	// 							} else {
	// 								$ionicPopup.alert({
	// 									title: 'Pemberitahuan',
	// 									template: '<center>'+settings.message+'</center>',
	// 									okText: 'OK',
	// 									okType: 'button-oren'
	// 								});
	// 							}
	// 						}
	// 					})
	// 	    		}
	//     		}, function(error) {
	//     			console.log('error get version: '+ error);
	//     		});
	//     	} else {
	//     		console.log('error get version');
	//     		$ionicLoading.hide();
	//     	}
	//     }, function(err) {
	//     	console.log(err);
	//     });
	// };

	function makeToast(_message) {
		window.plugins.toast.showWithOptions({
			message: _message,
			duration: 1500,
			position: 'bottom',
			addPixelsY: -40
		});
	}
})

// documented
.controller('jelajahCtrl', function($scope, $ionicSlideBoxDelegate, Services, $state, $ionicLoading, $cordovaToast, $cordovaGoogleAnalytics, $ionicPopup, $cordovaAppVersion, $cordovaGeolocation, $http, $ionicHistory, Analytics, $ionicModal, $localStorage, $stateParams, $ionicPopover) {
	$scope.connected = false;

	$ionicLoading.show({
		template: '<ion-spinner icon="dots" class="spinner-positive"></ion-spinner>',
		duration: 10000
	});

	if(window.Connection){
		if(navigator.connection.type == Connection.NONE) {
			$ionicLoading.hide();
		}
	}

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			user.providerData.forEach(function(profile) {
				if (profile.providerId === "facebook.com") {
					$scope.getProfileByUid(profile.uid);
				} else if (profile.providerId === "google.com") {
					$scope.getProfileByUid(profile.uid);
				} else {
					console.log('logged in with another provider');
				}
				if ($scope.queue == 'undefined' || $scope.process == 'undefined') {
					$scope.getOrder(profile.uid);
				} else {
					$scope.queue.$destroy();
					$scope.process.$destroy();
					$scope.getOrder(profile.uid);
				}
			});
		} else {
			$scope.dataUser = {
				'photoUrl' : 'img/manganstd.png'
			};
		}
	})

    // Services.getVersion().then(function(version) {
    // 	if (version) {
    // 		$cordovaAppVersion.getVersionCode().then(function(currentVersion) {
    // 			if (parseInt(currentVersion) < version) {
	// 		    	$ionicPopup.confirm({
	// 					title: 'Update Aplikasi',
	// 					template: '<center>Versi baru aplikasi tersedia di play store</center>',
	// 					okText: 'OK',
	// 					cancelText: 'Nanti',
	// 					okType: 'button-oren',
	// 					cancelType: 'button-clear'
	// 				}).then(function(res) {
	// 					if(res) {
	// 						// trackEvent
	// 						Analytics.logEvent('Jelajah', 'Update', 'Update');
	// 						// trackUser Event
	// 						Analytics.logUserArr([
	// 									$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
	// 									'trackEvent',
	// 									'Jelajah',
	// 									'Update',
	// 									'Update'
	// 								]);
	// 						window.open('https://play.google.com/store/apps/details?id=com.manganindonesia.mangan', '_system', 'location=yes');
	// 					} else {
	// 						// trackEvent
	// 						Analytics.logEvent('Jelajah', 'Update', 'Nanti');
	// 						// trackUser Event
	// 						Analytics.logUserArr([
	// 									$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
	// 									'trackEvent',
	// 									'Jelajah',
	// 									'Update',
	// 									'Nanti'
	// 								]);
	// 					}
	// 				});
	//     		} else {
	//     			console.log("version match");
	//     		}
    // 		}, function(error) {
    // 			console.log('error get version: '+ error);
    // 		});
    // 	} else {
    // 		console.log('error get version');
    // 	}
    // }, function(err) {
    // 	console.log(err);
    // });

    $scope.$on('$ionicView.enter', function() {
    	var forwardView = $ionicHistory.forwardView();
    	console.log(JSON.stringify(forwardView));
		if ($stateParams.changeCity) {
			$scope.getRecomendation();
		}
    	$scope.selectedCity = $localStorage.location;
		$scope.user = {};
		$scope.queue = [];
		$scope.process = [];
		$ionicSlideBoxDelegate.update();

		// trackView
    	Analytics.logView('Jelajah');

    	// trackUSer View
    	Analytics.logUserArr([
    				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
    	    		'trackView',
    	    		'Jelajah'
    	    	]);

    	// check current user and get data transaksi
		var user = firebase.auth().currentUser;
		if (user) {
			user.providerData.forEach(function(profile) {
				if (profile.providerId === "facebook.com") {
					$scope.getProfileByUid(profile.uid);
				} else if (profile.providerId === "google.com") {
					$scope.getProfileByUid(profile.uid);
				} else {
					console.log('logged in with another provider');
				}
				$scope.queue = [];
				$scope.process = [];
				$scope.getOrder(profile.uid);
			});
		} else {
			console.log('not logged in');
			$scope.dataUser = "";
		}

		$scope.greeting();

		// if ($localStorage.wizard == null) {
			// console.log('wizard: '+$localStorage.welcome);
			// $state.go('wizard');
		// } else {
			Services.getSettingsLocation().then(function(result) {
				if (result) {
					$scope.locSettings = result.status;
					if (result.status == true) {
						// alert("bisa pilih!");
						if (!$localStorage.location) {
							$state.go('kota');
						}
					} else {
						// alert("blm bisa pilih...");
					}
				}
			}, function(reason) {
				console.log('Error get setting location');
			});
		// }
    });

    // set slider option
	$scope.sliderOptions = {
		loop: false,
		autoplay: true,
		speed: 1000,
		// pagination: false

		onInit: function() {
			console.log('init slider');
			$scope.initSlide();
		},

		onSlideChangeEnd: function(index) {
			$scope.slideChange(index);
		}
	};

	// start Slider
	$scope.initSlide = function() {
		Services.getSliders().then(function(sliders) {
			$scope.slider
			if (sliders) {
				$scope.slidersArr = [];
				for(var r in sliders) {
					$scope.slidersArr.push(sliders[r]);
				}
				// trackEvent
				Analytics.logEventArr(['Ads', 'Slider', $scope.slidersArr[0].index, 'View']);
				// trackUser Event
				Analytics.logUserArr([
							$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
							'trackEvent',
							'Ads',
							'Slider',
							$scope.slidersArr[0].index,
							'View'
						]);
			} else {
				console.log('no slider');
			}
		});
	}

	// listen to slider change
	$scope.slideChange = function(index) {
		// trackEvent
		var branchEvent = [];
			branchEvent.push('Ads');
			branchEvent.push('Slider');
			branchEvent.push($scope.slidersArray[index.activeIndex].index);
			branchEvent.push('View');
		Analytics.logEventArr(branchEvent);

		// trackUser Event
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackEvent',
					'Ads',
					'Slider',
					$scope.slidersArray[index.activeIndex].index,
					'View'
				]);
	}

	// get data of current user
	$scope.getProfileByUid = function(uid) {
		Services.getProfileByUid(uid).then(function(dataUser) {
			if (dataUser) {
				$localStorage.indexUser = dataUser.index;
				$scope.dataUser = dataUser;
			} else {
				$scope.dataUser = "";
			}
		})
	}

	// search
	$scope.searchQuery = function() {
		if ($scope.user.query == null) {
			console.log($scope.user.query);
		} else {
			// trackEvent
			Analytics.logEvent('Jelajah', 'Pencarian');

			// trackUser Event
			Analytics.logUserArr([
						$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
						'trackEvent',
						'Jelajah',
						'Pencarian'
					]);
			$state.go('pencarian', {'query': $scope.user.query});
			delete $scope.user.query;
		}
	};

	// give recomendation
	$scope.rekomendasikan = function() {
		// trackEvent
		Analytics.logEvent('Jelajah', 'Tombol Rekomendasi Restoran');

		// trackUser Event
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackEvent',
					'Jelajah',
					'Tombol Rekomendasi Restoran'
				]);
		$state.go("rekomendasi"); 
	}

	// registration
	$scope.daftar = function() {
		// trackEvent
		Analytics.logEvent('Jelajah', 'Tombol Daftar Restoran');

		// trackUser Event
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackEvent',
					'Jelajah',
					'Tombol Daftar Restoran'
				]);
		$state.go("daftar");
	}

	// go to transaksi
	$scope.transaksi = function() {
		// trackEvent
		Analytics.logEvent('Jelajah', 'Notifikasi Transaksi');

		// trackUser Event
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackEvent',
					'Jelajah',
					'Notifikasi Transaksi'
				]);
		$state.go('tabsController.transaksi');
	}

	// get Sliders
	$scope.getSliders = function() {
		Services.getSliders().then(function(sliders) {
			$scope.sliders = null;
			if (sliders) {
				$scope.sliders = sliders;
				$scope.slidersArray = [];
				var image = [];
				for(var r in sliders) {
					image.push(sliders[r].url);
					$scope.slidersArray.push(sliders[r]);
				}
				$scope.image = image;
				// trackView
				Analytics.logView('Slider');
				// trackEvent
				Analytics.logEvent('Ads', 'Slider', 'Loaded');

				// trackMerchant View
				Analytics.logUserArr([
				    				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
									'trackView',
									'Slider'
								]);
				// trackMerchant Event
				Analytics.logUserArr([
				    				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
									'trackEvent',
									'Ads',
									'Slider',
									'Loaded'
								]);
			} else {
				// trackEvent
				Analytics.logEvent('Ads', 'Slider', 'Not Load');
				// trackUser Event
				Analytics.logUserArr([
							$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
							'trackEvent',
							'Ads',
							'Slider',
							'Not Load'
						]);
				console.log('Tidak ada slider');
			}
		}, function(err) {
			// trackEvent
			Analytics.logEvent('Ads', 'Slider', 'Not Load');
			// trackUser Event
			Analytics.logUserArr([
						$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
						'trackEvent',
						'Ads',
						'Slider',
						'Not Load'
					]);
			makeToast('Error koneksi tidak stabil', 1500, 'bottom');
			console.log(err);
		});
	}

	// get location and weather
	$scope.greeting = function() {
		$scope.coords = {
			// latitude: -7.5633375,
			// longitude: 110.8107685
		};

		var options = {
			frequency: 1000, 
			timeout: 30000, 
			enableHighAccuracy: false
		}

		$cordovaGeolocation.getCurrentPosition(options).then(function(position) {
			$scope.coords = position.coords;
			console.log("coords :"+JSON.stringify($scope.coords));
		}, function(error) {
			console.log("could not get location :"+JSON.stringify($scope.coords));
		});
	}

	// getOrder List
	$scope.getOrder = function(uid) {
		console.log('get order');
		$scope.queue = [];
		$scope.process = [];
		var date = new Date();
		var currentDate = date.getTime() ;
		var lastDayTimestamp = currentDate - 604800000;
		Services.getHistory(uid).then(function(transactions) {
			if (transactions) {
				for (var id in transactions) {
					Services.getTransaksiDetails(transactions[id].kurir, transactions[id].indexTransaksi).then(function(transaksi) {
						if (transaksi) {
							if(transaksi.status == "queue") {
								if (transaksi.tgl >= lastDayTimestamp) {
									$scope.queue.push(transaksi);
								}
							} else if (transaksi.status == "process") {
								if (transaksi.tgl >= lastDayTimestamp) {
									$scope.process.push(transaksi);
								}
							}
						}
					});
				}
				$ionicLoading.hide();
			}
		}, function(err) {
			console.log('error get transactions :'+err);
			$ionicLoading.hide();
		})
	}

	// banner action
	$scope.gotoURL = function(index, url, tel) {
		if (url) {
			// trackEvent
			Analytics.logEventArr(['Ads', 'Slider', index, 'Click']);
			// trackUser Event
			Analytics.logUserArr([
						$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
						'trackEvent',
						'Ads',
						'Slider',
						index,
						'Click'
					]);
			window.open(url, '_system', 'location=yes');
		} else if(tel){
			// trackEvent
			Analytics.logEventArr(['Ads', 'Slider', index, 'Click']);
			// trackUser Event
			Analytics.logUserArr([
						$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
						'trackEvent',
						'Ads',
						'Slider',
						index,
						'Click'
					]);
			window.open('tel:'+tel, '_system', 'location=yes');
		} else {
			console.log('ads clicked');
		}
	}

	// go to newest Kuliner
	$scope.jelajah = function() {
		// trackEvent
		Analytics.logEvent('Jelajah', 'Tombol Jelajah');
		// trackUser Event
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackEvent',
					'Jelajah',
					'Tombol Jelajah'
				]);
		$state.go('restorans', {category: 'all', 'name': 'Terbaru'});
	}

	// to login page
	$scope.login = function() {
		// trackEvent
		Analytics.logEvent('Jelajah', 'Tombol Login');
		// trackUser Event
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackEvent',
					'Jelajah',
					'Tombol Login'
				]);
		$state.go("login");
	}

	// i'm typing....
	$scope.typeSearch = function() {
		// trackEvent
		Analytics.logEvent('Jelajah', 'Ketik Pencarian');
		// trackUser Event
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackEvent',
					'Jelajah',
					'Ketik Pencarian'
				]);
	}

	$scope.getCategories = function() {
		Services.getCategories().then(function(category) {
			$scope.category = category;
			$scope.connected = true;
			$ionicLoading.hide();
		})
	}

	// fetch recomendation on jelajah
	$scope.getRecomendation = function() {
		$ionicSlideBoxDelegate.update();
		$scope.slideRestorans = [];
		$scope.showRecomendation = false;
		Services.getRecomendations().then(function(restorans) {
			console.log("restorans: "+JSON.stringify(restorans))
			if (restorans) {
				var slideCount = 0;
				var i = 0;
				for (r in restorans) {
					console.log('r: '+ r);
					Services.getRestoranDetails(r).then(function(restoran) {
						console.log('slide: '+ slideCount +' | i: '+ i +' | '+ restoran.index);
						if (!$scope.slideRestorans[slideCount]) {
							var slideRestoran = {};
							$scope.slideRestorans[slideCount] = slideRestoran;
						}
						restoran.distance = Services.getDistance($scope.coords.latitude, $scope.coords.longitude, restoran.map.lat, restoran.map.long);						
						$scope.slideRestorans[slideCount][restoran.index] = restoran;

						i++;
						if (i==3) {
							i = 0;
							slideCount++;
							$ionicSlideBoxDelegate.update();
						}
					}, function(reason) {
						console.log('error fetch data');
					});
				}
				$ionicSlideBoxDelegate.update();
				$scope.showRecomendation = true;
			}
		});
	}

	$scope.showPickCityPopover = function($event){
		document.body.classList.add('platform-ios');
		$scope.popover.show($event);
	}

	$scope.pickCity = function(kota) {
		// $state.go("kota");
		$ionicLoading.show({
			template: '<ion-spinner icon="dots" class="spinner-positive"></ion-spinner>',
			duration: 3000
		  });
  
		  $localStorage.location = kota;
		  var indexUser = $localStorage.indexUser ? $localStorage.indexUser : $localStorage.token;
		  Services.getUserPickLocation(indexUser).then(function(result) {
			  console.log(result);
			  if (!result && typeof result !== "boolean") {
				  Services.setUserPickLocation(indexUser).then(function(result) {
					  console.log('berhasil');
					  $state.go('jelajah', { changeCity: true });
				  },function(reason) {
					  console.log('gagal');
					  $state.go('jelajah', { changeCity: true });
				  });
			  } else {
				  $state.go('jelajah', { changeCity: true });
			  }
		  }, function(reason) {
			  console.log(reason);
			  $state.go('jelajah', { changeCity: true });
		  });

		$scope.popover.hide();		
	}

	$scope.dataUserPage = function(dataUser) {
		$state.go("dataUser");
	}

	$scope.openRestoran = function(index) {
		// trackEvent
		Analytics.logEventArr(['Buka Restoran', 'Rekomendasi Jelajah']);
		Analytics.logEventArr(['Jelajah', index, 'Buka Restoran', 'Rekomendasi Jelajah']);
		// trackUser Event
		Analytics.logUserArr([
			$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
			"trackEvent",
			"Buka Restoran",
			"Rekomendasi Jelajah"
		]);
		Analytics.logUserArr([
			$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
			"trackEvent",
			"Jelajah",
			index,
			"Buka Restoran",
			'Rekomendasi Jelajah'
		]);
		$state.go('restoran', {index: index});
	}

	$scope.openAll = function() {
		$state.go('restorans', {category: 'all', name: 'Semua Kuliner'});
	}

	$scope.getRecomendation();
	$scope.getSliders();
	$scope.getCategories();

	// toast function
	function makeToast(_message) {
		window.plugins.toast.showWithOptions({
			message: _message,
			duration: 1500,
			position: 'bottom',
			addPixelsY: -40
		});
	}

	// Popover
	$ionicPopover.fromTemplateUrl('templates/kota-popover.html', {
		scope: $scope
	}).then(function(popover) {
		$scope.popover = popover;
	});

	// // carousel
	// $scope.next = function() {
	// 	$ionicSlideBoxDelegate.next();
	// };

	// $scope.previous = function() {
	// 	$ionicSlideBoxDelegate.previous();
	// };

	// // Called each time the slide changes
	// $scope.slideChanged = function(index) {
	// 	$scope.slideIndex = index;
	// };

	// // from quora well, lets try
	// function splitIntoRows(items, itemsPerRow) {
	//     var rslt = [];
	//     items.forEach(function(item, index) {
	//         var rowIndex = Math.floor(index / itemsPerRow),
	//             colIndex = index % itemsPerRow;
	//         if (!rslt[rowIndex]) {
	//             rslt[rowIndex] = [];
	//         }
	//         rslt[rowIndex][colIndex] = item;
	//     });
	//     return rslt;
	// }

	///////////////////////////////////////////////////////////////////
	//
	// USED FOR DYNAMIC CATEGORIES
	//
	///////////////////////////////////////////////////////////////////

	// Services.getCategories().then(function(categories) {
	// 	if(categories) {
	// 		// for(var category in categories) {
	// 		// 	// categories[category].namaUp = categories[category].nama.toUpperCase();
	// 		// 	console.log(categories[category]);
	// 		// }
	// 		$scope.categories = categories;
	// 	}

	// 	$ionicLoading.hide();
	// });
})

// documented
.controller('pencarianCtrl', function($scope, $stateParams, $ionicLoading, $state, Services, $cordovaToast, $cordovaSocialSharing, $timeout, Analytics, $localStorage) {
	$scope.category = 'Pencarian';
	$scope.user = {};
	$scope.user.query = $stateParams.query;
	$scope.notfound = false;

    $scope.$on('$ionicView.enter', function() {
    	// trackView
    	Analytics.logView('Pencarian');
    	// trackUser View
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackView',
					'Pencarian'
				]);
    	$scope.notfound = false;
    });
	
    $scope.searchQuery = function() {
    	// trackEvent
    	Analytics.logEvent('Pencarian', 'Query', $scope.user.query || 'empty');
		// trackUser Event
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackEvent',
					'Pencarian',
					'Query',
					$scope.user.query || 'empty'
				]);
		var loadFlag = false;
		$ionicLoading.show({
	      template: '<ion-spinner icon="dots" class="spinner-positive"></ion-spinner>'
	    });

	    $timeout(function() {
	    	$ionicLoading.hide();
	    	if(!loadFlag) {
	    		$scope.notfound = true;
	    		makeToast('Koneksi tidak stabil');
	    	}
	    }, 10000);

		Services.searchQuery($scope.user.query).then(function(inputQuery) {
			// console.log($scope.user.query);
			if(inputQuery) {
				var norm_query = $scope.user.query.toLowerCase();
				Services.getRestoranKeyword().then(function(result) {
					if(result) {
						loadFlag = true;
						$scope.notfound = false;
						$scope.restorans = [];

						var restoransNSorted = [];
						var isFound = false;

						var ta = 0; // total all restoran
						for(var id in result) {
							ta++;
						}

						var ia = 0,
							ir = 0,
							tr = 0; // total restoran matches found
						for(var id in result) {
							// console.log(id)
							if(result[id].keyword.indexOf(norm_query) >= 0) {
								isFound = true;
								tr++;
								Services.getRestoranDetails(id).then(function(result) {
									$scope.restorans.push(result);
									$ionicLoading.hide();
								});
							}

							ia++;
						}
						// console.log('isFound: '+ isFound);
						if(!isFound) {
							delete $scope.restorans;
							$ionicLoading.hide();
							$scope.notfound = true;
							// trackEvent
							Analytics.logEvent('Pencarian', 'Tidak Ditemukan');
							// trackUser Event
							Analytics.logUserArr([
										$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
										'trackEvent',
										'Pencarian',
										'Tidak Ditemukan'
									]);
							makeToast('Tidak ditemukan kuliner', 1500, 'bottom');
						}
					} else {
						makeToast('Tidak ditemukan kuliner', 1500, 'bottom');
						console.log("No result");
						// trackEvent
						Analytics.logEvent('Pencarian', 'Tidak Ditemukan');
						// trackUser Event
						Analytics.logUserArr([
									$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
									'trackEvent',
									'Pencarian',
									'Tidak Ditemukan'
								]);
						$scope.notfound = true;
					}
				}, function(reason) {
					$scope.notfound = true;
					// trackEvent
					Analytics.logEvent('Pencarian', 'Tidak Ditemukan');
					// trackUser Event
					Analytics.logUserArr([
								$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
								'trackEvent',
								'Pencarian',
								'Tidak Ditemukan'
							]);
					makeToast('Tidak ditemukan kuliner', 1500, 'bottom');
				});
			}
		});
	}

	$scope.rekomendasikan = function() {
		// trackEvent
		Analytics.logEvent('Pencarian', 'Tombol Rekomendasi Restoran');
		// trackUser Event
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackEvent',
					'Pencarian',
					'Tombol Rekomendasi Restoran'
				]);
		$state.go('rekomendasi');
		return false;
	}

	$scope.daftar = function(){
		// trackEvent
		Analytics.logEvent('Pencarian', 'Tombol Daftar Restoran');
		// trackUser Event
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackEvent',
					'Pencarian',
					'Tombol Daftar Restoran'
				]);
		$state.go('daftar');
		return false;
	}

	function sortRestorans(rs) {
		$scope.restorans = [];

		var i = 0;
		var nrs = [];

		for(var id in rs) {
			nrs[i++] = rs[id];
			// console.log(nrs[i-1].namaResto);
		}

		nrs.sort(function(x,y) {
			return x.tglInput < y.tglInput;
		});

		for(var i = 0; i < nrs.length; i++) {
			$scope.restorans.push(nrs[i]);
		}
	}

	$scope.checkSavedRestoran = function(index) {
		return Services.checkSavedRestoran(index);
	}

	$scope.saveRestoran = function(index) {
		if(Services.checkSavedRestoran(index)) {
			Services.deleteRestoran(index).then(function() {
				// analytics.trackEvent('Simpan Kuliner', 'Hapus Simpan', index, 5);
				// trackEvent
				Analytics.logEvent('Simpan Kuliner', 'Hapus Simpan');
				Analytics.logEvent('Pencarian', 'Unsave');
				Analytics.logMerchant(index, 'Unsave');
				// trackuser Event
				Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					"trackEvent",
					"Simpan Kuliner",
					"Hapus Simpan"
				]);
				Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					"trackEvent",
					"Pencarian",
					"Unsave"
				]);
				// trackUser Merchant
				Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					"trackMerchant",
					index,
					"Unsave"
				]);

				makeToast('Dihapus dari Wishlist', 1500, 'bottom');
			});
		} else {
			Services.saveRestoran(index).then(function(result) {
				if(result) {
					// trackEvent
					Analytics.logEvent('Simpan Kuliner', 'Simpan');
					Analytics.logEvent('Pencarian', 'Save');
					// trackMerchant
					Analytics.logMerchant(index, 'Save');
					// trackUser Event
					Analytics.logUserArr([
						$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
						"trackEvent",
						"Pencarian",
						"Save"
					]);
					Analytics.logUserArr([
						$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
						"trackEvent",
						"Simpan Kuliner",
						"Simpan"
					]);
					// trackUser Merchant
					Analytics.logUserArr([
						$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
						"trackMerchant",
						index,
						"Save"
					]);
					makeToast('Wishlist berhasil ditambahkan', 1500, 'bottom');
				} else {
					makeToast('Terjadi kesalahan', 1500, 'bottom');
					console.log('this should not be done.');
				}
			}, function(reason) {
				// trackEvent
				Analytics.logEvent('Simpan Kuliner', 'Simpan Penuh');
				// trackUser Event
				Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					"trackEvent",
					"Simpan Kuliner",
					"Simpan Penuh"
				]);
				makeToast('Penyimpanan restoran penuh (max. 5)', 1500, 'bottom');
			});
		}
	}

	$scope.shareRestoran = function(index) {
		var resto = null;
		for(var id in $scope.restorans) {
			console.log($scope.restorans[id].index +" | "+ index)
			if($scope.restorans[id].index == index) {
				resto = $scope.restorans[id];
				break;
			}
		}

		var link = "Buka di aplikasi MANGAN untuk info selengkapnya, https://mobilepangan.com/kuliner/"+index;
		var gambar = null;
		var textshared = resto.namaResto+" - "+resto.keteranganResto+" Buka di aplikasi MANGAN untuk info selengkapnya.";

		if(resto.gambar[3]) {
			gambar = resto.gambar[3];
		}

		$cordovaSocialSharing.share(textshared, resto.namaResto, gambar, link)
		.then(function(result) {
			makeToast('Berhasil membagikan', 1500, 'bottom');
			// trackMerchant
			Analytics.logMerchant(index, 'Share');
			// trackEvent
			Analytics.logEvent('Share', 'Kuliner', 'Success');
			Analytics.logEvent('Pencarian', 'Share');
			// trackUser Event
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Pencarian",
				"Share"
			]);
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Share",
				"Kuliner",
				"Success"
			]);
			// trackUser Merchant
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackMerchant",
				index,
				"Share"
			]);
		}, function(err) {
			// trackEvent
			Analytics.logEvent('Share', 'Kuliner', 'Error');
			// trackUser Event
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Share",
				"Kuliner",
				"Error"
			]);
			makeToast('Gagal membagikan', 1500, 'bottom');
			console.log('error');
		});
	}

    $scope.searchQuery();

	$scope.openRestoran = function(index, image) {
		if (image) {
			// trackEvent
			Analytics.logEventArr(['Buka Restoran', 'Click Gambar']);
			Analytics.logEventArr(['Pencarian', 'Buka Restoran', 'Click Gambar']);
			// trackUser Event
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Buka Restoran",
				"Click Gambar"
			]);
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Pencarian",
				"Buka Restoran",
				'Click Gambar'
			]);
		} else {
			// trackEvent
			Analytics.logEventArr(['Buka Restoran', 'Click Icon More']);
			Analytics.logEventArr(['Pencarian', 'Buka Restoran', 'Click Icon More']);
			// trackUser Event
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Buka Restoran",
				"Click Icon More"
			]);
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Pencarian",
				"Buka Restoran",
				'Click Icon More'
			]);
		}
		$state.go('restoran', {index: index});
	}

    function makeToast(_message) {
		window.plugins.toast.showWithOptions({
			message: _message,
			duration: 1500,
			position: 'bottom',
			addPixelsY: -40
		});
	}
})
   
// documented
.controller('tersimpanCtrl', function($scope, Services, $cordovaToast, $state, $cordovaSocialSharing, $ionicLoading, $timeout, $localStorage, $http, $ionicHistory, Analytics, $localStorage, $ionicPopover) {
	var loadFlag = false;
	var savedRestorans = [];
	$scope.category = 'Wishlist';
	$scope.nodata = false;
	$scope.notersimpan = false;
	$scope.restorans = [];

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			user.providerData.forEach(function(profile) {
				if (profile.providerId === "facebook.com") {
					$scope.getProfileByUid(profile.uid);
					Analytics.trackEvent('Auth', 'Sign In', 'Facebook');
				} else if (profile.providerId === "google.com") {
					$scope.getProfileByUid(profile.uid);
					Analytics.trackEvent('Auth', 'Sign In', 'Google');
				} else {
					console.log('logged in with another provider');
				}
			});
		} else {
			$scope.dataUser = "";
		}
	})

	$scope.$on('$ionicView.enter', function() {
		loadFlag = false;
		$scope.nodata = false;
		$scope.notersimpan = false;
		$ionicLoading.show({
	      template: '<ion-spinner icon="dots" class="spinner-positive" style="color:white;"></ion-spinner>'
	    });

	    $timeout(function() {
	    	$ionicLoading.hide();
	    	if(!loadFlag && !$scope.notersimpan) {
				if ($scope.restorans.length == 0) {
					loadFlag = true;
					$scope.notersimpan = true;
					console.log('kok jalan');
				}
	    		console.log('loadFlag :'+loadFlag, '$scope.notersimpan : '+$scope.notersimpan);
	    		$scope.nodata = true;
	    		makeToast('Koneksi tidak stabil');
	    		console.log('timeout');
	    	}
	    }, 10000);

	 	// trackViwe
	 	Analytics.logView('Tersimpan');
    	// trackUser View
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackView',
					'Tersimpan'
				]);

		var temp = Services.getSavedRestorans();
		savedRestorans = temp.slice(0);
		savedRestorans.reverse();
		updateSavedRestorans(savedRestorans);

		var user = firebase.auth().currentUser;
		if (user) {
			user.providerData.forEach(function(profile) {
				if (profile.providerId === "facebook.com") {
					$scope.getProfileByUid(profile.uid);
				} else if (profile.providerId === "google.com") {
					$scope.getProfileByUid(profile.uid);
				} else {
					console.log('logged in with another provider');
				}
			});
		} else {
			console.log('not logged in');
			$scope.dataUser = "";
		}
	});

	$scope.getRestorans = function() {
		$scope.nodata = false;
		$scope.notersimpan = false;

		var temp = Services.getSavedRestorans();
		savedRestorans = temp.slice(0);
		savedRestorans.reverse();

		$ionicLoading.show({
	      template: '<ion-spinner icon="dots" class="spinner-positive"></ion-spinner>'
	    });

	    $timeout(function() {
	    	$ionicLoading.hide();
	    	if(!loadFlag && !$scope.notersimpan) {
	    		console.log('loadFlag :'+loadFlag, '$scope.notersimpan : '+$scope.notersimpan);
	    		$scope.nodata = true;
				if ($scope.restorans.length == 0) {
					loadFlag = true;
					$scope.notersimpan = true;
					console.log('kok jalan');
				}
	    		makeToast('Koneksi tidak stabil');
	    		console.log('timeout');
	    	}
	    }, 10000);

		updateSavedRestorans(savedRestorans);
		$scope.$broadcast('scroll.refreshComplete');
	}

	$scope.saveRestoran = function(index) {
		Services.deleteRestoran(index).then(function() {
			// trackEvent
			Analytics.logEvent('Simpan Kuliner', 'Hapus Simpan');
			Analytics.logEvent('Tersimpan', 'Unsave');
			Analytics.logMerchant(index, 'Unsave');
			// trackuser Event
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Simpan Kuliner",
				"Hapus Simpan"
			]);
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Tersimpan",
				"Unsave"
			]);
			// trackUser Merchant
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackMerchant",
				index,
				"Unsave"
			]);

			window.plugins.toast.showWithOptions({
				message: 'Restoran berhasil dihapus',
				duration: 1500,
				position: 'bottom',
				addPixelsY: -40
			});
			$state.go($state.current, {}, {reload: true});
		});
	}

	$scope.shareRestoran = function(index) {
		var resto = null;
		for(var id in $scope.restorans) {
			console.log($scope.restorans[id].index +" | "+ index)
			if($scope.restorans[id].index == index) {
				resto = $scope.restorans[id];
				break;
			}
		}

		var link = "Buka di aplikasi MANGAN untuk info selengkapnya, https://mobilepangan.com/kuliner/"+index;
		var gambar = null;
		var textshared = resto.namaResto+" - "+resto.keteranganResto;

		if(resto.gambar[3]) {
			gambar = resto.gambar[3];
		}

		$cordovaSocialSharing.share(textshared, resto.namaResto, gambar, link)
		.then(function(result) {
			makeToast('Berhasil membagikan', 1500, 'bottom');
			// trackEvent
			Analytics.logEvent('Tersimpan', 'Share')
			Analytics.logEvent('Share', 'Kuliner', 'Success');
			// trackMerchant
			Analytics.logMerchant(index, 'Share');
			// trackUser Event
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Tersimpan",
				"Share"
			]);
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Share",
				"Kuliner",
				"Success"
			]);
			// trackUser Merchant
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackMerchant",
				index,
				"Share"
			]);
		}, function(err) {
			// trackEvent
			Analytics.logEvent('Share', 'Kuliner', 'Error');
			// trackUser Event
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Share",
				"Kuliner",
				"Error"
			]);
			makeToast('Gagal membagikan', 1500, 'bottom');
		});
	}

	$scope.checkSavedRestoran = function(index) {
		return Services.checkSavedRestoran(index);
	}

	function updateSavedRestorans(news) {
		var finishedLoadFlag = false;
		console.log('update');
		savedRestorans = news;
		$scope.restorans = [];
		if(news && news.length > 0) {
			$scope.notersimpan = false;
			var savedGallery = [];
			for(var i=0; i<news.length; i++) {
				Services.getRestoranDetails(news[i]).then(function(restoran) {
					if(restoran) {
						loadFlag = true;
						$scope.nodata = false;
						$scope.restorans.push(restoran);
						var data = {
							"src": restoran.gambar[0],
							"index": restoran.index
						}
						savedGallery.push(data);
						finishedLoadFlag = true;
						console.log('success');
					} else {
						console.log('failure');
					}
					$ionicLoading.hide();
				}, function(err) {
					console.log('ra ktm kcng');
				});
			}
			$scope.savedGallery = savedGallery;
		} else {
			$scope.notersimpan = true;
			$ionicLoading.hide();
		}
	}

	$scope.savedGallery = [];

	// get Profile User by UID
	$scope.getProfileByUid = function(uid) {
		Services.getProfileByUid(uid).then(function(dataUser) {
			if (dataUser) {
				$scope.dataUser = dataUser
			} else {
				console.log("tersimpan no dataUser found with uid: "+uid);
			}
		})
	}

	$scope.openProfile = function(photo) {
		if (photo) {
			// trackEvent
			Analytics.logEvent('Tersimpan', 'Klik Profile');
			// trackUser Event
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Tersimpan",
				"Klik Profile"
			]);
		} else {
			// trackEvent
			Analytics.logEvent('Tersimpan', 'Tombol Profile');
			// trackUser Event
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Tersimpan",
				"Tombol Profile"
			]);
		}
		$state.go('profil');
	}

	$scope.openTransaksi = function() {
		// trackEvent
		Analytics.logEvent('Tersimpan', 'Tombol Transaksi');
		// trackUser Event
		Analytics.logUserArr([
			$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
			"trackEvent",
			"Tersimpan",
			"Tombol Transaksi"
		]);
		$state.go('tabsController.transaksi');
	}

	$scope.login = function() {
		// trackEvent
		Analytics.logEvent('Tersimpan', 'Tombol Login');
		// trackUser Event
		Analytics.logUserArr([
			$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
			"trackEvent",
			"Tersimpan",
			"Tombol Login"
		]);
		$state.go('login');
	}

	$scope.jelajah = function() {
		// trackEvent
		Analytics.logEvent('Tersimpan', 'Tombol Jelajah');
		// trackUser Event
		Analytics.logUserArr([
			$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
			"trackEvent",
			"Tersimpan",
			"Tombol Jelajah"
		]);
		$state.go('restorans', {category: 'all', 'name': 'Terbaru'});
	}

	$scope.openRestoran = function(index, image) {
		console.log(index, image);
		if (image) {
			// trackEvent
			Analytics.logEvent('Buka Restoran', 'Click Gambar');
			Analytics.logEvent('Tersimpan', 'Buka Restoran', 'Click Gambar');
			// trackUser Event
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Buka Restoran",
				"Click Gambar"
			]);
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Tersimpan",
				"Buka Restoran",
				'Click Gambar'
			]);
		} else {
			// trackEvent
			Analytics.logEvent('Buka Restoran', 'Click Icon More');
			Analytics.logEvent('Tersimpan', 'Buka Restoran', 'Click Icon More');
			// trackUser Event
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Buka Restoran",
				"Click Icon More"
			]);
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Tersimpan",
				"Buka Restoran",
				'Click Icon More'
			]);
		}
		$state.go('restoran', {index: index});
	}

	$scope.clicked = function() {
		console.log('gallery img clicked');
	}

	$scope.openRestoranGallery = function(index, image) {
		console.log(index, image);
		if (image) {
			// trackEvent
			Analytics.logEvent('Buka Restoran', 'Click Gambar');
			Analytics.logEvent('Tersimpan', 'Buka Restoran', 'Click Gambar');
			// trackUser Event
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Buka Restoran",
				"Click Gambar"
			]);
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Tersimpan",
				"Buka Restoran",
				'Click Gambar'
			]);
		} else {
			// trackEvent
			Analytics.logEvent('Buka Restoran', 'Click Icon More');
			Analytics.logEvent('Tersimpan', 'Buka Restoran', 'Click Icon More');
			// trackUser Event
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Buka Restoran",
				"Click Icon More"
			]);
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Tersimpan",
				"Buka Restoran",
				'Click Icon More'
			]);
		}
		$state.go('restoran', {index: index});
	}

	function makeToast(_message) {
		window.plugins.toast.showWithOptions({
			message: _message,
			duration: 1500,
			position: 'bottom',
			addPixelsY: -40
		});
	}
})

// documented
.controller('petaCtrl', function($scope, $state, $stateParams, Services, $cordovaToast, $cordovaGeolocation, $ionicPopup, Analytics, $localStorage) {
	$scope.category = 'Peta';
	var options = {timeout: 10000, enableHighAccuracy: true};

	$scope.$on('$ionicView.enter', function() {
		// trackView
		Analytics.logView('Peta');
		// trackMerchant
		Analytics.logMerchant($stateParams.index, 'Lihat Peta');
    	// trackUser View
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackView',
					'Peta'
				]);
    	// trackUser Event
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackMerchant',
					$stateParams.index,
					'Lihat Peta'
				]);
	});

	Services.getRestoranDetails($stateParams.index).then(function(restoran) {
		if(restoran) {
			$scope.restoran = restoran;
			var restoLat = restoran.map.lat;
			var restoLng = restoran.map.long;

			var latLng = new google.maps.LatLng(restoLat, restoLng); 
			console.log(restoran.map.lat);
			console.log(restoran.map.long); 

			var mapOptions = {
				center: latLng,
				zoom: 15,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};

			$scope.map = new google.maps.Map(document.getElementById("mangan-peta"), mapOptions);
			google.maps.event.addListenerOnce($scope.map, 'idle', function(){
				var marker = new google.maps.Marker({
					map: $scope.map,
					animation: google.maps.Animation.DROP,
					position: latLng,
					icon: 'img/marker.png'
				});

				var contentString = '<div style="width: 200px; font-size: 14px;"><center><p><b>'+restoran.namaResto+'</b></p><p>'+restoran.keteranganBuka+'</p><a href="tel:'+restoran.noTelp+'" style="color:blue; text-decoration:none;">Hubungi</a></center></div>';

				var infoWindow = new google.maps.InfoWindow({
					content: contentString,
					maxWidth: 500
				});

				google.maps.event.addListener(marker, 'click', function () {
					infoWindow.open($scope.map, marker);
				});

				infoWindow.open($scope.map, marker);
			});

			$scope.openUrl = function() {
				// trackEvent
				Analytics.logEvent('Peta','Tombol Navigasikan');
				Analytics.logEvent('Kuliner','Navigasikan');
				// trackMerchant
				Analytics.logMerchant($stateParams.index, 'Navigate');
				// trackUser Event
				Analytics.logUserArr([
							$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
							'trackEvent',
							'Peta',
							'Tombol Navigasikan'
						]);
				Analytics.logUserArr([
							$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
							'trackEvent',
							'Kuliner',
							'Navigasikan'
						]);
				// trackUser Merchant
				Analytics.logUserArr([
							$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
							'trackMerchant',
							$stateParams.index,
							'Navigate'
						]);
				$cordovaGeolocation.getCurrentPosition(options).then(function(position){
					var lat = position.coords.latitude;
					var lng = position.coords.longitude;
					window.open('http://maps.google.com/maps?saddr=+'+lat+'+,+'+lng+'+&daddr=+'+restoLat+'+,+'+restoLng+'+&dirflg=d', '_system', 'location=yes');
					return false;
				}, function(error){
					console.log("Could not get location");
					window.open('http://maps.google.com/maps?saddr=Current+Location&daddr=+'+restoLat+'+,+'+restoLng+'+&dirflg=d', '_system', 'location=yes');
				});
			}
		} else {
			makeToast('Koneksi tidak stabil', 1500, 'bottom');
			console.log('failure');
		}
	}, function(reason) {	
		$scope.restoran = null;
		makeToast('Koneksi tidak stabil', 1500, 'bottom');
		console.log('error');
	});

	function makeToast(_message) {
		window.plugins.toast.showWithOptions({
			message: _message,
			duration: 1500,
			position: 'bottom',
			addPixelsY: -40
		});
	}
})

// documented
.controller('terdekatCtrl', function($scope, $state, $stateParams, Services, $cordovaGeolocation, $ionicPopup, $ionicLoading, Analytics, $http, $localStorage) {
	//////////////////////////////////////////////////////////////////
	//
	// load map, use current location, if not available, use default
	//
	//////////////////////////////////////////////////////////////////
	$scope.category = 'Terdekat';
	if ($localStorage.location == "Yogyakarta") {
		// default location yogyakarta, 0 KM
		var coords = {latitude: -7.8011929, longitude: 110.3640875};
	} else {
		//  default location, Surakarta
		var coords = {latitude: -7.569527, longitude: 110.830289};
	}
	var options = {timeout: 10000, enableHighAccuracy: true};
	var openedInfo = null;

	$ionicLoading.show({
		template: '<ion-spinner icon="dots" class="spinner-positive"></ion-spinner>',
		timeout: 10000
	});

	$scope.$on('$ionicView.enter', function() {
		$ionicLoading.show({
			template: '<ion-spinner icon="dots" class="spinner-positive"></ion-spinner>',
			timeout: 1000
		});

		$scope.restoranList = {};
		$scope.nodata = null;
		coords = {}

		if ($localStorage.location == "Yogyakarta") {
			coords = {latitude: -7.8011929, longitude: 110.3640875};
		} else {
			coords = {latitude: -7.569527, longitude: 110.830289};
		}
		// trackView
		Analytics.logView('Terdekat');
		// trackUser View
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackView',
					'Terdekat'
				]);
		$scope.getTerdekat();
	});
	
	$scope.getTerdekat = function() {
		$cordovaGeolocation.getCurrentPosition(options).then(function(position) {
			if(position) {
				// trackEvent
				Analytics.logEvent('Terdekat', 'GPS', 'Found');
				// trackUser Event
				Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					"trackEvent",
					"Terdekat",
					"GPS",
					'Found'
				]);
				console.log('position aru');
				coords = position.coords;
			}
			showMap();
		}, function(error) {
			console.log("could not get location");
			// trackEvent
			Analytics.logEvent('Terdekat', 'GPS', 'Not Found');
			// trackUser Event
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Terdekat",
				"GPS",
				'Not Found'
			]);
			$ionicLoading.hide();

			$ionicPopup.alert({
				title: 'Error',
				template: 'Tidak dapat menemukan sinyal GPS!',
				okText: 'OK',
				okType: 'button-oren'
			});
			showMap();
		});
	}

	function showMap() {
		var latlon = new google.maps.LatLng(coords.latitude, coords.longitude);
		$http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+coords.latitude+","+coords.longitude+"&key=AIzaSyCQz7kgKgqjOo6ptPdvEGJLxOCBKUPZEoY").success(function(result) {
			$scope.currentLocation = result.results[0].address_components[2].short_name+', '+result.results[0].address_components[3].short_name;
			console.log($scope.currentLocation);
		}).error(function(error) {
			console.log('data error : '+error);
		});

		var mapOptions = {
			center: latlon,
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		$scope.map = new google.maps.Map(document.getElementById('mangan-peta'), mapOptions);
		$scope.markers = [];

		// wait till map loaded
		google.maps.event.addListener($scope.map, 'idle', function() {
			// trackEvent
			Analytics.logEvent('Terdekat', 'Load Maps');
			// trackUser Event
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Terdekat",
				"Load Maps"
			]);
			var userMarker = new google.maps.Marker({
				map: $scope.map,
				icon: '',
				position: latlon
			});
			google.maps.event.trigger($scope.map, 'resize');
			addMarkers();
		});
	}

	function addMarkers() {
		var bounds = $scope.map.getBounds();
		var ne = bounds.getNorthEast();
		var sw = bounds.getSouthWest();
		Services.getRestoransByLocation(sw.lng(), ne.lng()).then(function(restorans) {
			if(restorans) {
				for(var r in restorans) {
					var location = restorans[r].map;
					if(location.lat < sw.lat() || location.lat > ne.lat()) {
						delete restorans[r];
					}
				}

				$scope.restorans = restorans;

				var i = 0, j = 0;
				for(var r in restorans) {
					i++;
					if(restorans[r].map) {
						var lat = restorans[r].map.lat;
						var lon = restorans[r].map.long;

						if(lat && lon) {
							var rLatlon = new google.maps.LatLng(lat, lon);

							var marker = new google.maps.Marker({
								map: $scope.map,
								position: rLatlon,
								icon: 'img/marker.png'
							});

							var contentString = restorans[r].namaResto;
							addInfoWindow(marker, contentString, restorans[r].index);

							$scope.markers.push(marker);

							j++;
						} else {
							console.log('...');
						}
					}
				}

				for (var key in restorans) {
					if (restorans.hasOwnProperty(key)) {
						$scope.restoranList[key] = restorans[key];
						var oLat = coords.latitude;
						var oLong = coords.longitude;
						var dLat = restorans[key].map.lat;
						var dLong = restorans[key].map.long;
						getDistanceMatrix(oLat, oLong, dLat, dLong, key);
					}
				}

				if (i == 0) {
					$scope.nodata = false;
				} else {
					$scope.nodata = true;
				}
			} else {
				$scope.nodata = false;
			}
			$ionicLoading.hide();
		}, function(reason) {
			$scope.nodata = false;
			$ionicLoading.hide();
		});
	}

	function getDistanceMatrix(oLat, oLong, dLat, dLong, keyResto) {
		var url = 'https://maps.googleapis.com/maps/api/distancematrix/';
		var type = 'json';
		var key = 'AIzaSyCQz7kgKgqjOo6ptPdvEGJLxOCBKUPZEoY';
		$http.get(url+type+'?origins='+oLat+','+oLong+'&destinations='+dLat+','+dLong+'&key='+key).success(function(result) {
			$scope.restoranList[keyResto].jarak = result.rows[0].elements[0].distance.value;
		}).error(function(error) {
			$scope.restoranList[keyResto].jarak = getDistance(oLat, oLong, dLat,dLong);
		});
	}

	function rad(x) {
		return x * Math.PI / 180;
	};

	function getDistance(lat1, lon1, lat2, lon2) {
		var R = 6378137; // Earth’s mean radius in meter
		var dLat = rad(lat2 - lat1);
		var dLong = rad(lon2 - lon1);
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(rad(lat1)) * Math.cos(rad(lat2)) *
		Math.sin(dLong / 2) * Math.sin(dLong / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c;
		return d; // returns the distance in meter
	};

	function addInfoWindow(marker, message, index) {
		var infoWindow = new google.maps.InfoWindow({
			content: '<div style="width: auto; font-size: 14px;""><center><a href="#/restoran/'+ index +'" style="text-decoration: none; color:black; font-weight: 300;"><b>'+ message +'</b><p>Lihat</p></a></center></div>',
			maxWidth: 150
		});

		google.maps.event.addListener(marker, 'click', function () {
			// trackEvent
			Analytics.logEvent('Terdekat', 'Marker', 'Click');
			// trackUser Event
			Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				"trackEvent",
				"Terdekat",
				"Marker",
				'Click'
			]);
			if(openedInfo) {
				openedInfo.close();
			}
			openedInfo = infoWindow;
			
			infoWindow.open($scope.map, marker);
		});

		addInfoListener(infoWindow, message);
	}

	function addInfoListener(infoWindow, message) {
		google.maps.event.addDomListener(infoWindow, 'click', function() {
			console.log(message);
		});
	}

	$scope.openRestoran = function(index) {
		// trackEvent
		Analytics.logEventArr(['Buka Restoran', 'Terdekat']);
		Analytics.logEventArr(['Terdekat', 'Buka Restoran']);
		// trackUser Event
		Analytics.logUserArr([
			$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
			"trackEvent",
			"Buka Restoran",
			"Terdekat"
		]);
		Analytics.logUserArr([
			$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
			"trackEvent",
			"Terdekat",
			"Buka Restoran"
		]);
		$state.go('restoran', {index: index});
	}

	$scope.rekomendasikan = function(){
		// trackEvent
		Analytics.logEvent('Terdekat', 'Tombol Rekomendasikan');

		// trackUser Event
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackEvent',
					'Terdekat',
					'Tombol Rekomendasikan'
				]);
		$state.go('rekomendasi');
	}

	$scope.getFoundCount = function(restoranList) {
		if (restoranList) {
			var size = Object.keys(restoranList).length;
			return size;
		}
		return null;
	}
})
 
.controller('ulasanMenuCtrl', function($scope, $state, $stateParams, Services, Analytics, $localStorage) {
	$scope.getMenu = function() {
		$scope.selectedMenu = $stateParams.selectedMenu;
		console.log('ulasanMenu');
		$scope.$broadcast('scroll.refreshComplete');
	}
	
	$scope.getMenu();
})

// documented
.controller('promoCtrl', function($scope, $state, $ionicLoading, $cordovaToast, Services, $timeout, $localStorage, Analytics, $ionicModal, $cordovaSocialSharing) {
	var loadFlag = false;
	var loadingIndicator = $ionicLoading.show({
      template: '<ion-spinner icon="dots" class="spinner-positive"></ion-spinner>'
    });

	$ionicModal.fromTemplateUrl('templates/promoModal.html', {
		scope: $scope,
		animation: 'slide-in-up' 
	}).then(function(modal) { $scope.modal = modal; });

    $timeout(function() {
    	$ionicLoading.hide();
    	if(!loadFlag) {
    		makeToast('Koneksi tidak stabil');
    	}
    }, 10000);

	$scope.$on('$ionicView.enter', function() {
		// trackView
		Analytics.logView('Promo');
		// trackUser View
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackView',
					'Promo'
				]);

		$scope.getPromos();
	});

	$scope.openPromo = function(index) {
		// trackEvent
		Analytics.logEvent('Promo', index, 'Click');
		// trackUser Event
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackEvent',
					'Promo',
					index,
					'Click'
				]);
		$state.go('restoran', {'index': index});
	}

	$scope.getPromos = function() {
	    Services.getPromos().then(function(promos) {
	    	loadFlag = true;
	    	if (promos) {
	    		$scope.promosObj = promos;
		    	$scope.promos = [];
	    		for(var p in promos){
	    			if (promos[p]["index"]) {
		    			$scope.promos.push(promos[p]);	    				
	    			};
	    		}
		    	// $scope.promos = promos;
		    	$ionicLoading.hide();
	    	} else {
	    		makeToast('Nantikan Promo Menarik', 1500, 'bottom');
	    		console.log('Error fetch data');
	    		$ionicLoading.hide();
	    	}
	    }, function(err) {
			makeToast('Koneksi tidak stabil', 1500, 'bottom');
	    	console.log(err);
	    }).finally(function() {
			$scope.$broadcast('scroll.refreshComplete');
	    });
	}

	$scope.openModal = function(index) {
		// trackView
		Analytics.logView('Detail Promo');
		// trackEvent
		Analytics.logEvent('Promo', index, 'Click');
		// trackUser View
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackView',
					'Detail Promo'
				]);
		// trackUser Event
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackEvent',
					'Promo',
					index,
					'Click'
				]);
		$scope.selectedPromo = $scope.promosObj[index];
		$scope.modal.show();
	}

	$scope.sharePromo = function(selectedPromo) {
		console.log('Promo, Share, '+selectedPromo.index);
		var link = selectedPromo.extUrl;
		var gambar = selectedPromo.sharedImg;
		var textshared = selectedPromo.namaPromo+' - '+selectedPromo.keterangan+" - Valid hingga : "+selectedPromo.valid+" Nantikan promo menarik lainnya di Aplikasi MANGAN";

		$cordovaSocialSharing.share(textshared, selectedPromo.keterangan, gambar, link)
		.then(function(result) {
			// trackEvent
			Analytics.logEvent('Promo', selectedPromo.index, 'Share');
			Analytics.logEvent('Share', 'Promo', 'Success');

			// trackUser Event
			Analytics.logUserArr([
						$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
						'trackEvent',
						'Promo',
						selectedPromo.index,
						'Share'
					]);
			Analytics.logUserArr([
						$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
						'trackEvent',
						'Share',
						'Promo',
						'Success'
					]);
			makeToast('Berhasil membagikan', 1500, 'bottom');
		}, function(err) {
			// trackEvent
			Analytics.logEvent('Share', 'Promo', 'Error');
			// trackUser Event
			Analytics.logUserArr([
						$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
						'trackEvent',
						'Share',
						'Promo',
						'Error'
					]);
			makeToast('Gagal membagikan', 1500, 'bottom');
		});
	}

	$scope.gotoUrl = function(selectedPromo) {
		if (selectedPromo.extUrl) {
			// trackEvent
			Analytics.logEvent('Promo', selectedPromo.index, 'OpenUrl');
			// trackUser Event
			Analytics.logUserArr([
						$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
						'trackEvent',
						'Promo',
						selectedPromo.index,
						'OpenUrl'
					]);
			window.open(selectedPromo.extUrl, '_system', 'location=yes');		
		}
	}

	$scope.restoran = function(selectedPromo) {
		// trackEvent
		Analytics.logEvent('Promo', selectedPromo.index, 'OpenRestoran');
		// trackUser Event
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackEvent',
					'Promo',
					selectedPromo.index,
					'OpenRestoran'
				]);
		$state.go('restoran', {'index': selectedPromo.indexResto});
		$scope.modal.hide();
	}

	$scope.getPromos();

	function makeToast(_message) {
		window.plugins.toast.showWithOptions({
			message: _message,
			duration: 1500,
			position: 'bottom',
			addPixelsY: -40
		});
	}
})

.controller('loginCtrl', function($scope, $state, $ionicLoading, Services, $ionicHistory, $cordovaOauth, $localStorage, $http, Analytics, $ionicPopup, $cordovaToast) {
	// trackView
	Analytics.logView('Auth');
	// trackUser View
	Analytics.logUserArr([
				$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
				'trackView',
				'Auth'
			]);

	$scope.fblogin = function() {
		// trackEvent
		Analytics.logEvent('Auth', 'Tombol', 'Facebook');
		// trackUser Event
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackEvent',
					'Auth',
					'Tombol',
					'Facebook'
				]);
		$cordovaOauth.facebook(1764800933732733, ["email", "user_birthday", "user_location"]).then(function(result) {
			console.log(result.access_token);
			$localStorage.fbaccesstoken = result.access_token;
			var credential = firebase.auth.FacebookAuthProvider.credential($localStorage.fbaccesstoken);
			firebase.auth().signInWithCredential(credential).catch(function(error) {
				if (error.code === "auth/account-exists-with-different-credential") {
					alert('Email telah digunakan dengan metode lain');
				}
			});
			$ionicLoading.show({
		      template: '<ion-spinner icon="dots" class="spinner-positive"></ion-spinner>'
		    });
		}, function(err) {
			console.log('Error oAuth facebook: '+err);
		})
	}

	$scope.googlelogin = function() {
		// trackEvent
		Analytics.logEvent('Auth', 'Tombol', 'Google');
		// trackUser Event
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackEvent',
					'Auth',
					'Tombol',
					'Google'
				]);
		$cordovaOauth.google("1054999345220-m4vlisv7o0na684cgcg13s1tj2t4v447.apps.googleusercontent.com", ["email", "profile"]).then(function(result) {
			$localStorage.googleidtoken = result.id_token;
			$localStorage.googleaccesstoken = result.access_token;
			var credential = firebase.auth.GoogleAuthProvider.credential($localStorage.googleidtoken);
			firebase.auth().signInWithCredential(credential).catch(function(error) {
				console.log("Error : "+JSON.stringify(error));
			});
			$ionicLoading.show({
		      template: '<ion-spinner icon="dots" class="spinner-positive"></ion-spinner>'
		    });
		}, function(err) {
			console.log('Error oAuth google: '+err);
		})
	}

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			console.log("uid: "+user.uid);
			$scope.user = user;
			user.providerData.forEach(function(profile) {
				if (profile.providerId === "facebook.com") {
					Services.getProfileByUid(profile.uid).then(function(user) {
						if (user) {
							Analytics.logEvent('Auth', 'Sign In', 'Facebook');
							// trackUser Event
							Analytics.logUserArr([
										$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
										'trackEvent',
										'Auth',
										'Sign In',
										'Facebook'
									]);
							makeToast('Berhasil Login');
							$http.get("https://graph.facebook.com/v2.8/me?fields=name,location,birthday,gender,picture.type(large){url},age_range,email,about", {params :{
								access_token : $localStorage.fbaccesstoken,
								format : "json"
							}}).then(function(result) {
								$localStorage.indexUser = result.data.id;
								$scope.dataUser = result.data;
								Services.updateUserDataLoginFb($scope.dataUser, $scope.user);
							});
						} else {
							Analytics.logEvent('Auth', 'Sign Up', 'Facebook');
							Analytics.logUserArr([
										$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
										'trackEvent',
										'Auth',
										'Sign Up',
										'Facebook'
									]);
							$http.get("https://graph.facebook.com/v2.8/me?fields=name,location,birthday,gender,picture.type(large){url},age_range,email,about", {params :{
								access_token : $localStorage.fbaccesstoken,
								format : "json"
							}}).then(function(result) {
								$localStorage.indexUser = result.data.id;
								$scope.dataUser = result.data;
								Services.addUserData($scope.dataUser, $scope.user).then(function(user) {
									makeToast('Berhasil Login');
									console.log(user);
								}, function(err) {
									firebase.auth().signOut().then(function() {
										makeToast('Login gagal, coba dengan email lain');
									});
								})
							});
						}
					}, function(err) {
						Analytics.logEvent('Auth', 'Auth Failed');
						Analytics.logUserArr([
									$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
									'trackEvent',
									'Auth',
									'Auth Failed'
								]);
						firebase.auth().signOut();
						makeToast('Login gagal, koneksi tidak stabil');
					})
					checkWizardData();
				} else if (profile.providerId === "google.com") {
					Services.getProfileByUid(profile.uid).then(function(user) {
						if (user) {
							Analytics.logEvent('Auth', 'Sign In', 'Google');
							Analytics.logUserArr([
										$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
										'trackEvent',
										'Auth',
										'Sign In',
										'Google'
									]);
							makeToast('Berhasil Login');
							$http.get("https://www.googleapis.com/userinfo/v2/me?fields=email,family_name,gender,given_name,hd,id,link,locale,name,picture,verified_email", {
								headers :{
									"Authorization" : "Bearer "+$localStorage.googleaccesstoken
								}
							}).then(function(result) {
								$localStorage.indexUser = result.data.id;
								$scope.dataUser = result.data;
								Services.updateUserDataLoginGoogle($scope.dataUser, $scope.user);
							});
						} else {
							Analytics.logEvent('Auth', 'Sign Up', 'Google');
							Analytics.logUserArr([
										$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
										'trackEvent',
										'Auth',
										'Sign Up',
										'Google'
									]);
							$http.get("https://www.googleapis.com/userinfo/v2/me?fields=email,family_name,gender,given_name,hd,id,link,locale,name,picture,verified_email", {
								headers :{
									"Authorization" : "Bearer "+$localStorage.googleaccesstoken
								}
							}).then(function(result) {
								$localStorage.indexUser = result.data.id;
								$scope.dataUser = result.data;
								Services.addUserDataByGoogle($scope.dataUser, $scope.user).then(function(user) {
									makeToast('Berhasil Login');
								}, function(err) {
									firebase.auth().signOut().then(function() {
										makeToast('Login gagal, coba dengan email lain');
									});
								})
							});
						}
					}, function(err) {
						// trackEvent
						Analytics.logEvent('Auth', 'Auth Failed');
						// trackUser Event
						Analytics.logUserArr([
									$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
									'trackEvent',
									'Auth',
									'Auth Failed'
								]);
						firebase.auth().signOut();
						makeToast('Login gagal, koneksi tidak stabil');
					})
					checkWizardData();
				}  else {
					// trackEvent
					Analytics.logEvent('Auth', 'Auth Failed');
					// trackUser Event
					Analytics.logUserArr([
								$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
								'trackEvent',
								'Auth',
								'Auth Failed'
							]);
					firebase.auth().signOut();
					makeToast('Login gagal, coba dengan email lain');
					$ionicLoading.hide();
					$ionicHistory.goBack();
				}
			});
		}
	});

	function checkWizardData() {
		var indexUser = $localStorage.indexUser ? $localStorage.indexUser : $localStorage.token;
		Services.getProfileByUid(indexUser).then(function(result) {
			if (!(result && result.hasOwnProperty('gender') && result.hasOwnProperty('dateOfBirth'))) {
				$ionicLoading.hide();	
				$state.go('registration');
			} else {
				$ionicLoading.hide();
				$ionicHistory.goBack();
			}
		}, function(reason) {
			console.log("cannto retrieve profile");
			$ionicLoading.hide();
			$ionicHistory.goBack();
		});
	}

	function makeToast(_message) {
		window.plugins.toast.showWithOptions({
			message: _message,
			duration: 1500,
			position: 'bottom',
			addPixelsY: -40
		});
	};
})

// documented
.controller('profilCtrl', function($scope, $state, $ionicLoading, Services, $http, $localStorage, $ionicHistory, $ionicModal, $cordovaGeolocation, $ionicPopup, $cordovaToast, Analytics) {
	$ionicLoading.show({
      template: '<ion-spinner icon="dots" class="spinner-positive"></ion-spinner>',
      duration: 5000
    });

	$scope.$on('$ionicView.enter', function() {
		// trackView
		Analytics.logView('Profil');
		// trackUser View
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackView',
					'Profil'
				]);
		var user = firebase.auth().currentUser;
		if (user) {
			user.providerData.forEach(function(profile) {
				if (profile.providerId === "facebook.com") {
					$scope.getProfileByUid(profile.uid);
				} else if (profile.providerId === "google.com") {
					$scope.getProfileByUid(profile.uid);
				} else {
					console.log('logged in with another provider');
				}
			});
		} else {
			$state.go('tersimpan');
		}
	});

	$scope.getProfileByUid = function(uid) {
		Services.getProfileByUid(uid).then(function(dataUser) {
			if (dataUser) {
				$scope.dataUser = dataUser;
				$ionicLoading.hide();
			} else {
				console.log('profil no dataUser found with uid:'+uid);
				makeToast('Data tidak ditemukan');
			}
		})
	} 

	$scope.updateUserData = function() {
		// trackEvent
		Analytics.logEvent('Profil', 'Tombol Update');
		// trackUser Event
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackEvent',
					'Profil',
					'Tombol Update'
				]);
		$ionicLoading.show({
	      template: '<ion-spinner icon="dots" class="spinner-positive"></ion-spinner>',
	      duration: 5000
	    });

		Services.updateUserData($scope.dataUser).then(function(result) {
			$ionicLoading.hide();
			// trackEvent
			Analytics.logEvent('Profil', 'Update');
			// trackUser Event
			Analytics.logUserArr([
						$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
						'trackEvent',
						'Profil',
						'Update'
					]);
			makeToast('Data berhasil diperbarui');
		}, function(err) {
			console.log('error');
			$ionicLoading.hide();
		});
	}

	$scope.signOut = function() {
		firebase.auth().signOut().then(function() {
			// trackEvent
			Analytics.logEvent('Auth', 'Sign Out');
			Analytics.logEvent('Profil', 'Tombol Sign Out')
			// trackUser Event
			Analytics.logUserArr([
						$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
						'trackEvent',
						'Auth',
						'Sign Out'
					]);
			Analytics.logUserArr([
						$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
						'trackEvent',
						'Profil',
						'Tombol Sign Out'
					]);
			$state.go('tersimpan');
			// $ionicHistory.removeBackView();
		}, function(error) {
			console.log(error);
		});
	}

	$scope.getDate = function(timestamp) {
		var x = new Date(timestamp);
		var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		var year = x.getFullYear();
		var month = months[x.getMonth()];
		var date = x.getDate();
		var time = date + ' ' + month + ' ' + year;
		return time;
	}

	function makeToast(_message) {
		window.plugins.toast.showWithOptions({
			message: _message,
			duration: 1500,
			position: 'bottom',
			addPixelsY: -40
		});
	}
})

// documented
.controller('ulasanPenggunaCtrl', function($scope, $state, $stateParams, $ionicLoading, $ionicModal, $timeout, Services, Analytics, $localStorage) {
	var loadFlag = false;
	var loadingIndicator = $ionicLoading.show({
      template: '<ion-spinner icon="dots" class="spinner-positive"></ion-spinner>'
    });

    $timeout(function() {
    	$ionicLoading.hide();
    	if(!loadFlag) {
    		makeToast('Koneksi tidak stabil');
    	}
    }, 10000);

	$scope.$on('$ionicView.enter', function() {
		if ($stateParams.compose || $stateParams.compose != null) {
			$scope.openRating();
		}
		// trackView
		Analytics.logView('Ulasan Pengguna');
		// trackMerchant
		Analytics.logMerchant($stateParams.indexResto, 'Ulasan Pengguna');
		// trackUser View
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackView',
					'Ulasan Pengguna'
				]);
		// trackUser Merchant
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackMerchant',
					$stateParams.indexResto,
					'Ulasan Pengguna'
				]);
	});

	$scope.namaResto = $stateParams.namaResto;
	$scope.indexResto = $stateParams.indexResto;
	$scope.jmlSad = 0;
	$scope.jmlHappy = 0;
	$scope.jmlFavorite = 0;
	$scope.jmlReview = 0;
	$scope.sadSelected = false;
	$scope.happySelected = true;
	$scope.favoriteSelected = false;
	$scope.reviews = null;
	$scope.user = {
		rating: 5
	};

	$scope.ratingsObject = {
		iconOn: 'ion-ios-star',
		iconOff: 'ion-ios-star-outline',
		iconOnColor: 'orangered',
		iconOffColor: 'grey',
		rating: $scope.user.rating,
		minRating: 1,
		callback: function(rating) {
			$scope.ratingsCallback(rating);
		}
	};

	$scope.ratingsCallback = function(rating) {
		$scope.user.rating = rating;
	};

	$scope.sadFeedbackCallback = function() {
		console.log('sad');
		$scope.sadSelected = true;
		$scope.happySelected = false;
		$scope.favoriteSelected = false;
		$scope.user.rating = 1;
		$scope.user.emoji = 'sad';
	};

	$scope.happyFeedbackCallback = function() {
		console.log('happy');
		$scope.sadSelected = false;
		$scope.happySelected = true;
		$scope.favoriteSelected = false;
		$scope.user.rating = 3;
		$scope.user.emoji = 'happy';
	};

	$scope.favoriteFeedbackCallback = function() {
		console.log('favorite');
		$scope.sadSelected = false;
		$scope.happySelected = false;
		$scope.favoriteSelected = true;
		$scope.user.rating = 5;
		$scope.user.emoji = 'favorite';
	};

	$scope.saveRatingReview = function() {
		// trackEvent
		Analytics.logEvent('Ulasan Pengguna', 'Tombol Simpan Ulasan');
		// trackUser Event
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackEvent',
					'Ulasan Pengguna',
					'Tombol Simpan Ulasan'
				]);
		if ($scope.user.rating == null 
			&& $scope.user.emoji == null 
			&& $scope.user.titleReview == null
			&& $scope.user.review == null) {
			$ionicPopup.alert({
				title: 'Ups',
				template: '<center><p>Kamu harus mengisi rating atau review</p></center>',
				okText: 'OK',
				okType: 'button-oren'
			});
		} else {
			var user = firebase.auth().currentUser;
			if (user) {
				user.providerData.forEach(function(profile) {
					Services.getProfileByUid(profile.uid).then(function(dataUser) {
						if (dataUser) {
							$scope.dataUser = dataUser;
							console.log(JSON.stringify(dataUser));
							Services.updateRatingReview(
								$scope.dataUser.index,
								$scope.indexResto, 
								$scope.dataUser.name, 
								$scope.dataUser.photoUrl,
								$scope.user.rating,
								$scope.user.titleReview,
								$scope.user.review,
								$scope.user.emoji
							).then(function(result) {
								if($scope.sadSelected) {
									Services.updateJmlSad($scope.indexResto).then(function(result) {
										$scope.refreshRatingReview();
									});
								} else if($scope.happySelected) {
									Services.updateJmlHappy($scope.indexResto).then(function(result) {
										$scope.refreshRatingReview();
									});
								} else if($scope.favoriteSelected) {
									Services.updateJmlFavorite($scope.indexResto).then(function(result) {
										$scope.refreshRatingReview();
									});
								}

								$scope.refreshRatingReview();
								$scope.user = null;
								// trackMerchant
								Analytics.logMerchant($stateParams.indexResto, 'Diulas Pengguna');
								// trackUser Merchant
								Analytics.logUserArr([
											$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
											'trackMerchant',
											$stateParams.indexResto,
											'Diulas Pengguna'
										]);
							}, function(reason) {
								console.log('gagal review');
								makeToast('Gagal menambahkan ulasan');
							});
						} else {
							console.log('profil no dataUser found with uid:'+uid);
						}
					});
				});
			} else {
				$ionicPopup.alert({
					title: 'Belum login',
					template: '<center>Kamu harus login dulu</center>',
					okText: 'OK',
					okType: 'button-oren'
				});
				$state.go('login');
			};
		}
		$scope.modalRating.hide();
	};

	$scope.refreshRatingReview = function() {
		$scope.jmlReview = 0;
		Services.getRestoranReviews($stateParams.indexResto).then(function(reviews) {
			if(reviews) {
				for(var r in reviews) {
					if(reviews[r].review == undefined || reviews[r].review == null) {
						delete reviews[r];
					} else {
						$scope.jmlReview++;
					}
				}
				$scope.reviews = reviews;

				Services.getJmlSad($stateParams.indexResto).then(function(jml) {
					if(typeof jml === 'number' && jml >= 0)
						$scope.jmlSad = jml;
					else
						$scope.jmlSad = 0;
				});

				Services.getJmlHappy($stateParams.indexResto).then(function(jml) {
					if(typeof jml === 'number' && jml >= 0)
						$scope.jmlHappy = jml;
					else
						$scope.jmlHappy = 0;
				});

				Services.getJmlFavorite($stateParams.indexResto).then(function(jml) {
					if(typeof jml === 'number' && jml >= 0)
						$scope.jmlFavorite = jml;
					else
						$scope.jmlFavorite = 0;
				});

				console.log('success');
				loadFlag = true;
			}

			$ionicLoading.hide();
		}, function(reason) {
			console.log(JSON.stringify(reason));
			console.log('gagal');
			$ionicLoading.hide();
		});
		$scope.$broadcast('scroll.refreshComplete');
	};
	$scope.refreshRatingReview();


	///////////////////////////////////////////////////////////
	//
	// MODAL SECTION
	//
	///////////////////////////////////////////////////////////

	$ionicModal.fromTemplateUrl('templates/rating.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) { $scope.modalRating = modal; });

	$scope.openRating = function() {
		var user = firebase.auth().currentUser;
		if (user) {
			// trackView
			Analytics.logView('Tulis Ulasan');
			// trackEvent
			Analytics.logEvent('Ulasan Pengguna', 'Tulis Ulasan');
			// trackUser View
			Analytics.logUserArr([
						$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
						'trackView',
						'Tulis Ulasan'
					]);
			// trackUser Event
			Analytics.logUserArr([
						$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
						'trackEvent',
						'Ulasan Pengguna',
						'Tulis Ulasan'
					]);
			$scope.modalRating.show();
		} else {
			$state.go('login');
		}
	}

	function makeToast(_message) {
		window.plugins.toast.showWithOptions({
			message: _message,
			duration: 1500,
			position: 'bottom',
			addPixelsY: -40
		});
	}
})

// documented
.controller('rekomendasiCtrl', function($scope, $state, $stateParams, Services, $http, $ionicPopup, Analytics, $localStorage, $ionicLoading){
	$scope.data = [];

	// $scope.data.namaResto = "[Testing] Nama Resto";
	// $scope.data.alamat = "[Testing] Alamat Resto";
	// $scope.data.jenis = "HIK";
	// $scope.data.kontak = "[Testing] Kontak Resto";
	// $scope.data.alasan = "[Testing] Alasan Resto";

	$scope.$on('$ionicView.enter', function() {
		// trackView
		Analytics.logView('Rekomendasi Restoran');
		// trackUser View
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackView',
					'Rekomendasi Restoran'
				]);
	});

	// $scope.testJSON = function(){
	// 	$http.post('http://api.mobilepangan.com/testJSON', {
	// 		data: {
	// 			"title": "Hello",
	// 			"body": "This is body"
	// 		}
	// 	}, {
	// 		headers: {
	// 			"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
	// 		}
	// 	}).then(function(success){
	// 		alert(JSON.stringify(success))
	// 		console.log(JSON.stringify(success))
	// 	}, function(error){
	// 		alert(JSON.stringify(error))
	// 		console.log(JSON.stringify(error));
	// 	})
	// }

	$scope.rekomendasikan = function(){
		$ionicLoading.show({
			template: '<ion-spinner icon="dots" class="spinner-positive"></ion-spinner>',
			duration: 5000
		  });
		$http.post('http://api.mobilepangan.com/v1/recomendation', {
			data: {
				// 'api_token' : "b3acddb8bd0dfe0bff373effb74cc2b13d943111",
				'restoran' : $scope.data.namaResto,
				'address' : $scope.data.alamat,
				'category' : $scope.data.jenis,
				'phone' : $scope.data.kontak,
				'description' : $scope.data.alasan
			}
		}, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
			}
		}).then(function(success){
			// alert("success: "+JSON.stringify(success))
			$ionicLoading.hide();
			makeToast('Terima kasih telah membantu kami :)')			
			$state.go("jelajah");			
			console.log(JSON.stringify(success))
		}, function(error){
			$ionicLoading.hide();
			makeToast(':( Terjadi kesalahan, mohon ulangi nanti')
			$state.go("jelajah");			
			// alert("error: "+JSON.stringify(error))
			console.log(JSON.stringify(error));
		})
	}

	function makeToast(_message) {
		window.plugins.toast.showWithOptions({
			message: _message,
			duration: 1500,
			position: 'bottom',
			addPixelsY: -40
		});
	}

	// $scope.rekomendasikan = function() {
	// 	if ($scope.data.namaResto == "" ||
	// 		$scope.data.alamat == "" ||
	// 		$scope.data.jenis == "" ||
	// 		$scope.data.namaResto == null ||
	// 		$scope.data.alamat == null ||
	// 		$scope.data.jenis == null) {
	// 		// trackEvent
	// 		Analytics.logEvent('Rekomendasi', 'Tidak Lengkap');
	// 		// trackUser Event
	// 		Analytics.logUserArr([
	// 					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
	// 					'trackEvent',
	// 					'Rekomendasi',
	// 					'Tidak Lengkap'
	// 				]);
	// 		$ionicPopup.alert({
	// 			title: 'Lengkapi Data',
	// 			template: '<center>Data belum lengkap</center>',
	// 			okText: 'OK',
	// 			okType: 'button-oren'
	// 		});
	// 	} else {
	// 		$http.post("https://mobilepangan.com/mangan/sendMailRecomendation?nama="+$scope.data.namaResto+"&alamat="+$scope.data.alamat+"&jenis="+$scope.data.jenis+"&kontak="+$scope.data.kontak+"&alasan="+$scope.data.alasan+"&token=717mangan"
	// 			).success(function(data) {
	// 				console.log("sukses");
	// 				console.log(data);
	// 			}).error(function(error, status) {
	// 				console.log("failed");
	// 				console.log(error, status);
	// 			});


	// 		Services.rekomendasiResto($scope.data);
	// 		// trackEvent
	// 		Analytics.logEvent('Rekomendasi', 'Rekomendasi');
	// 		// trackUser Event
	// 		Analytics.logUserArr([
	// 					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
	// 					'trackEvent',
	// 					'Rekomendasi',
	// 					'Rekomendasi'
	// 				]);

	// 		$ionicPopup.alert({
	// 			title: 'Terima Kasih',
	// 			template: '<center>Terima kasih telah memberikan rekomendasi</center>',
	// 			okText: 'OK',
	// 			okType: 'button-oren'
	// 		});

	// 		$state.go("jelajah");
	// 	}
	// }
})

.controller('daftarCtrl', function($scope, $state, $stateParams, Services, $http, $ionicPopup, Analytics, $localStorage, $ionicLoading){
	$scope.data = [];

	// $scope.data.namaResto = "[TESTING] Restoran"
	// $scope.data.alamat = "[TESTING] Alamat Restoran"
	// $scope.data.namaPemilik = "[TESTING] Pemilik"
	// $scope.data.deskripsi = "[TESTING] Deskripsi Restoran"
	// $scope.data.kontak = "[TESTING] Kontak"

	$scope.$on('$ionicView.enter', function() {
		// trackView
		Analytics.logView('Daftar Restoran');
		// trackUser View
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackView',
					'Daftar Restoran'
				]);
	});

	$scope.daftar = function(){
		$ionicLoading.show({
			template: '<ion-spinner icon="dots" class="spinner-positive"></ion-spinner>',
			duration: 5000
		  });
		$http.post('http://api.mobilepangan.com/v1/registration', {
			data: {
				// 'api_token' : "b3acddb8bd0dfe0bff373effb74cc2b13d943111",
				'name' : $scope.data.namaResto,
				'address': $scope.data.alamat,
				'owner': $scope.data.namaPemilik,
				'description': $scope.data.deskripsi,
				'phone': $scope.data.kontak
			}
		}, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
			}
		}).then(function(success){
			// alert("success: "+JSON.stringify(success))
			$ionicLoading.hide();
			makeToast('Berhasil! kami akan segera menghubungi :)')			
			$state.go("jelajah");			
			console.log(JSON.stringify(success))
		}, function(error){
			$ionicLoading.hide();
			makeToast(':( Terjadi kesalahan, mohon ulangi nanti')
			$state.go("jelajah");			
			// alert("error: "+JSON.stringify(error))
			console.log(JSON.stringify(error));
		})
	}

	function makeToast(_message) {
		window.plugins.toast.showWithOptions({
			message: _message,
			duration: 1500,
			position: 'bottom',
			addPixelsY: -40
		});
	}

	// $scope.daftar = function() {
	// 	if ($scope.data.namaResto == "" ||
	// 		$scope.data.namaPemilik == "" ||
	// 		$scope.data.alamat == "" ||
	// 		$scope.data.kontak == "" ||
	// 		$scope.data.namaResto == null ||
	// 		$scope.data.namaPemilik == null ||
	// 		$scope.data.alamat == null ||
	// 		$scope.data.kontak == null) {
	// 		// trackEvent
	// 		Analytics.logEvent('Daftar Restoran', 'Tidak Lengkap');
	// 		// trackUser Event
	// 		Analytics.logUserArr([
	// 					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
	// 					'trackEvent',
	// 					'Daftar Restoran',
	// 					'Tidak Lengkap'
	// 				]);
	// 		$ionicPopup.alert({
	// 			title: 'Lengkapi Data',
	// 			template: '<center>Data belum lengkap</center>',
	// 			okText: 'OK',
	// 			okType: 'button-oren'
	// 		});
	// 	} else {
	// 		$http.post("https://mobilepangan.com/mangan/sendMailRegister?nama="+$scope.data.namaResto+"&namapemilik="+$scope.data.namaPemilik+"&alamat="+$scope.data.alamat+"&kontak="+$scope.data.kontak+"&deskripsi="+$scope.data.deskripsi+"&token=717mangan"
	// 			).success(function(data) {
	// 				console.log(data);
	// 			}).error(function(error, status) {
	// 				console.log(error, status);
	// 			});

	// 		Services.daftarResto($scope.data);
	// 		// trackEvent
	// 		Analytics.logEvent('Daftar Restoran', 'Daftar');
	// 		// trackUser Event
	// 		Analytics.logUserArr([
	// 					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
	// 					'trackEvent',
	// 					'Daftar Restoran',
	// 					'Daftar'
	// 				]);

	// 		$ionicPopup.alert({
	// 			title: 'Mendaftar',
	// 			template: '<center>Kami akan segera menghubungi anda</center>',
	// 			okText: 'OK',
	// 			okType: 'button-oren'
	// 		});

	// 		$state.go("jelajah");
	// 	}		
	// }
})

.controller('adsController', function($scope, $state, Analytics, $localStorage, ManganAds) {
	$scope.adsCounter = 5;

	$scope.showRowAds = function(isShow) {
		if(isShow)
		{
			var adsUrl = ManganAds.getAdsUrl();
			return adsUrl;
		}

		return null;
	}
})

.controller('kotaCtrl', function($scope, $state, $stateParams, Services, Analytics, $localStorage, $ionicHistory, $ionicLoading, $localStorage){
	$scope.$on('$ionicView.enter', function() {
		Analytics.logView('City');
	});

	$scope.pilihKota = function(kota) {
		$ionicLoading.show({
	      template: '<ion-spinner icon="dots" class="spinner-positive"></ion-spinner>',
	      duration: 3000
	    });

		$localStorage.location = kota;
		var indexUser = $localStorage.indexUser ? $localStorage.indexUser : $localStorage.token;
		Services.getUserPickLocation(indexUser).then(function(result) {
			console.log(result);
			if (!result && typeof result !== "boolean") {
				Services.setUserPickLocation(indexUser).then(function(result) {
					console.log('berhasil');
					$state.go('jelajah', { changeCity: true });
				},function(reason) {
					console.log('gagal');
					$state.go('jelajah', { changeCity: true });
				});
			} else {
				$state.go('jelajah', { changeCity: true });
			}
		}, function(reason) {
			console.log(reason);
			$state.go('jelajah', { changeCity: true });
		});
	}
})

.controller('wizardCtrl', function($scope, $state, $ionicSlideBoxDelegate, $localStorage, $cordovaOauth, Services, $ionicLoading, $http, $cordovaToast, $ionicPlatform, $ionicHistory, Analytics) {
	$scope.$on('$ionicView.enter', function() {
		Analytics.logView('Wizard');
		if ($localStorage.wizard) {
			$state.go('jelajah');
			return;
		}
	});

	$scope.next = function() {
		$ionicSlideBoxDelegate.next();
  	};
  	$scope.previous = function() {
  		$ionicSlideBoxDelegate.previous();
  	};

	firebase.auth().signOut().then(function() {
		Analytics.logEventArr([
			'Wizard',
			'Auth',
			'Sign Out'
		])
		console.log('SIGNED OUT');
	});

	$scope.$on("$ionicView.beforeLeave", function(){
		console.log('LEAVE');
		Analytics.logEventArr([
			'Wizard',
			'Leave'
			])
		$localStorage.wizard = true;
	});

	$scope.slideChanged = function(index) {
		Analytics.logEventArr([
			'Wizard',
			'SlideChange'
		])
		console.log(index);
		$scope.slideIndex = index;
	};

	$scope.endWizard = function() {
		Analytics.logEventArr([
			'Wizard',
			'Skip'
		])
		$state.go('jelajah', {changeCity: true});
	}

	$scope.fblogin = function() {
		// trackEvent
		Analytics.logEvent('Wizard', 'Tombol', 'Facebook');
		// trackUser Event
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackEvent',
					'Wizard',
					'Tombol',
					'Facebook'
				]);
		$cordovaOauth.facebook(1764800933732733, ["email", "user_birthday", "user_location"]).then(function(result) {
			console.log(result.access_token);
			$localStorage.fbaccesstoken = result.access_token;
			var credential = firebase.auth.FacebookAuthProvider.credential($localStorage.fbaccesstoken);
			firebase.auth().signInWithCredential(credential).catch(function(error) {
				console.log('Error : '+JSON.stringify(error));
			});
			$ionicLoading.show({
		      template: '<ion-spinner icon="dots" class="spinner-positive"></ion-spinner>',
		      duration: 5000
		    });
			// $ionicHistory.goBack();
		}, function(err) {
			console.log('Error oAuth facebook: '+err);
		})
	}

	$scope.googlelogin = function() {
		// trackEvent
		Analytics.logEvent('Wizard', 'Tombol', 'Google');
		// trackUser Event
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackEvent',
					'Wizard',
					'Tombol',
					'Google'
				]);
		$cordovaOauth.google("1054999345220-m4vlisv7o0na684cgcg13s1tj2t4v447.apps.googleusercontent.com", ["email", "profile"]).then(function(result) {
			$localStorage.googleidtoken = result.id_token;
			$localStorage.googleaccesstoken = result.access_token;
			var credential = firebase.auth.GoogleAuthProvider.credential($localStorage.googleidtoken);
			firebase.auth().signInWithCredential(credential).catch(function(error) {
				console.log("Error : "+JSON.stringify(error));
			});
			$ionicLoading.show({
		      template: '<ion-spinner icon="dots" class="spinner-positive"></ion-spinner>',
		      duration: 5000
		    });
			// $ionicHistory.goBack();
		}, function(err) {
			console.log('Error oAuth google: '+err);
		})
	}

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			console.log("uid: "+user.uid);
			$scope.user = user;
			user.providerData.forEach(function(profile) {
				if (profile.providerId === "facebook.com") {
					Services.getProfileByUid(profile.uid).then(function(user) {
						if (user) {
							// trackEvent
							Analytics.logEvent('Auth', 'Sign In', 'Facebook');
							// trackUser Event
							Analytics.logUserArr([
										$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
										'trackEvent',
										'Auth',
										'Sign In',
										'Facebook'
									]);
							makeToast('Berhasil Login');
							$http.get("https://graph.facebook.com/v2.8/me?fields=name,location,birthday,gender,picture.type(large){url},age_range,email,about", {params :{
								access_token : $localStorage.fbaccesstoken,
								format : "json"
							}}).then(function(result) {
								$localStorage.indexUser = result.data.id;
								$scope.dataUser = result.data;
								Services.updateUserDataLoginFb($scope.dataUser, $scope.user);
								checkWizardData($localStorage.indexUser);
							});
						} else {
							// trackEvent
							Analytics.logEvent('Auth', 'Sign Up', 'Facebook');
							// trackUser Event
							Analytics.logUserArr([
										$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
										'trackEvent',
										'Auth',
										'Sign Up',
										'Facebook'
									]);
							$http.get("https://graph.facebook.com/v2.8/me?fields=name,location,birthday,gender,picture.type(large){url},age_range,email,about", {params :{
								access_token : $localStorage.fbaccesstoken,
								format : "json"
							}}).then(function(result) {
								$localStorage.indexUser = result.data.id;
								$scope.dataUser = result.data;
								Services.addUserData($scope.dataUser, $scope.user).then(function(user) {
									makeToast('Berhasil Login');
									console.log(user);
									checkWizardData($localStorage.indexUser);
								}, function(err) {
									firebase.auth().signOut().then(function() {
										makeToast('Login gagal, coba dengan email lain');
									});
								})
							});
						}
					}, function(err) {
						// trackEvent
						Analytics.logEvent('Auth', 'Auth Failed');
						// trackUser Event
						Analytics.logUserArr([
									$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
									'trackEvent',
									'Auth',
									'Auth Failed'
								]);
						firebase.auth().signOut();
						makeToast('Login gagal, koneksi tidak stabil');
					})
					checkWizardData($localStorage.indexUser);
				} else if (profile.providerId === "google.com") {
					Services.getProfileByUid(profile.uid).then(function(user) {
						if (user) {
							// trackEvent
							Analytics.logEvent('Auth', 'Sign In', 'Google');
							// trackUser Event
							Analytics.logUserArr([
										$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
										'trackEvent',
										'Auth',
										'Sign In',
										'Google'
									]);
							makeToast('Berhasil Login');
							$http.get("https://www.googleapis.com/userinfo/v2/me?fields=email,family_name,gender,given_name,hd,id,link,locale,name,picture,verified_email", {
								headers :{
									"Authorization" : "Bearer "+$localStorage.googleaccesstoken
								}
							}).then(function(result) {
								$localStorage.indexUser = result.data.id;
								$scope.dataUser = result.data;
								Services.updateUserDataLoginGoogle($scope.dataUser, $scope.user);
								checkWizardData($localStorage.indexUser);
							});
						} else {
							// trackEvent
							Analytics.logEvent('Auth', 'Sign Up', 'Google');
							// trackUser Event
							Analytics.logUserArr([
										$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
										'trackEvent',
										'Auth',
										'Sign Up',
										'Google'
									]);
							$http.get("https://www.googleapis.com/userinfo/v2/me?fields=email,family_name,gender,given_name,hd,id,link,locale,name,picture,verified_email", {
								headers :{
									"Authorization" : "Bearer "+$localStorage.googleaccesstoken
								}
							}).then(function(result) {
								$localStorage.indexUser = result.data.id;
								$scope.dataUser = result.data;
								Services.addUserDataByGoogle($scope.dataUser, $scope.user).then(function(user) {
									makeToast('Berhasil Login');
									checkWizardData($localStorage.indexUser);
								}, function(err) {
									firebase.auth().signOut().then(function() {
										makeToast('Login gagal, coba dengan email lain');
									});
								})
							});
						}
					}, function(err) {
						// trackEvent
						Analytics.logEvent('Auth', 'Auth Failed');
						// trackUser Event
						Analytics.logUserArr([
									$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
									'trackEvent',
									'Auth',
									'Auth Failed'
								]);
						firebase.auth().signOut();
						makeToast('Login gagal, koneksi tidak stabil');
					});
				}  else {
					// trackEvent
					Analytics.logEvent('Auth', 'Auth Failed');
					// trackUser Event
					Analytics.logUserArr([
								$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
								'trackEvent',
								'Auth',
								'Auth Failed'
							]);
					firebase.auth().signOut();
					makeToast('Login gagal, coba dengan email lain');
					$ionicLoading.hide();
					$ionicHistory.goBack();
				}
			});
		}
	});

	function checkWizardData(indexUser) {
		console.log('check wizard data :'+indexUser);
		Services.getProfileByUid(indexUser).then(function(result){
			console.log(indexUser);
			console.log(JSON.stringify(result));
			if (!(result && result.hasOwnProperty('gender') && result.hasOwnProperty('dateOfBirth'))) {
				$ionicLoading.hide();	
				$state.go('registration', {wizard: true});
			} else {
				$ionicLoading.hide();
				$state.go('jelajah', {changeCity: true});
				console.log("we're done");
			}
		}, function(reason) {
			console.log("cannot retrieve profile");
			$ionicLoading.hide();
			$state.go('jelajah', {changeCity: true});
		});
	}

	function makeToast(_message) {
		window.plugins.toast.showWithOptions({
			message: _message,
			duration: 1500,
			position: 'bottom',
			addPixelsY: -40
		});
	};
})

.controller('registrationCtrl', function($state, $scope, $localStorage, $stateParams, $ionicHistory, Services, Analytics){
	$scope.$on('$ionicView.enter', function() {
		Analytics.logView('Registration');
	});

	$scope.user = {
		dateOfBirth: new Date(0),
		gender: null,
		phone: null
	};

	$scope.complete = function() {
		Analytics.logEventArr([
			'Registration',
			'Button',
			'Complete'
		])
		if (!($scope.user.dateOfBirth && $scope.user.gender)) {
			Analytics.logEventArr([
				'Registration',
				'Not Complete'
			]);
			alert('Tanggal lahir dan gender wajib diisi!');
		} else {
			var indexUser = $localStorage.indexUser ? $localStorage.indexUser : $localStorage.token;
			Services.addWizardData(indexUser, $scope.user.dateOfBirth, $scope.user.gender, $scope.user.phone).then(function(result) {
				console.log("scuccess add wizard data");
				Analytics.logEventArr([
					'Registration',
					'Complete',
					'Success'
				]);
				$ionicHistory.goBack();
			}, function(reason) {
				Analytics.logEventArr([
					'Registration',
					'Complete',
					'Failed'
				]);
				console.log("failed add wizard data");
				$ionicHistory.goBack();
			});
		}
	}
})

.controller('klaimCtrl', function($scope, $state, $stateParams, $ionicHistory, Analytics, $localStorage, Services, $ionicPopup, $ionicLoading, $http){
	$scope.namaResto = $stateParams.name;
	$scope.data = [];
	$scope.$on('$ionicView.enter', function() {
		// trackView
		Analytics.logView('Klaim Restoran');
		// trackUser View
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackView',
					'Klaim Restoran'
				]);
	});

	$scope.claim = function(){
		$ionicLoading.show({
			template: '<ion-spinner icon="dots" class="spinner-positive"></ion-spinner>',
			duration: 5000
		});

		$scope.data.indexResto = $stateParams.index;
		Services.claim($scope.data);

		$http.post('http://api.mobilepangan.com/v1/claim', {
			data: {
				// 'api_token' : "b3acddb8bd0dfe0bff373effb74cc2b13d943111",
				'name': $scope.data.namaPemilik,
				'phone': $scope.data.telepon,
				'indexResto' : $stateParams.index,
				'id_type': $scope.data.jenisIdentitas,
				'id_number': $scope.data.noIdentitas
			}
		}, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
			}
		}).then(function(success){
			// alert("success: "+JSON.stringify(success))
			$ionicLoading.hide();
			makeToast('Berhasil Klaim! kami akan segera menghubungi anda :)')
			$ionicHistory.goBack();			
			console.log(JSON.stringify(success))
		}, function(error){
			$ionicLoading.hide();
			makeToast(':( Terjadi kesalahan, mohon ulangi nanti')
			// alert("error: "+JSON.stringify(error))
			$ionicHistory.goBack();		
			console.log(JSON.stringify(error));
		})
		// trackEvent
		Analytics.logEvent('Klaim Restoran', 'Klaim');
		// trackUser Event
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackEvent',
					'Klaim Restoran',
					'Klaim'
				]);

	}

	function makeToast(_message) {
		window.plugins.toast.showWithOptions({
			message: _message,
			duration: 1500,
			position: 'bottom',
			addPixelsY: -40
		});
	}

	// $scope.claim = function() {
	// 	if ($scope.data.namaPemilik == "" ||
	// 		$scope.data.telepon == "" ||
	// 		$scope.data.jenisIdentitas == "" ||
	// 		$scope.data.noIdentitas == "" ||
	// 		$scope.data.namaPemilik == null ||
	// 		$scope.data.telepon == null ||
	// 		$scope.data.jenisIdentitas == null ||
	// 		$scope.data.noIdentitas == null) {
	// 		// trackEvent
	// 		Analytics.logEvent('Klaim Restoran', 'Tidak Lengkap');
	// 		// trackUser Event
	// 		Analytics.logUserArr([
	// 					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
	// 					'trackEvent',
	// 					'Klaim Restoran',
	// 					'Tidak Lengkap'
	// 				]);
	// 		$ionicPopup.alert({
	// 			title: 'Lengkapi Data',
	// 			template: '<center>Data belum lengkap</center>',
	// 			okText: 'OK',
	// 			okType: 'button-oren'
	// 		});
	// 	} else {
	// 		$scope.data.indexResto = $stateParams.index;
	// 		Services.claim($scope.data);
	// 		// trackEvent
	// 		Analytics.logEvent('Klaim Restoran', 'Klaim');
	// 		// trackUser Event
	// 		Analytics.logUserArr([
	// 					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
	// 					'trackEvent',
	// 					'Klaim Restoran',
	// 					'Klaim'
	// 				]);

	// 		$ionicPopup.alert({
	// 			title: 'Berhasil Di Klaim',
	// 			template: '<center>Kami akan segera menghubungi anda</center>',
	// 			okText: 'OK',
	// 			okType: 'button-oren'
	// 		});

	// 		// $state.go("jelajah");
	// 		$ionicHistory.goBack();
	// 	}		
	// }
})

.controller('laporCtrl', function($scope, $state, $stateParams, $ionicHistory, Analytics, $localStorage, Services, $ionicPopup, $ionicLoading, $http){
	$scope.namaResto = $stateParams.name;
	$scope.data = [];
	$scope.reportList = [
		{text: 'Hari / Jam Restoran berubah', checked: false},
		{text: 'Nomor telepon Restoran berubah', checked: false},
		{text: 'Harga menu berubah', checked: false},
		{text: 'Restoran pindah lokasi', checked: false},
		{text: 'Restoran sudah tutup', checked: false}
	];

	$scope.$on('$ionicView.enter', function() {
		// trackView
		Analytics.logView('Laporkan Restoran');
		// trackUser View
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackView',
					'Klaim Restoran'
				]);
	});

	$scope.report = function() {
		$ionicLoading.show({
			template: '<ion-spinner icon="dots" class="spinner-positive"></ion-spinner>',
			duration: 5000
		  });

		var str = '';
		for (var p in $scope.reportList) {
			if ($scope.reportList.hasOwnProperty(p)) {
				str +=$scope.reportList[p].text+', ';
			}
		}
		console.log("reportString:"+str);

		var reportList = [];
		for(var l in $scope.reportList){
			if($scope.reportList[l].checked){
				reportList.push($scope.reportList[l].text)
			}
		}
		$scope.data.indexResto = $stateParams.index;
		// $scope.data.reportList = reportList;
		$scope.data.reportList = str;
		Services.report($scope.data);

		$http.post('http://api.mobilepangan.com/v1/report', {
			data: {
				// 'api_token' : "b3acddb8bd0dfe0bff373effb74cc2b13d943111",
				'indexResto' : $stateParams.index,
				'report' : str + $scope.data.reportReason
			}
		}, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
			}
		}).then(function(success){
			// alert("success: "+JSON.stringify(success))
			$ionicLoading.hide();	
			makeToast('Terima kasih! kami akan memproses laporan anda')			
			$ionicHistory.goBack();			
			console.log(JSON.stringify(success))
		}, function(error){
			$ionicLoading.hide();	
			makeToast(':( Terjadi kesalahan, mohon ulangi nanti')			
			$ionicHistory.goBack();			
			// alert("error: "+JSON.stringify(error))
			console.log(JSON.stringify(error));
		})

		// trackEvent
		Analytics.logEvent('Laporkan Restoran', 'Laporkan');
		// trackUser Event
		Analytics.logUserArr([
					$localStorage.indexUser? $localStorage.indexUser : $localStorage.token,
					'trackEvent',
					'Laporkan Restoran',
					'Laporkan'
				]);

		// $state.go("jelajah");

		function makeToast(_message) {
			window.plugins.toast.showWithOptions({
				message: _message,
				duration: 1500,
				position: 'bottom',
				addPixelsY: -40
			});
		}
	}
})