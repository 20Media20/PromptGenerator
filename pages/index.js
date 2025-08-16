import { useEffect, useMemo, useState } from 'react';
import { buildBasePrompt, buildNegative } from '../lib/buildBasePrompt';

const PRESETS = ['Vintage','Modern','Classic','Futuristic','Colourful'];

function Step({ children }){ return <div className="card">{children}</div>; }

export default function Home(){
  const total = 9;
  const [step, setStep] = useState(1);

  // Answers
  const [showName, setShowName] = useState('Showtime 2025');
  const [themeDesc, setThemeDesc] = useState('Broadway with a modern twist');
  const [colours, setColours] = useState('deep purple, magenta, electric blue, gold accents');
  const [keywords, setKeywords] = useState('tap, jazz, contemporary, ensemble, spotlight');
  const [orientation, setOrientation] = useState('square');
  const [preset, setPreset] = useState('Modern');

  const [simplicity, setSimplicity] = useState(50);
  const [modernity, setModernity] = useState(60);
  const [realism, setRealism] = useState(40);
  const [multicolour, setMulticolour] = useState(70);
  const [energy, setEnergy] = useState(75);
  const [motion, setMotion] = useState(70);
  const [lighting, setLighting] = useState(85);
  const [includeLights, setIncludeLights] = useState(true);
  const [includeSmoke, setIncludeSmoke] = useState(true);
  const [includeFlares, setIncludeFlares] = useState(false);

  const [platform, setPlatform] = useState('general');
  const [refining, setRefining] = useState(false);
  const [refined, setRefined] = useState('');
  const [error, setError] = useState('');
  const [debug, setDebug] = useState('');

  const basePrompt = useMemo(()=>buildBasePrompt({
    showName, themeDesc, colours, keywords,
    orientation, preset, simplicity, modernity, realism, multicolour, energy, motion, lighting,
    includeLights, includeSmoke, includeFlares
  }), [showName, themeDesc, colours, keywords, orientation, preset, simplicity, modernity, realism, multicolour, energy, motion, lighting, includeLights, includeSmoke, includeFlares]);

  const fullPrompt = useMemo(()=> basePrompt + '\n\nNegative prompt: ' + buildNegative(), [basePrompt]);

  const pct = Math.round((step-1) / (total-1) * 100);

  async function runRefine(){
    setRefining(true); setRefined(''); setError(''); setDebug('');
    try{
      const res = await fetch('/api/refine',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ basePrompt, platform, orientation })
      });
      const text = await res.text();
      setDebug(text);
      let data = null;
      try{ data = JSON.parse(text) }catch{}
      if(!res.ok){
        setError(data?.error || 'Refinement error');
        return;
      }
      setRefined(data?.refined || '');
    }catch(err){
      setError(String(err));
    }finally{
      setRefining(false);
    }
  }

  useEffect(()=>{
    if(step === 9){
      runRefine();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  return (
    <div className="container">
      <h1>Dance Show Prompt Wizard</h1>
      <p className="sub">Answer one question at a time. On the last step we rewrite your prompt with ChatGPT for image models.</p>
      <div className="progress" aria-label="progress"><span style={{width: pct + '%'}} /></div>

      {step === 1 && (<Step>
        <label>What is your show called?</label>
        <input value={showName} onChange={e=>setShowName(e.target.value)} placeholder="e.g. Stardust Spectacular" />
        <div className="row" style={{justifyContent:'space-between', marginTop:12}}>
          <div className="badge">Title will live inside the artwork creatively</div>
          <button onClick={()=>setStep(2)}>Next</button>
        </div>
      </Step>)}

      {step === 2 && (<Step>
        <label>Describe the theme in one sentence</label>
        <input value={themeDesc} onChange={e=>setThemeDesc(e.target.value)} placeholder="e.g. Broadway sparkle with modern energy" />
        <div className="row" style={{justifyContent:'space-between', marginTop:12}}>
          <button className="ghost" onClick={()=>setStep(1)}>Back</button>
          <button onClick={()=>setStep(3)}>Next</button>
        </div>
      </Step>)}

      {step === 3 && (<Step>
        <label>Add 3 to 5 keywords</label>
        <input value={keywords} onChange={e=>setKeywords(e.target.value)} placeholder="tap, jazz, spotlight, sequins" />
        <div className="row" style={{justifyContent:'space-between', marginTop:12}}>
          <button className="ghost" onClick={()=>setStep(2)}>Back</button>
          <button onClick={()=>setStep(4)}>Next</button>
        </div>
      </Step>)}

      {step === 4 && (<Step>
        <label>Colours to feature</label>
        <input value={colours} onChange={e=>setColours(e.target.value)} placeholder="deep purple, magenta, electric blue, gold" />
        <div className="row" style={{justifyContent:'space-between', marginTop:12}}>
          <button className="ghost" onClick={()=>setStep(3)}>Back</button>
          <button onClick={()=>setStep(5)}>Next</button>
        </div>
      </Step>)}

      {step === 5 && (<Step>
        <label>Orientation</label>
        <select value={orientation} onChange={e=>setOrientation(e.target.value)}>
          <option value="square">Square</option>
          <option value="landscape">Landscape</option>
          <option value="portrait">Portrait</option>
        </select>
        <label style={{marginTop:12}}>Style preset</label>
        <select value={preset} onChange={e=>setPreset(e.target.value)}>
          {PRESETS.map(p=>(<option key={p} value={p}>{p}</option>))}
        </select>
        <div className="row" style={{justifyContent:'space-between', marginTop:12}}>
          <button className="ghost" onClick={()=>setStep(4)}>Back</button>
          <button onClick={()=>setStep(6)}>Next</button>
        </div>
      </Step>)}

      {step === 6 && (<Step>
        <label>Simplicity to complex</label>
        <input className="slider" type="range" min="0" max="100" value={simplicity} onChange={e=>setSimplicity(Number(e.target.value))} />
        <label>Classic to modern</label>
        <input className="slider" type="range" min="0" max="100" value={modernity} onChange={e=>setModernity(Number(e.target.value))} />
        <label>Illustration to photo realistic</label>
        <input className="slider" type="range" min="0" max="100" value={realism} onChange={e=>setRealism(Number(e.target.value))} />
        <div className="row" style={{justifyContent:'space-between', marginTop:12}}>
          <button className="ghost" onClick={()=>setStep(5)}>Back</button>
          <button onClick={()=>setStep(7)}>Next</button>
        </div>
      </Step>)}

      {step === 7 && (<Step>
        <label>Simple colours to multi colour</label>
        <input className="slider" type="range" min="0" max="100" value={multicolour} onChange={e=>setMulticolour(Number(e.target.value))} />
        <label>Energy</label>
        <input className="slider" type="range" min="0" max="100" value={energy} onChange={e=>setEnergy(Number(e.target.value))} />
        <label>Motion</label>
        <input className="slider" type="range" min="0" max="100" value={motion} onChange={e=>setMotion(Number(e.target.value))} />
        <label>Lighting</label>
        <input className="slider" type="range" min="0" max="100" value={lighting} onChange={e=>setLighting(Number(e.target.value))} />
        <div className="row" style={{justifyContent:'space-between', marginTop:12}}>
          <button className="ghost" onClick={()=>setStep(6)}>Back</button>
          <button onClick={()=>setStep(8)}>Next</button>
        </div>
      </Step>)}

      {step === 8 && (<Step>
        <label>Effects</label>
        <div className="row">
          <div className="row" style={{gap:8}}>
            <input id="lights" type="checkbox" checked={includeLights} onChange={e=>setIncludeLights(e.target.checked)} />
            <label htmlFor="lights">Stage lights</label>
          </div>
          <div className="row" style={{gap:8}}>
            <input id="smoke" type="checkbox" checked={includeSmoke} onChange={e=>setIncludeSmoke(e.target.checked)} />
            <label htmlFor="smoke">Smoke or haze</label>
          </div>
          <div className="row" style={{gap:8}}>
            <input id="flares" type="checkbox" checked={includeFlares} onChange={e=>setIncludeFlares(e.target.checked)} />
            <label htmlFor="flares">Lens flares if useful</label>
          </div>
        </div>
        <div className="row" style={{justifyContent:'space-between', marginTop:12}}>
          <button className="ghost" onClick={()=>setStep(7)}>Back</button>
          <button onClick={()=>setStep(9)}>See final prompt</button>
        </div>
      </Step>)}

      {step === 9 && (<Step>
        <label>Your base prompt</label>
        <div className="preview">{fullPrompt}</div>
        <div className="row" style={{marginTop:10}}>
          <div className="badge">We are now optimising this with ChatGPT on the server</div>
          <select value={platform} onChange={e=>setPlatform(e.target.value)}>
            <option value="general">General</option>
            <option value="midjourney">Midjourney</option>
            <option value="stable-diffusion">Stable Diffusion</option>
          </select>
        </div>
        {refining && <div className="badge" style={{marginTop:8}}>Refining your prompt...</div>}
        {error && <div className="error" style={{marginTop:8}}>{error}</div>}
        {refined && (
          <>
            <label style={{marginTop:12}}>Final optimised prompt</label>
            <div className="preview">{refined}</div>
            <div className="row" style={{marginTop:10}}>
              <button onClick={()=>navigator.clipboard.writeText(refined)}>Copy final prompt</button>
              <button className="ghost" onClick={()=>navigator.clipboard.writeText(fullPrompt)}>Copy base version</button>
            </div>
          </>
        )}
        <div className="debug" style={{marginTop:10}} aria-label="debug">{debug}</div>
        <div className="row" style={{justifyContent:'space-between', marginTop:12}}>
          <button className="ghost" onClick={()=>setStep(8)}>Back</button>
          <button onClick={()=>setStep(1)}>Start again</button>
        </div>
      </Step>)}

      <div className="footer">Set OPENAI_API_KEY in your environment to enable the refinement step on Vercel and locally.</div>
    </div>
  );
}
