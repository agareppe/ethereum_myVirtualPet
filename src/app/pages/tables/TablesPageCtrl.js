/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.tables')
      .controller('TablesPageCtrl', TablesPageCtrl);

  /** @ngInject */
  function TablesPageCtrl($scope, $filter, editableOptions, editableThemes) {

    if (typeof web3 !== 'undefined') {
      $scope.web3Provider = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      $scope.web3Provider = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
    $scope.web3 = new Web3($scope.web3Provider);
    $scope.virtualPetInstance = null;

    $.getJSON('contracts/VirtualPet.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var VirtualPetArtifact = data;
      $scope.VirtualPet = TruffleContract(VirtualPetArtifact);
      $scope.VirtualPet.defaults({
        gas:1000000
      });
      // Set the provider for our contract
      $scope.VirtualPet.setProvider($scope.web3Provider.currentProvider);

      // Use our contract to retrieve and mark the adopted pets
      $scope.loadFromContract();
    });

    $scope.loadFromContract=function(){

      $scope.VirtualPet.deployed().then(function(instance) {
      $scope.virtualPetInstance = instance;
     
      $scope.friends=[];
      $scope.virtualPetInstance.getPlayersLength.call()
      .then(function(data) {
         $scope.playersLength=data.c[0];
         $scope.friends = [];
         for (let index = 0; index < $scope.playersLength; index++) {
          $scope.virtualPetInstance.getPlayerAddress.call(index).
            then(function(data){
              $scope.virtualPetInstance.getPetDataByPlayer.call(data)
                .then(function(playerInfo){
                  $scope.friends.push({
                    id: data,
                    petName: web3.toAscii(playerInfo[1]),
                    petType: web3.toAscii(playerInfo[2]),
                    energyLevel: playerInfo[3].c[0]
                  });

                });
            });
         }
      },function(err) {
        console.log(err.message);
      }); 

      $scope.invites=[];
      $scope.virtualPetInstance.getPlayRequestLength.call()
      .then(function(data) {
         $scope.playersLength=data.c[0];
         $scope.friends = [];
         for (let index = 0; index < $scope.playersLength; index++) {
          $scope.virtualPetInstance.getPlayRequest.call(index).
            then(function(data){
              $scope.virtualPetInstance.getPetDataByPlayer.call(data)
                .then(function(playerInfo){
                  $scope.invites.push({
                    id: data,
                    petName: web3.toAscii(playerInfo[1]),
                    petType: web3.toAscii(playerInfo[2]),
                    energyLevel: playerInfo[3].c[0]
                  });

                });
            });
         }
      },function(err) {
        console.log(err.message);
      }); 
    });
  };

    $scope.invite = function(user) {
      $scope.virtualPetInstance.sendPlayRequest(user).then(function(data){
        
      },function(err){alert(err)});
    };

    $scope.letsPlay = function(user) {
     
      $scope.virtualPetInstance.letsPlay(user).then(function(data){
         
      },function(err){alert(err)});
    };
   
  }

})();
