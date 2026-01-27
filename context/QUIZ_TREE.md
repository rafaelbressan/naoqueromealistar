# Árvore de Decisão - Quiz de Dispensa do Serviço Militar Obrigatório (Brasil)

## Sobre este documento

Este documento contém a árvore de decisão completa para um quiz interativo que ajuda jovens brasileiros a descobrir se são elegíveis para dispensa do serviço militar obrigatório.

**Base Legal Principal:**
- Decreto 57.654/1966 (Regulamento da Lei do Serviço Militar - RLSM)
- Decreto 703/1992 (IGISC - Instruções Gerais para Inspeção de Saúde de Conscritos)
- Portaria 326-DGP/2019 (Normas Técnicas para JSM)
- Constituição Federal de 1988, Art. 5º, VIII e Art. 143, §1º

---

## Estrutura das Fases

| Fase | Código | Foco | Perguntas |
|------|--------|------|-----------|
| 1 | P1-P4 | Filtros demográficos (sexo, idade) | 4 |
| 2 | P5-P7 | Localização/Residência | 5 |
| 3 | P8 | Situação familiar (arrimo) | 2 + seleção |
| 4 | P9-P11 | Religião/Objeção de consciência | 5 |
| 5 | P12-P14 | Educação/Profissão | 3 |
| 6 | P15-P60 | Condições médicas (10 categorias) | ~45 |

**Estimativa:** Usuário responde em média 5-15 perguntas dependendo do caminho.

---

## Legenda de Notação

- `[P#]` = Pergunta (com número identificador)
- `→ SIM` = Caminho se responder sim
- `→ NÃO` = Caminho se responder não
- `🎉 FIM` = Resultado final - DISPENSADO (com razão e base legal)
- `💡 DICA` = Orientação sem resultado definitivo
- `➡️ [P#]` = Segue para próxima pergunta
- `⚠️ Nota` = Alerta ou informação adicional importante

---

## FASE 1: FILTROS DEMOGRÁFICOS RÁPIDOS

### P1 - Sexo feminino cisgênero

```yaml
id: P1
pergunta: "Você é mulher cisgênero?"
explicacao: "Nasceu mulher e se identifica como mulher"
tipo: sim_nao

respostas:
  sim:
    resultado: FIM_DISPENSADA
    razao: "Mulheres não são obrigadas ao serviço militar em tempo de paz"
    base_legal: "Art. 5º do Decreto 57.654/1966"
    tipo_dispensa: "Isenção automática"
    
  nao:
    proximo: P2
```

### P2 - Mulher transgênero

```yaml
id: P2
pergunta: "Você é uma mulher transgênero?"
explicacao: "Nasceu com sexo masculino mas se identifica como mulher"
tipo: sim_nao

respostas:
  sim:
    resultado: FIM_DISPENSADA
    razao: "Mulheres trans são dispensadas do alistamento, independente de cirurgia"
    base_legal: "Portaria 326-DGP/2019"
    tipo_dispensa: "Dispensa do alistamento"
    
  nao:
    proximo: P3
```

### P3 - Homem transgênero

```yaml
id: P3
pergunta: "Você é homem transgênero?"
explicacao: "Nasceu com sexo feminino mas se identifica como homem"
tipo: sim_nao

respostas:
  sim:
    resultado: FIM_DISPENSADO
    razao: "O alistamento obrigatório se aplica apenas a quem foi designado sexo masculino ao nascer. Homens trans podem se voluntariar."
    base_legal: "Art. 5º do Decreto 57.654/1966 + interpretação"
    tipo_dispensa: "Isenção (pode voluntariar-se)"
    
  nao:
    proximo: P4
```

### P4 - Mais de 30 anos

```yaml
id: P4
pergunta: "Você já tem mais de 30 anos?"
explicacao: "Passou dos 30 e nunca se alistou? Calma..."
tipo: sim_nao

respostas:
  sim:
    resultado: FIM_EXCESSO_CONTINGENTE
    razao: "Brasileiros com mais de 30 anos são automaticamente incluídos no excesso de contingente, mas ainda precisam regularizar a situação militar"
    base_legal: "Art. 93, §2º, nº 3 do Decreto 57.654/1966"
    tipo_dispensa: "Excesso de contingente"
    nota: "Você ainda precisa comparecer à JSM para regularizar e pode ter multas pendentes"
    
  nao:
    proximo: P5
```

---

## FASE 2: LOCALIZAÇÃO/RESIDÊNCIA

### P5 - Residente no exterior

```yaml
id: P5
pergunta: "Você mora fora do Brasil há mais de 1 ano?"
explicacao: "Tá vivendo a vida de gringo?"
tipo: sim_nao

respostas:
  sim:
    resultado: FIM_ADIAMENTO
    razao: "Brasileiros residentes no exterior têm a incorporação adiada enquanto durar a residência"
    base_legal: "Art. 96, §4º e §5º do Decreto 57.654/1966"
    tipo_dispensa: "Adiamento de incorporação"
    nota: "Você ainda precisa se alistar no Consulado brasileiro e se apresentar anualmente"
    
  nao:
    proximo: P6
```

### P6 - Cidade pequena do interior

```yaml
id: P6
pergunta: "Você mora em uma cidade BEM pequena do interior?"
explicacao: "Tipo, cidade que não tem nem agência bancária, sabe? Provavelmente não tem quartel nem nada militar por perto"
tipo: sim_nao

respostas:
  sim:
    proximo: P6_1
    
  nao:
    proximo: P7
```

