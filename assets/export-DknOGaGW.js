class d{static exportToDocx(o,t="poem.docx"){const e=Array.isArray(o)?o:[o];let n="";e.forEach(r=>{n+=`${r.title||"Untitled"}

`,n+=`${new Date(r.date).toLocaleDateString()}

`,n+=`${r.content}

`,r.tags.length>0&&(n+=`Tags: ${r.tags.join(", ")}

`),n+=`---

`});const c=new Blob([n],{type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"}),a=URL.createObjectURL(c),i=document.createElement("a");i.href=a,i.download=t,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(a)}static exportToMarkdown(o){let t=`# My Poetry Collection

`;return o.forEach(e=>{t+=`## ${e.title||"Untitled"}

`,t+=`*${new Date(e.date).toLocaleDateString()}*

`,t+=`${e.content}

`,e.tags.length>0&&(t+=`Tags: ${e.tags.join(", ")}

`),t+=`---

`}),t}static exportToHTML(o){let t=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Poetry Collection</title>
  <style>
    body { font-family: serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.8; }
    h1 { text-align: center; margin-bottom: 60px; }
    .poem { page-break-inside: avoid; margin-bottom: 60px; }
    .poem-title { font-size: 1.5em; margin-bottom: 10px; }
    .poem-date { color: #666; font-size: 0.9em; margin-bottom: 20px; }
    .poem-content { white-space: pre-wrap; margin-bottom: 20px; }
    .poem-tags { font-size: 0.9em; color: #666; }
    hr { margin: 40px 0; border: none; border-top: 1px solid #ddd; }
  </style>
</head>
<body>
  <h1>My Poetry Collection</h1>
`;return o.forEach(e=>{t+=`  <div class="poem">
    <div class="poem-title">${e.title||"Untitled"}</div>
    <div class="poem-date">${new Date(e.date).toLocaleDateString()}</div>
    <div class="poem-content">${e.content}</div>
    ${e.tags.length>0?`<div class="poem-tags">Tags: ${e.tags.join(", ")}</div>`:""}
  </div>
  <hr>
`}),t+=`</body>
</html>`,t}static downloadFile(o,t,e){const n=new Blob([o],{type:e}),c=URL.createObjectURL(n),a=document.createElement("a");a.href=c,a.download=t,document.body.appendChild(a),a.click(),document.body.removeChild(a),URL.revokeObjectURL(c)}static exportToPDF(o){const t=this.exportToHTML(o),e=window.open("","_blank");e&&(e.document.write(t),e.document.close(),setTimeout(()=>{e.print()},250))}static importFromJSON(o){try{const t=JSON.parse(o);return Array.isArray(t)?t:[]}catch(t){return console.error("Import failed:",t),[]}}}export{d as ExportService};
