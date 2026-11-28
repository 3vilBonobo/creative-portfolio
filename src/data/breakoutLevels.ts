export interface BreakoutLevel {
  name: string; district: string; layout: string[]; speed: number; paddleWidth: number;
  colors: string[]; sky: string; city: string; landmark: 'temple' | 'antenna' | 'moon';
}
// 0 = gap, 1 = neon sign, 2 = reinforced sign. Each sector has eight columns.
export const BREAKOUT_LEVELS: BreakoutLevel[] = [
  { name: 'First signal', district: 'Monastiraki', layout: ['11111111','11111111','11111111','11111111'], speed: 310, paddleWidth: 112, colors: ['#f38bce','#df92ff','#65d9ed','#a4eee0'], sky: '#090e1c', city: '#121f32', landmark: 'temple' },
  { name: 'Night market', district: 'Psyrri', layout: ['11011011','11111111','01111110','11011011','10011001'], speed: 320, paddleWidth: 108, colors: ['#ffd080','#ffa38b','#f38bce','#c99cff'], sky: '#180d20', city: '#302039', landmark: 'moon' },
  { name: 'Metro pulse', district: 'Syntagma', layout: ['11111111','01011010','11111111','01011010','11111111'], speed: 330, paddleWidth: 104, colors: ['#8ff0de','#60cce9','#b7c9ff','#f3e3a0'], sky: '#081b20', city: '#14333b', landmark: 'antenna' },
  { name: 'Pirate frequency', district: 'Exarchia', layout: ['10011001','11011011','01111110','00122100','01100110','11000011'], speed: 340, paddleWidth: 100, colors: ['#ff9cb5','#ffbe87','#a4eee0','#a2b1ff'], sky: '#1c1018', city: '#35202d', landmark: 'antenna' },
  { name: 'Uplink garden', district: 'Kolonaki', layout: ['00111100','01200210','11111111','01111110','00111100','00011000'], speed: 350, paddleWidth: 100, colors: ['#b7ef9a','#85e8c5','#96c9ff','#e2c8ff'], sky: '#0b1b18', city: '#18352e', landmark: 'moon' },
  { name: 'Factory reset', district: 'Gazi', layout: ['22111122','11000011','11111111','11000011','22111122'], speed: 360, paddleWidth: 96, colors: ['#ffbe7c','#f99783','#d3abff','#8fdfe6'], sky: '#21130d', city: '#3b2926', landmark: 'antenna' },
  { name: 'Coastal relay', district: 'Piraeus', layout: ['11110000','00111100','00001111','22111122','11112211','01111110'], speed: 370, paddleWidth: 96, colors: ['#8ee9fa','#83bcff','#c7aeff','#ffb3da'], sky: '#071427', city: '#17304b', landmark: 'moon' },
  { name: 'Hilltop echo', district: 'Lycabettus', layout: ['00022000','00111100','01211210','11111111','11000011','22111122'], speed: 380, paddleWidth: 92, colors: ['#d3b2ff','#fca8de','#ffc99a','#a3e0fa'], sky: '#19112b', city: '#302447', landmark: 'antenna' },
  { name: 'Ancient circuit', district: 'Acropolis', layout: ['22222222','11111111','02022020','01011010','02022020','11111111'], speed: 390, paddleWidth: 92, colors: ['#ffe4a5','#f7bc86','#e9a2cf','#a8dadd'], sky: '#1c1813', city: '#38332a', landmark: 'temple' },
  { name: 'Athens afterglow', district: 'Citywide', layout: ['21211212','12122121','21111112','01122110','00122100','00022000'], speed: 400, paddleWidth: 88, colors: ['#ffd59b','#f7a7da','#c4b5ff','#93e9eb'], sky: '#171224', city: '#2c2945', landmark: 'temple' },
];
