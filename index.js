const nodemailer = require('nodemailer')
const cron = require('node-cron')

// ==========================
// CONFIG EMAIL
// ==========================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'arquitetos.adm@gmail.com',
    pass: 'As.21041960'
  }
})

// ==========================
// EMAILS
// ==========================
const emails = {
  Felipe: 'felipesaraiva.arq@gmail.com',
  Carol: 'arquitetacarolinacunha@gmail.com',
  Bruno: 'bcaetano.arquitetura@gmail.com',
  Wilson: 'wilsonromao.arq@gmail.com',
  Tales: 'talesrsarq@gmail.com',
  Rafa: 'rafaelacunhaarquitetura@gmail.com'
}

// ==========================
// CALENDÁRIO FIXO COMPLETO
// ==========================
const calendario = [
  // ================= JUNHO =================
  { mes: 6, semana: 1, lixo: ['Felipe','Carol','Bruno','Wilson','Tales'], louca: 'Rafa' },
  { mes: 6, semana: 2, lixo: ['Rafa','Felipe','Carol','Bruno','Wilson'], louca: 'Tales' },
  { mes: 6, semana: 3, lixo: ['Tales','Rafa','Felipe','Carol','Bruno'], louca: 'Wilson' },
  { mes: 6, semana: 4, lixo: ['Wilson','Tales','Rafa','Felipe','Carol'], louca: 'Bruno' },

  // ================= JULHO =================
  { mes: 7, semana: 1, lixo: ['Bruno','Wilson','Tales','Rafa','Felipe'], louca: 'Carol' },
  { mes: 7, semana: 2, lixo: ['Carol','Bruno','Wilson','Tales','Rafa'], louca: 'Felipe' },
  { mes: 7, semana: 3, lixo: ['Felipe','Carol','Bruno','Wilson','Tales'], louca: 'Rafa' },
  { mes: 7, semana: 4, lixo: ['Rafa','Felipe','Carol','Bruno','Wilson'], louca: 'Tales' },
  { mes: 7, semana: 5, lixo: ['Tales','Rafa','Felipe','Carol','Bruno'], louca: 'Wilson' },

  // ================= AGOSTO =================
  { mes: 8, semana: 1, lixo: ['Wilson','Tales','Rafa','Felipe','Carol'], louca: 'Bruno' },
  { mes: 8, semana: 2, lixo: ['Bruno','Wilson','Tales','Rafa','Felipe'], louca: 'Carol' },
  { mes: 8, semana: 3, lixo: ['Carol','Bruno','Wilson','Tales','Rafa'], louca: 'Felipe' },
  { mes: 8, semana: 4, lixo: ['Felipe','Carol','Bruno','Wilson','Tales'], louca: 'Rafa' },

  // ================= SETEMBRO =================
  { mes: 9, semana: 1, lixo: ['Rafa','Felipe','Carol','Bruno','Wilson'], louca: 'Tales' },
  { mes: 9, semana: 2, lixo: ['Tales','Rafa','Felipe','Carol','Bruno'], louca: 'Wilson' },
  { mes: 9, semana: 3, lixo: ['Wilson','Tales','Rafa','Felipe','Carol'], louca: 'Bruno' },
  { mes: 9, semana: 4, lixo: ['Bruno','Wilson','Tales','Rafa','Felipe'], louca: 'Carol' },

  // ================= OUTUBRO =================
  { mes: 10, semana: 1, lixo: ['Carol','Bruno','Wilson','Tales','Rafa'], louca: 'Felipe' },
  { mes: 10, semana: 2, lixo: ['Felipe','Carol','Bruno','Wilson','Tales'], louca: 'Rafa' },
  { mes: 10, semana: 3, lixo: ['Rafa','Felipe','Carol','Bruno','Wilson'], louca: 'Tales' },
  { mes: 10, semana: 4, lixo: ['Tales','Rafa','Felipe','Carol','Bruno'], louca: 'Wilson' },

  // ================= NOVEMBRO =================
  { mes: 11, semana: 1, lixo: ['Wilson','Tales','Rafa','Felipe','Carol'], louca: 'Bruno' },
  { mes: 11, semana: 2, lixo: ['Bruno','Wilson','Tales','Rafa','Felipe'], louca: 'Carol' },
  { mes: 11, semana: 3, lixo: ['Carol','Bruno','Wilson','Tales','Rafa'], louca: 'Felipe' },
  { mes: 11, semana: 4, lixo: ['Felipe','Carol','Bruno','Wilson','Tales'], louca: 'Rafa' },

  // ================= DEZEMBRO =================
  { mes: 12, semana: 1, lixo: ['Rafa','Felipe','Carol','Bruno','Wilson'], louca: 'Tales' },
  { mes: 12, semana: 2, lixo: ['Tales','Rafa','Felipe','Carol','Bruno'], louca: 'Wilson' },
  { mes: 12, semana: 3, lixo: ['Wilson','Tales','Rafa','Felipe','Carol'], louca: 'Bruno' },
  { mes: 12, semana: 4, lixo: ['Bruno','Wilson','Tales','Rafa','Felipe'], louca: 'Carol' },
]

// ==========================
// FUNÇÃO PARA PEGAR SEMANA ATUAL
// ==========================
function getSemanaAtual() {
  const hoje = new Date()
  const mes = hoje.getMonth() + 1
  const dia = hoje.getDate()

  const semana = Math.ceil(dia / 7)

  return calendario.find(
    s => s.mes === mes && s.semana === semana
  )
}

// ==========================
// ENVIO EMAIL
// ==========================
async function enviar(email, assunto, texto) {
  await transporter.sendMail({
    from: 'Rodízio Escritório <SEUEMAIL@gmail.com>',
    to: email,
    subject: assunto,
    text: texto
  })
}

// ==========================
// 08H - LIXO
// ==========================
cron.schedule('0 8 * * 1-5', async () => {

  const semana = getSemanaAtual()
  if (!semana) return

  const hoje = new Date().getDay() // 0-6 (dom-sab)
  const indexDia = hoje - 1 // seg=0

  if (indexDia < 0 || indexDia > 4) return

  const responsavel = semana.lixo[indexDia]

  await enviar(
    emails[responsavel],
    '🚮 Lixo do Escritório - Hoje',
    `Bom dia!

Hoje você é responsável pelo LIXO do escritório.

Obrigado!`
  )

  console.log('Lixo enviado:', responsavel)
})

// ==========================
// 17H - LOUÇA
// ==========================
cron.schedule('0 17 * * 1-5', async () => {

  const semana = getSemanaAtual()
  if (!semana) return

  const responsavel = semana.louca

  await enviar(
    emails[responsavel],
    '🍽 Louça da Semana',
    `Boa tarde!

Você é responsável pela LOUÇA desta semana.

Obrigado!`
  )

  console.log('Louça enviada:', responsavel)
})

console.log('🚀 Robô rodando com calendário fixo')