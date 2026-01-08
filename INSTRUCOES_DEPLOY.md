
# 🚀 Como colocar seu App em um Servidor

Seu aplicativo de **Planejamento de Produção** está pronto para ser hospedado. Como ele utiliza tecnologias modernas (React via ESM), você não precisa de um servidor "pesado".

## 1. Opção Recomendada: Vercel (Gratuito e Rápido)
1. Crie uma conta em [vercel.com](https://vercel.com).
2. Instale a Vercel CLI ou conecte seu repositório do GitHub.
3. Se for usar a pasta local:
   - Abra o terminal na pasta do projeto.
   - Digite `npx vercel`.
   - Siga as instruções e seu app estará online em 1 minuto.

## 2. Opção Netlify (Arrastar e Soltar)
1. Vá para [app.netlify.com](https://app.netlify.com).
2. Faça login.
3. Simplesmente arraste a pasta onde estão os arquivos (`index.html`, `App.tsx`, etc.) para a área de "Deploy".
4. O Netlify lhe dará um link público na hora.

## 3. Arquivos Necessários
Certifique-se de que os seguintes arquivos estejam na raiz do servidor:
- `index.html`
- `index.tsx`
- `App.tsx`
- `types.ts`
- `constants.ts`
- `utils.ts`
- Pasta `components/` com seus arquivos `.tsx`

## 4. Banco de Dados (Nuvem)
Atualmente, o app salva os dados no **LocalStorage** do navegador. 
- **Vantagem:** Funciona offline e é instantâneo.
- **Limitação:** Os dados ficam apenas no aparelho onde foram digitados.
- **Solução:** Use o novo botão **"Exportar Backup"** na aba de Registros para mover dados entre aparelhos.

Para uma nuvem real compartilhada (ex: várias pessoas acessando os mesmos dados), recomendamos integrar o **Supabase** (Banco de Dados SQL gratuito).
