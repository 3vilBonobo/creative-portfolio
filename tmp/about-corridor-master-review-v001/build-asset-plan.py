from pathlib import Path
import json

root=Path(__file__).parent
profiles={'desktop':(1920,1080,650,48,180,450,150),
          'tablet':(1536,1280,500,40,150,350,120),
          'mobile':(1080,1296,400,32,120,300,96)}
assets=[]
for profile,(w,h,base,emission,spill,floor,wall) in profiles.items():
    definitions=[
        ('base','webp',w,h,False,'top center','required-after-geometry-approval',base,'Opaque architecture; selected controllable fixtures and their spill/reflections off; no portrait, text or digits'),
        ('portrait-aperture','svg',w,h,True,'top center','required-after-geometry-approval',None,'White visible inner portrait opening on transparent canvas; source image remains a separate HTML image'),
        ('light-01-emission','png',w,h,True,'top center','required-if-on-off-retained',emission,'Full-canvas straight-alpha emission; picture light and nearby cage lamp as one declared group'),
        ('light-01-spill','png',w,h,True,'top center','required-if-on-off-retained',spill,'Full-canvas surface illumination; preserve texture and reading contrast'),
        ('wall-continuation','webp',w,512,False,'documented continuation origin','conditional-required-for-long-layouts',wall,'Only quiet wall; vertical seamless repeat; no fixtures, panels, doors, floor or portrait'),
        ('floor-endcap','png',w,h,True,'bottom center','conditional-required-for-long-layouts',floor,'Full-profile alpha canvas, transparent above the authored lower foreground; foreground floor edge at actual section bottom'),
        ('top-retention','svg',w,h,True,'top center','conditional-required-for-long-layouts',None,'Artist-authored mask retaining the upper architecture while removing the near floor; contour must respect corridor perspective'),
        ('floor-light-spill','png',w,h,True,'bottom center','only-if-controlled-lights-change-floor-reflections',spill,'Optional floor illumination; follows bottom floor group, never the top wall light rectangle'),
    ]
    for role,fmt,width,height,alpha,anchor,condition,budget,purpose in definitions:
        row=dict(id=f'floor-03-about-corridor.{profile}.{role}',filename=f'floor-03-about-corridor-{role}-{profile}.{fmt}',
                 width=width,height=height,format=fmt,alpha=alpha,anchor=anchor,condition=condition,purpose=purpose,
                 alignmentGroup=f'floor-03-about-corridor-{profile}-v001'+('-floor' if anchor=='bottom center' else '-upper'))
        if budget: row['proposedMaxBytes']=budget*1024
        assets.append(row)
plan=dict(status='PROPOSED specification only; not commissioned or produced',floor='03',
          profiles={key:{'width':v[0],'height':v[1]} for key,v in profiles.items()},
          responsive='Desktop and landscape share wide art; portrait tablet has its own composition; phone has its own composition with copy below',
          lighting='Constant ambient; two near practicals may share one controllable group; ceiling/distant lights may remain fixed only if declared',
          note='Wall tile height 512 is the proposed export tile period. Accept it only after vertical seam and repetition proofs. Endcap uses a full profile canvas to avoid inventing an unmeasured cropped band height; optimize to a declared source rectangle later only after registration approval.',
          assets=assets,
          requiredGeometry=['portrait quad TL/TR/BR/BL in native pixels and normalized coordinates','source crop and crop policy for unchanged portrait',
                            'HTML 03 label box','quiet text and navigation rectangles','light source anchors',
                            'upper retention contour and continuation origin/period','floor plane anchor and blend boundaries'],
          productionRootProposal='public/environments/floor-03-about-corridor/v001/',
          stagingOnlyUntilApproved='art-production/staging/floor-03-about-corridor/v001/')
(root/'future-assets.json').write_text(json.dumps(plan,indent=2)+'\n')
print('Wrote proposed specifications for',len(assets),'exports, including conditional floor-reflection passes. No artwork produced.')
