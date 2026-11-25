import json, struct, zlib, hashlib
from pathlib import Path

root=Path('art-production/staging/floor-02-projects/v003')
manifest=json.loads((root/'manifest.json').read_text())
results=[]
for asset in manifest['assets']:
    asset['path']='production/public/environments/floor-02-projects/'+asset['filename']; asset['id']=asset['filename']; asset['width'],asset['height']=asset['dimensions']; asset['alignmentGroup']='NOT DECLARED'; data=(root/asset['path']).read_bytes()
    row={'id':asset['id'],'checksum':hashlib.sha256(data).hexdigest()==asset['sha256'],
         'bytes':len(data),'budgetPass':len(data)<=asset['maxBytes'] if 'maxBytes' in asset else None,'alignmentGroup':asset['alignmentGroup']}
    if data[:8]==b'\x89PNG\r\n\x1a\n':
        pos=8; packed=b''; crc_ok=True
        while pos<len(data):
            n=struct.unpack('>I',data[pos:pos+4])[0]; kind=data[pos+4:pos+8]; chunk=data[pos+8:pos+8+n]
            crc_ok &= zlib.crc32(kind+chunk)==struct.unpack('>I',data[pos+8+n:pos+12+n])[0]
            if kind==b'IHDR': w,h,depth,color,_,_,interlace=struct.unpack('>IIBBBBB',chunk)
            if kind==b'IDAT': packed+=chunk
            pos+=n+12
        assert depth==8 and color==6 and interlace==0
        raw=zlib.decompress(packed); stride=w*4; prev=bytearray(stride); alphas=[]; nonzero=[]; rgb_above_alpha=0
        for y in range(h):
            f=raw[y*(stride+1)]; line=bytearray(raw[y*(stride+1)+1:(y+1)*(stride+1)])
            for x in range(stride):
                a=line[x-4] if x>=4 else 0; b=prev[x]; c=prev[x-4] if x>=4 else 0
                if f==1: v=a
                elif f==2: v=b
                elif f==3: v=(a+b)//2
                elif f==4:
                    p=a+b-c; ds=[abs(p-a),abs(p-b),abs(p-c)]; v=[a,b,c][ds.index(min(ds))]
                else: v=0
                line[x]=(line[x]+v)&255
            for x in range(w):
                a=line[x*4+3]; alphas.append(a)
                if a: nonzero.append((x,y)); rgb_above_alpha+=int(max(line[x*4:x*4+3])>a)
            prev=line
        row.update(width=w,height=h,format='png',rgba=True,crcPass=crc_ok,alphaMin=min(alphas),alphaMax=max(alphas),
                   transparentPixels=alphas.count(0),nontransparentPixels=len(nonzero),rgbAboveAlpha=rgb_above_alpha,
                   alphaBBox=[min(x for x,y in nonzero),min(y for x,y in nonzero),max(x for x,y in nonzero),max(y for x,y in nonzero)])
    else:
        assert data[:4]==b'RIFF' and data[8:12]==b'WEBP'
        pos=12; alpha=False
        while pos<len(data):
            kind=data[pos:pos+4]; n=int.from_bytes(data[pos+4:pos+8],'little'); chunk=data[pos+8:pos+8+n]
            if kind==b'VP8X': w=1+int.from_bytes(chunk[4:7],'little'); h=1+int.from_bytes(chunk[7:10],'little'); alpha=bool(chunk[0]&16)
            if kind==b'VP8 ': w,h=struct.unpack('<HH',chunk[6:10]); w&=16383; h&=16383
            if kind==b'ALPH': alpha=True
            pos+=8+n+(n%2)
        row.update(width=w,height=h,format='webp',alpha=alpha)
    row['dimensionsPass']=(row['width'],row['height'])==(asset['width'],asset['height'])
    results.append(row)
Path('tmp/floor02-v003-proof/asset-validation.json').write_text(json.dumps(results,indent=2))
print(json.dumps(results,indent=2))


