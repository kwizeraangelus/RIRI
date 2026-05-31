(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,88143,(e,r,i)=>{"use strict";function t({widthInt:e,heightInt:r,blurWidth:i,blurHeight:a,blurDataURL:o,objectFit:s}){let n=i?40*i:e,l=a?40*a:r,c=n&&l?`viewBox='0 0 ${n} ${l}'`:"";return`%3Csvg xmlns='http://www.w3.org/2000/svg' ${c}%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='${c?"none":"contain"===s?"xMidYMid":"cover"===s?"xMidYMid slice":"none"}' style='filter: url(%23b);' href='${o}'/%3E%3C/svg%3E`}Object.defineProperty(i,"__esModule",{value:!0}),Object.defineProperty(i,"getImageBlurSvg",{enumerable:!0,get:function(){return t}})},87690,(e,r,i)=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0});var t={VALID_LOADERS:function(){return o},imageConfigDefault:function(){return s}};for(var a in t)Object.defineProperty(i,a,{enumerable:!0,get:t[a]});let o=["default","imgix","cloudinary","akamai","custom"],s={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],path:"/_next/image",loader:"default",loaderFile:"",domains:[],disableStaticImages:!1,minimumCacheTTL:14400,formats:["image/webp"],maximumDiskCacheSize:void 0,maximumRedirects:3,maximumResponseBody:5e7,dangerouslyAllowLocalIP:!1,dangerouslyAllowSVG:!1,contentSecurityPolicy:"script-src 'none'; frame-src 'none'; sandbox;",contentDispositionType:"attachment",localPatterns:void 0,remotePatterns:[],qualities:[75],unoptimized:!1,customCacheHandler:!1}},8927,(e,r,i)=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0}),Object.defineProperty(i,"getImgProps",{enumerable:!0,get:function(){return c}}),e.r(33525);let t=e.r(43369),a=e.r(88143),o=e.r(87690),s=["-moz-initial","fill","none","scale-down",void 0];function n(e){return void 0!==e.default}function l(e){return void 0===e?e:"number"==typeof e?Number.isFinite(e)?e:NaN:"string"==typeof e&&/^[0-9]+$/.test(e)?parseInt(e,10):NaN}function c({src:e,sizes:r,unoptimized:i=!1,priority:d=!1,preload:m=!1,loading:f,className:h,quality:u,width:p,height:g,fill:_=!1,style:b,overrideSrc:v,onLoad:x,onLoadingComplete:y,placeholder:w="empty",blurDataURL:j,fetchPriority:k,decoding:N="async",layout:S,objectFit:R,objectPosition:z,lazyBoundary:P,lazyRoot:E,...C},I){var O;let A,D,M,{imgConf:q,showAltText:T,blurComplete:F,defaultLoader:U}=I,$=q||o.imageConfigDefault;if("allSizes"in $)A=$;else{let e=[...$.deviceSizes,...$.imageSizes].sort((e,r)=>e-r),r=$.deviceSizes.sort((e,r)=>e-r),i=$.qualities?.sort((e,r)=>e-r);A={...$,allSizes:e,deviceSizes:r,qualities:i}}if(void 0===U)throw Object.defineProperty(Error("images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config"),"__NEXT_ERROR_CODE",{value:"E163",enumerable:!1,configurable:!0});let B=C.loader||U;delete C.loader,delete C.srcSet;let L="__next_img_default"in B;if(L){if("custom"===A.loader)throw Object.defineProperty(Error(`Image with src "${e}" is missing "loader" prop.
Read more: https://nextjs.org/docs/messages/next-image-missing-loader`),"__NEXT_ERROR_CODE",{value:"E252",enumerable:!1,configurable:!0})}else{let e=B;B=r=>{let{config:i,...t}=r;return e(t)}}if(S){"fill"===S&&(_=!0);let e={intrinsic:{maxWidth:"100%",height:"auto"},responsive:{width:"100%",height:"auto"}}[S];e&&(b={...b,...e});let i={responsive:"100vw",fill:"100vw"}[S];i&&!r&&(r=i)}let W="",G=l(p),H=l(g);if((O=e)&&"object"==typeof O&&(n(O)||void 0!==O.src)){let r=n(e)?e.default:e;if(!r.src)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ${JSON.stringify(r)}`),"__NEXT_ERROR_CODE",{value:"E460",enumerable:!1,configurable:!0});if(!r.height||!r.width)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ${JSON.stringify(r)}`),"__NEXT_ERROR_CODE",{value:"E48",enumerable:!1,configurable:!0});if(D=r.blurWidth,M=r.blurHeight,j=j||r.blurDataURL,W=r.src,!_)if(G||H){if(G&&!H){let e=G/r.width;H=Math.round(r.height*e)}else if(!G&&H){let e=H/r.height;G=Math.round(r.width*e)}}else G=r.width,H=r.height}let Y=!d&&!m&&("lazy"===f||void 0===f);(!(e="string"==typeof e?e:W)||e.startsWith("data:")||e.startsWith("blob:"))&&(i=!0,Y=!1),A.unoptimized&&(i=!0),L&&!A.dangerouslyAllowSVG&&e.split("?",1)[0].endsWith(".svg")&&(i=!0);let V=l(u),X=Object.assign(_?{position:"absolute",height:"100%",width:"100%",left:0,top:0,right:0,bottom:0,objectFit:R,objectPosition:z}:{},T?{}:{color:"transparent"},b),K=F||"empty"===w?null:"blur"===w?`url("data:image/svg+xml;charset=utf-8,${(0,a.getImageBlurSvg)({widthInt:G,heightInt:H,blurWidth:D,blurHeight:M,blurDataURL:j||"",objectFit:X.objectFit})}")`:`url("${w}")`,J=s.includes(X.objectFit)?"fill"===X.objectFit?"100% 100%":"cover":X.objectFit,Q=K?{backgroundSize:J,backgroundPosition:X.objectPosition||"50% 50%",backgroundRepeat:"no-repeat",backgroundImage:K}:{},Z=function({config:e,src:r,unoptimized:i,width:a,quality:o,sizes:s,loader:n}){if(i){if(r.startsWith("/")&&!r.startsWith("//")){let e=(0,t.getDeploymentId)();if(e){let i=r.indexOf("?");if(-1!==i){let t=new URLSearchParams(r.slice(i+1));t.get("dpl")||(t.append("dpl",e),r=r.slice(0,i)+"?"+t.toString())}else r+=`?dpl=${e}`}}return{src:r,srcSet:void 0,sizes:void 0}}let{widths:l,kind:c}=function({deviceSizes:e,allSizes:r},i,t){if(t){let i=/(^|\s)(1?\d?\d)vw/g,a=[];for(let e;e=i.exec(t);)a.push(parseInt(e[2]));if(a.length){let i=.01*Math.min(...a);return{widths:r.filter(r=>r>=e[0]*i),kind:"w"}}return{widths:r,kind:"w"}}return"number"!=typeof i?{widths:e,kind:"w"}:{widths:[...new Set([i,2*i].map(e=>r.find(r=>r>=e)||r[r.length-1]))],kind:"x"}}(e,a,s),d=l.length-1;return{sizes:s||"w"!==c?s:"100vw",srcSet:l.map((i,t)=>`${n({config:e,src:r,quality:o,width:i})} ${"w"===c?i:t+1}${c}`).join(", "),src:n({config:e,src:r,quality:o,width:l[d]})}}({config:A,src:e,unoptimized:i,width:G,quality:V,sizes:r,loader:B}),ee=Y?"lazy":f;return{props:{...C,loading:ee,fetchPriority:k,width:G,height:H,decoding:N,className:h,style:{...X,...Q},sizes:Z.sizes,srcSet:Z.srcSet,src:v||Z.src},meta:{unoptimized:i,preload:m||d,placeholder:w,fill:_}}}},98879,(e,r,i)=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0}),Object.defineProperty(i,"default",{enumerable:!0,get:function(){return n}});let t=e.r(71645),a="u"<typeof window,o=a?()=>{}:t.useLayoutEffect,s=a?()=>{}:t.useEffect;function n(e){let{headManager:r,reduceComponentsToState:i}=e;function n(){if(r&&r.mountedInstances){let e=t.Children.toArray(Array.from(r.mountedInstances).filter(Boolean));r.updateHead(i(e))}}return a&&(r?.mountedInstances?.add(e.children),n()),o(()=>(r?.mountedInstances?.add(e.children),()=>{r?.mountedInstances?.delete(e.children)})),o(()=>(r&&(r._pendingUpdate=n),()=>{r&&(r._pendingUpdate=n)})),s(()=>(r&&r._pendingUpdate&&(r._pendingUpdate(),r._pendingUpdate=null),()=>{r&&r._pendingUpdate&&(r._pendingUpdate(),r._pendingUpdate=null)})),null}},25633,(e,r,i)=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0});var t={default:function(){return p},defaultHead:function(){return m}};for(var a in t)Object.defineProperty(i,a,{enumerable:!0,get:t[a]});let o=e.r(55682),s=e.r(90809),n=e.r(43476),l=s._(e.r(71645)),c=o._(e.r(98879)),d=e.r(42732);function m(){return[(0,n.jsx)("meta",{charSet:"utf-8"},"charset"),(0,n.jsx)("meta",{name:"viewport",content:"width=device-width"},"viewport")]}function f(e,r){return"string"==typeof r||"number"==typeof r?e:r.type===l.default.Fragment?e.concat(l.default.Children.toArray(r.props.children).reduce((e,r)=>"string"==typeof r||"number"==typeof r?e:e.concat(r),[])):e.concat(r)}e.r(33525);let h=["name","httpEquiv","charSet","itemProp"];function u(e){let r,i,t,a;return e.reduce(f,[]).reverse().concat(m().reverse()).filter((r=new Set,i=new Set,t=new Set,a={},e=>{let o=!0,s=!1;if(e.key&&"number"!=typeof e.key&&e.key.indexOf("$")>0){s=!0;let i=e.key.slice(e.key.indexOf("$")+1);r.has(i)?o=!1:r.add(i)}switch(e.type){case"title":case"base":i.has(e.type)?o=!1:i.add(e.type);break;case"meta":for(let r=0,i=h.length;r<i;r++){let i=h[r];if(e.props.hasOwnProperty(i))if("charSet"===i)t.has(i)?o=!1:t.add(i);else{let r=e.props[i],t=a[i]||new Set;("name"!==i||!s)&&t.has(r)?o=!1:(t.add(r),a[i]=t)}}}return o})).reverse().map((e,r)=>{let i=e.key||r;return l.default.cloneElement(e,{key:i})})}let p=function({children:e}){let r=(0,l.useContext)(d.HeadManagerContext);return(0,n.jsx)(c.default,{reduceComponentsToState:u,headManager:r,children:e})};("function"==typeof i.default||"object"==typeof i.default&&null!==i.default)&&void 0===i.default.__esModule&&(Object.defineProperty(i.default,"__esModule",{value:!0}),Object.assign(i.default,i),r.exports=i.default)},18556,(e,r,i)=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0}),Object.defineProperty(i,"ImageConfigContext",{enumerable:!0,get:function(){return o}});let t=e.r(55682)._(e.r(71645)),a=e.r(87690),o=t.default.createContext(a.imageConfigDefault)},65856,(e,r,i)=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0}),Object.defineProperty(i,"RouterContext",{enumerable:!0,get:function(){return t}});let t=e.r(55682)._(e.r(71645)).default.createContext(null)},70965,(e,r,i)=>{"use strict";function t(e,r){let i=e||75;return r?.qualities?.length?r.qualities.reduce((e,r)=>Math.abs(r-i)<Math.abs(e-i)?r:e,r.qualities[0]):i}Object.defineProperty(i,"__esModule",{value:!0}),Object.defineProperty(i,"findClosestQuality",{enumerable:!0,get:function(){return t}})},1948,(e,r,i)=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0}),Object.defineProperty(i,"default",{enumerable:!0,get:function(){return s}});let t=e.r(70965),a=e.r(43369);function o({config:e,src:r,width:i,quality:s}){let n=(0,a.getDeploymentId)();if(r.startsWith("/")&&!r.startsWith("//")){let e=r.indexOf("?");if(-1!==e){let i=new URLSearchParams(r.slice(e+1)),t=i.get("dpl");if(t){n=t,i.delete("dpl");let a=i.toString();r=r.slice(0,e)+(a?"?"+a:"")}}}if(r.startsWith("/")&&r.includes("?")&&e.localPatterns?.length===1&&"**"===e.localPatterns[0].pathname&&""===e.localPatterns[0].search)throw Object.defineProperty(Error(`Image with src "${r}" is using a query string which is not configured in images.localPatterns.
Read more: https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns`),"__NEXT_ERROR_CODE",{value:"E871",enumerable:!1,configurable:!0});let l=(0,t.findClosestQuality)(s,e);return`${e.path}?url=${encodeURIComponent(r)}&w=${i}&q=${l}${r.startsWith("/")&&n?`&dpl=${n}`:""}`}o.__next_img_default=!0;let s=o},5500,(e,r,i)=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0}),Object.defineProperty(i,"Image",{enumerable:!0,get:function(){return x}});let t=e.r(55682),a=e.r(90809),o=e.r(43476),s=a._(e.r(71645)),n=t._(e.r(74080)),l=t._(e.r(25633)),c=e.r(8927),d=e.r(87690),m=e.r(18556);e.r(33525);let f=e.r(65856),h=t._(e.r(1948)),u=e.r(18581),p={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1};function g(e,r,i,t,a,o,s){let n=e?.src;e&&e["data-loaded-src"]!==n&&(e["data-loaded-src"]=n,("decode"in e?e.decode():Promise.resolve()).catch(()=>{}).then(()=>{if(e.parentElement&&e.isConnected){if("empty"!==r&&a(!0),i?.current){let r=new Event("load");Object.defineProperty(r,"target",{writable:!1,value:e});let t=!1,a=!1;i.current({...r,nativeEvent:r,currentTarget:e,target:e,isDefaultPrevented:()=>t,isPropagationStopped:()=>a,persist:()=>{},preventDefault:()=>{t=!0,r.preventDefault()},stopPropagation:()=>{a=!0,r.stopPropagation()}})}t?.current&&t.current(e)}}))}function _(e){return s.use?{fetchPriority:e}:{fetchpriority:e}}"u"<typeof window&&(globalThis.__NEXT_IMAGE_IMPORTED=!0);let b=(0,s.forwardRef)(({src:e,srcSet:r,sizes:i,height:t,width:a,decoding:n,className:l,style:c,fetchPriority:d,placeholder:m,loading:f,unoptimized:h,fill:p,onLoadRef:b,onLoadingCompleteRef:v,setBlurComplete:x,setShowAltText:y,sizesInput:w,onLoad:j,onError:k,...N},S)=>{let R=(0,s.useCallback)(e=>{e&&(k&&(e.src=e.src),e.complete&&g(e,m,b,v,x,h,w))},[e,m,b,v,x,k,h,w]),z=(0,u.useMergedRef)(S,R);return(0,o.jsx)("img",{...N,..._(d),loading:f,width:a,height:t,decoding:n,"data-nimg":p?"fill":"1",className:l,style:c,sizes:i,srcSet:r,src:e,ref:z,onLoad:e=>{g(e.currentTarget,m,b,v,x,h,w)},onError:e=>{y(!0),"empty"!==m&&x(!0),k&&k(e)}})});function v({isAppRouter:e,imgAttributes:r}){let i={as:"image",imageSrcSet:r.srcSet,imageSizes:r.sizes,crossOrigin:r.crossOrigin,referrerPolicy:r.referrerPolicy,..._(r.fetchPriority)};return e&&n.default.preload?(n.default.preload(r.src,i),null):(0,o.jsx)(l.default,{children:(0,o.jsx)("link",{rel:"preload",href:r.srcSet?void 0:r.src,...i},"__nimg-"+r.src+r.srcSet+r.sizes)})}let x=(0,s.forwardRef)((e,r)=>{let i=(0,s.useContext)(f.RouterContext),t=(0,s.useContext)(m.ImageConfigContext),a=(0,s.useMemo)(()=>{let e=p||t||d.imageConfigDefault,r=[...e.deviceSizes,...e.imageSizes].sort((e,r)=>e-r),i=e.deviceSizes.sort((e,r)=>e-r),a=e.qualities?.sort((e,r)=>e-r);return{...e,allSizes:r,deviceSizes:i,qualities:a,localPatterns:"u"<typeof window?t?.localPatterns:e.localPatterns}},[t]),{onLoad:n,onLoadingComplete:l}=e,u=(0,s.useRef)(n);(0,s.useEffect)(()=>{u.current=n},[n]);let g=(0,s.useRef)(l);(0,s.useEffect)(()=>{g.current=l},[l]);let[_,x]=(0,s.useState)(!1),[y,w]=(0,s.useState)(!1),{props:j,meta:k}=(0,c.getImgProps)(e,{defaultLoader:h.default,imgConf:a,blurComplete:_,showAltText:y});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(b,{...j,unoptimized:k.unoptimized,placeholder:k.placeholder,fill:k.fill,onLoadRef:u,onLoadingCompleteRef:g,setBlurComplete:x,setShowAltText:w,sizesInput:e.sizes,ref:r}),k.preload?(0,o.jsx)(v,{isAppRouter:!i,imgAttributes:j}):null]})});("function"==typeof i.default||"object"==typeof i.default&&null!==i.default)&&void 0===i.default.__esModule&&(Object.defineProperty(i.default,"__esModule",{value:!0}),Object.assign(i.default,i),r.exports=i.default)},94909,(e,r,i)=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0});var t={default:function(){return d},getImageProps:function(){return c}};for(var a in t)Object.defineProperty(i,a,{enumerable:!0,get:t[a]});let o=e.r(55682),s=e.r(8927),n=e.r(5500),l=o._(e.r(1948));function c(e){let{props:r}=(0,s.getImgProps)(e,{defaultLoader:l.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1}});for(let[e,i]of Object.entries(r))void 0===i&&delete r[e];return{props:r}}let d=n.Image},57688,(e,r,i)=>{r.exports=e.r(94909)},22474,e=>{"use strict";var r=e.i(43476),i=e.i(932),t=e.i(57688),a=e.i(22016),o=e.i(71645);let s=[{title:"AI in Healthcare Diagnostics",author:"Dr. Amina Uwase",supervisor:"Prof. Jean Habimana",category:"Technology",field:"Artificial Intelligence",year:"2024",pages:"142 pages"},{title:"Sustainable Farming in Rwanda",author:"Erick Nshimiyimana",supervisor:"Prof. Grace Mukamana",category:"Agriculture",field:"Agronomy & Food Security",year:"2024",pages:"98 pages"},{title:"Medicinal Plants of Central Africa",author:"Claudine Ingabire",supervisor:"Dr. Patrick Rugira",category:"Medication",field:"Pharmacology",year:"2023",pages:"210 pages"},{title:"Urban Green Space & Mental Health",author:"Samuel Bizimana",supervisor:"Prof. Yvette Dusabe",category:"Environment",field:"Environmental Science",year:"2024",pages:"117 pages"}],n=[{title:"Research Showcase 2025",date:"Mar 12, 2025",location:"Kigali Innovation City",tag:"Showcase",description:"Authors and researchers from across the platform present their published dissertations and receive live feedback from academic panels."},{title:"Academic Writing Bootcamp",date:"Apr 8, 2025",location:"University of Rwanda — Huye",tag:"Workshop",description:"A two-day intensive workshop helping graduate students structure, write, and publish dissertation-quality research on RIRI."},{title:"Innovation & Knowledge Forum",date:"May 20, 2025",location:"Kigali Convention Center",tag:"Forum",description:"Bringing together institutions, supervisors, and emerging researchers to explore how RIRI is transforming knowledge sharing in Rwanda."}],l=[{value:"1,500+",label:"Research Uploads"},{value:"12,000+",label:"Active Readers"},{value:"40+",label:"Partner Institutions"},{value:"120+",label:"Community Events"}],c=[{number:"01",title:"Upload & Publish",description:"Researchers and creators submit quality work to share verified knowledge with a broader academic and creative audience."},{number:"02",title:"Discover & Learn",description:"Readers explore books, research papers, and innovations using clear categories and powerful searchable content."},{number:"03",title:"Connect & Grow",description:"Communities engage through events, workshops, and partnerships that turn ideas into real-world impact."}],d=["Technology Research","Agricultural Studies","Medical Dissertations","Environmental Science","Academic Publishing","Knowledge Sharing","Rwanda Innovations","Global Voices"],m=[{name:"Facebook",href:"#"},{name:"WhatsApp",href:"#"},{name:"Instagram",href:"#"},{name:"TikTok",href:"#"}];function f(){let e,r,t,a=(0,i.c)(4),s=(0,o.useRef)(null),[n,l]=(0,o.useState)(!1);return a[0]===Symbol.for("react.memo_cache_sentinel")?(e=()=>{let e=s.current;if(!e)return;let r=new IntersectionObserver(e=>{let[i]=e;i.isIntersecting&&(l(!0),r.disconnect())},{threshold:.12});return r.observe(e),()=>r.disconnect()},r=[],a[0]=e,a[1]=r):(e=a[0],r=a[1]),(0,o.useEffect)(e,r),a[2]!==n?(t={ref:s,visible:n},a[2]=n,a[3]=t):t=a[3],t}function h(){let e,t,a=(0,i.c)(2);a[0]===Symbol.for("react.memo_cache_sentinel")?(e=[...d,...d],a[0]=e):e=a[0];let o=e;return a[1]===Symbol.for("react.memo_cache_sentinel")?(t=(0,r.jsx)("div",{className:"riri-ticker",children:(0,r.jsx)("div",{className:"riri-ticker__track",children:o.map(u)})}),a[1]=t):t=a[1],t}function u(e,i){return(0,r.jsxs)("span",{className:"riri-ticker__item",children:[(0,r.jsx)("span",{className:"riri-ticker__dot"}),e]},i)}function p(e){let t,a,o,s,n=(0,i.c)(12),{value:l,label:c,delay:d}=e,{ref:m,visible:h}=f(),u=`riri-stat ${h?"riri-stat--visible":""}`,p=`${d}ms`;return n[0]!==p?(t={transitionDelay:p},n[0]=p,n[1]=t):t=n[1],n[2]!==l?(a=(0,r.jsx)("div",{className:"riri-stat__value",children:l}),n[2]=l,n[3]=a):a=n[3],n[4]!==c?(o=(0,r.jsx)("div",{className:"riri-stat__label",children:c}),n[4]=c,n[5]=o):o=n[5],n[6]!==m||n[7]!==u||n[8]!==t||n[9]!==a||n[10]!==o?(s=(0,r.jsxs)("div",{ref:m,className:u,style:t,children:[a,o]}),n[6]=m,n[7]=u,n[8]=t,n[9]=a,n[10]=o,n[11]=s):s=n[11],s}function g(e){let a,o,s,n,l,c,d,m,f,h,u,p,g,_=(0,i.c)(31),{work:b}=e;return _[0]!==b.title?(a=(0,r.jsx)("div",{className:"riri-book-card__img-wrap",children:(0,r.jsx)(t.default,{src:"/old.jpg",fill:!0,alt:b.title,className:"riri-book-card__img",unoptimized:!0})}),_[0]=b.title,_[1]=a):a=_[1],_[2]===Symbol.for("react.memo_cache_sentinel")?(o=(0,r.jsx)("div",{className:"riri-book-card__overlay"}),_[2]=o):o=_[2],_[3]!==b.category?(s=(0,r.jsx)("span",{className:"riri-book-card__category",children:b.category}),_[3]=b.category,_[4]=s):s=_[4],_[5]!==b.year?(n=(0,r.jsx)("span",{className:"riri-book-card__year",children:b.year}),_[5]=b.year,_[6]=n):n=_[6],_[7]!==a||_[8]!==s||_[9]!==n?(l=(0,r.jsxs)("div",{className:"riri-book-card__cover",children:[a,o,s,n]}),_[7]=a,_[8]=s,_[9]=n,_[10]=l):l=_[10],_[11]!==b.field?(c=(0,r.jsx)("p",{className:"riri-book-card__field",children:b.field}),_[11]=b.field,_[12]=c):c=_[12],_[13]!==b.title?(d=(0,r.jsx)("h3",{className:"riri-book-card__title",children:b.title}),_[13]=b.title,_[14]=d):d=_[14],_[15]!==b.author?(m=(0,r.jsx)("p",{className:"riri-book-card__author",children:b.author}),_[15]=b.author,_[16]=m):m=_[16],_[17]!==b.pages||_[18]!==b.supervisor?(f=(0,r.jsxs)("span",{className:"riri-book-card__supervisor",children:[b.pages," · Supervised by ",b.supervisor]}),_[17]=b.pages,_[18]=b.supervisor,_[19]=f):f=_[19],_[20]===Symbol.for("react.memo_cache_sentinel")?(h=(0,r.jsx)("button",{className:"riri-book-card__btn",children:"Read →"}),_[20]=h):h=_[20],_[21]!==f?(u=(0,r.jsxs)("div",{className:"riri-book-card__footer",children:[f,h]}),_[21]=f,_[22]=u):u=_[22],_[23]!==u||_[24]!==c||_[25]!==d||_[26]!==m?(p=(0,r.jsxs)("div",{className:"riri-book-card__body",children:[c,d,m,u]}),_[23]=u,_[24]=c,_[25]=d,_[26]=m,_[27]=p):p=_[27],_[28]!==p||_[29]!==l?(g=(0,r.jsxs)("div",{className:"riri-book-card",children:[l,p]}),_[28]=p,_[29]=l,_[30]=g):g=_[30],g}function _(e){let t,a,o=(0,i.c)(7),{children:s,className:n,delay:l}=e,{ref:c,visible:d}=f(),m=`riri-reveal ${d?"riri-reveal--in":""} ${void 0===n?"":n}`,h=`${void 0===l?0:l}ms`;return o[0]!==h?(t={transitionDelay:h},o[0]=h,o[1]=t):t=o[1],o[2]!==s||o[3]!==c||o[4]!==m||o[5]!==t?(a=(0,r.jsx)("div",{ref:c,className:m,style:t,children:s}),o[2]=s,o[3]=c,o[4]=m,o[5]=t,o[6]=a):a=o[6],a}function b(e){return(0,r.jsx)("a",{href:e.href,className:"riri-footer__link",children:e.name},e.name)}function v(e,i){return(0,r.jsx)(_,{delay:100*i,children:(0,r.jsxs)("div",{className:"riri-event-card",children:[(0,r.jsxs)("div",{className:"riri-event-card__header",children:[(0,r.jsx)("span",{className:"riri-event-card__tag",children:e.tag}),(0,r.jsxs)("span",{className:"riri-event-card__num",children:["0",i+1]})]}),(0,r.jsx)("h3",{className:"riri-event-card__title",children:e.title}),(0,r.jsx)("p",{className:"riri-event-card__desc",children:e.description}),(0,r.jsxs)("div",{className:"riri-event-card__meta",children:[(0,r.jsxs)("span",{children:["📅 ",e.date]}),(0,r.jsxs)("span",{children:["📍 ",e.location]})]}),(0,r.jsx)(a.default,{href:"/events",className:"riri-event-card__btn",children:"Register now →"})]})},e.title)}function x(e,i){return(0,r.jsx)(_,{delay:120*i,children:(0,r.jsxs)("div",{className:"riri-how-card",children:[(0,r.jsx)("div",{className:"riri-how-card__number",children:e.number}),(0,r.jsx)("div",{className:"riri-how-card__divider"}),(0,r.jsx)("h3",{className:"riri-how-card__title",children:e.title}),(0,r.jsx)("p",{className:"riri-how-card__desc",children:e.description})]})},e.number)}function y(e,i){return(0,r.jsx)(_,{delay:80*i,children:(0,r.jsx)(g,{work:e})},e.title)}function w(e,i){return(0,r.jsx)(p,{value:e.value,label:e.label,delay:100*i},e.label)}let j=`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --gold:   #FFD700;
    --black:  #050A14;
    --dark:   #0a1120;
    --card:   #0f1a2e;
    --border: rgba(255,255,255,0.08);
    --white:  #f5f2ee;
    --muted:  rgba(245,242,238,0.52);
    --muted2: rgba(245,242,238,0.22);
    --r:      14px;
    --serif:  'Playfair Display', Georgia, serif;
    --sans:   'DM Sans', system-ui, sans-serif;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--black); color: var(--white); font-family: var(--sans); overflow-x: hidden; }

  /* ── WRAP — matches original max-w-6xl mx-auto px-4 sm:px-6 exactly ── */
  .riri-wrap {
    max-width: 72rem;   /* 1152px = Tailwind max-w-6xl */
    margin-left: auto;
    margin-right: auto;
    padding-left: 1rem;
    padding-right: 1rem;
    width: 100%;
  }
  @media (min-width: 640px) {
    .riri-wrap { padding-left: 1.5rem; padding-right: 1.5rem; }
  }

  /* ── SCROLL REVEAL ── */
  .riri-reveal {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.65s ease, transform 0.65s ease;
  }
  .riri-reveal--in { opacity: 1; transform: translateY(0); }

  /* ── HERO BAND — dark strip that nav sits on top of (same as EventsPage h-32 bg) ── */
  .riri-hero-band {
    height: 0;           /* nav handles its own height — zero here so no gap */
    background: var(--black);
  }

  /* ── HERO — full screen, same as original min-h-screen ── */
  .riri-hero {
    position: relative;
    display: flex; flex-direction: column;
    min-height: 100vh;
    overflow: hidden;
    background: linear-gradient(to bottom, var(--black) 0%, #0a1f3d 100%);
  }

  .riri-hero__bg {
    position: absolute; inset: 0;
    background-size: cover; background-position: center 30%;
    transform: scale(1.03); transition: transform 14s ease;
    filter: brightness(0.38) saturate(0.65);
  }
  .riri-hero:hover .riri-hero__bg { transform: scale(1.0); }

  .riri-hero__grain {
    position: absolute; inset: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    background-size: 180px; opacity: 0.45;
  }

  .riri-hero__vignette {
    position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(ellipse at center, transparent 30%, rgba(5,10,20,0.75) 100%);
  }

  .riri-hero__body {
    position: relative; z-index: 5; flex: 1;
    display: flex; align-items: center; padding: 4rem 0;
  }

  .riri-hero__layout {
    display: grid; grid-template-columns: 1fr auto;
    gap: 3rem; align-items: center; width: 100%;
  }

  .riri-hero__left {
    display: flex; flex-direction: column; gap: 1.5rem;
    max-width: 480px;
  }

  .riri-hero__badge {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 0.68rem; font-weight: 600;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--gold);
    opacity: 0; animation: heroFadeUp 0.6s ease 0.15s forwards;
  }

  .riri-hero__badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--gold); flex-shrink: 0;
    animation: pulse 2.2s infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.5)} }

  .riri-hero__sub {
    font-size: 1.02rem; line-height: 1.78;
    color: var(--muted); font-weight: 300;
    opacity: 0; animation: heroFadeUp 0.6s ease 0.3s forwards;
  }

  .riri-hero__actions {
    display: flex; flex-wrap: wrap; gap: 0.85rem;
    opacity: 0; animation: heroFadeUp 0.6s ease 0.45s forwards;
  }

  @keyframes heroFadeUp {
    from { opacity:0; transform:translateY(18px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* Card slides in from the right */
  .riri-hero__right {
    opacity: 0; transform: translateX(70px);
    animation: heroSlideRight 0.75s cubic-bezier(0.22,1,0.36,1) 0.2s forwards;
  }
  @keyframes heroSlideRight {
    from { opacity:0; transform:translateX(70px); }
    to   { opacity:1; transform:translateX(0); }
  }

  .riri-hero__card {
    background: rgba(135,206,235,0.1);
    border: 1px solid rgba(135,206,235,0.22);
    backdrop-filter: blur(18px);
    border-radius: 20px;
    padding: 2.25rem 2rem;
    min-width: 270px; max-width: 310px;
    display: flex; flex-direction: column; gap: 0.85rem;
  }

  .riri-hero__card-label {
    font-size: 0.62rem; font-weight: 600;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(135,206,235,0.65);
  }

  .riri-hero__card-title {
    font-family: var(--serif);
    font-size: 1.65rem; font-weight: 700; line-height: 1.22;
    color: var(--white);
  }
  .riri-hero__card-title em { font-style: italic; color: var(--gold); }

  /* Proof bar */
  .riri-hero__proof-bar {
    position: relative; z-index: 5;
    background: rgba(5,10,20,0.65); backdrop-filter: blur(12px);
    border-top: 1px solid var(--border);
    padding: 0.95rem 0;
    opacity: 0; animation: heroFadeUp 0.6s ease 0.65s forwards;
  }
  .riri-hero__proof-inner { display: flex; align-items: center; flex-wrap: wrap; gap: 1.25rem; }
  .riri-hero__proof-item { font-size: 0.8rem; color: var(--muted); }
  .riri-hero__proof-item strong { color: var(--white); font-weight: 600; }
  .riri-hero__proof-sep { width: 1px; height: 14px; background: var(--border); flex-shrink: 0; }

  /* ── TICKER ── */
  .riri-ticker { background: var(--gold); overflow: hidden; padding: 0.58rem 0; }
  .riri-ticker__track { display:flex; white-space:nowrap; animation: tickerScroll 26s linear infinite; }
  @keyframes tickerScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  .riri-ticker__item {
    display:inline-flex; align-items:center; gap:0.5rem;
    font-size:0.7rem; font-weight:600; letter-spacing:0.1em;
    text-transform:uppercase; color:var(--black); padding:0 1.75rem;
  }
  .riri-ticker__dot { width:4px; height:4px; border-radius:50%; background:var(--black); opacity:0.3; flex-shrink:0; }

  /* ── MAIN ── */
  .riri-main { background: var(--black); }
  .riri-section { padding: 5rem 0; }

  .riri-section__overline {
    font-size:0.67rem; font-weight:600; letter-spacing:0.17em;
    text-transform:uppercase; color:var(--gold); margin-bottom:0.55rem;
  }
  .riri-section__title {
    font-family:var(--serif); font-size:clamp(1.7rem,2.7vw,2.45rem);
    font-weight:700; line-height:1.18; color:var(--white);
  }
  .riri-section__desc {
    font-size:0.9rem; color:var(--muted); line-height:1.8;
    max-width:370px; font-weight:300; align-self:flex-end;
  }
  .riri-section__header { margin-bottom:2.75rem; }
  .riri-section__header--split { display:flex; justify-content:space-between; align-items:flex-end; gap:2rem; }
  .riri-section__view-all { flex-shrink:0; }

  /* ── STATS ── */
  .riri-stats-section { position:relative; border-bottom:1px solid var(--border); }

  .riri-stats-bg {
    position:absolute; inset:0;
    background-size:cover; background-position:center;
    /* Barely dimmed — image is clearly visible */
    filter: brightness(0.55) saturate(0.85);
  }

  /* Soft warm-dark gradient — very light touch, not a blue wall */
  .riri-stats-overlay {
    position:absolute; inset:0;
    background: linear-gradient(
      to bottom,
      rgba(5,10,20,0.35) 0%,
      rgba(5,10,20,0.18) 40%,
      rgba(5,10,20,0.55) 100%
    );
  }

  .riri-stats-inner { position:relative; z-index:2; }

  .riri-stats-grid {
    display:grid; grid-template-columns:repeat(4,1fr);
    gap:1px; background:rgba(255,255,255,0.06);
    border:1px solid rgba(255,255,255,0.1);
    border-radius:var(--r); overflow:hidden;
  }

  .riri-stat {
    background:rgba(5,10,20,0.55); backdrop-filter:blur(12px);
    padding:2.25rem 1.75rem; text-align:center;
    opacity:0; transform:translateY(16px);
    transition:opacity 0.55s ease, transform 0.55s ease;
  }
  .riri-stat--visible { opacity:1; transform:translateY(0); }
  .riri-stat__value {
    font-family:var(--serif); font-size:2.4rem; font-weight:700;
    color:var(--white); line-height:1; margin-bottom:0.35rem;
  }
  .riri-stat__label { font-size:0.7rem; color:var(--muted); letter-spacing:0.08em; text-transform:uppercase; }

  /* ── BOOKS ── */
  .riri-books-section { border-bottom:1px solid var(--border); }
  .riri-books-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1.25rem; margin-bottom:2.75rem; }

  .riri-book-card {
    background:var(--card); border-radius:var(--r);
    border:1px solid var(--border); overflow:hidden;
    transition:transform 0.3s ease, box-shadow 0.3s ease;
    cursor:pointer; height:100%;
  }
  .riri-book-card:hover { transform:translateY(-5px); box-shadow:0 18px 48px rgba(0,0,0,0.45); }

  .riri-book-card__cover { position:relative; aspect-ratio:3/4; overflow:hidden; }
  .riri-book-card__img-wrap { position:absolute; inset:0; }
  .riri-book-card__img { object-fit:cover; transition:transform 0.5s ease; }
  .riri-book-card:hover .riri-book-card__img { transform:scale(1.06); }

  .riri-book-card__overlay {
    position:absolute; inset:0;
    background:linear-gradient(to bottom, transparent 45%, rgba(5,10,20,0.88) 100%);
  }
  .riri-book-card__category {
    position:absolute; top:0.6rem; left:0.6rem; z-index:2;
    font-size:0.58rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase;
    color:var(--gold); background:rgba(5,10,20,0.78);
    padding:0.22rem 0.5rem; border-radius:100px; backdrop-filter:blur(4px);
  }
  .riri-book-card__year {
    position:absolute; top:0.6rem; right:0.6rem; z-index:2;
    font-size:0.58rem; color:var(--muted); background:rgba(5,10,20,0.65);
    padding:0.22rem 0.5rem; border-radius:100px;
  }

  .riri-book-card__body { padding:1rem; }
  .riri-book-card__field { font-size:0.62rem; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:var(--gold); margin-bottom:0.28rem; }
  .riri-book-card__title { font-family:var(--serif); font-size:0.95rem; font-weight:700; color:var(--white); line-height:1.25; margin-bottom:0.22rem; }
  .riri-book-card__author { font-size:0.74rem; color:var(--muted); margin-bottom:0.8rem; }
  .riri-book-card__footer { display:flex; align-items:center; justify-content:space-between; gap:0.5rem; padding-top:0.65rem; border-top:1px solid var(--border); }
  .riri-book-card__supervisor { font-size:0.6rem; color:var(--muted2); line-height:1.4; }
  .riri-book-card__btn { font-size:0.68rem; color:var(--gold); background:none; border:none; cursor:pointer; font-weight:600; white-space:nowrap; font-family:var(--sans); transition:letter-spacing 0.2s; flex-shrink:0; }
  .riri-book-card:hover .riri-book-card__btn { letter-spacing:0.04em; }

  .riri-books-footer { display:flex; align-items:center; justify-content:space-between; padding-top:1.75rem; border-top:1px solid var(--border); }
  .riri-books-footer__quote { font-family:var(--serif); font-style:italic; font-size:1rem; color:var(--muted); }

  /* ── MEDIA ── */
  .riri-media-section { border-bottom:1px solid var(--border); }
  .riri-media-card { display:grid; grid-template-columns:1fr 1fr; border-radius:calc(var(--r)*1.5); overflow:hidden; border:1px solid var(--border); min-height:420px; }
  .riri-media-card__image { position:relative; overflow:hidden; }
  .riri-media-card__img { object-fit:cover; transition:transform 0.6s ease; }
  .riri-media-card:hover .riri-media-card__img { transform:scale(1.04); }
  .riri-media-card__overlay { position:absolute; inset:0; background:linear-gradient(to right, transparent 60%, var(--card) 100%); }
  .riri-media-card__content { background:var(--card); padding:3rem; display:flex; flex-direction:column; justify-content:center; gap:1.2rem; }
  .riri-media-card__tag { font-size:0.66rem; font-weight:600; letter-spacing:0.13em; text-transform:uppercase; color:var(--gold); }
  .riri-media-card__title { font-family:var(--serif); font-size:1.95rem; font-weight:700; line-height:1.12; color:var(--white); }
  .riri-media-card__body { font-size:0.88rem; color:var(--muted); line-height:1.8; font-weight:300; }

  /* ── HOW ── */
  .riri-how-section { border-bottom:1px solid var(--border); }
  .riri-how-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:var(--border); border:1px solid var(--border); border-radius:var(--r); overflow:hidden; }
  .riri-how-card { background:var(--dark); padding:2.5rem 2rem; transition:background 0.3s; }
  .riri-how-card:hover { background:var(--card); }
  .riri-how-card__number { font-family:var(--serif); font-size:2.8rem; font-weight:700; line-height:1; margin-bottom:0.9rem; -webkit-text-stroke:1px var(--gold); color:transparent; }
  .riri-how-card__divider { width:26px; height:1px; background:var(--gold); margin-bottom:0.9rem; }
  .riri-how-card__title { font-family:var(--serif); font-size:1.18rem; font-weight:700; color:var(--white); margin-bottom:0.6rem; }
  .riri-how-card__desc { font-size:0.84rem; color:var(--muted); line-height:1.75; font-weight:300; }

  /* ── QUOTE ── */
  .riri-quote-section { border-bottom:1px solid var(--border); }
  .riri-quote-card { background:var(--dark); border:1px solid var(--border); border-radius:calc(var(--r)*1.5); padding:3.5rem 4rem; position:relative; overflow:hidden; }
  .riri-quote-card::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at 15% 50%, rgba(255,215,0,0.04), transparent 55%); pointer-events:none; }
  .riri-quote-card__mark { font-family:var(--serif); font-size:6.5rem; line-height:0.7; color:var(--gold); opacity:0.16; margin-bottom:1.25rem; font-weight:700; }
  .riri-quote-card__text { font-family:var(--serif); font-size:clamp(1.08rem,1.9vw,1.45rem); font-style:italic; line-height:1.62; color:var(--white); margin-bottom:2rem; max-width:740px; }
  .riri-quote-card__author { display:flex; align-items:center; gap:0.8rem; }
  .riri-quote-card__avatar { width:42px; height:42px; border-radius:50%; background:var(--gold); color:var(--black); display:flex; align-items:center; justify-content:center; font-size:0.7rem; font-weight:700; flex-shrink:0; }
  .riri-quote-card__name { font-weight:600; font-size:0.88rem; color:var(--white); }
  .riri-quote-card__role { font-size:0.74rem; color:var(--muted); }

  /* ── EVENTS ── */
  .riri-events-section { border-bottom:1px solid var(--border); }
  .riri-events-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.25rem; }
  .riri-event-card { background:var(--card); border:1px solid var(--border); border-radius:var(--r); padding:1.75rem; display:flex; flex-direction:column; gap:0.78rem; transition:border-color 0.25s, transform 0.25s; height:100%; }
  .riri-event-card:hover { border-color:rgba(255,215,0,0.28); transform:translateY(-4px); }
  .riri-event-card__header { display:flex; justify-content:space-between; align-items:center; }
  .riri-event-card__tag { font-size:0.58rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:var(--gold); background:rgba(255,215,0,0.1); padding:0.22rem 0.58rem; border-radius:100px; }
  .riri-event-card__num { font-family:var(--serif); font-size:1.15rem; color:rgba(255,255,255,0.06); font-weight:700; }
  .riri-event-card__title { font-family:var(--serif); font-size:1.18rem; font-weight:700; color:var(--white); line-height:1.2; }
  .riri-event-card__desc { font-size:0.79rem; color:var(--muted); line-height:1.72; font-weight:300; flex:1; }
  .riri-event-card__meta { display:flex; flex-direction:column; gap:0.26rem; font-size:0.74rem; color:var(--muted); padding-top:0.55rem; border-top:1px solid var(--border); }
  .riri-event-card__btn { display:inline-block; font-size:0.76rem; font-weight:600; color:var(--gold); text-decoration:none; transition:letter-spacing 0.2s; }
  .riri-event-card:hover .riri-event-card__btn { letter-spacing:0.04em; }

  /* ── CTA ── */
  .riri-cta-section { padding-bottom:6rem; }
  .riri-cta-card { background:var(--dark); border:1px solid var(--border); border-radius:calc(var(--r)*2); overflow:hidden; position:relative; }
  .riri-cta-card::after { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at 80% 20%, rgba(255,215,0,0.055), transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(59,130,246,0.03), transparent 50%); pointer-events:none; }
  .riri-cta-card__inner { padding:4.5rem; position:relative; z-index:1; }
  .riri-cta-card__title { font-family:var(--serif); font-size:clamp(1.6rem,2.5vw,2.2rem); font-weight:700; line-height:1.15; color:var(--white); margin-bottom:1.75rem; }
  .riri-cta-list { list-style:none; display:flex; flex-direction:column; gap:0.72rem; margin-bottom:2.25rem; }
  .riri-cta-list li { display:flex; align-items:center; gap:0.7rem; font-size:0.88rem; color:var(--muted); font-weight:300; }
  .riri-cta-list li::before { content:''; width:5px; height:5px; border-radius:50%; background:var(--gold); flex-shrink:0; }
  .riri-cta-actions { display:flex; flex-wrap:wrap; gap:0.85rem; }

  /* ── BUTTONS ── */
  .riri-btn { display:inline-flex; align-items:center; padding:0.65rem 1.5rem; border-radius:100px; font-size:0.83rem; font-weight:600; text-decoration:none; transition:all 0.2s; cursor:pointer; font-family:var(--sans); border:none; letter-spacing:0.02em; }
  .riri-btn--white { background:var(--white); color:var(--black); }
  .riri-btn--white:hover { background:#dedad4; }
  .riri-btn--ghost { background:rgba(255,255,255,0.09); color:var(--white); border:1px solid var(--border); backdrop-filter:blur(4px); }
  .riri-btn--ghost:hover { background:rgba(255,255,255,0.15); }
  .riri-btn--outline { background:transparent; color:var(--white); border:1px solid var(--border); }
  .riri-btn--outline:hover { border-color:rgba(255,255,255,0.28); }
  .riri-btn--gold { background:var(--gold); color:var(--black); }
  .riri-btn--gold:hover { background:#e6c200; }

  /* ── FOOTER ── */
  .riri-footer { background:var(--black); border-top:1px solid var(--border); padding:4.5rem 0 2.25rem; }
  .riri-footer__top { display:grid; grid-template-columns:1fr 2fr; gap:4rem; padding-bottom:3rem; border-bottom:1px solid var(--border); margin-bottom:2rem; }
  .riri-footer__logo { font-family:var(--serif); font-size:2rem; font-weight:700; color:var(--white); letter-spacing:0.08em; margin-bottom:0.55rem; }
  .riri-footer__tagline { font-size:0.84rem; color:var(--muted); font-style:italic; font-family:var(--serif); }
  .riri-footer__cols { display:grid; grid-template-columns:repeat(3,1fr); gap:2rem; }
  .riri-footer__col { display:flex; flex-direction:column; gap:0.52rem; }
  .riri-footer__col-title { font-size:0.63rem; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:var(--muted2); margin-bottom:0.38rem; }
  .riri-footer__link, .riri-footer__text { font-size:0.83rem; color:var(--muted); text-decoration:none; font-weight:300; transition:color 0.2s; }
  .riri-footer__link:hover { color:var(--white); }
  .riri-footer__bottom { display:flex; justify-content:space-between; align-items:center; font-size:0.73rem; color:var(--muted2); }

  /* ── RESPONSIVE ── */
  @media (max-width:1024px) {
    .riri-books-grid { grid-template-columns:repeat(2,1fr); }
    .riri-stats-grid { grid-template-columns:repeat(2,1fr); }
  }
  @media (max-width:768px) {
    .riri-wrap { padding-left:1.25rem; padding-right:1.25rem; }
    .riri-hero__layout { grid-template-columns:1fr; gap:2rem; }
    .riri-hero__card { max-width:100%; min-width:0; }
    .riri-section { padding:3.5rem 0; }
    .riri-section__header--split { flex-direction:column; align-items:flex-start; }
    .riri-books-grid { grid-template-columns:1fr 1fr; }
    .riri-media-card { grid-template-columns:1fr; }
    .riri-media-card__image { min-height:200px; }
    .riri-how-grid { grid-template-columns:1fr; gap:1px; }
    .riri-events-grid { grid-template-columns:1fr; }
    .riri-footer__top { grid-template-columns:1fr; gap:2rem; }
    .riri-footer__cols { grid-template-columns:1fr 1fr; }
    .riri-quote-card { padding:2.5rem 1.75rem; }
    .riri-cta-card__inner { padding:2.5rem; }
    .riri-books-footer { flex-direction:column; gap:1.25rem; align-items:flex-start; }
  }
  @media (max-width:480px) {
    .riri-books-grid { grid-template-columns:1fr; }
    .riri-stats-grid { grid-template-columns:1fr 1fr; }
    .riri-footer__cols { grid-template-columns:1fr; }
  }
`;e.s(["default",0,function(){let e,o,d,f,u,p,g,k,N,S,R,z,P,E,C,I,O,A,D,M,q,T,F,U,$,B,L,W,G,H,Y,V,X,K,J,Q,Z,ee,er,ei,et,ea,eo,es=(0,i.c)(43);return es[0]===Symbol.for("react.memo_cache_sentinel")?(e=(0,r.jsx)("style",{children:j}),o=(0,r.jsx)("div",{className:"riri-hero-band","aria-hidden":"true"}),es[0]=e,es[1]=o):(e=es[0],o=es[1]),es[2]===Symbol.for("react.memo_cache_sentinel")?(d=(0,r.jsx)("div",{className:"riri-hero__bg",style:{backgroundImage:"url('/home.jpg')"},"aria-hidden":"true"}),f=(0,r.jsx)("div",{className:"riri-hero__grain","aria-hidden":"true"}),u=(0,r.jsx)("div",{className:"riri-hero__vignette","aria-hidden":"true"}),es[2]=d,es[3]=f,es[4]=u):(d=es[2],f=es[3],u=es[4]),es[5]===Symbol.for("react.memo_cache_sentinel")?(p=(0,r.jsxs)("div",{className:"riri-hero__badge",children:[(0,r.jsx)("span",{className:"riri-hero__badge-dot"}),"Rwanda's Academic & Literary Platform"]}),g=(0,r.jsx)("p",{className:"riri-hero__sub",children:"A trusted home for research, creative writing, and academic excellence — built for the curious minds of Rwanda and beyond."}),es[5]=p,es[6]=g):(p=es[5],g=es[6]),es[7]===Symbol.for("react.memo_cache_sentinel")?(k=(0,r.jsxs)("div",{className:"riri-hero__left",children:[p,g,(0,r.jsxs)("div",{className:"riri-hero__actions",children:[(0,r.jsx)(a.default,{href:"/publications",className:"riri-btn riri-btn--white",children:"Explore Publications"}),(0,r.jsx)(a.default,{href:"/events",className:"riri-btn riri-btn--ghost",children:"Upcoming Events ↗"})]})]}),es[7]=k):k=es[7],es[8]===Symbol.for("react.memo_cache_sentinel")?(N=(0,r.jsx)("p",{className:"riri-hero__card-label",children:"Est. 2024"}),es[8]=N):N=es[8],es[9]===Symbol.for("react.memo_cache_sentinel")?(S=(0,r.jsx)("br",{}),es[9]=S):S=es[9],es[10]===Symbol.for("react.memo_cache_sentinel")?(R=(0,r.jsx)("br",{}),es[10]=R):R=es[10],es[11]===Symbol.for("react.memo_cache_sentinel")?(z=(0,r.jsx)("div",{className:"riri-hero__body",children:(0,r.jsx)("div",{className:"riri-wrap",children:(0,r.jsxs)("div",{className:"riri-hero__layout",children:[k,(0,r.jsx)("div",{className:"riri-hero__right",children:(0,r.jsxs)("div",{className:"riri-hero__card",children:[N,(0,r.jsxs)("h1",{className:"riri-hero__card-title",children:["Discover a",S,"New Era of",R,(0,r.jsxs)("em",{children:["Books,",(0,r.jsx)("br",{}),"Creativity"]}),(0,r.jsx)("br",{}),"& Innovation"]})]})})]})})}),es[11]=z):z=es[11],es[12]===Symbol.for("react.memo_cache_sentinel")?(P=(0,r.jsxs)("header",{className:"riri-hero",children:[d,f,u,z,(0,r.jsx)("div",{className:"riri-hero__proof-bar",children:(0,r.jsxs)("div",{className:"riri-wrap riri-hero__proof-inner",children:[(0,r.jsxs)("span",{className:"riri-hero__proof-item",children:["Joined by ",(0,r.jsx)("strong",{children:"12,000+"})," readers & researchers"]}),(0,r.jsx)("span",{className:"riri-hero__proof-sep"}),(0,r.jsx)("span",{className:"riri-hero__proof-item",children:"1,500+ published works"}),(0,r.jsx)("span",{className:"riri-hero__proof-sep"}),(0,r.jsx)("span",{className:"riri-hero__proof-item",children:"40+ partner institutions"})]})})]}),E=(0,r.jsx)(h,{}),es[12]=P,es[13]=E):(P=es[12],E=es[13]),es[14]===Symbol.for("react.memo_cache_sentinel")?(C=(0,r.jsx)("div",{className:"riri-stats-bg",style:{backgroundImage:"url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1600&q=80')"},"aria-hidden":"true"}),I=(0,r.jsx)("div",{className:"riri-stats-overlay","aria-hidden":"true"}),es[14]=C,es[15]=I):(C=es[14],I=es[15]),es[16]===Symbol.for("react.memo_cache_sentinel")?(O=(0,r.jsx)("p",{className:"riri-section__overline",children:"Our Impact"}),es[16]=O):O=es[16],es[17]===Symbol.for("react.memo_cache_sentinel")?(A=(0,r.jsx)(_,{children:(0,r.jsxs)("div",{className:"riri-section__header riri-section__header--split",children:[(0,r.jsxs)("div",{children:[O,(0,r.jsxs)("h2",{className:"riri-section__title",children:["Built for real academic",(0,r.jsx)("br",{}),"and creative impact"]})]}),(0,r.jsx)("p",{className:"riri-section__desc",children:"From compelling dissertations to groundbreaking research, RIRI drives innovation and knowledge sharing across Rwanda and the continent."})]})}),es[17]=A):A=es[17],es[18]===Symbol.for("react.memo_cache_sentinel")?(D=(0,r.jsxs)("section",{className:"riri-section riri-stats-section",children:[C,I,(0,r.jsxs)("div",{className:"riri-wrap riri-stats-inner",children:[A,(0,r.jsx)("div",{className:"riri-stats-grid",children:l.map(w)})]})]}),es[18]=D):D=es[18],es[19]===Symbol.for("react.memo_cache_sentinel")?(M=(0,r.jsx)("p",{className:"riri-section__overline",children:"Latest Works"}),es[19]=M):M=es[19],es[20]===Symbol.for("react.memo_cache_sentinel")?(q=(0,r.jsx)(_,{children:(0,r.jsxs)("div",{className:"riri-section__header",children:[M,(0,r.jsxs)("h2",{className:"riri-section__title",children:["Explore the latest dissertations",(0,r.jsx)("br",{}),"and research publications"]})]})}),es[20]=q):q=es[20],es[21]===Symbol.for("react.memo_cache_sentinel")?(T=(0,r.jsx)("div",{className:"riri-books-grid",children:s.map(y)}),es[21]=T):T=es[21],es[22]===Symbol.for("react.memo_cache_sentinel")?(F=(0,r.jsx)("section",{className:"riri-section riri-books-section",children:(0,r.jsxs)("div",{className:"riri-wrap",children:[q,T,(0,r.jsx)(_,{children:(0,r.jsxs)("div",{className:"riri-books-footer",children:[(0,r.jsx)("p",{className:"riri-books-footer__quote",children:'"We believe in the power of every story."'}),(0,r.jsx)(a.default,{href:"/publications",className:"riri-btn riri-btn--outline",children:"View all publications →"})]})})]})}),es[22]=F):F=es[22],es[23]===Symbol.for("react.memo_cache_sentinel")?(U=(0,r.jsxs)("div",{className:"riri-media-card__image",children:[(0,r.jsx)(t.default,{src:"/thesis.jpg",fill:!0,alt:"RIRI Creative Community",className:"riri-media-card__img",unoptimized:!0}),(0,r.jsx)("div",{className:"riri-media-card__overlay"})]}),es[23]=U):U=es[23],es[24]===Symbol.for("react.memo_cache_sentinel")?($=(0,r.jsx)("span",{className:"riri-media-card__tag",children:"Community Spotlight"}),es[24]=$):$=es[24],es[25]===Symbol.for("react.memo_cache_sentinel")?(B=(0,r.jsx)("section",{className:"riri-section riri-media-section",children:(0,r.jsx)("div",{className:"riri-wrap",children:(0,r.jsx)(_,{children:(0,r.jsxs)("div",{className:"riri-media-card",children:[U,(0,r.jsxs)("div",{className:"riri-media-card__content",children:[$,(0,r.jsxs)("h2",{className:"riri-media-card__title",children:["A glimpse into our",(0,r.jsx)("br",{}),"Creative Community"]}),(0,r.jsx)("p",{className:"riri-media-card__body",children:"Where stories transcend the written word. Dive into our latest multimedia features and discover the voices shaping Rwanda's literary future."}),(0,r.jsx)(a.default,{href:"/community",className:"riri-btn riri-btn--white",children:"Meet the community →"})]})]})})})}),es[25]=B):B=es[25],es[26]===Symbol.for("react.memo_cache_sentinel")?(L=(0,r.jsx)(_,{children:(0,r.jsxs)("div",{className:"riri-section__header",children:[(0,r.jsx)("p",{className:"riri-section__overline",children:"The Process"}),(0,r.jsx)("h2",{className:"riri-section__title",children:"How RIRI works"})]})}),es[26]=L):L=es[26],es[27]===Symbol.for("react.memo_cache_sentinel")?(W=(0,r.jsx)("section",{className:"riri-section riri-how-section",children:(0,r.jsxs)("div",{className:"riri-wrap",children:[L,(0,r.jsx)("div",{className:"riri-how-grid",children:c.map(x)})]})}),es[27]=W):W=es[27],es[28]===Symbol.for("react.memo_cache_sentinel")?(G=(0,r.jsx)("div",{className:"riri-quote-card__mark",children:'"'}),H=(0,r.jsx)("blockquote",{className:"riri-quote-card__text",children:"The future of literature lies in the intersection of technology and creativity. At RIRI, we are pioneering new ways to experience stories, connect authors with readers, and foster innovation in the literary world."}),es[28]=G,es[29]=H):(G=es[28],H=es[29]),es[30]===Symbol.for("react.memo_cache_sentinel")?(Y=(0,r.jsx)("section",{className:"riri-section riri-quote-section",children:(0,r.jsx)("div",{className:"riri-wrap",children:(0,r.jsx)(_,{children:(0,r.jsxs)("div",{className:"riri-quote-card",children:[G,H,(0,r.jsxs)("div",{className:"riri-quote-card__author",children:[(0,r.jsx)("div",{className:"riri-quote-card__avatar",children:"DI"}),(0,r.jsxs)("div",{children:[(0,r.jsx)("p",{className:"riri-quote-card__name",children:"Dr. Mungwarakarama Irene"}),(0,r.jsx)("p",{className:"riri-quote-card__role",children:"Founder, RIRI Platform"})]})]})]})})})}),es[30]=Y):Y=es[30],es[31]===Symbol.for("react.memo_cache_sentinel")?(V=(0,r.jsx)("p",{className:"riri-section__overline",children:"Community"}),es[31]=V):V=es[31],es[32]===Symbol.for("react.memo_cache_sentinel")?(X=(0,r.jsx)(_,{children:(0,r.jsxs)("div",{className:"riri-section__header riri-section__header--split",children:[(0,r.jsxs)("div",{children:[V,(0,r.jsxs)("h2",{className:"riri-section__title",children:["Join our upcoming",(0,r.jsx)("br",{}),"events & workshops"]})]}),(0,r.jsx)(a.default,{href:"/events",className:"riri-btn riri-btn--outline riri-section__view-all",children:"View all events →"})]})}),es[32]=X):X=es[32],es[33]===Symbol.for("react.memo_cache_sentinel")?(K=(0,r.jsx)("section",{className:"riri-section riri-events-section",children:(0,r.jsxs)("div",{className:"riri-wrap",children:[X,(0,r.jsx)("div",{className:"riri-events-grid",children:n.map(v)})]})}),es[33]=K):K=es[33],es[34]===Symbol.for("react.memo_cache_sentinel")?(J=(0,r.jsx)("p",{className:"riri-section__overline",children:"Why RIRI"}),es[34]=J):J=es[34],es[35]===Symbol.for("react.memo_cache_sentinel")?(Q=(0,r.jsxs)("h2",{className:"riri-cta-card__title",children:["The home for Rwanda's best",(0,r.jsx)("br",{}),"academic and creative voices"]}),es[35]=Q):Q=es[35],es[36]===Symbol.for("react.memo_cache_sentinel")?(Z=(0,r.jsxs)("ul",{className:"riri-cta-list",children:[(0,r.jsx)("li",{children:"A trusted home for academic and creative excellence"}),(0,r.jsx)("li",{children:"Clear categories for research, innovation, and events"}),(0,r.jsx)("li",{children:"Opportunities for institutions, authors, and readers to collaborate"})]}),es[36]=Z):Z=es[36],es[37]===Symbol.for("react.memo_cache_sentinel")?(ee=(0,r.jsxs)("main",{className:"riri-main",children:[D,F,B,W,Y,K,(0,r.jsx)("section",{className:"riri-section riri-cta-section",children:(0,r.jsx)("div",{className:"riri-wrap",children:(0,r.jsx)(_,{children:(0,r.jsx)("div",{className:"riri-cta-card",children:(0,r.jsxs)("div",{className:"riri-cta-card__inner",children:[J,Q,Z,(0,r.jsxs)("div",{className:"riri-cta-actions",children:[(0,r.jsx)(a.default,{href:"/publications",className:"riri-btn riri-btn--white",children:"Explore Publications"}),(0,r.jsx)(a.default,{href:"/innovation",className:"riri-btn riri-btn--gold",children:"Discover Innovations"})]})]})})})})})]}),es[37]=ee):ee=es[37],es[38]===Symbol.for("react.memo_cache_sentinel")?(er=(0,r.jsxs)("div",{className:"riri-footer__brand",children:[(0,r.jsx)("div",{className:"riri-footer__logo",children:"RIRI"}),(0,r.jsx)("p",{className:"riri-footer__tagline",children:"Discover. Create. Inspire."})]}),es[38]=er):er=es[38],es[39]===Symbol.for("react.memo_cache_sentinel")?(ei=(0,r.jsxs)("div",{className:"riri-footer__col",children:[(0,r.jsx)("h4",{className:"riri-footer__col-title",children:"Platform"}),(0,r.jsx)(a.default,{href:"/publications",className:"riri-footer__link",children:"Publications"}),(0,r.jsx)(a.default,{href:"/innovation",className:"riri-footer__link",children:"Innovation"}),(0,r.jsx)(a.default,{href:"/events",className:"riri-footer__link",children:"Events"}),(0,r.jsx)(a.default,{href:"/community",className:"riri-footer__link",children:"Community"})]}),es[39]=ei):ei=es[39],es[40]===Symbol.for("react.memo_cache_sentinel")?(et=(0,r.jsxs)("div",{className:"riri-footer__col",children:[(0,r.jsx)("h4",{className:"riri-footer__col-title",children:"Contact"}),(0,r.jsx)("a",{href:"mailto:hello@riri.com",className:"riri-footer__link",children:"hello@riri.com"}),(0,r.jsx)("span",{className:"riri-footer__text",children:"Kigali, Rwanda"})]}),es[40]=et):et=es[40],es[41]===Symbol.for("react.memo_cache_sentinel")?(ea=(0,r.jsxs)("div",{className:"riri-footer__top",children:[er,(0,r.jsxs)("div",{className:"riri-footer__cols",children:[ei,et,(0,r.jsxs)("div",{className:"riri-footer__col",children:[(0,r.jsx)("h4",{className:"riri-footer__col-title",children:"Follow Us"}),m.map(b)]})]})]}),es[41]=ea):ea=es[41],es[42]===Symbol.for("react.memo_cache_sentinel")?(eo=(0,r.jsxs)(r.Fragment,{children:[e,o,P,E,ee,(0,r.jsx)("footer",{className:"riri-footer",children:(0,r.jsxs)("div",{className:"riri-wrap",children:[ea,(0,r.jsxs)("div",{className:"riri-footer__bottom",children:[(0,r.jsxs)("p",{children:["© ",new Date().getFullYear()," RIRI. All rights reserved."]}),(0,r.jsx)("p",{children:"Made with care in Kigali 🇷🇼"})]})]})})]}),es[42]=eo):eo=es[42],eo}])}]);