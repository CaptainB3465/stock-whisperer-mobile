// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Fix for Windows symlink bug with @react-native-async-storage
// The package creates junction points that Metro's FallbackWatcher can't handle
config.watchFolders = [];
config.resolver.blockList = [
  // Block the broken Windows junction paths inside async-storage native dirs
  /node_modules[/\\]@react-native-async-storage[/\\]async-storage[/\\](android|apple)[/\\]src[/\\]\?/,
];

module.exports = config;
