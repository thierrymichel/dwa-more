// Import des modules (`export default`),
import More from './components/More';
import Posts from './components/Posts';

document.addEventListener('DOMContentLoaded', () => {
  console.info('🚀');
  // Création d'instances `more` et `posts`,
  const more = new More(document.querySelector('[data-component="more"]'));
  const posts = new Posts(document.querySelector('[data-component="posts"]'));

  // On passe à `more` une fonction utilisant un paramètre `data`
  // qui retourne le résultat de la méthode `append` de `posts` (promesse),
  more.onPostFetched((data) => posts.append(data));
});
