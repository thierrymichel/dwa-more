// Imports pour l'animation.
import { TimelineMax, Power4 } from 'gsap/TweenMax';
import ScrollToPlugin from 'gsap/ScrollToPlugin';// eslint-disable-line no-unused-vars
// Import du template Nunjucks.
// https://mozilla.github.io/nunjucks/
// On peut l'importer sans erreurs grâce à un loader (nunjucks-loader)
// Voir la config `webpack.mix.js` + `package.json`
import tpl from '../templates/post.njk';

/**
 * Gestion des articles.
 *
 * @export
 * @class Posts
 */
export default class Posts {
  /**
   * Crée une instance de Posts.
   * @param {HTMLElement} el conteneur des articles
   * @memberof Posts
   */
  constructor (el) {
    this.$el = el;
  }

  /**
   * Ajoute un nouvel article.
   *
   * @param {JSON} data données dynamiques de l'article
   * @returns {Promise} animation complète
   * @memberof Posts
   */
  append (data) {
    return new Promise(resolve => {
      // Les prend les données de l'article dont on a besoin dans le template.
      const { title, body, id } = data;
      // On parse le template avec les données.
      const html = tpl.render({
        title,
        body,
        id
      });

      // On utilise `<template>` pour générer un contenu "appendable" dans le page via une méthode du DOM.
      const postTemplate = document.createElement('template');

      // On passe le HTML à l'élément <template>.
      postTemplate.innerHTML = html;

      // On récupère `<article>` qui est le premier enfant de <template>.
      const post = postTemplate.content.firstChild;
      // On récupère les enfants directs pour l'animation (`picture` et `content`).
      const { children } = post;

      // Ajouter l'article au conteneur.
      this.$el.appendChild(post);

      // On fait une petite animation d'apparition
      // et on résoud la promesse à la fin.
      const tl = new TimelineMax({
        onComplete () {
          resolve();
        }
      });

      // Offset pour le scroll animé
      const y = document.body.offsetHeight - window.innerHeight;

      // A more "modern" way to scroll + animate
      // https://developer.mozilla.org/en-US/docs/Web/API/ScrollToOptions
      // window.scrollTo({
      //   behavior: 'smooth',
      //   left: 0,
      //   top: y
      // });

      tl
        .set(post, {
          height: 'auto'
        })
        .add('start')
        .from(post, 1, {
          height: 0,
          ease: Power4.easeOut
        }, 'start')
        .staggerFrom(children, 0.5, {
          opacity: 0,
          ease: Power4.easeOut
        }, 0.15, 'start')
        .to(window, 1, {
          scrollTo: {
            y,
            ease: Power4.easeInOut
          }
        }, 'start+=.15');
    });
  }
}
