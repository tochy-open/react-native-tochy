# adrop-ads-react-native

Adrop Ads SDK for react-native


Prerequisites
-------------
- Android
    - Android Studio 3.2 or higher
    - kotlin 1.7.10 or higher
    - gradle 8.0 or higher
    - minSdkVersion 24
    - compileSdkVersion 33
- iOS
    - Latest version of Xcode with enabled command-line tools
    - Swift 5.0
    - ios 14.0

Getting Started
---------------

Before you can display ads in your app, you'll need to create an [Adrop](https://adrop.io) account.


### 1. Installation

```sh
npm install adrop-ads-react-native
```

### 2. Add adrop_service.json

Get ***adrop_service.json*** from [Adrop](https://adrop.io), add to android/ios
(Use different ***adrop_service.json*** files for each platform.)

#### Android
> android/app/src/main/assets/adrop_service.json

#### iOS

Add "adrop-service.json" to the Runner of your Xcode project
> ios/{your project}/adrop_service.json

add this your ios Podfile

```
config.build_settings['BUILD_LIBRARY_FOR_DISTRIBUTION'] = 'YES'
```

### 3. Initialize
```js
import { AdropAds } from 'adrop-ads-react-native';

// ...

let production = false; // TODO set true for production mode
AdropAds.initialize(production);
```

### 4. Load Ads

```js
const YourComponent: React.FC = () => {

    const [adropController, setAdropController] = useState(null)

    const onAdBannerCreated = (controller) => {
        setAdropController(adropController)
    }

    const load = () => {
        adropController?.load()
    }

    return (
        <View>
            <Button title={'Request Ad!'} onPress={load} />
            <View style={{ width: '100%', height: 50 }}>
                <AdropBanner
                    unitId={unitId}
                    style={{
                        width: Dimensions.get('window').width,
                        height: 80,
                    }}
                    onCreated={onAdBannerCreated}
                    onAdClicked={() => console.log("ad clicked")}
                    onAdReceived={() => console.log("ad received")}
                    onAdFailedToReceive={(error) => console.log("ad failed to receive, ", error)}
                />

            </View>
        </View>
    )
}

```

## Example

```sh
git clone https://github.com/OpenRhapsody/adrop-ads-react-native.git
cd adrop-ads-react-native
npm i
```

To run example on iOS
```sh
cd example/ios && pod install && cd ..
npm run example ios
```

To run example on Android
```sh
npm run example android
```
