"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Copy, Check, Smartphone, Code, FileJson, Layers, 
  ExternalLink, Home, Heart, Users, Settings, Download,
  Terminal, Shield, Globe, Zap
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const configSchema = z.object({
  appName: z.string().min(1, "App name is required"),
  appId: z.string().min(1, "App ID is required"),
  firebaseApiKey: z.string().min(1, "Firebase API Key is required"),
  firebaseProjectId: z.string().min(1, "Firebase Project ID is required"),
  firebaseAppId: z.string().min(1, "Firebase App ID is required"),
  admobAppId: z.string().min(1, "AdMob App ID is required"),
  admobBannerId: z.string().min(1, "AdMob Banner ID is required"),
  admobOpenId: z.string().min(1, "AdMob App Open ID is required"),
  admobRewardId: z.string().min(1, "AdMob Reward ID is required"),
});

type ConfigValues = z.infer<typeof configSchema>;

const defaultValues: ConfigValues = {
  appName: "Translate Pro",
  appId: "app.translatepro.apk",
  firebaseApiKey: "AIzaSyDEZ_25K7WE4cNU5zJkkIGT2js5mD7DlTQ",
  firebaseProjectId: "translatepro-c92d1",
  firebaseAppId: "1:867466712941:android:3481e2daefbf5267d06c64",
  admobAppId: "ca-app-pub-5933036473279674~5199182592",
  admobBannerId: "ca-app-pub-5933036473279674/1650344462",
  admobOpenId: "ca-app-pub-5933036473279674/4092674970",
  admobRewardId: "ca-app-pub-5933036473279674/8861931713",
};

