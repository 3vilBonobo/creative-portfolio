import {readFileSync,writeFileSync} from 'node:fs';
const file='src/sections/AboutSection.vue';
let s=readFileSync(file,'utf8');
const start=s.indexOf('    <div class="about__layout">');
const end=s.indexOf('\n</template>',start);
if(start<0||end<0)throw Error('About template boundaries missing');
s=s.slice(0,start)+`    <div class="about__layout">
      <div class="about__reading-surface">
        <header class="about__identity">
          <div class="about__title-line"><p class="eyebrow">{{ aboutContent.eyebrow }}</p><h2 id="about-title" class="about__heading">{{ aboutContent.title }}</h2></div>
          <p class="about__name">{{ aboutProfile.name }}</p>
          <p class="about__role">{{ aboutProfile.role }}</p>
        </header>
        <p class="about__statement">{{ aboutContent.introduction }}</p>
        <div class="about__introduction"><p v-for="paragraph in aboutContent.introductionParagraphs" :key="paragraph">{{ paragraph }}</p></div>
        <div class="about__secondary">
          <div class="about__tabs" role="tablist" aria-label="More about Irinella">
            <button v-for="(tab, index) in tabs" :id="\`about-tab-\${tab.id}\`" :key="tab.id" :ref="(el) => { if (el) tabButtons[index] = el as HTMLButtonElement }" type="button" role="tab" :aria-selected="activeTab === tab.id" :aria-controls="\`about-panel-\${tab.id}\`" :tabindex="activeTab === tab.id ? 0 : -1" @click="selectTab(tab.id)" @keydown="handleTabKeydown($event, index)">{{ tab.label }}</button>
          </div>
          <div class="about__panels">
            <section v-for="tab in tabs" :id="\`about-panel-\${tab.id}\`" :key="tab.id" class="about__profile-panel" :class="{ 'is-active': activeTab === tab.id }" :inert="activeTab !== tab.id" :aria-hidden="activeTab !== tab.id" role="tabpanel" :aria-labelledby="\`about-tab-\${tab.id}\`" tabindex="0">
              <h3>{{ aboutContent.panels[tab.id].title }}</h3>
              <p v-for="paragraph in aboutContent.panels[tab.id].paragraphs" :key="paragraph">{{ paragraph }}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  </section>`+s.slice(end);
// Phone layout rules move into the single About CSS region; retain existing
// About-only navigation visibility, without changing shared navigation components.
const scoped=s.indexOf('<style scoped>');
const globalStyle=s.indexOf('<style>',scoped);
if(scoped<0||globalStyle<0)throw Error('About style boundaries missing');
s=s.slice(0,scoped)+s.slice(globalStyle);
s=s.replaceAll(', symbol: "▤"','').replaceAll(', symbol: "⌘"','').replaceAll(', symbol: "◇"','');
writeFileSync(file,s);
let css=readFileSync('src/style.css','utf8');
const a=css.indexOf('/* Level 03 — personal profile.');
const b=css.indexOf('/* Level 02 — native horizontal project gallery. */',a);
if(a<0||b<0)throw Error('About CSS boundaries missing');
css=css.slice(0,a)+readFileSync('tmp/about-glass-review/about.css','utf8')+'\n\n'+css.slice(b);
writeFileSync('src/style.css',css);