### P6.1 - Tempo de residência em cidade pequena

```yaml
id: P6_1
pergunta: "Você mora nessa cidade há mais de 1 ano?"
explicacao: "Contando a partir da data de seleção da sua classe"
tipo: sim_nao

respostas:
  sim:
    resultado: FIM_DISPENSADO
    razao: "Residentes há mais de 1 ano em município não tributário são dispensados de incorporação"
    base_legal: "Art. 105, nº 1 do Decreto 57.654/1966"
    tipo_dispensa: "Dispensa de incorporação"
    dica: "Você precisa de um Atestado de Residência da autoridade policial local"
    
  nao:
    proximo: P7
```

### P7 - Zona rural

```yaml
id: P7
pergunta: "Você mora na zona RURAL de alguma cidade?"
explicacao: "Área rural mesmo, não é só bairro afastado. Sítio, fazenda, comunidade rural..."
tipo: sim_nao

respostas:
  sim:
    proximo: P7_1
    
  nao:
    proximo: P8
```

### P7.1 - Tempo de residência em zona rural

```yaml
id: P7_1
pergunta: "Você mora nessa zona rural há mais de 1 ano?"
explicacao: "Contando a partir da data de seleção da sua classe"
tipo: sim_nao

respostas:
  sim:
    resultado: FIM_DISPENSADO
    razao: "Residentes há mais de 1 ano em zona rural de município tributário de OFR são dispensados"
    base_legal: "Art. 105, nº 1 do Decreto 57.654/1966"
    tipo_dispensa: "Dispensa de incorporação"
    dica: "Você precisa de um Atestado de Residência"
    
  nao:
    proximo: P8
```

---

## FASE 3: SITUAÇÃO FAMILIAR (ARRIMO)

### P8 - Arrimo de família

```yaml
id: P8
pergunta: "Você é o ÚNICO responsável pelo sustento da sua família?"
explicacao: "Sem você trabalhando, sua família não teria como se manter. Não vale se seus pais trabalham também, mesmo que informalmente"
tipo: sim_nao

respostas:
  sim:
    proximo: P8_1
    
  nao:
    proximo: P9
```

### P8.1 - Tipo de arrimo

```yaml
id: P8_1
pergunta: "Quem você sustenta?"
explicacao: "Selecione a opção que melhor descreve sua situação"
tipo: selecao_unica

opcoes:
  A:
    texto: "Sou filho único de mãe viúva, solteira, abandonada ou divorciada"
    resultado: FIM_DISPENSADO_ARRIMO
    razao: "Filho único que serve de esteio à mãe"
    base_legal: "Art. 105, §8º, nº 1 do Decreto 57.654/1966"
    
  B:
    texto: "Sustento meu pai que é fisicamente incapaz de trabalhar"
    resultado: FIM_DISPENSADO_ARRIMO
    razao: "Filho que sustenta pai incapaz"
    base_legal: "Art. 105, §8º, nº 2 do Decreto 57.654/1966"
    
  C:
    texto: "Sou viúvo ou divorciado e sustento meu filho menor de idade"
    resultado: FIM_DISPENSADO_ARRIMO
    razao: "Viúvo/divorciado que sustenta filho menor"
    base_legal: "Art. 105, §8º, nº 3 do Decreto 57.654/1966"
    
  D:
    texto: "Sou casado e sustento minha esposa (e/ou filho menor)"
    resultado: FIM_DISPENSADO_ARRIMO
    razao: "Casado que sustenta esposa e/ou filho"
    base_legal: "Art. 105, §8º, nº 4 do Decreto 57.654/1966"
    
  E:
    texto: "Sou solteiro e sustento meu filho menor reconhecido"
    resultado: FIM_DISPENSADO_ARRIMO
    razao: "Solteiro que sustenta filho menor reconhecido"
    base_legal: "Art. 105, §8º, nº 5 do Decreto 57.654/1966"
    
  F:
    texto: "Sou órfão de pai e mãe e sustento irmão menor/inválido ou irmã solteira/viúva"
    resultado: FIM_DISPENSADO_ARRIMO
    razao: "Órfão que sustenta irmãos"
    base_legal: "Art. 105, §8º, nº 6 do Decreto 57.654/1966"
    
  G:
    texto: "Sou órfão de pai e mãe e sustento meu avô/avó idoso(a) incapaz"
    resultado: FIM_DISPENSADO_ARRIMO
    razao: "Órfão que sustenta avós incapazes"
    base_legal: "Art. 105, §8º, nº 7 do Decreto 57.654/1966"
    
  H:
    texto: "Nenhuma dessas opções se aplica"
    proximo: P9
```

---

## FASE 4: RELIGIÃO/CONSCIÊNCIA

### P9 - Sacerdote ou ministro

```yaml
id: P9
pergunta: "Você é padre, pastor, rabino ou ministro de alguma religião?"
explicacao: "Já ordenado/consagrado, não apenas estudando"
tipo: sim_nao

respostas:
  sim:
    resultado: FIM_DISPENSADO
    razao: "Sacerdotes e ministros de qualquer religião são dispensados"
    base_legal: "Art. 98, §2º, nº 1 do Decreto 57.654/1966"
    tipo_dispensa: "Dispensa de incorporação"
    
  nao:
    proximo: P10
```

### P10 - Seminarista

