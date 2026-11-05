
'use strict';
const OnlineApp=require('oap-sdk/src/core/OnlineApp.js');
const hud=require('./renderer.js');
class HUDApp extends OnlineApp{constructor(){super();this.on('initialized',()=>{try{hud.start();}catch(e){console.error('HUD start',e.message);}this.initialized();});this.on('shutdown',()=>hud.stop());}}
module.exports=new HUDApp();
