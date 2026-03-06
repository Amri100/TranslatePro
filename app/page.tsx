"use client";

import React, { useState } from 'react';
import { Copy, Check, Smartphone, Code, FileJson, Layers, ExternalLink, Home, Heart, Users } from 'lucide-react';

const files = [
  {
    name: 'src/App.tsx',
    icon: <Code className="w-4 h-4" />,
    language: 'tsx',
    content: `import React, { useEffect, useRef } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { homeOutline, heartOutline, peopleOutline } from 'ionicons/icons';
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, AdOptions, RewardAdOptions } from '@capacitor-community/admob';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

setupIonicReact();

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEZ_25K7WE4cNU5zJkkIGT2js5mD7DlTQ",
  authDomain: "translatepro-c92d1.firebaseapp.com",
  projectId: "translatepro-c92d1",
  storageBucket: "translatepro-c92d1.firebasestorage.app",
  messagingSenderId: "867466712941",
  appId: "1:867466712941:android:3481e2daefbf5267d06c64",
  measurementId: "YOUR_MEASUREMENT_ID" // Optional
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Reusable Webview Component
const WebviewPage: React.FC<{ url: string, title: string }> = ({ url, title }) => (
  <iframe 
    src={url} 
    style={{ width: '100%', height: '100%', border: 'none' }}
    title={title}
    allow="camera; microphone; fullscreen; display-capture; geolocation"
  />
);

const App: React.FC = () => {
  const isRewardReady = useRef(false);

  useEffect(() => {
    let isAdMobInitialized = false;

    const initAdMob = async () => {
      try {
        await AdMob.initialize({
          requestTrackingAuthorization: true,
          initializeForTesting: false,
        });
        isAdMobInitialized = true;

        // 1. Show Banner Ad immediately (non-intrusive)
        const bannerOptions: BannerAdOptions = {
          adId: 'ca-app-pub-5933036473279674/1650344462',
          adSize: BannerAdSize.BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 50, // Margin to avoid overlapping with bottom tabs
          isTesting: false
        };
        AdMob.showBanner(bannerOptions).catch(console.error);

        // 2. Load App Open Ad in background, then show
        const openAdOptions: AdOptions = {
          adId: 'ca-app-pub-5933036473279674/4092674970',
          isTesting: false
        };
        AdMob.prepareAppOpen(openAdOptions)
          .then(() => AdMob.showAppOpen())
          .catch(console.error);

        // 3. Preload the first Reward Ad
        preloadRewardAd();

        // 4. Listen for Reward Ad close to preload the next one
        AdMob.addListener('rewardedVideoAdDismissed', () => {
          isRewardReady.current = false;
          preloadRewardAd();
        });

      } catch (error) {
        console.error('AdMob Initialization failed:', error);
      }
    };

    const preloadRewardAd = async () => {
      try {
        const rewardOptions: RewardAdOptions = {
          adId: 'ca-app-pub-5933036473279674/8861931713',
          isTesting: false
        };
        await AdMob.prepareRewardVideoAd(rewardOptions);
        isRewardReady.current = true;
      } catch (error) {
        console.error('Failed to preload reward ad:', error);
        isRewardReady.current = false;
      }
    };

    initAdMob();

    // Set up an interval to show reward ads every 1 minute (60000 ms)
    const intervalId = setInterval(async () => {
      if (isRewardReady.current) {
        try {
          await AdMob.showRewardVideoAd();
          isRewardReady.current = false; // Reset state after showing
        } catch (error) {
          console.error('Failed to show reward ad:', error);
        }
      } else {
        // Try to preload again if it wasn't ready
        preloadRewardAd();
      }
    }, 60000);

    return () => {
      clearInterval(intervalId);
      if (isAdMobInitialized) {
        AdMob.removeBanner();
        AdMob.removeAllListeners();
      }
    };
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/home">
              <WebviewPage url="https://translate-pro.base44.app/" title="Home" />
            </Route>
            <Route exact path="/donate">
              <WebviewPage url="https://trakteer.id/FansArt" title="Donate" />
            </Route>
            <Route exact path="/team">
              <WebviewPage url="https://translate-pro.base44.app/TeamProject" title="Team" />
            </Route>
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <IonIcon icon={homeOutline} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
            <IonTabButton tab="donate" href="/donate">
              <IonIcon icon={heartOutline} />
              <IonLabel>Donate</IonLabel>
            </IonTabButton>
            <IonTabButton tab="team" href="/team">
              <IonIcon icon={peopleOutline} />
              <IonLabel>Team</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;`
  },
  {
    name: 'android/app/src/main/AndroidManifest.xml',
    icon: <Layers className="w-4 h-4" />,
    language: 'xml',
    content: `<!-- Add these permissions inside <manifest> but outside <application> -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="29" />
<uses-permission android:name="android.permission.MANAGE_EXTERNAL_STORAGE" />

<!-- Add this inside your <application> tag in AndroidManifest.xml -->
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-5933036473279674~5199182592"/>
<meta-data android:name="android.requestLegacyExternalStorage" android:value="true" />`
  },
  {
    name: 'capacitor.config.ts',
    icon: <FileJson className="w-4 h-4" />,
    language: 'typescript',
    content: `import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.translatepro.apk',
  appName: 'Translate Pro',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;`
  },
  {
    name: 'android/app/google-services.json',
    icon: <FileJson className="w-4 h-4" />,
    language: 'json',
    content: `{
  "project_info": {
    "project_number": "867466712941",
    "project_id": "translatepro-c92d1",
    "storage_bucket": "translatepro-c92d1.firebasestorage.app"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "1:867466712941:android:3481e2daefbf5267d06c64",
        "android_client_info": {
          "package_name": "app.translatepro.apk"
        }
      },
      "oauth_client": [],
      "api_key": [
        {
          "current_key": "AIzaSyDEZ_25K7WE4cNU5zJkkIGT2js5mD7DlTQ"
        }
      ],
      "services": {
        "appinvite_service": {
          "other_platform_oauth_client": []
        }
      }
    }
  ],
  "configuration_version": "1"
}`
  },
  {
    name: 'android/build.gradle.kts',
    icon: <Code className="w-4 h-4" />,
    language: 'kotlin',
    content: `// Root-level (project-level) Gradle file (<project>/build.gradle.kts)
plugins {
  // ... existing plugins ...

  // Add the dependency for the Google services Gradle plugin
  id("com.google.gms.google-services") version "4.4.4" apply false
}`
  },
  {
    name: 'android/app/build.gradle.kts',
    icon: <Code className="w-4 h-4" />,
    language: 'kotlin',
    content: `// Module (app-level) Gradle file (<project>/<app-module>/build.gradle.kts)
plugins {
  id("com.android.application")

  // Add the Google services Gradle plugin
  id("com.google.gms.google-services")

  // ... existing plugins ...
}

dependencies {
  // ... existing dependencies ...

  // Import the Firebase BoM
  implementation(platform("com.google.firebase:firebase-bom:34.10.0"))

  // Add the dependencies for Firebase products you want to use
  // When using the BoM, don't specify versions in Firebase dependencies
  implementation("com.google.firebase:firebase-analytics")
}`
  },
  {
    name: 'package.json (Dependencies)',
    icon: <FileJson className="w-4 h-4" />,
    language: 'json',
    content: `{
  "dependencies": {
    "@capacitor/android": "^6.0.0",
    "@capacitor/app": "^6.0.0",
    "@capacitor/core": "^6.0.0",
    "@capacitor/ios": "^6.0.0",
    "@capacitor-community/admob": "^6.0.0",
    "@ionic/react": "^8.0.0",
    "@ionic/react-router": "^8.0.0",
    "firebase": "^10.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router": "^5.3.4",
    "react-router-dom": "^5.3.4"
  }
}`
  }
];