```yaml
id: P10
pergunta: "Você está estudando para ser padre, pastor ou líder religioso?"
explicacao: "Seminarista, estudante de teologia em instituição religiosa..."
tipo: sim_nao

respostas:
  sim:
    resultado: FIM_ADIAMENTO
    razao: "Estudantes em institutos de formação religiosa têm adiamento até a conclusão ou interrupção do curso"
    base_legal: "Art. 98, nº 2, letra 'a' do Decreto 57.654/1966"
    tipo_dispensa: "Adiamento de incorporação"
    
  nao:
    proximo: P11
```

### P11 - Objeção de consciência

```yaml
id: P11
pergunta: "Você é CONTRA servir o exército por motivos religiosos, filosóficos ou políticos?"
explicacao: "Isso se chama 'Objeção de Consciência' ou 'Imperativo de Consciência'. É um direito garantido pela Constituição! Exemplos: pacifismo, crenças religiosas contra violência, convicções políticas antimilitaristas..."
tipo: sim_nao

respostas:
  sim:
    proximo: P11_1
    
  nao:
    proximo: P12
```

### P11.1 - Comprovação de objeção

```yaml
id: P11_1
pergunta: "Você consegue comprovar essa objeção?"
explicacao: |
  Exemplos de comprovação:
  • Declaração de líder religioso (ex: Testemunhas de Jeová têm carta modelo)
  • Filiação a partido/organização pacifista ou antimilitarista
  • Histórico documentado de ativismo
  Não precisa de TUDO isso, mas alguma forma de demonstrar que é genuíno
tipo: sim_nao_talvez

respostas:
  sim:
    resultado: FIM_OBJECAO_CONSCIENCIA
    razao: "A Constituição garante o direito de não prestar serviço militar por objeção de consciência"
    base_legal: "Art. 5º, VIII e Art. 143, §1º da Constituição Federal"
    tipo_dispensa: "Dispensa por objeção de consciência"
    nota: "Você deve declarar isso NO MOMENTO DO ALISTAMENTO. O serviço alternativo nunca foi implementado, então na prática você é dispensado. Se negarem, procure a organização LIVRES ou um advogado."
    
  nao:
    proximo: P11_2
```

### P11.2 - Tentar declaração verbal

```yaml
id: P11_2
pergunta: "Você quer tentar mesmo assim declarando verbalmente?"
explicacao: "Muitas JSM dispensam só pela declaração verbal, mas não é garantido. Vale tentar!"
tipo: sim_nao

respostas:
  sim:
    resultado: DICA_OBJECAO
    instrucao: "No dia do alistamento, declare que você tem objeção de consciência. Se não aceitarem, peça por escrito a negativa e procure ajuda jurídica."
    proximo: P12
    
  nao:
    proximo: P12
```

---

## FASE 5: EDUCAÇÃO/PROFISSÃO

### P12 - Estudante de saúde

```yaml
id: P12
pergunta: "Você está cursando Medicina, Odontologia, Farmácia ou Veterinária?"
explicacao: "Graduação em andamento em instituição reconhecida"
tipo: sim_nao

respostas:
  sim:
    resultado: FIM_ADIAMENTO_MFDV
    razao: "Estudantes desses cursos têm adiamento até a conclusão. PORÉM, depois de formado você pode ser convocado como MFDV (Médico/Farmacêutico/Dentista/Veterinário)"
    base_legal: "Art. 98, nº 2, letra 'c' do Decreto 57.654/1966"
    tipo_dispensa: "Adiamento de incorporação"
    alerta: "Isso é só adiamento! Depois de formado, existe o serviço militar obrigatório de profissionais de saúde (MFDV)"
    
  nao:
    proximo: P13
```

### P13 - Formação militar/PM

```yaml
id: P13
pergunta: "Você está matriculado em algum desses cursos?"
explicacao: |
  • CPOR/NPOR (Centro/Núcleo de Preparação de Oficiais da Reserva)
  • Escola Militar (EsPCEx, AMAN, etc.)
  • Curso de formação de oficiais da PM ou Bombeiros
tipo: selecao_unica

opcoes:
  CPOR_NPOR:
    texto: "CPOR/NPOR ou Escola Militar"
    resultado: FIM_DISPENSADO
    razao: "Você já está em formação militar específica"
    base_legal: "Art. 105, nº 3 e 4 do Decreto 57.654/1966"
    tipo_dispensa: "Dispensa de incorporação regular"
    
  PM_BOMBEIROS:
    texto: "Curso de formação de oficiais da PM ou Bombeiros"
    resultado: FIM_ADIAMENTO
    razao: "Formação em PM/Bombeiros gera adiamento"
    base_legal: "Art. 98, nº 2, letra 'b' do Decreto 57.654/1966"
    tipo_dispensa: "Adiamento de incorporação"
    
  NENHUM:
    texto: "Nenhum desses"
    proximo: P14
```

### P14 - Empresa estratégica

```yaml
id: P14
pergunta: "Você trabalha em uma empresa considerada estratégica para Segurança Nacional?"
explicacao: "Indústrias de defesa, fábricas militares, empresas de transporte/comunicações declaradas pelo Estado-Maior das Forças Armadas. Exemplos: Embraer Defesa, Taurus, Avibras, Imbel... Seu RH saberia te dizer se a empresa está na lista"
tipo: sim_nao

respostas:
  sim:
    resultado: FIM_DISPENSADO
    razao: "Operários e funcionários de empresas de interesse militar são dispensados"
    base_legal: "Art. 105, nº 5 do Decreto 57.654/1966"
    tipo_dispensa: "Dispensa de incorporação"
    dica: "Você precisa de declaração da empresa confirmando seu vínculo"
    
  nao:
    proximo: P15
```

