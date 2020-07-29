
# react-native-aliplayer

## Getting started

`$ npm install react-native-aliplayer --save`

### Mostly automatic installation

`$ react-native link react-native-aliplayer`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-aliplayer` and add `RNAliplayer.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNAliplayer.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNAliplayerPackage;` to the imports at the top of the file
  - Add `new RNAliplayerPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-aliplayer'
  	project(':react-native-aliplayer').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-aliplayer/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-aliplayer')
  	```

#### Windows
[Read it! :D](https://github.com/ReactWindows/react-native)

1. In Visual Studio add the `RNAliplayer.sln` in `node_modules/react-native-aliplayer/windows/RNAliplayer.sln` folder to their solution, reference from their app.
2. Open up your `MainPage.cs` app
  - Add `using Aliplayer.RNAliplayer;` to the usings at the top of the file
  - Add `new RNAliplayerPackage()` to the `List<IReactPackage>` returned by the `Packages` method


## Usage
```javascript
import RNAliplayer from 'react-native-aliplayer';

// TODO: What to do with the module?
RNAliplayer;
```
  