export default function Page() {
  const [activeTab, setActiveTab] = useState('code');
  const [activeFile, setActiveFile] = useState(files[0]);
  const [previewTab, setPreviewTab] = useState('home');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col font-sans">
      <header className="border-b border-zinc-800 bg-zinc-900/50 p-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">Translate Pro App Builder</h1>
            <p className="text-sm text-zinc-400 mt-1">Ionic + Capacitor + AdMob + Firebase Integration</p>
          </div>
          <div className="flex bg-zinc-800/50 p-1 rounded-lg border border-zinc-700/50">
            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${activeTab === 'code' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <Code className="w-4 h-4 mr-2" />
              Source Code
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${activeTab === 'preview' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <Smartphone className="w-4 h-4 mr-2" />
              App Preview
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto p-6">
        {activeTab === 'code' ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full min-h-[600px]">
            <div className="col-span-1 flex flex-col gap-2">
              <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Project Files</h2>
              {files.map((file) => (
                <button
                  key={file.name}
                  onClick={() => setActiveFile(file)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${activeFile.name === file.name ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent'}`}
                >
                  {file.icon}
                  <span className="truncate">{file.name}</span>
                </button>
              ))}
              
              <div className="mt-auto p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                <h3 className="text-sm font-medium text-white mb-2">Instructions</h3>
                <ol className="text-xs text-zinc-400 space-y-2 list-decimal list-inside">
                  <li>Create a new Ionic React project.</li>
                  <li>Install the dependencies listed in package.json.</li>
                  <li>Copy these files into your project.</li>
                  <li>Run <code className="bg-zinc-800 px-1 py-0.5 rounded text-zinc-300">npx cap sync</code>.</li>
                  <li>Build and deploy to Android/iOS.</li>
                </ol>
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-3 flex flex-col bg-[#0d1117] border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/80">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                  </div>
                  <span className="ml-2 text-xs font-mono text-zinc-400">{activeFile.name}</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <pre className="text-sm font-mono text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  <code>{activeFile.content}</code>
                </pre>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[700px]">
            <div className="mb-6 flex items-center gap-2 text-zinc-400 text-sm">
              <ExternalLink className="w-4 h-4" />
              <span>Previewing: <a href={previewTab === 'home' ? 'https://translate-pro.base44.app/' : previewTab === 'donate' ? 'https://trakteer.id/FansArt' : 'https://translate-pro.base44.app/TeamProject'} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
                {previewTab === 'home' ? 'translate-pro.base44.app' : previewTab === 'donate' ? 'trakteer.id/FansArt' : 'translate-pro.base44.app/TeamProject'}
              </a></span>
            </div>
            <div className="relative w-[375px] h-[812px] bg-black rounded-[3rem] border-[8px] border-zinc-800 shadow-2xl overflow-hidden flex flex-col">
              {/* Notch */}
              <div className="absolute top-0 inset-x-0 h-6 bg-black z-20 rounded-b-3xl w-40 mx-auto"></div>
              
              {/* App Content */}
              <div className="flex-1 bg-white relative mt-6">
                <iframe 
                  src={previewTab === 'home' ? 'https://translate-pro.base44.app/' : previewTab === 'donate' ? 'https://trakteer.id/FansArt' : 'https://translate-pro.base44.app/TeamProject'} 
                  className="w-full h-full border-none"
                  title="Translate Pro Preview"
                />
              </div>
              
              {/* Mock AdMob Banner */}
              <div className="h-[50px] bg-zinc-100 border-t border-zinc-200 flex items-center justify-center relative z-10">
                <div className="text-[10px] text-zinc-400 font-medium tracking-wider uppercase">AdMob Banner Ad</div>
                <div className="absolute top-1 right-1 bg-blue-500 text-white text-[8px] px-1 rounded-sm">Ad</div>
              </div>

              {/* Mock Bottom Navigation */}
              <div className="h-[60px] bg-white border-t border-zinc-200 flex items-center justify-around pb-2 z-10">
                <button 
                  onClick={() => setPreviewTab('home')}
                  className={`flex flex-col items-center justify-center w-full h-full ${previewTab === 'home' ? 'text-indigo-600' : 'text-zinc-500'}`}
                >
                  <Home className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-medium">Home</span>
                </button>
                <button 
                  onClick={() => setPreviewTab('donate')}
                  className={`flex flex-col items-center justify-center w-full h-full ${previewTab === 'donate' ? 'text-indigo-600' : 'text-zinc-500'}`}
                >
                  <Heart className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-medium">Donate</span>
                </button>
                <button 
                  onClick={() => setPreviewTab('team')}
                  className={`flex flex-col items-center justify-center w-full h-full ${previewTab === 'team' ? 'text-indigo-600' : 'text-zinc-500'}`}
                >
                  <Users className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-medium">Team</span>
                </button>
              </div>
              
              {/* Home Indicator */}
              <div className="absolute bottom-1 inset-x-0 h-1 bg-zinc-800 w-1/3 mx-auto rounded-full z-20"></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
