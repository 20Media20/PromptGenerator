export function buildBasePrompt(state){
  const {
    showName, themeDesc, colours, keywords,
    orientation, preset,
    simplicity, modernity, realism, multicolour, energy, motion, lighting,
    includeLights, includeSmoke, includeFlares
  } = state;

  const parts = [];
  parts.push(`Design cinematic poster artwork for a dance show titled "${showName}".`);
  parts.push(`The title must live inside the scene creatively, not a flat overlay`);

  if(themeDesc) parts.push(`Theme: ${themeDesc}.`);
  if(colours) parts.push(`Colour palette: ${colours}.`);
  if(keywords) parts.push(`Concept keywords: ${keywords}.`);

  const orient = orientation === 'landscape' ? 'landscape poster 3:2' : orientation === 'portrait' ? 'portrait poster 2:3' : 'square poster 1:1';
  parts.push(`Layout: ${orient}.`);

  const scaleWord = (v,a,b)=> v<33? a : v>66? b : `${a} to ${b}`;
  parts.push(`Complexity: ${scaleWord(100 - simplicity,'simple','ornate')}.`);
  parts.push(`Style era: ${scaleWord(modernity,'classic','modern')}.`);
  parts.push(`Rendering: ${scaleWord(realism,'illustrative','photo realistic')}.`);
  parts.push(`Colourfulness: ${scaleWord(multicolour,'limited palette','multi colour')}.`);
  parts.push(`Energy: ${scaleWord(energy,'subtle','high energy')}. Motion: ${scaleWord(motion,'still','dynamic')}. Lighting: ${scaleWord(lighting,'soft','dramatic')}.`);

  const fx = [];
  if(includeLights) fx.push('stage spotlights');
  if(includeSmoke) fx.push('smoke or haze for depth');
  if(includeFlares) fx.push('lens flares if helpful');
  if(fx.length) parts.push(`Effects to consider: ${fx.join(', ')}.`);

  const presetMap = {
    Vintage: 'vintage theatre playbill, subtle paper grain, warm inks',
    Modern: 'sleek minimal layout, bold geometric shapes, negative space',
    Classic: 'timeless theatre poster, elegant composition, refined type feel',
    Futuristic: 'neon accents, holographic textures, sci fi energy',
    Colourful: 'vibrant confetti palette, playful shapes, celebratory mood'
  };
  if(preset) parts.push(`Overall direction: ${preset} (${presetMap[preset]}).`);

  parts.push('Avoid brand logos. Avoid flat caption boxes. Avoid readable body copy.');
  parts.push('High quality, sharp details, rich contrast, cinematic light, professional poster look.');
  return parts.join(' ');
}

export function buildNegative(){
  return [
    'low resolution','blurry','dull colors','boring composition','crooked horizon',
    'watermarks','text artifacts','extra limbs','harsh flash look'
  ].join(', ');
}
