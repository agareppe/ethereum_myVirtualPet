/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.profile')
    .controller('ProfilePageCtrl', ProfilePageCtrl);

  /** @ngInject */
  function ProfilePageCtrl($scope, fileReader, $filter, $uibModal) {

    //initial data
    $scope.petTypes = ["bird", "cat", "dog", "fish"];
    $scope.petType = "";
    $scope.petName="";
    $scope.name="";
    $scope.picture = '';

    $scope.energyLevel=83;

    if (typeof web3 !== 'undefined') {
      $scope.web3Provider = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      $scope.web3Provider = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
    $scope.web3 = new Web3($scope.web3Provider);
    $scope.virtualPetInstance = null;

    $scope.loadFromContract=function(){
      $scope.VirtualPet.deployed().then(function(instance) {
      $scope.virtualPetInstance = instance;
      
      $scope.virtualPetInstance.getPlayerData.call()
      .then(function(data) {
        if(data[0]==0x0000000000000000000000000000000000000000000000000000000000000000){
          $scope.energyLevel=0;
          //aca voy a tener que habilitar la edicion para agregar un usuario al juego
        }else{
          $scope.petName=web3.toAscii(data[1]);
          $scope.name=web3.toAscii(data[0]);
          $scope.petType=web3.toAscii(data[2]);
          $scope.energyLevel=data[3].c[0];
          $scope.picture ='/assets/pictures/'+$scope.petType+'.png';
        }
      },function(err) {
        console.log(err.message);
        $scope.energyLevel=0;
      }); 

      $scope.virtualPetInstance.iamTheOwner.call().then(function(data){
        if(data){
          $scope.decrementEnergyVisible=data;
        }
      });

    })
  }

    $.getJSON('contracts/VirtualPet.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var VirtualPetArtifact = data;
      $scope.VirtualPet = TruffleContract(VirtualPetArtifact);
    
      // Set the provider for our contract
      $scope.VirtualPet.setProvider($scope.web3Provider.currentProvider);

      // Use our contract to retrieve and mark the adopted pets
      $scope.loadFromContract();
    });

    // $scope.removePicture = function () {
    //   $scope.picture = $filter('appImage')('theme/no-photo.png');
    //   $scope.noPicture = true;
    // };

    // $scope.uploadPicture = function () {
    //   var fileInput = document.getElementById('uploadFile');
    //   fileInput.click();

    // };

    $scope.decrementEnergy = function(){
      $scope.virtualPetInstance.getPlayersLength.call()
      .then(function(data) {
         $scope.playersLength=data.c[0];
         $scope.friends = [];
         for (let index = 0; index < $scope.playersLength; index++) {
          $scope.virtualPetInstance.getPlayerAddress.call(index).
            then(function(data){
              $scope.virtualPetInstance.decrementEnergyLevel(data,2)
                .then(function(data){},function(err){alert(err)});
            });
         }
      },function(err) {
        console.log(err.message);
      }); 
    };

    $scope.update = function(){
    
      $scope.name=this.name;
      $scope.petName=this.petName;
      $scope.petType=this.petType;
      $scope.picture ='/assets/pictures/'+$scope.petType+'.png';

      if($scope.virtualPetInstance){
        $scope.virtualPetInstance
          .addPlayer(web3.fromAscii($scope.name),web3.fromAscii($scope.petName),web3.fromAscii($scope.petType));
      }else{
        alert('Contract not ready');
      } 
    };

    $scope.showModal = function (item) {
      $uibModal.open({
        animation: false,
        controller: 'ProfileModalCtrl',
        templateUrl: 'app/pages/profile/profileModal.html'
      }).result.then(function (link) {
          item.href = link;
        });
    };

    $scope.getFile = function () {
      fileReader.readAsDataUrl($scope.file, $scope)
          .then(function (result) {
            $scope.picture = result;
          });
    };

  }

})();
