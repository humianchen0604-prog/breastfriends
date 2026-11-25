/* Breast Friends: story progress, next steps, real survivor videos.
   Load after the main inline script:  <script src="progress.js"></script>  right before </body>.
   Adds:
   1. Real stories: each row plays an official YouTube video (CDC, American Cancer Society, hospitals) behind a custom
      poster and a "YouTube" pill; the player shows the real speaker's name and role.
   2. Transcript view keeps the video's sound playing and highlights its real transcript in sync (CDC videos).
   3. Marked complete: a story that plays to the end gets a check on the topic page.
   4. Next steps: finishing every story in a topic opens a Kern County booking guide ending in a Cedars-Sinai CTA. */
(()=>{
if(typeof STR==='undefined'||typeof V==='undefined')return;

/* ---------- styles ---------- */
document.head.insertAdjacentHTML('beforeend',`<style id="bf-progress">
.bf-vid::after{display:none}
.bf-credit{position:absolute;left:23px;right:23px;top:473px;display:flex;align-items:center;gap:6px;font:500 12px var(--in);color:rgba(244,241,236,.7);white-space:nowrap;overflow:hidden}
.bf-credit b{font-weight:600;color:var(--sand);overflow:hidden;text-overflow:ellipsis}
.bf-credit i{flex:none;width:6px;height:6px;border-radius:50%;background:var(--lime)}
.track{cursor:pointer}
.bf-donepill{display:inline-flex;align-items:center;gap:8px;height:48px;padding:0 22px;border-radius:999px;background:var(--lime);color:var(--nightfall);font-size:16px;font-weight:700;white-space:nowrap;animation:bfpop .42s var(--ease)}
.bf-check{width:28px;height:28px;border-radius:50%;background:var(--nightfall);display:flex;align-items:center;justify-content:center;flex:none}
.row .d.bf-now{color:var(--nightfall);font-weight:700}
.bf-just{animation:bfglow 1.4s ease}
.bf-just .bf-check{animation:bfpop .5s var(--ease)}
@keyframes bfpop{0%{transform:scale(.4);opacity:0}60%{transform:scale(1.12);opacity:1}100%{transform:scale(1)}}
@keyframes bfglow{0%,100%{box-shadow:0 0 0 0 rgba(159,175,248,0)}25%{box-shadow:0 0 0 3px var(--peri)}}
.hero-topic .bf-prog{position:relative;display:flex;gap:4px;width:150px;margin-top:10px}
.hero-topic .bf-prog i{flex:1;height:5px;border-radius:3px;background:currentColor;opacity:.22;transition:opacity .3s ease}
.hero-topic .bf-prog i.on{opacity:1}
.bf-all{display:flex;align-items:center;gap:12px;width:100%;padding:14px;margin-bottom:10px;border-radius:20px;background:var(--nightfall);color:var(--sand);animation:rise .4s var(--ease)}
.bf-all .bf-check{background:var(--lime)}
.bf-all .t{flex:1;min-width:0}
.bf-chev{transform:rotate(180deg);flex:none}
.bf-all b{display:block;font:700 16px var(--in);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bf-all span.s{display:block;margin-top:2px;font:400 14px var(--in);color:rgba(244,241,236,.75)}
.bf-ns .bf-tag{display:inline-flex;align-items:center;gap:6px;height:30px;margin:0 23px 10px;padding:0 12px 0 8px;border-radius:999px;background:var(--lime);font-size:13px;font-weight:600;align-self:flex-start;white-space:nowrap;max-width:calc(100% - 46px);overflow:hidden;text-overflow:ellipsis}
.bf-ns h2{white-space:normal}
.bf-ns .inner-scroll{max-height:470px;padding:18px 16px 4px}
.bf-steps{list-style:none;padding:0;margin:0}
.bf-step{position:relative;display:flex;gap:14px;padding-bottom:20px}
.bf-step::before{content:"";position:absolute;left:15px;top:38px;bottom:4px;width:2px;background:repeating-linear-gradient(to bottom,var(--bar-idle) 0 4px,transparent 4px 8px)}
.bf-step:last-child{padding-bottom:6px}
.bf-step:last-child::before{display:none}
.bf-num{width:32px;height:32px;border-radius:50%;background:var(--pearl);color:var(--nightfall);font:700 15px var(--in);display:flex;align-items:center;justify-content:center;flex:none}
.bf-step:last-child .bf-num{background:#dc1e34;color:#fff}
.bf-step .tx{flex:1;min-width:0}
.bf-step h3{font-size:17px;font-weight:700;line-height:1.25;margin-top:5px}
.bf-step p{font:400 14px/1.42 var(--in);color:var(--ink-slate);margin-top:4px}
.bf-step .chip{height:36px;margin-top:10px;padding:0 14px;gap:6px;font-size:13px}
.bf-foot{padding:12px 16px 0;border-top:1px solid rgba(29,37,103,.08)}
.cta.bf-cedars{height:auto;min-height:56px;padding:10px 16px;font-size:15px;background:#dc1e34;color:#fff;white-space:normal;text-align:center;line-height:1.2}
.bf-later{display:block;width:100%;height:44px;margin-top:4px;text-align:center;font-size:15px;font-weight:600;color:var(--ink-slate)}
</style>`);

/* ---------- strings ---------- */
Object.assign(STR.en,{
 marked:'Marked complete',heard:(a,b)=>`${a} of ${b} heard`,allT:n=>`You heard all ${n} stories`,allB:'See your next steps',replay:'Play again',realFrom:'Real story',
 nsTag:x=>`You finished ${x}`,nsT:'Your next steps',nsSub:'How to get a mammogram in Kern County.',
 s1T:'Check if it’s time',s1B:'If you’re 40 or older, plan a mammogram every 1 to 2 years. Your doctor can tell you what’s right for you.',
 s2T:'Know it can be free',s2B:'Medi-Cal and most insurance plans cover screening mammograms. No insurance? Every Woman Counts gives free mammograms to women 40 and older, with help in Spanish and Punjabi.',s2C:'Call (800) 511-2300',
 s3T:'Ask for a referral',s3B:'Ask your own clinic, or call Clinica Sierra Vista Women’s Health in Bakersfield.',s3C:'Call (833) 278-4584',
 s4T:'Plan your ride',s4B:'Kern Family Health Care members can get a ride. Call 1-800-391-2000, option 3, at least 5 days before. Bring a friend if you can.',s4C:'Call for a ride',
 s5T:'Book your mammogram',s5B:'Choose a day and a place that work for you.',
 cedars:'Schedule my mammogram with Cedars‑Sinai',later:'Maybe later',opCedars:'Opening Cedars-Sinai scheduling',calling:n=>`Calling ${n}`});
Object.assign(STR.es,{
 marked:'Marcada como completada',heard:(a,b)=>`${a} de ${b} escuchadas`,allT:n=>`Escuchaste las ${n} historias`,allB:'Mira tus próximos pasos',replay:'Volver a escuchar',realFrom:'Historia real',
 nsTag:x=>`Terminaste ${x}`,nsT:'Tus próximos pasos',nsSub:'Cómo hacerte una mamografía en el condado de Kern.',
 s1T:'¿Ya te toca?',s1B:'Si tienes 40 años o más, hazte una mamografía cada 1 o 2 años. Tu médico te dirá qué es lo mejor para ti.',
 s2T:'Puede ser gratis',s2B:'Medi-Cal y la mayoría de los seguros cubren la mamografía. ¿No tienes seguro? Cada Mujer Cuenta ofrece mamografías gratis a mujeres de 40 años o más, con ayuda en español.',s2C:'Llamar al (800) 511-2300',
 s3T:'Pide una referencia',s3B:'Pregunta en tu clínica o llama a Salud de la Mujer de Clínica Sierra Vista en Bakersfield.',s3C:'Llamar al (833) 278-4584',
 s4T:'Planea cómo llegar',s4B:'Si tienes Kern Family Health Care, te pueden llevar. Llama al 1-800-391-2000, opción 3, con al menos 5 días de anticipación. Si puedes, ve con una amiga.',s4C:'Pedir transporte',
 s5T:'Reserva tu mamografía',s5B:'Elige el día y el lugar que mejor te queden.',
 cedars:'Agendar mi mamografía con Cedars‑Sinai',later:'Quizás después',opCedars:'Abriendo la agenda de Cedars-Sinai',calling:n=>`Llamando al ${n}`});
Object.assign(STR.pa,{
 marked:'ਪੂਰੀ ਹੋ ਗਈ',heard:(a,b)=>`${b} ਵਿੱਚੋਂ ${a} ਸੁਣੀਆਂ`,allT:n=>`ਤੁਸੀਂ ਸਾਰੀਆਂ ${n} ਕਹਾਣੀਆਂ ਸੁਣ ਲਈਆਂ`,allB:'ਆਪਣੇ ਅਗਲੇ ਕਦਮ ਵੇਖੋ',replay:'ਮੁੜ ਚਲਾਓ',realFrom:'ਅਸਲ ਕਹਾਣੀ',
 nsTag:x=>`ਤੁਸੀਂ ${x} ਪੂਰਾ ਕਰ ਲਿਆ`,nsT:'ਤੁਹਾਡੇ ਅਗਲੇ ਕਦਮ',nsSub:'Kern County ਵਿੱਚ ਮੈਮੋਗ੍ਰਾਮ ਕਿਵੇਂ ਕਰਵਾਈਏ।',
 s1T:'ਕੀ ਤੁਹਾਡੀ ਵਾਰੀ ਹੈ?',s1B:'ਜੇ ਤੁਹਾਡੀ ਉਮਰ 40 ਸਾਲ ਜਾਂ ਵੱਧ ਹੈ, ਤਾਂ ਹਰ 1 ਤੋਂ 2 ਸਾਲ ਬਾਅਦ ਮੈਮੋਗ੍ਰਾਮ ਕਰਵਾਓ। ਤੁਹਾਡਾ ਡਾਕਟਰ ਦੱਸ ਸਕਦਾ ਹੈ ਕਿ ਤੁਹਾਡੇ ਲਈ ਕੀ ਠੀਕ ਹੈ।',
 s2T:'ਇਹ ਮੁਫ਼ਤ ਹੋ ਸਕਦਾ ਹੈ',s2B:'Medi-Cal ਅਤੇ ਬਹੁਤੇ ਬੀਮੇ ਮੈਮੋਗ੍ਰਾਮ ਦਾ ਖਰਚਾ ਦਿੰਦੇ ਹਨ। ਬੀਮਾ ਨਹੀਂ ਹੈ? Every Woman Counts 40 ਸਾਲ ਜਾਂ ਵੱਧ ਉਮਰ ਦੀਆਂ ਔਰਤਾਂ ਨੂੰ ਮੁਫ਼ਤ ਮੈਮੋਗ੍ਰਾਮ ਦਿੰਦਾ ਹੈ, ਪੰਜਾਬੀ ਵਿੱਚ ਮਦਦ ਨਾਲ।',s2C:'(800) 511-2300 ’ਤੇ ਕਾਲ ਕਰੋ',
 s3T:'ਰੈਫ਼ਰਲ ਮੰਗੋ',s3B:'ਆਪਣੇ ਕਲੀਨਿਕ ਤੋਂ ਪੁੱਛੋ, ਜਾਂ Bakersfield ਵਿੱਚ Clinica Sierra Vista Women’s Health ਨੂੰ ਕਾਲ ਕਰੋ।',s3C:'(833) 278-4584 ’ਤੇ ਕਾਲ ਕਰੋ',
 s4T:'ਸਵਾਰੀ ਦਾ ਪ੍ਰਬੰਧ ਕਰੋ',s4B:'Kern Family Health Care ਦੇ ਮੈਂਬਰਾਂ ਨੂੰ ਸਵਾਰੀ ਮਿਲ ਸਕਦੀ ਹੈ। ਘੱਟੋ-ਘੱਟ 5 ਦਿਨ ਪਹਿਲਾਂ 1-800-391-2000 ’ਤੇ ਕਾਲ ਕਰੋ ਅਤੇ 3 ਦਬਾਓ। ਹੋ ਸਕੇ ਤਾਂ ਕਿਸੇ ਸਹੇਲੀ ਨੂੰ ਨਾਲ ਲਿਆਓ।',s4C:'ਸਵਾਰੀ ਲਈ ਕਾਲ ਕਰੋ',
 s5T:'ਆਪਣਾ ਮੈਮੋਗ੍ਰਾਮ ਬੁੱਕ ਕਰੋ',s5B:'ਆਪਣੀ ਸਹੂਲਤ ਮੁਤਾਬਕ ਦਿਨ ਅਤੇ ਥਾਂ ਚੁਣੋ।',
 cedars:'Cedars‑Sinai ਨਾਲ ਮੈਮੋਗ੍ਰਾਮ ਬੁੱਕ ਕਰੋ',later:'ਫਿਰ ਕਦੇ',opCedars:'Cedars-Sinai ਬੁਕਿੰਗ ਖੁੱਲ੍ਹ ਰਹੀ ਹੈ',calling:n=>`${n} ’ਤੇ ਕਾਲ ਹੋ ਰਹੀ ਹੈ`});


['https://www.youtube-nocookie.com','https://www.youtube.com','https://i.ytimg.com','https://www.google.com'].forEach(h=>{const l=document.createElement('link');l.rel='preconnect';l.href=h;l.crossOrigin='';document.head.appendChild(l)});
/* more styles: custom video poster, YouTube pill, transcript card */
document.head.insertAdjacentHTML('beforeend',`<style id="bf-progress-2">
#scr .ctrl{justify-content:space-between;align-items:center;padding:0 30px;gap:0}
.bf-mid{display:flex;align-items:center;gap:28px}
.bf-skip{width:44px;height:44px;display:flex;align-items:center;justify-content:center;border-radius:22px;transition:transform .16s ease,opacity .2s ease}
.bf-skip:active{transform:scale(.92)}
.bf-skip:disabled{opacity:.3;cursor:default}
#bf-yt{position:absolute;left:23px;top:181px;width:342px;height:280px;border-radius:20px;overflow:hidden;background:#000;z-index:3;visibility:hidden}
#bf-yt.on{visibility:visible}
#bf-yt iframe{position:absolute;left:-259px;top:-111px;width:860px;height:484px;border:0;pointer-events:none}
#bf-yt .poster{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:opacity .35s ease}
.bf-ph{background:#4a4648}
.bf-ph .bf-thumb{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0}
#bf-yt.held .bf-thumb{opacity:1}
#bf-yt.held .bf-load{display:none}
.bf-load{position:absolute;left:0;right:0;top:44%;display:flex;align-items:center;justify-content:center;gap:8px;color:rgba(244,241,236,.75);font:600 14px var(--in)}
.bf-load i{width:14px;height:14px;border-radius:50%;border:2px solid rgba(244,241,236,.3);border-top-color:var(--sand);animation:bfspin .8s linear infinite}
@keyframes bfspin{to{transform:rotate(360deg)}}
.bf-vid.bf-gray{background:#4a4648}
#bf-yt.playing .poster{opacity:0}
#bf-yt .bf-cap{z-index:1;position:absolute;left:0;right:0;bottom:0;padding:48px 16px 14px;background:linear-gradient(to top,rgba(0,0,0,.62),rgba(0,0,0,0));pointer-events:none;opacity:0;transition:opacity .25s ease}
#bf-yt .bf-cap.on{opacity:1}
#bf-yt .bf-cap p{text-align:center;color:var(--sand);font:700 16px/1.3 var(--pg);text-wrap:balance}
.bf-ytpill{position:absolute;right:12px;top:12px;height:32px;padding:0 12px 0 9px;display:inline-flex;align-items:center;gap:6px;border-radius:999px;background:rgba(0,0,0,.45);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);color:#fff;font:600 13px var(--in);text-decoration:none;white-space:nowrap;z-index:2}
.bf-ytpill:active{transform:scale(.96)}
.bf-vid{background:#000}
.bf-vid img{width:100%;height:100%;object-fit:cover}
.bf-av{position:relative;border-radius:999px;overflow:hidden;flex:none;background:#000}
.bf-av img{position:absolute;left:50%;top:50%;height:100%;width:auto;max-width:none;transform:translate(-50%,-50%)}
.ts .bf-lang{min-height:0;margin-bottom:12px;font:600 12px var(--in);letter-spacing:.4px;text-transform:uppercase;color:var(--ink-slate)}
.ts[data-tx]{left:0;width:100%;top:0;height:100%;padding:0 26px;font-size:22px;line-height:1.28;scroll-behavior:auto}
.ts[data-tx] .bf-pad{height:150px;min-height:0}
.ts[data-tx] .bf-lang{margin:20px 0 0}
.ts .bf-l{min-height:0;margin:0 0 22px;color:rgba(29,37,103,.18);transform-origin:left center;transition:color .35s ease,transform .35s var(--ease),opacity .35s ease}
.ts .bf-l.past{color:rgba(29,37,103,.42)}
.ts .bf-l.now{transform:scale(1.04);color:rgba(29,37,103,.42)}
.ts .bf-l.now span.w,.ts .bf-l.past span{color:inherit}
.ts .bf-l.now span{transition:color .2s ease}
.ts .bf-l.now span.w{color:var(--nightfall)}
.bf-fadetop{position:absolute;left:0;top:0;width:100%;height:70px;background:linear-gradient(to top,rgba(244,241,236,0),var(--sand));pointer-events:none;z-index:1}
.bf-notx{position:absolute;left:24px;right:24px;top:96px}
.bf-notx b{display:block;font-size:24px;font-weight:600;line-height:1.25;color:var(--nightfall)}
.bf-notx span{display:block;margin-top:12px;font:400 15px/1.4 var(--in);color:var(--ink-slate)}
</style>`);
Object.assign(STR.en,{prevS:'Previous story',nextS:'Next story',loading:'Loading video…',txLang:'Transcript in English',noTxT:'Captions for this story are on YouTube.',noTxB:n=>`Keep listening to ${n}, or open the video on YouTube to read along.`});
Object.assign(STR.es,{prevS:'Historia anterior',nextS:'Siguiente historia',loading:'Cargando video…',txLang:'Transcripción en inglés',noTxT:'Los subtítulos de esta historia están en YouTube.',noTxB:n=>`Sigue escuchando a ${n} o abre el video en YouTube para leer.`});
Object.assign(STR.pa,{prevS:'ਪਿਛਲੀ ਕਹਾਣੀ',nextS:'ਅਗਲੀ ਕਹਾਣੀ',loading:'ਵੀਡੀਓ ਲੋਡ ਹੋ ਰਹੀ ਹੈ…',txLang:'ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਟ੍ਰਾਂਸਕ੍ਰਿਪਟ',noTxT:'ਇਸ ਕਹਾਣੀ ਦੀਆਂ ਕੈਪਸ਼ਨਾਂ YouTube ’ਤੇ ਹਨ।',noTxB:n=>`${n} ਨੂੰ ਸੁਣਦੇ ਰਹੋ, ਜਾਂ ਪੜ੍ਹਨ ਲਈ YouTube ’ਤੇ ਵੀਡੀਓ ਖੋਲ੍ਹੋ।`});

/* Transcripts: CDC videos (U.S. government works, public domain), from each video's own captions. Times in seconds. */
const TX={
KNzRNWi4Qgc:[[0,"On my father's side I have multiple relatives who've had breast or ovarian cancer at an early age."],[6,"I had a new physician, and in speaking with her, with my strong family history, we actually decided to get genetic counseling."],[14,"And I left and went home, and I was like, \"I don't want to know. I'm not doing it."],[17,"I'm not taking this test.\" And I kind of sat and thought about it for a while. And, I was like, \"What am I doing?"],[25,"Here I am, you know."],[26,"I could lose my daughter and not be here for her.\" And I called back up and I took the test. And she called me back a while later."],[36,"And I went back in and we sat down and discussed the results. And I found out that I was in fact BRCA1 positive."],[42,"My entire family health history on my dad's side made sense."],[47,"So, the genetic counselor laid out a couple of options for me. She was there to answer any questions I had. I just knew that I had to continue on and take steps."],[56,"Ultimately, I decided to have my ovaries removed. At first, it was very scary."],[61,"But then, it became very empowering, as in \"I could do something about this."],[64,"This doesn't have to be my destiny.\" I'm going to watch my kid grow up. I'm going to watch her do great things."]],
BbDIUIXPsqM:[[5,"My mom was diagnosed with breast cancer at age 38 and then two years after that my mom's younger sister was diagnosed with breast cancer as well."],[17,"After that point we started looking at our family history."],[19,"We started seeing this picture of, okay, so breast cancer seems to be kind of invading our family."],[25,"Since that time when I was eight years old and just being in hospitals and watching my mother undergo"],[32,"breast cancer surgery and radiation and chemotherapy once she was considered a survivor I was so thankful to the doctors who really saved her."],[44,"My mother was the first one to get tested in our family so she tested positive for BRCA2 and then my aunt got tested a year later and was tested positive for BRCA2 as well."],[54,"My mom presented the results to me and said, \"It's up to you."],[58,"If you want to get testing you can get BRCA testing but if you're not quite ready then wait.\" I went to a genetic counselor first."],[66,"She talked about our family history. She talked about what would happen if I tested positive."],[72,"My husband and I sat down and he was right next to me as I did the test."],[78,"And my doctor told me that, \"Marleah, you tested positive for BRCA2 and so now we need to figure out,"],[86,"you know, what your plan of action is for the future.\" Even though I had anticipated that I could test positive these test results would help me make decisions that would empower me as a patient."],[97,"My mom's experience was pretty much the main driving factor for me to pursue my PhD and ultimately be a professor."],[106,"I wanted to go to school and try to give back to the doctors who saved my mom's life but also to improve a"],[115,"cancer patient's experience and I'm able to say, \"You know, this affects me personally and let's do this together.\" It's empowering for me to be helping my community."]],
z4GezJiATLQ:[[1,"My cousin Veronica was diagnosed with breast cancer when she was 38 and she’s just a year older than I am."],[9,"In my family there are a total of six women who’ve been diagnosed with breast cancer."],[13,"Four of those women were under the age of 50 when they were diagnosed. The first person diagnosed was my Aunt Martha."],[21,"She was 39 years old and I was 19 years old."],[27,"Then when another aunt became diagnosed and then another one, it started becoming way too real."],[35,"I had the conversation about breast cancer before my son was born."],[39,"But once my kids were born everything just amplified I guess you could say."],[45,"All of a sudden now I have children to think of, I have children I want to be there for..."],[50,"Finding out that Veronica had cancer and us both having young children"],[56,"it also made me very aware of how I could possibly be the next person in my family to be honest."],[65,"I started talking to my doctor about it when they were asking me about family history"],[72,"and they found out how many aunts I have with breast cancer."],[78,"Knowing my family history of breast cancer helps me manage my own risk."],[82,"It can be hard to start this conversation with your family, particularly if they’re private."],[89,"If you have a family member who has a… a gift about talking to others, maybe you can use them to help relay the information to you."],[101,"My family history with breast cancer doesn't predict my future, but it does help me make more informed decisions about my future."]],
KiQhV2exiSs:[[0,"Emily: My name's Emily."],[2,"I grew up in DC and I've been back now six years since I graduated from college. Caroline: I'm Caroline and I'm a stay at home mom of two boys."],[11,"Emily: Caroline is my older sister so in general I go to her for advice with different things in life. Caroline: Auntie Em is amazing with the kids."],[19,"She's an awesome aunt, and she just really loves them. My mom was diagnosed with cancer January 2012."],[27,"And that was actually the year I was engaged and planning our wedding."],[32,"She had tripled negative breast cancer. My mom was a BRCA mutation carrier. I was like, \"I need to know.\" So I went in and I met with a counselor."],[43,"She went over all my risks. You know, it was a fifty-fifty chance I could get it or not."],[47,"I took the test, and was positive for the BRCA2 mutation. Emily: So I just decided that I would do the same. I also found out that I had tested positive."],[56,"I had my sister who went through it and we're really close so I had that person to kind of talk to about more of the emotional side."],[64,"Caroline: When I began the monitoring process I had the mammogram and the breast MRI and they found something suspicious."],[71,"My doctor said that she would like to do a surgical biopsy to test it further."],[75,"At that point I said, \"well if I'm going under, let's just do it.\" So I decided at that moment to have a bilateral prophylactic mastectomy."],[83,"I didn’t want to be so anxious, so that’s why I decided to go that route because it would’ve just been on my mind."],[89,"Emily: It was a really good decision for her, but you know, it’s not a casual surgery."],[94,"Being single and young and not really knowing what my future held, I knew that I wanted to just continue with surveillance."],[102,"I didn’t feel settled enough to really take that on or didn’t feel emotionally ready for it. But as I’m getting older now, I kind of feel like I’m getting there."],[111,"Caroline: I think Emily’s on a great path and we’re both very supportive of one another."],[116,"My mom’s always been very, like, “You gotta do what’s right for you...\" Go with your instinct. Everybody’s different, everyone’s unique and you,"],[122,"you gotta take all the data and your life and what’s going on and kind of figure out what works best for you."]],
W4nPBew9Bh8:[[0,"Gloria came into my life when I was going through breast cancer."],[10,"The universe, whatever energy brought us together."],[15,"It was meant to happen because I don't know if she realized how much it means to have her in my life."],[22,"I'm just so grateful I've met her in my life because everyone needs a Sally in their life."],[28,"And a Gloria too. I was 26 and I felt a lump, a small lump."],[40,"When I got the call from my doctor saying that I had breast cancer, I was in shock, honestly."],[47,"I don't have a significant family history of breast cancer, and so it wasn't even on my mind or radar, you know?"],[56,"In my mind, I think older people get cancer. For me, it was my kid."],[63,"So I said whatever it takes, you know, I'll do it for her."],[68,"I already knew my marriage was struggling and I just couldn't imagine leaving her."],[76,"Meeting Gloria changed everything really because I had someone who's on my team."],[84,"When I met Sally, she was actually in the process of her divorce."],[88,"When I found out about the cancer was when she invited me to go with her to her first treatment."],[95,"Even if she goes through like her procedures, I always make sure like, okay, we have to go out and just laugh about it."],[103,"So this little memories we get and little moments, it's just worth celebrating it."],[110,"Life would be so boring without Gloria."],[114,"I would tell someone who is going to support"],[121,"someone else through this journey they have to take care of themselves because if you are not well within yourself, there's nothing you can give to someone else."],[131,"The most important thing is just being there during their treatments, during the time where they feel that they're going through a lot."],[139,"It's just showing up."],[140,"It has made a difference to know that I have someone I could call, even in like a pinch, we can make time to connect."],[149,"It's hard to ask for support sometimes because you don't wanna come off as weak"],[156,"or needing anything or from anyone, however, like you do. You need a community. What's next, girl? What's next?"],[164,"You tell me! Definitely planning on traveling a lot. Yeah. Traveling. Mm-hmm. Miami's next."],[172,"Yes. Hey!"]],
rNHBh0dQDrg:[[2,"My name's Andrea Evan Delaplain, and I live in Winlock, Washington. It's a small, tight knit community."],[10,"It's very difficult to recruit providers to rural communities or small communities."],[15,"You know, you look at the underserved populations that we work with, and they are so focused on trying to feed their children, trying to get to work."],[24,"All of the other priorities that they have in their lives, that their own personal health care tends to get pushed aside."],[31,"We just didn't have the money. My husband lost his job."],[34,"So we were basically living on unemployment, but we couldn't even make our mortgage payments."],[40,"People are scared when they have limited resources, and they're maybe facing a really horrendous health issue."],[50,"But because of the lack of resources, don't take action."],[57,"I think I was more worried about how am I going to pay for this than having the breast cancer. The immediate thought is, now what?"],[64,"We've got people out in the community who are there to assist and help them on that journey in a way that makes them feel supported and safe."],[74,"We worked through a series of regional partners to implement our program here in Washington."],[80,"Each of those partners have patient navigators on staff, that then work to identify what barriers a woman is facing and then provide services to help the woman overcome those barriers."],[95,"I'm generally the second call that they get after hearing the news that they have cancer."],[101,"And so I was there to help put her mind at ease and let her know that she was still going to be able to get treatment for her breast cancer."],[112,"We're not just screening women and then saying, oh, you have cancer, now figure it out for yourself."],[119,"Dawn walked me through the process, and she just really kind of gave me a lot of emotional support and assuring me that, you know, I wouldn't have to worry about the financial part of this."],[132,"If I can take that fear, help to take that fear away because of our program, it means the world to people."],[140,"We're providing essential services, essential lifesaving services to a population that might otherwise not get them."],[148,"The mammogram, because it was caught early, gave me a fighting chance to beat this."],[154,"In this program, we have diagnosed close to 3,000 cancers. We've performed close to 300,000 mammograms."],[162,"It feels good to really be able to impact the lives of others and know that with an early diagnosis, these cancers are very, very treatable, and it doesn't have to be a death sentence."]],
dmkM1jcluic:[[12,"Mississippi, has its fair share of challenges in terms of access to care, and that is across all types of health care."],[21,"Well, it's very rural."],[24,"Health care is very hard to come by, especially as hospitals and clinics are closing and physicians are, you know, leaving the area."],[34,"It's just really hard for patients to get transportation to go someplace."],[39,"You have people who is not working or can’t afford the insurance that they job is offering and they not going to the doctor and getting the services done because it costs money."],[52,"Basically, you have to choose between going to the doctor or feeding your family."],[58,"The breast and cervical cancer program is very fortunate to have the opportunity to partner with about 180 enrollment sites and patient navigation sites throughout the state."],[70,"They are the hands and feet of this program."],[73,"They are the ones who identify the women who could be eligible for our programs and then in turn, enroll them in our service so that we can absorb the cost of the screening and diagnostic services that they might need."],[86,"A number of our clinics are located in communities where we are the only health care provider that they have to access."],[95,"Plan A community health workers are vital to getting the information out to the communities about the Plan A clinic and the mobile van."],[107,"All the workers, they are here from the Mississippi Delta."],[110,"So we are able to spread the word ourselves and then like the ones who have trusted us and have came on, they spread the word also in the community."],[120,"They can really get very targeted in their efforts, so that we're sure we get the right women in for the right service at the right time."],[129,"Before the breast and cervical cancer program, low income and uninsured patients were challenged to get"],[136,"some of the services provided. Now there's a lot more case management available to navigate the patient through the medical system."],[145,"Mississippi is called to be really resourceful and really dig into the depths of which partnerships, which relationships we can leverage and optimize to get work done."],[157,"We have to meet people where they are. We are serving generations of patients."],[163,"We've had patients that when they came, they were babies. Now we are seeing the their babies."],[172,"And so, it’s through our patients that we know that we are really making a difference."],[178,"I make a difference by being there for my patients, educating my patients, and offering preventive services for free."],[189,"Anything that they need, I'm there for them. Mississippi is a fighter."],[194,"We are scrappy here, and we're challenged again and again and again to meet a demand, meet a challenge, and pull resources together from places you wouldn't expect."],[206,"We’re making sure people get the access to care that they need, whatever that might be."]],
Aq33ve134us:[[1,"Yá'át'ééh! I'm Curtis Briscoe, program director of the Navajo Nation Breast and Cervical Cancer Prevention Program."],[9,"The Navajo language is an important part of the culture. We have bilingual staff out in the field. They're the key to this program."],[17,"Most of our health care providers come from different places, and they're not native speakers."],[25,"There is always a language barrier. The first six months I was here, people just kind of watched me. Then when they realized that I cared about them, they put up with a lot."],[35,"They put up with, you know, poor pronunciation or the fact you don't speak their language well, but they know your trying. And they know you care."],[44,"Our staff are able to translate medical terms."],[48,"For example, one of the things that's really difficult to translate is the word breast cancer."],[54,"Putting together two words, which is breast and cancer, it's almost like having to do a whole sentence structure."],[62,"You're having to explain the cancer first and then the body organ or the body part."],[69,"The old term that they were using in Navajo, in the Navajo language was łóód doo nádziihii If you translate that into English, it's a sore that won't heal."],[80,"So if it's not going to heal, that means death."],[84,"We looked at more ways of trying to rephrase what it is we're actually trying to say."],[90,"We even have it broken down to where each section we have the English translation for it on our website"],[97,"that we posted up there for anybody who wants to take a look at how we specify breast cancer and cervical cancer. And the English translation of each of the terms."],[106,"We have to be bilingual. Navajo speaking and English speaking just to get across to our clients, especially the older population."],[118,"A lot of times it's about building that relationship with them."],[121,"And a lot of them might live alone or live way off the road, and they they want to interact with people."],[129,"So you might drive several miles off the road to one house. Then you want to go to the next house."],[134,"You got to drive several more miles on the same dirt road, then maybe turn off on another dirt road to reach that house."],[140,"So it's very difficult distance wise, not just for us to reach them, for them to reach services as well."],[147,"We have to almost promote our program and gain the trust of these women that are coming through our program for preventative screening."],[156,"Our mobile mammography effort is to make sure that we reach as many community clinics as possible here on Navajo."],[167,"We call it the Boob Bus here. And my patients actually love that. The Boob Bus is coming next month, and we need to get you on it."],[176,"Without that effort, without the infrastructure that we've created, then it would be very difficult for women to get screening services."],[185,"In the end, we're saving women's lives."],[189,"We're saving them to be able to continue on with their families, to provide for their families."]],
e0xvP8PzSho:[[2,"My name is Mary Dinon, and I am a nurse case manager for the Breast and Cervical Grant."],[9,"My name's Pam Sloper. I'm an RN case manager at the SEARHC Haines Health Center."],[15,"Some of the challenges and barriers to care that happen here on Prince of Wales is travel."],[22,"Prince of Wales Island in Alaska is the third largest island in the United States. So it's a pretty big area that we serve."],[31,"Communities that we do provide services for are very rural, very isolated. These communities are not connected by any kind of a road system."],[41,"To get from my house to the road, I would have to take a boat, about two miles by water."],[48,"Our services here on the island get pretty iffy at times. Sometimes you can't make the appointments because the path would be too icy."],[57,"We've not had a mammogram machine in our clinic up until recently."],[63,"Prior to that, the only way a woman could get a mammogram on the island was through coming to the once a year van."],[72,"We have had the ferry break down, have reduced services which delayed the mammogram van. We've had the mammogram van break down."],[82,"So this grant allows women to be able to get the services right here."],[87,"Being here and needing medical attention, you do want somebody that really is interested in you as a person."],[95,"And I found mine in Mary Dinon who is a nurse at the SEARHC clinic."],[102,"I was like to the point of tears when I found out I have cancer. Mary was a great support, gave information all along the way."],[112,"If I have ever had a question, I contact her. You just heard you have cancer. Let's go back to my office and talk about it."],[120,"Let's absorb what you were just said. What questions do you have? What can I do for you now? We're in this together."],[129,"If I wouldn't have had Mary to encourage me to get the mammogram and get the screening, I would have never found out that I had stage one breast cancer."],[141,"It would have been devastating not to have anyone to ask questions and answer them and put my mind at ease."],[149,"I feel like I know, if not by face, by name, every woman on this island, especially between the age of 30 and 64."],[160,"I like to think out of the box when it comes to helping women. I don't ever really say that's not in my job description."],[168,"And so I like to take the person."],[170,"And as much as they'll allow me to at least get to where they need to be for the care they need."]],
uoh3_RLUPCU:[[0,"I had cancer, cancer did not have me, and I lived through it and I'll continue to live."],[16,"My name is Micha and I am, actually, this is my 10th year anniversary for being a breast cancer survivor."],[24,"And basically, I didn't know anything about it. Wasn't in my family. Took every gene test under the sun."],[30,"So, it was a, it was a learning experience to say the least. I was 31 when I was diagnosed."],[37,"Interesting enough, I had just met somebody."],[40,"And so I'm like, \"How am I gonna tell this man that I have breast cancer?\" And we've only known each other a few months."],[49,"I felt like I was a problem, like I had to do more, that I had to prove myself as a woman more."],[56,"Going through chemo, like, \"No, I'm good."],[59,"We can go do this, we can go do that.\" And I wasn't good."],[63,"I remember one time I went over to his apartment and before I even walked in, I literally jumped out of my car and I'm vomiting."],[71,"And by the time he opened the door, I'm like, \"Hey,\" of course, I'm like, \"I need to go to the bathroom real quick,\" just to, he had no idea."],[77,"I had to learn to let people love me through the process. I'm such an independent person, I can do it by myself."],[86,"I know, you know, but I had to, this process taught me how to let people be there for me."],[92,"But more than anything, I think I've just dived into my career so that I don't even have to be vulnerable in that relationship space."],[103,"I went to work every single day, except for the days that I had chemo."],[106,"When I finally made the decision after I was halfway through my treatment that I was gonna make the announcement on air, I'll never forget the men at my job,"],[115,"all walked through the door with their heads shaved, and they all stood behind me while I announced over the airwaves what I was going through."],[126,"And, to have that support at that time, you know, I was just like, \"Whoa.\""],[135,"Each one of us have a different journey and we're still here so that we can be purposeful for younger women and to keep talking about it for younger women."],[145,"This is what breast cancer looks like."],[149,"It's not your grandmother's disease, it is not your aunt's disease. It's the girl at the grocery store, the girl at the mall. It does not discriminate."],[158,"Age or race, it does not discriminate. For sure."],[163,"If a young woman came to me, I would say, \"Be honest about how you feel."],[170,"Don't feel guilty for being angry, upset."],[174,"Don't feel guilty for crying, but don't stay there because you got a fight ahead of you and you got things to do."],[183,"And even in the midst of it, you have a life to live. Live your life, baby girl."],[188,"Live your life.\""]],
UwXOKzsEUsk:[[0,"I have metastatic breast cancer, or stage four breast cancer."],[3,"I don't, like, hustle at jobs anymore, but I do, like, hustle at time with the people that I love."],[11,"Hi, I am Megan."],[23,"I was probably 29 at the time that I started getting a weird pain in my chest that wasn't normal for me. And I had a lot of barricades trying to get to a doctor."],[32,"I didn't have insurance at the time. I didn't have a doctor I could go to."],[35,"So, I finally saw one and they kind of dismissed me because I didn't have a family history of breast cancer and because of my age."],[43,"So, it took a long time for me to finally go to another doctor and get diagnosed."],[47,"But I was diagnosed at age 30 with invasive ductal carcinoma."],[51,"I went through chemo, double mastectomy, radiation, reconstruction."],[56,"And then I was living blissfully, no evidence of disease for like four and a half years, thinking, you know, cancer was behind me."],[63,"And then I felt a pain again, which ended up leading to a secondary diagnosis."],[68,"So I have metastatic breast cancer, or stage four breast cancer."],[72,"And people don't how to support you when you're stage four, because they go, \"you might need a wig,\" or you know, \"you might need a meal train.\" But when you're like, \"I'm gonna need support"],[80,"for the rest of my life,\" people don't- I don't even know how to communicate how to support that. You know, I'm still trying to figure it out."],[87,"And even when you don't have stage four, cancer is a life sentence."],[93,"You don't get to just say: \"I'm over and done.\" You're always getting a test. You're always keeping it in the back of your mind."],[99,"Because me keeping cancer in the back of my mind is what is making me be so well now as a stage four cancer survivor."],[105,"Because I noticed my signs and I said, \"I have to go get tested, something's not right.\" When I was first diagnosed, I was married."],[114,"And then after everything I went through, like literally felt like I became a new human, and I kind of knew what I needed, and I knew what I deserved."],[122,"And as soon as I wasn't getting that, I was like, \"All right, I'm out.\" Like starting fresh."],[125,"I wanted any relationship that I had after cancer to be just honest. So I went on a blind date. My goal was I want to give him all of my stuff."],[134,"You either are with it and you understand that my breast cancer journey was amazing and hard and brutal and you're either gonna love me through it and for it or you're never going to."],[146,"So I was like, here's all the reasons why you should run."],[148,"So yeah, so we're happily married."],[154,"We got engaged the day before I started my first line of treatment."],[160,"When it comes to work life balance, I can't work full time because the disease is where it is, and also my participation in clinical trials,"],[170,"there's no nine-to-five that would be like, \"Yeah, take every other Tuesday off.\" And, you know, \"Every other month take all this time off for tests.\""],[178,"But the thing, I don't, like, hustle at jobs anymore, but I do, like, hustle at time"],[186,"with the people that I love, and I do prioritize that."],[190,"And even, my husband could definitely work more days of the week, but we're like, you know what? Like, time is our currency."],[201,"I'm metastatic, but I could live a full life. Like, I'm hopeful for that."],[205,"What I can do is I can prioritize time with the people that I love."],[209,"And that's- And I don't think I, no matter how much time on earth I have left, I don't think I'm ever gonna be sad that I made that decision for myself."],[219,"Now, I might not have all the money in the world, but you know, I am prioritizing happiness and I am happy at the end of the day."]],
"ovvSRK-tqaw":[[0,"I mean, first point out the devastation that is: I am a young woman. I was 25."],[5,"So first of all, like, this is what breast cancer looks like."],[9,"And second, I think I would just say, like the fighting is a lot easier than the surviving, in my opinion."],[16,"I'm Taylor, I'm 27."],[30,"I am a year and a half breast cancer survivor. I was 25 when I was diagnosed. I can't imagine."],[38,"I was 31. But finding out 20, you're in your 20s."],[42,"But I think, like, in your 20s and having had a mastectomy, learning to like look at your body in the mirror and you can feel and what you can't feel and realizing like,"],[51,"oh, I can't feel a whole part of my breast, and then you tack on medications."],[55,"So, with the low to no estrogen in your body, like your libido is naturally being inhibited."],[61,"You're trying to figure out yourself and what works for you intimately while you also maybe have a partner doing that. Sharing your body with a new human is so difficult."],[70,"You can't just like touch my chest."],[72,"'cause I don't, if I don't know where your hands are, it feels, it's too shocking to my system. It takes me back to like mastectomy days."],[79,"So like, I am queer, which brought a whole new level to it. In terms of being, you know, with a woman at the time, I didn't have that, like, \"I need to explain to you what breast cancer is."],[91,"I need to explain to you the gravity of what just happened to my body.\" I think instinctively, like, a woman does understand that."],[98,"On the flip side, I don't think I was prepared for, like how sad that could be, of like I'm now seeing another woman's body or that she does not have a mastectomy, you know?"],[107,"So that is, in itself, a little heartbreaking and something that I think, you know, you have to learn to navigate or I have to learn to navigate."],[117,"I'm a travel nurse, so when I got diagnosed, I ultimately decided I needed to move home for treatment."],[123,"And so, at 26, I moved back in with my parents and kind of felt like a child again."],[130,"Giving up all the independence, especially when you physically need the help from them."],[136,"And it does, it makes you emotional no matter how much time goes past."],[139,"But you know, and you think, I'm 26, and if I want to connect with my mom,"],[148,"how do I tell her, like, you need to spend more time thinking about the possibility of your child dying, you know?"],[156,"That is a pain I would never wish on somebody."],[161,"I remember a few weeks ago I started meeting with a new therapist and she asked like, \"Do you think it's made you a better nurse?\""],[167,"And like, without hesitation, I could say, \"yes.\" The people at your appointments who make a difference,"],[175,"you know, the nurse who's there who tells you like, \"I had breast cancer, too.\" Or, you know, I remember when I went for my mastectomy"],[184,"and the anesthesiologist was maybe 40 and a breast cancer survivor."],[189,"And just to hear her share that before going in for a mastectomy at 25, it changed the course of the day for me."],[199,"And it's something I remember now."],[200,"And so, when I think back on some of the situations I used to sit in"],[208,"and the lack of care or attention I paid to the person who's laying on the table, it's something I think I am pretty ashamed of."],[217,"But when I think about the life experience that this has all given me- I know what it feels like to want any sort of relatability"],[228,"or to just have your hand held when somebody's doing a procedure."],[232,"I think is, like, a different a different sense of identity I think I carry with myself at work now."],[241,"To a young woman, if diagnosed, I think I would just say, like, the fighting is a lot easier than the surviving, in my opinion."],[251,"What comes after, when there's no more plan, when there's less frequent doctor's visits, when there's less support from the people around you."],[259,"And set yourself up for success. Learn to be vulnerable."],[263,"Learn to tell people when you're really not doing as great as it might seem on the outside. And learn to just be authentically you."]]};


/* ---------- real survivor videos (official YouTube channels, embedded, never re-hosted) ----------
   One per row, in row order. len = video length in seconds. */
const CDC='CDC',ACS='American Cancer Society';
const R=(en,es,pa)=>({en,es,pa});
const SALLY={id:'W4nPBew9Bh8',name:'Sally and Gloria',src:CDC,len:181,role:R('Survivor and her best friend','Sobreviviente y su mejor amiga','ਸਰਵਾਈਵਰ ਅਤੇ ਉਸਦੀ ਪੱਕੀ ਸਹੇਲੀ')};
const NAVAJO={id:'Aq33ve134us',name:'Navajo Nation program',src:CDC,len:199,role:R('Care in the Navajo language','Atención en idioma navajo','ਨਵਾਹੋ ਭਾਸ਼ਾ ਵਿੱਚ ਦੇਖਭਾਲ')};
const MISS={id:'dmkM1jcluic',name:'Mississippi program',src:CDC,len:220,role:R('Free screening in rural towns','Detección gratis en pueblos rurales','ਪੇਂਡੂ ਕਸਬਿਆਂ ਵਿੱਚ ਮੁਫ਼ਤ ਜਾਂਚ')};
const VIDEOS={
 hurt:[
  {id:'eNoUJ5NU1Zk',name:'Erica Bradford',src:'Brookwood Baptist Health',len:280,role:R('Shares how her mammogram felt','Cuenta cómo sintió su mamografía','ਦੱਸਦੀ ਹੈ ਕਿ ਉਸਦਾ ਮੈਮੋਗ੍ਰਾਮ ਕਿਵੇਂ ਲੱਗਿਆ')},
  {id:'ufdLMhC8kIc',name:'Dr. Jen Caudle',src:'Dr. Jen Caudle',len:307,role:R('Family physician','Médica de familia','ਫ਼ੈਮਿਲੀ ਡਾਕਟਰ')},
  {id:'59Vf3uOizlE',name:'Danielle Smith',src:'Danielle Smith',len:154,role:R('Takes you to her mammogram','Te lleva a su mamografía','ਤੁਹਾਨੂੰ ਆਪਣੇ ਮੈਮੋਗ੍ਰਾਮ ’ਤੇ ਨਾਲ ਲੈ ਜਾਂਦੀ ਹੈ')},
  {id:'bVWWrLeBXeY',name:'Doris Jones',src:ACS,len:248,role:R('Oncology nurse and survivor','Enfermera de oncología y sobreviviente','ਓਨਕੋਲੋਜੀ ਨਰਸ ਅਤੇ ਸਰਵਾਈਵਰ')},
  SALLY,
  {id:'di8XghAi7t0',name:'Carletta',src:CDC,len:163,role:R('Survivor, 10 years','Sobreviviente, 10 años','10 ਸਾਲਾਂ ਤੋਂ ਸਰਵਾਈਵਰ')}],
 family:[
  {id:'KNzRNWi4Qgc',name:'Jackie',src:CDC,len:76,role:R('Took action for her daughter','Actuó por su hija','ਆਪਣੀ ਧੀ ਲਈ ਕਦਮ ਚੁੱਕਿਆ')},
  {id:'BbDIUIXPsqM',name:'Marleah Long',src:CDC,len:154,role:R('Inspired by her mom','Inspirada por su mamá','ਆਪਣੀ ਮਾਂ ਤੋਂ ਪ੍ਰੇਰਿਤ')},
  {id:'z4GezJiATLQ',name:'Lisa',src:CDC,len:115,role:R('Six women in her family','Seis mujeres en su familia','ਉਸਦੇ ਪਰਿਵਾਰ ਦੀਆਂ ਛੇ ਔਰਤਾਂ')},
  {id:'KiQhV2exiSs',name:'Emily and Caroline',src:CDC,len:131,role:R('Sisters','Hermanas','ਭੈਣਾਂ')},
  SALLY],
 cost:[
  {id:'rNHBh0dQDrg',name:'Andrea, Winlock, WA',src:CDC,len:180,role:R('Free screening, help with costs','Detección gratis y ayuda con los costos','ਮੁਫ਼ਤ ਜਾਂਚ, ਖਰਚੇ ਵਿੱਚ ਮਦਦ')},
  MISS,
  {id:'UwXOKzsEUsk',name:'Megan',src:CDC,len:231,role:R('Had no insurance at first','Al principio no tenía seguro','ਸ਼ੁਰੂ ਵਿੱਚ ਬੀਮਾ ਨਹੀਂ ਸੀ')},
  NAVAJO],
 getting:[
  {id:'e0xvP8PzSho',name:'Mary and Pam, Alaska',src:CDC,len:180,role:R('Nurses on a remote island','Enfermeras en una isla remota','ਦੂਰ-ਦੁਰਾਡੇ ਟਾਪੂ ’ਤੇ ਨਰਸਾਂ')},
  NAVAJO,
  MISS],
 after:[
  {id:'uoh3_RLUPCU',name:'Micha',src:CDC,len:196,role:R('Survivor, 10 years','Sobreviviente, 10 años','10 ਸਾਲਾਂ ਤੋਂ ਸਰਵਾਈਵਰ')},
  {id:'UwXOKzsEUsk',name:'Megan',src:CDC,len:231,role:R('Living with stage 4','Vive con cáncer en etapa 4','ਚੌਥੀ ਸਟੇਜ ਨਾਲ ਜੀਅ ਰਹੀ ਹੈ')},
  SALLY,
  {id:'ovvSRK-tqaw',name:'Taylor',src:CDC,len:281,role:R('Diagnosed at 25, travel nurse','Diagnosticada a los 25, enfermera','25 ਸਾਲ ਦੀ ਉਮਰ ’ਚ ਪਤਾ ਲੱਗਿਆ, ਨਰਸ')}]};

/* ---------- progress state (in memory: a reload starts a fresh demo) ---------- */
const DONE={};
const CLK={k:null,tp:'hurt',i:0,t:0,dur:30};
let JUST=null,YT={id:null,state:-1,last:0,since:0,frame:null,ready:false,born:0,q:[],played:false};
const key=(tp,i)=>tp+':'+i;
const fmt=s=>{s=Math.max(0,Math.floor(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
const topicOf=id=>TOPICS.find(o=>o.id===id)||TOPICS[0];
const vidFor=(tp,i)=>{const l=VIDEOS[tp]||VIDEOS.hurt;return l[i%l.length]};
const doneCount=tp=>{let n=0;for(let i=0;i<topicOf(tp).n;i++)if(DONE[key(tp,i)])n++;return n};
const firstUndone=tp=>{const n=topicOf(tp).n;for(let i=0;i<n;i++)if(!DONE[key(tp,i)])return i;return 0};
const isStatic=()=>document.body.classList.contains('static');
const noQ=s=>String(s).replace(/[?？]$/,'').replace(/^¿/,'');
const cur=()=>vidFor(CLK.k?CLK.tp:'hurt',CLK.k?CLK.i:0);
const thumb=id=>`https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
const vav=(v,s)=>`<span class="bf-av" style="width:${s}px;height:${s}px"><img src="${thumb(v.id)}" alt=""></span>`;
const ytLink=v=>`https://www.youtube.com/watch?v=${v.id}&t=${Math.floor(CLK.t)}s`;
const YTICON='<svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true"><rect width="16" height="12" rx="3" fill="#ff0033"/><path d="M6.4 3.4v5.2L10.6 6z" fill="#fff"/></svg>';
function startClip(tp,i){const k=key(tp,i);
 if(CLK.k!==k||CLK.t>=CLK.dur){CLK.k=k;CLK.tp=tp;CLK.i=i;CLK.t=0;CLK.dur=vidFor(tp,i).len}
 S.topic=tp;S.pid=i;S.playing=true}

/* ---------- one persistent YouTube player, so sound keeps going across video and transcript views ---------- */
function ytSend(func,args){const f=YT.frame;if(f&&f.contentWindow)f.contentWindow.postMessage(JSON.stringify({event:'command',func,args:args||[],id:'bf',channel:'widget'}),'*')}
function ytCmd(func,args){if(!YT.ready){YT.q.push([func,args]);return}ytSend(func,args)}
function ytReady(){if(YT.ready)return;YT.ready=true;const q=YT.q;YT.q=[];q.forEach(([f,a])=>ytSend(f,a))}
function ytBox(){if(!app)return null;let b=app.querySelector('#bf-yt');
 if(!b){b=document.createElement('div');b.id='bf-yt';app.insertBefore(b,app.querySelector('#sh'));YT.id=null;YT.frame=null}return b}
function syncYT(){const b=app&&app.querySelector('#bf-yt');
 if(!S||S.s!=='player'||isStatic()||!CLK.k){if(b){b.classList.remove('on');if(YT.frame)ytCmd('pauseVideo')}return}
 const box=ytBox(),v=cur();box.classList.toggle('on',S.mode==='video');
 if(YT.id!==v.id){YT.id=v.id;YT.state=-1;YT.ready=false;YT.q=[];YT.born=Date.now();YT.played=false;capLine=-2;
  box.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${v.id}?autoplay=${S.playing?1:0}&controls=0&disablekb=1&fs=0&iv_load_policy=3&playsinline=1&rel=0&enablejsapi=1&start=${Math.floor(CLK.t)}&origin=${encodeURIComponent(location.origin)}" title="${esc(v.name)}" allow="autoplay; encrypted-media"></iframe><div class="poster bf-ph"><img class="bf-thumb" src="${thumb(v.id)}" alt=""><span class="bf-load"><i></i>${t('loading')}</span></div><div class="bf-cap"><p></p></div><a class="bf-ytpill" href="${ytLink(v)}" target="_blank" rel="noopener">${YTICON}YouTube</a>`;
  YT.frame=box.querySelector('iframe');
  YT.frame.addEventListener('load',()=>{let n=0;const h=setInterval(()=>{if(YT.ready||n++>40){clearInterval(h);return}YT.frame&&YT.frame.contentWindow.postMessage(JSON.stringify({event:'listening',id:'bf',channel:'widget'}),'*')},250)})}
 else ytCmd(S.playing?'playVideo':'pauseVideo');
 const pill=box.querySelector('.bf-ytpill');if(pill)pill.href=ytLink(v)}
addEventListener('message',e=>{if(!YT.frame||e.source!==YT.frame.contentWindow)return;let d;try{d=typeof e.data==='string'?JSON.parse(e.data):e.data}catch(_){return}
 if(d&&(d.event==='onReady'||d.event==='infoDelivery'||d.event==='initialDelivery'))ytReady();
 const info=d&&d.info;if(!info)return;
 if(typeof info.playerState==='number'){if(info.playerState===1&&YT.state!==1)YT.since=Date.now();YT.state=info.playerState;updPoster();if(YT.state===0&&CLK.t<CLK.dur)finish()}
 if(typeof info.currentTime==='number'&&CLK.k&&YT.id===cur().id&&YT.state===1){YT.last=Date.now();CLK.t=Math.min(CLK.dur,info.currentTime);paint();if(CLK.t>=CLK.dur-.4)finish()}});
function updPoster(){const b=app&&app.querySelector('#bf-yt');if(!b)return;const on=YT.state===1&&S.playing&&Date.now()-YT.since>1500;if(on)YT.played=true;b.classList.toggle('playing',on);b.classList.toggle('held',!on&&YT.played)}
const _render=render;render=function(a){_render(a);syncYT();updPoster();
 const b=app&&app.querySelector('#bf-yt');if(b&&a==='rise'&&S.s==='player'){b.style.animation='none';void b.offsetWidth;b.style.animation='rise .4s var(--ease)'}
 if(S&&S.s==='player'){paintTranscript(true);paintCaption(true)}};

/* ---------- pieces ---------- */
playbar=function(){const v=cur(),tp=CLK.k?CLK.tp:'hurt';
 return `<div class="playbar">
 <button class="info" data-a="player" aria-label="${esc(v.name)}"><span style="position:absolute;left:-2px;top:-1px">${vav(v,40)}</span>
 <span class="tt"><b>${noQ(t(tp))}: ${esc(v.name)}</b><small class="bf-pt">${fmt(CLK.k?CLK.t:0)}/${fmt(v.len)}</small></span></button>
 <span class="ctl"><button data-a="player" aria-label="${t('play')}">${img('btn-play-navy.svg',32)}</button><button data-a="sheet:playlist" aria-label="${t('list')}">${img('btn-list.svg',32)}</button></span></div>`};

function trackHTML(frac){const n=BARS.length,on=Math.floor(frac*(n-1));
 return BARS.map((h,i)=>`<i class="${i<=on?'p':''}" style="height:${h}px"></i>`).join('')+`<u style="left:${17+frac*306}px"></u>`}
const PREV='<svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true"><rect x="5" y="6" width="3.2" height="18" rx="1.6" fill="#f4f1ec"/><path d="M24.5 7.9v14.2c0 1.5-1.7 2.4-2.9 1.6L11.3 16.6a1.9 1.9 0 0 1 0-3.2l10.3-7.1c1.2-.8 2.9.1 2.9 1.6z" fill="#f4f1ec"/></svg>';
const NEXT='<svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true"><rect x="21.8" y="6" width="3.2" height="18" rx="1.6" fill="#f4f1ec"/><path d="M5.5 7.9v14.2c0 1.5 1.7 2.4 2.9 1.6l10.3-7.1a1.9 1.9 0 0 0 0-3.2L8.4 6.3c-1.2-.8-2.9.1-2.9 1.6z" fill="#f4f1ec"/></svg>';
function ctrlHTML(){const done=CLK.k&&DONE[CLK.k]&&CLK.t>=CLK.dur,i=CLK.k?CLK.i:0,n=topicOf(CLK.k?CLK.tp:'hurt').n;
 const prev=`<button class="bf-skip" data-a="prev" aria-label="${t('prevS')}">${PREV}</button>`,next=`<button class="bf-skip" data-a="next" aria-label="${t('nextS')}" ${i>=n-1?'disabled':''}>${NEXT}</button>`;
 if(done)return `${prev}<span class="bf-mid"><span class="bf-donepill">${check('#1d2567',18)}${t('marked')}</span></span>${next}`;
 return `${prev}<span class="bf-mid"><button data-a="seek:-10" aria-label="${t('back10')}">${img('btn-back10.svg',48)}</button><button data-a="toggle" aria-label="${t(S.playing?'pause':'play')}">${S.playing?img('btn-pause.svg',48):`<svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true"><path d="M14 8.5c0-2 2.2-3.3 4-2.2l24 15.5c1.6 1 1.6 3.4 0 4.4L18 41.7c-1.8 1.1-4-.2-4-2.2z" fill="#f4f1ec"/></svg>`}</button><button data-a="seek:10" aria-label="${t('fwd10')}">${img('btn-fwd10.svg',48)}</button></span>${next}`}
let lastLine=-2;
function paintTranscript(force){const ts=app&&app.querySelector('#scr .ts[data-tx]');if(!ts)return;
 const ps=[...ts.querySelectorAll('p[data-s]')];let idx=-1;ps.forEach((p,i)=>{if(+p.dataset.s<=CLK.t+.1)idx=i});
 const now=ps[idx];if(now){const a=+now.dataset.s,b=+now.dataset.e;const ws=now.children,k=Math.ceil(Math.min(1,Math.max(0,(CLK.t-a)/Math.max(.5,b-a)))*ws.length);for(let j=0;j<ws.length;j++)ws[j].classList.toggle('w',j<k)}
 if(idx===lastLine&&!force)return;lastLine=idx;
 ps.forEach((p,i)=>{p.classList.toggle('past',i<idx);p.classList.toggle('now',i===idx);p.classList.toggle('next',i>idx)});
 const target=ps[Math.max(0,idx)];if(target)ts.scrollTo({top:Math.max(0,target.offsetTop-ts.clientHeight*.32),behavior:force?'auto':'smooth'})}
let capLine=-2;const CAPS={};
/* break each transcript line into one sentence (or short phrase) at a time, timed by length */
function capsFor(v){if(CAPS[v.id])return CAPS[v.id];const lines=TX[v.id];if(!lines)return null;const out=[];
 lines.forEach(([st,txt],i)=>{const end=i+1<lines.length?lines[i+1][0]:Math.min(v.len,st+txt.length*.075);
  let parts=(txt.match(/[^.!?]+[.!?]+["”’]?|[^.!?]+$/g)||[txt]).map(x=>x.trim()).filter(Boolean);
  const cut=x=>{if(x.length<=64)return[x];const c=x.indexOf(', ',x.length/3);if(c>0&&c<x.length-15)return[...cut(x.slice(0,c+1)),...cut(x.slice(c+2))];
   const w=x.split(' '),n=Math.ceil(x.length/56),per=Math.ceil(w.length/n),r=[];for(let k=0;k<w.length;k+=per)r.push(w.slice(k,k+per).join(' '));return r};
  parts=parts.flatMap(cut);
  const total=parts.reduce((a,x)=>a+x.length,0)||1;let tt=st;parts.forEach(x=>{out.push([tt,x]);tt+=(end-st)*x.length/total})});
 return CAPS[v.id]=out}
function paintCaption(force){const cap=app&&app.querySelector('#bf-yt .bf-cap');if(!cap)return;const lines=capsFor(cur());
 let idx=-1;if(lines)lines.forEach(([st],i)=>{if(st<=CLK.t+.1)idx=i});
 if(idx===capLine&&!force)return;capLine=idx;const txt=idx>=0?lines[idx][1]:'';
 cap.querySelector('p').textContent=txt;cap.classList.toggle('on',!!txt)}
function paint(){if(!app)return;paintCaption();const f=CLK.dur?Math.min(1,CLK.t/CLK.dur):0,v=cur();
 const tr=app.querySelector('#scr .track');if(tr)tr.innerHTML=trackHTML(f);
 const tm=app.querySelector('#scr .times');if(tm)tm.innerHTML=`<span>${fmt(CLK.t)}</span><span>−${fmt(CLK.dur-CLK.t)}</span>`;
 const c=app.querySelector('#scr .ctrl'),ch=ctrlHTML();if(c&&c.dataset.h!==ch){c.innerHTML=ch;c.dataset.h=ch}
 const pb=app.querySelector('.bf-pt');if(pb)pb.textContent=`${fmt(CLK.t)}/${fmt(v.len)}`;
 const nd=app.querySelector(`[data-now="${CLK.k}"]`);if(nd)nd.textContent=`${fmt(CLK.t)}/${fmt(v.len)}`;
 paintTranscript()}

/* ---------- screens ---------- */
V.topic=function(){const x=topicOf(S.topic),name=t(x.id),c=doneCount(x.id),all=c>=x.n;
 return `<div class="bar-head"><button data-a="back" aria-label="${t('back')}">${img('ic-back-navy.svg',28)}</button><b>${t('topicL')}${S.lang==='es'?name:name.replace(/\?$/,'')}</b><button data-a="share:0" aria-label="${t('more2')}">${img('ic-kebab-navy.svg',28)}</button></div>
 <div class="hero-topic" style="background:${x.bg};color:${x.ink}">${HERO[x.id]}<b style="position:relative;color:${x.ink==='#1d2567'?x.ink:'#fff'}">${name}</b><span style="position:relative">${c?t('heard',c,x.n):t('women',x.n)}</span>
 <span class="bf-prog" aria-hidden="true">${Array.from({length:x.n},(_,i)=>`<i class="${DONE[key(x.id,i)]?'on':''}"></i>`).join('')}</span>
 <button class="abs" style="left:298px;top:39px" data-a="playnext" aria-label="${t('play')}">${img(`btn-play-40-${x.id}.svg`,40)}</button></div>
 <div class="scroll" style="top:247px;padding:0 16px 170px">
 ${all?`<button class="bf-all press" data-a="steps"><span class="bf-check">${check('#1d2567',14)}</span><span class="t"><b>${t('allT',x.n)}</b><span class="s">${t('allB')}</span></span>${img('ic-chev-cream-24.svg',24,24,'bf-chev')}</button>`:''}
 ${PEOPLE.slice(0,x.n).map((p,i)=>{const k=key(x.id,i),d=DONE[k],now=!d&&CLK.k===k&&CLK.t>0,len=fmt(vidFor(x.id,i).len);
  return `<button class="row press ${JUST===k?'bf-just':''}" data-a="play:${i}" aria-label="${p.name}${d?', '+t('marked'):''}">${av(p,52)}<span class="t"><b>${p.name}</b><span>${L(p.role)}</span></span>${d?`<span class="bf-check">${check('#f0fdb5',14)}</span>`:`<span class="d ${now?'bf-now':''}" ${now?`data-now="${k}"`:''}>${now?`${fmt(CLK.t)}/${len}`:len}</span>`}</button>`}).join('')}
 </div>${playbar()}${tabbar('home')}`};

V.player=function(){const i=CLK.k?CLK.i:0,tp=CLK.k?CLK.tp:'hurt',v=cur(),video=S.mode==='video',lines=TX[v.id];
 const f=CLK.dur?Math.min(1,CLK.t/CLK.dur):0;lastLine=-2;
 const card=lines?`<div class="ts" data-tx>${S.lang!=='en'?`<p class="bf-lang">${t('txLang')}</p>`:''}<p class="bf-pad"></p>${(capsFor(v)||[]).map(([s,l],i,a)=>`<p class="bf-l" data-s="${s}" data-e="${i+1<a.length?a[i+1][0]:v.len}">${l.split(' ').map(w=>`<span>${esc(w)}</span>`).join(' ')}</p>`).join('')}<p class="bf-pad"></p></div><div class="bf-fadetop"></div><div class="fade"></div>`
  :`<div class="bf-notx"><b>${t('noTxT')}</b><span>${t('noTxB',esc(v.name))}</span></div><a class="bf-ytpill" href="${ytLink(v)}" target="_blank" rel="noopener" style="background:var(--nightfall);top:24px;left:24px;right:auto">${YTICON}YouTube</a>`;
 return `<div class="layer" style="background:${video?'linear-gradient(to top,#150100,#fb4238 159.48%)':'#fb4238'}">
 <div class="ph-head"><div class="l"><button data-a="back" aria-label="${t('close')}">${img('ic-chev-cream-24.svg',24,24,'down')}</button></div>
 <button class="switch press" data-a="mode" style="background:${video?'rgba(255,255,255,.1)':'#fe6057'}">${img(video?'ic-audio.svg':'ic-video.svg',20)}${t(video?'toAudio':'toVideo')}</button>
 <div class="r"><button data-a="sheet:playlist" aria-label="${t('list')}">${img('ic-list.svg',24)}</button><button data-a="share:${i}" aria-label="${t('share')}">${img('ic-share.svg',24)}</button></div></div>
 ${video?`<div class="vid bf-vid bf-gray">${isStatic()?`<img src="${thumb(v.id)}" alt="">`:''}${isStatic()?`<span class="bf-ytpill">${YTICON}YouTube</span>`:''}</div>`:`<div class="ts-card">${card}</div>`}
 <div class="pinfo"><h2>${t(tp==='cost'?'costQ':tp)}</h2><div>${vav(v,24)}<p><b>${esc(v.name)}</b> <span>· ${L(v.role)}</span></p></div></div>
 <div class="track" role="slider" aria-valuemin="0" aria-valuemax="${CLK.dur}" aria-valuenow="${Math.floor(CLK.t)}">${trackHTML(f)}</div>
 <div class="times"><span>${fmt(CLK.t)}</span><span>−${fmt(CLK.dur-CLK.t)}</span></div>
 <div class="ctrl">${ctrlHTML()}</div></div>`};

/* ---------- next steps sheet ---------- */
SH.nextsteps=function(){const x=topicOf(S.topic);
 const S5=[['s1T','s1B'],['s2T','s2B','s2C','(800) 511-2300'],['s3T','s3B','s3C','(833) 278-4584'],['s4T','s4B','s4C','1-800-391-2000'],['s5T','s5B']];
 const phone='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1d2567" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>';
 return `<div class="bf-ns" style="display:flex;flex-direction:column"><span class="bf-tag">${check('#1d2567',14)}${t('nsTag',noQ(t(x.id)))}</span><h2>${t('nsT')}</h2><p class="sub">${t('nsSub')}</p>
 <div class="inner-scroll"><ol class="bf-steps">${S5.map(([h,b,c,n],i)=>`<li class="bf-step"><span class="bf-num">${i+1}</span><div class="tx"><h3>${t(h)}</h3><p>${t(b)}</p>${c?`<button class="chip press" data-a="call:${n}">${phone}${t(c)}</button>`:''}</div></li>`).join('')}</ol></div>
 <div class="bf-foot"><button class="cta bf-cedars press" data-a="cedars">${t('cedars')}</button><button class="bf-later" data-a="close">${t('later')}</button></div></div>`};

/* ---------- actions ---------- */
Object.assign(ACT,{
 play(v){startClip(S.topic,+v);go('player',{mode:'video'},'rise')},
 playnext(){startClip(S.topic,firstUndone(S.topic));go('player',{mode:'video'},'rise')},
 player(){if(CLK.k)startClip(CLK.tp,CLK.i);else startClip('hurt',firstUndone('hurt'));go('player',{mode:'video'},'rise')},
 audio(){ACT.player();S.mode='audio';render()},
 mode(){S.mode=S.mode==='video'?'audio':'video';render();paintTranscript(true)},
 toggle(){if(CLK.k&&CLK.t>=CLK.dur){CLK.t=0;S.playing=true;ytCmd('seekTo',[0,true]);render();return}S.playing=!S.playing;paint();syncYT();updPoster()},
 seek(v){if(!CLK.k)return;CLK.t=Math.min(CLK.dur,Math.max(0,CLK.t+(+v)));paint();paintTranscript(true);ytCmd('seekTo',[Math.floor(CLK.t),true]);if(CLK.t>=CLK.dur)finish()},
 steps(){openSheet('nextsteps')},
 prev(){if(!CLK.k)return;if(CLK.t>3||CLK.i===0){CLK.t=0;S.playing=true;paint();ytCmd('seekTo',[0,true]);ytCmd('playVideo');lastLine=-2;paintTranscript(true);return}skipTo(CLK.i-1)},
 next(){if(!CLK.k)return;if(CLK.i<topicOf(CLK.tp).n-1)skipTo(CLK.i+1)},
 call(v){toast(t('calling',v))},
 cedars(){closeSheet();toast(t('opCedars'))},
 pl(v){const[id,i]=v.split(':');if(id==='hurt')S.cur=+i;closeSheet();startClip('hurt',+i);render()}});

function skipTo(i){const same=vidFor(CLK.tp,i).id===YT.id;CLK.t=CLK.dur;startClip(CLK.tp,i);S.playing=true;render();if(same){ytCmd('seekTo',[0,true]);ytCmd('playVideo')}}
let finishing=null;
function finish(){const k=CLK.k,tp=CLK.tp;if(finishing===k)return;finishing=k;const first=!DONE[k];DONE[k]=true;S.playing=false;CLK.t=CLK.dur;paint();ytCmd('pauseVideo');
 setTimeout(()=>{finishing=null;if(S.s!=='player'||CLK.k!==k)return;
  JUST=k;if(hist.length&&hist[hist.length-1].s==='topic'){hist.pop()}
  S.s='topic';S.topic=tp;S.sheet=null;render('push');syncRail();toast(t('marked'));
  setTimeout(()=>{JUST=null},1500);
  if(first&&doneCount(tp)>=topicOf(tp).n)setTimeout(()=>{if(S.s==='topic'&&!S.sheet)openSheet('nextsteps')},900)},900)}

/* clock: follows the YouTube player when it reports time, ticks on its own otherwise */
setInterval(()=>{if(!S||S.s!=='player'||!S.playing||!CLK.k||CLK.t>=CLK.dur||isStatic())return;
 updPoster();if(Date.now()-YT.last<1200)return;
 if(YT.frame&&YT.id===cur().id&&(YT.ready||Date.now()-YT.born<8000))return;
 CLK.t=Math.min(CLK.dur,CLK.t+.25);paint();if(CLK.t>=CLK.dur)finish()},250);

document.addEventListener('click',e=>{const tr=e.target.closest('#scr .track');if(!tr||!CLK.k)return;
 const r=tr.getBoundingClientRect(),z=r.width/342,x=(e.clientX-r.left)/z;
 CLK.t=Math.min(CLK.dur,Math.max(0,((x-12)/318)*CLK.dur));paint();paintTranscript(true);ytCmd('seekTo',[Math.floor(CLK.t),true]);if(CLK.t>=CLK.dur-.5){CLK.t=CLK.dur;finish()}});
document.addEventListener('click',e=>{if(e.target.closest('.bf-ytpill')&&S&&S.playing){S.playing=false;paint();syncYT()}});

/* ---------- review board: two new frames ---------- */
PRESETS['topic-progress']={s:'topic',topic:'family'};
PRESETS['next-steps']={s:'topic',topic:'family',sheet:'nextsteps'};
GROUPS.push(['Progress','finish a story',[['topic-progress','Marked complete'],['next-steps','Next steps sheet']]]);
function seed(id){if(id!=='topic-progress'&&id!=='next-steps')return;
 Object.keys(DONE).forEach(k=>{if(k.startsWith('family:'))delete DONE[k]});
 const n=id==='next-steps'?5:2;for(let i=0;i<n;i++)DONE[key('family',i)]=true;
 if(id==='topic-progress'){CLK.k=key('family',2);CLK.tp='family';CLK.i=2;CLK.dur=vidFor('family',2).len;CLK.t=31}}
const _load=load;load=function(id){seed(id);_load(id)};

/* re-render whatever the main script already drew, now with these views */
if(frameId&&(frameId==='topic-progress'||frameId==='next-steps')){document.body.classList.add('static','frame-only');document.body.style.background='transparent';mount(document.getElementById('root'));load(frameId)}
else if(frameId&&S)render();
else shell();
})();
