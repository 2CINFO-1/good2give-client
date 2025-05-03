import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-module-placeholder',
  template: `
    <div class="container mx-auto p-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-4">
          {{ moduleName }} Module
        </h1>
        <p class="text-gray-600 mb-4">This module is under construction.</p>
        <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
          <p class="text-blue-700">
            <span class="font-bold">Development Note:</span>
            This is a placeholder for the {{ moduleName }} module that's
            currently being loaded.
          </p>
        </div>
        <button
          routerLink="/dashboard"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  `,
})
export class ModulePlaceholderComponent implements OnInit {
  moduleName: string = 'Current';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Extract module name from the URL
    const urlPath = window.location.pathname;
    const pathSegments = urlPath.split('/');

    // Find the module name in the URL (should be after /dashboard/)
    if (pathSegments.length > 2 && pathSegments[1] === 'dashboard') {
      this.moduleName =
        pathSegments[2].charAt(0).toUpperCase() + pathSegments[2].slice(1);
    }

    console.log(
      `ModulePlaceholderComponent loaded for module: ${this.moduleName}`
    );
  }
}
