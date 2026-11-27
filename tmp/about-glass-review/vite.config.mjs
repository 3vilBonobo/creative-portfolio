import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import {writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
export default defineConfig({plugins:[vue(),{name:'local-about-review-evidence',configureServer(server){server.middlewares.use('/__about-review-evidence',async(req,res)=>{try{if(req.method!=='POST'){res.statusCode=405;res.end();return;}let body='';for await(const c of req){body+=c;if(body.length>10000000)throw Error('Too large');}const {filename,data}=JSON.parse(body);if(!/^[a-z0-9-]+\.(jpg|json)$/.test(filename))throw Error('Invalid filename');const bytes=Buffer.from(data,'base64');if(filename.endsWith('.jpg')){if(bytes[0]!==255||bytes[1]!==216)throw Error('JPEG expected');}else JSON.parse(bytes.toString());await writeFile(resolve('tmp/about-glass-review',filename),bytes,{flag:'wx'});res.end('Saved '+filename);}catch(error){res.statusCode=400;res.end(String(error));}});}}]});
