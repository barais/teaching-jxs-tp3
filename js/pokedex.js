var pokeApp = angular.module('pokedex', ['ngResource']);

pokeApp.config(['$resourceProvider', function ($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

pokeApp.factory('PokemonService', ['$resource', '$http', function ($resource, $http) {
    //Selectionner les pokemons
    var search = "";

    return {
        //retourne tous les pokémons par nom
        getPokesName:
        $resource('https://pokeapi.co/api/v2/pokemon/', {}, {
            query: { method: 'GET', params: {}, isArray: false }
        }),
        //retourne les informations concernant les pokémons 
        getPokeInfos: function (uri) {
            return $resource(uri + search, {}, {
                query: { method: 'GET', params: {}, isArray: false }
            })
        },
        
        setSearch: function (userSearch) {
            search = userSearch;
        }
    }
}]);

pokeApp.controller('pokeForm', ['$scope', '$log', '$http', '$rootScope', 'PokemonService', function ($scope, $log, $http, $rootScope, PokemonService) {
    $scope.displayInfos = function () {
        $rootScope.$emit("setInfos", {});
    }

    $scope.searchId = function () {
        PokemonService.setSearch($scope.pokeId);

        $scope.displayInfos();
    };

    $scope.searchName = function () {
        PokemonService.setSearch($scope.pokeList);

        $scope.displayInfos();
    };

    PokemonService.getPokesName.query().$promise.then(function (data) {
        $scope.pokemons = data.results;
    });

}]);

pokeApp.controller('pokeInfo', ['$scope', '$resource', '$rootScope', 'PokemonService', function ($scope, $resource, $rootScope, PokemonService) {
    $rootScope.$on("setInfos", function () {
            PokemonService.getPokeInfos('https://pokeapi.co/api/v2/pokemon/').query().$promise.then(function (data) {
                //information du pokémon
                $scope.pokeID = data.id;
                $scope.pokeName = data.name;
                $scope.moves = data.moves;
            }, function (reason) {
                alert('Erreur: Numéro ou nom de pokémon invalide.');
            });
    })
}]);

pokeApp.directive("pokedex", function() {
    return {
        templateUrl: 'pokedex.html'
    };
});