---

## FASE 6: CONDIÇÕES MÉDICAS

### Aviso inicial da Fase 6

```yaml
id: AVISO_FASE_6
tipo: informativo
texto: |
  📋 AVISO: Agora vamos verificar condições de saúde.
  
  Se você tem QUALQUER condição médica significativa, mesmo que não 
  pareça "grave o suficiente", continue respondendo. Muita gente é 
  dispensada por coisas que achava que "não contavam".
  
  Lembre-se: você precisará de LAUDO MÉDICO para comprovar qualquer 
  condição na hora da seleção.
proximo: P15
```

---

### CATEGORIA 6.1: VISÃO

#### P15 - Problema de visão geral

```yaml
id: P15
pergunta: "Você tem algum problema de visão?"
explicacao: "Qualquer coisa: usa óculos, lente, dificuldade pra enxergar..."
tipo: sim_nao
categoria: visao

respostas:
  sim:
    proximo: P15_1
    
  nao:
    proximo: P20
```

#### P15.1 - Cegueira total

```yaml
id: P15_1
pergunta: "Você é TOTALMENTE cego?"
explicacao: "Cegueira total em ambos os olhos"
tipo: sim_nao
categoria: visao

respostas:
  sim:
    resultado: FIM_ISENTO_C
    razao: "Cegueira é causa de isenção definitiva"
    base_legal: "Art. 109 do Decreto 57.654 + Anexo II do IGISC"
    tipo_dispensa: "Isenção (Incapaz C)"
    
  nao:
    proximo: P15_2
```

#### P15.2 - Cegueira monocular

```yaml
id: P15_2
pergunta: "Você é cego de UM olho?"
explicacao: "Visão monocular - enxerga só com um olho"
tipo: sim_nao
categoria: visao

respostas:
  sim:
    resultado: FIM_ISENTO_C
    razao: "Visão monocular é incapacitante para o serviço militar"
    base_legal: "Anexo II do IGISC (Decreto 703/1992)"
    tipo_dispensa: "Isenção (Incapaz C)"
    
  nao:
    proximo: P15_3
```

#### P15.3 - Miopia alta

```yaml
id: P15_3
pergunta: "Você tem miopia ALTA? (mais de 6 graus/dioptrias)"
explicacao: "Olha na receita do seu óculos. Se o número for tipo -6,00 ou mais, você se encaixa aqui"
tipo: sim_nao
categoria: visao

respostas:
  sim:
    resultado: FIM_ISENTO_C
    razao: "Miopia superior a 6 dioptrias é causa de isenção"
    base_legal: "Anexo III do IGISC - Índices mínimos de aptidão"
    tipo_dispensa: "Isenção (Incapaz C)"
    
  nao:
    proximo: P15_4
```

#### P15.4 - Doenças oculares graves

```yaml
id: P15_4
pergunta: "Você tem alguma dessas condições oculares?"
explicacao: |
  • Glaucoma
  • Descolamento de retina
  • Catarata avançada
  • Ceratocone
  • Estrabismo acentuado
  • Daltonismo grave
  • Outra doença ocular grave
tipo: sim_nao
categoria: visao

respostas:
  sim:
    resultado: FIM_PROVAVELMENTE_ISENTO
    razao: "Doenças oculares graves são causa de isenção"
    base_legal: "Anexo II do IGISC"
    tipo_dispensa: "Provável isenção"
    dica: "Leve laudo do oftalmologista detalhando sua condição"
    
  nao:
    proximo: P15_5
```

#### P15.5 - Grau médio

```yaml
id: P15_5
pergunta: "Seu grau é entre 3 e 6 dioptrias (miopia/hipermetropia/astigmatismo)?"
explicacao: "Grau médio, que corrige com óculos mas é significativo"
tipo: sim_nao
categoria: visao

respostas:
  sim:
    resultado: DICA_PODE_DISPENSAR
    instrucao: "Graus médios podem resultar em 'Incapaz B-2' (incluído no excesso de contingente). Leve seu laudo oftalmológico atualizado."
    proximo: P20
    
  nao:
    proximo: P20
```

---

### CATEGORIA 6.2: AUDIÇÃO

#### P20 - Problema de audição geral

```yaml
id: P20
pergunta: "Você tem algum problema de audição?"
explicacao: "Dificuldade pra ouvir, usa aparelho, qualquer coisa..."
tipo: sim_nao
categoria: audicao

respostas:
  sim:
    proximo: P20_1
    
  nao:
    proximo: P25
```

#### P20.1 - Surdez total

```yaml
id: P20_1
pergunta: "Você é TOTALMENTE surdo?"
explicacao: "Surdez total em ambos os ouvidos"
tipo: sim_nao
categoria: audicao

respostas:
  sim:
    resultado: FIM_ISENTO_C
    razao: "Surdez total é causa de isenção definitiva"
    base_legal: "Anexo II do IGISC"
    tipo_dispensa: "Isenção (Incapaz C)"
    
  nao:
    proximo: P20_2
```

#### P20.2 - Surdez unilateral

```yaml
id: P20_2
pergunta: "Você é surdo de UM ouvido? (surdez unilateral)"
tipo: sim_nao
categoria: audicao

respostas:
  sim:
    resultado: FIM_ISENTO_C
    razao: "Surdez unilateral profunda é incapacitante"
    base_legal: "Anexo II do IGISC"
    tipo_dispensa: "Isenção (Incapaz C)"
    
  nao:
    proximo: P20_3
```

