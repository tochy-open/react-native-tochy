import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'adrop-ads-react-native' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const AdropAds = NativeModules.AdropAds
  ? NativeModules.AdropAds
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function multiply(a: number, b: number): Promise<number> {
  return AdropAds.multiply(a, b);
}

export function initialize(production: boolean): Promise<void> {
  return AdropAds.initialize(production);
}
