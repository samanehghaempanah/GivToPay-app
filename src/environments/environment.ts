// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'https://mvpapi.giv2pay.com/api/',
  payUrl: 'https://mvppay.giv2pay.com/api/',
  fileUrl: 'https://mvpfile.giv2pay.com/',
  chatApiUrl: 'https://mvpchat.giv2pay.com/api/Conversation/',
  chatHubUrl: 'https://mvpchat.giv2pay.com/chatHub'
  // apiUrl: 'https://localhost:7125/api/',
  // payUrl: 'https://mvppay.giv2pay.com/api/',
  // fileUrl: 'https://localhost:7065/',
  // chatApiUrl: 'https://localhost:7082/api/Conversation/', 
  // chatHubUrl: 'https://localhost:7082/chatHub'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