export default function Page() {
  const [activeTab, setActiveTab] = useState<'code' | 'preview' | 'settings'>('code');
  const [previewTab, setPreviewTab] = useState<'home' | 'donate' | 'team'>('home');
  const [copied, setCopied] = useState(false);

  const { register, watch, formState: { errors } } = useForm<ConfigValues>({
    resolver: zodResolver(configSchema),
    defaultValues,
  });

  const config = watch();

  const files = useMemo(() => [
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
  apiKey: "${config.firebaseApiKey}",
  authDomain: "${config.firebaseProjectId}.firebaseapp.com",
  projectId: "${config.firebaseProjectId}",
  storageBucket: "${config.firebaseProjectId}.firebasestorage.app",
  messagingSenderId: "${config.firebaseAppId.split(':')[1]}",
  appId: "${config.firebaseAppId}",
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

        // 1. Show Banner Ad immediately
        const bannerOptions: BannerAdOptions = {
          adId: '${config.admobBannerId}',
          adSize: BannerAdSize.BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 50,
          isTesting: false
        };
        AdMob.showBanner(bannerOptions).catch(console.error);

        // 2. Load App Open Ad
        const openAdOptions: AdOptions = {
          adId: '${config.admobOpenId}',
          isTesting: false
        };
        AdMob.prepareAppOpen(openAdOptions)
          .then(() => AdMob.showAppOpen())
          .catch(console.error);

        // 3. Preload Reward Ad
        preloadRewardAd();

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
          adId: '${config.admobRewardId}',
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

    const intervalId = setInterval(async () => {
      if (isRewardReady.current) {
        try {
          await AdMob.showRewardVideoAd();
          isRewardReady.current = false;
        } catch (error) {
          console.error('Failed to show reward ad:', error);
        }
      } else {
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
    android:value="${config.admobAppId}"/>
<meta-data android:name="android.requestLegacyExternalStorage" android:value="true" />`
    },
    {
      name: 'capacitor.config.ts',
      icon: <FileJson className="w-4 h-4" />,
      language: 'typescript',
      content: `import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: '${config.appId}',
  appName: '${config.appName}',
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
      name: 'capacitor.config.json',
      icon: <FileJson className="w-4 h-4" />,
      language: 'json',
      content: `{
  "appId": "${config.appId}",
  "appName": "${config.appName}",
  "webDir": "dist",
  "bundledWebRuntime": false,
  "plugins": {
    "PushNotifications": {
      "presentationOptions": ["badge", "sound", "alert"]
    }
  }
}`
    },
    {
      name: 'android/app/google-services.json',
      icon: <FileJson className="w-4 h-4" />,
      language: 'json',
      content: `{
  "project_info": {
    "project_number": "${config.firebaseAppId.split(':')[1]}",
    "project_id": "${config.firebaseProjectId}",
    "storage_bucket": "${config.firebaseProjectId}.firebasestorage.app"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "${config.firebaseAppId}",
        "android_client_info": {
          "package_name": "${config.appId}"
        }
      },
      "oauth_client": [],
      "api_key": [
        {
          "current_key": "${config.firebaseApiKey}"
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
    }
  ], [config]);

  const [activeFile, setActiveFile] = useState(files[0]);

  const handleCopy = (content: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 flex flex-col font-sans selection:bg-indigo-500/30">
      <header className="border-b border-white/5 bg-zinc-900/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Translate Pro <span className="text-xs font-medium bg-white/10 px-2 py-0.5 rounded-full text-zinc-400">Builder</span>
              </h1>
              <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-widest">Ionic + Capacitor + AdMob</p>
            </div>
          </div>
          
          <nav className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            {[
              { id: 'settings', label: 'Configuration', icon: Settings },
              { id: 'code', label: 'Source Files', icon: Code },
              { id: 'preview', label: 'Live Preview', icon: Smartphone },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-10">
        <AnimatePresence mode="wait">
          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-10"
            >
              <div className="lg:col-span-2 space-y-8">
                <section className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                      <Globe className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">App Identity</h2>
                      <p className="text-sm text-zinc-500">Define your application metadata</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">App Name</label>
                      <input {...register('appName')} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Package ID</label>
                      <input {...register('appId')} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors" />
                    </div>
                  </div>
                </section>

                <section className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                      <Shield className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Firebase & AdMob</h2>
                      <p className="text-sm text-zinc-500">Connect your backend and ad services</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Firebase API Key</label>
                      <input {...register('firebaseApiKey')} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Firebase Project ID</label>
                      <input {...register('firebaseProjectId')} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Firebase App ID</label>
                      <input {...register('firebaseAppId')} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">AdMob App ID</label>
                      <input {...register('admobAppId')} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Banner Ad ID</label>
                      <input {...register('admobBannerId')} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors" />
                    </div>
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-500/20">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Ready to Build?
                  </h3>
                  <p className="text-indigo-100 text-sm leading-relaxed mb-6">
                    Your configuration is automatically applied to all source files. Switch to the &quot;Source Files&quot; tab to copy your customized code.
                  </p>
                  <button 
                    onClick={() => setActiveTab('code')}
                    className="w-full bg-white text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                  >
                    View Source Code
                    <Code className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Quick Tips</h4>
                  <ul className="space-y-4">
                    {[
                      { icon: Terminal, text: "Use 'npx cap add android' to initialize the platform." },
                      { icon: Download, text: "Download google-services.json from Firebase Console." },
                      { icon: Smartphone, text: "Test on a real device for AdMob functionality." },
                    ].map((tip, i) => (
                      <li key={i} className="flex gap-3 text-xs text-zinc-400 leading-relaxed">
                        <tip.icon className="w-4 h-4 text-zinc-600 shrink-0" />
                        {tip.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'code' && (
            <motion.div
              key="code"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-full min-h-[600px]"
            >
              <div className="lg:col-span-1 flex flex-col gap-3">
                <h2 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-2 px-2">Project Structure</h2>
                {files.map((file) => (
                  <button
                    key={file.name}
                    onClick={() => setActiveFile(file)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm text-left transition-all border ${activeFile.name === file.name ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 shadow-lg shadow-indigo-500/5' : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300 border-transparent'}`}
                  >
                    {file.icon}
                    <span className="truncate font-medium">{file.name}</span>
                  </button>
                ))}
              </div>

              <div className="lg:col-span-3 flex flex-col bg-[#0d1117] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-zinc-900/40 backdrop-blur-md">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/40 border border-red-500/20"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/40 border border-yellow-500/20"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/40 border border-green-500/20"></div>
                    </div>
                    <span className="text-xs font-mono text-zinc-500">{activeFile.name}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(activeFile.content)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-all border border-white/10"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                  </button>
                </div>
                <div className="flex-1 overflow-auto p-8 custom-scrollbar">
                  <pre className="text-[13px] font-mono text-zinc-300 leading-relaxed whitespace-pre">
                    <code>{activeFile.content}</code>
                  </pre>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center h-full min-h-[800px]"
            >
              <div className="mb-8 flex items-center gap-3 px-6 py-3 bg-white/5 rounded-full border border-white/10 text-zinc-400 text-xs font-medium">
                <Globe className="w-4 h-4 text-indigo-400" />
                <span>Live Previewing: <span className="text-white">{previewTab === 'home' ? 'translate-pro.base44.app' : previewTab === 'donate' ? 'trakteer.id/FansArt' : 'translate-pro.base44.app/TeamProject'}</span></span>
                <ExternalLink className="w-3 h-3 ml-2 opacity-50" />
              </div>
              
              <div className="relative w-[380px] h-[820px] bg-zinc-900 rounded-[4rem] p-4 shadow-[0_0_100px_rgba(99,102,241,0.1)] border-[12px] border-zinc-800/80">
                {/* iPhone Notch */}
                <div className="absolute top-0 inset-x-0 h-8 bg-zinc-900 z-30 rounded-b-[2rem] w-44 mx-auto border-x border-b border-white/5"></div>
                
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden flex flex-col relative">
                  <div className="flex-1 bg-white relative">
                    <iframe 
                      src={previewTab === 'home' ? 'https://translate-pro.base44.app/' : previewTab === 'donate' ? 'https://trakteer.id/FansArt' : 'https://translate-pro.base44.app/TeamProject'} 
                      className="w-full h-full border-none"
                      title="App Preview"
                    />
                  </div>
                  
                  {/* Mock AdMob Banner */}
                  <div className="h-[50px] bg-zinc-50 border-t border-zinc-200 flex items-center justify-center relative z-10">
                    <div className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase">AdMob Banner Ad</div>
                    <div className="absolute top-1 right-2 bg-indigo-500 text-white text-[7px] px-1.5 py-0.5 rounded font-bold">AD</div>
                  </div>

                  {/* Mock Bottom Navigation */}
                  <div className="h-[70px] bg-white border-t border-zinc-100 flex items-center justify-around pb-4 z-10 px-4">
                    {[
                      { id: 'home', label: 'Home', icon: Home },
                      { id: 'donate', label: 'Donate', icon: Heart },
                      { id: 'team', label: 'Team', icon: Users },
                    ].map((item) => (
                      <button 
                        key={item.id}
                        onClick={() => setPreviewTab(item.id as any)}
                        className={`flex flex-col items-center justify-center w-full h-full transition-colors ${previewTab === item.id ? 'text-indigo-600' : 'text-zinc-400 hover:text-zinc-600'}`}
                      >
                        <item.icon className="w-5 h-5 mb-1" strokeWidth={previewTab === item.id ? 2.5 : 2} />
                        <span className="text-[10px] font-bold">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Home Indicator */}
                <div className="absolute bottom-6 inset-x-0 h-1.5 bg-zinc-800 w-32 mx-auto rounded-full z-30 opacity-50"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-white/5 bg-zinc-900/20 p-8 mt-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-zinc-500 text-sm">
            <Zap className="w-4 h-4" />
            <span>Powered by Translate Pro Builder Engine</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-zinc-500 hover:text-white transition-colors text-sm font-medium">Documentation</a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors text-sm font-medium">Support</a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors text-sm font-medium">Privacy</a>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
