let { onCommand, loadLanguage, githubStalk } = require('../main/');
let { github_desc, repo_desc, need_un, invalid_un, need_repo, invalid_repo } = loadLanguage();

onCommand(
  {
   command: 'github',
   desc: github_desc,
   category: ['misc']
  }, async (msg, text, client) => {

  if (!text[1]) return await msg.reply(need_un);
  text[1] = text[1].startsWith('@') ? text[1].slice(1) : text[1];
  try {
   let info = await githubStalk('user', text[1]);
   let { username, name, bio, id, location, email, url, pp, profileUrl, followers, following, ropos, gists, hireable, created } = info
   let caption = `_GitHub Username_ : *${username.github}*${name !== false ? `\n_Name_ : *${name}*` : ''}${bio !== false ? `\n_Biography_ : *${bio}*` : ''}\n_ID_ : *${id}*${location !== false ? `\n_Location_ : *${location}*` : ''}${email !== false ? `\n_Email_ : *${email}*` : ''}${url.blog == false ? '' : `\n_Blog URL_ : *${url.blog}*`}${username.twitter == false ? '' : `\n_Twitter Username_ : *${username.twitter}*`}${url.twitter !== false ? `\n_Twitter URL_ : *${url.twitter}*` : ''}\n_Followers_ : *${followers}*\n_Following_ : *${following}*\n_Repositories_ : *${ropos}*\n_Gists_ : *${gists}*\n_Hireable_ : *${hireable == true ? 'Yes' : 'No'}*\n_Created_ : *${created}*`;
   return await client.sendReply({ type: 'image', message: { url: pp }, caption });
  } catch {
   return await msg.reply(invalid_un);
  }
});

onCommand(
  {
   command: 'repo',
   desc: repo_desc,
   category: ['misc']
  }, async (msg, text, client) => {

  if (!text[1]) return await msg.reply(need_repo);
  let info = await githubStalk('repository', text[1]);
  if (!info) return await msg.reply(invalid_repo);
  let { name, id, owner, desc, homepage, stars, language, forks, archived, opened_issues, license, visibility, default_branch, topics, url } = info
  info = `_Name_ : *${name}*\n_ID_ : *${id}*${desc !== false ? `\n_Description_ : *${desc}*` : ''}\n_Visibility_ : *${visibility}*${topics.length < 1 ? '' : `\n_Topics_ : *${topics.join(', ')}*`}\n_Forks_ : *${forks}*\n_Stars_ : *${stars}*${homepage == false ? '' : `\n_Homepage_ : *${homepage}*`}${language !== false ? `\n_Language_ : *${language}*` : ''}\n_Opened Issues_ : *${opened_issues}*\n_Archived_ : ${archived == true ? '*Yes*' : '*No*'}${license !== false ? '\n_License_ : *'+license+'*' : ''}\n_Default Branch_ : *${default_branch}*\n_Developer_ : *${owner}*\n_URL_ : *${url}*`
  return await msg.reply(info);
});