#### P20.3 - Perda auditiva significativa

```yaml
id: P20_3
pergunta: "Você tem perda auditiva significativa ou usa aparelho auditivo?"
tipo: sim_nao
categoria: audicao

respostas:
  sim:
    resultado: FIM_PROVAVELMENTE_ISENTO
    razao: "Deficiência auditiva significativa é incapacitante"
    base_legal: "Anexo II do IGISC"
    dica: "Leve audiometria atualizada"
    
  nao:
    proximo: P25
```

---

### CATEGORIA 6.3: SAÚDE MENTAL

#### P25 - Problema de saúde mental geral

```yaml
id: P25
pergunta: "Você tem ou já teve algum problema de saúde mental?"
explicacao: "Depressão, ansiedade, TDAH, qualquer diagnóstico psiquiátrico... Sem julgamento, é só pra saber se você pode ser dispensado"
tipo: sim_nao
categoria: saude_mental

respostas:
  sim:
    proximo: P25_1
    
  nao:
    proximo: P30
```

#### P25.1 - Transtornos graves

```yaml
id: P25_1
pergunta: "Você tem algum desses diagnósticos GRAVES?"
explicacao: |
  • Esquizofrenia
  • Transtorno Bipolar
  • Transtorno de Personalidade grave
  • Psicose
  • Depressão grave/recorrente
  • Transtorno de estresse pós-traumático grave
  • Dependência química (drogas/álcool) em tratamento
tipo: sim_nao
categoria: saude_mental

respostas:
  sim:
    resultado: FIM_ISENTO_C
    razao: "Transtornos mentais graves são causa de isenção definitiva"
    base_legal: "Anexo II do IGISC + Art. 109 Decreto 57.654"
    tipo_dispensa: "Isenção (Incapaz C)"
    dica: "Leve laudo psiquiátrico detalhado com CID"
    
  nao:
    proximo: P25_2
```

#### P25.2 - Transtornos moderados

```yaml
id: P25_2
pergunta: "Você tem algum desses diagnósticos?"
explicacao: |
  • Depressão (leve/moderada)
  • Ansiedade generalizada
  • Síndrome do pânico
  • TOC (Transtorno Obsessivo-Compulsivo)
  • TDAH
  • Autismo/Asperger
tipo: sim_nao
categoria: saude_mental

respostas:
  sim:
    resultado: DICA_PODE_DISPENSAR
    instrucao: "Transtornos moderados podem resultar em dispensa. Leve laudo psiquiátrico/psicológico atualizado detalhando como a condição afeta sua vida."
    proximo: P30
    
  nao:
    proximo: P30
```

---

### CATEGORIA 6.4: SISTEMA NERVOSO

#### P30 - Problema neurológico geral

```yaml
id: P30
pergunta: "Você tem algum problema neurológico?"
explicacao: "Epilepsia, convulsões, problemas de coordenação, tremores..."
tipo: sim_nao
categoria: neurologico

respostas:
  sim:
    proximo: P30_1
    
  nao:
    proximo: P35
```

#### P30.1 - Condições neurológicas graves

```yaml
id: P30_1
pergunta: "Você tem alguma dessas condições?"
explicacao: |
  • Epilepsia (qualquer tipo)
  • Esclerose múltipla
  • Doença de Parkinson
  • Paralisia cerebral
  • Paralisia de qualquer tipo
  • AVC (sequelas)
  • Tumor cerebral (atual ou tratado)
tipo: sim_nao
categoria: neurologico

respostas:
  sim:
    resultado: FIM_ISENTO_C
    razao: "Doenças neurológicas graves são causa de isenção definitiva"
    base_legal: "Anexo II do IGISC"
    tipo_dispensa: "Isenção (Incapaz C)"
    
  nao:
    proximo: P30_2
```

#### P30.2 - Outras condições neurológicas

```yaml
id: P30_2
pergunta: "Você tem enxaqueca severa/crônica ou outros problemas neurológicos?"
tipo: sim_nao
categoria: neurologico

respostas:
  sim:
    resultado: DICA_PODE_DISPENSAR
    instrucao: "Condições neurológicas moderadas podem resultar em dispensa dependendo da avaliação."
    proximo: P35
    
  nao:
    proximo: P35
```

---

### CATEGORIA 6.5: SISTEMA CARDIOVASCULAR

#### P35 - Problema cardiovascular geral

```yaml
id: P35
pergunta: "Você tem algum problema no coração ou circulação?"
explicacao: "Sopro, arritmia, pressão alta, varizes graves..."
tipo: sim_nao
categoria: cardiovascular

respostas:
  sim:
    proximo: P35_1
    
  nao:
    proximo: P40
```

#### P35.1 - Condições cardiovasculares graves

```yaml
id: P35_1
pergunta: "Você tem alguma dessas condições?"
explicacao: |
  • Cardiopatia grave (doença cardíaca séria)
  • Insuficiência cardíaca
  • Arritmia grave
  • Marcapasso/desfibrilador implantado
  • Infarto (histórico)
  • Doença de Chagas com comprometimento cardíaco
tipo: sim_nao
categoria: cardiovascular

respostas:
  sim:
    resultado: FIM_ISENTO_C
    razao: "Cardiopatia grave é causa de isenção definitiva"
    base_legal: "Anexo II do IGISC + Lei 6.880/80, Art. 108"
    tipo_dispensa: "Isenção (Incapaz C)"
    
  nao:
    proximo: P35_2
```

