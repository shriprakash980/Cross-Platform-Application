const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Support three.js and GLTF asset extensions if needed
config.resolver.assetExts.push('glb', 'gltf', 'png', 'jpg');

module.exports = config;
