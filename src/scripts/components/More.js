/**
 * Load more.
 *
 * @export
 * @class More
 */
export default class More {
  /**
   * Crée une instance de More.
   * @param {HTMLButtonElement} btn Bouton
   * @memberof More
   */
  constructor (btn) {
    // On stocke la référence au bouton.
    this.$btn = btn;
    // On initialise les comportements de l'instance.
    this.init();
  }

  /**
   * Initialisation.
   *
   * @memberof More
   */
  init () {
    // On assigne l'instance de More à la méthode `onClick`
    // et on récupère la "nouvelle méthode bindée".
    this.onClick = this.onClick.bind(this);
    // Gestion du click.
    this.$btn.addEventListener('click', this.onClick);
  }

  /**
   * Événement click.
   *
   * @memberof More
   */
  onClick () {
    // Désactiver le bouton.
    this.$btn.disabled = true;
    // Ajouter un feedback visuel indiquant qu'un chargement est en cours.
    // this.$btn.classList.toggle('is-loading');

    // On récupère l'id de l'article suivant.
    const next = parseInt(this.$btn.dataset.nextPost, 10);

    this
      // On récupère l'article suivant.
      .getPost(next)
      // Ensuite, on gère les données reçues (json).
      .then(data => {
        // On utilise le "callback" reçu via `onPostFetched` (qui retourne une promesse).
        this
          .onComplete(data)
          .then(() => {
            // Metre à jour l'id de l'article suivant.
            this.$btn.dataset.nextPost = next + 1;
            // Retirer le feedback visuel.
            // this.$btn.classList.toggle('is-loading');
            // Réactiver mon bouton
            this.$btn.disabled = false;
          });
      })
      // Gestion des éventuelles erreurs.
      .catch(err => {
        console.error('ERR', err);
      });
  }

  /**
   * Fetch d'un article.
   *
   * @param {number} id id de l'article
   * @returns {Promise<JSON>} données de l'article
   * @memberof More
   */
  getPost (id) {
    // URL de l'api + id de l'article.
    const url = `https://jsonplaceholder.typicode.com/posts/${id}`;

    // Fetch
    return window
      .fetch(url)
      .then(res => {
        // Si requête "ok" (=== status 200)
        if (res.ok) {
          // On retourne une promesse qui se résoudra avec les données au format JSON.
          // https://developer.mozilla.org/en-US/docs/Web/API/Body/json
          return res.json();
        }

        // Autre que "ok" (ex: 404),
        // on génère une erreur "custom".
        throw new Error(`Fetch problem [${res.status}]`);
      });
  }

  /**
   * Callback lorsque un article a été fetché.
   *
   * @param {Promise} cb callback
   * @memberof More
   */
  onPostFetched (cb) {
    this.onComplete = cb;
  }
}
