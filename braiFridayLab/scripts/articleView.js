'use strict';

let articleView = {};

articleView.populateFilters = () => {
  $('article').each(function() {
    if (!$(this).hasClass('template')) {
      let val = $(this).find('address a').text();
      let optionTag = `<option value="${val}">${val}</option>`;

      if ($(`#author-filter option[value="${val}"]`).length === 0) {
        $('#author-filter').append(optionTag);
      }

      val = $(this).attr('data-category');
      optionTag = `<option value="${val}">${val}</option>`;
      if ($(`#category-filter option[value="${val}"]`).length === 0) {
        $('#category-filter').append(optionTag);
      }
    }
  });
};

articleView.handleAuthorFilter = () => {
  $('#author-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $(`article[data-author="${$(this).val()}"]`).fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#category-filter').val('');
  });
};

articleView.handleCategoryFilter = () => {
  $('#category-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $(`article[data-category="${$(this).val()}"]`).fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#author-filter').val('');
  });
};

articleView.handleMainNav = () => {
  $('nav').on('click', '.tab', function(e) {
    e.preventDefault();
    $('.tab-content').hide();
    $(`#${$(this).data('content')}`).fadeIn();
  });

  $('nav .tab:first').click();
};

articleView.setTeasers = () => {
  $('.article-body *:nth-of-type(n+2)').hide();
  $('article').on('click', 'a.read-on', function(e) {
    e.preventDefault();
    if ($(this).text() === 'Read on →') {
      $(this).parent().find('*').fadeIn();
      $(this).html('Show Less &larr;');
    } else {
      $('body').animate({
        scrollTop: ($(this).parent().offset().top)
      },200);
      $(this).html('Read on &rarr;');
      $(this).parent().find('.article-body *:nth-of-type(n+2)').hide();
    }
  });
};

// COMMENT: Where is this function called? Why?
// On the new.html page, because this renders the new page to load.
articleView.initNewArticlePage = () => {
  $('.tab-content').show();
  articleView.create();

  $('#article-json').on('focus', function(){
    this.select();
  });

  // TODO: Add an event handler to update the preview and the export field if any inputs change.
  $('form').on('change', 'input, textarea', articleView.create);

};

articleView.create = () => {
  let article = {};

  $('#articles').html('');

  let post= new Article({
    author: $('#author').val(),
    authorUrl: $('#authorUrl').val(),
    title: $('#title').val(),
    category: $('category').val(),
    body: $('#body').val(),
    publishedOn: $('#article-published:checked').length ? new Date() : null,
  });

  // TODO: Instantiate an article based on what's in the form fields:
  // let post = new Article(article);
  // article.title = $('#title').val();
  // article.author = $('#author').val();
  // article.category = $('#category').val();
  // article.authorUrl =$('#authorUrl').val();
  // article.body = $('#body').val();
  // console.log(article);

  

  $('#articles').html( post.toHtml() );

  $('pre code').each();
  $('pre code').each(function(i, block){
    hljs.highlightBlock(block);
  })
  // TODO: Show our export field, and export the new article as JSON, so it's ready to copy/paste into blogArticles.js:
  $('#export-container').show();
  $('#article-json').val(JSON).val(JSON.stringify(article) + ',');

};

// COMMENT: Where is this function called? Why?
// On the index.html, this is loading everything on top the page when loaded. 
articleView.initIndexPage = () => {
  articles.forEach(article => $('#articles').append(article.toHtml()));
  articleView.populateFilters();
  articleView.handleCategoryFilter();
  articleView.handleAuthorFilter();
  articleView.handleMainNav();
  articleView.setTeasers();
};

