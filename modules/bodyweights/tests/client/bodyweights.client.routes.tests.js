(function () {
  'use strict';

  describe('Bodyweights Route Tests', function () {
    // Initialize global variables
    var $scope,
      BodyweightsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _BodyweightsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      BodyweightsService = _BodyweightsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('bodyweights');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/bodyweights');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          BodyweightsController,
          mockBodyweight;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('bodyweights.view');
          $templateCache.put('modules/bodyweights/client/views/view-bodyweight.client.view.html', '');

          // create mock Bodyweight
          mockBodyweight = new BodyweightsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Bodyweight Name'
          });

          // Initialize Controller
          BodyweightsController = $controller('BodyweightsController as vm', {
            $scope: $scope,
            bodyweightResolve: mockBodyweight
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:bodyweightId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.bodyweightResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            bodyweightId: 1
          })).toEqual('/bodyweights/1');
        }));

        it('should attach an Bodyweight to the controller scope', function () {
          expect($scope.vm.bodyweight._id).toBe(mockBodyweight._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/bodyweights/client/views/view-bodyweight.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          BodyweightsController,
          mockBodyweight;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('bodyweights.create');
          $templateCache.put('modules/bodyweights/client/views/form-bodyweight.client.view.html', '');

          // create mock Bodyweight
          mockBodyweight = new BodyweightsService();

          // Initialize Controller
          BodyweightsController = $controller('BodyweightsController as vm', {
            $scope: $scope,
            bodyweightResolve: mockBodyweight
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.bodyweightResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/bodyweights/create');
        }));

        it('should attach an Bodyweight to the controller scope', function () {
          expect($scope.vm.bodyweight._id).toBe(mockBodyweight._id);
          expect($scope.vm.bodyweight._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/bodyweights/client/views/form-bodyweight.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          BodyweightsController,
          mockBodyweight;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('bodyweights.edit');
          $templateCache.put('modules/bodyweights/client/views/form-bodyweight.client.view.html', '');

          // create mock Bodyweight
          mockBodyweight = new BodyweightsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Bodyweight Name'
          });

          // Initialize Controller
          BodyweightsController = $controller('BodyweightsController as vm', {
            $scope: $scope,
            bodyweightResolve: mockBodyweight
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:bodyweightId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.bodyweightResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            bodyweightId: 1
          })).toEqual('/bodyweights/1/edit');
        }));

        it('should attach an Bodyweight to the controller scope', function () {
          expect($scope.vm.bodyweight._id).toBe(mockBodyweight._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/bodyweights/client/views/form-bodyweight.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
