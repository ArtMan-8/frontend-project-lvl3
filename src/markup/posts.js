export default function postsMarkup(posts, i18nextInstance) {
  return `<div class="card border-0">
  <div class="card-body">
    <h2 class="card-title h4">${i18nextInstance.t('posts')}</h2>
  </div>

  <ul class="list-group border-0 rounded-0">
  ${posts
    .map(
      ({ link, title, watched }) => `
  <li
    class="
      list-group-item
      d-flex
      justify-content-between
      align-items-start
      border-0 border-end-0
    "
    data-title="${title}"
  >
    <a
      href="${link}"
      class="${watched ? 'fw-normal' : 'fw-bold'}"
      target="_blank"
      rel="noopener noreferrer"
      >${title}</a
    ><button
      type="button"
      class="btn btn-outline-primary btn-sm"
      data-bs-toggle="modal"
      data-bs-target="#modal"
    >
    ${i18nextInstance.t('buttons.view')}
    </button>
  </li>
  `,
    )
    .join('')}
</ul>
</div>`;
}
