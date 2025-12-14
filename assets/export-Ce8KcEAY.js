class d{static exportToDocx(n,t="poem.docx"){const e=Array.isArray(n)?n:[n];let o="";e.forEach(c=>{o+=`${c.title||"Untitled"}

`,o+=`${new Date(c.date).toLocaleDateString()}

`,o+=`${c.content}

`,c.tags.length>0&&(o+=`Tags: ${c.tags.join(", ")}

`),o+=`---

`});const a=new Blob([o],{type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"}),i=URL.createObjectURL(a),r=document.createElement("a");r.href=i,r.download=t,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(i)}static exportToMarkdown(n){let t=`# My Poetry Collection

`;return n.forEach(e=>{t+=`## ${e.title||"Untitled"}

`,t+=`*${new Date(e.date).toLocaleDateString()}*

`,t+=`${e.content}

`,e.tags.length>0&&(t+=`Tags: ${e.tags.join(", ")}

`),t+=`---

`}),t}static exportToHTML(n){let t="serif";try{const o=localStorage.getItem("poeset_settings");if(o){const a=JSON.parse(o);a.selectedCustomFont?t=`'${a.selectedCustomFont}', ${a.fontFamily||"serif"}`:a.fontFamily&&(t=a.fontFamily)}}catch{}let e=`<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wiersz</title>
  <style>
    body { font-family: ${t}; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.8; background: #fff; color: #222; }
    .poem { page-break-inside: avoid; margin-bottom: 60px; }
    .poem-title { font-size: 2em; margin-bottom: 10px; font-weight: 600; text-align: center; }
    .poem-date { color: #666; font-size: 1em; margin-bottom: 24px; text-align: center; }
    .poem-content { white-space: pre-wrap; margin-bottom: 20px; font-size: 1.15em; text-align: center; }
  </style>
</head>
<body>
`;return n.forEach(o=>{e+=`<div class="poem">
  <div class="poem-title">${o.title||"Untitled"}</div>
  <div class="poem-date">${new Date(o.date).toLocaleDateString()}</div>
  <div class="poem-content">${o.content}</div>
</div>
`}),e+=`</body>
</html>`,e}static downloadFile(n,t,e){const o=new Blob([n],{type:e}),a=URL.createObjectURL(o),i=document.createElement("a");i.href=a,i.download=t,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(a)}static exportToPDF(n){const t=this.exportToHTML(n),e=window.open("","_blank");e&&(e.document.write(t),e.document.close(),setTimeout(()=>{e.print()},250))}static importFromJSON(n){try{const t=JSON.parse(n);return Array.isArray(t)?t:[]}catch(t){return console.error("Import failed:",t),[]}}}export{d as ExportService};