#### P35.2 - Condições cardiovasculares moderadas

```yaml
id: P35_2
pergunta: "Você tem alguma dessas condições?"
explicacao: |
  • Hipertensão (pressão alta) - mesmo controlada com remédio
  • Sopro cardíaco
  • Arritmia leve/moderada
  • Varizes significativas
tipo: sim_nao
categoria: cardiovascular

respostas:
  sim:
    resultado: DICA_PODE_DISPENSAR
    instrucao: "Pressão alta não controlada ou com complicações pode gerar dispensa. Leve laudo cardiológico."
    proximo: P40
    
  nao:
    proximo: P40
```

---

### CATEGORIA 6.6: SISTEMA RESPIRATÓRIO

#### P40 - Problema respiratório geral

```yaml
id: P40
pergunta: "Você tem algum problema respiratório?"
explicacao: "Asma, bronquite, falta de ar, rinite grave..."
tipo: sim_nao
categoria: respiratorio

respostas:
  sim:
    proximo: P40_1
    
  nao:
    proximo: P45
```

#### P40.1 - Condições respiratórias graves

```yaml
id: P40_1
pergunta: "Você tem alguma dessas condições?"
explicacao: |
  • Asma moderada a grave
  • Fibrose pulmonar
  • DPOC (Doença Pulmonar Obstrutiva Crônica)
  • Tuberculose ativa ou com sequelas graves
  • Pneumonia recorrente
  • Bronquiectasia
tipo: sim_nao
categoria: respiratorio

respostas:
  sim:
    resultado: FIM_ISENTO_C
    razao: "Doenças respiratórias graves são causa de isenção"
    base_legal: "Anexo II do IGISC"
    tipo_dispensa: "Isenção (Incapaz C)"
    dica: "Leve espirometria e laudo pneumológico"
    
  nao:
    proximo: P40_2
```

#### P40.2 - Condições respiratórias leves

```yaml
id: P40_2
pergunta: "Você tem asma leve, bronquite ou rinite alérgica severa?"
tipo: sim_nao
categoria: respiratorio

respostas:
  sim:
    resultado: DICA_PODE_DISPENSAR
    instrucao: "Asma leve pode resultar em Incapaz B. Leve laudo e histórico de crises."
    proximo: P45
    
  nao:
    proximo: P45
```

---

### CATEGORIA 6.7: SISTEMA OSTEOMUSCULAR

#### P45 - Problema osteomuscular geral

```yaml
id: P45
pergunta: "Você tem algum problema nos ossos, músculos ou articulações?"
explicacao: "Problema de coluna, joelho, pé, braço... qualquer coisa ortopédica"
tipo: sim_nao
categoria: osteomuscular

respostas:
  sim:
    proximo: P45_1
    
  nao:
    proximo: P50
```

#### P45.1 - Amputação

```yaml
id: P45_1
pergunta: "Você tem alguma amputação?"
explicacao: "Falta de membro ou parte de membro - dedo, mão, pé, perna..."
tipo: sim_nao
categoria: osteomuscular

respostas:
  sim:
    resultado: FIM_ISENTO_C
    razao: "Amputações são causa de isenção definitiva"
    base_legal: "Anexo II do IGISC"
    tipo_dispensa: "Isenção (Incapaz C)"
    
  nao:
    proximo: P45_2
```

#### P45.2 - Problemas de coluna graves

```yaml
id: P45_2
pergunta: "Você tem alguma dessas condições de COLUNA?"
explicacao: |
  • Escoliose grave (acima de 40°)
  • Cifose grave
  • Lordose grave
  • Hérnia de disco grave
  • Espondiloartrose anquilosante
tipo: sim_nao
categoria: osteomuscular

respostas:
  sim:
    resultado: FIM_ISENTO_C
    razao: "Deformidades graves de coluna são causa de isenção"
    base_legal: "Anexo II do IGISC"
    tipo_dispensa: "Isenção (Incapaz C)"
    
  nao:
    proximo: P45_3
```

#### P45.3 - Outras condições ortopédicas

```yaml
id: P45_3
pergunta: "Você tem alguma dessas condições?"
explicacao: |
  • Artrite reumatoide
  • Artrose grave
  • Luxação recorrente (ombro, joelho...)
  • Fratura mal consolidada
  • Tendinite crônica grave
  • Lesão de ligamento grave (LCA, etc.)
tipo: sim_nao
categoria: osteomuscular

respostas:
  sim:
    resultado: FIM_PROVAVELMENTE_ISENTO
    razao: "Doenças osteomusculares graves são incapacitantes"
    base_legal: "Anexo II do IGISC"
    dica: "Leve raio-X, ressonância e laudo ortopédico"
    
  nao:
    proximo: P45_4
```

#### P45.4 - Pé plano

```yaml
id: P45_4
pergunta: "Você tem PÉ PLANO (pé chato)?"
explicacao: "Aquele pé que não tem curva, pisa todo no chão"
tipo: sim_nao
categoria: osteomuscular

respostas:
  sim:
    proximo: P45_4_1
    
  nao:
    proximo: P45_5
```

#### P45.4.1 - Grau do pé plano

