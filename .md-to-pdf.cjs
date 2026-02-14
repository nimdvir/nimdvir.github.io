module.exports = {
  stylesheet: [
    'https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.1.0/github-markdown.min.css'
  ],
  body_class: 'markdown-body',
  css: `
    body {
      counter-reset: h1counter;
      padding: 2em;
    }
    
    h1 {
      counter-reset: h2counter;
    }
    
    h1:before {
      counter-increment: h1counter;
      content: counter(h1counter) ". ";
    }
    
    h2 {
      counter-reset: h3counter;
    }
    
    h2:before {
      counter-increment: h2counter;
      content: counter(h1counter) "." counter(h2counter) ". ";
    }
    
    h3 {
      counter-reset: h4counter;
    }
    
    h3:before {
      counter-increment: h3counter;
      content: counter(h1counter) "." counter(h2counter) "." counter(h3counter) ". ";
    }
    
    h4:before {
      counter-increment: h4counter;
      content: counter(h1counter) "." counter(h2counter) "." counter(h3counter) "." counter(h4counter) ". ";
    }
  `,
  pdf_options: {
    format: 'A4',
    margin: '20mm',
    printBackground: true
  }
}
