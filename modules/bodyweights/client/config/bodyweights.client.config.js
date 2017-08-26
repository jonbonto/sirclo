(function () {
  'use strict';
  

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Bodyweights',
      state: 'bodyweights',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'bodyweights', {
      title: 'List Bodyweights',
      state: 'bodyweights.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'bodyweights', {
      title: 'Create Bodyweight',
      state: 'bodyweights.create',
      roles: ['user']
    });
  }
  menuConfig.$inject = ['Menus'];
  angular
    .module('bodyweights')
    .run(menuConfig);

 
}());
