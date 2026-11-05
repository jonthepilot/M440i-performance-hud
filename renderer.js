
'use strict';
const net=require('net'),fs=require('fs'),path=require('path');
const SOCK='/dev/shm/cluster-render/render.sock';
const W=292,H=112,ref=1;
function packet(type,body){const b=Buffer.alloc(5+body.length);b.writeUInt32LE(1+body.length,0);b[4]=type;body.copy(b,5);return b;}
function json(x){return packet(74,Buffer.from(JSON.stringify(x),'utf8'));}
function frame(pixels){const b=Buffer.alloc(14+pixels.length);b.writeUInt32LE(ref,0);b.writeUInt32LE(1,4);pixels.copy(b,14);return packet(70,b);}
let sock=null,stopped=false;
function connect(){if(stopped)return; sock=net.connect(SOCK);let buf=Buffer.alloc(0),sent=false;
 sock.on('connect',()=>{sock.write(json({op:'hello',app:'jonthepilot_hud',proto:1}));sock.write(json({op:'layer',ref:ref,target:'hud',kind:'image',class:'overlay',x:496,y:344,w:W,h:H,iw:W,ih:H,visible:1,contend:0,fps:1}));});
 sock.on('data',chunk=>{buf=Buffer.concat([buf,chunk]);while(buf.length>=5){let len=buf.readUInt32LE(0);if(len<1||len>8388608){sock.destroy();return;}if(buf.length<4+len)break;let type=buf[4],body=buf.slice(5,4+len);buf=buf.slice(4+len);if(type!==74)continue;let ev;try{ev=JSON.parse(body.toString('utf8'));}catch(e){continue;}if(ev.ev==='hello'&&!sent){sent=true;let p=fs.readFileSync(path.join(__dirname,'overlay.rgba'));if(p.length!==W*H*4)throw Error('bad RGBA');sock.write(frame(p));}if(ev.ev==='error')console.error('HUD error',ev.reason);if(ev.ev==='layer')console.log('HUD layer',ev.state,ev.reason||'');}});
 sock.on('error',e=>console.error('HUD socket',e.message));sock.on('close',()=>{sock=null;if(!stopped)setTimeout(connect,2000);});}
function start(){connect();}function stop(){stopped=true;if(sock)sock.destroy();}
module.exports={start,stop};
