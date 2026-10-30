export type Social = { instagram?: string; youtube?: string; tiktok?: string; linkedin?: string; site?: string };
export type Video = { title: string; duration: string; url: string | null };

export const media: Record<string, { social: Social; videos: Video[] }> = {
  "ana-paula-ribeiro": {
    social: { instagram: "fono.anapaula.demo", youtube: "anapaulafono-demo", tiktok: "fono.anapaula.demo", site: "anapaulafono.demo.com.br" },
    videos: [
      { title: "Quem sou e como trabalho", duration: "1:48", url: null },
      { title: "PECS em casa: primeiros passos", duration: "6:12", url: null },
      { title: "Quando procurar um fono?", duration: "3:05", url: null },
    ],
  },
  "rafael-moura": {
    social: { instagram: "rafael.aba.demo", youtube: "rafaelmoura-aba-demo", linkedin: "rafael-moura-demo" },
    videos: [
      { title: "ABA sem mitos", duration: "12:40", url: null },
      { title: "Orientação parental: rotina e birra", duration: "8:21", url: null },
    ],
  },
  "juliana-tanaka": {
    social: { instagram: "to.julianatanaka.demo", tiktok: "to.sensorial.demo" },
    videos: [{ title: "Tour pela sala sensorial", duration: "2:10", url: null }],
  },
  "carlos-eduardo-lima": { social: { linkedin: "carlos-lima-neuroped-demo", site: "clinicaneurokids.demo.com.br" }, videos: [] },
  "marina-castro": {
    social: { instagram: "marina.psicoped.demo", youtube: "marinacastro-demo" },
    videos: [{ title: "Sinais de dislexia na alfabetização", duration: "5:33", url: null }],
  },
  "beatriz-nogueira": {
    social: { instagram: "bea.neuropsi.demo", youtube: "beatriznogueira-demo", linkedin: "beatriz-nogueira-demo", site: "beatriznogueira.demo.com.br" },
    videos: [
      { title: "Como é uma avaliação neuropsicológica", duration: "4:50", url: null },
      { title: "Autismo em mulheres adultas", duration: "15:02", url: null },
    ],
  },
  "thiago-santos": { social: { instagram: "thiago.at.demo" }, videos: [] },
  "luciana-ferraz": {
    social: { instagram: "lu.musicoterapia.demo", youtube: "lucianaferraz-demo" },
    videos: [{ title: "Música e regulação emocional", duration: "3:41", url: null }],
  },
  "fernanda-alves": { social: { linkedin: "fernanda-alves-psiq-demo" }, videos: [] },
  "gabriel-rocha": { social: { instagram: "gabriel.fisioped.demo" }, videos: [] },
};
