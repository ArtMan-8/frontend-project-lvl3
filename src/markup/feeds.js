export default function feedsMarkup(feeds, i18nextInstance) {
  return `<div class="card border-0">
  <div class="card-body">
    <h2 class="card-title h4">${i18nextInstance.t('feeds')}</h2>
  </div>

  <ul class="list-group border-0 rounded-0">
    ${feeds
    .map(
      ({
        url,
        title,
        description,
      }) => `<li class="list-group-item border-0 border-end-0" data-url="${url}">
        <h3 class="h6 m-0">${title}</h3>
        <p class="m-0 small text-black-50">
        ${description}
        </p>
      </li>`,
    )
    .join('')}    
  </ul>
</div>`;
}