```yaml
id: P45_4_1
pergunta: "É pé plano de 3º grau (grave)?"
explicacao: "Seu médico ou podólogo pode te dizer o grau. Se você tem dor ou dificuldade pra andar/correr, provavelmente é"
tipo: sim_nao
categoria: osteomuscular

respostas:
  sim:
    resultado: FIM_ISENTO_C
    razao: "Pé plano de 3º grau é causa de isenção"
    base_legal: "Anexo III do IGISC"
    tipo_dispensa: "Isenção (Incapaz C)"
    
  nao:
    resultado: DICA_PODE_DISPENSAR
    instrucao: "Pé plano leve/moderado pode resultar em dispensa dependendo da avaliação."
    proximo: P45_5
```

#### P45.5 - Problemas de coluna leves

```yaml
id: P45_5
pergunta: "Você tem escoliose, cifose ou lordose LEVE/MODERADA?"
tipo: sim_nao
categoria: osteomuscular

respostas:
  sim:
    resultado: DICA_PODE_DISPENSAR
    instrucao: "Leve raio-X de coluna com medição do ângulo"
    proximo: P50
    
  nao:
    proximo: P50
```

---

### CATEGORIA 6.8: ALTURA E PESO

#### P50.1 - Altura mínima

```yaml
id: P50_1
pergunta: "Você tem MENOS de 1,55m de altura?"
tipo: sim_nao
categoria: altura_peso

respostas:
  sim:
    resultado: FIM_ISENTO_C
    razao: "Altura inferior ao mínimo exigido"
    base_legal: "Anexo IV do IGISC - Tabela de altura/peso"
    tipo_dispensa: "Isenção (Incapaz C)"
    
  nao:
    proximo: P50_2
```

#### P50.2 - Altura máxima

```yaml
id: P50_2
pergunta: "Você tem MAIS de 2,00m de altura?"
tipo: sim_nao
categoria: altura_peso

respostas:
  sim:
    resultado: DICA_PODE_DISPENSAR
    instrucao: "Altura excessiva pode limitar incorporação em algumas unidades. Será avaliado caso a caso."
    proximo: P50_3
    
  nao:
    proximo: P50_3
```

#### P50.3 - Obesidade

```yaml
id: P50_3
pergunta: "Você é considerado obeso?"
explicacao: "IMC acima de 30. Calcule: seu peso ÷ (altura × altura)"
tipo: sim_nao
categoria: altura_peso

respostas:
  sim:
    proximo: P50_3_1
    
  nao:
    proximo: P50_4
```

#### P50.3.1 - Obesidade mórbida

```yaml
id: P50_3_1
pergunta: "Você tem obesidade MÓRBIDA? (IMC acima de 40)"
tipo: sim_nao
categoria: altura_peso

respostas:
  sim:
    resultado: FIM_ISENTO_C
    razao: "Obesidade mórbida é causa de isenção"
    base_legal: "Anexo II e III do IGISC"
    tipo_dispensa: "Isenção (Incapaz C)"
    
  nao:
    resultado: DICA_PODE_DISPENSAR
    instrucao: "Obesidade grau I-II pode resultar em Incapaz B"
    proximo: P50_4
```

#### P50.4 - Baixo peso

```yaml
id: P50_4
pergunta: "Você está muito abaixo do peso? (IMC abaixo de 18)"
tipo: sim_nao
categoria: altura_peso

respostas:
  sim:
    resultado: DICA_PODE_DISPENSAR
    instrucao: "Desnutrição/baixo peso pode resultar em dispensa temporária (Incapaz B)"
    proximo: P55
    
  nao:
    proximo: P55
```

---

### CATEGORIA 6.9: DOENÇAS INFECCIOSAS E CRÔNICAS

#### P55 - Doença infecciosa/crônica geral

```yaml
id: P55
pergunta: "Você tem ou já teve alguma doença infecciosa ou crônica grave?"
tipo: sim_nao
categoria: infecciosas_cronicas

respostas:
  sim:
    proximo: P55_1
    
  nao:
    proximo: P60
```

#### P55.1 - Doenças infecciosas graves

```yaml
id: P55_1
pergunta: "Você tem alguma dessas condições?"
explicacao: |
  • HIV/AIDS
  • Hepatite B ou C crônica
  • Tuberculose ativa
  • Hanseníase (Lepra)
  • Doença de Chagas
  • Sífilis não tratada
  • Malária recorrente
tipo: sim_nao
categoria: infecciosas_cronicas

respostas:
  sim:
    resultado: FIM_ISENTO_C
    razao: "Doenças infecciosas graves são causa de isenção"
    base_legal: "Anexo II do IGISC"
    tipo_dispensa: "Isenção (Incapaz C)"
    
  nao:
    proximo: P55_2
```

#### P55.2 - Doenças crônicas

```yaml
id: P55_2
pergunta: "Você tem alguma dessas condições crônicas?"
explicacao: |
  • Diabetes (qualquer tipo)
  • Lúpus
  • Doença renal crônica
  • Doença hepática crônica
  • Câncer (atual ou tratado)
  • Doença inflamatória intestinal (Crohn, colite)
  • Psoríase grave
  • Hemofilia ou problemas de coagulação
tipo: sim_nao
categoria: infecciosas_cronicas

respostas:
  sim:
    resultado: FIM_PROVAVELMENTE_ISENTO
    razao: "Doenças crônicas graves são incapacitantes para o serviço militar"
    base_legal: "Anexo II do IGISC"
    dica: "Leve todos os laudos e histórico médico"
    
  nao:
    proximo: P60
```

---

### CATEGORIA 6.10: OUTRAS CONDIÇÕES

#### P60 - Outras condições

