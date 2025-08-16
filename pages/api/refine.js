export default async function handler(req, res){
  const at = new Date().toISOString();
  if(req.method !== 'POST'){
    return res.status(405).json({ error:'Method not allowed', at });
  }
  const key = process.env.OPENAI_API_KEY;
  if(!key){
    return res.status(500).json({ error:'Missing OPENAI_API_KEY on server. Add it in Vercel Project Settings and in .env.local for local dev.', at });
  }
  try{
    const { basePrompt, platform='general', orientation='square' } = req.body || {};
    if(!basePrompt){
      return res.status(400).json({ error:'Missing basePrompt', at });
    }
    const platformLine = platform === 'midjourney'
      ? 'Return a single line prompt that suits Midjourney. Do not add parameters like --ar. Keep the title integration instruction.'
      : platform === 'stable-diffusion'
      ? 'Return a single line prompt for Stable Diffusion. Avoid excessive punctuation. Keep language descriptive and clear.'
      : 'Return a single line prompt suitable for general image generators like DALL E, Firefly, or Leonardo.';

    const sys = [
      'You rewrite prompts for image generators. Keep meaning and intent.',
      'Emphasise that the show title is inside the scene, not a flat overlay.',
      'Write vivid yet compact phrasing and strong visual hierarchy.',
      'Do not invent brands or camera models.'
    ].join(' ');

    const user = [
      'Base prompt:', basePrompt,
      'Orientation:', orientation,
      platformLine,
      'Output only the final optimised prompt without quotes.'
    ].join('\n');

    const resp = await fetch('https://api.openai.com/v1/chat/completions',{
      method:'POST',
      headers:{ 'Authorization': `Bearer ${key}`, 'Content-Type':'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{role:'system', content: sys},{role:'user', content: user}],
        temperature: 0.7
      })
    });
    const json = await resp.json();
    if(!resp.ok){
      return res.status(resp.status).json({ error:'Upstream error', upstream: json, at });
    }
    const refined = json?.choices?.[0]?.message?.content?.trim();
    return res.status(200).json({ at, refined });
  }catch(err){
    return res.status(500).json({ error: String(err?.message || err), at });
  }
}
