module.exports=[18622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,a)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},93695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},84423,(e,t,a)=>{t.exports=e.x("nodemailer-9c35dd349a8aaa9f",()=>require("nodemailer-9c35dd349a8aaa9f"))},64558,e=>{"use strict";var t=e.i(47909),a=e.i(74017),r=e.i(96250),n=e.i(59756),o=e.i(61916),i=e.i(74677),s=e.i(69741),l=e.i(16795),d=e.i(87718),p=e.i(95169),c=e.i(47587),u=e.i(66012),h=e.i(70101),x=e.i(26937),g=e.i(10372),f=e.i(93695);e.i(20232);var m=e.i(5232),b=e.i(89171),v=e.i(84423);async function y(e){let{studentName:t,studentEmail:a,amount:r,invoiceId:n,paymentMethod:o}=await e.json();if(!a)return b.NextResponse.json({ok:!1,error:"No email"},{status:400});let i=process.env.EMAIL_USER,s=process.env.EMAIL_PASS;if(!i||!s)return console.warn("Email not configured — skipping congratulation email."),b.NextResponse.json({ok:!0,skipped:!0});let l=Math.round(.25*Number(r)),d=Math.round(.75*Number(r)),p=e=>"₹"+e.toLocaleString("en-IN"),c=v.default.createTransport({host:"smtp.gmail.com",port:587,secure:!1,auth:{user:i,pass:s}}),u=`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { margin: 0; padding: 0; background: #f6f1e7; font-family: Inter, Arial, sans-serif; }
    .wrap { max-width: 580px; margin: 32px auto; background: #fff; border-radius: 12px;
      overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: #161a33; padding: 36px 40px; text-align: center; }
    .logo { width: 52px; height: 52px; border-radius: 10px; background: #e24138;
      color: #fff; font-size: 26px; font-weight: 700; display: inline-flex;
      align-items: center; justify-content: center; margin-bottom: 14px; }
    .brand { color: #fff; font-size: 22px; font-weight: 700; margin: 0 0 4px; }
    .brand-sub { color: rgba(255,255,255,0.5); font-size: 13px; }
    .body { padding: 40px; }
    .greeting { font-size: 22px; font-weight: 700; color: #161a33; margin: 0 0 16px; }
    .text { font-size: 15px; line-height: 1.7; color: #5b564f; margin: 0 0 20px; }
    .success-badge { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px;
      padding: 18px 22px; display: flex; align-items: center; gap: 14px; margin: 24px 0; }
    .check { width: 42px; height: 42px; border-radius: 50%; background: #22c55e;
      color: #fff; font-size: 22px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .success-text strong { display: block; font-size: 15px; color: #15803d; font-weight: 700; margin-bottom: 3px; }
    .success-text span { font-size: 13px; color: #4ade80; }
    .donation-box { background: linear-gradient(135deg, #fef2f2 0%, #fff1f2 100%);
      border: 1.5px solid #fecaca; border-radius: 10px; padding: 24px; margin: 24px 0; }
    .donation-title { font-size: 16px; font-weight: 700; color: #dc2626; margin: 0 0 16px;
      display: flex; align-items: center; gap: 8px; }
    .fee-row { display: flex; justify-content: space-between; padding: 10px 0;
      border-bottom: 1px dashed #fecaca; font-size: 14px; color: #5b564f; }
    .fee-row:last-child { border-bottom: none; font-weight: 700; color: #161a33; }
    .fee-row .highlight { color: #dc2626; font-weight: 700; }
    .wheelchair-note { background: #eff6ff; border-radius: 8px; padding: 16px 18px; margin: 20px 0;
      font-size: 14px; color: #1d4ed8; line-height: 1.65; }
    .cta { text-align: center; margin: 32px 0; }
    .cta-btn { background: #e24138; color: #fff; text-decoration: none; padding: 14px 32px;
      border-radius: 6px; font-weight: 700; font-size: 15px; display: inline-block; }
    .footer { background: #111425; padding: 28px 40px; text-align: center; }
    .footer p { color: rgba(255,255,255,0.45); font-size: 12.5px; margin: 0 0 6px; line-height: 1.6; }
    .footer-brand { color: rgba(255,255,255,0.7); font-size: 13px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <div class="logo">本</div>
      <div class="brand">மொழிப்பற்று \xb7 Mozhippattru</div>
      <div class="brand-sub">Japanese Language School \xb7 日本語学校</div>
    </div>
    <div class="body">
      <p class="greeting">Dear ${t||"Student"},</p>
      <p class="text">
        Thank you for enrolling with <strong>Mozhippattru Japanese Academy</strong>.
        Your payment has been received successfully. We&apos;re excited to have you on
        this Japanese language journey! 🎌
      </p>

      <div class="success-badge">
        <div class="check">✓</div>
        <div class="success-text">
          <strong>Payment Confirmed \xb7 ${n?`Invoice #${n.slice(0,8).toUpperCase()}`:"Payment Received"}</strong>
          <span>Paid via ${o||"online"} \xb7 ${new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}</span>
        </div>
      </div>

      <div class="donation-box">
        <div class="donation-title">❤️ Your Contribution Breakdown</div>
        <div class="fee-row">
          <span>Total Amount Paid</span>
          <span>${p(Number(r))}</span>
        </div>
        <div class="fee-row">
          <span class="highlight">♿ 25% Wheelchair Donation Fund</span>
          <span class="highlight">${p(l)}</span>
        </div>
        <div class="fee-row">
          <span>Your Course Fee</span>
          <span>${p(d)}</span>
        </div>
      </div>

      <div class="wheelchair-note">
        ♿ <strong>Because of your enrollment</strong>, ${p(l)} has been contributed to our
        Electric Wheelchair Donation Fund. You are helping someone with a physical disability regain
        independence and mobility. Thank you for learning while making a positive impact on society.
      </div>

      <p class="text">
        Our team will reach out to you shortly with your batch details, class schedule,
        and access to the student portal. If you have any questions, feel free to reply to this email.
      </p>

      <div class="cta">
        <a href="https://mozhippattru.org/login" class="cta-btn">Access Student Portal →</a>
      </div>

      <p class="text" style="font-size:13px;color:#9ca3af;margin:0;">
        Regards,<br />
        <strong style="color:#161a33;">Mozhippattru Japanese Academy</strong><br />
        மொழிப்பற்று \xb7 Japanese Language School
      </p>
    </div>
    <div class="footer">
      <p class="footer-brand">மொழிப்பற்று \xb7 Mozhippattru \xb7 日本語学校</p>
      <p>Japanese Language School \xb7 Online &amp; In-class \xb7 India</p>
      <p>mozhippattru@gmail.com \xb7 mozhippattru.org</p>
    </div>
  </div>
</body>
</html>`;try{return await c.sendMail({from:`"Mozhippattru Japanese Academy" <${i}>`,to:a,subject:"Thank You for Supporting Education & Mobility 🎌",html:u}),b.NextResponse.json({ok:!0})}catch(e){return console.error("Email send error:",e),b.NextResponse.json({ok:!1,error:"Email failed"},{status:500})}}e.s(["POST",0,y],79478);var w=e.i(79478);let R=new t.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/send-payment-email/route",pathname:"/api/send-payment-email",filename:"route",bundlePath:""},distDir:".next-localcheck",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/send-payment-email/route.ts",nextConfigOutput:"",userland:w,...{}}),{workAsyncStorage:E,workUnitAsyncStorage:k,serverHooks:C}=R;async function A(e,t,r){r.requestMeta&&(0,n.setRequestMeta)(e,r.requestMeta),R.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let b="/api/send-payment-email/route";b=b.replace(/\/index$/,"")||"/";let v=await R.prepare(e,t,{srcPage:b,multiZoneDraftMode:!1});if(!v)return t.statusCode=400,t.end("Bad Request"),null==r.waitUntil||r.waitUntil.call(r,Promise.resolve()),null;let{buildId:y,deploymentId:w,params:E,nextConfig:k,parsedUrl:C,isDraftMode:A,prerenderManifest:N,routerServerContext:S,isOnDemandRevalidate:P,revalidateOnlyGenerated:T,resolvedPathname:j,clientReferenceManifest:q,serverActionsManifest:M}=v,I=(0,s.normalizeAppPath)(b),O=!!(N.dynamicRoutes[I]||N.routes[j]),z=async()=>((null==S?void 0:S.render404)?await S.render404(e,t,C,!1):t.end("This page could not be found"),null);if(O&&!A){let e=!!N.routes[j],t=N.dynamicRoutes[I];if(t&&!1===t.fallback&&!e){if(k.adapterPath)return await z();throw new f.NoFallbackError}}let _=null;!O||R.isDev||A||(_="/index"===(_=j)?"/":_);let D=!0===R.isDev||!O,$=O&&!D;M&&q&&(0,i.setManifestsSingleton)({page:b,clientReferenceManifest:q,serverActionsManifest:M});let U=e.method||"GET",H=(0,o.getTracer)(),L=H.getActiveScopeSpan(),F=!!(null==S?void 0:S.isWrappedByNextServer),B=!!(0,n.getRequestMeta)(e,"minimalMode"),K=(0,n.getRequestMeta)(e,"incrementalCache")||await R.getIncrementalCache(e,k,N,B);null==K||K.resetRequestCache(),globalThis.__incrementalCache=K;let J={params:E,previewProps:N.preview,renderOpts:{experimental:{authInterrupts:!!k.experimental.authInterrupts},cacheComponents:!!k.cacheComponents,supportsDynamicResponse:D,incrementalCache:K,cacheLifeProfiles:k.cacheLife,waitUntil:r.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,r,n)=>R.onRequestError(e,t,r,n,S)},sharedContext:{buildId:y,deploymentId:w}},W=new l.NodeNextRequest(e),Y=new l.NodeNextResponse(t),G=d.NextRequestAdapter.fromNodeNextRequest(W,(0,d.signalFromNodeResponse)(t));try{let n,i=async e=>R.handle(G,J).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=H.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=a.get("next.route");if(r){let t=`${U} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t),n&&n!==e&&(n.setAttribute("http.route",r),n.updateName(t))}else e.updateName(`${U} ${b}`)}),s=async n=>{var o,s;let l=async({previousCacheEntry:a})=>{try{if(!B&&P&&T&&!a)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let o=await i(n);e.fetchMetrics=J.renderOpts.fetchMetrics;let s=J.renderOpts.pendingWaitUntil;s&&r.waitUntil&&(r.waitUntil(s),s=void 0);let l=J.renderOpts.collectedTags;if(!O)return await (0,u.sendResponse)(W,Y,o,J.renderOpts.pendingWaitUntil),null;{let e=await o.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(o.headers);l&&(t[g.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==J.renderOpts.collectedRevalidate&&!(J.renderOpts.collectedRevalidate>=g.INFINITE_CACHE)&&J.renderOpts.collectedRevalidate,r=void 0===J.renderOpts.collectedExpire||J.renderOpts.collectedExpire>=g.INFINITE_CACHE?void 0:J.renderOpts.collectedExpire;return{value:{kind:m.CachedRouteKind.APP_ROUTE,status:o.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:r}}}}catch(t){throw(null==a?void 0:a.isStale)&&await R.onRequestError(e,t,{routerKind:"App Router",routePath:b,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:$,isOnDemandRevalidate:P})},!1,S),t}},d=await R.handleResponse({req:e,nextConfig:k,cacheKey:_,routeKind:a.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:N,isRoutePPREnabled:!1,isOnDemandRevalidate:P,revalidateOnlyGenerated:T,responseGenerator:l,waitUntil:r.waitUntil,isMinimalMode:B});if(!O)return null;if((null==d||null==(o=d.value)?void 0:o.kind)!==m.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(s=d.value)?void 0:s.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",P?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),A&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let p=(0,h.fromNodeOutgoingHttpHeaders)(d.value.headers);return B&&O||p.delete(g.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||p.get("Cache-Control")||p.set("Cache-Control",(0,x.getCacheControlHeader)(d.cacheControl)),await (0,u.sendResponse)(W,Y,new Response(d.value.body,{headers:p,status:d.value.status||200})),null};F&&L?await s(L):(n=H.getActiveScopeSpan(),await H.withPropagatedContext(e.headers,()=>H.trace(p.BaseServerSpan.handleRequest,{spanName:`${U} ${b}`,kind:o.SpanKind.SERVER,attributes:{"http.method":U,"http.target":e.url}},s),void 0,!F))}catch(t){if(t instanceof f.NoFallbackError||await R.onRequestError(e,t,{routerKind:"App Router",routePath:I,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:$,isOnDemandRevalidate:P})},!1,S),O)throw t;return await (0,u.sendResponse)(W,Y,new Response(null,{status:500})),null}}e.s(["handler",0,A,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:E,workUnitAsyncStorage:k})},"routeModule",0,R,"serverHooks",0,C,"workAsyncStorage",0,E,"workUnitAsyncStorage",0,k],64558)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__1qzmokz._.js.map