# Android App Export Guide

Your project is now successfully configured with Capacitor! All your React code has been compiled and synced into a native Android project folder (`android/`).

Here is a guide on how you can get your app out of the project and onto your phone or the Google Play Store.

## 1. Open Android Studio
You need Android Studio installed on your Mac to compile the final `.apk` or `.aab` (Android App Bundle) file.

To open your new Android project, simply run this command in your terminal:
```bash
npx cap open android
```
*This will automatically launch Android Studio and load your Android project.*

## 2. Syncing Future Updates
Whenever you make changes to your React application (like updating a component in `src/pages`), you need to update the Android app. Run these two commands:
```bash
npm run build
npx cap sync
```
This builds your web app and synchronizes the new files over to the `android/` directory so Android Studio has the latest version.

## 3. Building for Google Play Store
Once inside Android Studio:

> [!TIP]
> Google Play Store requires an **Android App Bundle (.aab)** format for new app submissions, rather than the older `.apk` format.

1. In the top menu of Android Studio, click on **Build**.
2. Select **Generate Signed Bundle / APK...**
3. Choose **Android App Bundle** and click **Next**.
4. You will need to provide a **Keystore**. If you don't have one, click **Create new...**, fill out your developer details, and save the `.jks` file securely. 
   > [!CAUTION]
   > Do NOT lose this Keystore file or its password! You need it to publish future updates to your app on the Play Store.
5. Select the `release` build variant and click **Finish**.

Android Studio will generate an `.aab` file which you can upload directly to the Google Play Console!

## 4. Testing on your phone
To run the app directly on your Android device:
1. Enable **Developer Options** and **USB Debugging** on your Android phone.
2. Plug your phone into your Mac via USB.
3. In Android Studio, select your device from the dropdown menu at the top.
4. Click the green **Run** button (Play icon).