```yaml
id: P60
pergunta: "Você tem alguma outra condição que não foi mencionada?"
explicacao: |
  • Alergia grave (anafilaxia)
  • Problemas de fala graves (gagueira severa, mutismo)
  • Incontinência urinária/fecal
  • Hérnia (inguinal, umbilical...)
  • Varicocele
  • Hidrocele
  • Qualquer outra condição que você acha relevante
tipo: sim_nao
categoria: outras

respostas:
  sim:
    resultado: DICA_AVALIACAO_INDIVIDUAL
    instrucao: "Muitas condições não listadas também podem gerar dispensa. Leve toda documentação médica para a seleção e explique como a condição afeta sua capacidade física."
    proximo: RESULTADO_FINAL
    
  nao:
    proximo: RESULTADO_FINAL
```

---

## RESULTADO FINAL

```yaml
id: RESULTADO_FINAL
tipo: resultado
condicao: "Chegou até aqui sem dispensa definitiva"

texto: |
  📋 RESULTADO: VOCÊ PROVAVELMENTE TERÁ QUE SE ALISTAR
  
  Mas calma! Isso não significa que você VAI servir. Lembre-se:
  
  1. 📊 EXCESSO DE CONTINGENTE
     Apenas ~7% dos alistados são incorporados (cerca de 80 mil de 1,1 milhão).
     A grande maioria é dispensada por "excesso de contingente".
  
  2. 🗣️ NA ENTREVISTA
     Quando perguntarem "Você quer servir?", você pode dizer "NÃO".
     Isso é registrado e conta contra sua convocação.
  
  3. 📅 DATAS ESTRATÉGICAS
     Se alistar no final do período pode ajudar (menos vagas disponíveis).
  
  4. 🏙️ LOCALIZAÇÃO
     Cidades grandes têm mais candidatos por vaga = mais chance de excesso.
  
  5. 📝 LEVE TODA DOCUMENTAÇÃO
     Mesmo condições leves podem ajudar. Leve TUDO que tiver.
  
  ---
  
  BOA SORTE! 🍀
  
  Se precisar de ajuda jurídica com objeção de consciência, 
  procure a organização LIVRES: https://livres.org.br/

recursos_uteis:
  - nome: "LIVRES - Objeção de Consciência"
    url: "https://livres.org.br/"
  - nome: "Alistamento Online"
    url: "https://alistamento.eb.mil.br/"
  - nome: "Decreto 57.654/1966 (RLSM)"
    url: "https://www.planalto.gov.br/ccivil_03/decreto/D57654.htm"
```

---

## ANEXO: TIPOS DE RESULTADO

| Código | Descrição | Documento |
|--------|-----------|-----------|
| `FIM_DISPENSADA` | Mulher - não precisa se alistar | Nenhum |
| `FIM_DISPENSADO` | Dispensado de incorporação | Certificado de Dispensa de Incorporação (CDI) |
| `FIM_ISENTO_C` | Isenção por incapacidade definitiva | Certificado de Isenção (CI) |
| `FIM_ADIAMENTO` | Adiamento de incorporação | CAM com anotação de adiamento |
| `FIM_EXCESSO_CONTINGENTE` | Incluído no excesso | Certificado de Dispensa de Incorporação (CDI) |
| `FIM_OBJECAO_CONSCIENCIA` | Dispensa por objeção | Certificado de Dispensa de Incorporação (CDI) |
| `FIM_DISPENSADO_ARRIMO` | Dispensa por arrimo de família | Certificado de Dispensa de Incorporação (CDI) |
| `FIM_PROVAVELMENTE_ISENTO` | Alta chance de isenção (precisa comprovar) | Depende da avaliação |
| `DICA_PODE_DISPENSAR` | Possibilidade de dispensa (não garantido) | Depende da avaliação |
| `DICA_AVALIACAO_INDIVIDUAL` | Será avaliado caso a caso | Depende da avaliação |

---

## ANEXO: FLUXO VISUAL SIMPLIFICADO

```
INÍCIO
  │
  ├─[P1] Mulher cis? ──SIM──→ 🎉 DISPENSADA
  │      │
  │      NÃO
  │      ↓
  ├─[P2] Mulher trans? ──SIM──→ 🎉 DISPENSADA
  │      │
  │      NÃO
  │      ↓
  ├─[P3] Homem trans? ──SIM──→ 🎉 DISPENSADO
  │      │
  │      NÃO
  │      ↓
  ├─[P4] +30 anos? ──SIM──→ 🎉 EXCESSO CONTINGENTE
  │      │
  │      NÃO
  │      ↓
  ├─[P5-P7] LOCALIZAÇÃO ──dispensa──→ 🎉 FIM
  │      │
  │      não dispensa
  │      ↓
  ├─[P8] ARRIMO FAMÍLIA ──dispensa──→ 🎉 FIM
  │      │
  │      não dispensa
  │      ↓
  ├─[P9-P11] RELIGIÃO/CONSCIÊNCIA ──dispensa──→ 🎉 FIM
  │      │
  │      não dispensa
  │      ↓
  ├─[P12-P14] EDUCAÇÃO/PROFISSÃO ──dispensa──→ 🎉 FIM
  │      │
  │      não dispensa
  │      ↓
  ├─[P15-P60] CONDIÇÕES MÉDICAS ──dispensa──→ 🎉 FIM
  │      │
  │      não dispensa
  │      ↓
  └──→ RESULTADO FINAL (precisa se alistar, mas ~93% são dispensados por excesso)
```
