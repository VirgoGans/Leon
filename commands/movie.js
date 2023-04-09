let { onCommand, loadLanguage, fetchJson } = require('../main/');
let { need_movie, unable_movie, movie_info, unknown } = loadLanguage();

onCommand(
  {
   command: 'movie',
   desc: 'search movie/series info',
   category: ['misc']
  }, async (msg, text, client) => {

  if (!text[1]) return await msg.reply(need_movie);
  let data = await fetchJson('https://www.omdbapi.com/?apikey=742b2d09&t='+text[1]);
  if (data.Response == 'False') return await msg.reply(unable_movie);
  let keys = ['Title', 'Year', 'Rated', 'Released', 'Runtime', 'Genre', 'Director', 'Writer', 'Actors', 'Language', 'Country', 'Awards', 'Poster', 'imdbRating', 'imdbVotes', 'DVD', 'Website'];
  data = keys.reduce((json, key) => {
   json[key] = (data[key] !== 'N/A') ? data[key] : unknown;
   return json;
  }, {});
  let caption = movie_info.format(data.Title, data.Year, data.Released, data.DVD, data.Rated, data.Runtime, data.Genre, data.Director, data.Writer, data.Actors, data.Language, data.Country, data.Awards, data.imdbRating, data.imdbVotes, data.Website);
  return await client.sendReply({ type: 'image', message: { url: data.Poster }, caption }).then(() => '')
   .catch(async (e) => await msg.reply(caption));
});
