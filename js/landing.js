document.addEventListener('DOMContentLoaded', () => {
  const phrases = document.querySelectorAll('.sliding-phrases .phrase');
  if (phrases && phrases.length){
    const wrap = document.querySelector('.sliding-phrases');
    // duplicate nodes to create infinite loop feel
    phrases.forEach(p => wrap.appendChild(p.cloneNode(true)));
    gsap.to('.sliding-phrases', { xPercent: -50, duration: 12, ease: 'none', repeat: -1 });
  }

  // loader: hide after entrance
  const loader = document.getElementById('pageLoader');
  if (loader){
    gsap.to(loader, { opacity: 0, y: -20, duration: 0.6, delay: 0.6, onComplete: ()=> loader.remove() });
  }

  // CTA hover micro
  document.querySelectorAll('.btn.primary').forEach(b=>{
    b.addEventListener('mouseenter',()=>gsap.to(b,{scale:1.02,duration:0.12}))
    b.addEventListener('mouseleave',()=>gsap.to(b,{scale:1,duration:0.12}))
  });

  // scroll reveal for features
  if(gsap.ScrollTrigger){
    gsap.utils.toArray('.feature').forEach((el,i)=>{
      gsap.from(el,{y:18,opacity:0,duration:0.6,delay:i*0.08,scrollTrigger:{trigger:el,start:'top 88%'}})
    })
  }
});