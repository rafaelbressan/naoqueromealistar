const fs = require('fs');
const data = JSON.parse(fs.readFileSync('/home/user/naoqueromealistar/data/quiz-tree.json', 'utf8'));

// Legal document links
const legalLinks = {
  'Decreto 57.654': 'https://www.planalto.gov.br/ccivil_03/decreto/d57654.htm',
  'IGISC': 'https://www.planalto.gov.br/ccivil_03/decreto/1990-1994/d0703.htm',
  'Decreto 703': 'https://www.planalto.gov.br/ccivil_03/decreto/1990-1994/d0703.htm',
  'Constituição Federal': 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm',
  'Portaria 326': 'https://www.in.gov.br/materia/-/asset_publisher/Kujrw0TZC2Mb/content/id/70267025',
  'Lei 6.880': 'https://www.planalto.gov.br/ccivil_03/leis/l6880.htm',
};

function getLegalLink(baseLegal) {
  if (!baseLegal) return null;
  for (const [key, link] of Object.entries(legalLinks)) {
    if (baseLegal.includes(key)) {
      return link;
    }
  }
  return null;
}

function ensureDot(text) {
  if (!text) return text;
  const trimmed = text.trim();
  // Don't add dot if already ends with punctuation
  if (trimmed.endsWith('.') || trimmed.endsWith('!') || trimmed.endsWith('?') || trimmed.endsWith(':') || trimmed.endsWith(')')) {
    return text;
  }
  // Don't add dot if it's a list (starts with bullet points)
  if (trimmed.startsWith('•')) {
    return text;
  }
  return text + '.';
}

// Process each question
for (const [id, question] of Object.entries(data)) {
  // Add dot to explicacao
  if (question.explicacao) {
    question.explicacao = ensureDot(question.explicacao);
  }

  // Process responses
  for (const [key, response] of Object.entries(question.respostas || {})) {
    // Add legal links
    if (response.base_legal && !response.link_legal) {
      const link = getLegalLink(response.base_legal);
      if (link) {
        response.link_legal = link;
      }
    }
  }
}

fs.writeFileSync('/home/user/naoqueromealistar/data/quiz-tree.json', JSON.stringify(data, null, 2));
console.log('Updated quiz-tree.json with dots and legal links');
